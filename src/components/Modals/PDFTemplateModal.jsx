import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { pdfTemplates } from "../../constant";

const PDFTemplateModal = ({ isOpen, onClose, onSelect }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(pdfTemplates[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const imagePromises = pdfTemplates.map((template) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = template.url;
                    img.onload = resolve;
                });
            });

            Promise.all(imagePromises).then(() => setLoading(false));
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Select PDF Template"
            className="bg-white p-6 rounded-lg shadow-xl max-w-2xl h-[650px] mx-auto outline-none flex flex-col"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-semibold mb-4">
                Select a PDF Template
            </h2>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {pdfTemplates.map((_, index) => (
                            <div
                                key={index}
                                className="p-2 border-2 rounded-lg cursor-pointer animate-pulse"
                            >
                                <div className="bg-gray-200 h-96 w-72 rounded-lg"></div>
                                <div className="mt-2 bg-gray-200 h-4 w-72 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {pdfTemplates.map((src, index) => (
                            <div
                                key={index}
                                className={`p-2 border-2 rounded-lg cursor-pointer transition-all ${
                                    selectedTemplate?.key === src.key
                                        ? "border-blue-500"
                                        : "border-transparent"
                                }`}
                                onClick={() => setSelectedTemplate(src)}
                            >
                                <img
                                    src={src.url}
                                    alt={`Template ${index + 1}`}
                                    className="w-72 rounded-lg h-96"
                                    loading="lazy"
                                />
                                <small>{src.title}</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        if (selectedTemplate) onSelect(selectedTemplate);
                        onClose();
                    }}
                    disabled={!selectedTemplate || loading}
                    className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-300"
                >
                    Apply Template
                </button>
            </div>
        </Modal>
    );
};

export default PDFTemplateModal;
