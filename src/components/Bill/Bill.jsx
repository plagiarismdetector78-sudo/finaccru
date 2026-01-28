import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "../TaxInvoice/TaxInvoice.css";
import "../../Styles/MainPage.css";
import { Modal, Input, Divider } from 'antd';
import { ArrowRightOutlined, InboxOutlined, EyeOutlined } from '@ant-design/icons';
import errorIcon from '../../assets/Icons/error.svg';

import { deleteBill, downloadBillList, extractDataFromBill, getBillList, getExtractedBillList } from '../../Actions/Bill';
import billColumns from '../../Columns/Bill';
import TableCard from '../../Shared/TableCard/TableCard';

const Bill = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, bills, extractedBills } = useSelector(state => state.billReducer);

    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    useEffect(() => {
        dispatch(getBillList());
        dispatch(getExtractedBillList());
    }, [dispatch]);

    const [isCreateBillModalOpen, setIsCreateBillModalOpen] = useState(false);
    const [createBillByFile, setCreateBillByFile] = useState([]);
    const [createBillByFileError, setCreateBillByFileError] = useState([false, ""]);

    const handleFileUpload = (e) => {
        if (e.target.files[0].size > 5 * 1000 * 1024) {
            setCreateBillByFileError([true, "File size should be less than 5MB"]);
            setCreateBillByFile([]);
        } else if (e.target.files[0].type !== "application/pdf" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg") {
            setCreateBillByFileError([true, "File type should be pdf, png or jpeg"]);
            setCreateBillByFile([]);
        } else {
            setCreateBillByFile(e.target.files[0]);
            setCreateBillByFileError([false, ""]);
        }
    }

    const showModalCreateBill = () => {
        setIsCreateBillModalOpen(true);
    };
    const handleCancelCreateBill = () => {
        setIsCreateBillModalOpen(false);
        setCreateBillByFile([]);
        setCreateBillByFileError([false, ""])
    };

    const showModal = (record) => {
        setIsModalOpen(true);
        setRecord(record);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const showPendingModal = () => {
        dispatch(getExtractedBillList());
        setIsPendingModalOpen(true);
    };
    const handleCancelPending = () => {
        setIsPendingModalOpen(false);
        dispatch(getExtractedBillList());
    };

    const handleDelete = (id) => {
        dispatch(deleteBill(id));
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (searchText.length > 2) {
            dispatch(getBillList(1, searchText));
        }
        if (searchText.length === 0) {
            dispatch(getBillList());
        }
    }, [dispatch, searchText]);

    const columns = billColumns(showModal, navigate)

    const pendingColumns = [
        {
            title: 'Bill Date',
            dataIndex: 'bill_date',
            key: 'bill_date',
        },
        {
            title: 'Bill Number',
            dataIndex: 'bill_number',
            key: 'bill_number',
            render: (text, record) => (
                <div>
                    {record.bill_number === null ? record.staging_bill_id : record.bill_number}
                </div>
            ),
        },
        // {
        //     title: 'Vendor Name',
        //     dataIndex: 'vendor_name',
        //     key: 'vendor_name',
        // },
        // {
        //     title: 'Bill Status',
        //     dataIndex: 'bill_status',
        //     key: 'bill_status',
        // },
        {
            title: 'Document',
            dataIndex: 'attachment_url',
            key: 'attachment_url',
            align: 'center',
            render: (text, record) => (
                <div className="action__button" onClick={() => window.open(record.attachment_url)}>
                    <EyeOutlined />
                </div>
            ),
        },
    ];

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
                        <button id='confirm' onClick={() => handleDelete(record.bill_id)}>Delete</button>
                    </div>
                </div>
            </Modal>
            <div className='mainPage__header'>
                <div className='mainPage__header--left'>
                    <h1 className='mainPage__header--title'> Bills </h1>
                    <Input placeholder='Search' onChange={(e) => setSearchText(e.target.value)} value={searchText} />
                </div>
                <div className='mainPage__header--right'>
                    <a className='mainPage__header--btn1' onClick={() => dispatch(downloadBillList())}>Download</a>
                    <a onClick={showModalCreateBill} className='mainPage__header--btn2'>Create / Upload Bill</a>
                </div>
            </div>
            <Modal
                open={isCreateBillModalOpen}
                onCancel={handleCancelCreateBill}
                footer={null}
                width={400}
            >
                <div className='taxInvoice__create--modal'>
                    <form className='taxInvoice__modal--form'>
                        <input id="createBillByFile" type='file' name='createBillByFile'
                            onChange={(e) => handleFileUpload(e)}
                            hidden
                        />
                        <label className='create--modal-label' htmlFor="createBillByFile"><InboxOutlined /> UPLOAD</label>
                        <p id="create-tax-file-chosen">{createBillByFile.name || "No File Chosen"}</p>
                        {createBillByFileError[0] ?
                            <p style={{ fontSize: "0.8rem" }} className="phone__error--span">
                                {createBillByFileError[1]}
                            </p>
                            : <></>
                        }
                        <button className="taxInvoice__modal--btn2" onClick={(e) => {
                            e.preventDefault();
                            !createBillByFileError[0] && dispatch(extractDataFromBill(createBillByFile, navigate))
                            handleCancelCreateBill();
                            dispatch(getExtractedBillList());
                        }}>
                            Submit &nbsp;
                            <ArrowRightOutlined />
                        </button>
                    </form>
                    <Divider
                        style={{ borderColor: "black", opacity: "0.2", borderWidth: "1px" }}
                    />
                    <a className="taxInvoice__modal--btn1"
                        onClick={() => navigate("/bill/create")}
                    >
                        Create Manually &nbsp;
                        <ArrowRightOutlined />
                    </a>
                </div>
            </Modal>
            <Modal
                open={isPendingModalOpen}
                onCancel={handleCancelPending}
                footer={null}
                width={800}
                className='mainPage__list--delete--modal'
            >
                <h1>Pending Bills</h1>
                <br />
                <div className="table-scroll">
                <TableCard columns={pendingColumns} items={extractedBills} />
                </div>
            </Modal>
            <div className="table-container" style={{ overflowX: 'auto' }}>
            <div className="table">
                <div className='table--pending__tasks' onClick={showPendingModal}>
                    {
                        bills?.total_pending_items > 0 ? `${bills?.total_pending_items} Bills Pending` : ""
                    }
                </div>
                <div className="table-scroll">
                <TableCard columns={columns} dispatch={dispatch}
                    loading={loading} items={bills} getList={getBillList}
                    searchText={searchText}
                />
                </div>
            </div>
            </div>
        </>
    )
}

export default Bill;
