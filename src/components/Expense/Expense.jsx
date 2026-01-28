import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css"
import { Modal, Input } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteExpense, downloadExpenseList, getExpenseList } from '../../Actions/Expense';
import expenseColumns from '../../Columns/Expense';
import TableCard from '../../Shared/TableCard/TableCard';

const Expense = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, expenses } = useSelector(state => state.expenseReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    useEffect(() => {
        dispatch(getExpenseList());
    }, [dispatch]);

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getExpenseList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getExpenseList());
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
        dispatch(deleteExpense(id));
        setIsModalOpen(false);
    }

    const columns = expenseColumns(showModal, navigate)
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
                        <button id='confirm' onClick={() => handleDelete(record.expense_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Expenses </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadExpenseList())}>Download</a>
                    <a onClick={() => navigate("/expense/create")} className='mainPage__header--btn2'>Create Expense </a>
                </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
            <div className="table-scroll">
                <TableCard columns={columns} dispatch={dispatch}
                    loading={loading} items={expenses} getList={getExpenseList}
                    searchText={searchText}
                />
            </div>
            </div>
            </div>
        </>
    )
}

export default Expense;
