import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css";
import "../../components/CreditNote/CreditNote.css";
import { Modal, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import errorIcon from '../../assets/Icons/error.svg';

import { adjustDebitNoteAgainstInvoice, deleteDebitNote, downloadDebitNoteList, getDebitNoteList } from '../../Actions/DebitNote';
import { readOpenBillsForVendor } from '../../Actions/Bill';
import { getCurrency } from '../../Actions/Onboarding';

import debitNoteColumns from '../../Columns/DebitNote';
import TableCard from '../../Shared/TableCard/TableCard';

const DebitNote = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, debitNotes } = useSelector(state => state.debitNoteReducer);
    const { loading: billLoading, openBills } = useSelector(state => state.billReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getDebitNoteList());
    }, [dispatch]);

    const [billList, setBillList] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAsjustModalOpen, setIsAsjustModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteDebitNote(id));
        setIsModalOpen(false);
    }

    const showAdjustModal = (record) => {
        setRecord(record);
        setIsAsjustModalOpen(true);
        dispatch(readOpenBillsForVendor(record.vendor_id, record.currency_id));
    }

    const handleAdjustCancel = () => {
        setIsAsjustModalOpen(false);
        setRecord({});
        setBillList([]);
    }

    const handleAdjust = (id) => {
        dispatch(adjustDebitNoteAgainstInvoice(id, { bill_list: billList }));
        setIsAsjustModalOpen(false);
        setBillList([]);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getDebitNoteList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getDebitNoteList());
        }
    }, [dispatch, searchText]);

    const columns = debitNoteColumns(showModal, navigate, showAdjustModal, 0);
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
                        <button id='confirm' onClick={() => handleDelete(record.dn_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={isAsjustModalOpen}
                onCancel={handleAdjustCancel}
                footer={null}
                width={400}
                className='mainPage__list--delete--modal'
            >
                <div className='creditNote__adjustModal'>
                    <h1>Open Bills</h1>
                    {
                        openBills?.length > 0 ?
                            billLoading ? <LoadingOutlined /> :
                                openBills?.map((bill) => (
                                    <div className='creditNote__adjustModal-data' key={bill?.bill_id}>
                                        <div>
                                            <input
                                                className='margin-right-07'
                                                type="checkbox"
                                                checked={billList?.find((billId) => billId === bill?.bill_id) ? true : false}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setBillList((prev) => prev?.concat(bill?.bill_id));
                                                    }
                                                    else {
                                                        setBillList((prev) => prev.filter((billId) => billId !== bill?.bill_id));
                                                    }
                                                }}
                                            />
                                            <span>{bill?.bill_number}</span>
                                        </div>
                                        <span>
                                            {currencies?.find((currency) => currency.currency_id === bill?.currency_id)?.currency_abv} &nbsp;
                                            {bill?.balance_due}
                                        </span>
                                    </div>
                                )) :
                            <span className='no_data_present'>No open bills</span>
                    }
                    <div className="delete__modal__buttons">
                        <button id='cancel' onClick={handleAdjustCancel}>Cancel</button>
                        <button id='confirm' onClick={() => handleAdjust(record.cn_id)}>Adjust</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Debit Notes </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadDebitNoteList())}>Download</a>
                    <a onClick={() => navigate("/debit-note/create")} className='mainPage__header--btn2'>Create Debit Note </a>
                </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
                <TableCard columns={columns} dispatch={dispatch}
                    loading={loading} items={debitNotes} getList={getDebitNoteList}
                    searchText={searchText}
                />
            </div>
            </div>
        </>
    )
}

export default DebitNote;
