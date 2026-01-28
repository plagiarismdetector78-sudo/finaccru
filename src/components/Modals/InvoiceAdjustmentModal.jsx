import React from "react";
import Modal from "react-modal";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";

Modal.setAppElement("#react-modal");

const InvoiceAdjustmentModal = ({
    isOpen,
    onClose,
    onAdjust,
    openInvoices = [],
    selectedInvoices = [],
    setSelectedInvoices,
    isLoading = false,
    currencies = [],
}) => {
    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const handleInvoiceSelection = (invoiceId, isChecked) => {
        if (isChecked) {
            setSelectedInvoices((prev) => [...prev, invoiceId]);
        } else {
            setSelectedInvoices((prev) =>
                prev.filter((id) => id !== invoiceId)
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-auto border border-gray-200"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                {isUserTaxRegistered ? "Open Tax Invoices" : "Open Invoices"}
            </h2>

            <div className="max-h-64 overflow-y-auto my-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader
                            className="animate-spin text-primary"
                            size={32}
                        />
                    </div>
                ) : openInvoices.length > 0 ? (
                    openInvoices.map((invoice) => (
                        <div
                            key={invoice.invoice_id}
                            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-3 h-4 w-4"
                                    checked={selectedInvoices.includes(
                                        invoice.invoice_id
                                    )}
                                    onChange={(e) =>
                                        handleInvoiceSelection(
                                            invoice.invoice_id,
                                            e.target.checked
                                        )
                                    }
                                />
                                <span className="text-gray-800">
                                    {invoice.invoice_number}
                                </span>
                            </div>
                            <span className="text-gray-700 font-medium">
                                {invoice.balance_due}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        No open invoices
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-5 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={onAdjust}
                    className="px-5 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-all"
                >
                    Adjust
                </button>
            </div>
        </Modal>
    );
};

export default InvoiceAdjustmentModal;
