import React from "react";
import { Sparkles } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAIChat } from "../../Actions/AIChat";
import { ENABLE_AI_CHAT } from "../../constant/aiConstants";

const AIChatLauncher = () => {
    const dispatch = useDispatch();
    const { unreadCount } = useSelector((state) => state.aiChatReducer || {});

    // Don't render if AI Chat is disabled
    if (!ENABLE_AI_CHAT) {
        return null;
    }

    const handleClick = () => {
        dispatch(toggleAIChat());
    };

    return (
        <div className="relative cursor-pointer group" onClick={handleClick}>
            {/* AI Icon with Gradient Background */}
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50">
                <Sparkles
                    size={20}
                    className="text-white transition-transform duration-300 group-hover:rotate-12"
                />

                {/* Animated Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-purple-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                </div>
            )}

            {/* Tooltip */}
            <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    AI Assistant
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
            </div>

            {/* Pulse Animation for Unread Messages */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                </span>
            )}
        </div>
    );
};

export default AIChatLauncher;
