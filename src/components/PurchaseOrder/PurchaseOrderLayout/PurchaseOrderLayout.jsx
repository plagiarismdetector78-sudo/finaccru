import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import moment from 'moment';
import { getCurrency } from '../../../Actions/Onboarding';
import { createPurchaseOrder, getNewPurchaseOrderNumber, getPurchaseOrderDetails, updatePurchaseOrder } from '../../../Actions/PurchaseOrder';

import PurchaseOrderLayoutP1 from './PurchaseOrderLayoutP1/PurchaseOrderLayoutP1';
import PurchaseOrderLayoutP2 from './PurchaseOrderLayoutP2/PurchaseOrderLayoutP2';

import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";
import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";
import { getVendorDetails, calculateExpectedDeliveryDate, readPaymentTerms } from '../../../Actions/Vendor';

const PurchaseOrderLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: "ClearExpectedDeliveryDate" });
    }, [dispatch]); // Clearing the expected delivery date from the store

    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
    const [orderDate, setOrderDate] = useState(moment().format('YYYY-MM-DD'));
    const [paymentTermId, setPaymentTermId] = useState('');

    const [currency, setCurrency] = useState('AED');
    const [currencyId, setCurrencyId] = useState(1);
    const [currencyConversionRate, setCurrencyConversionRate] = useState(1);
    const [subject, setSubject] = useState(null);

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

    const isAdd = window.location.pathname.split('/')[2] === 'create';

    const { user } = useSelector(state => state.userReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);
    const { loading: purchaseOrderLoading, purchaseOrder, number } = useSelector(state => state.purchaseOrderReducer);

    useEffect(() => {

        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getPurchaseOrderDetails(window.location.pathname.split('/')[3]));
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            dispatch(getCurrency());
            dispatch(readPaymentTerms());
            dispatch(getNewPurchaseOrderNumber());
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getVendorDetails(purchaseOrder?.vendor?.vendor_id));
        }
    }, [dispatch, purchaseOrder?.vendor?.vendor_id]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            setPurchaseOrderNumber(purchaseOrder?.po_number);
            setOrderDate(moment(purchaseOrder?.po_date).format('YYYY-MM-DD'));
            setVendorName(purchaseOrder?.vendor?.vendor_name);
            setVendorId(purchaseOrder?.vendor?.vendor_id);
            setCurrencyId(purchaseOrder?.currency_id);
            setPaymentTermId(purchaseOrder?.payment_term_id);
            setCurrencyConversionRate(purchaseOrder?.currency_conversion_rate);
            setCurrency(currencyId !== 1 ? currencies?.find((currency) => currency.currency_id === purchaseOrder?.currency_id)?.currency_abv : 'AED');
            setItems(purchaseOrder?.line_items || [{ item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
            setShippingAddress1(purchaseOrder?.vendor?.shipping_address_line_1);
            setShippingAddress2(purchaseOrder?.vendor?.shipping_address_line_2);
            setShippingAddress3(purchaseOrder?.vendor?.shipping_address_line_3);
            setShippingCountry(purchaseOrder?.vendor?.shipping_country);
            setShippingState(purchaseOrder?.vendor?.shipping_state);
            setSubject(purchaseOrder?.subject);
            setNotes(purchaseOrder?.notes);
            dispatch(calculateExpectedDeliveryDate(orderDate, paymentTermId))
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            setPurchaseOrderNumber(number);
        }
    }, [dispatch, currencies, purchaseOrder, number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (purchaseOrderLoading) {
            return;
        }
        if (purchaseOrderNumber == "" || vendorId == null || paymentTermId == '') {
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
            po_number: purchaseOrderNumber,
            order_date: orderDate,
            payment_term_id: paymentTermId,
            subject: subject === "" ? null : subject,
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
            dispatch(createPurchaseOrder(data, navigate));
        }
        else {
            dispatch(updatePurchaseOrder(window.location.pathname.split('/')[3], data, navigate));
        }
    }

    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate("/purchase-order")} />
                    <h1 className='layout__header--title'> Purchase Orders List </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                        <h1 className='create__layout--head'>Purchase Order</h1>
                    </div>
                    <form>
                        <PurchaseOrderLayoutP1
                            purchaseOrderNumber={purchaseOrderNumber} setPurchaseOrderNumber={setPurchaseOrderNumber}
                            orderDate={orderDate} setOrderDate={setOrderDate}
                            paymentTermId={paymentTermId} setPaymentTermId={setPaymentTermId}
                            vendorName={vendorName} setVendorName={setVendorName}
                            vendorId={vendorId} setVendorId={setVendorId}
                            currency={currency} setCurrency={setCurrency} currencyId={currencyId} setCurrencyId={setCurrencyId}
                            currencyConversionRate={currencyConversionRate} setCurrencyConversionRate={setCurrencyConversionRate}
                            subject={subject} setSubject={setSubject}
                            shippingAddress1={shippingAddress1} setShippingAddress1={setShippingAddress1}
                            shippingAddress2={shippingAddress2} setShippingAddress2={setShippingAddress2}
                            shippingAddress3={shippingAddress3} setShippingAddress3={setShippingAddress3}
                            shippingCountry={shippingCountry} setShippingCountry={setShippingCountry}
                            shippingState={shippingState} setShippingState={setShippingState}
                            sameAsBillingAddress={sameAsBillingAddress} setSameAsBillingAddress={setSameAsBillingAddress}
                        />
                        <PurchaseOrderLayoutP2
                            currency={currency}
                            items={items} setItems={setItems}
                            notes={notes} setNotes={setNotes}
                        />
                        <div className='layout__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}>
                                {/* {
                                    purchaseOrderLoading ? <LoadingOutlined /> : "Submit"
                                } */}
                                Submit
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

export default PurchaseOrderLayout;
