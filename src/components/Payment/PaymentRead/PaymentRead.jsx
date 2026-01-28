import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import {
    getPaymentsDetails,
    updatePayments,
    submitPaymentsForApproval,
    markPaymentsVoid,
    approvePayments,
    markAsFinalPayments,
} from "../../../Actions/Payment";
import { getCurrency, getTaxRate } from "../../../Actions/Onboarding";
import { readAccountantClient } from "../../../Actions/Accountant";
import { setChatDocument } from "../../../Actions/Chat";

// Components
import Spinner from "../../common/Spinner";
import Button from "../../common/Button";
import PdfDownload from "../../../Shared/PdfDownload/PdfDownload";
import DeviceRestriction from "../../common/DeviceRestriction";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import TemplateBranding from "../../WebTemplates/TemplateBranding";

import PDFTemplateModal from "../../Modals/PDFTemplateModal";
import {
    pdfTemplates,
    SHOW_SUBMIT_FOR_APPROVAL_BUTTON,
} from "../../../constant";

// Read Parts
import PaymentHead from "./Parts/PaymentHead";
import {
    pdfStyle as headPdfStyle,
    styles as headStyles,
} from "../../../Styles/ReadHead";
import PaymentFor from "./Parts/PaymentFor";
import {
    pdfStyle as forPdfStyles,
    styles as forStyles,
} from "../../../Styles/ReadForPayment";
import PaymentMeta from "./Parts/PaymentMeta";
import {
    pdfStyle as metaPdfStyles,
    styles as metaStyles,
} from "../../../Styles/ReadMetaPayment";

// Icons
import { Ban, Lock, Share, MousePointerClick } from "lucide-react";
import Breadcrumb from "../../common/BreadCrumb";
import convertNumberToWords from "../../../utils/numberToWords";

const PaymentReadLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedPDFTemplate, setSelectedPDFTemplate] = useState(
        pdfTemplates[0]
    );
    const [isPDFTemplateModalOpen, setIsPDFTemplateModalOpen] = useState(false);

    const togglePDFTemplateModal = () => {
        setIsPDFTemplateModalOpen(!isPDFTemplateModalOpen);
    };

    const onSelectPDFTemplate = (template) => {
        setSelectedPDFTemplate(template);
    };

    const { user } = useSelector((state) => state.userReducer);
    const { client } = useSelector((state) => state.accountantReducer);
    const { loading, payment } = useSelector((state) => state.paymentReducer);
    const { currencies } = useSelector((state) => state.onboardingReducer);

    const payment_id =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[7]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[5]
            : window.location.pathname.split("/")[3];

    const client_id =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[4]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[2]
            : 0;

    const jr_id =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[2]
            : 0;

    const receipt_id =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[7]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[5]
            : window.location.pathname.split("/")[3];

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPaymentsDetails(payment_id, user?.localInfo?.role));
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, payment_id, user?.localInfo?.role, client_id]);

    useEffect(() => {
        dispatch(
            setChatDocument({
                id: payment?.receipt_id,
                number: payment?.receipt_number,
            })
        );
        return () => {
            dispatch({ type: "RemoveChatDocument" });
        };
    }, [dispatch, payment]);

    const getTotalInWords = () => {
        if (
            !payment ||
            payment?.total_amount === undefined ||
            payment?.total_amount === null
        ) {
            return "";
        }

        const amount =
            typeof payment.total_amount === "string"
                ? parseFloat(payment.total_amount)
                : Number(payment.total_amount);

        const conversionRate =
            typeof payment.currency_conversion_rate === "string"
                ? parseFloat(payment.currency_conversion_rate)
                : Number(payment.currency_conversion_rate);

        if (isNaN(amount)) {
            return "";
        }

        return convertNumberToWords(amount * conversionRate);
    };

    const totalInWords = getTotalInWords();

    const contents = [
        {
            component: PaymentHead,
            height: 90,
            props: {
                styles: headPdfStyle,
                title: "Receipt",
                address_line_1: user?.localInfo?.role
                    ? client?.company_data?.address_line_1
                    : user?.clientInfo?.company_data?.address_line_1,
                address_line_2: user?.localInfo?.role
                    ? client?.company_data?.address_line_2
                    : user?.clientInfo?.company_data?.address_line_2,
                address_line_3: user?.localInfo?.role
                    ? client?.company_data?.address_line_3
                    : user?.clientInfo?.company_data?.address_line_3,
                company_name: user?.localInfo?.role
                    ? client?.company_data?.company_name
                    : user?.clientInfo?.company_data?.company_name,
                country: user?.localInfo?.role
                    ? client?.company_data?.country
                    : user?.clientInfo?.company_data?.country,
                state: user?.localInfo?.role
                    ? client?.company_data?.state
                    : user?.clientInfo?.company_data?.state,
                trade_license_number: user?.localInfo?.role
                    ? client?.company_data?.trade_license_number
                    : user?.clientInfo?.company_data?.trade_license_number,
                payment_number: payment?.receipt_number,
                payment_date: payment?.receipt_date,
            },
        },
        {
            component: PaymentFor,
            height: (payment?.invoice_mappings || []).length * 35 + 10,
            props: {
                styles: forPdfStyles,
                title: "Receipt",
                customer_name: payment?.customer?.customer_name,
                billing_address_line_1:
                    payment?.customer?.billing_address_line_1,
                billing_address_line_2:
                    payment?.customer?.billing_address_line_2,
                billing_address_line_3:
                    payment?.customer?.billing_address_line_3,
                billing_state: payment?.customer?.billing_state,
                billing_country: payment?.customer?.billing_country,
                trn: payment?.customer?.trn,
                invoice_mappings: payment?.invoice_mappings,
                total_amount: payment?.total_amount,
                amount_in_words: totalInWords,
                currency_abv: currencies?.find(
                    (currency) =>
                        currency.currency_id ===
                        payment?.currency_details?.currency_id
                )?.currency_abv,
            },
        },
        {
            component: PaymentMeta,
            height: 150,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find(
                    (currency) =>
                        currency.currency_id ===
                        payment?.currency_details?.currency_id
                )?.currency_abv,
                currency_conversion_rate: payment?.currency_conversion_rate,
                subject: payment?.subject,
                bank_id:
                    payment?.bank_id === 0
                        ? "Cash"
                        : payment?.bank_id ===
                          (user?.localInfo?.role === 0
                              ? user?.clientInfo?.primary_bank?.bank_id
                              : client?.primary_bank?.bank_id)
                        ? user?.localInfo?.role === 0
                            ? user?.clientInfo?.primary_bank?.bank_name
                            : client?.primary_bank?.bank_name
                        : user?.localInfo?.role === 0
                        ? user?.clientInfo?.other_bank_accounts?.find(
                              (bank) => bank.bank_id === payment?.bank_id
                          )?.bank_name
                        : client?.other_bank_accounts?.find(
                              (bank) => bank.bank_id === payment?.bank_id
                          )?.bank_name,
            },
        },
    ];

    const handleMarkAsVoid = () => {
        dispatch(markPaymentsVoid(payment_id));
    };

    const handleSubmitForApproval = () => {
        dispatch(submitPaymentsForApproval(payment_id));
    };

    const handleApprove = () => {
        dispatch(approvePayments(payment_id, user?.localInfo?.role, client_id));
    };

    const handleFinal = () => {
        dispatch(markAsFinalPayments(payment_id));
    };

    const isFinal = payment?.receipt_status === "Client Accepted";

    const handleEdit = () => {
        navigate(
            `${
                user?.localInfo?.role === 2
                    ? `/jr/${jr_id}/clients/${client_id}`
                    : user?.localInfo?.role === 1
                    ? `/clients/${client_id}`
                    : ""
            }/payment/edit/${receipt_id}`
        );
    };

    const handleBack = () => {
        navigate(
            `${
                user?.localInfo?.role === 2
                    ? `/jr/${jr_id}/clients/${client_id}`
                    : user?.localInfo?.role === 1
                    ? `/clients/${client_id}`
                    : "/payment"
            }`
        );
    };

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <>
            <Breadcrumb
                item={{
                    label: "View Receipts",
                    viewLabel: "Detail",
                }}
            />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                    <div className="flex flex-wrap gap-3 justify-end">
                        {payment?.receipt_status !== "Void" && (
                            <Button
                                icon={Lock}
                                text={isFinal ? "Finalized" : "Mark as Final"}
                                variant="filled"
                                onClick={handleFinal}
                                disabled={isFinal}
                                className={`w-full sm:w-auto ${
                                    isFinal
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-500 text-white"
                                }`}
                            />
                        )}
                        {user?.localInfo?.role ? (
                            <>
                                {payment?.receipt_status ===
                                    "Pending Approval" && (
                                    <Button
                                        icon={Share}
                                        text="Approve"
                                        variant="filled"
                                        onClick={handleApprove}
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                                    />
                                )}
                            </>
                        ) : payment?.receipt_status === "Draft" ? (
                            <>
                                {SHOW_SUBMIT_FOR_APPROVAL_BUTTON && (
                                    <Button
                                        icon={Share}
                                        text="Submit for Review"
                                        variant="filled"
                                        onClick={handleSubmitForApproval}
                                        className="w-full sm:w-auto"
                                    />
                                )}
                                <Button
                                    icon={Ban}
                                    text="Void Payment"
                                    variant="outlined"
                                    onClick={handleMarkAsVoid}
                                    className="text-red-500 w-full sm:w-auto border-red-500"
                                />
                            </>
                        ) : payment?.receipt_status === "Pending Approval" ? (
                            <Button
                                icon={Ban}
                                text="Void Payment"
                                variant="outlined"
                                onClick={handleMarkAsVoid}
                                className="text-red-500 w-full sm:w-auto border-red-500"
                            />
                        ) : null}

                        <Button
                            icon={MousePointerClick}
                            text="Choose Template"
                            variant="outlined"
                            onClick={togglePDFTemplateModal}
                            className="w-full sm:w-auto"
                        />

                        <PdfDownload
                            contents={contents}
                            heading={"Receipt"}
                            name={payment?.receipt_number}
                            logo={user?.clientInfo?.company_logo_url}
                            templatePath={selectedPDFTemplate?.key}
                        />
                    </div>
                </div>
                <DeviceRestriction>
                    {/* Main content */}
                    <div className="w-full flex justify-center mb-32">
                        <div className="w-full max-w-4xl mt-6 bg-white border border-gray-200 overflow-hidden">
                            <div className="">
                                <img
                                    src={`/assets/images/pdf-templates/${selectedPDFTemplate?.key}/Top-New.png`}
                                    alt={selectedPDFTemplate?.name}
                                    className={`w-full ${
                                        selectedPDFTemplate?.key ===
                                        "template-3"
                                            ? "h-0"
                                            : "h-32"
                                    }`}
                                />
                            </div>
                            <TemplateHeader
                                title={"Receipt"}
                                logo={user?.clientInfo?.company_logo_url}
                            />
                            <PaymentHead
                                styles={headStyles}
                                title="Receipt"
                                address_line_1={
                                    user?.localInfo?.role
                                        ? client?.company_data?.address_line_1
                                        : user?.clientInfo?.company_data
                                              ?.address_line_1
                                }
                                address_line_2={
                                    user?.localInfo?.role
                                        ? client?.company_data?.address_line_2
                                        : user?.clientInfo?.company_data
                                              ?.address_line_2
                                }
                                address_line_3={
                                    user?.localInfo?.role
                                        ? client?.company_data?.address_line_3
                                        : user?.clientInfo?.company_data
                                              ?.address_line_3
                                }
                                company_name={
                                    user?.localInfo?.role
                                        ? client?.company_data?.company_name
                                        : user?.clientInfo?.company_data
                                              ?.company_name
                                }
                                country={
                                    user?.localInfo?.role
                                        ? client?.company_data?.country
                                        : user?.clientInfo?.company_data
                                              ?.country
                                }
                                state={
                                    user?.localInfo?.role
                                        ? client?.company_data?.state
                                        : user?.clientInfo?.company_data?.state
                                }
                                vat_trn={
                                    user?.localInfo?.role
                                        ? client?.company_data?.vat_trn
                                        : user?.clientInfo?.company_data
                                              ?.vat_trn
                                }
                                corporate_tax_trn={
                                    user?.localInfo?.role
                                        ? client?.company_data
                                              ?.corporate_tax_trn
                                        : user?.clientInfo?.company_data
                                              ?.corporate_tax_trn
                                }
                                payment_number={payment?.receipt_number}
                                payment_date={payment?.receipt_date}
                            />
                            <PaymentFor
                                styles={forStyles}
                                customer_name={payment?.customer?.customer_name}
                                billing_address_line_1={
                                    payment?.customer?.billing_address_line_1
                                }
                                billing_address_line_2={
                                    payment?.customer?.billing_address_line_2
                                }
                                billing_address_line_3={
                                    payment?.customer?.billing_address_line_3
                                }
                                billing_state={payment?.customer?.billing_state}
                                billing_country={
                                    payment?.customer?.billing_country
                                }
                                trn={payment?.customer?.trn}
                                title="Receipt"
                                invoice_mappings={
                                    payment?.invoice_mappings || []
                                }
                                total_amount={payment?.total_amount}
                                amount_in_words={totalInWords}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            payment?.currency_details
                                                ?.currency_id
                                    )?.currency_abv
                                }
                            />
                            <PaymentMeta
                                styles={metaStyles}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            payment?.currency_details
                                                ?.currency_id
                                    )?.currency_abv
                                }
                                currency_conversion_rate={
                                    payment?.currency_conversion_rate
                                }
                                subject={payment?.subject}
                                bank_id={
                                    payment?.payment_method_type === "cash"
                                        ? "Cash"
                                        : payment?.payment_method_type ===
                                          "other"
                                        ? payment?.other_receipt_payment_method_details
                                        : payment?.bank_id ===
                                          (user?.localInfo?.role === 0
                                              ? user?.clientInfo?.primary_bank
                                                    ?.bank_id
                                              : client?.primary_bank?.bank_id)
                                        ? user?.localInfo?.role === 0
                                            ? user?.clientInfo?.primary_bank
                                                  ?.bank_name
                                            : client?.primary_bank?.bank_name
                                        : user?.localInfo?.role === 0
                                        ? user?.clientInfo?.other_bank_accounts?.find(
                                              (bank) =>
                                                  bank.bank_id ===
                                                  payment?.bank_id
                                          )?.bank_name
                                        : client?.other_bank_accounts?.find(
                                              (bank) =>
                                                  bank.bank_id ===
                                                  payment?.bank_id
                                          )?.bank_name
                                }
                            />
                            <TemplateBranding />
                        </div>
                    </div>
                </DeviceRestriction>
                <PDFTemplateModal
                    isOpen={isPDFTemplateModalOpen}
                    onClose={togglePDFTemplateModal}
                    onSelect={onSelectPDFTemplate}
                />
            </div>
        </>
    );
};

export default PaymentReadLayout;
