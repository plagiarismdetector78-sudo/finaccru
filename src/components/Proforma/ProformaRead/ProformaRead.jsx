import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import {
    getProformaDetails,
    markProformaSent,
    markProformaVoid,
} from "../../../Actions/Proforma";
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

const ProformaReadLayout = () => {
    const proforma_id = window.location.pathname.split("/")[3];

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const { loading, proforma } = useSelector((state) => state.proformaReducer);
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
        dispatch(getProformaDetails(proforma_id));
    }, [dispatch, proforma_id]);

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

                    overAllRate += tax; // Adjust the overall rate to exclude tax  //adjusting this to amount field
                } else {
                    // Add tax on top (for tax-exclusive)
                    tax = overAllRate * (taxPercentage / 100);
                }

                taxAmount += tax;
            }

            // Store the tax amount for this item
            calculatedTax.push(parseFloat(tax.toFixed(2)));

            // Return the final line total
            return parseFloat(overAllRate.toFixed(2));
        });

        // Update state with calculated totals
        setSubTotal(parseFloat(subTotalAmount.toFixed(2)));
        setDiscount(parseFloat(discountAmount.toFixed(2)));
        setTax(parseFloat(taxAmount.toFixed(2)));
        setTotal(
            parseFloat((subTotalAmount - discountAmount + taxAmount).toFixed(2))
        );
        setItemTax(calculatedTax);

        return calculateFinalAmount;
    };

    useEffect(() => {
        const amount = calculateTotalAmounts(
            proforma?.line_items,
            setSubTotal,
            setDiscount,
            setTax,
            setTotal,
            setItemTax,
            taxRates
        );
        setItemTotal(amount);
    }, [proforma, taxRates]);

    // === VIEW COMPONENT IMPLEMENTATION ===
    // In the view component, use the unified calculation
    useEffect(() => {
        // Exit early if required data is not available
        if (!proforma?.line_items || !taxRates) {
            return;
        }

        try {
            const calculationResult = calculateItemTaxes(
                proforma.line_items,
                taxRates,
                true // showTax parameter
            );

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
    }, [proforma, taxRates]);

    const showBankDetails = true;
    const showTax = isUserTaxRegistered;

    const contents = ReadContent(
        showBankDetails,
        "Proforma Invoice",
        proforma,
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
        dispatch(markProformaSent(window.location.pathname.split("/")[3]));
    };

    const handleMarkAsVoid = () => {
        dispatch(markProformaVoid(window.location.pathname.split("/")[3]));
    };

    const handleEdit = () => {
        navigate(`/proforma/edit/${proforma?.pi_id}`);
    };

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <>
            <div>
                <Breadcrumb
                    item={{
                        label: "Proforma",
                        viewLabel: "View Proforma",
                    }}
                />
                <div className="flex items-center justify-end mt-4 gap-3 w-fit ml-auto md:gap-4">
                    {proforma?.pi_status === "Draft" && (
                        <Button
                            icon={Share}
                            text="Send Invoice"
                            variant="outlined"
                            onClick={handleMarkAsSent}
                            className="w-full sm:w-auto"
                        />
                    )}

                    {proforma?.pi_status === "Draft" && (
                        <Button
                            icon={Ban}
                            text="Void Proforma"
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
                        heading={"Proforma Invoice"}
                        templatePath={selectedPDFTemplate?.key}
                        logo={user?.clientInfo?.company_logo_url}
                        name={proforma?.pi_number}
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
                            title={"Proforma Invoice"}
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
                            number={proforma?.pi_number}
                            date={proforma?.pi_date}
                            due_date={proforma?.due_date}
                            reference={proforma?.reference}
                        />
                        <ReadFor
                            title={"Proforma Invoice"}
                            styles={forStyles}
                            customer_name={proforma?.customer?.customer_name}
                            billing_address_line_1={
                                proforma?.customer?.billing_address_line_1
                            }
                            billing_address_line_2={
                                proforma?.customer?.billing_address_line_2
                            }
                            billing_address_line_3={
                                proforma?.customer?.billing_address_line_3
                            }
                            billing_state={proforma?.customer?.billing_state}
                            billing_country={
                                proforma?.customer?.billing_country
                            }
                            shipping_address_line_1={
                                proforma?.customer?.shipping_address_details
                                    ?.address_line_1
                            }
                            shipping_address_line_2={
                                proforma?.customer?.shipping_address_details
                                    ?.address_line_2
                            }
                            shipping_address_line_3={
                                proforma?.customer?.shipping_address_details
                                    ?.address_line_3
                            }
                            shipping_state={
                                proforma?.customer?.shipping_address_details
                                    ?.state
                            }
                            shipping_country={
                                proforma?.customer?.shipping_address_details
                                    ?.country
                            }
                            trn={proforma?.customer?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_id ===
                                        proforma?.currency_id
                                )?.currency_abv
                            }
                            currency_conversion_rate={
                                proforma?.currency_conversion_rate
                            }
                            subject={proforma?.subject}
                        />
                        <div className="read__items">
                            {proforma?.line_items?.map((item, index) => (
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
                                        proforma?.currency_id
                                )?.currency_abv
                            }
                            primary_currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_name ===
                                        proforma?.primary_bank_details
                                            ?.currency_name
                                )?.currency_abv
                            }
                            secondary_currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_name ===
                                        proforma?.primary_bank_details
                                            ?.currency_name
                                )?.currency_abv
                            }
                            subTotal={subTotal}
                            discount={discount}
                            tax={tax}
                            total={total}
                            showBankDetails={true}
                            primary_bank={proforma?.primary_bank_details}
                            secondary_bank={proforma?.secondary_bank_details}
                            showTax={isUserTaxRegistered}
                        />
                        <ReadTax
                            styles={taxStyles}
                            currency_abv={
                                currencies?.find(
                                    (currency) =>
                                        currency.currency_id ===
                                        proforma?.currency_id
                                )?.currency_abv
                            }
                            currency_conversion_rate={
                                proforma?.currency_conversion_rate
                            }
                            subTotal={subTotal}
                            discount={discount}
                            tax={tax}
                            total={total}
                            groupedItems={groupedItems}
                            terms_and_conditions={
                                proforma?.terms_and_conditions
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

export default ProformaReadLayout;
