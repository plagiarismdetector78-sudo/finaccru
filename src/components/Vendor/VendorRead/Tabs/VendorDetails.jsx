import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getVendorDetails, getVendorShippingAddressList } from "../../../../Actions/Vendor";
import moment from "moment";


const VendorDetails = ({ vendorId }) => {
    const dispatch = useDispatch();
    const { loading, vendor, shippingAddresses } = useSelector(state => state.vendorReducer);

    useEffect(() => {
        dispatch(getVendorDetails(vendorId));
        dispatch(getVendorShippingAddressList(vendorId));
    }, [dispatch, vendorId])

    return (
        <div className="read__vendor">
            <div className="read__vendor-main">
                <div className="read__vendor--left">
                    <div className="read__vendor--input">
                        <span>Vendor Name</span>
                        <input value={vendor?.vendor_name} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>Contact Name</span>
                        <input value={vendor?.contact_name} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>Display Name</span>
                        <input value={vendor?.display_name} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>Email</span>
                        <input value={vendor?.email} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>Phone</span>
                        <input value={vendor?.mobile_number} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>VAT TRN Number</span>
                        <input value={vendor?.trn} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>Opening Balance</span>
                        <input value={new Intl.NumberFormat('en-US', {}).format(parseFloat(vendor?.opening_balance || 0.00).toFixed(2))} disabled />
                    </div>
                    <div className="read__vendor--input">
                        <span>Opening Balance Date</span>
                        <input value={moment(vendor?.opening_balance_date).format('DD-MM-YYYY')} disabled />
                    </div>
                </div>
                <div className="read__vendor--right">
                    <div className="read__vendor--input">
                        <span>Billing Address 1</span>
                        <input value={vendor?.billing_address_line_1} disabled />
                    </div>
                    {
                        vendor?.billing_address_line_2 && (
                            <div className="read__vendor--input">
                                <span>Billing Address 2</span>
                                <input value={vendor?.billing_address_line_2} disabled />
                            </div>
                        )
                    }
                    {
                        vendor?.billing_address_line_3 && (
                            <div className="read__vendor--input">
                                <span>Billing Address 3</span>
                                <input value={vendor?.billing_address_line_3} disabled />
                            </div>
                        )
                    }
                    <div className="read__vendor--input">
                        <span>Country</span>
                        <input value={vendor?.billing_country} disabled />
                    </div>
                    <div className="read__vendor--input">
                        {
                            vendor?.billing_country == "United Arab Emirates" ? (
                                <span>Emirates</span>
                            ) : (
                                <span>State</span>
                            )
                        }
                        <input value={vendor?.billing_state} disabled />
                    </div>
                </div>
            </div>
            <div className="read__vendor-shipping">
                {/* <span className="read__vendor-header">Shipping Address</span> */}
                <div className="read__vendor--shippingList">
                    {
                        shippingAddresses?.map((address, index) => (

                            <div className="read__vendor--shipping-address" key={index}>
                                <div className="read__vendor--shipping-address-left">
                                    <div className="read__vendor--input shipping-input">
                                        <span>Shipping Address {index + 1}</span>
                                        {/* <span>Label</span> */}
                                        {
                                            address?.label && (
                                                <input value={address?.label} disabled />
                                            )
                                        }
                                    </div>
                                    <div className="read__vendor--input shipping-input">
                                        {/* <span>Address Line 1</span> */}
                                        <input value={address?.address_line_1} disabled />
                                    </div>
                                    {
                                        address?.address_line_2 && (
                                            <div className="read__vendor--input shipping-input">
                                                {/* <span>Address Line 2</span> */}
                                                <input value={address?.address_line_2} disabled />
                                            </div>
                                        )
                                    }
                                    {
                                        address?.address_line_3 && (
                                            <div className="read__vendor--input shipping-input">
                                                {/* <span>Address Line 3</span> */}
                                                <input value={address?.address_line_3} disabled />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="read__vendor--shipping-address-right">
                                    <div className="read__vendor--input">
                                        <span>Country</span>
                                        <input value={address?.country} disabled />
                                    </div>
                                    <div className="read__vendor--input">
                                        {
                                            address?.country == "United Arab Emirates" ? (
                                                <span>Emirates</span>
                                            ) : (
                                                <span>State</span>
                                            )
                                        }
                                        <input value={address?.state} disabled />
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default VendorDetails;
