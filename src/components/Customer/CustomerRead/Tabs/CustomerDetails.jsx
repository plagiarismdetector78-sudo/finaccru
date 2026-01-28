import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCustomerDetails, getShippingAddressList } from "../../../../Actions/Customer";
import moment from "moment";

const CustomerDetails = ({ customerId }) => {
    const dispatch = useDispatch();
    const { loading, customer, shippingAddresses } = useSelector(state => state.customerReducer);

    useEffect(() => {
        dispatch(getCustomerDetails(customerId));
        dispatch(getShippingAddressList(customerId));
    }, [dispatch, customerId])

    return (
        <div className="read__customer">
            <div className="read__customer-main">
                <div className="read__customer--left">
                    <div className="read__customer--input">
                        <span>Customer Name</span>
                        <input value={customer?.customer_name} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>Contact Name</span>
                        <input value={customer?.contact_name} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>Display Name</span>
                        <input value={customer?.display_name} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>Email</span>
                        <input value={customer?.email} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>Phone</span>
                        <input value={customer?.mobile_number} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>VAT TRN Number</span>
                        <input value={customer?.trn} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>Opening Balance</span>
                        <input value={new Intl.NumberFormat('en-US', {}).format(parseFloat(customer?.opening_balance || 0.00).toFixed(2))} disabled />
                    </div>
                    <div className="read__customer--input">
                        <span>Opening Balance Date</span>
                        <input value={moment(customer?.opening_balance_date).format('DD-MM-YYYY')} disabled />
                    </div>
                </div>
                <div className="read__customer--right">
                    <div className="read__customer--input">
                        <span>Billing Address 1</span>
                        <input value={customer?.billing_address_line_1} disabled />
                    </div>
                    {
                        customer?.billing_address_line_2 && (
                            <div className="read__customer--input">
                                <span>Billing Address 2</span>
                                <input value={customer?.billing_address_line_2} disabled />
                            </div>
                        )
                    }
                    {
                        customer?.billing_address_line_3 && (
                            <div className="read__customer--input">
                                <span>Billing Address 3</span>
                                <input value={customer?.billing_address_line_3} disabled />
                            </div>
                        )
                    }
                    <div className="read__customer--input">
                        <span>Country</span>
                        <input value={customer?.billing_country} disabled />
                    </div>
                    <div className="read__customer--input">
                        {
                            customer?.billing_country == "United Arab Emirates" ? (
                                <span>Emirates</span>
                            ) : (
                                <span>State</span>
                            )
                        }
                        <input value={customer?.billing_state} disabled />
                    </div>
                </div>
            </div>
            <div className="read__customer-shipping">
                {/* <span className="read__customer-header">Shipping Address</span> */}
                <div className="read__customer--shippingList">
                    {
                        shippingAddresses?.map((address, index) => (

                            <div className="read__customer--shipping-address" key={index}>
                                <div className="read__customer--shipping-address-left">
                                    <div className="read__customer--input shipping-input">
                                        <span>Shipping Address {index + 1}</span>
                                        {/* <span>Label</span> */}
                                        {
                                            address?.label && (
                                                <input value={address?.label} disabled />
                                            )
                                        }
                                    </div>
                                    <div className="read__customer--input shipping-input">
                                        {/* <span>Address Line 1</span> */}
                                        <input value={address?.address_line_1} disabled />
                                    </div>
                                    {
                                        address?.address_line_2 && (
                                            <div className="read__customer--input shipping-input">
                                                {/* <span>Address Line 2</span> */}
                                                <input value={address?.address_line_2} disabled />
                                            </div>
                                        )
                                    }
                                    {
                                        address?.address_line_3 && (
                                            <div className="read__customer--input shipping-input">
                                                {/* <span>Address Line 3</span> */}
                                                <input value={address?.address_line_3} disabled />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="read__customer--shipping-address-right">
                                    <div className="read__customer--input">
                                        <span>Country</span>
                                        <input value={address?.country} disabled />
                                    </div>
                                    <div className="read__customer--input">
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

export default CustomerDetails;
