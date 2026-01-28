import { useEffect, useState } from 'react';
import PdfDownload from "../../../../../Shared/PdfDownload/PdfDownload";
import moment from 'moment';

import { ArrowRightOutlined } from '@ant-design/icons';
import logo from "../../../../../assets/Icons/cropped_logo.svg"
import { useDispatch, useSelector } from 'react-redux';
import { readVendorStatement, getVendorDetails } from '../../../../../Actions/Vendor';

import StatementHead from './Parts/StatementHead';
import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../../../Styles/ReadStatementHead';
import StatementSummary from './Parts/StatementSummary';
import { pdfStyle as summaryPdfStyle, styles as summaryStyles } from '../../../../../Styles/ReadStatementSummary';
import StatementTable from './Parts/StatementTable';
import { pdfStyle as tablePdfStyle, styles as tableStyles } from '../../../../../Styles/ReadStatementTable';

const VendorStatement = ({ vendor_id }) => {
    const dispatch = useDispatch();

    const { vendorStatement, loading, error } = useSelector(state => state.vendorReducer);
    const { user } = useSelector(state => state.userReducer);
    const { vendor } = useSelector(state => state.vendorReducer);
    const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"));

    useEffect(() => {
        dispatch(getVendorDetails(vendor_id));
    }, [dispatch, vendor_id])

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(readVendorStatement(vendor_id, {
                from_date: startDate,
                to_date: endDate
            }));
        }
    }, [dispatch, vendor_id, startDate, endDate]);

    const contents = [
        {
            component: StatementHead,
            height: 120,
            props: {
                styles: headPdfStyle,
                user: user?.clientInfo,
                vendor: vendor
            }
        },
        {
            component: StatementSummary,
            height: 120,
            props: {
                styles: summaryPdfStyle,
                start_date: startDate,
                end_date: endDate,
                amount_received: vendorStatement?.amount_received,
                balance_due: vendorStatement?.balance_due,
                bill_amount: vendorStatement?.bill_amount,
                debit_notes: vendorStatement?.debit_notes,
                opening_balance: vendorStatement?.opening_balance,
            }
        },
        {
            component: StatementTable,
            height: ((vendorStatement?.transactions || []).length * 40) + 100,
            props: {
                styles: tablePdfStyle,
                transactions: vendorStatement?.transactions
            }
        }
    ];


    return (
        <div className="read__vendor--statements">
            <div className='read__vendor--statements-header'>
                <div className='read__vendor--statements--header-dates'>
                    <input type="date"
                        name='startDate'
                        placeholder='Start Date'
                        defaultValue={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <ArrowRightOutlined />
                    <input type="date"
                        name='endDate'
                        placeholder='End Date'
                        defaultValue={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className='read__vendor--statements-header-download-btn'>
                    <PdfDownload contents={contents} heading={""} name={vendor?.vendor_name} logo={user?.clientInfo?.company_logo_url} />
                </div>
            </div>
            <div className="read__vendor-statement-container">
                <div className="read__vendor-statement-main">
                    <div className="read__vendor-statement-top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                    </div>
                    <StatementHead styles={headStyles}
                        vendor={vendor} user={user?.clientInfo}
                    />
                    {
                        startDate && endDate && (
                            <>
                                <StatementSummary styles={summaryStyles}
                                    start_date={startDate} end_date={endDate}
                                    amount_received={vendorStatement?.amount_received}
                                    balance_due={vendorStatement?.balance_due}
                                    bill_amount={vendorStatement?.bill_amount}
                                    debit_notes={vendorStatement?.debit_notes}
                                    opening_balance={vendorStatement?.opening_balance}
                                />
                                <StatementTable styles={tableStyles} transactions={vendorStatement?.transactions} />
                            </>
                        )
                    }
                    <div className="read__vendor-statement-footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='read__vendor-statement-footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorStatement;
