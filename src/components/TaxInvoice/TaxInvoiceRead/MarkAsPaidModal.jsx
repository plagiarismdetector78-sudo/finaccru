import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readOpenCreditNotesForCustomer } from "../../../Actions/CreditNote";
import { readOpenPaymentsForCustomer } from "../../../Actions/Payment";
import {
    getTaxInvoiceDetails,
    updateTaxInvoice,
} from "../../../Actions/TaxInvoice";
import Modal from "react-modal";
import Spinner from "../../common/Spinner";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    AlertCircle,
    CreditCard,
    Receipt,
    FileText,
    Check,
    X,
} from "lucide-react";

Modal.setAppElement("#react-modal");

const MarkAsPaidModal = ({ isOpen, onClose, taxInvoice, user, client }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [paymentList, setPaymentList] = useState([]);
    const [creditNoteList, setCreditNoteList] = useState([]);
    const [bankId, setBankId] = useState("0");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dueAmount, setDueAmount] = useState(null);
    const [activeTab, setActiveTab] = useState("receipts");

    const { openPayments, loading: paymentsLoading } = useSelector(
        (state) => state.paymentReducer
    );
    const { openCreditNotes, loading: creditNotesLoading } = useSelector(
        (state) => state.creditNoteReducer
    );
    const { currencies } = useSelector((state) => state.onboardingReducer);

    useEffect(() => {
        if (taxInvoice) {
            const dueAmountValue = parseFloat(taxInvoice?.due_amount);
            setDueAmount(!isNaN(dueAmountValue) && dueAmountValue !== 0);
        }
    }, [taxInvoice]);

    useEffect(() => {
        if (taxInvoice?.customer?.customer_id && taxInvoice?.currency_id) {
            dispatch(
                readOpenCreditNotesForCustomer(
                    taxInvoice.customer.customer_id,
                    taxInvoice.currency_id,
                    user?.localInfo?.role,
                    client?.client_id || 0
                )
            );
            dispatch(
                readOpenPaymentsForCustomer(
                    taxInvoice.customer.customer_id,
                    taxInvoice.currency_id,
                    user?.localInfo?.role,
                    client?.client_id || 0
                )
            );
        }
    }, [dispatch, taxInvoice, user?.localInfo?.role, client?.client_id]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const data = {
                payment: {
                    bank_id: bankId,
                    payments_list: paymentList,
                    credit_notes_list: creditNoteList,
                },
                customer_id: taxInvoice.customer.customer_id,
                ti_number: taxInvoice.ti_number,
                ti_date: taxInvoice.ti_date,
                due_date: taxInvoice.due_date,
                reference: taxInvoice.reference,
                subject: taxInvoice.subject,
                terms_and_conditions: taxInvoice.terms_and_conditions,
                currency_id: taxInvoice.currency_id,
                currency_conversion_rate: taxInvoice.currency_conversion_rate,
                line_items: taxInvoice.line_items,
                shipping_address_id:
                    taxInvoice.customer?.shipping_address_details
                        ?.shipping_address_id,
                primary_bank_id: taxInvoice.primary_bank_details?.bank_id,
                secondary_bank_id: taxInvoice.secondary_bank_details?.bank_id,
            };

            await dispatch(
                updateTaxInvoice(
                    taxInvoice.ti_id,
                    data,
                    navigate,
                    user?.localInfo?.role
                )
            );
            dispatch(
                getTaxInvoiceDetails(taxInvoice.ti_id, user?.localInfo?.role)
            );
            onClose();
        } catch (error) {
            console.error("Error marking invoice as paid:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const availableBanks = [
        { bank_id: "0", bank_name: "Cash" },
        ...((user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank
            ? [
                  {
                      bank_id: (user?.localInfo?.role
                          ? client
                          : user?.clientInfo
                      )?.primary_bank?.bank_id,
                      bank_name: (user?.localInfo?.role
                          ? client
                          : user?.clientInfo
                      )?.primary_bank?.bank_name,
                  },
              ]
            : []),
        ...((user?.localInfo?.role ? client : user?.clientInfo)
            ?.other_bank_accounts || []),
    ];

    const getCurrencySymbol = (currencyId) => {
        const currency = currencies?.find((c) => c.currency_id === currencyId);
        return currency?.currency_abv || "";
    };

    // Render the already paid content
    const renderPaidContent = () => (
        <div className="space-y-6 p-4">
            <div className="flex items-center justify-center gap-2 py-4 text-emerald-600">
                <CheckCircle size={24} />
                <h3 className="text-lg font-semibold">Invoice Already Paid</h3>
            </div>

            <div className="space-y-6">
                {/* Linked Receipts */}
                {taxInvoice?.linked_receipts?.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                            <Receipt size={18} />
                            Linked Receipts
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {taxInvoice.linked_receipts.map((receipt) => (
                                <div
                                    key={receipt.receipt_id}
                                    className="border border-gray-200 rounded-lg p-4 bg-white"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-500">
                                                Receipt:
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                {receipt.receipt_number}
                                            </span>
                                        </div>
                                        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                            {receipt.amount}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">
                                            Exchange Gain:
                                        </span>
                                        <span className="font-medium text-gray-700 mr-3">
                                            {receipt.exchange_gain}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Linked Credit Notes */}
                {taxInvoice?.linked_credit_notes?.length > 0 && (
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                            <FileText size={18} />
                            Linked Credit Notes
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {taxInvoice.linked_credit_notes.map(
                                (creditNote) => (
                                    <div
                                        key={creditNote.cn_id}
                                        className="border border-gray-200 rounded-lg p-4 bg-white"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Credit Note:
                                                </span>
                                                <span className="font-semibold text-gray-800">
                                                    {creditNote.cn_number}
                                                </span>
                                            </div>
                                            <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                                {creditNote.amount}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">
                                                Exchange Gain:
                                            </span>
                                            <span className="font-medium text-gray-700">
                                                {creditNote.exchange_gain}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-4">
                <Button variant="filled" onClick={onClose} text="Close" />
            </div>
        </div>
    );

    // Render the unpaid content with payment options
    const renderUnpaidContent = () => (
        <div className="space-y-6 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <CreditCard size={20} />
                    Mark Invoice as Paid
                </h2>
                <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <AlertCircle size={16} />
                    Due: {getCurrencySymbol(taxInvoice?.currency_id)}{" "}
                    {parseFloat(taxInvoice?.due_amount).toFixed(2)}
                </div>
            </div>

            {paymentsLoading || creditNotesLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 font-medium flex items-center gap-2 ${
                                activeTab === "receipts"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                            onClick={() => setActiveTab("receipts")}
                        >
                            <Receipt size={16} />
                            Receipts{" "}
                            {paymentList.length > 0 &&
                                `(${paymentList.length})`}
                        </button>
                        <button
                            className={`px-4 py-2 font-medium flex items-center gap-2 ${
                                activeTab === "creditNotes"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                            onClick={() => setActiveTab("creditNotes")}
                        >
                            <FileText size={16} />
                            Credit Notes{" "}
                            {creditNoteList.length > 0 &&
                                `(${creditNoteList.length})`}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                        {activeTab === "receipts" && (
                            <>
                                {openPayments?.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {openPayments.map((payment) => (
                                            <div
                                                key={payment.receipt_id}
                                                className={`flex justify-between items-center p-3 hover:bg-gray-50 transition-colors ${
                                                    paymentList.includes(
                                                        payment.receipt_id
                                                    )
                                                        ? "bg-blue-50"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        onClick={() =>
                                                            setPaymentList(
                                                                paymentList.includes(
                                                                    payment.receipt_id
                                                                )
                                                                    ? paymentList.filter(
                                                                          (
                                                                              id
                                                                          ) =>
                                                                              id !==
                                                                              payment.receipt_id
                                                                      )
                                                                    : [
                                                                          ...paymentList,
                                                                          payment.receipt_id,
                                                                      ]
                                                            )
                                                        }
                                                        className={`h-5 w-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                                                            paymentList.includes(
                                                                payment.receipt_id
                                                            )
                                                                ? "bg-blue-600 text-white"
                                                                : "border border-gray-300"
                                                        }`}
                                                    >
                                                        {paymentList.includes(
                                                            payment.receipt_id
                                                        ) && (
                                                            <Check size={14} />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {payment.receipt_number}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-800 px-3 py-1 bg-gray-100 rounded-full">
                                                    {payment.balance_amount}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                        <AlertCircle
                                            size={24}
                                            className="mb-2 text-gray-400"
                                        />
                                        No available receipts
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "creditNotes" && (
                            <>
                                {openCreditNotes?.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {openCreditNotes.map((creditNote) => (
                                            <div
                                                key={creditNote.cn_id}
                                                className={`flex justify-between items-center p-3 hover:bg-gray-50 transition-colors ${
                                                    creditNoteList.includes(
                                                        creditNote.cn_id
                                                    )
                                                        ? "bg-green-50"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        onClick={() =>
                                                            setCreditNoteList(
                                                                creditNoteList.includes(
                                                                    creditNote.cn_id
                                                                )
                                                                    ? creditNoteList.filter(
                                                                          (
                                                                              id
                                                                          ) =>
                                                                              id !==
                                                                              creditNote.cn_id
                                                                      )
                                                                    : [
                                                                          ...creditNoteList,
                                                                          creditNote.cn_id,
                                                                      ]
                                                            )
                                                        }
                                                        className={`h-5 w-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                                                            creditNoteList.includes(
                                                                creditNote.cn_id
                                                            )
                                                                ? "bg-green-600 text-white"
                                                                : "border border-gray-300"
                                                        }`}
                                                    >
                                                        {creditNoteList.includes(
                                                            creditNote.cn_id
                                                        ) && (
                                                            <Check size={14} />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {creditNote.cn_number}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-800 px-3 py-1 bg-gray-100 rounded-full">
                                                    {creditNote.balance_amount}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                        <AlertCircle
                                            size={24}
                                            className="mb-2 text-gray-400"
                                        />
                                        No available credit notes
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Method
                        </label>
                        <select
                            value={bankId}
                            onChange={(e) => setBankId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {availableBanks.map((bank) => (
                                <option key={bank.bank_id} value={bank.bank_id}>
                                    {bank.bank_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Summary */}
                    {(paymentList.length > 0 || creditNoteList.length > 0) && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-800 mb-2">
                                Payment Summary
                            </h4>
                            <div className="space-y-1 text-sm">
                                {paymentList.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Receipts:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {paymentList.length}
                                        </span>
                                    </div>
                                )}
                                {creditNoteList.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Credit Notes:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {creditNoteList.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            disabled={isSubmitting}
                            text="Cancel"
                        />
                        <Button
                            variant="filled"
                            onClick={handleSubmit}
                            disabled={
                                isSubmitting ||
                                (paymentList.length === 0 &&
                                    creditNoteList.length === 0)
                            }
                            loading={isSubmitting}
                            text="Confirm Payment"
                        />
                    </div>
                </>
            )}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Mark Invoice as Paid"
            className="bg-white rounded-xl max-w-2xl w-full mx-auto border border-gray-200 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
        >
            {dueAmount ? renderUnpaidContent() : renderPaidContent()}
        </Modal>
    );
};

export default MarkAsPaidModal;
