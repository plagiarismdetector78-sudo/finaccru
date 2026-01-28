import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCustomerDetails,
    getCustomerInfiniteScroll,
    getShippingAddressList,
} from "../../../../Actions/Customer";
import { Trash2 } from "lucide-react";
import {
    dummyCompanyData,
    MAX_LENGTH,
    SHOW_DUMMY_DATA,
} from "../../../../constant";
import Select from "../../../common/Select";
import CustomerModalSelect from "../../../Customer/CustomerInfiniteScrollSelect/CustomerInfiniteScrollModal";
import { getBankList } from "../../../../Actions/Bank";
import Spinner from "../../../common/Spinner";

const TaxInvoiceFormP1 = ({
    taxInvoiceNumber,
    taxInvoiceDate,
    validTill,
    reference,
    subject,
    customerName,
    customerId,
    currency,
    currencyId,
    currencyConversionRate,
    setTaxInvoiceNumber,
    setTaxInvoiceDate,
    setValidTill,
    setReference,
    setSubject,
    setCustomerName,
    setCustomerId,
    setCurrency,
    setCurrencyId,
    setCurrencyConversionRate,
    termsAndConditions,
    setTermsAndConditions,
    sameAsBillingAddress,
    setSameAsBillingAddress,
    convert,
    extracted,
    setShippingAddressId,
    shippingAddressId,
    primaryBankId,
    secondaryBankId,
    setPrimaryBankId,
    setSecondaryBankId,
    primaryBankDetails,
    secondaryBankDetails,
    shippingLabel,
    shippingAddress1,
    shippingAddress2,
    shippingAddress3,
    shippingState,
    shippingCountry,
    setShippingLabel,
    setShippingAddress1,
    setShippingAddress2,
    setShippingAddress3,
    setShippingState,
    setShippingCountry,
}) => {
    const { user, loading: isUserLoading } = useSelector(
        (state) => state.userReducer
    );

    const bankState = useSelector((state) => state.bankReducer);
    const banks = bankState.banks?.items || bankState.banks || [];

    const {
        loading: customerLoading,
        customersInf,
        totalCustomers,
        customer,
    } = useSelector((state) => state.customerReducer);

    const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingId, setShippingId] = useState(null);
    const [customerKeyword, setCustomerKeyword] = useState(null);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);

    const dispatch = useDispatch();

    const { shippingAddresses } = useSelector((state) => state.customerReducer);
    const { currencies, currencyLoading } = useSelector(
        (state) => state.onboardingReducer
    );

    // Initial data loading
    useEffect(() => {
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
    }, [dispatch]);

    // Handle customer search
    useEffect(() => {
        if (customerKeyword === null) return;
        dispatch(getCustomerInfiniteScroll(1, true, customerKeyword));
        setCurrentCustomerPage(1);
    }, [customerKeyword, dispatch]);

    const showModal = () => {
        setIsModalOpen(true);
        setCustomerId("addCustomer");
    };

    const onChangeCustomer = (value) => {
        if (value.customer_id === "addCustomer") {
            showModal();
            return;
        }

        setCustomerId(value.customer_id);
        const customerSelected = customersInf.find(
            (customer) => customer.customer_id === value.customer_id
        );

        setCustomerName(customerSelected.customer_name);
        dispatch(getCustomerDetails(value.customer_id));
        dispatch(getShippingAddressList(value.customer_id));
        setTermsAndConditions(
            customer?.terms_and_conditions
                ? customer?.terms_and_conditions
                : termsAndConditions
        );
    };

    const onChangeShipping = (event) => {
        const value = event.target.value;
        if (value === "addShippingAddress") {
            // showShippingModal();
            return;
        }

        const selectedAddress = shippingAddresses?.find(
            (address) => String(address.shipping_address_id) === String(value)
        );

        if (selectedAddress) {
            setShippingId(value);
            setShippingLabel(selectedAddress.label);
            setShippingAddress1(selectedAddress.address_line_1);
            setShippingAddress2(selectedAddress.address_line_2);
            setShippingAddress3(selectedAddress.address_line_3);
            setShippingState(selectedAddress.state);
            setShippingCountry(selectedAddress.country);
            setShippingAddressId(value);
            setSameAsBillingAddress(false);
        }
    };

    const onChangeCurrency = (event) => {
        const selectedCurrencyId = event.target.value;
        const selectedCurrency = currencies.find(
            (curr) => String(curr.currency_id) === String(selectedCurrencyId)
        );

        if (selectedCurrency) {
            setCurrencyId(selectedCurrencyId);
            setCurrency(selectedCurrency.currency_abv);

            // Reset conversion rate to 1 if AED is selected
            if (selectedCurrency.currency_abv === "AED") {
                setCurrencyConversionRate(1);
            }
        } else {
            console.warn("No matching currency found!");
            setCurrency("AED");
            setCurrencyId(1);
            setCurrencyConversionRate(1);
        }
    };

    const addPage = (current) => {
        if (customerLoading) return;
        if ((current - 1) * 20 > totalCustomers) return;
        if (currentCustomerPage >= current) return;

        dispatch(getCustomerInfiniteScroll(current, false));
        setCurrentCustomerPage((prev) => prev + 1);
    };

    useEffect(() => {
        if (banks.length === 0 && !bankState.loading) {
            dispatch(getBankList(1));
        }
    }, [banks, bankState.loading, dispatch]);

    const handleBankSelection = (bankId) => {
        // If bank is already primary, do nothing
        if (bankId === primaryBankId) return;

        // If bank is already secondary, promote to primary
        if (bankId === secondaryBankId) {
            setPrimaryBankId(bankId);
            setSecondaryBankId(null);
            return;
        }

        // If no primary selected, set as primary
        if (!primaryBankId) {
            setPrimaryBankId(bankId);
        }
        // If primary exists but no secondary, set as secondary
        else if (primaryBankId && !secondaryBankId) {
            setSecondaryBankId(bankId);
        }
        // If both exist, replace secondary
        else {
            setSecondaryBankId(bankId);
        }
    };

    const removeBank = (bankId) => {
        if (bankId === primaryBankId) {
            setPrimaryBankId(secondaryBankId || null);
            setSecondaryBankId(null);
        } else if (bankId === secondaryBankId) {
            setSecondaryBankId(null);
        }
    };

    const renderBankSelection = () => {
        const selectedBanks = [];
        if (primaryBankId) {
            selectedBanks.push({
                id: primaryBankId,
                type: "primary",
            });
        }
        if (secondaryBankId) {
            selectedBanks.push({
                id: secondaryBankId,
                type: "secondary",
            });
        }

        return (
            <div className="flex w-full gap-4">
                {/* Display selected banks */}
                {selectedBanks.map((bank) => (
                    <div key={bank.id} className="flex w-1/2">
                        <div className="flex items-start justify-between gap-4 mt-2 p-4 border border-gray-300 rounded-lg shadow-sm bg-white w-full">
                            <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                                <span className="text-sm font-semibold text-gray-900 truncate">
                                    {banks.find((b) => b.bank_id === bank.id)
                                        ?.bank_name || "Unknown Bank"}
                                    {/* (
                                    {banks.find((b) => b.bank_id === bank.id)
                                        ?.bank_type || "N/A"}
                                    ) */}
                                </span>
                                <span className="text-xs text-gray-600 truncate">
                                    Account:{" "}
                                    {banks.find((b) => b.bank_id === bank.id)
                                        ?.account_number || "N/A"}
                                </span>
                                {primaryBankDetails && (
                                    <>
                                        <span className="text-xs text-gray-600 truncate">
                                            IBAN:{" "}
                                            {banks.find(
                                                (b) => b.bank_id === bank.id
                                            )
                                                ? primaryBankDetails?.iban_number
                                                : secondaryBankDetails?.iban_number}
                                        </span>
                                        <span className="text-xs text-gray-600 truncate">
                                            Holder:{" "}
                                            {banks.find(
                                                (b) => b.bank_id === bank.id
                                            )?.account_holder_name ||
                                            bank.type === "primary"
                                                ? primaryBankDetails?.account_holder_name
                                                : secondaryBankDetails?.account_holder_name}
                                        </span>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => removeBank(bank.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Bank selection checklist button */}
                {selectedBanks.length === 0 && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsBankModalOpen(true);
                        }}
                        className={`px-4 py-2 border-2 md:w-1/2 rounded-md transition-colors font-medium ${
                            selectedBanks.length >= 2
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                                : "text-gray-700 border-gray-400 hover:bg-gray-100 hover:border-gray-500"
                        }`}
                        disabled={selectedBanks.length >= 2}
                    >
                        Select Banks
                    </button>
                )}

                {/* Bank selection modal */}
                {isBankModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white">
                                <h3 className="text-lg font-medium">
                                    Select Bank Account(s)
                                </h3>
                                <button
                                    onClick={() => setIsBankModalOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    X
                                </button>
                            </div>

                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Select up to 2 bank accounts. At least 1 is
                                    required.
                                </p>

                                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                    {banks.map((bank) => (
                                        <div
                                            key={bank.bank_id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                primaryBankId ===
                                                    bank.bank_id ||
                                                secondaryBankId === bank.bank_id
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                handleBankSelection(
                                                    bank.bank_id
                                                )
                                            }
                                        >
                                            <div className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        primaryBankId ===
                                                            bank.bank_id ||
                                                        secondaryBankId ===
                                                            bank.bank_id
                                                    }
                                                    readOnly
                                                    className="mt-1 mr-3"
                                                />
                                                <div>
                                                    <div className="font-medium">
                                                        {bank.bank_name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Account:{" "}
                                                        {bank.account_number}
                                                    </div>
                                                    {bank.iban_number && (
                                                        <div className="text-xs text-gray-500">
                                                            IBAN:{" "}
                                                            {bank.iban_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={() => setIsBankModalOpen(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const companyData = SHOW_DUMMY_DATA
        ? dummyCompanyData
        : user?.clientInfo?.company_data;

    if (isUserLoading) {
        return <Spinner type="small" />;
    }

    return (
        <div className="flex flex-col w-full">
            {/* Basic Information */}
            <div className="w-full px-2 md:px-4 flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
                {/* Company Information */}
                <div className="flex flex-col gap-1">
                    <span className="font-medium">
                        {companyData?.company_name}
                    </span>
                    <span className="text-xs">
                        {companyData?.address_line_1}
                    </span>
                    {companyData?.address_line_2 && (
                        <span className="text-xs">
                            {companyData?.address_line_2}
                        </span>
                    )}
                    {companyData?.address_line_3 && (
                        <span className="text-xs">
                            {companyData?.address_line_3}
                        </span>
                    )}
                    {companyData?.state && (
                        <span className="text-xs">
                            {companyData?.state + ", " + companyData?.country}
                        </span>
                    )}
                    {companyData?.vat_trn && (
                        <span className="text-xs">
                            VAT TRN: {companyData?.vat_trn}
                        </span>
                    )}
                    {companyData?.corporate_tax_trn && (
                        <span className="text-xs">
                            Corporate Tax TRN: {companyData?.corporate_tax_trn}
                        </span>
                    )}
                </div>

                {/* Numbers, Date and References */}
                <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1 gap-2">
                        <span className="text-gray-400 text-base font-medium after:content-['*'] after:ml-0.5 after:text-red-500 whitespace-nowrap">
                            Tax Invoice Number
                        </span>
                        <input
                            className="w-full sm:max-w-36 sm:w-36 sm:ml-8 text-left border-2 rounded px-2 py-1 outline-none"
                            name="taxInvoiceNumber"
                            type="text"
                            value={taxInvoiceNumber}
                            onChange={(e) => {
                                const input = e.target.value;
                                setTaxInvoiceNumber(
                                    "INV-" + input.substr("INV-".length)
                                );
                            }}
                            disabled={user?.localInfo?.role && !extracted}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1 gap-2">
                        <span className="text-gray-400 text-base font-medium after:content-['*'] after:ml-0.5 after:text-red-500 whitespace-nowrap">
                            Tax Invoice Date
                        </span>
                        <input
                            className="w-full sm:max-w-36 sm:w-36 sm:ml-8 text-left border-2 rounded px-2 py-1 outline-none"
                            type="date"
                            name="taxInvoiceDate"
                            value={taxInvoiceDate}
                            min="2023-01-01"
                            onChange={(e) => setTaxInvoiceDate(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1 gap-2">
                        <span className="text-gray-400 text-base font-medium after:content-['*'] after:ml-0.5 after:text-red-500 whitespace-nowrap">
                            Due Date
                        </span>
                        <input
                            className="w-full sm:max-w-36 sm:w-36 sm:ml-8 text-left border-2 rounded px-2 py-1 outline-none"
                            type="date"
                            name="validTill"
                            value={validTill}
                            min={taxInvoiceDate}
                            onChange={(e) => setValidTill(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1 gap-2">
                        <span className="text-gray-400 text-base font-medium whitespace-nowrap">
                            Reference
                        </span>
                        <input
                            className="w-full sm:max-w-36 sm:w-36 sm:ml-8 text-left border-2 rounded px-2 py-1 outline-none"
                            type="text"
                            name="reference"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            disabled={convert}
                        />
                    </div>
                </div>
            </div>

            {/* Billing & Shipping Address */}
            <div className="w-full px-2 md:px-4 my-5 flex flex-col lg:flex-row justify-between gap-6">
                {/* Billing Address Section */}
                <div className="w-full lg:w-1/2">
                    <h3 className="text-lg font-medium after:content-['*'] after:ml-0.5 after:text-red-500">
                        Select Customer
                    </h3>
                    {customerName ? (
                        <div className="flex flex-row items-start justify-between gap-4 mt-2 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                            {/* Customer Details */}
                            <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                                <span className="text-sm font-semibold text-gray-900 truncate">
                                    {customerName || "No Name Provided"}
                                </span>
                                <span className="text-xs text-gray-600 truncate">
                                    {customer?.billing_address_line_1 ||
                                        "No Address Available"}
                                </span>
                                {customer?.billing_address_line_2 && (
                                    <span className="text-xs text-gray-600 truncate">
                                        {customer?.billing_address_line_2}
                                    </span>
                                )}
                                {customer?.billing_address_line_3 && (
                                    <span className="text-xs text-gray-600 truncate">
                                        {customer?.billing_address_line_3}
                                    </span>
                                )}
                                <span className="text-xs text-gray-600 truncate">
                                    {customer?.billing_state &&
                                    customer?.billing_country
                                        ? `${customer.billing_state}, ${customer.billing_country}`
                                        : "No State/Country Info"}
                                </span>
                                {customer?.trn && (
                                    <span className="text-xs font-medium text-gray-700 truncate">
                                        VAT TRN: {customer.trn}
                                    </span>
                                )}
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => {
                                    setCustomerName("");
                                    setCustomerId(null);
                                    setShippingId(null);
                                    setShippingAddress1(null);
                                    setShippingAddress2(null);
                                    setShippingAddress3(null);
                                    setShippingState(null);
                                    setShippingCountry(null);
                                    setShippingLabel(null);
                                    setSameAsBillingAddress(false);
                                }}
                                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200"
                                title="Remove Customer"
                                aria-label="Remove Customer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <CustomerModalSelect
                                loadMoreOptions={addPage}
                                onChange={onChangeCustomer}
                                customerKeyword={customerKeyword}
                                setCustomerKeyword={setCustomerKeyword}
                            />
                        </div>
                    )}
                </div>

                {/* Shipping Address Section */}
                <div className="w-full lg:w-1/2">
                    {customerId && (
                        <div>
                            {/* Shipping Address Header */}
                            <h3 className="text-lg font-medium flex items-center gap-1">
                                Shipping Address
                                <span className="text-sm text-gray-500">
                                    (Optional)
                                </span>
                            </h3>

                            {/* Use Same as Billing Checkbox */}
                            {/* {!shippingAddressId && (
                                <div className="mt-3 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="sameAsBilling"
                                        checked={sameAsBillingAddress}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setSameAsBillingAddress(isChecked);
                                            if (isChecked) {
                                                setShippingAddress1(
                                                    customer?.billing_address_line_1
                                                );
                                                setShippingAddress2(
                                                    customer?.billing_address_line_2
                                                );
                                                setShippingAddress3(
                                                    customer?.billing_address_line_3
                                                );
                                                setShippingState(
                                                    customer?.billing_state
                                                );
                                                setShippingCountry(
                                                    customer?.billing_country
                                                );
                                            } else {
                                                setShippingAddress1(null);
                                                setShippingAddress2(null);
                                                setShippingAddress3(null);
                                                setShippingState(null);
                                                setShippingCountry(null);
                                            }
                                        }}
                                        className="mr-2 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="sameAsBilling"
                                        className={`cursor-pointer ${
                                            sameAsBillingAddress
                                                ? "text-gray-800"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Use Same as Billing Address
                                    </label>
                                </div>
                            )} */}

                            {/* Display Selected Shipping Address */}
                            {shippingId || shippingAddress1 ? (
                                <div className="flex flex-row items-start justify-between gap-4 mt-2 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                                    <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                                        {shippingLabel && (
                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                {shippingLabel}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-600 truncate">
                                            {shippingAddress1 ||
                                                "No Address Available"}
                                        </span>
                                        {shippingAddress2 && (
                                            <span className="text-xs text-gray-600 truncate">
                                                {shippingAddress2}
                                            </span>
                                        )}
                                        {shippingAddress3 && (
                                            <span className="text-xs text-gray-600 truncate">
                                                {shippingAddress3}
                                            </span>
                                        )}
                                        {shippingState && (
                                            <span className="text-xs text-gray-600 truncate">
                                                {shippingState &&
                                                shippingCountry
                                                    ? `${shippingState}, ${shippingCountry}`
                                                    : "No State/Country Info"}
                                            </span>
                                        )}
                                        {customer?.trn && (
                                            <span className="text-xs font-medium text-gray-700 truncate">
                                                VAT TRN: {customer.trn}
                                            </span>
                                        )}
                                    </div>

                                    {/* Delete Shipping Address Button */}
                                    <button
                                        onClick={() => {
                                            setShippingId(null);
                                            setShippingAddress1(null);
                                            setShippingAddress2(null);
                                            setShippingAddress3(null);
                                            setShippingState(null);
                                            setShippingCountry(null);
                                            setShippingLabel(null);
                                            setSameAsBillingAddress(false);
                                            dispatch(
                                                getShippingAddressList(
                                                    customerId
                                                )
                                            );
                                        }}
                                        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200"
                                        title="Remove Shipping Address"
                                        aria-label="Remove Shipping Address"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <Select
                                        disabled={sameAsBillingAddress}
                                        placeholder="Select Shipping Address"
                                        value={
                                            sameAsBillingAddress
                                                ? null
                                                : shippingId
                                        }
                                        onChange={onChangeShipping}
                                        className={`w-full ${
                                            sameAsBillingAddress
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        options={shippingAddresses?.map(
                                            (address) => ({
                                                value: address.shipping_address_id,
                                                label: `${
                                                    address.label
                                                        ? address.label
                                                        : ""
                                                }`,
                                            })
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bank Section */}
            <div className="w-full px-2 md:px-4 my-5">
                <h3 className="text-lg font-medium after:content-['*'] after:ml-0.5 after:text-red-500">
                    Bank Details
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Select 1 or 2 bank accounts
                </p>
                {renderBankSelection()}
            </div>

            {/* Currency Section */}
            <div className="w-full px-2 md:px-4 my-5 flex flex-col justify-between gap-1">
                <h3 className="text-lg font-medium after:content-['*'] after:ml-0.5 after:text-red-500">
                    Select Currency
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 gap-4">
                    <div className="w-full sm:w-auto">
                        <Select
                            value={currencyId}
                            onChange={onChangeCurrency}
                            options={currencies?.map((currency) => ({
                                value: currency.currency_id,
                                label: currency.currency_abv,
                            }))}
                            placeholder={"Select Currency"}
                            className={"text-black w-full"}
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <span>1</span>
                        <span>{currency} =</span>
                        <input
                            className="w-16 text-center border-2 rounded px-2 py-1 outline-none"
                            type="number"
                            value={currencyConversionRate}
                            onChange={(e) => {
                                const valid =
                                    e.target.value.match(/^\d*\.?\d{0,4}$/);
                                if (valid) {
                                    setCurrencyConversionRate(e.target.value);
                                }
                            }}
                        />
                        <span>AED</span>
                    </div>
                </div>
            </div>

            {/* Subject Section */}
            <div className="flex flex-col w-full px-2 md:px-4 my-5">
                <label className="text-gray-700 text-sm font-medium mt-2">
                    Subject
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                        if (e?.target?.value?.length <= MAX_LENGTH) {
                            setSubject(e.target.value);
                        }
                    }}
                    maxLength={MAX_LENGTH}
                    className="border-2 rounded-md py-3 px-2 border-gray-400 bg-transparent mt-1 text-gray-800 font-normal leading-6 outline-none transition-all duration-200 placeholder-gray-500 w-full"
                    placeholder="Enter Subject..."
                />
                <span className="text-gray-500 text-xs mt-1">
                    {subject?.length || 0}/{MAX_LENGTH} characters
                </span>
            </div>
        </div>
    );
};

export default TaxInvoiceFormP1;
