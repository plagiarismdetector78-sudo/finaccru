// import dashboard from "./assets/dashboardIcons/dashboard.svg";
// import estimate from "./assets/dashboardIcons/estimate.svg";
// import proforma from "./assets/dashboardIcons/proforma.svg";
// import taxInvoice from "./assets/dashboardIcons/tax-invoice.svg";
// import creditNote from "./assets/dashboardIcons/credit-note.svg";
// import paymentIcon from "./assets/dashboardIcons/payment.svg";
// import bankIcon from "./assets/dashboardIcons/bank.svg";
// import customerIcon from "./assets/dashboardIcons/customer.svg";
// import vendorIcon from "./assets/dashboardIcons/vendor.svg";
// import purchaseOrderIcon from "./assets/dashboardIcons/purchase-order.svg";
// import billIcon from "./assets/dashboardIcons/bill.svg";
// import debitNoteIcon from "./assets/dashboardIcons/debit-note.svg";
// import expenseIcon from "./assets/dashboardIcons/expense.svg";
// import billPaymentIcon from "./assets/dashboardIcons/bill-payment.svg";

import Dashboard from "./components/Dashboard/Dashboard";
import Customer from "./components/Customer/Customer";
import CustomerLayout from "./components/Customer/CustomerLayout/CustomerLayout";
import CustomerRead from "./components/Customer/CustomerRead/CustomerRead";
import Estimate from "./components/Estimate/Estimate";
import EstimateLayout from "./components/Estimate/EstimateLayout/EstimateLayout";
import EstimateRead from "./components/Estimate/EstimateRead/EstimateRead";
import Proforma from "./components/Proforma/Proforma";
import ProformaLayout from "./components/Proforma/ProformaLayout/ProformaLayout";
import ProformaRead from "./components/Proforma/ProformaRead/ProformaRead";
import TaxInvoice from "./components/TaxInvoice/TaxInvoice";
import TaxInvoiceLayout from "./components/TaxInvoice/TaxInvoiceLayout/TaxInvoiceLayout";
import TaxInvoiceRead from "./components/TaxInvoice/TaxInvoiceRead/TaxInvoiceRead";
import CreditNote from "./components/CreditNote/CreditNote";
import CreditNoteLayout from "./components/CreditNote/CreditNoteLayout/CreditNoteLayout";
import CreditNoteRead from "./components/CreditNote/CreditNoteRead/CreditNoteRead";
import Payment from "./components/Payment/Payment";
import PaymentLayout from "./components/Payment/PaymentLayout/PaymentLayout";
import PaymentRead from "./components/Payment/PaymentRead/PaymentRead";
import Bank from "./components/Bank/Bank";
import BankLayout from "./components/Bank/BankLayout/BankLayout";
import BankRead from "./components/Bank/BankRead/BankRead";
import Vendor from "./components/Vendor/Vendor";
import VendorLayout from "./components/Vendor/VendorLayout/VendorLayout";
import VendorRead from "./components/Vendor/VendorRead/VendorRead";
import PurchaseOrder from "./components/PurchaseOrder/PurchaseOrder";
import PurchaseOrderLayout from "./components/PurchaseOrder/PurchaseOrderLayout/PurchaseOrderLayout";
import PurchaseOrderRead from "./components/PurchaseOrder/PurchaseOrderRead/PurchaseOrderRead";
import Bill from "./components/Bill/Bill";
import BillLayout from "./components/Bill/BillLayout/BillLayout";
import BillRead from "./components/Bill/BillRead/BillRead";
import DebitNote from "./components/DebitNote/DebitNote";
import DebitNoteLayout from "./components/DebitNote/DebitNoteLayout/DebitNoteLayout";
import DebitNoteRead from "./components/DebitNote/DebitNoteRead/DebitNoteRead";
import Expense from "./components/Expense/Expense";
import ExpenseLayout from "./components/Expense/ExpenseLayout/ExpenseLayout";
import ExpenseRead from "./components/Expense/ExpenseRead/ExpenseRead";
import BillPayment from "./components/BillPayment/BillPayment";
import BillPaymentLayout from "./components/BillPayment/BillPaymentLayout/BillPaymentLayout";
import BillPaymentRead from "./components/BillPayment/BillPaymentRead/BillPaymentRead";

import {
    LayoutGrid,
    FileText,
    FilePlus,
    FileMinus,
    ReceiptText,
    Banknote,
    User,
    ClipboardList,
    FileCheck,
    FileX,
    FileInput,
    FileOutput,
    DollarSign,
    CreditCard,
} from "lucide-react";
import ViewCustomer from "./components/Customer/ViewCustomer";

