import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { getCountries, getStates } from "country-state-picker";
import { createVendor, getVendorDetails, getVendorShippingAddressList, updateVendor } from "../../../Actions/Vendor";
import uaeStates from "../../../data/uaeStates";

import "./VendorLayout.css";
import "../../../Styles/Layout/LayoutHeader.css";
import { Select, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
import backButton from "../../../assets/Icons/back.svg";
import MinusIcon from "../../../assets/Icons/minus.svg";

const VendorLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isEdit = window.location.pathname.split('/')[2] === 'edit';
    const { loading, vendor, shippingAddresses: sA } = useSelector((state) => state.vendorReducer);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getVendorDetails(window.location.pathname.split('/')[3]));
            dispatch(getVendorShippingAddressList(window.location.pathname.split('/')[3]));
        }
    }, [dispatch]);

    const [vendorName, setVendorName] = useState("");
    const [contactName, setContactName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [countryPhoneCode, setCountryPhoneCode] = useState("+971");
    const [billingAddress1, setBillingAddress1] = useState("");
    const [billingAddress2, setBillingAddress2] = useState("");
    const [billingAddress3, setBillingAddress3] = useState("");
    const [trnNumber, setTrnNumber] = useState("");
    const [openingBalance, setOpeningBalance] = useState(null);
    const [openingBalanceDate, setOpeningBalanceDate] = useState("");
    const [sameBillingAddress, setSameBillingAddress] = useState(false);
    const [shippingAddresses, setShippingAddresses] = useState([
        { label: "", address_line_1: "", address_line_2: "", address_line_3: "", state: "", country: "United Arab Emirates", countryCode: "ae" }
    ]);
    const [billingState, setBillingState] = useState(null);
    const [billingCountry, setBillingCountry] = useState("United Arab Emirates");
    const [allBillingState, setAllBillingStates] = useState(uaeStates);
    const [selectedBillingCountry, setSelectedBillingCountry] = useState("ae");
    const [isPhoneError, setIsPhoneError] = useState(false);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            setVendorName(vendor?.vendor_name ?? "");
            setContactName(vendor?.contact_name ?? "");
            setDisplayName(vendor?.display_name ?? "");
            setEmail(vendor?.email ?? "");
            setPhone(vendor?.mobile_number?.slice(0, 4) === "+971" ? vendor?.mobile_number?.slice(4) : vendor?.mobile_number?.slice(3) ?? "");
            setCountryPhoneCode(vendor?.mobile_number?.slice(0, 4) === "+971" ? "+971" : vendor?.mobile_number?.slice(0, 3) ?? "+971");
            setBillingAddress1(vendor?.billing_address_line_1 ?? "");
            setBillingAddress2(vendor?.billing_address_line_2 ?? "");
            setBillingAddress3(vendor?.billing_address_line_3 ?? "");
            setTrnNumber(vendor?.trn ?? "");
            setOpeningBalance(vendor?.opening_balance ?? null);
            setOpeningBalanceDate(vendor?.opening_balance_date ?? "");
            setShippingAddresses(sA?.map((address) => ({ ...address, countryCode: getCountries().find(country => country.name === country?.country)?.code ?? "ae" })) ?? []);
            setBillingState(vendor?.billing_state ?? null);
            setBillingCountry(vendor?.billing_country ?? "United Arab Emirates");
            // find country code from country name
            const selectedBillingCountry = getCountries().find(country => country.name === vendor?.billing_country);
            setSelectedBillingCountry(selectedBillingCountry ? selectedBillingCountry.code : "ae");
            if (selectedBillingCountry?.code === "ae") {
                setAllBillingStates(uaeStates);
            } else if (selectedBillingCountry?.code) {
                const countryStates = getStates(selectedBillingCountry.code);
                setAllBillingStates(countryStates);
            } else {
                setAllBillingStates([]);
            }
        }
    }, [vendor, sA, dispatch]);

    const handleCountryPhoneCodeChange = (value) => {
        setCountryPhoneCode(value);
    }

    const selectBefore = (
        <Select onChange={handleCountryPhoneCodeChange} defaultValue={countryPhoneCode} value={countryPhoneCode}>
            {getCountries().map((country) => (
                <Option key={country.code} value={country.dial_code}>
                    {country.dial_code}
                </Option>
            ))}
        </Select>
    );

    const handleBillingCountryChange = (value) => {
        const countryCode = value;
        setSelectedBillingCountry(countryCode);
        const selectedBillingCountry = getCountries().find(country => country.code === countryCode);
        setBillingCountry(selectedBillingCountry ? selectedBillingCountry.name : "");
        if (countryCode === "ae") {
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
            const updatedShippingAddress = shippingAddresses?.map((address) => ({ ...address }));
            updatedShippingAddress[0].address_line_1 = billingAddress1;
            updatedShippingAddress[0].address_line_2 = billingAddress2;
            updatedShippingAddress[0].address_line_3 = billingAddress3;
            updatedShippingAddress[0].state = billingState;
            updatedShippingAddress[0].country = billingCountry;
            updatedShippingAddress[0].countryCode = selectedBillingCountry;
            setShippingAddresses(updatedShippingAddress);
        } else {
            setSameBillingAddress(false);
        }
    }

    const handleShippingAddressChange = (index, key, value) => {
        const updatedShippingAddress = shippingAddresses?.map((address) => ({ ...address }));
        updatedShippingAddress[index][key] = value;
        if (key === "countryCode") {
            const countryCode = value;
            const selectedShippingCountry = getCountries()?.find(country => country.code === countryCode);
            updatedShippingAddress[index].country = selectedShippingCountry ? selectedShippingCountry.name : "";
            updatedShippingAddress[index].state = null;
        }
        setShippingAddresses(updatedShippingAddress);
    };

    const handleAddShippingAddress = (event) => {
        event.preventDefault();
        setShippingAddresses([...shippingAddresses, { label: "", address_line_1: "", address_line_2: "", address_line_3: "", state: "", country: "United Arab Emirates", countryCode: "ae" }]);
    };

    const handleRemoveShippingAddress = (index, event) => {
        event.preventDefault();
        const updatedShippingAddress = shippingAddresses?.filter((_, i) => i !== index);
        setShippingAddresses(updatedShippingAddress);
        if (index === 0) {
            setSameBillingAddress(false);
        }
    };

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
        if (vendorName === "" || displayName === "" || billingAddress1 === "" || billingState == "" || billingCountry == "") {
            toast.error("Please fill all the fields");
            return;
        }
        if (shippingAddresses?.some(address => address.address_line_1 === "" || address.state === "" || address.country === "")) {
            toast.error("Please fill compulsory fields of shipping address.");
            return;
        }
        if (shippingAddresses?.some(address => address.label === "")) {
            shippingAddresses?.forEach(address => {
                if (address.label === "") { address.label = null; }
            })
        }
        if (shippingAddresses?.some(address => address.address_line_2 === "")) {
            shippingAddresses?.forEach(address => {
                if (address.address_line_2 === "") { address.address_line_2 = null; }
            })
        } else if (shippingAddresses?.some(address => address.address_line_3 === "")) {
            shippingAddresses?.forEach(address => {
                if (address.address_line_3 === "") { address.address_line_3 = null; }
            })
        }
        shippingAddresses?.forEach(address => {
            delete address.countryCode;
        })
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
            shipping_addresses: shippingAddresses,
            trn: trnNumber === "" ? null : trnNumber,
            opening_balance: openingBalance === "" ? null : openingBalance,
            opening_balance_date: openingBalanceDate === "" ? null : openingBalanceDate,
        }
        if (isEdit) {
            dispatch(updateVendor(vendor, window.location.pathname.split('/')[3], 0, navigate));
        } else {
            dispatch(createVendor(vendor, 0, navigate));
        }
    }

    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate("/vendor")} />
                    <h1 className='layout__header--title'> Vendors List </h1>
                </div>
            </div>
            <div className="create__vendor--main">
                <span className="create__vendor--header">{isEdit ? "Edit Vendor" : "Add New Vendor"}</span>
                <form className="create__vendor--form">
                    <div className="create__vendor--form-main">
                        <div className="create__vendor--left">
                            <div className="create__vendor--input">
                                <span className="required__field">Vendor Name</span>
                                <input type="text" name="vendorName" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
                            </div>
                            <div className="create__vendor--input">
                                <span>Contact Name</span>
                                <input type="text" name="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                            </div>
                            <div className="create__vendor--input">
                                <span className="required__field">Display Name</span>
                                <input type="text" name="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            </div>
                            <div className="create__vendor--input">
                                <span>Email</span>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="create__vendor--input">
                                <span>Phone</span>
                                <Input type="text" name="phone" addonBefore={selectBefore} value={phone}
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
                            <div className="create__vendor--input">
                                <span>VAT TRN Number</span>
                                <input type="text" name="trnNumber" value={trnNumber} onChange={(e) => setTrnNumber(e.target.value)} />
                            </div>
                            <div className="create__vendor--input">
                                <span>Opening Balance</span>
                                <Input type="text" name="openingBalance" addonBefore={"AED"} value={openingBalance}
                                    onChange={(e) => {
                                        setOpeningBalance(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="create__vendor--input">
                                <span>Opening Balance Date</span>
                                <input type="date"
                                    name="openingBalanceDate"
                                    value={openingBalanceDate}
                                    onChange={(e) => setOpeningBalanceDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="create__vendor--right">
                            <div className="create__vendor--input">
                                <span className="required__field">Billing Address 1</span>
                                <input type="text" name="billingAddress1" value={billingAddress1}
                                    onChange={(e) => setBillingAddress1(e.target.value)}
                                />
                            </div>
                            <div className="create__vendor--input">
                                <span>Billing Address 2</span>
                                <input type="text" name="billingAddress2" value={billingAddress2}
                                    onChange={(e) => setBillingAddress2(e.target.value)}
                                />
                            </div>
                            <div className="create__vendor--input">
                                <span>Billing Address 3</span>
                                <input type="text" name="billingAddress3" value={billingAddress3}
                                    onChange={(e) => setBillingAddress3(e.target.value)}
                                />
                            </div>
                            <div className="create__vendor--select">
                                <span className="required__field">Billing Country</span>
                                <Select
                                    showSearch
                                    id="country"
                                    defaultValue="ae"
                                    value={selectedBillingCountry}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                    options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                                    onChange={handleBillingCountryChange}
                                />
                            </div>
                            <div className="create__vendor--select">
                                {selectedBillingCountry && (
                                    <>
                                        <span className="required__field">{selectedBillingCountry == "ae" ? "Emirates" : "State"}</span>
                                        <Select
                                            showSearch
                                            id="state"
                                            placeholder="Select State"
                                            value={billingState}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                            }
                                            options={allBillingState?.map((state) => ({ value: state, label: state }))}
                                            onChange={(value) => setBillingState(value)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="create__vendor--form-shipping">
                        <span className="create__vendor--form-header">Shipping Address</span>
                        <div className="create__vendor--checkbox">
                            <input type="checkbox" value={sameBillingAddress}
                                checked={sameBillingAddress}
                                onChange={handleUseBillingAddress}
                            />
                            <span>Use Billing Address</span>
                        </div>
                        <div className="create__vendor--shippingList">
                            {
                                shippingAddresses?.map((address, index) => (
                                    <>
                                        <div className="create__vendor--shipping-address" key={index}>
                                            {shippingAddresses?.length > 1 && (
                                                <div className='create__vendor--shipping-address-minus'>
                                                    {index === 0 ? <span style={{ marginBottom: '1rem' }}>&nbsp;</span> : <></>}
                                                    <img src={MinusIcon} onClick={(e) => handleRemoveShippingAddress(index, e)} />
                                                </div>
                                            )}
                                            <div className="create__vendor--shipping-address-single">
                                                <div className="create__vendor--shipping-address-left">
                                                    <div className="create__vendor--input shipping-input">
                                                        <span>Label</span>
                                                        <input type="text" name="label" value={address.label}
                                                            onChange={(e) => handleShippingAddressChange(index, "label", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="create__vendor--input shipping-input">
                                                        <span className="required__field">Address Line 1</span>
                                                        <input type="text" name="address_line_1" value={address.address_line_1}
                                                            onChange={(e) => handleShippingAddressChange(index, "address_line_1", e.target.value)}
                                                            maxLength="45"
                                                        />
                                                    </div>
                                                    <div className="create__vendor--input shipping-input">
                                                        <span>Address Line 2</span>
                                                        <input type="text" name="address_line_2" value={address.address_line_2}
                                                            onChange={(e) => handleShippingAddressChange(index, "address_line_2", e.target.value)}
                                                            maxLength="45"
                                                        />
                                                    </div>
                                                    <div className="create__vendor--input shipping-input">
                                                        <span>Address Line 3</span>
                                                        <input type="text" name="address_line_3" value={address.address_line_3}
                                                            onChange={(e) => handleShippingAddressChange(index, "address_line_3", e.target.value)}
                                                            maxLength="45"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="create__vendor--shipping-address-right">
                                                    <div className="create__vendor--select shipping-input">
                                                        <span className="required__field">Country</span>
                                                        <Select
                                                            showSearch
                                                            id="country"
                                                            defaultValue="ae"
                                                            value={address.country}
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                                                            options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                                                            onChange={(value) => handleShippingAddressChange(index, "countryCode", value)}
                                                        />
                                                    </div>
                                                    <div className="create__vendor--select shipping-input">
                                                        {address.country && (
                                                            <>
                                                                <span className="required__field">{address.country == "ae" ? "Emirates" : "State"}</span>
                                                                <Select
                                                                    showSearch
                                                                    id="state"
                                                                    placeholder="Select State"
                                                                    value={address.state}
                                                                    optionFilterProp="children"
                                                                    filterOption={(input, option) => (option?.label ?? "").includes(input)}
                                                                    filterSort={(optionA, optionB) =>
                                                                        (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                                                    }
                                                                    options={address.countryCode == "ae" ? uaeStates?.map((state) => ({ value: state, label: state })) : getStates(address.countryCode)?.map((state) => ({ value: state, label: state }))}
                                                                    onChange={(value) => handleShippingAddressChange(index, "state", value)}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }
                            <div className='add--item-btn'>
                                <button onClick={(e) => handleAddShippingAddress(e)}>
                                    <PlusOutlined />
                                </button>
                                <span>Add New Shipping Address</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="create__vendor--btns">
                            <a className="create__vendor--submit-btn" onClick={handleSubmit}> {
                                // loading ? <LoadingOutlined /> : "Submit"
                                "Submit"
                            } </a>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default VendorLayout;
