import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import {
    getCreditNoteDetails,
    markCreditNoteVoid,
    submitCreditNoteForApproval,
    approveCreditNote,
    markAsFinalCreditNote,
} from "../../../Actions/CreditNote";
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
import ReadHead from "../../../Shared/ReadHead/ReadHead";
import { styles as headStyles } from "../../../Styles/ReadHead";
import ReadFor from "../../../Shared/ReadFor/ReadFor";
import { styles as forStyles } from "../../../Styles/ReadFor";
import ReadMeta from "../../../Shared/ReadMeta/ReadMeta";
import { styles as metaStyles } from "../../../Styles/ReadMeta";
import LineItem from "../../../Shared/LineItem/LineItem";
import { styles as lineItemStyles } from "../../../Styles/LineItem";
import ReadBank from "../../../Shared/ReadBank/ReadBank";
import { styles as bankStyles } from "../../../Styles/ReadBank";
import ReadTax from "../../../Shared/ReadTax/ReadTax";
import { styles as taxStyles } from "../../../Styles/ReadTax";
import DueAmountCard from "../../../Shared/DueAmountCard/DueAmountCard";

// Utils
import calculateTotalAmounts from "../../../utils/calculateTotalAmounts";
import ReadContent from "../../../utils/ReadContent";

// Icons
import { Ban, Lock, Share, MousePointerClick } from "lucide-react";
import Breadcrumb from "../../common/BreadCrumb";
import { calculateItemTaxes } from "../../../utils/taxCalculation";

const CreditNoteReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const { client } = useSelector((state) => state.accountantReducer);
    const { loading, creditNote } = useSelector(
        (state) => state.creditNoteReducer
    );
    const { taxRates } = useSelector((state) => state.onboardingReducer);
    const { currencies } = useSelector((state) => state.onboardingReducer);

    const cn_id =
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

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);
    const [groupedItems, setGroupedItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
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

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getCreditNoteDetails(cn_id, user?.localInfo?.role));
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, cn_id, client_id, user?.localInfo?.role]);

    useEffect(() => {
        const amount = calculateTotalAmounts(
            creditNote?.line_items,
            setSubTotal,
            setDiscount,
            setTax,
            setTotal,
            setItemTax,
            taxRates
        );
        setItemTotal(amount);
    }, [creditNote, taxRates]);

    // === VIEW COMPONENT IMPLEMENTATION ===
    // In the view component, use the unified calculation
    useEffect(() => {
        // Exit early if required data is not available
        if (!creditNote?.line_items || !taxRates) {
            return;
        }

        try {
            const calculationResult = calculateItemTaxes(
                creditNote.line_items,
                taxRates,
                true // showTax parameter
            );

            console.log("Calculation Result: ", calculationResult);

            // Update state with calculation results
            setGroupedItems(calculationResult.groupedItems);
            setItemTotal(calculationResult.itemTotals);
            setItemTax(calculationResult.itemTaxes);

            // Optional: Set totals separately if needed
            setSubTotal(calculationResult.subtotal);
            setTax(calculationResult.taxTotal);
            setTotal(calculationResult.grandTotal);
        } catch (error) {
            console.error("Error in tax calculation:", error);
            setGroupedItems([]);
        }
    }, [creditNote, taxRates]);

    useEffect(() => {
        dispatch(
            setChatDocument({
                id: creditNote?.cn_id,
                number: creditNote?.cn_number,
            })
        );
        return () => {
            dispatch({ type: "RemoveChatDocument" });
        };
    }, [dispatch, creditNote]);

    const [clientData, setClientData] = useState({});
    useEffect(() => {
        if (user?.localInfo?.role) {
            setClientData({ clientInfo: client });
        } else {
            setClientData(user);
        }
    }, [user, client]);

    const showBankDetails = true;
    const showTax = isUserTaxRegistered;

    const contents = ReadContent(
        showBankDetails,
        "Credit Note",
        creditNote,
        clientData,
        currencies,
        taxRates,
        itemTax,
        itemTotal,
        subTotal,
        discount,
        tax,
        total,
        groupedItems,
        showTax
    );

    const handleMarkAsVoid = () => {
        dispatch(markCreditNoteVoid(cn_id));
    };

    const handleSubmitForApproval = () => {
        dispatch(submitCreditNoteForApproval(cn_id));
    };

    const handleApprove = () => {
        dispatch(approveCreditNote(cn_id, user?.localInfo?.role, client_id));
    };

    const handleFinal = () => {
        dispatch(markAsFinalCreditNote(cn_id));
    };

    const isFinal = creditNote?.cn_status === "Client Accepted";

    const handleEdit = () => {
        navigate(
            `${
                user?.localInfo?.role === 2
                    ? `/jr/${jr_id}/clients/${client_id}`
                    : user?.localInfo?.role === 1
                    ? `/clients/${client_id}`
                    : ""
            }/credit-note/edit/${creditNote?.cn_id}`
        );
    };

    const handleBack = () => {
        navigate(
            `${
                user?.localInfo?.role === 2
                    ? `/jr/${jr_id}/clients/${client_id}`
                    : user?.localInfo?.role === 1
                    ? `/clients/${client_id}`
                    : "/credit-note"
            }`
        );
    };

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <>
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <Breadcrumb
                    item={{
                        label: "Credit Note",
                        viewLabel: "View Credit Note",
                    }}
                />
                {/* Header with actions */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                    <div className="flex flex-wrap gap-3 justify-end">
                        {creditNote?.cn_status !== "Void" && (
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
                                {creditNote?.cn_status ===
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
                        ) : creditNote?.cn_status === "Draft" ? (
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
                                    text="Void Credit"
                                    variant="outlined"
                                    onClick={handleMarkAsVoid}
                                    className="text-red-500 w-full sm:w-auto border-red-500"
                                />
                            </>
                        ) : creditNote?.cn_status === "Pending Approval" ? (
                            <Button
                                icon={Ban}
                                text="Void Credit"
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
                            heading={"Credit Note"}
                            name={creditNote?.cn_number}
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
                                title={"Credit Note"}
                                logo={
                                    user?.localInfo?.role
                                        ? client?.company_logo_url
                                        : user?.clientInfo?.company_logo_url
                                }
                            />
                            <ReadHead
                                styles={headStyles}
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
                                number={creditNote?.cn_number}
                                date={creditNote?.cn_date}
                                due_date={creditNote?.due_date}
                                reference={creditNote?.reference}
                            />
                            <ReadFor
                                title={"Credit Note"}
                                styles={forStyles}
                                customer_name={
                                    creditNote?.customer?.customer_name
                                }
                                billing_address_line_1={
                                    creditNote?.customer?.billing_address_line_1
                                }
                                billing_address_line_2={
                                    creditNote?.customer?.billing_address_line_2
                                }
                                billing_address_line_3={
                                    creditNote?.customer?.billing_address_line_3
                                }
                                billing_state={
                                    creditNote?.customer?.billing_state
                                }
                                billing_country={
                                    creditNote?.customer?.billing_country
                                }
                                shipping_address_line_1={
                                    creditNote?.customer
                                        ?.shipping_address_details
                                        ?.address_line_1
                                }
                                shipping_address_line_2={
                                    creditNote?.customer
                                        ?.shipping_address_details
                                        ?.address_line_2
                                }
                                shipping_address_line_3={
                                    creditNote?.customer
                                        ?.shipping_address_details
                                        ?.address_line_3
                                }
                                shipping_state={
                                    creditNote?.customer
                                        ?.shipping_address_details?.state
                                }
                                shipping_country={
                                    creditNote?.customer
                                        ?.shipping_address_details?.country
                                }
                                trn={creditNote?.customer?.trn}
                            />
                            <ReadMeta
                                styles={metaStyles}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            creditNote?.currency_id
                                    )?.currency_abv
                                }
                                currency_conversion_rate={
                                    creditNote?.currency_conversion_rate
                                }
                                subject={creditNote?.subject}
                            />
                            <div className="read__items">
                                {creditNote?.line_items?.map((item, index) => (
                                    <LineItem
                                        styles={lineItemStyles}
                                        key={index}
                                        index={index}
                                        item_name={item?.item_name}
                                        unit={item?.unit}
                                        qty={item?.qty}
                                        rate={item?.rate}
                                        discount={item?.discount}
                                        is_percentage_discount={
                                            item?.is_percentage_discount
                                        }
                                        tax_id={item?.tax_id}
                                        taxRateName={
                                            taxRates?.find(
                                                (tax) =>
                                                    tax.tax_rate_id ===
                                                    item?.tax_id
                                            )?.tax_rate_name
                                        }
                                        taxAmount={itemTax && itemTax[index]}
                                        amount={itemTotal && itemTotal[index]}
                                        description={item?.description}
                                        showTax={isUserTaxRegistered}
                                    />
                                ))}
                            </div>
                            <ReadBank
                                styles={bankStyles}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            creditNote?.currency_id
                                    )?.currency_abv
                                }
                                primary_currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_name ===
                                            creditNote?.primary_bank_details
                                                ?.currency_name
                                    )?.currency_abv
                                }
                                secondary_currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_name ===
                                            creditNote?.primary_bank_details
                                                ?.currency_name
                                    )?.currency_abv
                                }
                                primary_bank={creditNote?.primary_bank_details}
                                showBankDetails={true}
                                secondary_bank={
                                    creditNote?.secondary_bank_details
                                }
                                subTotal={subTotal}
                                discount={discount}
                                tax={tax}
                                total={total}
                                showTax={isUserTaxRegistered}
                            />
                            <ReadTax
                                styles={taxStyles}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            creditNote?.currency_id
                                    )?.currency_abv
                                }
                                currency_conversion_rate={
                                    creditNote?.currency_conversion_rate
                                }
                                subTotal={subTotal}
                                discount={discount}
                                tax={tax}
                                total={total}
                                groupedItems={groupedItems}
                                terms_and_conditions={
                                    creditNote?.terms_and_conditions
                                }
                                showTax={isUserTaxRegistered}
                            />
                            <TemplateBranding />
                        </div>
                    </div>
                </DeviceRestriction>

                {/* Due Amount Card */}
                <DueAmountCard
                    title={"Credit Note"}
                    due_amount={creditNote?.remaining_balance}
                    currency_abv={
                        currencies?.find(
                            (currency) =>
                                currency.currency_id === creditNote?.currency_id
                        )?.currency_abv
                    }
                    linked_item1={creditNote?.invoice_mappings}
                    linked_item2={[]}
                />
                <PDFTemplateModal
                    isOpen={isPDFTemplateModalOpen}
                    onClose={togglePDFTemplateModal}
                    onSelect={onSelectPDFTemplate}
                />
            </div>
        </>
    );
};

export default CreditNoteReadLayout;
