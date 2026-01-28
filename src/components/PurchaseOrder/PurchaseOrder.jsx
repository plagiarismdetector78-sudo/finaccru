import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css"
import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

import { deletePurchaseOrder, getPurchaseOrderList, downloadPurchaseOrderList } from '../../Actions/PurchaseOrder';
import purchaseOrderColumns from '../../Columns/PurchaseOrder';
import TableCard from '../../Shared/TableCard/TableCard';

const PurchaseOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, purchaseOrders } = useSelector(state => state.purchaseOrderReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    useEffect(() => {
        dispatch(getPurchaseOrderList());
    }, [dispatch]);

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getPurchaseOrderList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getPurchaseOrderList());
        }
    }, [dispatch, searchText]);

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deletePurchaseOrder(id));
        setIsModalOpen(false);
    }

    const columns = purchaseOrderColumns(showModal, navigate)
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
                        <button id='confirm' onClick={() => handleDelete(record.po_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Purchase Orders </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadPurchaseOrderList())}>Download</a>
                    <a onClick={() => navigate("/purchase-order/create")} className='mainPage__header--btn2'>Create Purchase Order</a>
                </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
            <div className="table-scroll">
                <TableCard columns={columns} dispatch={dispatch}
                    loading={loading} items={purchaseOrders} getList={getPurchaseOrderList}
                    searchText={searchText}
                />
            </div>
            </div>
            </div>
        </>
    )
}

export default PurchaseOrder;
