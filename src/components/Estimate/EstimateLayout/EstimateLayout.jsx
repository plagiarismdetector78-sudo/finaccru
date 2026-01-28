import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import moment from "moment";
import { getCurrency } from "../../../Actions/Onboarding";
import { getCustomerDetails } from "../../../Actions/Customer";
import {
    createEstimate,
    getEstimateDetails,
    getNewEstimateNumber,
    updateEstimate,
} from "../../../Actions/Estimate";

import EstimateFormP1 from "./EstimateFormP1/EstimateFormP1";
import EstimateFormP2 from "./EstimateFormP2/EstimateFormP2";

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import TemplateBranding from "../../WebTemplates/TemplateBranding";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import Button from "../../common/Button";
import Spinner from "../../common/Spinner";
import Breadcrumb from "../../common/BreadCrumb";
import DeviceRestriction from "../../common/DeviceRestriction";

export const user = {
    email: "l7zle@edny.net",
    mobile_number: "567890123",
    country_code: "+971",
    full_name: "l7zle@edny.net",
    company_logo_url: null,
    trade_licence_url:
        "https://finaccrustagingstorage.blob.core.windows.net/company-trade-licenses/YNF1qp8R88YE7SmTQ63wb6c5bii2_trade_license.png",
    moa_url:
        "https://finaccrustagingstorage.blob.core.windows.net/company-moas/YNF1qp8R88YE7SmTQ63wb6c5bii2_moa.png",
    emirates_id_url: null,
    passport_url: null,
    vat_url: null,
    vat_string: null,
    corporate_tax_certificate_url: null,
    terms_and_conditions: null,
    company_data: {
        company_id: 118,
        company_name: "Startk Industries",
        trade_license_number: "123456789",
        corporate_tax_trn: null,
        vat_trn: null,
        company_type_id: 6,
        company_type_name: "Legal Person - Foreign Businesses",
        industry: "Professional, scientific and technical activities",
        address_line_1: "Denever, California",
        address_line_2: null,
        address_line_3: null,
        country: "United Arab Emirates",
        state: "Dubai",
        po_box: null,
        email: "tony@stackindustries.com",
        telephone_number: "192837465",
    },
    localInfo: {
        role: 0,
    },
    primary_bank: {
        bank_id: 141,
        bank_name: "Axis Bank",
        account_holder_name: "Tony Stark",
        account_number: "123456789",
        iban_number: "12345123451234512345123",
        branch_name: "Denver",
        currency_id: 2,
        currency_name: "Afghani",
        currency_abv: "AFN",
    },
    other_bank_accounts: [],
};

const EstimateLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const [estimateNumber, setEstimateNumber] = useState("");
    const [estimateDate, setEstimateDate] = useState(
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
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [shippingLabel, setShippingLabel] = useState(null);
    const [shippingAddress1, setShippingAddress1] = useState(null);
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingState, setShippingState] = useState(null);
    const [shippingCountry, setShippingCountry] = useState(null);
    const [currency, setCurrency] = useState("AED");
    const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);
    const [isCreateOrUpdateLoading, setIsCreateOrUpdateLoading] =
        useState(false);
    const [items, setItems] = useState([
        {
            item_name: "",
            unit: "",
            qty: null,
            rate: null,
            discount: 0,
            is_percentage_discount: true,
            tax_id: isUserTaxRegistered ? 1 : null,
            description: null,
            is_inclusive: false,
        },
    ]);

    const actionType = searchParams.get("action_type");

    const hasUserEditedTnC = useRef(false);

    const isAdd = window.location.pathname.split("/")[2] === "create";

    const {
        loading: estimateLoading,
        estimate,
        number,
    } = useSelector((state) => state.estimateReducer);
    const { currencies, currencyLoading } = useSelector(
        (state) => state.onboardingReducer
    );
    const { customer } = useSelector((state) => state.customerReducer);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] === "edit") {
            dispatch(getCurrency());
            dispatch(
                getEstimateDetails(window.location.pathname.split("/")[3])
            );
            estimate?.customer?.customer_id;
        }
        if (window.location.pathname.split("/")[2] === "create") {
            dispatch(getCurrency());
            dispatch(getNewEstimateNumber());
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] === "edit") {
            if (estimate?.customer) {
                dispatch(getCustomerDetails(estimate?.customer?.customer_id));
            }
        }
    }, [dispatch, estimate?.customer?.customer_id]);

    useEffect(() => {
        if (customerId === null && !user?.clientInfo?.terms_and_conditions) {
            setTermsAndConditions("");
            return;
        }

        // Only update if the user hasn't manually changed it
        if (!hasUserEditedTnC.current) {
            setTermsAndConditions(
                customer?.terms_and_conditions ??
                    user?.clientInfo?.terms_and_conditions ??
                    ""
            );
        }
    }, [customer, customerId, user?.clientInfo?.terms_and_conditions]);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] === "edit") {
            setEstimateNumber(estimate?.estimate_number);
            setEstimateDate(
                moment(estimate?.estimate_date).format("YYYY-MM-DD")
            );
            setValidTill(moment(estimate?.valid_till).format("YYYY-MM-DD"));
            setReference(estimate?.reference);
            setCustomerName(estimate?.customer?.customer_name);
            setCustomerId(estimate?.customer?.customer_id);
            setCurrencyId(estimate?.currency_id);
            setCurrencyConversionRate(estimate?.currency_conversion_rate);
            setCurrency(
                currencyId !== 1
                    ? currencies?.find(
                          (currency) =>
                              currency.currency_id === estimate?.currency_id
                      )?.currency_abv
                    : "AED"
            );

            // Initialize line items with their respective is_inclusive values
            const updatedItems = estimate?.line_items?.map((item) => ({
                ...item,
                is_inclusive: item.is_inclusive || false, // Use the existing value for each item
            })) || [
                {
                    item_name: "",
                    unit: "",
                    qty: null,
                    rate: null,
                    discount: 0,
                    is_percentage_discount: true,
                    is_inclusive: false, // Default value for new items
                    tax_id: isUserTaxRegistered ? 1 : null,
                    description: null,
                },
            ];

            setItems(updatedItems);

            setShippingAddressId(
                estimate?.customer?.shipping_address_details
                    ?.shipping_address_id
            );

            setShippingAddress1(
                estimate?.customer?.shipping_address_details?.address_line_1
            );

            setShippingAddress2(
                estimate?.customer?.shipping_address_details?.address_line_2
            );

            setShippingAddress3(
                estimate?.customer?.shipping_address_details?.address_line_3
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

            setSubject(estimate?.subject);

            // Only update if user hasn't typed
            if (!hasUserEditedTnC.current) {
                setTermsAndConditions(estimate?.terms_and_conditions ?? "");
            }

            setIsSetDefaultTncCustomer(estimate?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(estimate?.is_set_default_tnc_client);
        }

        if (window.location.pathname.split("/")[2] === "create") {
            // console.log("If Create Condition");
            setEstimateNumber(number);

            // Only update if user hasn't typed
            if (!hasUserEditedTnC.current) {
                setTermsAndConditions(
                    user?.clientInfo?.terms_and_conditions ?? ""
                );
            }
        }
    }, [
        currencies,
        estimate,
        number,
        currencyId,
        user?.clientInfo?.terms_and_conditions,
    ]);

    const handleTnCChange = (e) => {
        hasUserEditedTnC.current = true;
        setTermsAndConditions(e.target.value);
    };

    const validateForm = () => {
        const errors = [];

        if (!estimateNumber) errors.push("Estimate number is required.");
        if (!customerId) errors.push("Customer ID is required.");
        if (currencyConversionRate <= 0)
            errors.push("Currency conversion rate must be greater than 0.");

        items.forEach((item, index) => {
            if (!item.item_name)
                errors.push(`Item name is required for item ${index + 1}.`);
            if (!item.unit)
                errors.push(`Unit is required for item ${index + 1}.`);
            if (item.qty <= 0)
                errors.push(
                    `Quantity should be greater than 0 for item ${index + 1}.`
                );
            if (item.rate <= 0)
                errors.push(
                    `Rate should be greater than 0 for item ${index + 1}.`
                );
            if (item.discount < 0)
                errors.push(
                    `Discount should be greater than or equal to 0 for item ${
                        index + 1
                    }.`
                );
        });

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (estimateLoading) return;

        setIsCreateOrUpdateLoading(true);

        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            setIsCreateOrUpdateLoading(false);
            return;
        }

        const data = {
            customer_id: customerId,
            estimate_number: estimateNumber,
            estimate_date: estimateDate,
            valid_till: validTill,
            reference,
            subject: subject || null,
            terms_and_conditions: termsAndConditions || null,
            is_set_default_tnc_customer: isSetDefaultTncCustomer,
            is_set_default_tnc_client: isSetDefaultTncClient,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
            shipping_address_id: shippingAddressId,
        };

        // console.log("Create/Edit Estimate Data: ", data);

        try {
            if (isAdd) {
                await dispatch(createEstimate(data, navigate));
            } else {
                const estimateId = window.location.pathname.split("/")[3];
                await dispatch(updateEstimate(estimateId, data, navigate));
            }
        } catch (error) {
            toast.error("An error occurred while processing your request.");
        } finally {
            setIsCreateOrUpdateLoading(false);
        }
    };

    if (estimateLoading || currencyLoading) {
        return <Spinner type="fullscreen" />;
    }
    return (
        <DeviceRestriction>
            <Fragment>
                <Breadcrumb
                    item={{
                        label: "Estimate",
                        viewLabel:
                            actionType === "edit"
                                ? "Edit Estimate"
                                : "Create Estimates",
                    }}
                />
                <div className="mx-auto mt-5 flex items-center justify-center">
                    <div className="bg-white lg:min-w-[700px] border">
                        <TemplateHeader
                            title={"Estimate"}
                            logo={user?.clientInfo?.company_logo_url}
                        />
                        <form>
                            <EstimateFormP1
                                estimateNumber={estimateNumber}
                                setEstimateNumber={setEstimateNumber}
                                estimateDate={estimateDate}
                                setEstimateDate={setEstimateDate}
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
                                shippingAddressId={shippingAddressId}
                                setShippingAddressId={setShippingAddressId}
                                termsAndConditions={termsAndConditions}
                                setTermsAndConditions={setTermsAndConditions}
                                sameAsBillingAddress={sameAsBillingAddress}
                                setSameAsBillingAddress={
                                    setSameAsBillingAddress
                                }
                                shippingLabel={shippingLabel}
                                shippingAddress1={shippingAddress1}
                                shippingAddress2={shippingAddress2}
                                shippingAddress3={shippingAddress3}
                                shippingState={shippingState}
                                shippingCountry={shippingCountry}
                                setShippingLabel={setShippingLabel}
                                setShippingAddress1={setShippingAddress1}
                                setShippingAddress2={setShippingAddress2}
                                setShippingAddress3={setShippingAddress3}
                                setShippingState={setShippingState}
                                setShippingCountry={setShippingCountry}
                            />
                            <EstimateFormP2
                                items={items}
                                setItems={setItems}
                                currency={currency}
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
                                handleTnCChange={handleTnCChange}
                                showTax={isUserTaxRegistered}
                            />
                            <div className="w-fit ml-auto p-5">
                                <Button
                                    disabled={isCreateOrUpdateLoading}
                                    text={
                                        isCreateOrUpdateLoading
                                            ? "Please wait..."
                                            : actionType === "create"
                                            ? "Create Estimate"
                                            : "Edit Estimate"
                                    }
                                    onClick={handleSubmit}
                                />
                            </div>
                        </form>
                        <TemplateBranding />
                    </div>
                </div>
            </Fragment>
        </DeviceRestriction>
    );
};

export default EstimateLayout;
