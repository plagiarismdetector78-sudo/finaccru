import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import { readBankStatment, getBankDetails } from '../../../../Actions/Bank';

import { ArrowRightOutlined } from '@ant-design/icons';
import logo from "../../../../assets/Icons/cropped_logo.svg";

import PdfDownload from "../../../../Shared/PdfDownload/PdfDownload";
import StatementHead from './Parts/StatementHead';
import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../../Styles/ReadStatementHead';
import StatementSummary from './Parts/StatementSummary';
import { pdfStyle as summaryPdfStyle, styles as summaryStyles } from '../../../../Styles/ReadStatementSummary';
import StatementTable from './Parts/StatementTable';
import { pdfStyle as tablePdfStyle, styles as tableStyles } from '../../../../Styles/ReadStatementTable';

const BankStatement = ({ bank_id }) => {
    const dispatch = useDispatch();

    const { bankStatement, loading, error } = useSelector(state => state.bankReducer);
    const { user } = useSelector(state => state.userReducer);
    const { bank } = useSelector(state => state.bankReducer);
    const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"));

    useEffect(() => {
        dispatch(getBankDetails(bank_id));
    }, [dispatch, bank_id])

    useEffect(() => {
        if (startDate && endDate) {
            dispatch(readBankStatment(bank_id, {
                from_date: startDate,
                to_date: endDate
            }));
        }
    }, [dispatch, bank_id, startDate, endDate]);

    const contents = [
        {
            component: StatementHead,
            height: 120,
            props: {
                styles: headPdfStyle,
                user: user?.clientInfo,
                bank: bank
            }
        },
        {
            component: StatementSummary,
            height: 120,
            props: {
                styles: summaryPdfStyle,
                start_date: startDate,
                end_date: endDate,
                opening_balance: bankStatement?.opening_balance,
                additions: bankStatement?.additions,
                withdrawals: bankStatement?.withdrawals,
                closing_balance: bankStatement?.closing_balance,
            }
        },
        {
            component: StatementTable,
            height: ((bankStatement?.transactions || []).length * 50) + 100,
            props: {
                styles: tablePdfStyle,
                transactions: bankStatement?.transactions
            }
        }
    ];


    return (
        <div className="read__bank--statements">
            <div className='read__customer--statements-header'>
                <div className='read__customer--statements--header-dates'>
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
                <div className='read__customer--statements-header-download-btn'>
                    <PdfDownload contents={contents} heading={""} name={bank?.account_holder_name} logo={user?.clientInfo?.company_logo_url} />
                </div>
            </div>
            <div className="read__customer-statement-container">
                <div className="read__customer-statement-main">
                    <div className="read__customer-statement-top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                    </div>
                    <StatementHead styles={headStyles}
                        bank={bank} user={user?.clientInfo}
                    />
                    {
                        startDate && endDate && (
                            <>
                                <StatementSummary styles={summaryStyles}
                                    start_date={startDate} end_date={endDate}
                                    opening_balance={bankStatement?.opening_balance}
                                    additions={bankStatement?.additions}
                                    withdrawals={bankStatement?.withdrawals}
                                    closing_balance={bankStatement?.closing_balance}
                                />
                                <StatementTable styles={tableStyles} transactions={bankStatement?.transactions} />
                            </>
                        )
                    }
                    <div className="read__customer-statement-footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='read__customer-statement-footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankStatement;