function getItem(
    label,
    icon,
    component,
    changecomponent = null,
    viewcomponent = null
) {
    let newKey = `/${label.toLowerCase().replace(/\s+/g, "-")}`;
    let newLabel = label;

    if (newLabel === "Dashboard") newKey = "/";
    if (newLabel === "Proforma") newLabel = "Proforma Invoice";
    if (newLabel === "Payment") newLabel = "Receipt";

    return {
        key: newKey,
        icon,
        label: newLabel,
        component,
        viewcomponent,
        changecomponent,
    };
}

const items = [
    getItem("Dashboard", <LayoutGrid />, <Dashboard />), // Dashboard

    getItem(
        "Customer", // Label
        <User />, // Icon
        <Customer />, // Base Component
        <CustomerLayout />, // Create or Edit
        <ViewCustomer /> // View
    ),

    getItem(
        "Estimate", // Label
        <FileText />, // Icon
        <Estimate />, // Base Component
        <EstimateLayout />, // Create or Edit
        <EstimateRead /> // View
    ),

    getItem(
        "Proforma", // Label
        <FilePlus />, // Icon
        <Proforma />, // Base Component
        <ProformaLayout />, // Create or Edit
        <ProformaRead /> // View
    ),

    getItem(
        "Tax Invoice", // Label
        <FileCheck />, // Icon
        <TaxInvoice />, // Base Component
        <TaxInvoiceLayout />, // Create or Edit
        <TaxInvoiceRead /> // View
    ),

    getItem(
        "Credit Note", // Label
        <FileMinus />, // Icon
        <CreditNote />, // Base Component
        <CreditNoteLayout />, // Create or Edit
        <CreditNoteRead /> // View
    ),

    getItem(
        "Payment", // Label
        <ReceiptText />, // Icon
        <Payment />, // Base Component
        <PaymentLayout />, // Create or Edit
        <PaymentRead /> // View
    ),

    // getItem(
    //     "Bank", // Label
    //     <Banknote />, // Icon
    //     <Bank />, // Base Component
    //     <BankLayout />, // Create or Edit
    //     <BankRead /> // View
    // ),

    // getItem(
    //     "Vendor", // Label
    //     <ClipboardList />, // Icon
    //     <Vendor />, // Base Component
    //     <VendorLayout />, // Create or Edit
    //     <VendorRead /> // View
    // ),

    // getItem(
    //     "Purchase Order", // Label
    //     <FileInput />, // Icon
    //     <PurchaseOrder />, // Base Component
    //     <PurchaseOrderLayout />, // Create or Edit
    //     <PurchaseOrderRead /> // View
    // ),

    // getItem(
    //     "Bill", // Label
    //     <FileOutput />, // Icon
    //     <Bill />, // Base Component
    //     <BillLayout />, // Create or Edit
    //     <BillRead /> // View
    // ),

    // getItem(
    //     "Debit Note", // Label
    //     <FileX />, // Icon
    //     <DebitNote />, // Base Component
    //     <DebitNoteLayout />, // Create or Edit
    //     <DebitNoteRead /> // View
    // ),

    // getItem(
    //     "Expense", // Label
    //     <DollarSign />, // Icon
    //     <Expense />, // Base Component
    //     <ExpenseLayout />, // Create or Edit
    //     <ExpenseRead /> // View
    // ),

    // getItem(
    //     "Bill Payment", // Label
    //     <CreditCard />, // Icon
    //     <BillPayment />, // Base Component
    //     <BillPaymentLayout />, // Create or Edit
    //     <BillPaymentRead /> // View
    // ),
];

export const getNavLinks = (isUserTaxRegistered) => [
    { title: "Dashboard", icon: LayoutGrid, href: "/" },
    { title: "Customers", icon: User, href: "/customer" },
    { title: "Estimate", icon: FileText, href: "/estimate" },
    { title: "Proforma Invoice", icon: FilePlus, href: "/proforma" },
    {
        title: isUserTaxRegistered ? "Tax Invoice" : "Invoice",
        icon: FileCheck,
        href: "/tax-invoice",
    },
    { title: "Credit Note", icon: FileMinus, href: "/credit-note" },
    { title: "Receipt", icon: ReceiptText, href: "/payment" },
    // { title: "Banks", icon: Banknote, href: "/bank" },
    // { title: "Vendors", icon: ClipboardList, href: "/vendor" },
    // { title: "Purchase Orders", icon: FileInput, href: "/purchase-order" },
    // { title: "Bills", icon: FileOutput, href: "/bill" },
    // { title: "Debit Notes", icon: FileX, href: "/debit-note" },
    // { title: "Expenses", icon: DollarSign, href: "/expense" },
    // { title: "Bill Payments", icon: CreditCard, href: "/bill-payment" },
];

export default items;
