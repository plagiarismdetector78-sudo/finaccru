import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css";
import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteBillPayment, downloadBillPaymentList, getBillPaymentList } from '../../Actions/BillPayment';
import billPaymentColumns from '../../Columns/BillPayment';
import TableCard from '../../Shared/TableCard/TableCard';

const BillPayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, billPayments } = useSelector(state => state.billPaymentReducer);
    
    useEffect(() => {
        dispatch(getBillPaymentList());
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
        dispatch(deleteBillPayment(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getBillPaymentList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getBillPaymentList());
        }
    }, [searchText, dispatch]);

    const columns = billPaymentColumns(showModal, navigate);
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
                    <h1>Are you sure you?</h1>
                    <p>This action cannot be undone.</p>
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleDelete(record.payment_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Bill Payments </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadBillPaymentList())}>Download</a>
                    <a onClick={() => navigate("/bill-payment/create")} className='mainPage__header--btn2'>Create Bill Payment</a>
                </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch} loading={loading} items={billPayments} getList={getBillPaymentList} searchText={searchText} />
            </div>
            </div>
        </>
    )
}

export default BillPayment;
