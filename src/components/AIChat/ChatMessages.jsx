import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { Sparkles } from "lucide-react";

const ChatMessages = () => {
    const { messages, isAITyping } = useSelector(
        (state) => state.aiChatReducer || {}
    );
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isAITyping]);

    // Show welcome screen if no messages
    if (!messages || messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-5 shadow-lg">
                    <Sparkles size={48} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Welcome to AI Sales Assistant
                </h3>
                <p className="text-gray-600 max-w-md mb-6 text-base leading-relaxed">
                    I can help you create and manage your sales documents quickly
                    using voice or text.
                </p>
                <div className="bg-white border-2 border-purple-200 rounded-xl p-5 max-w-md mb-8 shadow-sm">
                    <p className="text-sm text-purple-700 font-semibold mb-3 flex items-center justify-center gap-2">
                        <Sparkles size={16} />
                        I can help you with:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-2 text-left">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>Create invoices, estimates & proforma</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>Add and update customers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>Record payments & receipts</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>Modify existing documents</span>
                        </li>
                    </ul>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Try saying: "Create an invoice for ABC Company"
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing Indicator */}
            {isAITyping && <TypingIndicator />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
