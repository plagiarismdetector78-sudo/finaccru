import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getVendorDetails } from "../../../Actions/Vendor";

import VendorDetails from "./Tabs/VendorDetails";
import VendorTransactions from "./Tabs/VendorTransactions";
import VendorStatement from "./Tabs/Statement/Statement";

import { Tabs } from 'antd';
import backButton from "../../../assets/Icons/back.svg";
import "./VendorRead.css";

const VendorRead = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const vendor_id = window.location.pathname.split('/')[3];
    const { loading, vendor } = useSelector(state => state.vendorReducer);

    useEffect(() => {
        dispatch(getVendorDetails(vendor_id));
    }, [dispatch, vendor_id])

    const items = [
        {
            key: '1',
            label: 'Details',
            children: <VendorDetails vendorId={vendor_id} />,
        },
        {
            key: '2',
            label: 'Transactions',
            children: <VendorTransactions vendor_id={vendor_id} />,
        },
        {
            key: '3',
            label: 'Statement',
            children: <VendorStatement vendor_id={vendor_id} />,
        },
    ];

    return (
        <>
            <div className='read__vendor__header'>
                <div className='read__vendor__header--left'>
                    <img src={backButton} alt='back' className='read__vendor__header--back-btn' onClick={() => navigate("/vendor")} />
                    <h1 className='read__vendor__header--title'> Vendors List </h1>
                </div>
                <div className='read__vendor__header--right'>
                    <a className='read__vendor__header--btn2' onClick={() => navigate(`/vendor/edit/${vendor?.vendor_id}`)}>Edit</a>
                </div>
            </div>
            <div className="read__vendor--main">
                <span className="read__vendor--header">{vendor?.vendor_name}</span>
                <div className="read__vendor--tabs">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
        </>
    );
};

export default VendorRead;
