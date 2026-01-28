import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Mic, X, FileText, UserPlus, DollarSign } from "lucide-react";
import { sendMessage, sendVoiceMessage } from "../../Actions/AIChat";
import { AI_CHAT_CONFIG, AI_MOCK_MODE } from "../../constant/aiConstants";
import { startAudioRecording, stopAudioRecording, cancelAudioRecording, getRecordingDuration } from "../../utils/audioRecording";

const ChatInput = () => {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingInterval, setRecordingInterval] = useState(null);
    const { loading } = useSelector((state) => state.aiChatReducer || {});

    const handleSend = () => {
        const message = inputValue.trim();
        if (!message || loading) return;

        dispatch(sendMessage(message, AI_MOCK_MODE));
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVoiceToggle = async () => {
        if (isRecording) {
            // Stop recording and send audio
            stopAudioRecording();
            if (recordingInterval) {
                clearInterval(recordingInterval);
                setRecordingInterval(null);
            }
            setIsRecording(false);
            setRecordingDuration(0);
        } else {
            // Start recording
            const started = await startAudioRecording(
                (audioBlob, duration, mimeType) => {
                    // Send audio to backend
                    handleSendAudio(audioBlob, duration, mimeType);
                },
                () => {
                    setIsRecording(true);
                    setRecordingDuration(0);

                    // Start duration counter
                    const interval = setInterval(() => {
                        setRecordingDuration(getRecordingDuration());
                    }, 100);
                    setRecordingInterval(interval);
                }
            );

            if (!started) {
                setIsRecording(false);
            }
        }
    };

    const handleCancelRecording = () => {
        cancelAudioRecording();
        if (recordingInterval) {
            clearInterval(recordingInterval);
            setRecordingInterval(null);
        }
        setIsRecording(false);
        setRecordingDuration(0);
    };

    const handleSendAudio = async (audioBlob, duration, mimeType) => {
        // Send voice message using Redux action
        dispatch(sendVoiceMessage(audioBlob, duration, mimeType));

        // Backend will respond via Firestore real-time listener
    };

    const handleQuickAction = (message) => {
        setInputValue(message);
        // Auto-send after a short delay so user can see what was populated
        setTimeout(() => {
            dispatch(sendMessage(message, AI_MOCK_MODE));
            setInputValue("");
        }, 100);
    };

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (recordingInterval) {
                clearInterval(recordingInterval);
            }
        };
    }, [recordingInterval]);

    const quickActions = [
        { icon: FileText, label: "Create Invoice", message: "I want to create a new invoice" },
        { icon: UserPlus, label: "Add Customer", message: "I want to add a new customer" },
        { icon: DollarSign, label: "Record Payment", message: "I need to record a payment receipt" },
    ];

    return (
        <div className="border-t border-gray-200 bg-white">
            {/* Quick Action Chips */}
            <div className="px-4 pt-3 pb-2 flex justify-center gap-2 overflow-x-auto scrollbar-hide">
                {quickActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickAction(action.message)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 active:bg-purple-200 transition-colors duration-200 text-xs font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border border-purple-200 flex-shrink-0"
                    >
                        <action.icon size={14} />
                        <span className="hidden sm:inline">{action.label}</span>
                        <span className="sm:hidden">{action.label.split(' ')[1]}</span>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="px-4 pb-4 pt-2">
                {isRecording ? (
                    /* Recording Mode */
                    <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-full px-4 py-3">
                        {/* Recording Animation */}
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-red-600">
                                {Math.floor(recordingDuration / 60)}:{String(recordingDuration % 60).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Waveform Animation */}
                        <div className="flex-1 flex items-center gap-1 justify-center">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-red-400 rounded-full animate-pulse"
                                    style={{
                                        height: `${Math.random() * 20 + 10}px`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '0.6s'
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={handleCancelRecording}
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            title="Cancel recording"
                        >
                            <X size={16} className="text-gray-600" />
                        </button>

                        {/* Send/Stop Button */}
                        <button
                            onClick={handleVoiceToggle}
                            className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 shadow-md"
                            title="Send voice message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                ) : (
                    /* Normal Mode */
                    <div className="flex items-center gap-2">
                        {/* Voice Button */}
                        <button
                            onClick={handleVoiceToggle}
                            disabled={loading}
                            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Record voice message"
                        >
                            <Mic size={20} />
                        </button>

                        {/* Text Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message or use voice..."
                                disabled={loading}
                                maxLength={AI_CHAT_CONFIG.maxMessageLength}
                                className="w-full px-4 py-3 border-2 border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || loading}
                            className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-purple-700 shadow-md hover:shadow-lg flex items-center justify-center"
                            title="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInput;
