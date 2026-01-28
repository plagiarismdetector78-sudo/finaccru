import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getBillPaymentDetails, submitBillPaymentForApproval, markBillPaymentVoid, approveBillPayment } from '../../../Actions/BillPayment';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import { readAccountantClient } from '../../../Actions/Accountant';
import Loader from '../../Loader/Loader';

import "../../Payment/PaymentRead/PaymentRead.css";
import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"

import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';
import { ToWords } from 'to-words';

import PaymentHead from '../../Payment/PaymentRead/Parts/PaymentHead';
import { pdfStyle as headPdfStyle, styles as headStyles } from '../../../Styles/ReadHead';
import PaymentFor from '../../Payment/PaymentRead/Parts/PaymentFor';
import { pdfStyle as forPdfStyles, styles as forStyles } from '../../../Styles/ReadForPayment';
import PaymentMeta from '../../Payment/PaymentRead/Parts/PaymentMeta';
import { pdfStyle as metaPdfStyles, styles as metaStyles } from '../../../Styles/ReadMetaPayment';
import { setChatDocument } from '../../../Actions/Chat';

const BillPaymentReadLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading, billPayment } = useSelector(state => state.billPaymentReducer);

    const payment_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const { currencies } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getBillPaymentDetails(payment_id, user?.localInfo?.role));
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, payment_id, user?.localInfo?.role, client_id]);

    useEffect(() => {
        dispatch(setChatDocument({ id: billPayment?.payment_id, number: billPayment?.payment_number }));
        return () => {
            dispatch({ type: "RemoveChatDocument" });
        }
    }, [dispatch, billPayment]);

    const toWords = new ToWords({
        localeCode: 'en-US',
        converterOptions: {
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
        }
    });

    const contents = [
        {
            component: PaymentHead,
            height: 90,
            props: {
                styles: headPdfStyle,
                title: "Bill Payment",
                address_line_1: user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1,
                address_line_2: user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2,
                address_line_3: user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3,
                company_name: user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name,
                country: user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country,
                state: user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state,
                trade_license_number: user?.localInfo?.role ? client?.company_data?.trade_license_number : user?.clientInfo?.company_data?.trade_license_number,
                payment_number: billPayment?.payment_number,
                payment_date: billPayment?.payment_date,
            }
        },
        {
            component: PaymentFor,
            height: ((billPayment?.invoice_mappings || []).length) * 35 + 10,
            props: {
                styles: forPdfStyles,
                title: "Bill Payment",
                vendor_name: billPayment?.vendor?.vendor_name,
                billing_address_line_1: billPayment?.vendor?.billing_address_line_1,
                billing_address_line_2: billPayment?.vendor?.billing_address_line_2,
                billing_address_line_3: billPayment?.vendor?.billing_address_line_3,
                billing_state: billPayment?.vendor?.billing_state,
                billing_country: billPayment?.vendor?.billing_country,
                trn: billPayment?.vendor?.trn,
                invoice_mappings: billPayment?.bill_mappings,
                total_amount: billPayment?.total_amount,
                amount_in_words: toWords.convert(billPayment?.total_amount ?? 0),
                currency_abv: currencies?.find((currency) => currency.currency_id === billPayment?.currency_id)?.currency_abv
            }
        },
        {
            component: PaymentMeta,
            height: 150,
            props: {
                styles: metaPdfStyles,
                currency_abv: currencies?.find((currency) => currency.currency_id === billPayment?.currency_id)?.currency_abv,
                currency_conversion_rate: billPayment?.currency_conversion_rate,
                subject: billPayment?.subject,
                bank_id: billPayment?.bank_id === 0 ? "Cash"
                    : billPayment?.bank_id === (user?.localInfo?.role === 0 ? user?.clientInfo?.primary_bank?.bank_id : client.primary_bank?.bank_id) ?
                        (user?.localInfo?.role === 0 ? user?.clientInfo?.primary_bank?.bank_name : client?.primary_bank?.bank_name) :
                        (user?.localInfo?.role === 0 ? user?.clientInfo?.other_bank_accounts?.find((bank) => bank.bank_id === billPayment?.bank_id)?.bank_name
                            : client?.other_bank_accounts?.find((bank) => bank.bank_id === billPayment?.bank_id)?.bank_name)
            }
        }
    ];

    return (
        <>
            <div className='read__payment__header'>
                <div className='read__payment__header--left'>
                    <img src={backButton} alt='back' className='read__payment__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/bill-payment"}`)} />
                    <h1 className='read__payment__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Bill Payments List'}
                    </h1>
                </div>
                <div className='read__payment__header--right'>
                    {
                        user?.localInfo?.role ?
                            <>
                                <a className='read__payment__header--btn1'
                                    onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/bill-payment/edit/${payment_id}`)}
                                >Edit</a>
                                <a className='read__payment__header--btn2'
                                    onClick={() => {
                                        dispatch(approveBillPayment(payment_id, user?.localInfo?.role, client_id));
                                    }}
                                >Approve</a>
                            </> :
                            billPayment?.payment_status === "Approved" || billPayment?.payment_status === "Void" ? "" :
                                billPayment?.payment_status === "Pending Approval" ?
                                    <>
                                        <a className='read__payment__header--btn1'
                                            onClick={() => {
                                                dispatch(markBillPaymentVoid(payment_id))
                                            }}
                                        >Mark as Void</a>
                                        <a className='read__payment__header--btn1'
                                            onClick={() => navigate(`/bill-payment/edit/${payment_id}`)}
                                        >Edit</a>
                                    </> :
                                    <>
                                        <a className='read__payment__header--btn1'
                                            onClick={() => {
                                                dispatch(submitBillPaymentForApproval(payment_id))
                                            }}
                                        >Submit for Approval</a>
                                        <a className='read__payment__header--btn1'
                                            onClick={() => {
                                                dispatch(markBillPaymentVoid(payment_id))
                                            }}
                                        >Mark as Void</a>
                                        <a className='read__payment__header--btn1'
                                            onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/bill-payment/edit/${payment_id}`)}
                                        >Edit</a>
                                    </>
                    }
                    <PdfDownload contents={contents} heading={"Bill Payment"} name={billPayment?.payment_number} logo={user?.localInfo?.role ? client?.company_logo_url : user?.clientInfo?.company_logo_url} />
                </div>
            </div>
            <div className="read__payment__container">
                {loading ? <Loader /> :
                    <div className="read__payment--main" id="read__payment--main">
                        <div className="read__payment--top">
                            <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                                <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.localInfo?.role ? client?.company_logo_url : user?.clientInfo?.company_logo_url} alt="logo" />
                            </div>
                            <h1 className='read__payment--head'>Bill Payment</h1>
                        </div>
                        <PaymentHead styles={headStyles} title="Bill Payment"
                            address_line_1={user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}
                            country={user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}
                            state={user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state}
                            vat_trn={user?.localInfo?.role ? client?.company_data?.vat_trn : user?.clientInfo?.company_data?.vat_trn}
                            corporate_tax_trn={user?.localInfo?.role ? client?.company_data?.corporate_tax_trn : user?.clientInfo?.company_data?.corporate_tax_trn}
                            payment_number={billPayment?.payment_number} payment_date={billPayment?.payment_date}
                        />
                        <PaymentFor styles={forStyles} title="Bill Payment" vendor_name={billPayment?.vendor?.vendor_name} billing_address_line_1={billPayment?.vendor?.billing_address_line_1} billing_address_line_2={billPayment?.vendor?.billing_address_line_2} billing_address_line_3={billPayment?.vendor?.billing_address_line_3} billing_state={billPayment?.vendor?.billing_state} billing_country={billPayment?.vendor?.billing_country} trn={billPayment?.vendor?.trn}
                            invoice_mappings={billPayment?.bill_mappings || []} total_amount={billPayment?.total_amount}
                            amount_in_words={toWords.convert(billPayment?.total_amount ?? 0)}
                            currency_abv={currencies?.find((currency) => currency.currency_id === billPayment?.currency_id)?.currency_abv}
                        />
                        <PaymentMeta styles={metaStyles} currency_abv={currencies?.find((currency) => currency.currency_id === billPayment?.currency_id)?.currency_abv} currency_conversion_rate={billPayment?.currency_conversion_rate} subject={billPayment?.subject}
                            bank_id={
                                billPayment?.bank_id === 0 ? "Cash"
                                    : billPayment?.bank_id === (user?.localInfo?.role === 0 ? user?.clientInfo?.primary_bank?.bank_id : client.primary_bank?.bank_id) ?
                                        (user?.localInfo?.role === 0 ? user?.clientInfo?.primary_bank?.bank_name : client?.primary_bank?.bank_name) :
                                        (user?.localInfo?.role === 0 ? user?.clientInfo?.other_bank_accounts?.find((bank) => bank.bank_id === billPayment?.bank_id)?.bank_name
                                            : client?.other_bank_accounts?.find((bank) => bank.bank_id === billPayment?.bank_id)?.bank_name)
                            }
                        />
                        <div className="read__payment__footer">
                            <img style={{ width: "5rem" }} src={logo} alt="logo" />
                            <div className='read__payment__footer--text'>
                                <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                                <span style={{ marginTop: "0.8rem", fontWeight: "700", fontSize: "0.8rem" }}> powered by Finaccru </span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default BillPaymentReadLayout;
