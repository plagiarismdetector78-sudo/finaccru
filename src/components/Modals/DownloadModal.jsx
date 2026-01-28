import React from "react";
import Modal from "react-modal";
import { FileText, FileSpreadsheet } from "lucide-react";

Modal.setAppElement("#react-modal");

const DownloadModal = ({ isOpen, onClose, onDownload }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-auto mt-20 border border-gray-200"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold text-gray-800 text-center">
                Download File
            </h2>
            <p className="text-gray-600 mt-2 text-center">
                Choose your preferred file format.
            </p>

            <div className="mt-6 flex flex-col gap-4">
                <button
                    onClick={() => onDownload("csv")}
                    className="flex items-center justify-center gap-3 px-5 py-3 text-white bg-primary rounded-lg hover:bg-primary-dark transition-all"
                >
                    <FileText size={20} /> Download CSV
                </button>
                <button
                    onClick={() => onDownload("excel")}
                    className="flex items-center justify-center gap-3 px-5 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                >
                    <FileSpreadsheet size={20} /> Download Excel
                </button>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-5 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

export default DownloadModal;
