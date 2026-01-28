import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import moment from "moment";
import { getCustomerDetails } from "../../../Actions/Customer";
import { readAccountantClient } from "../../../Actions/Accountant";
import {
    createCreditNote,
    getCreditNoteDetails,
    getNewCreditNoteNumber,
    updateCreditNote,
} from "../../../Actions/CreditNote";
import { getCurrency } from "../../../Actions/Onboarding";
import { getBankList } from "../../../Actions/Bank";
import CreditNoteLayoutP1 from "./CreditNoteLayoutP1/CreditNoteLayoutP1";
import CreditNoteLayoutP2 from "./CreditNoteLayoutP2/CreditNoteLayoutP2";

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import DeviceRestriction from "../../common/DeviceRestriction";
import TemplateBranding from "../../WebTemplates/TemplateBranding";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import Button from "../../common/Button";
import Breadcrumb from "../../common/BreadCrumb";

const CreditNoteLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const actionType = searchParams.get("action_type");

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const [creditNoteNumber, setCreditNoteNumber] = useState("");
    const [creditNoteDate, setCreditNoteDate] = useState(
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
    const [currency, setCurrency] = useState("AED");
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [shippingLabel, setShippingLabel] = useState(null);
    const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);
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

    const {
        loading: creditNoteLoading,
        creditNote,
        number,
    } = useSelector((state) => state.creditNoteReducer);
    const { currencies, currencyLoading } = useSelector(
        (state) => state.onboardingReducer
    );
    const { customer } = useSelector((state) => state.customerReducer);
    const { client } = useSelector((state) => state.accountantReducer);

    const type =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[6]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[4]
            : window.location.pathname.split("/")[2];
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
    const isAdd = type === "create";

    useEffect(() => {
        if (type === "edit") {
            dispatch(getCurrency());
            dispatch(getBankList(1));
            dispatch(getCreditNoteDetails(cn_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === "create") {
            dispatch(getCurrency());
            dispatch(getBankList(1));
            dispatch(getNewCreditNoteNumber());
        }
    }, [dispatch, cn_id, type, client_id, user?.localInfo?.role]);

    useEffect(() => {
        if (type === "edit") {
            if (user?.localInfo?.role) {
                return;
            }

            if (creditNote?.customer) {
                dispatch(getCustomerDetails(creditNote?.customer?.customer_id));
            }

            // Set bank details from creditNote if they exist
            if (creditNote?.primary_bank_details?.bank_id) {
                setPrimaryBankId(creditNote.primary_bank_details.bank_id);
            }
            if (creditNote?.secondary_bank_details?.bank_id) {
                setSecondaryBankId(creditNote.secondary_bank_details.bank_id);
            }
        }
    }, [
        dispatch,
        creditNote?.customer?.customer_id,
        type,
        user?.localInfo?.role,
    ]);

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
        if (type === "edit") {
            setCreditNoteNumber(creditNote?.cn_number);
            setCreditNoteDate(moment(creditNote?.cn_date).format("YYYY-MM-DD"));
            setValidTill(moment(creditNote?.due_date).format("YYYY-MM-DD"));
            setReference(creditNote?.reference);
            setCustomerName(creditNote?.customer?.customer_name);
            setCustomerId(creditNote?.customer?.customer_id);
            setCurrencyId(creditNote?.currency_id);
            setCurrencyConversionRate(creditNote?.currency_conversion_rate);
            setCurrency(
                currencyId !== 1
                    ? currencies?.find(
                          (currency) =>
                              currency.currency_id === creditNote?.currency_id
                      )?.currency_abv
                    : "AED"
            );
            const updatedItems = creditNote?.line_items?.map((item) => ({
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
                creditNote?.customer?.shipping_address_details
                    ?.shipping_address_id
            );

            setShippingAddress1(
                creditNote?.customer?.shipping_address_details?.address_line_1
            );

            setShippingAddress2(
                creditNote?.customer?.shipping_address_details?.address_line_2
            );

            setShippingAddress3(
                creditNote?.customer?.shipping_address_details?.address_line_3
            );

            setShippingState(
                creditNote?.customer?.shipping_address_details?.state
            );

            setShippingCountry(
                creditNote?.customer?.shipping_address_details?.country
            );

            setShippingLabel(
                creditNote?.customer?.shipping_address_details?.label
            );
            setSubject(creditNote?.subject);
            setPrimaryBankDetails(creditNote?.primary_bank_details);

            setSecondaryBankDetails(creditNote?.secondary_bank_details);
            setTermsAndConditions(creditNote?.terms_and_conditions);
            setIsSetDefaultTncCustomer(creditNote?.is_set_default_tnc_customer);
            setIsSetDefaultTncClient(creditNote?.is_set_default_tnc_client);
        }
        if (type === "create") {
            setCreditNoteNumber(number);
            setTermsAndConditions(user?.clientInfo?.terms_and_conditions);
        }
    }, [
        currencies,
        creditNote,
        number,
        type,
        user?.clientInfo?.terms_and_conditions,
        currencyId,
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (creditNoteLoading) {
            return;
        }
        if (
            creditNoteNumber == "" ||
            customerId == null ||
            currencyConversionRate <= 0
        ) {
            toast.error("Please fill and check all fields.");
            return;
        }
        // if (!sameAsBillingAddress && shippingAddress1 === null) {
        //     toast.error("Please select shipping details.");
        //     return;
        // }
        if (items.some((item) => item.item_name === "")) {
            toast.error("Item name cannot be empty.");
            return;
        }
        if (items.some((item) => item.unit === "")) {
            toast.error("Unit cannot be empty.");
            return;
        }
        if (items.some((item) => item.qty <= 0)) {
            toast.error("Quantity should be greater than 0.");
            return;
        }
        if (items.some((item) => item.rate <= 0)) {
            toast.error("Rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.discount < 0)) {
            toast.error("Discount should be greater than or equal to 0.");
            return;
        }
        const data = {
            customer_id: customerId,
            cn_number: creditNoteNumber,
            cn_date: creditNoteDate,
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
            primary_bank_id: primaryBankId,
            secondary_bank_id: secondaryBankId || null,
        };
        if (isAdd) {
            dispatch(createCreditNote(data, navigate));
        } else {
            dispatch(
                updateCreditNote(cn_id, data, navigate, user?.localInfo?.role)
            );
        }
    };
    return (
        <DeviceRestriction>
            <Fragment>
                <Breadcrumb
                    item={{
                        label: "Credit Note",
                        viewLabel:
                            actionType === "edit"
                                ? "Edit Credit Note"
                                : "Create Credit Note",
                    }}
                />
                <div className="mx-auto mt-4 flex items-center justify-center">
                    <div className="bg-white lg:min-w-[700px] border">
                        <TemplateHeader
                            title={"Credit Note"}
                            logo={user?.clientInfo?.company_logo_url}
                        />

                        <form>
                            <CreditNoteLayoutP1
                                creditNoteNumber={creditNoteNumber}
                                setCreditNoteNumber={setCreditNoteNumber}
                                creditNoteDate={creditNoteDate}
                                setCreditNoteDate={setCreditNoteDate}
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
                                primaryBankId={primaryBankId}
                                secondaryBankId={secondaryBankId}
                                setPrimaryBankId={setPrimaryBankId}
                                setSecondaryBankId={setSecondaryBankId}
                                primaryBankDetails={primaryBankDetails}
                                secondaryBankDetails={secondaryBankDetails}
                                shippingLabel={shippingLabel}
                                setShippingLabel={setShippingLabel}
                                setShippingAddressId={setShippingAddressId}
                                shippingAddressId={shippingAddressId}
                                setTermsAndConditions={setTermsAndConditions}
                                sameAsBillingAddress={sameAsBillingAddress}
                                setSameAsBillingAddress={
                                    setSameAsBillingAddress
                                }
                            />
                            <CreditNoteLayoutP2
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
                                showTax={isUserTaxRegistered}
                            />
                            <div className="w-fit ml-auto p-5">
                                <Button
                                    disabled={creditNoteLoading}
                                    text={
                                        creditNoteLoading
                                            ? "Please wait..."
                                            : actionType === "edit"
                                            ? "Edit CreditNote"
                                            : "Create CreditNote"
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

export default CreditNoteLayout;
