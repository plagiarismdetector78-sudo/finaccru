import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import moment from 'moment';
import { getCurrency } from '../../../Actions/Onboarding';
import { readAccountantClient } from '../../../Actions/Accountant';
import { getVendorDetails, calculateExpectedDeliveryDate, readPaymentTerms } from '../../../Actions/Vendor';
import { createDebitNote, getDebitNoteDetails, getNewDebitNoteNumber, updateDebitNote } from '../../../Actions/DebitNote';

import DebitNoteLayoutP1 from './DebitNoteLayoutP1/DebitNoteLayoutP1';
import DebitNoteLayoutP2 from './DebitNoteLayoutP2/DebitNoteLayoutP2';

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import { LoadingOutlined } from "@ant-design/icons";
import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";

const DebitNoteLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: "ClearExpectedDeliveryDate" });
    }, [dispatch]); // Clearing the expected delivery date from the store

    const [debitNoteNumber, setDebitNoteNumber] = useState('');
    const [debitNoteDate, setDebitNoteDate] = useState(moment().format('YYYY-MM-DD'));
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

    const [shippingAddress1, setShippingAddress1] = useState(null);
    const [shippingAddress2, setShippingAddress2] = useState(null);
    const [shippingAddress3, setShippingAddress3] = useState(null);
    const [shippingCountry, setShippingCountry] = useState(null);
    const [shippingState, setShippingState] = useState(null);
    const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);
    const { loading: debitNoteLoading, debitNote, number } = useSelector(state => state.debitNoteReducer);

    const type = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[6] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[4] : window.location.pathname.split('/')[2];
    const dn_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const isAdd = type === 'create';

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getDebitNoteDetails(dn_id, user?.localInfo?.role));
            if (user?.localInfo?.role) {
                dispatch(readAccountantClient(client_id));
            }
        }
        if (type === 'create') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getNewDebitNoteNumber());
            setDebitNoteNumber(number);
        }
    }, [dispatch]);

    useEffect(() => {
        if (type === 'edit') {
            dispatch(getVendorDetails(debitNote?.vendor?.vendor_id));
        }
    }, [dispatch, debitNote?.vendor?.vendor_id]);

    useEffect(() => {
        if (type === 'edit') {
            setDebitNoteNumber(debitNote?.dn_number);
            setDebitNoteDate(moment(debitNote?.dn_date).format('YYYY-MM-DD'));
            setReference(debitNote?.reference);
            setVendorName(debitNote?.vendor?.vendor_name);
            setVendorId(debitNote?.vendor?.vendor_id);
            setCurrencyId(debitNote?.currency_id);
            setPaymentTermId(debitNote?.payment_term_id);
            setCurrencyConversionRate(debitNote?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === debitNote?.currency_id)?.currency_abv : 'AED');
            setItems(debitNote?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(debitNote?.vendor?.shipping_address_line_1);
            setShippingAddress2(debitNote?.vendor?.shipping_address_line_2);
            setShippingAddress3(debitNote?.vendor?.shipping_address_line_3);
            setShippingCountry(debitNote?.vendor?.shipping_country);
            setShippingState(debitNote?.vendor?.shipping_state);
            setSubject(debitNote?.subject);
            setNotes(debitNote?.notes);
            dispatch(calculateExpectedDeliveryDate(debitNoteDate, paymentTermId))
        }
    }, [dispatch, currencies, debitNote, number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (debitNoteLoading) {
            return;
        }
        if (debitNoteNumber == "" || vendorId == null || paymentTermId == '') {
            toast.error("Please fill and check all fields.");
            return;
        }
        if (currencyConversionRate <= 0) {
            toast.error("Currency conversion rate should be greater than 0.");
            return;
        }
        if (!sameAsBillingAddress && shippingAddress1 === null) {
            toast.error("Please select shipping details.");
            return;
        }
        if (items.some((item) => item.item_name === '')) {
            toast.error("Item name cannot be empty.");
            return;
        }
        if (items.some((item) => item.unit === '')) {
            toast.error("Unit cannot be empty.");
            return;
        }
        if (items.some((item) => item.qty <= 0)) {
            toast.error("Quantity should be greater than 0.");
            return;
        }
        if (items.some((item) => item.rate <= 0)) {
            toast.error("Rate should be greater than 0.");
            return;
        }
        if (items.some((item) => item.discount < 0)) {
            toast.error("Discount should be greater than or equal to 0.");
            return;
        }
        const data = {
            vendor_id: vendorId,
            dn_number: debitNoteNumber,
            dn_date: debitNoteDate,
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
        }
        if (isAdd) {
            dispatch(createDebitNote(data, navigate));
        }
        else {
            dispatch(updateDebitNote(dn_id, data, navigate, user?.localInfo?.role));
        }
    }

    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/debit-note"}`)} />
                    <h1 className='layout__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Debit Notes List'}
                    </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.localInfo?.role ? client?.company_logo_url : user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                        <h1 className='create__layout--head'>Debit Note</h1>
                    </div>
                    <form>
                        <DebitNoteLayoutP1
                            debitNoteNumber={debitNoteNumber} setDebitNoteNumber={setDebitNoteNumber}
                            debitNoteDate={debitNoteDate} setDebitNoteDate={setDebitNoteDate}
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
                            sameAsBillingAddress={sameAsBillingAddress} setSameAsBillingAddress={setSameAsBillingAddress}
                        />
                        <DebitNoteLayoutP2
                            currency={currency} currencies={currencies} items={items} setItems={setItems}
                            notes={notes} setNotes={setNotes}
                            vendorId={vendorId}
                        />
                        <div className='layout__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {
                                    debitNoteLoading ? <LoadingOutlined /> : "Submit"
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
        </>
    )
}

export default DebitNoteLayout;
