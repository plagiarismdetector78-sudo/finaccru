import React, { Fragment, useEffect, useState } from "react";
import Select from "../../common/Select";
// import Button from "../../common/Button";
// import { Download } from "lucide-react";
// import DownloadModal from "../../Modals/DownloadModal";
import EstimateTable from "../../Estimate/EstimateTable";
import ProformaTable from "../../Proforma/ProformaTable";
import TaxInvoiceTable from "../../TaxInvoice/TaxInvoiceTable";
import PaymentsTable from "../../Payment/PaymentsTable";
import CreditNoteTable from "../../CreditNote/CreditNoteTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import { getEstimateList } from "../../../Actions/Estimate";
import { getProformaList } from "../../../Actions/Proforma";
import { getTaxInvoiceList } from "../../../Actions/TaxInvoice";
import { getPaymentsList } from "../../../Actions/Payment";
import { getCreditNoteList } from "../../../Actions/CreditNote";

const TRANSACTION_OPTIONS = [
    { label: "Estimates", value: "estimates" },
    { label: "Proforma Invoice", value: "proforma-invoice" },
    { label: "Invoice", value: "tax-invoice" },
    { label: "Payments", value: "payments" },
    { label: "Credit Notes", value: "credit-notes" },
];

const Transactions = () => {
    const { id: customerId } = useParams();
    const dispatch = useDispatch();

    // const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(
        TRANSACTION_OPTIONS[0].value
    );

    const estimates = useSelector((state) => state.estimateReducer.estimates);
    const proformas = useSelector((state) => state.proformaReducer.proformas);
    const taxInvoices = useSelector(
        (state) => state.taxInvoiceReducer.taxInvoices
    );
    const payments = useSelector((state) => state.paymentReducer.payments);
    const creditNotes = useSelector(
        (state) => state.creditNoteReducer.creditNotes
    );

    const loading = useSelector(
        (state) =>
            state.estimateReducer.loading ||
            state.proformaReducer.loading ||
            state.taxInvoiceReducer.loading ||
            state.paymentReducer.loading ||
            state.creditNoteReducer.loading
    );

    // const toggleDownloadModal = () => {
    //     setIsDownloadModalOpen(!isDownloadModalOpen);
    // };

    const handleTransactionTypeChange = (event) => {
        setSelectedValue(event.target.value);
    };

    useEffect(() => {
        dispatch(getEstimateList(1, "", customerId));
        dispatch(getProformaList(1, "", customerId));
        dispatch(getTaxInvoiceList(1, "", customerId));
        dispatch(getPaymentsList(1, "", customerId));
        dispatch(getCreditNoteList(1, "", customerId));
    }, [dispatch, customerId]);

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    const renderTransactionContent = () => {
        switch (selectedValue) {
            case "estimates":
                return <EstimateTable estimates={estimates} />;
            case "proforma-invoice":
                return <ProformaTable proformas={proformas} />;
            case "tax-invoice":
                return <TaxInvoiceTable taxInvoices={taxInvoices} />;
            case "payments":
                return <PaymentsTable payments={payments} />;
            case "credit-notes":
                return <CreditNoteTable creditNotes={creditNotes} />;
            default:
                return (
                    <h1 className="text-lg font-semibold">
                        Select a transaction type
                    </h1>
                );
        }
    };

    return (
        <Fragment>
            <div className="flex items-center gap-5 justify-end">
                <Select
                    placeholder="Select Transaction Type"
                    options={TRANSACTION_OPTIONS}
                    value={selectedValue}
                    onChange={handleTransactionTypeChange}
                />
                {/* <div className="w-36">
                    <Button
                        text="Download"
                        icon={Download}
                        onClick={toggleDownloadModal}
                    />
                </div> */}
            </div>

            <div className="mt-5">{renderTransactionContent()}</div>

            {/* <DownloadModal
                isOpen={isDownloadModalOpen}
                onClose={toggleDownloadModal}
            /> */}
        </Fragment>
    );
};

export default Transactions;
