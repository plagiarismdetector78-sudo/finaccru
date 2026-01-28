import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

import {
    createTaxInvoice,
    getTaxInvoiceDetails,
    getNewTaxInvoiceNumber,
    updateTaxInvoice,
    getExtractedTaxInvoiceDetails,
    convertStagingToTaxInvoice,
} from "../../../Actions/TaxInvoice";
import { getCurrency } from "../../../Actions/Onboarding";
import { getCustomerDetails } from "../../../Actions/Customer";
import { getEstimateDetails } from "../../../Actions/Estimate";
import { getProformaDetails } from "../../../Actions/Proforma";
import { readOpenCreditNotesForCustomer } from "../../../Actions/CreditNote";
import { readOpenPaymentsForCustomer } from "../../../Actions/Payment";
import { readAccountantClient } from "../../../Actions/Accountant";
import { getBankList } from "../../../Actions/Bank";

import TaxInvoiceLayoutP1 from "./TaxInvoiceLayoutP1/TaxInvoiceLayoutP1";
import TaxInvoiceLayoutP2 from "./TaxInvoiceLayoutP2/TaxInvoiceLayoutP2";

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import { LoadingOutlined } from "@ant-design/icons";

import { Document, Page, pdfjs } from "react-pdf";
import DeviceRestriction from "../../common/DeviceRestriction";
import Button from "../../common/Button";
import TemplateBranding from "../../WebTemplates/TemplateBranding";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import Breadcrumb from "../../common/BreadCrumb";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const TaxInvoiceLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const [taxInvoiceNumber, setTaxInvoiceNumber] = useState("");
    const [taxInvoiceDate, setTaxInvoiceDate] = useState(
        moment().format("YYYY-MM-DD")
    );
    const [validTill, setValidTill] = useState(moment().format("YYYY-MM-DD"));
    const [reference, setReference] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [customerId, setCustomerId] = useState(null);
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [subject, setSubject] = useState(null);
    const [termsAndConditions, setTermsAndConditions] = useState(null);
    const [isSetDefaultTncCustomer, setIsSetDefaultTncCustomer] =
        useState(false);
    const [isSetDefaultTncClient, setIsSetDefaultTncClient] = useState(false);
    const [items, setItems] = useState([
        {
            item_name: "",
            unit: "",
            qty: null,
            rate: null,
            discount: 0,
            is_percentage_discount: true,
            is_inclusive: false,
            tax_id: isUserTaxRegistered ? 1 : null,
            description: null,
        },
    ]);
    const [shippingLabel, setShippingLabel] = useState(null);
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [shippingAddress1, setShippingAddress1] = useState(null);
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingState, setShippingState] = useState(null);
    const [shippingCountry, setShippingCountry] = useState(null);
    const [currency, setCurrency] = useState("AED");
    const [attachmentUrl, setAttachmentUrl] = useState(null);
    const [paymentReceivedValue, setPaymentReceivedValue] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [primaryBankId, setPrimaryBankId] = useState(null);
    const [secondaryBankId, setSecondaryBankId] = useState(null);
    const [primaryBankDetails, setPrimaryBankDetails] = useState(null);
    const [secondaryBankDetails, setSecondaryBankDetails] = useState(null);
    const [paymentList, setPaymentList] = useState([]);
    const [creditNoteList, setCreditNoteList] = useState([]);
    const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);
    const [dueAmount, setDueAmount] = useState(null);
    const [linkReceipts, setLinkReceipts] = useState([]);
    const [linkCreditNotes, setLinkCreditNotes] = useState([]);

    const actionType = searchParams.get("action_type");

    const setPaymentOptionsNull = () => {
        setPaymentReceivedValue(null);
        setBankId(null);
        setPaymentList([]);
        setCreditNoteList([]);
    };

    const { client } = useSelector((state) => state.accountantReducer);

    const type =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[6]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[4]
            : window.location.pathname.split("/")[2];
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
    const isAdd = type === "create";

    const {
        loading: taxInvoiceLoading,
        taxInvoice,
        number,
        extractedTaxInvoice,
    } = useSelector((state) => state.taxInvoiceReducer);
    const { estimate } = useSelector((state) => state.estimateReducer);
    const { proforma } = useSelector((state) => state.proformaReducer);
    const { currencies } = useSelector((state) => state.onboardingReducer);
    const { customer } = useSelector((state) => state.customerReducer);

    const convert = searchParams.get("convert");
    const reference_id = searchParams.get("reference_id");
    const referenceName = searchParams.get("reference");
    const extracted = searchParams.get("extracted");
    const location = useLocation();

    const hasUserEditedTnC = useRef(false);

    useEffect(() => {
        if (type === "edit" && !extracted) {
            dispatch(getCurrency());
            dispatch(getTaxInvoiceDetails(ti_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        } else if (extracted) {
            dispatch(getCurrency());
            dispatch(
                getExtractedTaxInvoiceDetails(ti_id, user?.localInfo?.role)
            );
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === "create") {
            dispatch(getCurrency());
            dispatch(getNewTaxInvoiceNumber());
            if (convert) {
                if (referenceName === "estimate") {
                    dispatch(getEstimateDetails(reference_id)).then(() => {
                        if (estimate?.customer?.customer_id) {
                            dispatch(
                                getCustomerDetails(
                                    estimate.customer.customer_id
                                )
                            );
                        }
                    });
                }
                if (referenceName === "proforma") {
                    dispatch(getProformaDetails(reference_id)).then(() => {
                        if (proforma?.customer?.customer_id) {
                            dispatch(
                                getCustomerDetails(
                                    proforma.customer.customer_id
                                )
                            );
                        }
                    });
                }
            }
        }
    }, [
        dispatch,
        convert,
        reference_id,
        referenceName,
        ti_id,
        type,
        user?.localInfo?.role,
        client_id,
    ]);

    useEffect(() => {
        // Load bank list first when creating from proforma
        if (type === "create" && convert && referenceName === "proforma") {
            dispatch(getBankList(1)).then(() => {
                dispatch(getProformaDetails(reference_id));
            });
        }
    }, [dispatch, convert, referenceName, reference_id, type]);

    useEffect(() => {
        if (type === "create") {
            dispatch(getCurrency());
            dispatch(getNewTaxInvoiceNumber());
            if (convert) {
                if (referenceName === "estimate") {
                    // console.log("calling get est");
                    dispatch(getEstimateDetails(reference_id));
                }
                if (referenceName === "proforma") {
                    dispatch(getProformaDetails(reference_id));
                }
            }
        }
    }, [dispatch, convert, reference_id, referenceName, type]);

    useEffect(() => {
        if (
            convert &&
            referenceName === "estimate" &&
            estimate?.customer?.customer_id
        ) {
            // console.log("calling get cus");
            dispatch(getCustomerDetails(estimate.customer.customer_id));
        }
    }, [estimate, convert, referenceName, dispatch]);

    useEffect(() => {
        if (
            convert &&
            referenceName === "proforma" &&
            proforma?.customer?.customer_id
        ) {
            dispatch(getCustomerDetails(proforma.customer.customer_id));
            if (proforma?.primary_bank_details) {
                setPrimaryBankId(proforma.primary_bank_details.bank_id);
                setPrimaryBankDetails(proforma.primary_bank_details);
            }
            if (proforma?.secondary_bank_details) {
                setSecondaryBankId(proforma.secondary_bank_details.bank_id);
                setSecondaryBankDetails(proforma.secondary_bank_details);
            }
        }
    }, [proforma, convert, referenceName, dispatch]);

    useEffect(() => {
        if (type === "edit") {
            if (!customerId && !currencyId) {
                if (user?.localInfo?.role) {
                    return;
                }
                dispatch(getCustomerDetails(taxInvoice?.customer?.customer_id));
                dispatch(
                    readOpenCreditNotesForCustomer(
                        taxInvoice?.customer?.customer_id,
                        taxInvoice?.currency_id,
                        user?.localInfo?.role,
                        client_id
                    )
                );
                dispatch(
                    readOpenPaymentsForCustomer(
                        taxInvoice?.customer?.customer_id,
                        taxInvoice?.currency_id,
                        user?.localInfo?.role,
                        client_id
                    )
                );
            }
        }
    }, [
        dispatch,
        taxInvoice?.customer?.customer_id,
        taxInvoice?.currency_id,
        type,
        user?.localInfo?.role,
        client_id,
    ]);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] === "edit" && taxInvoice) {
            if (taxInvoice?.customer) {
                dispatch(getCustomerDetails(taxInvoice?.customer?.customer_id));
            }

            // Set bank details from taxInvoice if they exist
            if (taxInvoice?.primary_bank_details?.bank_id) {
                setPrimaryBankId(taxInvoice?.primary_bank_details.bank_id);
            }
            if (taxInvoice?.secondary_bank_details?.bank_id) {
                setSecondaryBankId(taxInvoice.secondary_bank_details.bank_id);
            }
        }
    }, [dispatch, taxInvoice]);

    useEffect(() => {
        if (customerId === null && !user?.clientInfo?.terms_and_conditions) {
            setTermsAndConditions("");
            return;
        }
        setTermsAndConditions(
            customer?.terms_and_conditions
                ? customer?.terms_and_conditions
                : termsAndConditions
        );
    }, [
        customer,
        customerId,
        termsAndConditions,
        user?.clientInfo?.terms_and_conditions,
    ]);

    useEffect(() => {
        if (customerId && currencyId) {
            // if (user?.localInfo?.role) {
            //     return;
            // }
            dispatch(readOpenCreditNotesForCustomer(customerId, currencyId));
            dispatch(readOpenPaymentsForCustomer(customerId, currencyId));
        }
    }, [dispatch, customerId, currencyId, user?.localInfo?.role]);

    useEffect(() => {
        if (type === "edit" && !extracted) {
            setTaxInvoiceNumber(taxInvoice?.ti_number);
            setTaxInvoiceDate(moment(taxInvoice?.ti_date).format("YYYY-MM-DD"));
            setValidTill(moment(taxInvoice?.due_date).format("YYYY-MM-DD"));
            setReference(taxInvoice?.reference);
            setCustomerName(taxInvoice?.customer?.customer_name);
            setCustomerId(taxInvoice?.customer?.customer_id);
            setCurrencyId(taxInvoice?.currency_id);
            setCurrencyConversionRate(taxInvoice?.currency_conversion_rate);
            setCurrency(
                currencyId !== 1
                    ? currencies?.find(
                          (currency) =>
                              currency.currency_id === taxInvoice?.currency_id
                      )?.currency_abv
                    : "AED"
            );
            const updatedItems = taxInvoice?.line_items?.map((item) => ({
                ...item,
                is_inclusive: item.is_inclusive || false,
            })) || [
                {
                    item_name: "",
                    unit: "",
                    qty: null,
                    rate: null,
                    discount: 0,
                    is_percentage_discount: true,
                    is_inclusive: false,
                    tax_id: isUserTaxRegistered ? 1 : null,
                    description: null,
                },
            ];

            setItems(updatedItems);
            setShippingAddressId(
                taxInvoice?.customer?.shipping_address_details
                    ?.shipping_address_id
            );

            setShippingAddress1(
                taxInvoice?.customer?.shipping_address_details?.address_line_1
            );

            setShippingAddress2(
                taxInvoice?.customer?.shipping_address_details?.address_line_2
            );

            setShippingAddress3(
                taxInvoice?.customer?.shipping_address_details?.address_line_3
            );

            setShippingState(
                taxInvoice?.customer?.shipping_address_details?.state
            );

            setShippingCountry(
                taxInvoice?.customer?.shipping_address_details?.country
            );

            setShippingLabel(
                taxInvoice?.customer?.shipping_address_details?.label
            );

            setPrimaryBankDetails(taxInvoice?.primary_bank_details);

            setSecondaryBankDetails(taxInvoice?.secondary_bank_details);

            setSubject(taxInvoice?.subject);
            setTermsAndConditions(taxInvoice?.terms_and_conditions);
            setIsSetDefaultTncCustomer(taxInvoice?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(taxInvoice?.is_set_default_tnc_client);
            setPaymentReceivedValue(taxInvoice?.payment === null ? 2 : 1);

            setPaymentList(
                taxInvoice?.payment !== null
                    ? taxInvoice?.linked_receipts?.map(
                          (receipt) => receipt.receipt_id
                      )
                    : []
            );
            setCreditNoteList(
                taxInvoice?.payment !== null
                    ? taxInvoice?.linked_credit_notes?.map(
                          (creditNote) => creditNote.cn_id
                      )
                    : []
            );

            const dueAmountValue = parseFloat(taxInvoice?.due_amount);
            setDueAmount(!isNaN(dueAmountValue) && dueAmountValue !== 0);

            setLinkCreditNotes(taxInvoice?.linked_credit_notes);
            setLinkReceipts(taxInvoice?.linked_receipts);
        } else if (extracted) {
            if (extractedTaxInvoice?.ti_number) {
                if (extractedTaxInvoice?.ti_number.startsWith("INV")) {
                    setTaxInvoiceNumber(extractedTaxInvoice?.ti_number);
                } else {
                    setTaxInvoiceNumber(
                        `INV-${extractedTaxInvoice?.ti_number}`
                    );
                }
            } else {
                setTaxInvoiceNumber(number);
            }
            setTaxInvoiceDate(
                moment(extractedTaxInvoice?.ti_date).format("YYYY-MM-DD")
            );
            setValidTill(
                moment(extractedTaxInvoice?.due_date).format("YYYY-MM-DD")
            );
            setReference(extractedTaxInvoice?.reference || null);
            setCustomerName(extractedTaxInvoice?.customer?.customer_name || "");
            setCustomerId(extractedTaxInvoice?.customer?.customer_id || null);
            setCurrencyId(extractedTaxInvoice?.currency_id || 1);
            setCurrencyConversionRate(
                extractedTaxInvoice?.currency_conversion_rate || 1
            );
            setCurrency(
                currencyId !== 1
                    ? currencies?.find(
                          (currency) =>
                              currency.currency_id ===
                              extractedTaxInvoice?.currency_id
                      )?.currency_abv
                    : "AED"
            );
            setItems(
                extractedTaxInvoice?.line_items || [
                    {
                        item_name: "",
                        unit: "",
                        qty: null,
                        rate: null,
                        discount: 0,
                        is_percentage_discount: true,
                        tax_id: isUserTaxRegistered ? 1 : null,
                        is_inclusive: false,
                        description: null,
                    },
                ]
            );
            setShippingAddressId(
                taxInvoice?.customer?.shipping_address_details
                    ?.shipping_address_id
            );
            setShippingAddress1(
                taxInvoice?.customer?.shipping_address_details?.address_line_1
            );
            setShippingAddress2(
                taxInvoice?.customer?.shipping_address_details?.address_line_2
            );
            setShippingAddress3(
                taxInvoice?.customer?.shipping_address_details?.address_line_3
            );
            setShippingState(
                taxInvoice?.customer?.shipping_address_details?.state
            );
            setShippingCountry(
                taxInvoice?.customer?.shipping_address_details?.country
            );
            setShippingLabel(
                taxInvoice?.customer?.shipping_address_details?.label
            );
            setPrimaryBankDetails(taxInvoice?.primary_bank_details);

            setSecondaryBankDetails(taxInvoice?.secondary_bank_details);
            setSubject(extractedTaxInvoice?.subject || null);
            setTermsAndConditions(extractedTaxInvoice?.terms_and_conditions);
            setIsSetDefaultTncCustomer(
                extractedTaxInvoice?.is_set_default_tnc_customer
            );
            setIsSetDefaultTncClient(
                extractedTaxInvoice?.is_set_default_tnc_client
            );
            setPaymentReceivedValue(2);
        }
        if (type === "create") {
            setTaxInvoiceNumber(number);
            setTermsAndConditions(user?.clientInfo?.terms_and_conditions);
            if (convert) {
                if (referenceName == "estimate") {
                    setCurrencyConversionRate(
                        estimate?.currency_conversion_rate
                    );
                    setCurrencyId(estimate?.currency_id);
                    setCurrency(
                        currencyId !== 1
                            ? currencies?.find(
                                  (currency) =>
                                      currency.currency_id ===
                                      estimate?.currency_id
                              )?.currency_abv
                            : "AED"
                    );
                    setItems(
                        estimate?.line_items || [
                            {
                                item_name: "",
                                unit: "",
                                qty: null,
                                rate: null,
                                discount: 0,
                                is_percentage_discount: true,
                                tax_id: isUserTaxRegistered ? 1 : 0,
                                is_inclusive: false,
                                description: null,
                            },
                        ]
                    );
                    setReference(estimate?.estimate_number);
                    setSubject(estimate?.subject);
                    setTermsAndConditions(estimate?.terms_and_conditions);
                    setCustomerId(estimate?.customer?.customer_id);
                    setCustomerName(estimate?.customer?.customer_name);
                    setShippingAddressId(
                        estimate?.customer?.shipping_address_details
                            ?.shipping_address_id
                    );
                    setShippingAddress1(
                        estimate?.customer?.shipping_address_details
                            ?.address_line_1
                    );
                    setShippingAddress2(
                        estimate?.customer?.shipping_address_details
                            ?.address_line_2
                    );
                    setShippingAddress3(
                        estimate?.customer?.shipping_address_details
                            ?.address_line_3
                    );
                    setShippingState(
                        estimate?.customer?.shipping_address_details?.state
                    );
                    setShippingCountry(
                        estimate?.customer?.shipping_address_details?.country
                    );
                    setShippingLabel(
                        estimate?.customer?.shipping_address_details?.label
                    );
                    setPrimaryBankDetails(estimate?.primary_bank_details);

                    setSecondaryBankDetails(estimate?.secondary_bank_details);
                }
                if (referenceName == "proforma") {
                    setCurrencyConversionRate(
                        proforma?.currency_conversion_rate
                    );
                    setCurrencyId(proforma?.currency_id);
                    setCurrency(
                        currencyId !== 1
                            ? currencies?.find(
                                  (currency) =>
                                      currency.currency_id ===
                                      proforma?.currency_id
                              )?.currency_abv
                            : "AED"
                    );
                    setItems(
                        proforma?.line_items || [
                            {
                                item_name: "",
                                unit: "",
                                qty: null,
                                rate: null,
                                discount: 0,
                                is_percentage_discount: true,
                                tax_id: isUserTaxRegistered ? 1 : 0,
                                description: null,
                            },
                        ]
                    );
                    setReference(proforma?.pi_number);
                    setSubject(proforma?.subject);
                    setTermsAndConditions(proforma?.terms_and_conditions);
                    setCustomerId(proforma?.customer?.customer_id);
                    setCustomerName(proforma?.customer?.customer_name);
                    setShippingAddressId(
                        proforma?.customer?.shipping_address_details
                            ?.shipping_address_id
                    );
                    setShippingAddress1(
                        proforma?.customer?.shipping_address_details
                            ?.address_line_1
                    );
                    setShippingAddress2(
                        proforma?.customer?.shipping_address_details
                            ?.address_line_2
                    );
                    setShippingAddress3(
                        proforma?.customer?.shipping_address_details
                            ?.address_line_3
                    );
                    setShippingState(
                        proforma?.customer?.shipping_address_details?.state
                    );
                    setShippingCountry(
                        proforma?.customer?.shipping_address_details?.country
                    );
                    setShippingLabel(
                        proforma?.customer?.shipping_address_details?.label
                    );
                    setPrimaryBankDetails(proforma?.primary_bank_details);

                    setSecondaryBankDetails(proforma?.secondary_bank_details);
                }
            }
        }
    }, [
        currencies,
        taxInvoice,
        extractedTaxInvoice,
        number,
        estimate,
        proforma,
        convert,
        reference_id,
        referenceName,
        location.state,
        user?.clientInfo?.terms_and_conditions,
        type,
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taxInvoiceLoading) {
            return;
        }
        if (taxInvoiceNumber == "") {
            toast.error("Please enter tax invoice number.");
            return;
        }
        if (taxInvoiceDate == "") {
            toast.error("Please select tax invoice date.");
            return;
        }
        if (validTill == "") {
            toast.error("Please select valid till date.");
            return;
        }
        if (customerId == null) {
            toast.error("Please select customer.");
            return;
        }
        // if (!sameAsBillingAddress && shippingAddress1 === null) {
        //     toast.error("Please select shipping details.");
        //     return;
        // }
        // if (paymentReceivedValue === 1 && !bankId) {
        //     toast.error("Please select a payment method");
        //     return;
        // }
        if (currencyId == null) {
            toast.error("Please select currency.");
            return;
        }
        if (currencyConversionRate <= 0) {
            toast.error("Currency conversion rate should be greater than 0.");
            return;
        }
        if (
            items.some(
                (item) => item.item_name === "" || item.item_name == null
            )
        ) {
            toast.error("Item name cannot be empty.");
            return;
        }
        if (items.some((item) => item.unit === "" || item.unit == null)) {
            toast.error("Unit cannot be empty.");
            return;
        }
        if (items.some((item) => item.qty <= 0 || item.qty == null)) {
            toast.error("Quantity should be greater than 0.");
            return;
        }
        if (items.some((item) => item.rate <= 0 || item.rate == null)) {
            toast.error("Rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.discount < 0 || item.discount == null)) {
            toast.error("Discount should be greater than or equal to 0.");
            return;
        }
        const data = {
            customer_id: customerId,
            ti_number: taxInvoiceNumber,
            ti_date: taxInvoiceDate,
            due_date: validTill,
            reference: reference === "" ? null : reference,
            subject: subject === "" ? null : subject,
            terms_and_conditions:
                termsAndConditions === "" ? null : termsAndConditions,
            is_set_default_tnc_customer: isSetDefaultTncCustomer,
            is_set_default_tnc_client: isSetDefaultTncClient,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
            shipping_address_id: shippingAddressId,
            attachment_url: attachmentUrl === "" ? null : attachmentUrl,
            primary_bank_id: primaryBankId,
            secondary_bank_id: secondaryBankId || null,
            payment:
                bankId === null
                    ? null
                    : {
                          bank_id: bankId,
                          payments_list:
                              paymentList?.length === 0 ? [] : paymentList,
                          credit_notes_list:
                              creditNoteList?.length === 0
                                  ? []
                                  : creditNoteList,
                      },
        };
        if (isAdd) {
            dispatch(createTaxInvoice(data, navigate));
        } else if (type === "edit" && !extracted) {
            dispatch(
                updateTaxInvoice(ti_id, data, navigate, user?.localInfo?.role)
            );
        } else if (extracted) {
            dispatch(
                convertStagingToTaxInvoice(
                    extractedTaxInvoice?.staging_id,
                    data,
                    user?.localInfo?.role
                )
            );
        }
    };

    // PDF Viewer
    const [pdfError, setPdfError] = useState(null);
    const [pdfPages, setPdfPages] = useState(null);
    const [pdfPage, setPdfPage] = useState(1);
    const [pdfScale, setPdfScale] = useState(1.5);
    const [pdfRotation, setPdfRotation] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setPdfPages(numPages);
    };

    const onError = (error) => {
        setPdfError(error.message);
    };

    const onPageChange = (page) => {
        if (page < 1 || page > pdfPages) return;
        setPdfPage(page);
    };
    return (
        <DeviceRestriction>
            <Fragment>
                <Breadcrumb
                    item={{
                        label: isUserTaxRegistered ? "Tax Invoice" : "Invoice",
                        viewLabel:
                            actionType == "edit"
                                ? "Edit Invoice"
                                : "Create Invoice",
                    }}
                />
                <div className="mx-auto flex mt-4 items-center justify-center">
                    <div className="bg-white lg:min-w-[700px] border">
                        <TemplateHeader
                            title={
                                isUserTaxRegistered ? "Tax Invoice" : "Invoice"
                            }
                            logo={user?.clientInfo?.company_logo_url}
                        />

                        <form>
                            <TaxInvoiceLayoutP1
                                taxInvoiceNumber={taxInvoiceNumber}
                                setTaxInvoiceNumber={setTaxInvoiceNumber}
                                taxInvoiceDate={taxInvoiceDate}
                                setTaxInvoiceDate={setTaxInvoiceDate}
                                validTill={validTill}
                                setValidTill={setValidTill}
                                reference={reference}
                                setReference={setReference}
                                customerName={customerName}
                                setCustomerName={setCustomerName}
                                customerId={customerId}
                                setCustomerId={setCustomerId}
                                currency={currency}
                                setCurrency={setCurrency}
                                currencyId={currencyId}
                                setCurrencyId={setCurrencyId}
                                currencyConversionRate={currencyConversionRate}
                                setCurrencyConversionRate={
                                    setCurrencyConversionRate
                                }
                                subject={subject}
                                setSubject={setSubject}
                                shippingLabel={shippingLabel}
                                setShippingLabel={setShippingLabel}
                                shippingAddressId={shippingAddressId}
                                setShippingAddressId={setShippingAddressId}
                                shippingAddress1={shippingAddress1}
                                setShippingAddress1={setShippingAddress1}
                                shippingAddress2={shippingAddress2}
                                setShippingAddress2={setShippingAddress2}
                                shippingAddress3={shippingAddress3}
                                setShippingAddress3={setShippingAddress3}
                                shippingCountry={shippingCountry}
                                setShippingCountry={setShippingCountry}
                                shippingState={shippingState}
                                setShippingState={setShippingState}
                                termsAndConditions={termsAndConditions}
                                setTermsAndConditions={setTermsAndConditions}
                                convert={convert}
                                setPaymentOptionsNull={setPaymentOptionsNull}
                                extracted={extracted}
                                sameAsBillingAddress={sameAsBillingAddress}
                                setSameAsBillingAddress={
                                    setSameAsBillingAddress
                                }
                                primaryBankId={primaryBankId}
                                secondaryBankId={secondaryBankId}
                                setPrimaryBankId={setPrimaryBankId}
                                setSecondaryBankId={setSecondaryBankId}
                                primaryBankDetails={primaryBankDetails}
                                secondaryBankDetails={secondaryBankDetails}
                            />
                            <TaxInvoiceLayoutP2
                                items={items}
                                setItems={setItems}
                                currency={currency}
                                currencies={currencies}
                                termsAndConditions={termsAndConditions}
                                setTermsAndConditions={setTermsAndConditions}
                                isSetDefaultTncCustomer={
                                    isSetDefaultTncCustomer
                                }
                                setIsSetDefaultTncCustomer={
                                    setIsSetDefaultTncCustomer
                                }
                                isSetDefaultTncClient={isSetDefaultTncClient}
                                setIsSetDefaultTncClient={
                                    setIsSetDefaultTncClient
                                }
                                bankId={bankId}
                                setBankId={setBankId}
                                paymentList={paymentList}
                                setPaymentList={setPaymentList}
                                creditNoteList={creditNoteList}
                                setCreditNoteList={setCreditNoteList}
                                customerId={customerId}
                                paymentReceivedValue={paymentReceivedValue}
                                setPaymentReceivedValue={
                                    setPaymentReceivedValue
                                }
                                setPaymentOptionsNull={setPaymentOptionsNull}
                                showTax={isUserTaxRegistered}
                                dueAmount={
                                    dueAmount === null ? true : dueAmount
                                }
                                linkReceipts={linkReceipts}
                                linkCreditNotes={linkCreditNotes}
                            />
                            <div className="w-fit ml-auto p-5">
                                <Button
                                    disabled={taxInvoiceLoading}
                                    text={
                                        taxInvoiceLoading
                                            ? "Please Wait..."
                                            : actionType === "edit"
                                            ? "Edit  Invoice"
                                            : "Create Invoice"
                                    }
                                    onClick={handleSubmit}
                                />
                            </div>
                        </form>
                        <TemplateBranding />
                    </div>
                </div>
                {extracted && (
                    <div className="pdf__viewer-main">
                        <div className="pdf__viewer">
                            <Document
                                file={extractedTaxInvoice?.attachment_url.replace(
                                    extractedTaxInvoice?.attachment_url
                                        .split("/")
                                        .slice(0, 3)
                                        .join("/"),
                                    ""
                                )}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onError}
                                loading={<LoadingOutlined />}
                            >
                                <Page
                                    pageNumber={pdfPage}
                                    scale={pdfScale}
                                    rotate={pdfRotation}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </Document>
                            {pdfError && (
                                <div className="pdf__viewer--error">
                                    {pdfError}
                                </div>
                            )}
                            {pdfError && (
                                <a
                                    href={extractedTaxInvoice?.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="pdf__viewer--error"
                                >
                                    Download
                                </a>
                            )}
                        </div>
                        {pdfPages && (
                            <div className="pdf__viewer--controls">
                                <button
                                    onClick={() => onPageChange(pdfPage - 1)}
                                    disabled={pdfPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    {pdfPage} of {pdfPages}
                                </span>
                                <button
                                    onClick={() => onPageChange(pdfPage + 1)}
                                    disabled={pdfPage === pdfPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Fragment>
        </DeviceRestriction>
    );
};

export default TaxInvoiceLayout;
