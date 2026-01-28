import React from "react";
import { FileX } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyDataState = ({
    title,
    message,
    buttonText,
    buttonLink,
    icon = <FileX size={48} className="text-gray-400" />,
    showButton = true,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">{message}</p>
            {showButton && (
                <Link
                    to={buttonLink}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
};

export default EmptyDataState;
