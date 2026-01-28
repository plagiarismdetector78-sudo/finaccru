import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Chart from "react-apexcharts";

import { getDashboardStats } from "../../Actions/Dashboard";

import DatePicker from "../common/DatePicker";
import {
    Users,
    FileText,
    Receipt,
    ClipboardList,
    ArrowRight,
    PieChart,
    BarChart,
} from "lucide-react";
import Breadcrumb from "../common/BreadCrumb";

const StatCard = ({
    icon: Icon,
    iconBgColor,
    iconColor,
    title,
    total,
    stats,
}) => {
    const getColorClass = (color) => {
        const colorMap = {
            green: "bg-green-500",
            red: "bg-red-500",
            blue: "bg-blue-500",
            yellow: "bg-yellow-500",
            purple: "bg-purple-500",
            indigo: "bg-indigo-500",
            amber: "bg-amber-500",
        };
        return colorMap[color] || "bg-gray-500";
    };

    return (
        <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-row justify-between">
                {/* Left Side: Icon, Heading, and Total */}
                <div className="flex flex-col">
                    <div
                        className={`${iconBgColor} p-2 sm:p-3 rounded-full w-fit`}
                    >
                        <Icon size={20} className={iconColor} />
                    </div>
                    <h3 className="text-gray-700 text-sm md:text-base font-medium mt-3 mb-1">
                        {title}
                    </h3>
                    <h2 className="text-xl md:text-2xl font-bold">{total}</h2>
                </div>

                {/* Right Side: Status Indicators */}
                <div className="flex flex-col justify-end">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-2 mb-1"
                        >
                            <span className="flex items-center gap-2">
                                <span
                                    className={`${getColorClass(
                                        stat.color
                                    )} w-3 h-3 rounded-sm`}
                                ></span>
                                <span className="text-xs sm:text-sm text-gray-500">
                                    {stat.label}
                                </span>
                            </span>
                            <span
                                className={`text-xs sm:text-sm font-medium ${
                                    stat.color === "green"
                                        ? "text-green-600"
                                        : "text-gray-600"
                                }`}
                            >
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(
        moment().startOf("month").toDate()
    );
    const [endDate, setEndDate] = useState(moment().endOf("month").toDate());

    const { statsLoading, stats } = useSelector(
        (state) => state.dashboardReducer
    );

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(
                getDashboardStats({
                    start_date: `${moment(startDate).format(
                        "YYYY-MM-DD"
                    )}T00:00:00.000Z`,
                    end_date: `${moment(endDate).format(
                        "YYYY-MM-DD"
                    )}T23:59:59.000Z`,
                })
            );
        }
    }, [dispatch, startDate, endDate]);

    // Sales Bar Chart Options
    const salesBarOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
        },
        colors: ["#4A3AFF"],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: stats?.sales_list?.map((item) => item.month) || [],
        },
        title: {
            text: "Sales (net of credit notes)",
            align: "left",
            style: {
                fontSize: "16px",
                fontWeight: "600",
            },
        },
    };

    const salesBarSeries = [
        {
            name: "Sales Amount",
            data:
                stats?.sales_list?.map((item) => parseFloat(item.value)) || [],
        },
    ];

    // Sales By Customer Pie Chart Options
    const salesByCustomerOptions = {
        chart: {
            type: "pie",
            height: 350,
        },
        colors: ["#B8ADFF", "#C3F7DE", "#FCEBB0", "#FEC6C6", "#333333"],
        labels:
            stats?.sales_by_customers?.map((item) => item.customer_name) || [],
        legend: {
            position: "right",
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        title: {
            text: "Sales by Customer",
            align: "left",
            style: {
                fontSize: "16px",
                fontWeight: "600",
            },
        },
    };

    const salesByCustomerSeries =
        stats?.sales_by_customers?.map((item) => item.sales_amount) || [];

    // Stats cards data
    const customerStats = stats?.sales_stats?.customer_stats || {
        active_customers: 0,
        inactive_customers: 0,
    };
    const estimateStats = stats?.sales_stats?.estimate_stats || {
        estimate_draft: 0,
        estimate_sent: 0,
        estimate_void: 0,
        estimate_converted: 0,
    };
    const piStats = stats?.sales_stats?.pi_stats || {
        pi_draft: 0,
        pi_sent: 0,
        pi_void: 0,
        pi_converted: 0,
    };
    const invoiceStats = stats?.sales_stats?.invoice_stats || {
        invoice_draft: 0,
        invoice_pending_approval: 0,
        invoice_approved: 0,
        invoice_void: 0,
    };
    const receiptStats = stats?.sales_stats?.receipt_stats || {
        receipt_draft: 0,
        receipt_pending_approval: 0,
        receipt_approved: 0,
        receipt_void: 0,
    };

    const creditStats = stats?.sales_stats?.credit_note_stats || {
        credit_note_draft: 0,
        credit_note_pending_approval: 0,
        credit_note_approved: 0,
        credit_note_void: 0,
    };

    return (
        <>
            <Breadcrumb
                item={{
                    label: "Dashboard",
                    viewLabel: "Dashboard Stats",
                }}
            />
            <div className="w-full p-2 sm:p-4 md:p-6 2xl:p-2 bg-gray-50">
                {/* Date Picker Section */}
                <div className="flex flex-col justify-end sm:flex-row items-center mb-6 gap-2 sm:gap-4">
                    <DatePicker
                        className="w-full sm:w-48"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholder="Start Date"
                    />
                    <ArrowRight className="hidden sm:block text-gray-500" />
                    <DatePicker
                        className="w-full sm:w-48"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholder="End Date"
                    />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 2xl:gap-2 mb-6">
                    {/* Customers Card */}
                    <StatCard
                        icon={Users}
                        iconBgColor="bg-blue-100"
                        iconColor="text-blue-600"
                        title="Total Customers"
                        total={
                            customerStats.active_customers +
                            customerStats.inactive_customers
                        }
                        stats={[
                            {
                                label: "Active",
                                value: customerStats.active_customers,
                                color: "green",
                            },
                            {
                                label: "Inactive",
                                value: customerStats.inactive_customers,
                                color: "red",
                            },
                        ]}
                    />

                    {/* Estimates Card */}
                    <StatCard
                        icon={FileText}
                        iconBgColor="bg-purple-100"
                        iconColor="text-purple-600"
                        title="Total Estimates"
                        total={
                            estimateStats.estimate_draft +
                            estimateStats.estimate_sent +
                            estimateStats.estimate_void +
                            estimateStats.estimate_converted
                        }
                        stats={[
                            {
                                label: "Draft",
                                value: estimateStats.estimate_draft,
                                color: "blue",
                            },
                            {
                                label: "Sent",
                                value: estimateStats.estimate_sent,
                                color: "yellow",
                            },
                            {
                                label: "Converted",
                                value: estimateStats.estimate_converted,
                                color: "green",
                            },
                            {
                                label: "Void",
                                value: estimateStats.estimate_void,
                                color: "red",
                            },
                        ]}
                    />

                    {/* Proforma Invoices Card */}
                    <StatCard
                        icon={FileText}
                        iconBgColor="bg-indigo-100"
                        iconColor="text-indigo-600"
                        title="Proforma Invoices"
                        total={
                            piStats.pi_draft +
                            piStats.pi_sent +
                            piStats.pi_void +
                            piStats.pi_converted
                        }
                        stats={[
                            {
                                label: "Draft",
                                value: piStats.pi_draft,
                                color: "blue",
                            },
                            {
                                label: "Sent",
                                value: piStats.pi_sent,
                                color: "yellow",
                            },
                            {
                                label: "Converted",
                                value: piStats.pi_converted,
                                color: "green",
                            },
                            {
                                label: "Void",
                                value: piStats.pi_void,
                                color: "red",
                            },
                        ]}
                    />

                    {/* Invoices Card */}
                    <StatCard
                        icon={ClipboardList}
                        iconBgColor="bg-amber-100"
                        iconColor="text-amber-600"
                        title="Total Invoices"
                        total={
                            invoiceStats.invoice_draft +
                            invoiceStats.invoice_pending_approval +
                            invoiceStats.invoice_approved +
                            invoiceStats.invoice_void
                        }
                        stats={[
                            {
                                label: "Draft",
                                value: invoiceStats.invoice_draft,
                                color: "blue",
                            },
                            {
                                label: "Pending",
                                value: invoiceStats.invoice_pending_approval,
                                color: "yellow",
                            },
                            {
                                label: "Approved",
                                value: invoiceStats.invoice_approved,
                                color: "green",
                            },
                            {
                                label: "Void",
                                value: invoiceStats.invoice_void,
                                color: "red",
                            },
                        ]}
                    />

                    {/* Credit Notes Card */}
                    <StatCard
                        icon={ClipboardList}
                        iconBgColor="bg-red-100"
                        iconColor="text-red-600"
                        title="Credit Notes"
                        total={
                            creditStats.credit_note_draft +
                            creditStats.credit_note_pending_approval +
                            creditStats.credit_note_approved +
                            creditStats.credit_note_void
                        }
                        stats={[
                            {
                                label: "Draft",
                                value: creditStats.credit_note_draft,
                                color: "blue",
                            },
                            {
                                label: "Pending",
                                value: creditStats.credit_note_pending_approval,
                                color: "yellow",
                            },
                            {
                                label: "Approved",
                                value: creditStats.credit_note_approved,
                                color: "green",
                            },
                            {
                                label: "Void",
                                value: creditStats.credit_note_void,
                                color: "red",
                            },
                        ]}
                    />

                    {/* Receipts Card */}
                    <StatCard
                        icon={Receipt}
                        iconBgColor="bg-green-100"
                        iconColor="text-green-600"
                        title="Total Receipts"
                        total={
                            receiptStats.receipt_draft +
                            receiptStats.receipt_pending_approval +
                            receiptStats.receipt_approved +
                            receiptStats.receipt_void
                        }
                        stats={[
                            {
                                label: "Draft",
                                value: receiptStats.receipt_draft,
                                color: "blue",
                            },
                            {
                                label: "Pending",
                                value: receiptStats.receipt_pending_approval,
                                color: "yellow",
                            },
                            {
                                label: "Approved",
                                value: receiptStats.receipt_approved,
                                color: "green",
                            },
                            {
                                label: "Void",
                                value: receiptStats.receipt_void,
                                color: "red",
                            },
                        ]}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Sales Bar Chart */}
                    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-sm border border-gray-100">
                        {statsLoading ? (
                            <div className="flex justify-center items-center h-48 sm:h-64">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : stats?.sales_list?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 sm:h-64">
                                <BarChart
                                    style={{
                                        fontSize: "40px",
                                        color: "#d3d3d3",
                                    }}
                                />
                                <p className="mt-2 text-gray-500">
                                    No Data Available
                                </p>
                            </div>
                        ) : (
                            <Chart
                                options={salesBarOptions}
                                series={salesBarSeries}
                                type="bar"
                                height={350}
                            />
                        )}
                    </div>

                    {/* Sales By Customer Pie Chart */}
                    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-sm border border-gray-100">
                        {statsLoading ? (
                            <div className="flex justify-center items-center h-48 sm:h-64">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : stats?.sales_by_customers?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 sm:h-64">
                                <PieChart
                                    style={{
                                        fontSize: "40px",
                                        color: "#d3d3d3",
                                    }}
                                />
                                <p className="mt-2 text-gray-500">
                                    No Data Available for Sales by Customer
                                </p>
                            </div>
                        ) : (
                            <Chart
                                options={salesByCustomerOptions}
                                series={salesByCustomerSeries}
                                type="pie"
                                height={350}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
