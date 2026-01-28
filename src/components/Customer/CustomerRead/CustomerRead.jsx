import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDetails } from "../../../Actions/Customer";

import CustomerDetails from "./Tabs/CustomerDetails";
import CustomerTransactions from "./Tabs/CustomerTransactions";
import CustomerStatement from "./Tabs/Statement/Statement";

import { Tabs } from 'antd';
import backButton from "../../../assets/Icons/back.svg";
import "./CustomerRead.css";

const CustomerRead = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customer_id = window.location.pathname.split('/')[3];
    const { loading, customer } = useSelector(state => state.customerReducer);

    useEffect(() => {
        dispatch(getCustomerDetails(customer_id));
    }, [dispatch, customer_id])

    const items = [
        {
            key: '1',
            label: 'Details',
            children: <CustomerDetails customerId={customer_id} />,
        },
        {
            key: '2',
            label: 'Transactions',
            children: <CustomerTransactions customer_id={customer_id} />,
        },
        {
            key: '3',
            label: 'Statement',
            children: <CustomerStatement customer_id={customer_id} />,
        },
    ];

    return (
        <>
            <div className='read__customer__header'>
                <div className='read__customer__header--left'>
                    <img src={backButton} alt='back' className='read__customer__header--back-btn' onClick={() => navigate("/customer")} />
                    <h1 className='read__customer__header--title'> Customers List </h1>
                </div>
                <div className='read__customer__header--right'>
                    <a className='read__customer__header--btn2' onClick={() => navigate(`/customer/edit/${customer?.customer_id}`)}>Edit</a>
                </div>
            </div>
            <div className="read__customer--main">
                <span className="read__customer--header">{customer?.customer_name}</span>
                <div className="read__customer--tabs">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
        </>
    );
};

export default CustomerRead;