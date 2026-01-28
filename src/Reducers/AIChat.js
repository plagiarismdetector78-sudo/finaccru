import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    messages: [],
    unreadCount: 0,
    loading: false,
    isListening: false,
    currentTranscript: "",
    error: null,
    context: null, // Current context (invoice, customer, etc.)
    isAITyping: false, // AI typing indicator
    aiResponseTimeoutId: null, // Timeout ID for AI response
};

export const aiChatReducer = createReducer(initialState, (builder) => {
    builder
        // Toggle AI Chat Drawer
        .addCase("ToggleAIChat", (state) => {
            state.isOpen = !state.isOpen;
            if (state.isOpen) {
                state.unreadCount = 0; // Clear unread count when opened
            }
        })

        // Open AI Chat Drawer
        .addCase("OpenAIChat", (state) => {
            state.isOpen = true;
            state.unreadCount = 0;
        })

        // Close AI Chat Drawer
        .addCase("CloseAIChat", (state) => {
            state.isOpen = false;
            state.isAITyping = false; // Clear typing indicator when closing
            
            // Clear timeout to prevent memory leaks
            if (state.aiResponseTimeoutId) {
                clearTimeout(state.aiResponseTimeoutId);
                state.aiResponseTimeoutId = null;
            }
        })

        // Send Message Request
        .addCase("SendMessageRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.isAITyping = true; // Show typing indicator
        })
        
        // Set AI Response Timeout
        .addCase("SetAIResponseTimeout", (state, action) => {
            // Clear any existing timeout
            if (state.aiResponseTimeoutId) {
                clearTimeout(state.aiResponseTimeoutId);
            }
            state.aiResponseTimeoutId = action.payload;
        })
        
        // AI Response Timeout (no response from AI)
        .addCase("AIResponseTimeout", (state) => {
            state.isAITyping = false;
            state.loading = false;
            state.aiResponseTimeoutId = null;
            // Don't set error - user can still retry if needed
        })

        // Send Message Success
        .addCase("SendMessageSuccess", (state, action) => {
            state.loading = false;
            state.messages.push(action.payload.userMessage);
            if (action.payload.aiMessage) {
                state.messages.push(action.payload.aiMessage);
                state.isAITyping = false; // Hide typing indicator if AI response included
            }
            // Keep typing indicator if waiting for AI response from Firestore
        })

        // Send Message Failure
        .addCase("SendMessageFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.isAITyping = false; // Hide typing indicator
            
            // Clear timeout
            if (state.aiResponseTimeoutId) {
                clearTimeout(state.aiResponseTimeoutId);
                state.aiResponseTimeoutId = null;
            }
            
            // Mark the specific message as failed
            const messageIndex = state.messages.findIndex(
                msg => msg.id === action.payload.messageId
            );
            if (messageIndex !== -1) {
                state.messages[messageIndex].status = "failed";
                state.messages[messageIndex].error = action.payload.error;
            }
        })
        
        // Update Message Status
        .addCase("UpdateMessageStatus", (state, action) => {
            const messageIndex = state.messages.findIndex(
                msg => msg.id === action.payload.messageId
            );
            if (messageIndex !== -1) {
                state.messages[messageIndex].status = action.payload.status;
            }
        })

        // Receive AI Response (for real-time updates from Firestore)
        .addCase("ReceiveAIResponse", (state, action) => {
            // Check if message already exists (prevent duplicates)
            // Match by content + type (ignore timestamp for user messages sent optimistically)
            const messageExists = state.messages.some(msg => {
                const isSameContent = msg.content === action.payload.content;
                const isSameType = msg.type === action.payload.type;
                
                // For user messages, just match content + type
                // For AI messages, also check timestamp within 10 seconds
                if (msg.type === 'user') {
                    return isSameContent && isSameType;
                } else {
                    const msgTime = new Date(msg.timestamp).getTime();
                    const newTime = new Date(action.payload.timestamp).getTime();
                    const isSameTime = Math.abs(msgTime - newTime) < 10000; // 10 seconds
                    return isSameContent && isSameType && isSameTime;
                }
            });
            
            if (!messageExists) {
            state.messages.push(action.payload);
                console.log('✅ Message added to state. Total messages:', state.messages.length);
                console.log('📊 Current message order:', state.messages.map(m => ({ type: m.type, content: m.content.substring(0, 20), time: m.timestamp })));
            if (!state.isOpen) {
                state.unreadCount += 1;
                }
            } else {
                console.log('⏭️ Skipping duplicate message:', action.payload.type, action.payload.content.substring(0, 30));
            }
            state.loading = false;
            
            // Hide typing indicator when AI message arrives
            if (action.payload.type === 'ai') {
                state.isAITyping = false;
                
                // Clear timeout when AI response arrives
                if (state.aiResponseTimeoutId) {
                    clearTimeout(state.aiResponseTimeoutId);
                    state.aiResponseTimeoutId = null;
                }
            }
        })

        // Start Voice Listening
        .addCase("StartVoiceListening", (state) => {
            state.isListening = true;
            state.currentTranscript = "";
        })

        // Update Voice Transcript
        .addCase("UpdateVoiceTranscript", (state, action) => {
            state.currentTranscript = action.payload;
        })

        // Stop Voice Listening
        .addCase("StopVoiceListening", (state) => {
            state.isListening = false;
        })

        // Set Context
        .addCase("SetAIChatContext", (state, action) => {
            state.context = action.payload;
        })

        // Clear Context
        .addCase("ClearAIChatContext", (state) => {
            state.context = null;
        })

        // Clear Messages
        .addCase("ClearAIChatMessages", (state) => {
            state.messages = [];
            state.error = null;
            state.isAITyping = false; // Clear typing indicator
        })

        // Mark Messages as Read
        .addCase("MarkMessagesAsRead", (state) => {
            state.unreadCount = 0;
        })
        
        // Remove Message
        .addCase("RemoveMessage", (state, action) => {
            state.messages = state.messages.filter(
                msg => msg.id !== action.payload
            );
        });
});
