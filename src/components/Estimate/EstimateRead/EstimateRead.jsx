import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import {
    getEstimateDetails,
    markEstimateSent,
    markEstimateVoid,
} from "../../../Actions/Estimate";
import { getCurrency, getTaxRate } from "../../../Actions/Onboarding";

// Styles
import "../../../Styles/Read.css";

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

// Functions
import ReadContent from "../../../utils/ReadContent";
import Spinner from "../../common/Spinner";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import TemplateBranding from "../../WebTemplates/TemplateBranding";
import Button from "../../common/Button";
import { Ban, Edit, MousePointerClick, Share } from "lucide-react";
import PDFTemplateModal from "../../Modals/PDFTemplateModal";
import PdfDownload from "../../../Shared/PdfDownload/PdfDownload";
import { pdfTemplates } from "../../../constant";
import DeviceRestriction from "../../common/DeviceRestriction";
import Breadcrumb from "../../common/BreadCrumb";
import { calculateItemTaxes } from "../../../utils/taxCalculation";

const EstimateReadLayout = () => {
    const estimate_id = window.location.pathname.split("/")[3];

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const { loading, estimate } = useSelector((state) => state.estimateReducer);
    const { taxRates } = useSelector((state) => state.onboardingReducer);
    const { currencies } = useSelector((state) => state.onboardingReducer);
    const dispatch = useDispatch();

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
        dispatch(getEstimateDetails(estimate_id));
    }, [dispatch, estimate_id]);

    const calculateTotalAmounts = (
        line_items,
        setSubTotal,
        setDiscount,
        setTax,
        setTotal,
        setItemTax,
        taxRates
    ) => {
        let subTotalAmount = 0;
        let discountAmount = 0;
        let taxAmount = 0;

        const calculatedTax = [];
        const calculateFinalAmount = line_items?.map((item) => {
            const {
                qty,
                rate,
                discount,
                is_percentage_discount,
                tax_id,
                is_inclusive,
            } = item;

            const lineTotalBeforeDiscount = rate * qty;

            let finalRate = 0;
            let overAllRate = 0;
            if (is_percentage_discount) {
                finalRate = rate - (rate * discount) / 100;
                overAllRate = finalRate * qty;
                discountAmount += (rate - finalRate) * qty;
            } else {
                discountAmount += +discount * qty;
                overAllRate = (rate - discount) * qty;
            }

            subTotalAmount += lineTotalBeforeDiscount;

            let tax = 0;
            const taxItem = taxRates?.find((tax) => tax.tax_rate_id === tax_id);
            const taxPercentage = taxItem?.tax_percentage || 0;

            if (taxItem?.tax_percentage !== 0 && tax_id) {
                if (is_inclusive) {
                    // Extract tax from the rate (for tax-inclusive)
                    const taxFactor = 1 + taxPercentage / 100;
                    const baseAmount = overAllRate / taxFactor;

                    tax = overAllRate - baseAmount;

                    // Note: This line appears to be incorrect in original code
                    // overAllRate += tax; // should not add tax again for inclusive pricing
                    // Keeping the original behavior, but commenting it out
                } else {
                    // Add tax on top (for tax-exclusive)
                    tax = overAllRate * (taxPercentage / 100);
                }

                taxAmount += tax;
            }

            // Store the exact tax amount without rounding
            calculatedTax.push(tax);

            // Return the exact line total without rounding
            return overAllRate;
        });

        // Update state with precise values (no rounding)
        setSubTotal(subTotalAmount);
        setDiscount(discountAmount);
        setTax(taxAmount);

        setTotal(subTotalAmount - discountAmount + taxAmount);
        setItemTax(calculatedTax);

        return calculateFinalAmount;
    };

    useEffect(() => {
        const amount = calculateTotalAmounts(
            estimate?.line_items,
            setSubTotal,
            setDiscount,
            setTax,
            setTotal,
            setItemTax,
            taxRates
        );
        setItemTotal(amount);
    }, [estimate, taxRates]);

    // === VIEW COMPONENT IMPLEMENTATION ===
    // In the view component, use the unified calculation
    useEffect(() => {
        // Exit early if required data is not available
        if (!estimate?.line_items || !taxRates) {
            return;
        }

        try {
            const calculationResult = calculateItemTaxes(
                estimate.line_items,
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
    }, [estimate, taxRates]);

    const showBankDetails = false;
    const showTax = isUserTaxRegistered;

    const contents = ReadContent(
        showBankDetails,
        "Estimate",
        estimate,
        user,
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

    const handleMarkAsSent = () => {
        dispatch(markEstimateSent(window.location.pathname.split("/")[3]));
    };

    const handleMarkAsVoid = () => {
        dispatch(markEstimateVoid(window.location.pathname.split("/")[3]));
    };

    const handleEdit = () => {
        navigate(`/estimate/edit/${estimate?.estimate_id}`);
    };

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <>
            <div>
                <Breadcrumb
                    item={{
                        label: "Estimate",
                        viewLabel: "View Estimates",
                    }}
                />
                <div className="flex items-center mt-4 justify-end gap-3 w-fit ml-auto md:gap-4">
                    {estimate?.estimate_status === "Draft" && (
                        <Button
                            icon={Share}
                            text="Send Invoice"
                            variant="outlined"
                            onClick={handleMarkAsSent}
                            className="w-full sm:w-auto"
                        />
                    )}

                    {estimate?.estimate_status === "Draft" && (
                        <Button
                            icon={Ban}
                            text="Void Estimate"
                            variant="outlined"
                            onClick={handleMarkAsVoid}
                            className="text-red-500 w-full sm:w-auto border-red-500"
                        />
                    )}

                    <Button
                        icon={MousePointerClick}
                        text="Choose Template"
                        variant="outlined"
                        onClick={togglePDFTemplateModal}
                        className="w-full sm:w-auto"
                    />
                    <PdfDownload
                        heading={"Estimate"}
                        templatePath={selectedPDFTemplate?.key}
                        logo={user?.clientInfo?.company_logo_url}
                        name={estimate?.estimate_number}
                        contents={contents}
                    />
                </div>
            </div>
            <DeviceRestriction>
                <div className="w-full flex justify-center mb-32">
                    <div className="w-[70%] max-w-[60rem] mt-16 bg-white border-2 border-bg-gray">
                        <div className="">
                            <img
                                src={`/assets/images/pdf-templates/${selectedPDFTemplate?.key}/Top-New.png`}
                                alt={selectedPDFTemplate?.name}
                                className={`w-full ${
                                    selectedPDFTemplate?.key === "template-3"
                                        ? "h-0"
                                        : "h-32"
                                }`}
                            />
                        </div>
                        <TemplateHeader
                            title={"Estimate"}
                            logo={user?.clientInfo?.company_logo_url}
                            companyTitle={user?.clientInfo?.company_name}
                        />
                        <ReadHead
                            styles={headStyles}
                            address_line_1={
                                user?.clientInfo?.company_data?.address_line_1
                            }
                            address_line_2={
                                user?.clientInfo?.company_data?.address_line_2
                            }
                            address_line_3={
                                user?.clientInfo?.company_data?.address_line_3
                            }
                            company_name={
                                user?.clientInfo?.company_data?.company_name
                            }
                            country={user?.clientInfo?.company_data?.country}
                            state={user?.clientInfo?.company_data?.state}
                            vat_trn={user?.clientInfo?.company_data?.vat_trn}
                            corporate_tax_trn={
                                user?.clientInfo?.company_data
                                    ?.corporate_tax_trn
                            }
                            number={estimate?.estimate_number}
                            date={estimate?.estimate_date}
                            valid_till={estimate?.valid_till}
                            reference={estimate?.reference}
                        />
                        <ReadFor
                            title={"Estimate"}
                            styles={forStyles}
                            customer_name={estimate?.customer?.customer_name}
                            billing_address_line_1={
                                estimate?.customer?.billing_address_line_1
                            }
                            billing_address_line_2={
                                estimate?.customer?.billing_address_line_2
                            }
                            billing_address_line_3={
                                estimate?.customer?.billing_address_line_3
                            }
                            billing_state={estimate?.customer?.billing_state}
                            billing_country={
                                estimate?.customer?.billing_country
                            }
                            shipping_address_line_1={
                                estimate?.customer?.shipping_address_details
                                    ?.address_line_1
                            }
                            shipping_address_line_2={
                                estimate?.customer?.shipping_address_details
                                    ?.address_line_2
                            }
                            shipping_address_line_3={
                                estimate?.customer?.shipping_address_details
                                    ?.address_line_3
                            }
                            shipping_state={
                                estimate?.customer?.shipping_address_details
                                    ?.state
                            }
                            shipping_country={
                                estimate?.customer?.shipping_address_details
                                    ?.country
                            }
                            trn={estimate?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_id ===
                                        estimate?.currency_id
                                )?.currency_abv
                            }
                            currency_conversion_rate={
                                estimate?.currency_conversion_rate
                            }
                            subject={estimate?.subject}
                        />
                        <div className="read__items">
                            {estimate?.line_items?.map((item, index) => (
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
                                                tax.tax_rate_id === item?.tax_id
                                        )?.tax_rate_name
                                    }
                                    taxAmount={itemTax && itemTax[index]}
                                    amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                    showTax={isUserTaxRegistered}
                                />
                            ))}
                        </div>
                        {/* Bank Details */}
                        <ReadBank
                            styles={bankStyles}
                            currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_id ===
                                        estimate?.currency_id
                                )?.currency_abv
                            }
                            subTotal={subTotal}
                            discount={discount}
                            tax={tax}
                            total={total}
                            showBankDetails={false}
                            showTax={isUserTaxRegistered}
                        />
                        <ReadTax
                            styles={taxStyles}
                            currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_id ===
                                        estimate?.currency_id
                                )?.currency_abv
                            }
                            currency_conversion_rate={
                                estimate?.currency_conversion_rate
                            }
                            subTotal={subTotal}
                            discount={discount}
                            tax={tax}
                            total={total}
                            groupedItems={groupedItems}
                            terms_and_conditions={
                                estimate?.terms_and_conditions
                            }
                            showTax={isUserTaxRegistered}
                        />
                        <TemplateBranding />
                    </div>
                </div>
            </DeviceRestriction>

            {/* Modal */}
            <PDFTemplateModal
                isOpen={isPDFTemplateModalOpen}
                onClose={togglePDFTemplateModal}
                onSelect={onSelectPDFTemplate}
            />
        </>
    );
};

export default EstimateReadLayout;
