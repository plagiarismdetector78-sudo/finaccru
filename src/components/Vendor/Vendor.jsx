import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css";
import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteVendor, getVendorList } from '../../Actions/Vendor';
import vendorColumns from '../../Columns/Vendor';
import TableCard from '../../Shared/TableCard/TableCard';

const Vendor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { loading, vendors } = useSelector(state => state.vendorReducer);

    useEffect(() => {
        dispatch(getVendorList());
    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});
    
    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleDelete = (id) => {
        dispatch(deleteVendor(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getVendorList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getVendorList());
        }
    }, [dispatch, searchText]);

    const columns = vendorColumns(showModal, navigate);
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
                className='mainPage__list--delete--modal'
            >
                <div className='delete--modal'>
                    <img src={errorIcon} alt="error" />
                    <h1>Are you sure ?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.vendor_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Vendors </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a onClick={() => navigate("/vendor/create")} className='mainPage__header--btn2'>Create Vendor</a>
                </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
            <div className="table-scroll">
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={vendors} getList={getVendorList} searchText={searchText} />
            </div>
            </div>
            </div>
        </>
    )
}

export default Vendor;
