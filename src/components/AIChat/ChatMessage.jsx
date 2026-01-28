import { Sparkles, User, AlertCircle, RotateCw } from "lucide-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { retryMessage } from "../../Actions/AIChat";
import VoiceMessagePlayer from "./VoiceMessagePlayer";

const ChatMessage = ({ message }) => {
    const dispatch = useDispatch();
    const isAI = message.type === "ai";
    const isUser = message.type === "user";
    const isAudio = message.isAudio;
    const isFailed = message.status === "failed";
    const isSending = message.status === "sending";

    const handleRetry = () => {
        dispatch(retryMessage(message.id, message.content));
    };

    return (
        <div
            className={`flex gap-3 mb-4 ${
                isUser ? "flex-row-reverse" : "flex-row"
            }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isAI
                        ? "bg-gradient-to-br from-purple-500 to-purple-700"
                        : "bg-blue-500"
                }`}
            >
                {isAI ? (
                    <Sparkles size={16} className="text-white" />
                ) : (
                    <User size={16} className="text-white" />
                )}
            </div>

            {/* Message Bubble */}
            <div
                className={`flex flex-col max-w-[75%] ${
                    isUser ? "items-end" : "items-start"
                }`}
            >
                <div
                    className={`rounded-2xl ${
                        isAI
                            ? "bg-gray-100 text-gray-900 rounded-tl-sm"
                            : isFailed
                            ? "bg-red-100 text-red-900 rounded-tr-sm border-2 border-red-300"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm"
                    } ${isAudio ? "px-3 py-2" : "px-4 py-2.5"} ${
                        isSending ? "opacity-60" : "opacity-100"
                    }`}
                >
                    {isAudio ? (
                        <VoiceMessagePlayer
                            audioBlob={message.audioBlob}
                            duration={message.duration || 0}
                        />
                    ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </p>
                    )}
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-2 mt-1 px-1">
                {/* Timestamp */}
                    <span className="text-xs text-gray-400">
                    {moment(message.timestamp).format("h:mm A")}
                </span>

                    {/* Sending Indicator */}
                    {isSending && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                            Sending...
                        </span>
                    )}

                    {/* Failed Indicator with Retry */}
                    {isFailed && (
                        <button
                            onClick={handleRetry}
                            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline"
                        >
                            <AlertCircle size={12} />
                            Failed • Retry
                            <RotateCw size={12} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
