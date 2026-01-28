import { Sparkles } from "lucide-react";

const TypingIndicator = () => {
    return (
        <div className="flex gap-3 mb-4">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                <Sparkles size={16} className="text-white" />
            </div>

            {/* Typing Bubble */}
            <div className="flex flex-col max-w-[75%] items-start">
                <div className="rounded-2xl bg-gray-100 text-gray-900 rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                        {/* Animated Dots */}
                        <div className="flex gap-1">
                            <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms", animationDuration: "1s" }}
                            ></div>
                    <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms", animationDuration: "1s" }}
                    ></div>
                    <div
                                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms", animationDuration: "1s" }}
                    ></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                            AI Agent is processing...
                        </span>
                    </div>
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                    Analyzing your request
                </span>
            </div>
        </div>
    );
};

export default TypingIndicator;
