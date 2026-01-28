import { useState } from 'react'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCountries, getStates } from 'country-state-picker';
import { createInPurchaseDocument } from '../../../Actions/Vendor';
import uaeStates from '../../../data/uaeStates';

import './AddVendorModal.css'
import { Modal, Select, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { Option } = Select;

const AddVendorModal = ({ isModalOpen, handleCancel, handleVendorSubmit }) => {
    const dispatch = useDispatch();
    const { client_id } = useParams(); //  client_id from the URL
    const userRole = useSelector(state => state.userReducer.role); // user role from Redux state
    // console.log(userRole);

    const [vendorName, setVendorName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isPhoneError, setIsPhoneError] = useState(false);
    const [countryPhoneCode, setCountryPhoneCode] = useState("+971");
    const [displayName, setDisplayName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [sameBillingAddress, setSameBillingAddress] = useState(false);
    const [billingAddress1, setBillingAddress1] = useState("");
    const [billingAddress2, setBillingAddress2] = useState("");
    const [billingAddress3, setBillingAddress3] = useState("");
    const [contactName, setContactName] = useState("");
    const [trnNumber, setTrnNumber] = useState("");
    const [country, setCountry] = useState("United Arab Emirates");
    const [selectedCountry, setSelectedCountry] = useState("ae");
    const [billingCountry, setBillingCountry] = useState("United Arab Emirates");
    const [selectedBillingCountry, setSelectedBillingCountry] = useState("ae");
    const { loading } = useSelector((state) => state.vendorReducer)
    const [state, setState] = useState(null);
    const [allState, setAllStates] = useState(uaeStates);
    const [billingState, setBillingState] = useState(null);
    const [allBillingState, setAllBillingStates] = useState(uaeStates);
    const [openingBalance, setOpeningBalance] = useState(null);
    const [openingBalanceDate, setOpeningBalanceDate] = useState("");

    const handleCountryPhoneCodeChange = (value) => {
        const countryPhoneCode = value;
        setCountryPhoneCode(countryPhoneCode);
    }

    const selectBefore = (
        <Select onChange={handleCountryPhoneCodeChange} defaultValue={countryPhoneCode}>
            {getCountries().map((country) => (
                <Option key={country.code} value={country.dial_code}>
                    {country.dial_code}
                </Option>
            ))}
        </Select>
    );

    const handleShippingCountryChange = (value) => {
        const countryCode = value;
        setSelectedCountry(countryCode);
        const selectedCountry = getCountries().find(country => country.code === countryCode);
        setCountry(selectedCountry ? selectedCountry.name : '');
        if (countryCode === 'ae') {
            setAllStates(uaeStates);
            setState(null);
        } else if (countryCode) {
            const countryStates = getStates(countryCode);
            setAllStates(countryStates);
            setState(null);
        } else {
            setAllStates([]);
        }
    };

    const handleBillingCountryChange = (value) => {
        const countryCode = value;
        setSelectedBillingCountry(countryCode);
        const selectedBillingCountry = getCountries().find(country => country.code === countryCode);
        setBillingCountry(selectedBillingCountry ? selectedBillingCountry.name : '');
        if (countryCode === 'ae') {
            setAllBillingStates(uaeStates);
            setBillingState(null);
        } else if (countryCode) {
            const countryStates = getStates(countryCode);
            setAllBillingStates(countryStates);
            setBillingState(null);
        } else {
            setAllBillingStates([]);
        }
    };

    const handleUseBillingAddress = () => {
        if (!sameBillingAddress) {
            setSameBillingAddress(true);
            setAddress1(billingAddress1); 
            setAddress2(billingAddress2);
            setAddress3(billingAddress3);
            setSelectedCountry(selectedBillingCountry);
            setCountry(billingCountry);
            setState(billingState);
        } else {
            setSameBillingAddress(false);
        }
    }

    const handleVendorName = (e) => {
        setVendorName(e.target.value);
        if (displayName === "" || displayName === vendorName) {
            setDisplayName(e.target.value);
        }
    }
    
    const handleJrSubmit = () => {
        if (phone !== "") {
            if (isPhoneError) {
                toast.error("Please Enter Valid Phone Number.");
                return;
            }
            if ((countryPhoneCode + phone).length > 13) {
                toast.error("Phone Number can have atmost 13 digits including country code.");
                return;
            }
        }
        if (vendorName === "" || displayName === "" || address1 === "" || billingAddress1 === "" || billingCountry == "" || billingState == "" || country === "" || state === "" ||contactName === "") {
            toast.error("Please fill all the fields");
            return;
        }
        const vendor = {
            client_id:client_id,
            vendor_name: vendorName,
            contact_name: contactName === "" ? null : contactName,
            display_name: displayName,
            email: email === "" ? null : email,
            mobile_number: phone === "" ? null : countryPhoneCode + phone,
            billing_address_line_1: billingAddress1,
            billing_address_line_2: billingAddress2 === "" ? null : billingAddress2,
            billing_address_line_3: billingAddress3 === "" ? null : billingAddress3,
            billing_state: billingState,
            billing_country: billingCountry,
            shipping_label: null,
            shipping_address_line_1: address1,
            shipping_address_line_2: address2 === "" ? null : address2,
            shipping_address_line_3: address3 === "" ? null : address3,
            shipping_state: state,
            shipping_country: country,
            trn: trnNumber === "" ? null : trnNumber,
            opening_balance: openingBalance === "" ? null : openingBalance,
            opening_balance_date: openingBalanceDate === "" ? null : openingBalanceDate,
            
        }
        dispatch(createInPurchaseDocument(vendor, handleVendorSubmit));
        // resetting the fields after dispatch
        setVendorName("");
        setEmail("");
        setPhone("");
        setDisplayName("");
        setAddress1("");
        setAddress2("");
        setAddress3("");
        setBillingAddress1("");
        setBillingAddress2("");
        setBillingAddress3("");
        setSameBillingAddress(false);
        setContactName("");
        setTrnNumber("");
        setCountry("United Arab Emirates");
        setSelectedCountry("ae");
        setBillingCountry("United Arab Emirates");
        setSelectedBillingCountry("ae");
        setState(null);
        setAllStates(uaeStates);
        setBillingState(null);
        setAllBillingStates(uaeStates);
        setOpeningBalance(null);
        setOpeningBalanceDate("");
    }

    const handleSubmit = () => {
        if (phone !== "") {
            if (isPhoneError) {
                toast.error("Please Enter Valid Phone Number.");
                return;
            }
            if ((countryPhoneCode + phone).length > 13) {
                toast.error("Phone Number can have atmost 13 digits including country code.");
                return;
            }
        }
        if (vendorName === "" || displayName === "" || address1 === "" || billingAddress1 === "" || billingCountry == "" || billingState == "" || country === "" || state === "" || contactName === "") {
            toast.error("Please fill all the fields");
            return;
        }
        const vendor = {
            vendor_name: vendorName,
            contact_name: contactName === "" ? null : contactName,
            display_name: displayName,
            email: email === "" ? null : email,
            mobile_number: phone === "" ? null : countryPhoneCode + phone,
            billing_address_line_1: billingAddress1,
            billing_address_line_2: billingAddress2 === "" ? null : billingAddress2,
            billing_address_line_3: billingAddress3 === "" ? null : billingAddress3,
            billing_state: billingState,
            billing_country: billingCountry,
            shipping_address_line_1: address1,
            shipping_address_line_2: address2 === "" ? null : address2,
            shipping_address_line_3: address3 === "" ? null : address3,
            shipping_state: state,
            shipping_country: country,
            trn: trnNumber === "" ? null : trnNumber,
            opening_balance: openingBalance === "" ? null : openingBalance,
            opening_balance_date: openingBalanceDate === "" ? null : openingBalanceDate,
        }
        dispatch(createInPurchaseDocument(vendor, handleVendorSubmit));
        setVendorName("");
        setEmail("");
        setPhone("");
        setDisplayName("");
        setAddress1("");
        setAddress2("");
        setAddress3("");
        setBillingAddress1("");
        setBillingAddress2("");
        setBillingAddress3("");
        setSameBillingAddress(false);
        setContactName("");
        setTrnNumber("");
        setCountry("United Arab Emirates");
        setSelectedCountry("ae");
        setBillingCountry("United Arab Emirates");
        setSelectedBillingCountry("ae");
        setState(null);
        setAllStates(uaeStates);
        setBillingState(null);
        setAllBillingStates(uaeStates);
        setOpeningBalance(null);
        setOpeningBalanceDate("");
    }
    const handleFinalSubmit = () => {
        if (userRole === 1) {
            handleJrSubmit();
        } else {
            handleSubmit();
        }
    }

    const handleCancelWithReset = () => {
        setVendorName("");
        setEmail("");
        setPhone("");
        setDisplayName("");
        setAddress1("");
        setAddress2("");
        setAddress3("");
        setBillingAddress1("");
        setBillingAddress2("");
        setBillingAddress3("");
        setSameBillingAddress(false);
        setContactName("");
        setTrnNumber("");
        setCountry("United Arab Emirates");
        setSelectedCountry("ae");
        setBillingCountry("United Arab Emirates");
        setSelectedBillingCountry("ae");
        setState(null);
        setAllStates(uaeStates);
        setBillingState(null);
        setAllBillingStates(uaeStates);
        setOpeningBalance(null);
        setOpeningBalanceDate("");
        handleCancel();
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancelWithReset}
            footer={null}
            width={900}
            style={{ top: 15 }}
        >
            <span className='add__vendor__modal--header'>Add New Vendor</span>
            <form className='add__vendor__modal--form'>
                <div className='add__vendor__modal--left'>
                    <div className='add__vendor__modal--input'>
                        <span className='required__field'>Vendor Name</span>
                        <input type="text" name='vendorName' value={vendorName} onChange={handleVendorName} />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Email</span>
                        <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Phone</span>
                        <Input type='text' name='phone' addonBefore={selectBefore} value={phone}
                            onChange={(e) => {
                                const valid = e.target.value.match(/^\d{9,10}$/);
                                setPhone(e.target.value);
                                if (valid) {
                                    setIsPhoneError(false);
                                } else {
                                    setIsPhoneError(true);
                                }
                            }}
                        />
                        {/* <span className="phone__error--span">{isPhoneError ? "Wrong Phone Number" : ""}</span> */}
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span className='required__field'>Display Name</span>
                        <input type="text" name='displayName' value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span className='required__field'>Billing Address 1</span>
                        <input type="text" name='billingAddress1' value={billingAddress1}
                            onChange={(e) => setBillingAddress1(e.target.value)}
                            maxLength="45"
                        />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Billing Address 2</span>
                        <input type="text" name='billingAddress2' value={billingAddress2}
                            onChange={(e) => setBillingAddress2(e.target.value)}
                            maxLength="45"
                        />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Billing Address 3</span>
                        <input type="text" name='billingAddress3' value={billingAddress3}
                            onChange={(e) => setBillingAddress3(e.target.value)}
                            maxLength="45"
                        />
                    </div>
                    <div className='add__vendor__modal--select'>
                        <span className='required__field'>Billing Country</span>
                        <Select
                            showSearch
                            id='country'
                            defaultValue="ae"
                            value={selectedBillingCountry}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                            onChange={handleBillingCountryChange}
                        />
                    </div>
                    <div className='add__vendor__modal--select'>
                        {selectedBillingCountry && (
                            <>
                                <span className='required__field'>{selectedBillingCountry == "ae" ? "Emirates" : "State"}</span>
                                <Select
                                    showSearch
                                    id='state'
                                    placeholder="Select State"
                                    value={billingState}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={allBillingState.map((state) => ({ value: state, label: state }))}
                                    onChange={(value) => setBillingState(value)}
                                />
                            </>
                        )}
                    </div>
                    <div className='add__vendor__modal--btns'>
                        <a className='add__vendor__modal--cancel-btn' onClick={handleCancelWithReset}>Cancel</a>
                        <a className='add__vendor__modal--submit-btn' onClick={handleFinalSubmit}> {
                            loading ? <LoadingOutlined /> : "Submit"
                        } </a>
                    </div>
                </div>
                <div className='add__vendor__modal--right'>
                    <div className='add__vendor__modal--checkbox'>
                        <input type="checkbox" value={sameBillingAddress}
                            checked={sameBillingAddress}
                            onChange={handleUseBillingAddress}
                        />
                        <span>Use Billing Address</span>
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span className='required__field'>Shipping Address 1</span>
                        <input type="text" name='address1' value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            maxLength="45"
                        />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Shipping Address 2</span>
                        <input type="text" name='address2' value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            maxLength="45"
                        />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Shipping Address 3</span>
                        <input type="text" name='address3' value={address3}
                            onChange={(e) => setAddress3(e.target.value)}
                            maxLength="45"
                        />
                    </div>
                    <div className='add__vendor__modal--select'>
                        <span className='required__field'>Shipping Country</span>
                        <Select
                            showSearch
                            id='country'
                            defaultValue="ae"
                            value={selectedCountry}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                            onChange={handleShippingCountryChange}
                        />
                    </div>
                    <div className='add__vendor__modal--select'>
                        {selectedCountry && (
                            <>
                                <span className='required__field'>{selectedCountry == "ae" ? "Emirates" : "State"}</span>
                                <Select
                                    showSearch
                                    style={{
                                        color: 'black',
                                        fontWeight: 300,
                                    }}
                                    id='state'
                                    value={state}
                                    placeholder="Select State"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={allState.map((state) => ({ value: state, label: state }))}
                                    onChange={(value) => setState(value)}

                                />
                            </>
                        )}
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span className='required__field'>Contact Name</span>
                        <input type="text" name='contactName' value={contactName}
                            onChange={(e) => {
                                setContactName(e.target.value)
                            }}
                        />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>VAT TRN Number</span>
                        <input type="text" name='trnNumber' value={trnNumber} onChange={(e) => setTrnNumber(e.target.value)} />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Opening Balance</span>
                        <Input type='text' name='openingBalance' addonBefore={"AED"} value={openingBalance}
                            onChange={(e) => {
                                setOpeningBalance(e.target.value);
                            }}
                        />
                    </div>
                    <div className='add__vendor__modal--input'>
                        <span>Opening Balance Date</span>
                        <input type="date"
                            name='openingBalanceDate'
                            value={openingBalanceDate}
                            onChange={(e) => setOpeningBalanceDate(e.target.value)}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default AddVendorModal;
