import React from "react";
import Modal from "react-modal";
import { XCircle, Bell } from "lucide-react";

Modal.setAppElement("#react-modal");

const NotificationModal = ({
    isOpen,
    onClose,
    title,
    message,
    actionLabel,
    onAction,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-0 rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        >
            <div className="border-l-4 border-blue-500">
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Bell className="text-blue-500 mr-2 h-5 w-5" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            {title || "Notification"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XCircle className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600">
                        {message || "You have a new notification."}
                    </p>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-150"
                        >
                            Dismiss
                        </button>
                        {actionLabel && onAction && (
                            <button
                                onClick={onAction}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all duration-150 hover:shadow-md"
                            >
                                {actionLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default NotificationModal;
