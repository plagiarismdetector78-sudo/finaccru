import React from "react";
import Modal from "react-modal";
import { XCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

Modal.setAppElement("#react-modal");

const EstimateOrInvoiceConversionModal = ({
    isOpen,
    onClose,
    itemId,
    reference,
}) => {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

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
                        <FileText className="text-blue-500 mr-2 h-5 w-5" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            Convert Document
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
                        Please select the document type you would like to
                        convert to:
                    </p>

                    <div className="mt-6 flex flex-col space-y-3">
                        {!window.location.href.includes("proforma") && (
                            <button
                                onClick={() =>
                                    navigate(
                                        `/proforma/create?convert=true&reference=${reference}&reference_id=${itemId}`
                                    )
                                }
                                className="px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all duration-150 hover:shadow-md flex items-center justify-center"
                            >
                                Convert to Proforma Invoice
                            </button>
                        )}
                        <button
                            onClick={() =>
                                navigate(
                                    `/tax-invoice/create?convert=true&reference=${reference}&reference_id=${itemId}`
                                )
                            }
                            className="px-4 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 shadow-sm transition-all duration-150 hover:shadow-md flex items-center justify-center"
                        >
                            {isUserTaxRegistered
                                ? "Convert to Tax Invoice"
                                : "Convert to Invoice"}
                        </button>
                        {/* <button
                            onClick={() => onConvert("quote")}
                            className="px-4 py-3 text-white bg-purple-600 rounded-md hover:bg-purple-700 shadow-sm transition-all duration-150 hover:shadow-md flex items-center justify-center"
                        >
                            Convert to Quote
                        </button> */}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-150"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EstimateOrInvoiceConversionModal;
