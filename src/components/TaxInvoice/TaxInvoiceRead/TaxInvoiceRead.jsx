import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setChatDocument } from "../../../Actions/Chat";
import {
    getTaxInvoiceDetails,
    markTaxInvoiceVoid,
    submitTaxInvoiceForApproval,
    approveTaxInvoice,
    getExtractedTaxInvoiceDetails,
    markAsFinalTaxInvoice,
} from "../../../Actions/TaxInvoice";
import { getCurrency, getTaxRate } from "../../../Actions/Onboarding";

// Icons
import { Ban, Lock, MousePointerClick, Share, FileText } from "lucide-react";

// Components
import Spinner from "../../common/Spinner";
import Button from "../../common/Button";
import PdfDownload from "../../../Shared/PdfDownload/PdfDownload";
import DeviceRestriction from "../../common/DeviceRestriction";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import TemplateBranding from "../../WebTemplates/TemplateBranding";
import DueAmountCard from "../../../Shared/DueAmountCard/DueAmountCard";
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

// Utils
import calculateTotalAmounts from "../../../utils/calculateTotalAmounts";
import ReadContent from "../../../utils/ReadContent";
import { readAccountantClient } from "../../../Actions/Accountant";
import Breadcrumb from "../../common/BreadCrumb";
import MarkAsPaidModal from "./MarkAsPaidModal";
import { calculateItemTaxes } from "../../../utils/taxCalculation";

const TaxInvoiceReadLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const { client } = useSelector((state) => state.accountantReducer);
    const { loading, taxInvoice, extractedTaxInvoice } = useSelector(
        (state) => state.taxInvoiceReducer
    );
    const { taxRates } = useSelector((state) => state.onboardingReducer);
    const { currencies } = useSelector((state) => state.onboardingReducer);

    const ti_id =
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
    const [markAsPaidModal, setMarkAsPaidModal] = useState(false);

    const togglePDFTemplateModal = () => {
        setIsPDFTemplateModalOpen(!isPDFTemplateModalOpen);
    };

    const onSelectPDFTemplate = (template) => {
        setSelectedPDFTemplate(template);
    };

    const searchParams = new URLSearchParams(window.location.search);
    const extracted = searchParams.get("extracted");

    const finalTaxInvoice = extracted ? extractedTaxInvoice : taxInvoice;

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        if (extracted) {
            dispatch(
                getExtractedTaxInvoiceDetails(ti_id, user?.localInfo?.role)
            );
        } else {
            dispatch(getTaxInvoiceDetails(ti_id, user?.localInfo?.role));
        }
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, ti_id, client_id, user?.localInfo?.role]);

    useEffect(() => {
        const amount = calculateTotalAmounts(
            finalTaxInvoice?.line_items,
            setSubTotal,
            setDiscount,
            setTax,
            setTotal,
            setItemTax,
            taxRates
        );
        setItemTotal(amount);
    }, [finalTaxInvoice, taxRates]);

    // === VIEW COMPONENT IMPLEMENTATION ===
    // In the view component, use the unified calculation
    useEffect(() => {
        // Exit early if required data is not available
        if (!finalTaxInvoice?.line_items || !taxRates) {
            return;
        }

        try {
            const calculationResult = calculateItemTaxes(
                finalTaxInvoice.line_items,
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
    }, [finalTaxInvoice, taxRates]);

    const [clientData, setClientData] = useState({});
    useEffect(() => {
        if (user?.localInfo?.role) {
            setClientData({ clientInfo: client });
        } else {
            setClientData(user);
        }
    }, [user, client]);

    useEffect(() => {
        dispatch(
            setChatDocument({
                id: finalTaxInvoice?.ti_id,
                number: finalTaxInvoice?.ti_number,
            })
        );
        return () => {
            dispatch({ type: "RemoveChatDocument" });
        };
    }, [dispatch, finalTaxInvoice]);

    const showBankDetails = true;
    const showTax = isUserTaxRegistered;

    const contents = ReadContent(
        showBankDetails,
        "Tax Invoice",
        finalTaxInvoice,
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
        dispatch(markTaxInvoiceVoid(ti_id));
    };

    const handleMarkAsPaid = () => {
        setMarkAsPaidModal(true);
    };

    const handleSubmitForApproval = () => {
        dispatch(submitTaxInvoiceForApproval(ti_id));
    };

    const handleApprove = () => {
        dispatch(approveTaxInvoice(ti_id, user?.localInfo?.role, client_id));
    };

    const handleFinal = () => {
        dispatch(markAsFinalTaxInvoice(ti_id));
    };

    const isFinal = finalTaxInvoice?.ti_status === "Client Accepted";

    const handleEdit = () => {
        navigate(
            `${
                user?.localInfo?.role === 2
                    ? `/jr/${jr_id}/clients/${client_id}`
                    : user?.localInfo?.role === 1
                    ? `/clients/${client_id}`
                    : ""
            }/tax-invoice/edit/${extracted ? ti_id : finalTaxInvoice?.ti_id}${
                extracted ? "?extracted=true" : ""
            }`
        );
    };

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <>
            <div className="flex flex-col gap-6 p-2 md:p-4">
                <Breadcrumb
                    item={{
                        label: isUserTaxRegistered ? "Tax Invoice" : "Invoice",
                        viewLabel: isUserTaxRegistered
                            ? "View Tax Invoice"
                            : "View Invoice",
                    }}
                />
                {/* Header with actions */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                    <div className="flex flex-wrap gap-3 justify-end">
                        {finalTaxInvoice?.ti_status !== "Void" && (
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
                                {finalTaxInvoice?.ti_status ===
                                    "Pending Approval" && !extracted ? (
                                    <Button
                                        icon={Share}
                                        text="Approve"
                                        variant="filled"
                                        onClick={handleApprove}
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                                    />
                                ) : null}
                            </>
                        ) : finalTaxInvoice?.ti_status === "Approved" ||
                          finalTaxInvoice?.ti_status ===
                              "Void" ? null : finalTaxInvoice?.ti_status ===
                          "Pending Approval" ? (
                            <>
                                <Button
                                    icon={Ban}
                                    text="Void Invoice"
                                    variant="outlined"
                                    onClick={handleMarkAsVoid}
                                    className="text-red-500 w-full sm:w-auto border-red-500"
                                />
                                <Button
                                    icon={FileText}
                                    text="Confirm Payment"
                                    variant="outlined"
                                    onClick={handleMarkAsPaid}
                                    className="text-green-600 w-full sm:w-auto border-green-600"
                                />
                            </>
                        ) : (
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
                                    icon={FileText}
                                    text="Confirm Payment"
                                    variant="outlined"
                                    onClick={handleMarkAsPaid}
                                    className="text-green-600 w-full sm:w-auto border-green-600"
                                />
                                <Button
                                    icon={Ban}
                                    text="Void Invoice"
                                    variant="outlined"
                                    onClick={handleMarkAsVoid}
                                    className="text-red-500 w-full sm:w-auto border-red-500"
                                />
                            </>
                        )}
                        <Button
                            icon={MousePointerClick}
                            text="Choose Template"
                            variant="outlined"
                            onClick={togglePDFTemplateModal}
                            className="w-full sm:w-auto"
                        />
                        <PdfDownload
                            heading={
                                isUserTaxRegistered ? "Tax Invoice" : "Invoice"
                            }
                            templatePath={selectedPDFTemplate?.key}
                            name={finalTaxInvoice?.ti_number}
                            contents={contents}
                            logo={user?.clientInfo?.company_logo_url}
                        />
                    </div>
                </div>
                <DeviceRestriction>
                    {/* Main content */}
                    <div className="w-full flex justify-center mb-32">
                        <div className="w-[70%] max-w-[60rem] mt-16 bg-white border-2 border-bg-gray">
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
                                title={
                                    isUserTaxRegistered
                                        ? "Tax Invoice"
                                        : "Invoice"
                                }
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
                                number={finalTaxInvoice?.ti_number}
                                date={finalTaxInvoice?.ti_date}
                                due_date={finalTaxInvoice?.due_date}
                                reference={finalTaxInvoice?.reference}
                            />
                            <ReadFor
                                title={"Tax Invoice"}
                                styles={forStyles}
                                customer_name={
                                    finalTaxInvoice?.customer?.customer_name
                                }
                                billing_address_line_1={
                                    finalTaxInvoice?.customer
                                        ?.billing_address_line_1
                                }
                                billing_address_line_2={
                                    finalTaxInvoice?.customer
                                        ?.billing_address_line_2
                                }
                                billing_address_line_3={
                                    finalTaxInvoice?.customer
                                        ?.billing_address_line_3
                                }
                                billing_state={
                                    finalTaxInvoice?.customer?.billing_state
                                }
                                billing_country={
                                    finalTaxInvoice?.customer?.billing_country
                                }
                                shipping_address_line_1={
                                    finalTaxInvoice?.customer
                                        ?.shipping_address_details
                                        ?.address_line_1
                                }
                                shipping_address_line_2={
                                    finalTaxInvoice?.customer
                                        ?.shipping_address_details
                                        ?.address_line_2
                                }
                                shipping_address_line_3={
                                    finalTaxInvoice?.customer
                                        ?.shipping_address_details
                                        ?.address_line_3
                                }
                                shipping_state={
                                    finalTaxInvoice?.customer
                                        ?.shipping_address_details?.state
                                }
                                shipping_country={
                                    finalTaxInvoice?.customer
                                        ?.shipping_address_details?.country
                                }
                                trn={finalTaxInvoice?.customer?.trn}
                            />
                            <ReadMeta
                                styles={metaStyles}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            finalTaxInvoice?.currency_id
                                    )?.currency_abv
                                }
                                currency_conversion_rate={
                                    finalTaxInvoice?.currency_conversion_rate
                                }
                                subject={finalTaxInvoice?.subject}
                            />
                            <div className="read__items">
                                {finalTaxInvoice?.line_items?.map(
                                    (item, index) => (
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
                                            taxAmount={
                                                itemTax && itemTax[index]
                                            }
                                            amount={
                                                itemTotal && itemTotal[index]
                                            }
                                            description={item?.description}
                                            showTax={isUserTaxRegistered}
                                        />
                                    )
                                )}
                            </div>
                            <ReadBank
                                styles={bankStyles}
                                showBankDetails={true}
                                currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_id ===
                                            finalTaxInvoice?.currency_id
                                    )?.currency_abv
                                }
                                primary_currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_name ===
                                            finalTaxInvoice
                                                ?.primary_bank_details
                                                ?.currency_name
                                    )?.currency_abv
                                }
                                secondary_currency_abv={
                                    currencies?.find(
                                        (currency) =>
                                            currency.currency_name ===
                                            finalTaxInvoice
                                                ?.primary_bank_details
                                                ?.currency_name
                                    )?.currency_abv
                                }
                                primary_bank={
                                    finalTaxInvoice?.primary_bank_details
                                }
                                secondary_bank={
                                    finalTaxInvoice?.secondary_bank_details
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
                                            finalTaxInvoice?.currency_id
                                    )?.currency_abv
                                }
                                currency_conversion_rate={
                                    finalTaxInvoice?.currency_conversion_rate
                                }
                                subTotal={subTotal}
                                discount={discount}
                                tax={tax}
                                total={total}
                                groupedItems={groupedItems}
                                terms_and_conditions={
                                    finalTaxInvoice?.terms_and_conditions
                                }
                                showTax={isUserTaxRegistered}
                            />
                            <TemplateBranding />
                        </div>
                    </div>
                </DeviceRestriction>
                <DueAmountCard
                    title={"Tax Invoice"}
                    due_amount={finalTaxInvoice?.due_amount}
                    currency_abv={
                        currencies?.find(
                            (currency) =>
                                currency.currency_id ===
                                finalTaxInvoice?.currency_id
                        )?.currency_abv
                    }
                    linked_item1={finalTaxInvoice?.linked_receipts}
                    linked_item2={finalTaxInvoice?.linked_credit_notes}
                />
                <PDFTemplateModal
                    isOpen={isPDFTemplateModalOpen}
                    onClose={togglePDFTemplateModal}
                    onSelect={onSelectPDFTemplate}
                />
            </div>

            <MarkAsPaidModal
                onClose={() => setMarkAsPaidModal(false)}
                taxInvoice={finalTaxInvoice}
                user={user}
                client={client}
                isOpen={markAsPaidModal}
            />
        </>
    );
};

export default TaxInvoiceReadLayout;
