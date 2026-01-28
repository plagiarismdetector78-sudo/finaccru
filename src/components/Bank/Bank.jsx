import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../../Styles/MainPage.css"
import { Modal, Input, Tabs } from 'antd';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteBank, downloadBankList, getBankList } from '../../Actions/Bank';
import { deletePDC, downloadPDCList, getPDCList } from '../../Actions/PDC';

import bankColumns from '../../Columns/Bank';
import bankPDCColumns from '../../Columns/BankPDC';
import TableCard from '../../Shared/TableCard/TableCard';

const Bank = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, banks } = useSelector(state => state.bankReducer);
    const { loading: pdcLoading, pdcs } = useSelector(state => state.pdcReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});
    const [tab, setTab] = useState(1);

    useEffect(() => {
        dispatch(getBankList());
        dispatch(getPDCList());
    }, [dispatch]);

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getBankList(1, searchText));
            dispatch(getPDCList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getBankList());
            dispatch(getPDCList());
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
        dispatch(deleteBank(id));
        setIsModalOpen(false);
    }

    const handleDeletePDC = (id) => {
        dispatch(deletePDC(id));
        setIsModalOpen(false);
    }

    const columns = bankColumns(showModal, navigate)
    const pdcColumns = bankPDCColumns(showModal, navigate)

    const items = [
        {
            key: '1',
            label: 'Banking',
            children: (
                <div className="table-scroll">
                    <TableCard
                        columns={columns}
                        dispatch={dispatch}
                        loading={loading}
                        items={banks}
                        getList={getBankList}
                        searchText={searchText}
                    />
                </div>
            ),
        },
        {
            key: '2',
            label: 'PDC',
            children: (
                <div className="table-scroll">
                    <TableCard
                        columns={pdcColumns}
                        dispatch={dispatch}
                        loading={pdcLoading}
                        items={pdcs}
                        getList={getPDCList}
                        searchText={searchText}
                    />
                </div>
            ),
        },
    ];
    const handleChangeTab = (key) => {
        setTab(key);
        setSearchText('');
    }

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
                        <button id='confirm' onClick={() => {
                            tab == 1 ? handleDelete(record.bank_id) : handleDeletePDC(record.pdc_id)
                        }}
                        >Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Banks </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => {
                        tab == 1 ? dispatch(downloadBankList()) : dispatch(downloadPDCList())
                    }}
                    >Download</a>
                    <a onClick={() => {
                        navigate(`/bank/create?type=${tab == 1 ? "bank" : "pdc"}`)
                    }}
                        className='mainPage__header--btn2'>
                        Add {tab == 1 ? "Bank" : "PDC"}
                    </a>
                </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
                <Tabs defaultActiveKey="1" items={items} onChange={handleChangeTab} />
            </div>
            </div>
        </>
    )
}

export default Bank;
