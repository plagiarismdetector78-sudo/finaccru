import React, { useState } from "react";
import Modal from "react-modal";
import TextArea from "../../common/TextArea";

Modal.setAppElement("#react-modal");

const PaymentMethodModal = ({ visible, onCancel, onSelect }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [customNote, setCustomNote] = useState("");

    const handleOk = () => {
        if (selectedMethod === "other") {
            onSelect(selectedMethod, customNote);
        } else {
            onSelect(selectedMethod);
        }
        onCancel();
    };

    return (
        <Modal
            isOpen={visible}
            onRequestClose={onCancel}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50"
        >
            <h2 className="text-xl font-semibold mb-4">
                Select Payment Method
            </h2>

            <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        value="cash"
                        checked={selectedMethod === "cash"}
                        onChange={() => setSelectedMethod("cash")}
                    />
                    <div>
                        <div className="font-medium">Cash</div>
                        <div className="text-sm text-gray-500">
                            Cash payment
                        </div>
                    </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        value="bank"
                        checked={selectedMethod === "bank"}
                        onChange={() => setSelectedMethod("bank")}
                    />
                    <div>
                        <div className="font-medium">Bank</div>
                        <div className="text-sm text-gray-500">
                            Payment through bank transfer
                        </div>
                    </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        value="other"
                        checked={selectedMethod === "other"}
                        onChange={() => setSelectedMethod("other")}
                    />
                    <div>
                        <div className="font-medium">Custom</div>
                        <div className="text-sm text-gray-500">
                            Other payment method
                        </div>
                    </div>
                </label>

                {selectedMethod === "other" && (
                    <TextArea
                        placeholder="Enter payment method details..."
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        rows={5}
                    />
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleOk}
                        disabled={!selectedMethod}
                        className={`px-4 py-2 rounded text-white ${
                            selectedMethod
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-300 cursor-not-allowed"
                        }`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentMethodModal;
