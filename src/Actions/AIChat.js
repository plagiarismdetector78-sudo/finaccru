import { toast } from "react-toastify";
import axios from "axios";
import { N8N_WEBHOOK_URL, N8N_AUTH_TOKEN } from "../constant/aiConstants";
import { getAuthConfig } from "../utils/authConfig";
import { auth } from "../firebase";

// Mock responses for development (Phase 1)
const generateMockAIResponse = (userMessage) => {
    const responses = {
        greeting: "Hello! I'm your AI Sales Assistant. I can help you create and manage sales documents like invoices, estimates, proforma invoices, credit notes, and receipts. I can also help you add and update customers. How can I assist you today?",
        invoice: "I can help you create a tax invoice. Could you provide me with the customer name and the items you'd like to include?",
        estimate: "I'll help you create an estimate. Which customer is this estimate for?",
        proforma: "I can create a proforma invoice for you. What's the customer name and what items would you like to include?",
        customer: "I'll help you with customer management. Would you like to add a new customer or update an existing one? Please provide the customer details.",
        payment: "I can help you record a payment receipt. Which customer made the payment and what's the amount?",
        creditNote: "I'll help you create a credit note. Which customer is this for and what's the reason for the credit?",
        modify: "I can help you modify an existing document. Please specify which document you'd like to update (invoice, estimate, customer, etc.) and what changes you need.",
        default: "I understand you need help. I can assist you with creating or modifying invoices, estimates, proforma invoices, credit notes, receipts, and customer records. What would you like to do?",
    };

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return responses.greeting;
    } else if (lowerMessage.includes('tax invoice') || lowerMessage.includes('invoice')) {
        return responses.invoice;
    } else if (lowerMessage.includes('estimate') || lowerMessage.includes('quote')) {
        return responses.estimate;
    } else if (lowerMessage.includes('proforma')) {
        return responses.proforma;
    } else if (lowerMessage.includes('customer') || lowerMessage.includes('client')) {
        return responses.customer;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('receipt')) {
        return responses.payment;
    } else if (lowerMessage.includes('credit note') || lowerMessage.includes('credit')) {
        return responses.creditNote;
    } else if (lowerMessage.includes('modify') || lowerMessage.includes('update') || lowerMessage.includes('edit') || lowerMessage.includes('change')) {
        return responses.modify;
    } else {
        return responses.default;
    }
};

// Toggle AI Chat Drawer
export const toggleAIChat = () => (dispatch) => {
    dispatch({ type: "ToggleAIChat" });
};

// Open AI Chat Drawer
export const openAIChat = () => (dispatch) => {
    dispatch({ type: "OpenAIChat" });
};

// Close AI Chat Drawer
export const closeAIChat = () => (dispatch) => {
    dispatch({ type: "CloseAIChat" });
};

