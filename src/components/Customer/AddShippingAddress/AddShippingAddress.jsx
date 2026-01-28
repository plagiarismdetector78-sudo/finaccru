import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { createShippingAddress } from "../../../Actions/Customer";
import uaeStates from "../../../data/uaeStates";

import "./AddShippingAddress.css";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const AddShippingAddress = ({
    isShippingModalOpen,
    handleShippingCancel,
    customerId,
    handleAddShippingAddressSubmit,
}) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.customerReducer);
    const { user } = useSelector((state) => state.userReducer);
    const [label, setLabel] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [country, setCountry] = useState("United Arab Emirates");
    const [state, setState] = useState("");
    const client_id =
        user?.localInfo?.role === 2
            ? window.location.pathname.split("/")[4]
            : user?.localInfo?.role === 1
            ? window.location.pathname.split("/")[2]
            : 0;

    const handleSubmit = () => {
        if (address1 === "" || country === "" || state === "") {
            toast.error("Please fill all the fields.");
            return;
        }
        const values = {
            label: label === "" ? null : label,
            address_line_1: address1,
            address_line_2: address2 === "" ? null : address2,
            address_line_3: address3 === "" ? null : address3,
            state: state,
            country: country,
        };
        dispatch(
            createShippingAddress(
                values,
                customerId,
                handleAddShippingAddressSubmit,
                user?.localInfo?.role,
                client_id
            )
        );
        setAddress1("");
        setAddress2("");
        setAddress3("");
        setCountry("United Arab Emirates");
        setState("");
    };

    const handleCancelWithReset = () => {
        setLabel("");
        setAddress1("");
        setAddress2("");
        setAddress3("");
        setCountry("United Arab Emirates");
        setState("");
        handleShippingCancel();
    };

    return (
        <Modal
            open={isShippingModalOpen}
            onCancel={handleCancelWithReset}
            footer={null}
            width={500}
            style={{ top: 20 }}
            className="add__shipping__modal"
        >
            <span className="add__shipping__modal--header">
                Add New Shipping Address
            </span>
            <form className="add__shipping__modal--form">
                <div className="add__shipping__modal--input">
                    <span>Label</span>
                    <input
                        type="text"
                        name="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>
                <div className="add__shipping__modal--input">
                    <span className="required__field">Shipping Address 1</span>
                    <input
                        type="text"
                        name="address1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        maxLength="45"
                    />
                </div>
                <div className="add__shipping__modal--input">
                    <span>Shipping Address 2</span>
                    <input
                        type="text"
                        name="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        maxLength="45"
                    />
                </div>
                <div className="add__shipping__modal--input">
                    <span className="required__field">Shipping Address 3</span>
                    <input
                        type="text"
                        name="address3"
                        value={address3}
                        onChange={(e) => setAddress3(e.target.value)}
                        maxLength="45"
                    />
                </div>
                <div className="add__shipping__modal--input">
                    <span className="required__field">Shipping Country</span>
                    <CountryDropdown
                        value={country}
                        onChange={(val) => setCountry(val)}
                        classes="country-dropdown"
                        style={{
                            width: "100%",
                            height: "40px",
                            padding: "0.5rem",
                            border: "1px solid #d9d9d9",
                            borderRadius: "2px",
                            fontSize: "14px",
                        }}
                    />
                </div>
                <div className="add__shipping__modal--select">
                    <span className="required__field">Shipping State</span>
                    <RegionDropdown
                        country={country}
                        value={state}
                        onChange={(val) => setState(val)}
                        classes="region-dropdown"
                        style={{
                            width: "100%",
                            height: "40px",
                            padding: "0.5rem",
                            border: "1px solid #d9d9d9",
                            borderRadius: "2px",
                            fontSize: "14px",
                        }}
                    />
                </div>
                <div className="add__shipping__modal--btns">
                    <a
                        className="add__shipping__modal--cancel-btn"
                        onClick={handleCancelWithReset}
                    >
                        Cancel
                    </a>
                    <a
                        className="add__shipping__modal--submit-btn"
                        onClick={handleSubmit}
                    >
                        {" "}
                        {loading ? <LoadingOutlined /> : "Submit"}{" "}
                    </a>
                </div>
            </form>
        </Modal>
    );
};

export default AddShippingAddress;
