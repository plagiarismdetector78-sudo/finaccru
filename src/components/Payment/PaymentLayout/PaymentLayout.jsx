import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToWords } from "to-words";
import moment from "moment";
import Checkbox from "../../common/Checkbox";
import Input from "../../common/Input";
import Select from "../../common/Select";
import CustomerModalSelect from "../../Customer/CustomerInfiniteScrollSelect/CustomerInfiniteScrollModal";
import Button from "../../common/Button";
import {
    dummyCompanyData,
    MAX_LENGTH,
    SHOW_DUMMY_DATA,
} from "../../../constant";
import { Trash2 } from "lucide-react";

import Spinner from "../../common/Spinner";
import { getCurrency } from "../../../Actions/Onboarding";
import { getBankList } from "../../../Actions/Bank";
import {
    createPayments,
    getPaymentsDetails,
    getNewPaymentsNumber,
    updatePayments,
} from "../../../Actions/Payment";
import {
    getCustomerDetails,
    getCustomerInfiniteScroll,
    getShippingAddressList,
} from "../../../Actions/Customer";
import { readOpenTaxInvoicesForCustomer } from "../../../Actions/TaxInvoice";

import TemplateBranding from "../../WebTemplates/TemplateBranding";
import TemplateHeader from "../../WebTemplates/TemplateHeader";
import BankModalSelect from "../../Modals/BankModalSelect";
import PaymentMethodModal from "./PaymentMethodModal";

import { readAccountantClient } from "../../../Actions/Accountant";
import DeviceRestriction from "../../common/DeviceRestriction";
import Breadcrumb from "../../common/BreadCrumb";
import TextArea from "../../common/TextArea";

const PaymentLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [receiptNumber, setReceiptNumber] = useState("");
    const [receiptDate, setReceiptDate] = useState(
        moment().format("YYYY-MM-DD")
    );
    const [customerId, setCustomerId] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [currency, setCurrency] = useState("AED");
    const [bankId, setBankId] = useState(null);
    const [totalAmount, setTotalAmount] = useState("");
    const [totalAmountInWords, setTotalAmountInWords] = useState(null);
    const [reference, setReference] = useState(null);
    const [subject, setSubject] = useState(null);
    const [termsAndConditions, setTermsAndConditions] = useState(null);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerKeyword, setCustomerKeyword] = useState(null);
    const [currentBankPage, setCurrentBankPage] = useState(1);
    const [bankKeyword, setBankKeyword] = useState(null);

    const [paymentMethodModalVisible, setPaymentMethodModalVisible] =
        useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [customPaymentNote, setCustomPaymentNote] = useState("");
    const [showBankSelect, setShowBankSelect] = useState(false);

    const { user } = useSelector((state) => state.userReducer);
    const { client } = useSelector((state) => state.accountantReducer);
    const {
        loading: paymentLoading,
        payment,
        number,
    } = useSelector((state) => state.paymentReducer);
    const { currencies, currencyLoading } = useSelector(
        (state) => state.onboardingReducer
    );
    const {
        loading: customerLoading,
        customersInf,
        totalCustomers,
        customer,
    } = useSelector((state) => state.customerReducer);
    const { loading: taxLoading, openTaxInvoices } = useSelector(
        (state) => state.taxInvoiceReducer
    );

    const bankState = useSelector((state) => state.bankReducer);
    const banks = bankState.banks?.items || bankState.banks || [];

    const actionType = searchParams.get("action_type");

    const type =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[6]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[4]
            : window.location.pathname.split("/")[2];
    const receipt_id =
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

    const [currentCustomerPage, setCurrentCustomerPage] = useState(1);

    useEffect(() => {
        if (type === "edit") {
            dispatch(getCurrency());
            dispatch(getPaymentsDetails(receipt_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === "create") {
            dispatch(getCurrency());
            dispatch(getNewPaymentsNumber());
        }
    }, [dispatch, type, receipt_id, client_id]);

    useEffect(() => {
        if (type === "edit") {
            if (payment?.customer) {
                dispatch(getCustomerDetails(payment?.customer?.customer_id));
                dispatch(
                    readOpenTaxInvoicesForCustomer(
                        payment?.customer?.customer_id,
                        payment?.currency_details?.currency_id,
                        user?.localInfo?.role
                    )
                );
            }
        }
    }, [dispatch, payment]);

    useEffect(() => {
        if (type === "edit" && payment && currencies) {
            setReceiptNumber(payment?.receipt_number);
            setReceiptDate(moment(payment?.receipt_date).format("YYYY-MM-DD"));
            setCustomerId(payment?.customer?.customer_id);
            setCustomerName(payment?.customer?.customer_name);
            setCurrencyId(payment?.currency_details?.currency_id);
            setCurrencyConversionRate(payment?.currency_conversion_rate);

            // Updated payment method handling
            if (payment?.payment_method_type === "cash") {
                setPaymentMethod("cash");
                setBankId(null);
            } else if (payment?.payment_method_type === "bank") {
                setPaymentMethod("bank");
                setBankId(payment?.bank_id);
            } else if (payment?.payment_method_type === "other") {
                setPaymentMethod("other");
                setCustomPaymentNote(
                    payment?.other_receipt_payment_method_details || ""
                );
                setBankId(null);
            }

            setTotalAmount(payment?.total_amount);
            setTotalAmountInWords(toWords.convert(payment?.total_amount ?? 0));
            setReference(payment?.reference);
            setSubject(payment?.subject);
            setSelectedInvoices(
                payment?.invoice_mappings?.map((invoice) => invoice.invoice_id)
            );

            const paymentCurrency = currencies.find(
                (currency) =>
                    currency.currency_id ===
                    payment?.currency_details?.currency_id
            );
            setCurrency(paymentCurrency?.currency_abv || "AED");
            setTermsAndConditions(payment?.terms_and_conditions);
        }
        if (type === "create") {
            setReceiptNumber(number);
        }
    }, [payment, number, currencies]);

    const toWords = new ToWords({
        localeCode: "en-US",
        converterOptions: {
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
        },
    });

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

    const filterOption = (input, option) => {
        return (option?.label ?? "")
            .toLowerCase()
            .includes(input.toLowerCase());
    };

    const showModal = () => {
        setIsModalOpen(true);
        customerId("addCustomer");
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (paymentLoading) {
            return;
        }
        if (
            receiptNumber === "" ||
            receiptDate == null ||
            customerId == null ||
            currencyConversionRate <= 0 ||
            totalAmount <= 0 ||
            !paymentMethod
        ) {
            toast.error("Please fill and check all fields.");
            return;
        }

        const data = {
            customer_id: customerId,
            receipt_number: receiptNumber,
            receipt_date: receiptDate,
            invoice_list: selectedInvoices,
            currency_id: currencyId,
            currency_conversion_rate: Number(currencyConversionRate),
            payment_method_type: paymentMethod,
            bank_id: paymentMethod === "bank" ? bankId : null,
            other_receipt_payment_method_details:
                paymentMethod === "other" ? customPaymentNote : "",
            total_amount: Number(totalAmount),
            reference: reference || "",
            subject: subject || "",
            terms_and_conditions: termsAndConditions || "",
        };

        if (isAdd) {
            dispatch(createPayments(data, navigate));
        } else {
            dispatch(
                updatePayments(
                    receipt_id,
                    data,
                    navigate,
                    user?.localInfo?.role
                )
            );
        }
    };

    const handleCustomerSubmit = (data) => {
        setIsModalOpen(false);
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
        dispatch(getCustomerDetails(data.customer_id));
        setCustomerId(data.customer_id);
        setCustomerName(data.customer_name);
        dispatch(readOpenTaxInvoicesForCustomer(data.customer_id, currencyId));
    };

    useEffect(() => {
        dispatch(getCustomerInfiniteScroll(1, true));
        setCurrentCustomerPage(1);
    }, [dispatch]);

    useEffect(() => {
        if (customerKeyword === null) return;
        dispatch(getCustomerInfiniteScroll(1, true, customerKeyword));
        setCurrentCustomerPage(1);
    }, [customerKeyword, dispatch]);

    const onChangeCustomer = (value) => {
        if (value.customer_id === "addCustomer") {
            showModal();
            return;
        }
        setCustomerId(value.customer_id);
        const customerSelected = customersInf.find((customer) => {
            return customer.customer_id === value.customer_id;
        });
        setCustomerName(customerSelected.customer_name);
        dispatch(getCustomerDetails(value.customer_id));
        dispatch(getShippingAddressList(value.customer_id));
        dispatch(readOpenTaxInvoicesForCustomer(value.customer_id, currencyId));
    };

    const addPage = (current) => {
        if (customerLoading) return;
        if ((current - 1) * 20 > totalCustomers) return;
        if (currentCustomerPage >= current) return;
        dispatch(getCustomerInfiniteScroll(current, false));
        setCurrentCustomerPage((prev) => prev + 1);
    };

    const companyData = SHOW_DUMMY_DATA
        ? dummyCompanyData
        : user?.clientInfo?.company_data;

    useEffect(() => {
        dispatch(getBankList(1));
        setCurrentBankPage(1);
    }, [dispatch]);

    useEffect(() => {
        if (bankKeyword === null) return;
        dispatch(getBankList(1, true, bankKeyword));
        setCurrentBankPage(1);
    }, [bankKeyword, dispatch]);

    useEffect(() => {
        if (banks.length === 0 && !bankState.loading) {
            dispatch(getBankList(1));
        }
    }, [banks, bankState.loading, dispatch]);

    const onChangeBankSelection = (value) => {
        if (value.bank_id === "addBank") {
            // Handle add new bank logic
            return;
        }
        setBankId(value.bank_id);
    };

    const renderPaymentMethodSelection = () => {
        const handlePaymentMethodSelect = (method, note = "") => {
            setPaymentMethod(method);
            if (method === "bank") {
                setShowBankSelect(true);
                setCustomPaymentNote("");
            } else if (method === "other") {
                setCustomPaymentNote(note);
                setBankId(null);
                setShowBankSelect(false);
            } else if (method === "cash") {
                setBankId(null);
                setCustomPaymentNote("");
                setShowBankSelect(false);
            }
        };

        return (
            <div className="flex flex-col gap-2">
                {paymentMethod ? (
                    <div className="flex flex-row items-start justify-between gap-4 p-2 border border-gray-300 rounded-lg shadow-sm bg-white">
                        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                            {paymentMethod === "bank" && bankId ? (
                                <>
                                    Bank:{" "}
                                    {
                                        banks.find((b) => b.bank_id === bankId)
                                            ?.bank_name
                                    }
                                    <span className="text-xs text-gray-600 block">
                                        Account:{" "}
                                        {
                                            banks.find(
                                                (b) => b.bank_id === bankId
                                            )?.account_number
                                        }
                                    </span>
                                </>
                            ) : paymentMethod === "bank" ? (
                                <span>Bank</span>
                            ) : paymentMethod === "cash" ? (
                                <span>Cash</span>
                            ) : (
                                <span className="lg:max-w-80 whitespace-pre-wrap break-words overflow-hidden">
                                    {customPaymentNote}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setPaymentMethod(null);
                                setBankId(null);
                                setCustomPaymentNote("");
                                setShowBankSelect(false);
                            }}
                            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-200"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ) : (
                    <Button
                        text="Select Payment Method"
                        onClick={() => setPaymentMethodModalVisible(true)}
                        type="button"
                        className="w-full bg-white !text-gray-500 border-2"
                    />
                )}

                <PaymentMethodModal
                    visible={paymentMethodModalVisible}
                    onCancel={() => setPaymentMethodModalVisible(false)}
                    onSelect={handlePaymentMethodSelect}
                />

                {showBankSelect && (
                    <div className="mt-4">
                        <BankModalSelect
                            loadMoreOptions={() => {}}
                            onChange={(value) => {
                                onChangeBankSelection(value);
                                setShowBankSelect(false);
                            }}
                            bankKeyword={bankKeyword}
                            setBankKeyword={setBankKeyword}
                            banks={banks}
                        />
                    </div>
                )}
            </div>
        );
    };

    const handleInvoiceSelection = (invoiceId, isChecked) => {
        if (isChecked) {
            setSelectedInvoices([...selectedInvoices, invoiceId]);
        } else {
            setSelectedInvoices(
                selectedInvoices.filter((id) => id !== invoiceId)
            );
        }
    };

    if (paymentLoading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <DeviceRestriction>
            <Fragment>
                <Breadcrumb
                    item={{
                        label: "Receipts",
                        viewLabel: "Create Receipts",
                    }}
                />
                <div className="mx-auto flex items-center justify-center mt-4">
                    <div className="bg-white lg:min-w-[700px] border">
                        <TemplateHeader
                            title={"Receipt"}
                            logo={user?.clientInfo?.company_logo_url}
                        />

                        <form>
                            <div className="flex flex-col w-full">
                                <div className="w-full px-2 md:px-4 flex flex-col md:flex-row md:justify-between gap-6 md:gap-0">
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
                                                {companyData?.state +
                                                    ", " +
                                                    companyData?.country}
                                            </span>
                                        )}
                                        {companyData?.vat_trn && (
                                            <span className="text-xs">
                                                VAT TRN: {companyData?.vat_trn}
                                            </span>
                                        )}
                                        {companyData?.corporate_tax_trn && (
                                            <span className="text-xs">
                                                Corporate Tax TRN:{" "}
                                                {companyData?.corporate_tax_trn}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1 gap-2">
                                            <span className="text-gray-400 text-base font-medium after:content-['*'] after:ml-0.5 after:text-red-500 whitespace-nowrap">
                                                Receipt Number
                                            </span>
                                            <input
                                                className="w-full sm:max-w-36 sm:w-36 sm:ml-8 text-left border-2 rounded px-2 py-1 outline-none"
                                                name="receiptNumber"
                                                type="text"
                                                value={receiptNumber}
                                                onChange={(e) => {
                                                    const input =
                                                        e.target.value;
                                                    setReceiptNumber(
                                                        "RC-" +
                                                            input.substr(
                                                                "RC-".length
                                                            )
                                                    );
                                                }}
                                                {...(user?.localInfo?.role && {
                                                    disabled: true,
                                                })}
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1 gap-2">
                                            <span className="text-gray-400 text-base font-medium after:content-['*'] after:ml-0.5 after:text-red-500 whitespace-nowrap">
                                                Receipt Date
                                            </span>
                                            <input
                                                className="w-full sm:max-w-36 sm:w-36 sm:ml-8 text-left border-2 rounded px-2 py-1 outline-none"
                                                type="date"
                                                name="receiptDate"
                                                value={receiptDate}
                                                defaultValue={receiptDate}
                                                onChange={(e) =>
                                                    setReceiptDate(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                                        {customerName ||
                                                            "No Name Provided"}
                                                    </span>
                                                    <span className="text-xs text-gray-600 truncate">
                                                        {customer?.billing_address_line_1 ||
                                                            "No Address Available"}
                                                    </span>
                                                    {customer?.billing_address_line_2 && (
                                                        <span className="text-xs text-gray-600 truncate">
                                                            {
                                                                customer?.billing_address_line_2
                                                            }
                                                        </span>
                                                    )}
                                                    {customer?.billing_address_line_3 && (
                                                        <span className="text-xs text-gray-600 truncate">
                                                            {
                                                                customer?.billing_address_line_3
                                                            }
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
                                                            VAT TRN:{" "}
                                                            {customer.trn}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => {
                                                        setCustomerName("");
                                                        setCustomerId(null);
                                                        setSelectedInvoices([]);
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
                                                    customerKeyword={
                                                        customerKeyword
                                                    }
                                                    setCustomerKeyword={
                                                        setCustomerKeyword
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full lg:w-1/2">
                                        <h3 className="text-lg font-medium mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                                            Payment Method
                                        </h3>
                                        {renderPaymentMethodSelection()}
                                    </div>
                                </div>

                                {customerId && (
                                    <div className="w-full px-2 md:px-4 my-5">
                                        <h3 className="text-lg font-medium mb-4">
                                            Open Invoices
                                        </h3>
                                        {openTaxInvoices?.length > 0 ? (
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Select
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Invoice Number
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Amount
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Balance Due
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {openTaxInvoices?.map(
                                                            (invoice) => (
                                                                <tr
                                                                    key={
                                                                        invoice.invoice_id
                                                                    }
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <Checkbox
                                                                            checked={selectedInvoices.includes(
                                                                                invoice.invoice_id
                                                                            )}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleInvoiceSelection(
                                                                                    invoice.invoice_id,
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {
                                                                            invoice.invoice_number
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {moment(
                                                                            invoice.invoice_date
                                                                        ).format(
                                                                            "DD MMM YYYY"
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {
                                                                            invoice.total_amount
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {
                                                                            invoice.balance_due
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="border rounded-lg p-8 text-center bg-white">
                                                <p className="text-gray-500">
                                                    No open invoices available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="w-full px-2 md:px-4  flex flex-col justify-between gap-1">
                                    <h3 className="text-lg font-medium after:content-['*'] after:ml-0.5 after:text-red-500">
                                        Select Currency
                                    </h3>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center py-1 gap-4">
                                        <div className="w-full sm:w-auto">
                                            <Select
                                                value={currencyId}
                                                onChange={onChangeCurrency}
                                                options={currencies?.map(
                                                    (currency) => ({
                                                        value: currency.currency_id,
                                                        label: currency.currency_abv,
                                                    })
                                                )}
                                                placeholder={"Select Currency"}
                                                className={"text-black w-full"}
                                                loading={currencyLoading}
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
                                                        e.target.value.match(
                                                            /^\d*\.?\d{0,4}$/
                                                        );
                                                    if (valid) {
                                                        setCurrencyConversionRate(
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                            />
                                            <span>AED</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-2 sm:px-4 my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">
                                            Amount Received
                                        </h3>
                                        <Input
                                            placeholder="Amount"
                                            value={totalAmount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                    setTotalAmount("");
                                                    setTotalAmountInWords("");
                                                } else {
                                                    const numValue =
                                                        parseFloat(value);
                                                    if (
                                                        !isNaN(numValue) &&
                                                        numValue >= 0
                                                    ) {
                                                        setTotalAmount(value);
                                                        setTotalAmountInWords(
                                                            toWords.convert(
                                                                numValue
                                                            )
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">
                                            Amount Received (in words)
                                        </h3>
                                        <TextArea
                                            placeholder="Amount in words"
                                            value={totalAmountInWords}
                                            readOnly
                                            className="w-full resize-none"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="text-lg font-medium mb-2 px-2 sm:px-4">
                                    <h3 className="text-lg font-medium mb-2">
                                        Subject
                                    </h3>
                                    <Input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => {
                                            if (
                                                e?.target?.value?.length <=
                                                MAX_LENGTH
                                            ) {
                                                setSubject(e.target.value);
                                            }
                                        }}
                                        maxLength={MAX_LENGTH}
                                        placeholder="Enter Subject..."
                                    />
                                    <span className="text-gray-500 text-xs mt-1">
                                        {subject?.length || 0}/{MAX_LENGTH}{" "}
                                        characters
                                    </span>
                                </div>
                            </div>

                            <div className="w-fit ml-auto p-5">
                                <Button
                                    disabled={paymentLoading}
                                    text={
                                        paymentLoading
                                            ? "Please wait..."
                                            : actionType === "edit"
                                            ? "Edit Receipt"
                                            : "Create Receipt"
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

export default PaymentLayout;
