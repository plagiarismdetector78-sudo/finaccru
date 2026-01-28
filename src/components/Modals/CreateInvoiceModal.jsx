import React, { useState } from "react";
import Modal from "react-modal";
import { FileText, Upload, ArrowRight, X } from "lucide-react";
import { SHOW_TAX_INVOICE_FILE_UPLOAD_BUTTON } from "../../constant";

Modal.setAppElement("#react-modal");

const CreateInvoiceModal = ({
    isOpen,
    onClose,
    onCreateManually,
    onSubmitFile,
    fileError,
}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmitFile = (e) => {
        e.preventDefault();
        onSubmitFile(selectedFile);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-auto border border-gray-200"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Create Invoice
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
            </div>

            {SHOW_TAX_INVOICE_FILE_UPLOAD_BUTTON && (
                <p className="text-gray-600 mb-6">
                    Choose your preferred method
                </p>
            )}

            <div className="mb-6">
                <button
                    onClick={onCreateManually}
                    className="flex items-center justify-center gap-3 px-5 py-3 w-full text-white bg-primary rounded-lg hover:bg-primary-dark transition-all"
                >
                    <FileText size={20} /> Create Manually{" "}
                    <ArrowRight size={16} className="ml-1" />
                </button>
            </div>

            {SHOW_TAX_INVOICE_FILE_UPLOAD_BUTTON && (
                <>
                    <div className="my-4 relative flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-3 text-gray-600">
                            OR
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmitFile} className="mt-4">
                        <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.png,.jpeg,.jpg"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <Upload
                                    size={32}
                                    className="text-gray-500 mb-2"
                                />
                                <span className="text-primary font-medium uppercase">
                                    Upload Invoice
                                </span>
                            </label>
                            <p className="mt-2 text-sm text-gray-600 text-center">
                                {selectedFile
                                    ? selectedFile.name
                                    : "Supported formats: PDF, PNG, JPEG"}
                            </p>
                            {fileError[0] && (
                                <p className="mt-2 text-xs text-red-500 text-center">
                                    {fileError[1]}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-4 flex items-center justify-center gap-2 px-5 py-3 w-full text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                            disabled={!selectedFile}
                        >
                            Submit <ArrowRight size={16} />
                        </button>
                    </form>
                </>
            )}
        </Modal>
    );
};

export default CreateInvoiceModal;