// Send Message to AI
export const sendMessage = (message, isMockMode = false) => async (dispatch) => {
    const messageId = Date.now();
    
    try {
        dispatch({ type: "SendMessageRequest" });

        const userMessage = {
            id: messageId,
            type: "user",
            content: message,
            timestamp: new Date().toISOString(),
            status: "sending", // ← Track message status
        };

        // ✅ OPTIMISTIC UPDATE: Show user message immediately
        dispatch({
            type: "SendMessageSuccess",
            payload: { userMessage, aiMessage: null },
        });

        if (isMockMode) {
            // Mock mode: Generate immediate response
            const mockResponseText = generateMockAIResponse(message);

            const aiMessage = {
                id: Date.now() + 1,
                type: "ai",
                content: mockResponseText,
                timestamp: new Date().toISOString(),
            };

            // Simulate network delay
            setTimeout(() => {
                dispatch({
                    type: "ReceiveAIResponse",
                    payload: aiMessage,
                });
            }, 500);
        } else {
            // Real mode: Send to n8n webhook
            const user = auth.currentUser;
            
            // Ensure user is authenticated
            if (!user?.uid) {
                throw new Error("User not authenticated. Please log in to use AI Assistant.");
            }
            
            // Get Firebase user token and info
            const firebaseAuthConfig = await getAuthConfig();
            const firebaseToken = firebaseAuthConfig.headers.token;
            const userId = user.uid;
            const userEmail = user.email || '';

            // Send to n8n (don't wait for response - it will come via Firestore)
            await axios.post(
                N8N_WEBHOOK_URL,
                {
                    type: "text",
                    message: message,
                    timestamp: new Date().toISOString(),
                    userId: userId,
                    userEmail: userEmail,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${N8N_AUTH_TOKEN}`,
                        "X-Firebase-Token": firebaseToken,
                        "Content-Type": "application/json",
                    },
                }
            );
            
            // Mark message as sent successfully
            dispatch({
                type: "UpdateMessageStatus",
                payload: { messageId, status: "sent" },
            });
            
            // Start timeout (60 seconds) - if no AI response, hide typing indicator
            const timeoutId = setTimeout(() => {
                dispatch({ type: "AIResponseTimeout" });
                
                // Show a subtle notification (not an error, just info)
                toast.info("AI is taking longer than expected. The response will appear when ready.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
            }, 60000); // 60 seconds
            
            // Store timeout ID in state so it can be cleared
            dispatch({
                type: "SetAIResponseTimeout",
                payload: timeoutId,
            });
            
            // AI response will come through the Firestore real-time listener
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to send message";
        
        // Mark the specific message as failed
        dispatch({
            type: "SendMessageFailure",
            payload: { 
                messageId, 
                error: errorMessage 
            },
        });
        
        toast.error(errorMessage);
    }
};

// Receive Message from Firestore (both user and AI messages)
export const receiveAIResponse = (message) => (dispatch) => {
    // If message is a string (old behavior), convert to object
    if (typeof message === 'string') {
    dispatch({
        type: "ReceiveAIResponse",
        payload: {
            id: Date.now(),
            type: "ai",
            content: message,
            timestamp: new Date().toISOString(),
        },
    });
    } else {
        // New behavior: message is already a full object from Firestore
        dispatch({
            type: "ReceiveAIResponse",
            payload: message,
        });
    }
};

// Retry Failed Message
export const retryMessage = (messageId, messageContent) => (dispatch) => {
    // Remove the failed message
    dispatch({
        type: "RemoveMessage",
        payload: messageId,
    });
    
    // Send again
    dispatch(sendMessage(messageContent, false));
};

// Voice Recognition Actions
export const startVoiceListening = () => (dispatch) => {
    dispatch({ type: "StartVoiceListening" });
};

export const updateVoiceTranscript = (transcript) => (dispatch) => {
    dispatch({
        type: "UpdateVoiceTranscript",
        payload: transcript,
    });
};

export const stopVoiceListening = () => (dispatch) => {
    dispatch({ type: "StopVoiceListening" });
};

// Context Actions
export const setAIChatContext = (context) => (dispatch) => {
    dispatch({
        type: "SetAIChatContext",
        payload: context,
    });
};

export const clearAIChatContext = () => (dispatch) => {
    dispatch({ type: "ClearAIChatContext" });
};

// Clear Messages
export const clearAIChatMessages = () => (dispatch) => {
    dispatch({ type: "ClearAIChatMessages" });
};

// Mark Messages as Read
export const markMessagesAsRead = () => (dispatch) => {
    dispatch({ type: "MarkMessagesAsRead" });
};

// Send Voice Message to AI
export const sendVoiceMessage = (audioBlob, duration, mimeType) => async (dispatch) => {
    try {
        dispatch({ type: "SendMessageRequest" });

        const user = auth.currentUser;
        
        // Ensure user is authenticated
        if (!user?.uid) {
            throw new Error("User not authenticated. Please log in to use AI Assistant.");
        }

        // Get Firebase user token and info
        const firebaseAuthConfig = await getAuthConfig();
        const firebaseToken = firebaseAuthConfig.headers.token;
        const userId = user.uid;
        const userEmail = user.email || '';

        // Create user message placeholder
        const userMessage = {
            id: Date.now(),
            type: "user",
            content: `🎤 Voice message (${duration}s)`,
            timestamp: new Date().toISOString(),
            isAudio: true,
            audioBlob: audioBlob,
            duration: duration,
        };

        // ✅ OPTIMISTIC UPDATE: Show voice message immediately
        dispatch({
            type: "SendMessageSuccess",
            payload: { userMessage, aiMessage: null },
        });

        // Create FormData for voice message
        const formData = new FormData();
        
        // Create audio file from blob
        const audioFile = new File(
            [audioBlob], 
            `voice-${Date.now()}.webm`,
            { type: mimeType }
        );

        formData.append('type', 'audio');
        formData.append('audio', audioFile);
        formData.append('duration', duration.toString());
        formData.append('timestamp', new Date().toISOString());
        formData.append('userId', userId);
        formData.append('userEmail', userEmail);

        // Send to n8n (AI response will come via Firestore)
        await axios.post(
            N8N_WEBHOOK_URL,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${N8N_AUTH_TOKEN}`,
                    "X-Firebase-Token": firebaseToken,
                    // Let browser set Content-Type with boundary for multipart/form-data
                },
            }
        );

        toast.success("Voice message sent successfully!");

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to send voice message";
        
        dispatch({
            type: "SendMessageFailure",
            payload: errorMessage,
        });
        toast.error(errorMessage);
    }
};

// Quick Action Handlers (mock implementations)
export const handleQuickAction = (action) => async (dispatch) => {
    let message = "";

    switch (action) {
        case "create-invoice":
            message = "I'd like to create a new tax invoice";
            break;
        case "add-customer":
            message = "I want to add a new customer";
            break;
        case "create-estimate":
            message = "I want to create an estimate";
            break;
        case "record-payment":
            message = "I need to record a payment receipt";
            break;
        case "create-proforma":
            message = "I'd like to create a proforma invoice";
            break;
        case "create-credit-note":
            message = "I want to create a credit note";
            break;
        default:
            message = action;
    }

    dispatch(sendMessage(message, true));
};
