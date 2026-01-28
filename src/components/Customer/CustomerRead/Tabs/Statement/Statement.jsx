import { useEffect, useRef, useState } from "react";
import PdfDownload from "../../../../../Shared/PdfDownload/PdfDownload";
import moment from "moment";
import { MousePointerClick, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    readCustomerStatement,
    getCustomerDetails,
} from "../../../../../Actions/Customer";
import StatementHead from "./Parts/StatementHead";
import {
    pdfStyle as headPdfStyle,
    styles as headStyles,
} from "../../../../../Styles/ReadStatementHead";
import StatementSummary from "./Parts/StatementSummary";
import {
    pdfStyle as summaryPdfStyle,
    styles as summaryStyles,
} from "../../../../../Styles/ReadStatementSummary";
import StatementTable from "./Parts/StatementTable";
import {
    pdfStyle as tablePdfStyle,
    styles as tableStyles,
} from "../../../../../Styles/ReadStatementTable";
import Spinner from "../../../../common/Spinner";
import Button from "../../../../common/Button";
import PDFTemplateModal from "../../../../Modals/PDFTemplateModal";
import { pdfTemplates } from "../../../../../constant";
import TemplateHeader from "../../../../WebTemplates/TemplateHeader";
import TemplateBranding from "../../../../WebTemplates/TemplateBranding";
import DatePicker from "../../../../common/DatePicker";
import DeviceRestriction from "../../../../common/DeviceRestriction";
import Checkbox from "../../../../common/Checkbox";

const CustomerStatement = ({ customer_id }) => {
    const dispatch = useDispatch();

    const { customerStatement, loading, error } = useSelector(
        (state) => state.customerReducer
    );
    const { user } = useSelector((state) => state.userReducer);
    const { customer } = useSelector((state) => state.customerReducer);

    const [startDate, setStartDate] = useState(
        moment().startOf("month").format("YYYY-MM-DD")
    );
    const [endDate, setEndDate] = useState(
        moment().endOf("month").format("YYYY-MM-DD")
    );
    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const [selectedPDFTemplate, setSelectedPDFTemplate] = useState(
        pdfTemplates[0]
    );
    const [isPDFTemplateModalOpen, setIsPDFTemplateModalOpen] = useState(false);
    const [includeProforma, setIncludeProforma] = useState(false);

    const togglePDFTemplateModal = () => {
        setIsPDFTemplateModalOpen(!isPDFTemplateModalOpen);
    };

    const onSelectPDFTemplate = (template) => {
        setSelectedPDFTemplate(template);
    };

    useEffect(() => {
        if (!initialFetchDone) {
            dispatch(getCustomerDetails(customer_id));
            setInitialFetchDone(true);
        }
    }, [dispatch, customer_id, initialFetchDone]);

    const prevFetchParams = useRef({ startDate: null, endDate: null });

    useEffect(() => {
        if (
            startDate &&
            endDate &&
            !loading &&
            (prevFetchParams.current.startDate !== startDate ||
                prevFetchParams.current.endDate !== endDate ||
                prevFetchParams.current.includeProforma !== includeProforma)
        ) {
            prevFetchParams.current = { startDate, endDate, includeProforma };
            dispatch(
                readCustomerStatement(customer_id, {
                    from_date: startDate,
                    to_date: endDate,
                    is_proforma_included: includeProforma,
                })
            );
        }
    }, [dispatch, customer_id, startDate, endDate, loading, includeProforma]);

    const contents = [
        {
            component: StatementHead,
            height: 120,
            props: {
                styles: headPdfStyle,
                user: user?.clientInfo,
                customer: customer,
            },
        },
        {
            component: StatementSummary,
            height: 120,
            props: {
                styles: summaryPdfStyle,
                start_date: startDate,
                end_date: endDate,
                opening_balance: customerStatement?.opening_balance,
                invoiced_amount: customerStatement?.invoiced_amount,
                amount_received: customerStatement?.amount_received,
                exchange_gain: customerStatement?.exchange_gain,
                balance_due: customerStatement?.balance_due,
                credit_notes: customerStatement?.credit_notes,
            },
        },
        {
            component: StatementTable,
            height: (customerStatement?.transactions || []).length * 50 + 100,
            props: {
                styles: tablePdfStyle,
                transactions: customerStatement?.transactions,
            },
        },
    ];

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <div className="">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                    <DatePicker
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                    />
                    <ArrowRight />
                    <DatePicker
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                    />
                </div>
                <div className="flex items-center gap-5">
                    <Checkbox
                        label={"Include Proforma"}
                        onChange={(e) => setIncludeProforma(e.target.checked)}
                        name="includeProforma"
                        checked={includeProforma}
                        className="border-2 py-3 px-2 rounded-lg"
                    />

                    <Button
                        icon={MousePointerClick}
                        text="Choose Template"
                        variant="outlined"
                        onClick={togglePDFTemplateModal}
                        className="w-full sm:w-auto"
                    />

                    <PdfDownload
                        templatePath={selectedPDFTemplate?.key}
                        contents={contents}
                        heading={"Statement of Accounts"}
                        name={customer?.customer_name}
                        logo={user?.clientInfo?.company_logo_url}
                    />
                </div>
            </div>

            {/* Statement Content */}
            <DeviceRestriction>
                <div className="w-full flex justify-center mb-32">
                    <div className="w-[70%] max-w-[60rem] mt-8 bg-white border-2 border-bg-gray">
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
                            title={"Statement of Accounts"}
                            companyTitle={user?.clientInfo?.company_name}
                            logo={user?.clientInfo?.company_logo_url}
                        />
                        <StatementHead
                            styles={headStyles}
                            customer={customer}
                            user={user?.clientInfo}
                        />
                        {startDate && endDate && (
                            <>
                                <StatementSummary
                                    styles={summaryStyles}
                                    start_date={startDate}
                                    end_date={endDate}
                                    opening_balance={
                                        customerStatement?.opening_balance
                                    }
                                    invoiced_amount={
                                        customerStatement?.invoiced_amount
                                    }
                                    amount_received={
                                        customerStatement?.amount_received
                                    }
                                    credit_notes={
                                        customerStatement?.credit_notes
                                    }
                                    balance_due={customerStatement?.balance_due}
                                />
                                <StatementTable
                                    styles={tableStyles}
                                    transactions={
                                        customerStatement?.transactions
                                    }
                                />
                                <TemplateBranding />
                            </>
                        )}
                    </div>
                </div>
            </DeviceRestriction>

            {/* PDF Template Modal */}
            <PDFTemplateModal
                isOpen={isPDFTemplateModalOpen}
                onClose={togglePDFTemplateModal}
                onSelect={onSelectPDFTemplate}
            />
        </div>
    );
};

export default CustomerStatement;
