import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import moment from "moment";
import { getCurrency } from "../../../Actions/Onboarding";
import { getCustomerDetails } from "../../../Actions/Customer";
import {
    createProforma,
    getProformaDetails,
    getNewProformaNumber,
    updateProforma,
} from "../../../Actions/Proforma";
import { getBankList } from "../../../Actions/Bank";
import { getEstimateDetails } from "../../../Actions/Estimate";

import ProformaFormP1 from "./ProformaLayoutP1/ProformaLayoutP1";
import ProformaFormP2 from "./ProformaLayoutP2/ProformaLayoutP2";

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import TemplateBranding from "../../WebTemplates/TemplateBranding";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import Button from "../../common/Button";
import Spinner from "../../common/Spinner";
import DeviceRestriction from "../../common/DeviceRestriction";
import Breadcrumb from "../../common/BreadCrumb";

const ProformaLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const [proformaNumber, setProformaNumber] = useState("");
    const [proformaDate, setProformaDate] = useState(
        moment().format("YYYY-MM-DD")
    );
    const [validTill, setValidTill] = useState(moment().format("YYYY-MM-DD"));
    const [reference, setReference] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [customerId, setCustomerId] = useState(null);
    const [currency, setCurrency] = useState("AED");
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [subject, setSubject] = useState(null);
    const [termsAndConditions, setTermsAndConditions] = useState(null);
    const [isSetDefaultTncCustomer, setIsSetDefaultTncCustomer] =
        useState(false);
    const [isSetDefaultTncClient, setIsSetDefaultTncClient] = useState(false);
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);
    const [shippingLabel, setShippingLabel] = useState(null);
    const [shippingAddress1, setShippingAddress1] = useState(null);
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingState, setShippingState] = useState(null);
    const [shippingCountry, setShippingCountry] = useState(null);
    const [isCreateOrUpdateLoading, setIsCreateOrUpdateLoading] =
        useState(false);
    const [primaryBankId, setPrimaryBankId] = useState(null);
    const [secondaryBankId, setSecondaryBankId] = useState(null);
    const [primaryBankDetails, setPrimaryBankDetails] = useState(null);
    const [secondaryBankDetails, setSecondaryBankDetails] = useState(null);

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
    const convert = searchParams.get("convert");
    const reference_id = searchParams.get("reference_id");
    const referenceName = searchParams.get("reference");

    const hasUserEditedTnC = useRef(false);

    const isAdd = window.location.pathname.split("/")[2] === "create";

    const {
        loading: proformaLoading,
        proforma,
        number,
    } = useSelector((state) => state.proformaReducer);
    const { currencies, currencyLoading } = useSelector(
        (state) => state.onboardingReducer
    );
    const { customer } = useSelector((state) => state.customerReducer);
    const { estimate } = useSelector((state) => state.estimateReducer);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] === "edit") {
            dispatch(getCurrency());
            dispatch(
                getProformaDetails(window.location.pathname.split("/")[3])
            );
            // Also fetch banks here
            dispatch(getBankList(1));
        }
        if (window.location.pathname.split("/")[2] === "create") {
            dispatch(getCurrency());
            dispatch(getNewProformaNumber());
            if (convert && referenceName === "estimate") {
                dispatch(getEstimateDetails(reference_id));
            }
            dispatch(getBankList(1));
        }
    }, [dispatch, reference_id, referenceName, convert]);

    useEffect(() => {
        if (convert && referenceName === "estimate" && estimate?.customer) {
            dispatch(getCustomerDetails(estimate.customer.customer_id));
        }
    }, [estimate, convert, referenceName, dispatch]);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] === "edit" && proforma) {
            if (proforma?.customer) {
                dispatch(getCustomerDetails(proforma?.customer?.customer_id));
            }

            // Set bank details from proforma if they exist
            if (proforma?.primary_bank_details?.bank_id) {
                setPrimaryBankId(proforma.primary_bank_details.bank_id);
            }
            if (proforma?.secondary_bank_details?.bank_id) {
                setSecondaryBankId(proforma.secondary_bank_details.bank_id);
            }
        }
    }, [dispatch, proforma]);

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
            setProformaNumber(proforma?.pi_number);
            setProformaDate(moment(proforma?.pi_date).format("YYYY-MM-DD"));
            setValidTill(moment(proforma?.due_date).format("YYYY-MM-DD"));
            setReference(proforma?.reference);
            setCustomerName(proforma?.customer?.customer_name);
            setCustomerId(proforma?.customer?.customer_id);
            setCurrencyId(proforma?.currency_id);
            setCurrencyConversionRate(proforma?.currency_conversion_rate);
            setCurrency(
                currencyId !== 1
                    ? currencies?.find(
                          (currency) =>
                              currency.currency_id === proforma?.currency_id
                      )?.currency_abv
                    : "AED"
            );

            const updatedItems = proforma?.line_items?.map((item) => ({
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
                proforma?.customer?.shipping_address_details
                    ?.shipping_address_id
            );

            setShippingAddress1(
                proforma?.customer?.shipping_address_details?.address_line_1
            );

            setShippingAddress2(
                proforma?.customer?.shipping_address_details?.address_line_2
            );

            setShippingAddress3(
                proforma?.customer?.shipping_address_details?.address_line_3
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

            setSubject(proforma?.subject);
            setPrimaryBankDetails(proforma?.primary_bank_details);

            setSecondaryBankDetails(proforma?.secondary_bank_details);

            // Only update if user hasn't typed
            if (!hasUserEditedTnC.current) {
                setTermsAndConditions(proforma?.terms_and_conditions ?? "");
            }

            setIsSetDefaultTncCustomer(proforma?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(proforma?.is_set_default_tnc_client);
        }

        if (window.location.pathname.split("/")[2] === "create") {
            setProformaNumber(number);

            // Only update if user hasn't typed
            if (!hasUserEditedTnC.current) {
                setTermsAndConditions(
                    user?.clientInfo?.terms_and_conditions ?? ""
                );
            }

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
                                is_inclusive: false,
                                tax_id: isUserTaxRegistered ? 1 : 0,
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
            }
        }
    }, [
        currencies,
        proforma,
        number,
        estimate,
        convert,
        user?.clientInfo?.terms_and_conditions,
        currencyId,
    ]);

    const handleTnCChange = (e) => {
        hasUserEditedTnC.current = true;
        setTermsAndConditions(e.target.value);
    };

    const validateForm = () => {
        const errors = [];

        if (!proformaNumber) errors.push("Proforma number is required.");
        if (!customerId) errors.push("Customer ID is required.");
        if (currencyConversionRate <= 0)
            errors.push("Currency conversion rate must be greater than 0.");
        if (!primaryBankId) errors.push("Primary bank is required.");

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

        if (proformaLoading) return;

        setIsCreateOrUpdateLoading(true);

        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            setIsCreateOrUpdateLoading(false);
            return;
        }

        const data = {
            customer_id: customerId,
            pi_number: proformaNumber,
            pi_date: proformaDate,
            due_date: validTill,
            reference: reference || null,
            subject: subject || null,
            terms_and_conditions: termsAndConditions || null,
            is_set_default_tnc_customer: isSetDefaultTncCustomer,
            is_set_default_tnc_client: isSetDefaultTncClient,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
            shipping_address_id: shippingAddressId,
            primary_bank_id: primaryBankId,
            secondary_bank_id: secondaryBankId || null,
        };

        // console.log("Create/Edit Proforma Data: ", data);

        try {
            if (isAdd) {
                await dispatch(createProforma(data, navigate));
            } else {
                const proformaId = window.location.pathname.split("/")[3];
                await dispatch(updateProforma(proformaId, data, navigate));
            }
        } catch (error) {
            toast.error("An error occurred while processing your request.");
        } finally {
            setIsCreateOrUpdateLoading(false);
        }
    };

    if (proformaLoading) {
        return <Spinner type="fullscreen" />;
    }
    return (
        <DeviceRestriction>
            <Fragment>
                <Breadcrumb
                    item={{
                        label: "Proforma",
                        viewLabel:
                            actionType == "edit"
                                ? "Edit Proforma"
                                : "Create Proforma",
                    }}
                />
                <div className="mx-auto mt-2 flex items-center justify-center">
                    <div className="bg-white lg:min-w-[700px] border">
                        <TemplateHeader
                            title={"Proforma Invoice"}
                            logo={user?.clientInfo?.company_logo_url}
                        />
                        <form>
                            <ProformaFormP1
                                proformaNumber={proformaNumber}
                                setProformaNumber={setProformaNumber}
                                proformaDate={proformaDate}
                                setProformaDate={setProformaDate}
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
                                convert={convert}
                                primaryBankId={primaryBankId}
                                secondaryBankId={secondaryBankId}
                                setPrimaryBankId={setPrimaryBankId}
                                setSecondaryBankId={setSecondaryBankId}
                                primaryBankDetails={primaryBankDetails}
                                secondaryBankDetails={secondaryBankDetails}
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
                            <ProformaFormP2
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
                                            : isAdd
                                            ? "Create Proforma"
                                            : "Edit Proforma"
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

export default ProformaLayout;
