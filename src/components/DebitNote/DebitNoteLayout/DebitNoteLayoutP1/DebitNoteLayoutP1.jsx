import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { calculateExpectedDeliveryDate, getVendorDetails, getVendorInfiniteScroll } from '../../../../Actions/Vendor';
import { getVendorShippingAddressList } from '../../../../Actions/Vendor';

import VendorInfiniteScrollSelect from '../../../Vendor/VendorInfiniteScrollSelect/VendorInfiniteScrollSelect';
import AddVendorModal from '../../../Vendor/AddVendorModal/AddVendorModal';
import AddVendorShippingAddress from '../../../Vendor/AddVendorShippingAddress/AddVendorShippingAddress';

import "../../../../Styles/Layout/LayoutP1.css";
import "../../../../Styles/PurchaseLayoutSelectP1.css";
import { CloseOutlined } from '@ant-design/icons';
import { Select, Input } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import moment from 'moment/moment';

const DebitNoteLayoutP1 = ({
    debitNoteNumber, setDebitNoteNumber,
    debitNoteDate, setDebitNoteDate, paymentTermId, setPaymentTermId,
    vendorName, setVendorName, vendorId, setVendorId,
    currency, setCurrency, currencyId, setCurrencyId,
    currencyConversionRate, setCurrencyConversionRate,
    subject, setSubject,
    shippingAddress1, setShippingAddress1, shippingAddress2, setShippingAddress2, shippingAddress3, setShippingAddress3,
    shippingState, setShippingState, shippingCountry, setShippingCountry, sameAsBillingAddress, setSameAsBillingAddress
}) => {
    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }
    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading: vendorLoading, vendorsInf, totalVendors, vendor, paymentTerms, paymentTermsLoading, expectedDeliveryDate } = useSelector(state => state.vendorReducer);

    const [currentVendorPage, setCurrentVendorPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingId, setShippingId] = useState(null);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [shippingLabel, setShippingLabel] = useState(null);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getVendorInfiniteScroll(1, true));
        setCurrentVendorPage(1);
    }, [dispatch]);

    const showModal = () => {
        setIsModalOpen(true);
        vendorId('addVendor');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showShippingModal = () => {
        setIsShippingModalOpen(true);
    };
    const handleShippingCancel = () => {
        setIsShippingModalOpen(false);
    };

    const handlePaymentTermChange = (value) => {
        setPaymentTermId(value);
        dispatch(calculateExpectedDeliveryDate(debitNoteDate, value));
    }

    useEffect(() => {
        if (paymentTermId === null) return;
        dispatch(calculateExpectedDeliveryDate(debitNoteDate, paymentTermId));
    }, [dispatch, debitNoteDate]);

    const { shippingAddresses } = useSelector(state => state.vendorReducer);
    const { debitNote } = useSelector(state => state.debitNoteReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);
    const [vendorKeyword, setVendorKeyword] = useState(null);

    useEffect(() => {
        if (vendorKeyword === null) return;
        dispatch(getVendorInfiniteScroll(1, true, vendorKeyword));
        setCurrentVendorPage(1);
    }, [vendorKeyword, dispatch]);

    const onChangeVendor = (value) => {
        if (value.vendor_id === 'addVendor') {
            showModal();
            return;
        }
        setVendorId(value.vendor_id);
        const vendorSelected = vendorsInf.find((vendor) => {
            return vendor.vendor_id === value.vendor_id;
        });
        setVendorName(vendorSelected.vendor_name);
        dispatch(getVendorDetails(value.vendor_id));
        dispatch(getVendorShippingAddressList(value.vendor_id));
    }

    const onChangeShipping = (value) => {
        if (value === 'addShippingAddress') {
            showShippingModal();
            return;
        }
        setShippingId(value);
        setShippingAddress1(shippingAddresses?.find((address) => address.shipping_address_id === value)?.address_line_1);
        setShippingAddress2(shippingAddresses?.find((address) => address.shipping_address_id === value)?.address_line_2);
        setShippingAddress3(shippingAddresses?.find((address) => address.shipping_address_id === value)?.address_line_3);
        setShippingState(shippingAddresses?.find((address) => address.shipping_address_id === value)?.state);
        setShippingCountry(shippingAddresses?.find((address) => address.shipping_address_id === value)?.country);
        setShippingLabel(shippingAddresses?.find((address) => address.shipping_address_id === value)?.label);
    }

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
    }

    const handleVendorSubmit = (data) => {
        setIsModalOpen(false);
        dispatch(getVendorInfiniteScroll(1, true));
        setCurrentVendorPage(1);
        dispatch(getVendorDetails(data.vendor_id));
        setVendorId(data.vendor_id);
        setVendorName(data.vendor_name);
        dispatch(getVendorShippingAddressList(data.vendorId));
    }

    const handleAddVendorShippingAddressSubmit = (data) => {
        dispatch(getVendorShippingAddressList(vendorId));
        setShippingLabel(data.label);
        setShippingId(data.shipping_address_id);
        setShippingAddress1(data.address_line_1);
        setShippingAddress2(data.address_line_2);
        setShippingAddress3(data.address_line_3);
        setShippingState(data.state);
        setShippingCountry(data.country);
        setIsShippingModalOpen(false);
    }

    const addPage = (current) => {
        if (vendorLoading) return;
        if ((current - 1) * 20 > totalVendors) return;
        if (currentVendorPage >= current) return;
        dispatch(getVendorInfiniteScroll(current, false));
        setCurrentVendorPage((prev) => prev + 1);
    }

    return (
        <div className='layout__form--part1'>
            <div className='layout__form--part1-head'>
                <div className='layout__form--head-info1'>
                    {/* <h3>Debit Note From</h3> */}
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
                <div className='layout__form--head-info2'>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Debit Note Number</span>
                        <input
                            className='purchase__terms'
                            name="debitNoteNumber"
                            type="text"
                            value={debitNoteNumber}
                            onChange={(e) => {
                                const input = e.target.value
                                setDebitNoteNumber("DN-" + input.substr("DN-".length))
                            }}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Debit Note Date</span>
                        <input
                            className='purchase__terms'
                            type="date"
                            name='debitNoteDate'
                            value={debitNoteDate}
                            min="2023-01-01"
                            onChange={(e) => {
                                setDebitNoteDate(e.target.value)
                                dispatch(calculateExpectedDeliveryDate(debitNoteDate, paymentTermId));
                            }}
                        />
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Payment Term</span>
                        <select
                            loading={paymentTermsLoading}
                            value={paymentTermId}
                            onChange={(e) => handlePaymentTermChange(e.target.value)}
                        >
                            <option disabled={true} value="">Select Payment Term</option>
                            {
                                paymentTerms?.map((term) => (
                                    <option key={term.term_id} value={term.term_id}>{term.description}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='layout__form--head-info2-data'>
                        <span className='required__field'>Expected Date</span>
                        <input
                            className='purchase__terms'
                            type="select"
                            name='expectedDate'
                            value={moment(expectedDeliveryDate).format('DD / MM / YYYY')}
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className='layout__form--part2-head'>
                <div className='layout__form--part2-head-customer'>
                    <h3 className='required__field'>Billing Address</h3>
                    {
                        vendorName ?
                            <div className='layout__form--customer-data'>
                                <div className='layout__form--customer-data-info'>
                                    <span style={{ fontWeight: 500 }}>{vendorName}</span>
                                    {user?.localInfo?.role ?
                                        <>
                                            <span>{debitNote?.vendor?.billing_address_line_1}</span>
                                            {debitNote?.vendor?.billing_address_line_2 && <span>{debitNote?.vendor?.billing_address_line_2}</span>}
                                            {debitNote?.vendor?.billing_address_line_3 && <span>{debitNote?.vendor?.billing_address_line_3}</span>}
                                            {debitNote?.vendor?.billing_state && <span>{debitNote?.vendor?.billing_state + ', ' + debitNote?.vendor?.billing_country}</span>}
                                            {debitNote?.vendor?.trn && <span>VAT TRN: {debitNote?.vendor?.trn}</span>}
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
                                {!user?.localInfo?.role && <CloseOutlined className='layout__for--anticon-close'
                                    onClick={() => {
                                        setVendorName(''); setVendorId(null); setShippingId(null);
                                        setShippingAddress1(null);
                                        setShippingAddress2(null);
                                        setShippingAddress3(null);
                                        setShippingState(null);
                                        setShippingCountry(null);
                                        setShippingLabel(null);
                                        setSameAsBillingAddress(false);
                                        setVendorKeyword("");
                                    }}
                                />}
                            </div>
                            : <VendorInfiniteScrollSelect loadMoreOptions={addPage} onChange={onChangeVendor} vendorKeyword={vendorKeyword} setVendorKeyword={setVendorKeyword} scrollFor="createPO" />

                    }
                    <AddVendorModal isModalOpen={isModalOpen} handleVendorSubmit={handleVendorSubmit} handleCancel={handleCancel} />
                </div>
                <div className='layout__form--part2-head-customer second-select'>
                    {
                        vendorId ?
                            <>
                                <h3 className='required__field'>Shipping Address</h3>
                                {
                                    shippingAddress1 === null ?
                                        <div style={{ marginTop: "1rem" }} className='layout--details__modal--checkbox'>
                                            <input type="checkbox"
                                                value={sameAsBillingAddress}
                                                checked={sameAsBillingAddress}
                                                onChange={(e) => setSameAsBillingAddress(e.target.checked)}
                                            />
                                            <span
                                                style={{
                                                    opacity: sameAsBillingAddress ? '1' : '0.5'
                                                }}
                                            >
                                                Use Same as Billing Address</span>
                                        </div> : ""
                                }
                                {
                                    shippingId || shippingAddress1 ?
                                        <div className='layout__form--customer-data'>
                                            <div className='layout__form--customer-data-info'>
                                                {shippingLabel && <span style={{ fontWeight: 500 }}>{shippingLabel}</span>}
                                                <span>{shippingAddress1}</span>
                                                {shippingAddress2 && <span>{shippingAddress2}</span>}
                                                {shippingAddress3 && <span>{shippingAddress3}</span>}
                                                <span>{shippingState + ', ' + shippingCountry}</span>

                                            </div>
                                            {!user?.localInfo?.role && <CloseOutlined className='layout__for--anticon-close'
                                                onClick={() => {
                                                    setShippingId(null); setShippingAddress1(null);
                                                    setShippingAddress2(null); setShippingAddress3(null);
                                                    setShippingState(null); setShippingCountry(null);
                                                    setShippingLabel(null);
                                                    setSameAsBillingAddress(false);
                                                    dispatch(getVendorShippingAddressList(vendorId))
                                                }}
                                            />}
                                        </div>
                                        : <Select
                                            // showSearch
                                            disabled={sameAsBillingAddress}
                                            placeholder='Select Shipping Address'
                                            optionFilterProp='children'
                                            value={shippingId}
                                            onChange={onChangeShipping}
                                        >
                                            <Option style={{ fontWeight: 600 }} key="addShippingAddress" value="addShippingAddress">
                                                Add Shipping Address
                                            </Option>
                                            {
                                                shippingAddresses?.map((address) => (
                                                    <Option key={address.shipping_address_id} value={address.shipping_address_id}>
                                                        <div style={{ whiteSpace: 'initial' }}>
                                                            {address.label ? address.label + ": " : ""} {address.address_line_1}, {address.address_line_2 ? address.address_line_2 + ", " : ""} {address.address_line_3 ? address.address_line_3 + ", " : ""} {address.state}, {address.country}
                                                        </div>
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                }
                                <AddVendorShippingAddress isShippingModalOpen={isShippingModalOpen} handleAddVendorShippingAddressSubmit={handleAddVendorShippingAddressSubmit} handleShippingCancel={handleShippingCancel} vendorId={vendorId} />
                            </> : <></>

                    }
                </div>
            </div>
            <div className='layout__form--part3-head'>
                <h3 className='required__field'>Select Currency</h3>
                <div className='layout__form--currency'>
                    <div className='layout__form--select-currency'>
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
                    <div className='layout__form--currency-conversion'>
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
            <div className='layout__form--part4-head'>
                <h3>Subject</h3>
                <TextArea
                    placeholder="Subject"
                    rows={1}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
        </div>
    )
}

export default DebitNoteLayoutP1;
