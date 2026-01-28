import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ToWords } from 'to-words';
import moment from 'moment';

import { Select, Input } from 'antd';
const { TextArea } = Input;
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';

import "../../Payment/PaymentLayout/PaymentLayout.css";

import { getCurrency } from '../../../Actions/Onboarding';
import { readOpenBillsForVendor } from '../../../Actions/Bill';
import { createBillPayment, getBillPaymentDetails, getNewBillPaymentNumber, updateBillPayment } from '../../../Actions/BillPayment';
import { getVendorDetails, getVendorInfiniteScroll, getVendorShippingAddressList } from '../../../Actions/Vendor';

import VendorInfiniteScrollSelect from '../../Vendor/VendorInfiniteScrollSelect/VendorInfiniteScrollSelect';

import backButton from "../../../assets/Icons/back.svg"
import logo from "../../../assets/Icons/cropped_logo.svg"
import { readAccountantClient } from '../../../Actions/Accountant';

const BillPaymentLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [vendorId, setVendorId] = useState(null);
    const [vendorName, setVendorName] = useState('');

    const [paymentNumber, setPaymentNumber] = useState('');
    const [paymentDate, setPaymentDate] = useState(moment().format('YYYY-MM-DD'));
    const [billList, setBillList] = useState([]);

    const [currencyId, setCurrencyId] = useState(1);
    const [currency, setCurrency] = useState('AED');
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);

    const [bankId, setBankId] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountInWords, setTotalAmountInWords] = useState(null);

    const [reference, setReference] = useState(null);
    const [subject, setSubject] = useState(null);

    const [vendorKeyword, setVendorKeyword] = useState(null);

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading: paymentLoading, billPayment, number } = useSelector(state => state.billPaymentReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const { loading: vendorLoading, vendorsInf, totalVendors, vendor } = useSelector(state => state.vendorReducer);
    const { loading: billLoading, openBills } = useSelector(state => state.billReducer);

    const type = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[6] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const payment_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const isAdd = type === 'create';

    const [currentVendorPage, setCurrentVendorPage] = useState(1);

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCurrency());
            dispatch(getBillPaymentDetails(payment_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(getNewBillPaymentNumber());
        }
    }, [dispatch, type, payment_id, client_id, user?.localInfo?.role]);

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getVendorDetails(billPayment?.vendor?.vendor_id));
            dispatch(readOpenBillsForVendor(billPayment?.vendor?.vendor_id, billPayment?.currency_id, user?.localInfo?.role));
        }
    }, [dispatch, billPayment, type, user?.localInfo?.role]);

    useEffect(() => {
        if (type === 'edit') {
            setVendorId(billPayment?.vendor?.vendor_id);
            setVendorName(billPayment?.vendor?.vendor_name);
            setPaymentNumber(billPayment?.payment_number);
            setPaymentDate(moment(billPayment?.payment_date).format('YYYY-MM-DD'));
            setCurrencyId(billPayment?.currency_id);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === billPayment?.currency_id)?.currency_abv : 'AED');
            setCurrencyConversionRate(billPayment?.currency_conversion_rate);
            setBankId(billPayment?.bank_id);
            setTotalAmount(billPayment?.total_amount);
            setTotalAmountInWords(toWords.convert(billPayment?.total_amount ?? 0));
            setReference(billPayment?.reference);
            setSubject(billPayment?.subject);
            setBillList(billPayment?.bill_mappings?.map((bill) => bill.bill_id));
        }
        if (type === 'create') {
            setPaymentNumber(number);
        }
    }, [currencies, billPayment, number, openBills, type, currencyId]);

    const toWords = new ToWords({
        localeCode: 'en-US',
        converterOptions: {
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
        }
    });

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
        dispatch(readOpenBillsForVendor(vendorId, value));
    }

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (paymentLoading) {
            return;
        }
        if (paymentNumber == "" || paymentDate == null || vendorId == null || currencyConversionRate <= 0 || totalAmount < 0 || bankId == null) {
            toast.error("Please fill and check all fields.");
            return;
        }
        const data = {
            vendor_id: vendorId,
            payment_number: paymentNumber,
            payment_date: paymentDate,
            bill_list: billList.length > 0 ? billList : null,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            bank_id: bankId,
            total_amount: totalAmount,
            reference: reference == null ? "" : reference,
            subject: subject == null ? "" : subject,
        }
        if (isAdd) {
            dispatch(createBillPayment(data, navigate));
        }
        else {
            dispatch(updateBillPayment(payment_id, data, navigate, user?.localInfo?.role));
        }
    }

    useEffect(() => {
        dispatch(getVendorInfiniteScroll(1, true));
        setCurrentVendorPage(1);
    }, [dispatch]);

    useEffect(() => {
        if (vendorKeyword === null) return;
        dispatch(getVendorInfiniteScroll(1, true, vendorKeyword));
        setCurrentVendorPage(1);
    }, [vendorKeyword, dispatch]);

    const onChangeVendor = (value) => {
        setVendorId(value.vendor_id);
        const vendorSelected = vendorsInf.find((vendor) => {
            return vendor.vendor_id === value.vendor_id;
        });
        setVendorName(vendorSelected.vendor_name);
        dispatch(getVendorDetails(value.vendor_id));
        dispatch(getVendorShippingAddressList(value.vendor_id));
        dispatch(readOpenBillsForVendor(value.vendor_id, currencyId));
    }

    const addPage = (current) => {
        if (vendorLoading) return;
        if ((current - 1) * 20 > totalVendors) return;
        if (currentVendorPage >= current) return;
        dispatch(getVendorInfiniteScroll(current, false));
        setCurrentVendorPage((prev) => prev + 1);
    }

    return (
        <>
            <div className='create__payment__header'>
                <div className='create__payment__header--left'>
                    <img src={backButton} alt='back' className='create__payment__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/bill-payment"}`)} />
                    <h1 className='create__payment__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Bill Payments List'}
                    </h1>
                </div>
            </div>
            <div className="payment__container">
                <div className="create__payment--main">
                    <div className="create__payment--top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.localInfo?.role ? client?.company_logo_url : user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                        <h1 className='create__payment--head'>Bill Payment</h1>
                    </div>
                    <form>
                        <div className='payment__form--part1'>
                            <div className='payment__form--part1-head'>
                                <div className='payment__form--head-info1'>
                                    {/* <h3>Bill Payment From</h3> */}
                                    <span style={{ fontWeight: 500 }}>{user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}</span>
                                    <span>{user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}</span>
                                    {
                                        user?.localInfo?.role ?
                                            <>
                                                {client?.company_data?.address_line_2 && <span>{client?.company_data?.address_line_2}</span>}
                                                {client?.company_data?.address_line_3 && <span>{client?.company_data?.address_line_3}</span>}
                                            </> :
                                            <>
                                                {user?.clientInfo?.company_data?.address_line_2 && <span>{user?.clientInfo?.company_data?.address_line_2}</span>}
                                                {user?.clientInfo?.company_data?.address_line_3 && <span>{user?.clientInfo?.company_data?.address_line_3}</span>}
                                            </>
                                    }
                                    <span>{user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state}{', '} {user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}</span>
                                    {
                                        user?.localInfo?.role ?
                                            <>
                                                {client?.company_data?.vat_trn && <span>VAT TRN: {client?.company_data?.vat_trn}</span>}
                                                {client?.company_data?.corporate_tax_trn && <span>Corporate Tax TRN: {client?.company_data?.corporate_tax_trn}</span>}
                                            </> :
                                            <>
                                                {user?.clientInfo?.company_data?.vat_trn && <span>VAT TRN: {user?.clientInfo?.company_data?.vat_trn}</span>}
                                                {user?.clientInfo?.company_data?.corporate_tax_trn && <span>Corporate Tax TRN: {user?.clientInfo?.company_data?.corporate_tax_trn}</span>}
                                            </>
                                    }
                                </div>
                                <div className='payment__form--head-info2'>
                                    <div className='payment__form--head-info2-data'>
                                        <span className='required__field'>Bill Payment Number</span>
                                        <input
                                            name="paymentNumber"
                                            type="text"
                                            value={paymentNumber}
                                            onChange={(e) => {
                                                const input = e.target.value
                                                setPaymentNumber("BP-" + input.substr("BP-".length))
                                            }}
                                            {...user?.localInfo?.role && { disabled: true }}
                                        />
                                    </div>
                                    <div className='payment__form--head-info2-data'>
                                        <span className='required__field'>Bill Payment Date</span>
                                        <input type="date"
                                            name='paymentDate'
                                            value={paymentDate}
                                            defaultValue={paymentDate}
                                            onChange={(e) => setPaymentDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='payment__form--part2-head'>
                                <div className='payment__form--part2-head-customer'>
                                    <h3 className='required__field'>Billing Address</h3>
                                    {
                                        vendorName ?
                                            <div className='payment__form--customer-data'>
                                                <div className='payment__form--customer-data-info'>
                                                    <span style={{ fontWeight: 500 }}>{vendorName}</span>
                                                    {user?.localInfo?.role ?
                                                        <>
                                                            <span>{billPayment?.vendor?.billing_address_line_1}</span>
                                                            {billPayment?.vendor?.billing_address_line_2 && <span>{billPayment?.vendor?.billing_address_line_2}</span>}
                                                            {billPayment?.vendor?.billing_address_line_3 && <span>{billPayment?.vendor?.billing_address_line_3}</span>}
                                                            {billPayment?.vendor?.billing_state && <span>{billPayment?.vendor?.billing_state + ', ' + billPayment?.vendor?.billing_country}</span>}
                                                            {billPayment?.vendor?.trn && <span>VAT TRN: {billPayment?.vendor?.trn}</span>}
                                                        </>
                                                        :
                                                        <>
                                                            <span>{vendor?.billing_address_line_1}</span>
                                                            {vendor?.billing_address_line_2 && <span>{vendor?.billing_address_line_2}</span>}
                                                            {vendor?.billing_address_line_3 && <span>{vendor?.billing_address_line_3}</span>}
                                                            {vendor?.billing_state && <span>{vendor?.billing_state + ', ' + vendor?.billing_country}</span>}
                                                            {vendor?.trn && <span>VAT TRN: {vendor?.trn}</span>}
                                                        </>
                                                    }
                                                </div>
                                                {!user?.localInfo?.role && <CloseOutlined className='payment__for--anticon-close'
                                                    onClick={() => {
                                                        setVendorName(''); setVendorId(null);
                                                    }}
                                                />}
                                            </div>
                                            :
                                            <VendorInfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeVendor} vendorKeyword={vendorKeyword} setVendorKeyword={setVendorKeyword} />
                                    }
                                </div>
                                <div className='payment__form--part2-head-customer second-select'>
                                    {
                                        vendorId ?
                                            <>
                                                <h3 className='required__field'>Open Bills</h3>
                                                <div className='payment__table--customer-data'>
                                                    <div className='payment__table--customer-data-head'>
                                                        <div>
                                                            <span style={{ fontWeight: 500 }}>Bill Number</span>
                                                        </div>
                                                        <span style={{ fontWeight: 500 }}>Balance Due</span>
                                                    </div>
                                                    <div className='payment__table--customer-data-inof-head'>
                                                        {
                                                            openBills?.length > 0 ?
                                                                billLoading ? <LoadingOutlined /> :
                                                                    openBills?.map((bill) => (
                                                                        <div className='payment__table--customer-data-info' key={bill?.bill_id}>
                                                                            <div>
                                                                                <input
                                                                                    className='margin-right-07'
                                                                                    type="checkbox"
                                                                                    checked={billList?.find((billId) => billId === bill?.bill_id) ? true : false}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.checked) {
                                                                                            setBillList((prev) => prev?.concat(bill?.bill_id));
                                                                                        }
                                                                                        else {
                                                                                            setBillList((prev) => prev.filter((billId) => billId !== bill?.bill_id));
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <span>{bill?.bill_number}</span>
                                                                            </div>
                                                                            <span>
                                                                                {currencies?.find((currency) => currency.currency_id === bill?.currency_id)?.currency_abv} &nbsp;
                                                                                {bill?.balance_due}
                                                                            </span>
                                                                        </div>
                                                                    )) :
                                                                <span className='no_data_present'>No open bills</span>
                                                        }
                                                    </div>
                                                </div>
                                            </> : <></>
                                    }
                                </div>
                            </div>
                            <div className='payment__form--part3-head'>
                                <h3 className='required__field'>Select Currency</h3>
                                <div className='payment__form--currency'>
                                    <div className='payment__form--select-currency'>
                                        <Select
                                            showSearch
                                            defaultValue="AED"
                                            optionFilterProp='children'
                                            value={currency}
                                            onChange={onChangeCurrency}
                                            filterOption={filterOption}
                                            options={currencies?.map((currency) => ({ value: currency.currency_id, label: currency.currency_abv }))}
                                            loading={currencyLoading}
                                        />
                                    </div>
                                    <div className='payment__form--currency-conversion'>
                                        <span>1</span>
                                        <span>{currency} =</span>
                                        <input
                                            type="number"
                                            value={currencyConversionRate}
                                            onChange={(e) => {
                                                const valid = e.target.value.match(/^\d*\.?\d{0,4}$/);
                                                if (valid) {
                                                    setCurrencyConversionRate(e.target.value)
                                                }
                                            }}
                                        />
                                        <span>AED</span>
                                    </div>
                                </div>
                            </div>
                            <div className='payment__form--part4-head-split'>
                                <div className='payment__form--part4-head receipt-amount1'>
                                    <h3 className='required__field'>Amount Received</h3>
                                    <Input
                                        placeholder="Amount Received"
                                        className='payment__form--part4-head-input'
                                        value={totalAmount}
                                        onChange={(e) => {
                                            const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                            if (valid) {
                                                setTotalAmount(e.target.value);
                                                if (e.target.value == '') setTotalAmountInWords(null);
                                                setTotalAmountInWords(toWords.convert(e.target.value));
                                            }
                                        }}
                                    />
                                </div>
                                <div className='payment__form--part4-head receipt-amount2'>
                                    <h3>Amount Received (in words)</h3>
                                    <TextArea
                                        placeholder="Amount Received (in words)"
                                        rows={1}
                                        value={totalAmountInWords}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className='payment__form--part4-head'>
                                <h3 className='bottom-padding-05 required__field'>Payment Method</h3>
                                <Select
                                    defaultValue={bankId}
                                    value={bankId}
                                    placeholder='Select Bill Payment Method'
                                    onChange={(e) => setBankId(e)}
                                    options={[
                                        { value: 0, label: 'Cash' },
                                        { value: (user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_id, label: (user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_name },
                                        ...((user?.localInfo?.role ? client : user?.clientInfo)?.other_bank_accounts?.map((bank) => ({ value: bank.bank_id, label: bank.bank_name })) ?? [])
                                    ]}
                                />
                            </div>
                            <div className='payment__form--part4-head bottom-margin-3'>
                                <h3>Subject</h3>
                                <TextArea
                                    placeholder="Subject"
                                    rows={1}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='payment__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    paymentLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="payment__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='payment__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.2rem", fontWeight: "600", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BillPaymentLayout;
