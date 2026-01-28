import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { createInSalesDocument } from "../../../Actions/Customer";
import uaeStates from "../../../data/uaeStates";
import { useParams } from "react-router-dom";
import { Modal, Select, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
import "./AddCustomerModal.css";
import { COUNTRIES } from "../../../data/countries.js";

const AddCustomerModal = ({
    isModalOpen,
    handleCancel,
    handleCustomerSubmit,
}) => {
    const dispatch = useDispatch();
    const { client_id } = useParams(); //  client_id from the URL
    const userRole = useSelector((state) => state.userReducer.role); // user role from Redux state
    // console.log(userRole);

    const [customerName, setCustomerName] = useState("");
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
    const [billingCountry, setBillingCountry] = useState(
        "United Arab Emirates"
    );
    const { loading } = useSelector((state) => state.customerReducer);
    const [state, setState] = useState("");
    const [billingState, setBillingState] = useState("");
    const [openingBalance, setOpeningBalance] = useState(null);
    const [openingBalanceDate, setOpeningBalanceDate] = useState("");

    const handleCountryPhoneCodeChange = (value) => {
        const countryPhoneCode = value;
        setCountryPhoneCode(countryPhoneCode);
    };

    const selectBefore = (
        <Select
            onChange={handleCountryPhoneCodeChange}
            defaultValue={countryPhoneCode}
        >
            {COUNTRIES.map((country) => (
                <Option key={country.code} value={country.mobileCode}>
                    {country.mobileCode}
                </Option>
            ))}
        </Select>
    );

    const handleUseBillingAddress = () => {
        if (!sameBillingAddress) {
            setSameBillingAddress(true);
            setAddress1(billingAddress1);
            setAddress2(billingAddress2);
            setAddress3(billingAddress3);
            setCountry(billingCountry);
            setState(billingState);
        } else {
            setSameBillingAddress(false);
        }
    };

    const handleCustomerName = (e) => {
        setCustomerName(e.target.value);
        if (displayName === "" || displayName === customerName) {
            setDisplayName(e.target.value);
        }
    };
    const handleJrSubmit = () => {
        if (phone !== "") {
            if (isPhoneError) {
                toast.error("Please Enter Valid Phone Number.");
                return;
            }
            if ((countryPhoneCode + phone).length > 13) {
                toast.error(
                    "Phone Number can have at most 13 digits including country code."
                );
                return;
            }
        }
        if (
            customerName === "" ||
            displayName === "" ||
            address1 === "" ||
            billingAddress1 === "" ||
            billingCountry == "" ||
            billingState == "" ||
            country === "" ||
            state === "" ||
            contactName === ""
        ) {
            toast.error("Please fill all the fields");
            return;
        }
        const customer = {
            client_id: client_id,
            customer_name: customerName,
            contact_name: contactName === "" ? null : contactName,
            display_name: displayName,
            email: email === "" ? null : email,
            mobile_number: phone === "" ? null : countryPhoneCode + phone,
            billing_address_line_1: billingAddress1,
            billing_address_line_2:
                billingAddress2 === "" ? null : billingAddress2,
            billing_address_line_3:
                billingAddress3 === "" ? null : billingAddress3,
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
            opening_balance_date:
                openingBalanceDate === "" ? null : openingBalanceDate,
        };
        dispatch(createInSalesDocument(customer, handleCustomerSubmit));
        // resetting the fields after dispatch
        setCustomerName("");
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
        setBillingCountry("United Arab Emirates");
        setState("");
        setBillingState("");
        setOpeningBalance(null);
        setOpeningBalanceDate("");
    };
    const handleSubmit = () => {
        if (phone !== "") {
            if (isPhoneError) {
                toast.error("Please Enter Valid Phone Number.");
                return;
            }
            if ((countryPhoneCode + phone).length > 13) {
                toast.error(
                    "Phone Number can have at most 13 digits including country code."
                );
                return;
            }
        }
        if (
            customerName === "" ||
            displayName === "" ||
            address1 === "" ||
            billingAddress1 === "" ||
            billingCountry == "" ||
            billingState == "" ||
            country === "" ||
            state === "" ||
            contactName === ""
        ) {
            toast.error("Please fill all the fields");
            return;
        }
        const customer = {
            customer_name: customerName,
            contact_name: contactName === "" ? null : contactName,
            display_name: displayName,
            email: email === "" ? null : email,
            mobile_number: phone === "" ? null : countryPhoneCode + phone,
            billing_address_line_1: billingAddress1,
            billing_address_line_2:
                billingAddress2 === "" ? null : billingAddress2,
            billing_address_line_3:
                billingAddress3 === "" ? null : billingAddress3,
            billing_state: billingState,
            billing_country: billingCountry,
            shipping_address_line_1: address1,
            shipping_address_line_2: address2 === "" ? null : address2,
            shipping_address_line_3: address3 === "" ? null : address3,
            shipping_state: state,
            shipping_country: country,
            trn: trnNumber === "" ? null : trnNumber,
            opening_balance: openingBalance === "" ? null : openingBalance,
            opening_balance_date:
                openingBalanceDate === "" ? null : openingBalanceDate,
        };
        dispatch(createInSalesDocument(customer, handleCustomerSubmit));
        setCustomerName("");
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
        setBillingCountry("United Arab Emirates");
        setState("");
        setBillingState("");
        setOpeningBalance(null);
        setOpeningBalanceDate("");
    };

    const handleCancelWithReset = () => {
        setCustomerName("");
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
        setBillingCountry("United Arab Emirates");
        setState("");
        setBillingState("");
        setOpeningBalance(null);
        setOpeningBalanceDate("");
        handleCancel();
    };
    const handleFinalSubmit = () => {
        if (userRole === 1) {
            handleJrSubmit();
        } else {
            handleSubmit();
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancelWithReset}
            footer={null}
            width={900}
            style={{ top: 15 }}
        >
            <span className="add__customer__modal--header">
                Add New Customer
            </span>
            <form className="add__customer__modal--form">
                <div className="add__customer__modal--left">
                    <div className="add__customer__modal--input">
                        <span className="required__field">Customer Name</span>
                        <input
                            type="text"
                            name="customerName"
                            value={customerName}
                            onChange={handleCustomerName}
                            required
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Phone</span>
                        <Input
                            type="text"
                            name="phone"
                            addonBefore={selectBefore}
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                            }}
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span className="required__field">Display Name</span>
                        <input
                            type="text"
                            name="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span className="required__field">
                            Billing Address 1
                        </span>
                        <input
                            type="text"
                            name="billingAddress1"
                            value={billingAddress1}
                            onChange={(e) => setBillingAddress1(e.target.value)}
                            maxLength="45"
                            required
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Billing Address 2</span>
                        <input
                            type="text"
                            name="billingAddress2"
                            value={billingAddress2}
                            onChange={(e) => {
                                setBillingAddress2(e.target.value);
                            }}
                            maxLength="45"
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Billing Address 3</span>
                        <input
                            type="text"
                            name="billingAddress3"
                            value={billingAddress3}
                            onChange={(e) => {
                                setBillingAddress3(e.target.value);
                            }}
                            maxLength="45"
                        />
                    </div>
                    <div className="add__customer__modal--select">
                        <span className="required__field">Billing Country</span>
                        <CountryDropdown
                            value={billingCountry}
                            onChange={(val) => setBillingCountry(val)}
                            classes="country-dropdown"
                            style={{
                                width: "80%",
                                height: "40px",
                                padding: "0.5rem",
                                border: "1px solid #d9d9d9",
                                borderRadius: "2px",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                    <div className="add__customer__modal--select">
                        <span className="required__field">Billing State</span>
                        <RegionDropdown
                            country={billingCountry}
                            value={billingState}
                            onChange={(val) => setBillingState(val)}
                            classes="region-dropdown"
                            style={{
                                width: "80%",
                                height: "40px",
                                padding: "0.5rem",
                                border: "1px solid #d9d9d9",
                                borderRadius: "2px",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                    <div className="add__customer__modal--btns">
                        <a
                            className="add__customer__modal--cancel-btn"
                            onClick={handleCancelWithReset}
                        >
                            Cancel
                        </a>
                        <a
                            className="add__customer__modal--submit-btn"
                            onClick={handleFinalSubmit}
                        >
                            {" "}
                            {loading ? <LoadingOutlined /> : "Submit"}{" "}
                        </a>
                    </div>
                </div>
                <div className="add__customer__modal--right">
                    <div className="add__customer__modal--checkbox">
                        <input
                            type="checkbox"
                            value={sameBillingAddress}
                            checked={sameBillingAddress}
                            onChange={handleUseBillingAddress}
                        />
                        <span>Use Billing Address</span>
                    </div>
                    <div className="add__customer__modal--input">
                        <span className="required__field">
                            Shipping Address 1
                        </span>
                        <input
                            type="text"
                            name="address1"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            maxLength="45"
                            required
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Shipping Address 2</span>
                        <input
                            type="text"
                            name="address2"
                            value={address2}
                            onChange={(e) => {
                                setAddress2(e.target.value);
                            }}
                            maxLength="45"
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Shipping Address 3</span>
                        <input
                            type="text"
                            name="address3"
                            value={address3}
                            onChange={(e) => {
                                setAddress3(e.target.value);
                            }}
                            maxLength="45"
                        />
                    </div>
                    <div className="add__customer__modal--select">
                        <span className="required__field">
                            Shipping Country
                        </span>
                        <CountryDropdown
                            value={country}
                            onChange={(val) => setCountry(val)}
                            classes="country-dropdown"
                            style={{
                                width: "80%",
                                height: "40px",
                                padding: "0.5rem",
                                border: "1px solid #d9d9d9",
                                borderRadius: "2px",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                    <div className="add__customer__modal--select">
                        <span className="required__field">Shipping State</span>
                        <RegionDropdown
                            country={country}
                            value={state}
                            onChange={(val) => setState(val)}
                            classes="region-dropdown"
                            style={{
                                width: "80%",
                                height: "40px",
                                padding: "0.5rem",
                                border: "1px solid #d9d9d9",
                                borderRadius: "2px",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span className="required__field">Contact Name</span>
                        <input
                            type="text"
                            name="contactName"
                            value={contactName}
                            onChange={(e) => {
                                setContactName(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>VAT TRN Number</span>
                        <input
                            type="text"
                            name="trnNumber"
                            value={trnNumber}
                            onChange={(e) => setTrnNumber(e.target.value)}
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Opening Balance</span>
                        <Input
                            type="text"
                            name="openingBalance"
                            addonBefore={"AED"}
                            value={openingBalance}
                            onChange={(e) => {
                                setOpeningBalance(e.target.value);
                            }}
                        />
                    </div>
                    <div className="add__customer__modal--input">
                        <span>Opening Balance Date</span>
                        <input
                            type="date"
                            name="openingBalanceDate"
                            value={openingBalanceDate}
                            onChange={(e) =>
                                setOpeningBalanceDate(e.target.value)
                            }
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddCustomerModal;
