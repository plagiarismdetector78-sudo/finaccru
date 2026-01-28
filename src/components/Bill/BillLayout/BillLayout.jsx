import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import moment from 'moment';
import { getCurrency } from '../../../Actions/Onboarding';
import { getVendorDetails, calculateExpectedDeliveryDate, readPaymentTerms } from '../../../Actions/Vendor';
import { createBill, getBillDetails, getNewBillNumber, updateBill, convertStagingToBill, getExtractedBillDetails } from '../../../Actions/Bill';
import { readOpenDebitNotesForVendor } from '../../../Actions/DebitNote';
import { readOpenBillPaymentsForVendor } from '../../../Actions/BillPayment';
import { getPurchaseOrderDetails } from '../../../Actions/PurchaseOrder';
import { readAccountantClient } from '../../../Actions/Accountant';

import BillLayoutP1 from './BillLayoutP1/BillLayoutP1';
import BillLayoutP2 from './BillLayoutP2/BillLayoutP2';

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import { LoadingOutlined } from '@ant-design/icons';
import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const BillLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pdfUrl, setPdfUrl] = useState(null);


    useEffect(() => {
        dispatch({ type: "ClearExpectedDeliveryDate" });
    }, [dispatch]);
    // Clearing the expected delivery date from the store

    const [billNumber, setBillNumber] = useState('');
    const [billDate, setBillDate] = useState(moment().format('YYYY-MM-DD'));
    const [paymentTermId, setPaymentTermId] = useState('');

    const [currency, setCurrency] = useState('AED');
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [subject, setSubject] = useState(null);
    const [reference, setReference] = useState(null);

    const [vendorId, setVendorId] = useState(null);
    const [vendorName, setVendorName] = useState('');

    const [items, setItems] = useState([{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
    const [notes, setNotes] = useState(null);
    const [attachmentUrl, setAttachmentUrl] = useState(null);

    const [paymentReceivedValue, setPaymentReceivedValue] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [paymentList, setPaymentList] = useState([]);
    const [debitNoteList, setDebitNoteList] = useState([]);

    const [shippingAddress1, setShippingAddress1] = useState(null);
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingCountry, setShippingCountry] = useState(null);
    const [shippingState, setShippingState] = useState(null);
    const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);

    const { currencies } = useSelector(state => state.onboardingReducer);
    const { loading: billLoading, bill, number, extractedBill } = useSelector(state => state.billReducer);
    const { purchaseOrder } = useSelector(state => state.purchaseOrderReducer);

    const type = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[6] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const bill_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const isAdd = type === 'create';

    const searchParams = new URLSearchParams(window.location.search);
    const file = searchParams.get('file');
    const convert = searchParams.get('convert');
    const reference_id = searchParams.get('reference_id');
    const referenceName = searchParams.get('reference');
    const extracted = searchParams.get('extracted');
    const location = useLocation();

    const setPaymentOptionsNull = () => {
        setPaymentReceivedValue(null);
        setBankId(null);
        setPaymentList([]);
        setDebitNoteList([]);
    }

    useEffect(() => {
        if (type === 'edit' && !extracted) {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getBillDetails(bill_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        } else if (extracted) {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getExtractedBillDetails(bill_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getNewBillNumber());
            if (convert) {
                dispatch(getPurchaseOrderDetails(reference_id));
            }
        }

    }, [dispatch, client_id, user?.localInfo?.role, bill_id, convert, reference_id]);

    useEffect(() => {
        if (vendorId !== null && currencyId !== null) {
            if (user?.localInfo?.role) {
                return;
            }
            dispatch(readOpenDebitNotesForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
            dispatch(readOpenBillPaymentsForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
        }
    }, [dispatch, vendorId, currencyId, user?.localInfo?.role]);

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getVendorDetails(bill?.vendor?.vendor_id));
            dispatch(readOpenDebitNotesForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
            dispatch(readOpenBillPaymentsForVendor(bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id));
        }
    }, [dispatch, bill?.vendor?.vendor_id, bill?.currency_id, user?.localInfo?.role, client_id]);

    useEffect(() => {
        if (type === 'edit' && !extracted) {
            setBillNumber(bill?.bill_number);
            setBillDate(moment(bill?.bill_date).format('YYYY-MM-DD'));
            setReference(bill?.reference);
            setVendorName(bill?.vendor?.vendor_name);
            setVendorId(bill?.vendor?.vendor_id);
            setCurrencyId(bill?.currency_id);
            setPaymentTermId(bill?.payment_term_id);
            setCurrencyConversionRate(bill?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === bill?.currency_id)?.currency_abv : 'AED');
            setItems(bill?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(bill?.vendor?.shipping_address_line_1);
            setShippingAddress2(bill?.vendor?.shipping_address_line_2);
            setShippingAddress3(bill?.vendor?.shipping_address_line_3);
            setShippingCountry(bill?.vendor?.shipping_country);
            setShippingState(bill?.vendor?.shipping_state);
            setSubject(bill?.subject);
            setNotes(bill?.notes);
            if (bill?.linked_payments != [] || bill?.linked_debit_notes != [] > 0) {
                setPaymentReceivedValue(1);
                setPaymentList(bill?.linked_payments != [] > 0 ? bill?.linked_payments?.map((payment) => (payment.payment_id)) : []);
                setDebitNoteList(bill?.linked_debit_notes != [] > 0 ? bill?.linked_debit_notes?.map((debitNote) => (debitNote.dn_id)) : []);
            } else {
                setPaymentReceivedValue(null);
            }
            // setBankId(bill?.payment !== null ? bill?.payment?.bank_id : null);
            dispatch(calculateExpectedDeliveryDate(billDate, paymentTermId))
        } else if (extracted) {
            if (extractedBill?.bill_number) {
                if (extractedBill?.bill_number.startsWith("BILL")) {
                    setBillNumber(extractedBill?.bill_number);
                } else {
                    setBillNumber(`BILL-${extractedBill?.bill_number}`);
                }
            } else {
                setBillNumber(number);
            }
            setBillDate(moment(extractedBill?.bill_date).format('YYYY-MM-DD'));
            setReference(extractedBill?.reference || null);
            setVendorName(extractedBill?.vendor?.vendor_name || '');
            setVendorId(extractedBill?.vendor?.vendor_id || null);
            setCurrencyId(extractedBill?.currency_id || 1);
            setPaymentTermId(extractedBill?.payment_term_id || '');
            setCurrencyConversionRate(extractedBill?.currency_conversion_rate || 1);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === extractedBill?.currency_id)?.currency_abv : 'AED');
            setItems(extractedBill?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(extractedBill?.vendor?.shipping_address_line_1 || '');
            setShippingAddress2(extractedBill?.vendor?.shipping_address_line_2 || null);
            setShippingAddress3(extractedBill?.vendor?.shipping_address_line_3 || null);
            setShippingCountry(extractedBill?.vendor?.shipping_country || '');
            setShippingState(extractedBill?.vendor?.shipping_state || '');
            setSubject(extractedBill?.subject || null);
            setNotes(extractedBill?.notes || null);
            setPaymentReceivedValue(null);
            setBankId(null);
            setPaymentList([]);
            setDebitNoteList([]);
            dispatch(calculateExpectedDeliveryDate(billDate, paymentTermId))
        }
        if (type === 'create') {
            setBillNumber(number);
            if (convert) {
                if (referenceName == 'purchase-order') {
                    setVendorId(purchaseOrder?.vendor?.vendor_id);
                    setVendorName(purchaseOrder?.vendor?.vendor_name);
                    setCurrencyId(purchaseOrder?.currency_id);
                    setCurrencyConversionRate(purchaseOrder?.currency_conversion_rate);
                    setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === purchaseOrder?.currency_id)?.currency_abv : 'AED');
                    setItems(purchaseOrder?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
                    setReference(purchaseOrder?.po_number);
                    setSubject(purchaseOrder?.subject);
                    setPaymentTermId(purchaseOrder?.payment_term_id);
                    setShippingAddress1(purchaseOrder?.vendor?.shipping_address_line_1);
                    setShippingAddress2(purchaseOrder?.vendor?.shipping_address_line_2);
                    setShippingAddress3(purchaseOrder?.vendor?.shipping_address_line_3);
                    setShippingCountry(purchaseOrder?.vendor?.shipping_country);
                    setShippingState(purchaseOrder?.vendor?.shipping_state);
                    setNotes(purchaseOrder?.notes);
                    dispatch(calculateExpectedDeliveryDate(billDate, purchaseOrder?.payment_term_id))
                }
            }
        }
    }, [dispatch, currencies, bill, number, file, convert, referenceName, location.state, purchaseOrder]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (billLoading) {
            return;
        }
        if (billNumber == "") {
            toast.error("Bill number cannot be empty.");
            return;
        }
        if (billDate == "") {
            toast.error("Bill date cannot be empty.");
            return;
        }
        if (paymentTermId == "") {
            toast.error("Please select Payment term ID.");
            return;
        }
        if (vendorId == null) {
            toast.error("Please select vendor.");
            return;
        }
        if (!sameAsBillingAddress && shippingAddress1 === null) {
            toast.error("Please select shipping details.");
            return;
        }
        if (currencyConversionRate <= 0) {
            toast.error("Currency conversion rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.item_name === '' || item.item_name == null)) {
            toast.error("Item name cannot be empty.");
            return;
        }
        if (items.some((item) => item.unit === '' || item.unit == null)) {
            toast.error("Unit cannot be empty.");
            return;
        }
        if (items.some((item) => item.qty <= 0 || item.qty == null)) {
            toast.error("Quantity should be greater than 0.");
            return;
        }
        if (items.some((item) => item.rate <= 0 || item.rate == null)) {
            toast.error("Rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.discount < 0 || item.discount == null)) {
            toast.error("Discount should be greater than or equal to 0.");
            return;
        }
        const data = {
            vendor_id: vendorId,
            bill_number: billNumber,
            bill_date: billDate,
            payment_term_id: paymentTermId,
            subject: subject === "" ? null : subject,
            reference: reference === "" ? null : reference,
            currency_id: currencyId,
            currency_conversion_rate: currencyConversionRate,
            line_items: items,
            shipping_address_line_1: sameAsBillingAddress ? null : shippingAddress1,
            shipping_address_line_2: sameAsBillingAddress ? null : shippingAddress2,
            shipping_address_line_3: sameAsBillingAddress ? null : shippingAddress3,
            shipping_state: sameAsBillingAddress ? null : shippingState,
            shipping_country: sameAsBillingAddress ? null : shippingCountry,
            notes: notes === "" ? null : notes,
            attachment_url: attachmentUrl === "" ? null : attachmentUrl,
            payment: bankId === null ? null : {
                bank_id: bankId,
                payments_list: paymentList?.length === 0 ? [] : paymentList,
                debit_notes_list: debitNoteList?.length === 0 ? [] : debitNoteList,
            }
        }
        if (isAdd) {
            dispatch(createBill(data, navigate));
        } else if (type === 'edit' && !extracted) {
            dispatch(updateBill(bill_id, data, navigate, user?.localInfo?.role));
        } else if (extracted) {
            dispatch(convertStagingToBill(bill_id, data, user?.localInfo?.role));
        }
    }
    // PDF Logic
    const [pdfError, setPdfError] = useState(null);
    const [pdfPages, setPdfPages] = useState(null);
    const [pdfPage, setPdfPage] = useState(1);
    const [pdfScale, setPdfScale] = useState(1.5);
    const [pdfRotation, setPdfRotation] = useState(0);
    const onDocumentLoadSuccess = ({ numPages }) => {
        setPdfPages(numPages);
    }

    const onError = (error) => {
        setPdfError(error.message);
    }

    const onPageChange = (page) => {
        if (page < 1 || page > pdfPages) return;
        setPdfPage(page);
    }
    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/bill"}`)} />
                    <h1 className='layout__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Bills List'}
                    </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.localInfo?.role ? client?.company_logo_url : user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                        <h1 className='create__layout--head'>Bill</h1>
                    </div>
                    <form>
                        <BillLayoutP1
                            billNumber={billNumber} setBillNumber={setBillNumber}
                            billDate={billDate} setBillDate={setBillDate}
                            paymentTermId={paymentTermId} setPaymentTermId={setPaymentTermId}
                            vendorName={vendorName} setVendorName={setVendorName}
                            vendorId={vendorId} setVendorId={setVendorId}
                            currency={currency} setCurrency={setCurrency} currencyId={currencyId} setCurrencyId={setCurrencyId}
                            currencyConversionRate={currencyConversionRate} setCurrencyConversionRate={setCurrencyConversionRate}
                            subject={subject} setSubject={setSubject}
                            reference={reference} setReference={setReference}
                            shippingAddress1={shippingAddress1} setShippingAddress1={setShippingAddress1}
                            shippingAddress2={shippingAddress2} setShippingAddress2={setShippingAddress2}
                            shippingAddress3={shippingAddress3} setShippingAddress3={setShippingAddress3}
                            shippingCountry={shippingCountry} setShippingCountry={setShippingCountry}
                            shippingState={shippingState} setShippingState={setShippingState}
                            extracted={extracted}
                            sameAsBillingAddress={sameAsBillingAddress} setSameAsBillingAddress={setSameAsBillingAddress}
                        />
                        
                        <BillLayoutP2
                            currency={currency} currencies={currencies} items={items} setItems={setItems}
                            notes={notes} setNotes={setNotes}
                            bankId={bankId} setBankId={setBankId}
                            paymentList={paymentList} setPaymentList={setPaymentList}
                            debitNoteList={debitNoteList} setDebitNoteList={setDebitNoteList}
                            vendorId={vendorId}
                            paymentReceivedValue={paymentReceivedValue} setPaymentReceivedValue={setPaymentReceivedValue}
                            setPaymentOptionsNull={setPaymentOptionsNull}
                        />
                        <div className='layout__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    billLoading ? <LoadingOutlined /> : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                    <div className="layout__footer">
                        <img style={{ width: "5rem" }} src={logo} alt="logo" />
                        <div className='layout__footer--text'>
                            <p style={{ fontWeight: "400", fontSize: "0.8rem" }}> This is electronically generated document and does not require sign or stamp. </p>
                            <span style={{ marginTop: "0.2rem", fontWeight: "600", fontSize: "0.8rem" }}> powered by Finaccru </span>
                        </div>
                    </div>
                </div>
            </div>
            {
                extracted &&
                <div className='pdf__viewer-main'>
                    <div className="pdf__viewer">
                        <Document file={extractedBill?.attachment_url.replace(extractedBill?.attachment_url.split('/').slice(0, 3).join("/"), '')} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onError} loading={<LoadingOutlined />}>
                            <Page pageNumber={pdfPage} scale={pdfScale} rotate={pdfRotation} renderAnnotationLayer={false} renderTextLayer={false} />
                        </Document>
                        {pdfError && <div className='pdf__viewer--error'>{pdfError}</div>}
                        {pdfError && <a href={extractedBill?.attachment_url} target='_blank' rel='noreferrer' className='pdf__viewer--error'>Download</a>}
                    </div>
                    {pdfPages && <div className='pdf__viewer--controls'>
                        <button onClick={() => onPageChange(pdfPage - 1)} disabled={pdfPage === 1}>Previous</button>
                        <span>{pdfPage} of {pdfPages}</span>
                        <button onClick={() => onPageChange(pdfPage + 1)} disabled={pdfPage === pdfPages}>Next</button>
                    </div>}
                </div>
            }
        </>
    )
}

export default BillLayout;
