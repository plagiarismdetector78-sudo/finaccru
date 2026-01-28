import React, { useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { closeAIChat, receiveAIResponse } from "../../Actions/AIChat";
import { AI_CHAT_CONFIG } from "../../constant/aiConstants";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { listenToAIResponses } from "../../utils/aiRealtimeListener";
import { auth } from "../../firebase";

const AIChatDrawer = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.aiChatReducer || {});
    const user = auth.currentUser;

    // Set up Firestore real-time listener for all messages
    useEffect(() => {
        // Only set up listener if user is authenticated
        if (!user?.uid) {
            return;
        }

        const userId = user.uid;

        // Listen for new messages (both user and AI)
        const unsubscribe = listenToAIResponses(userId, (message) => {
            // Dispatch the full message object (not just content)
            dispatch(receiveAIResponse(message));
        });

        return () => {
            unsubscribe();
        };
    }, [user?.uid, dispatch]);

    const handleClose = () => {
        dispatch(closeAIChat());
    };

    const handleOverlayClick = (e) => {
        // Close drawer when clicking the overlay (not the drawer itself)
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isOpen ? "opacity-50 visible" : "opacity-0 invisible"
                }`}
                onClick={handleOverlayClick}
            ></div>

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col w-full sm:w-[450px] lg:w-[550px] ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                AI Sales Assistant
                            </h2>
                            <p className="text-xs text-gray-500">
                                Powered by Finaccru AI
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        aria-label="Close AI Chat"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Chat Messages Area */}
                <ChatMessages />

                {/* Chat Input */}
                <ChatInput />
            </div>
        </>
    );
};

export default AIChatDrawer;
