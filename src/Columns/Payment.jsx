import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import approveIcon from '../assets/Icons/approveIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function paymentColumns(showModal, navigate, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'receipt_date',
            key: 'receipt_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.receipt_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'Receipt No.',
            dataIndex: 'receipt_number',
            key: 'receipt_number',
            width: 130,
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
        },
        {
            title: 'Payment Mode',
            dataIndex: 'payment_mode',
            key: 'payment_mode',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
        },
    ];
    
    if (role === 0) {
        if (!navigate || !showModal) {
            return columns;
        } else {
            columns.push({
                title: 'Actions',
                key: 'actions',
                width: 150,
                align: 'right',
                render: (text, record) => (
                    <div className="action__buttons">
                        <div className="action__button" onClick={() => navigate(`/payment/view/${record.receipt_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.status === "Approved" ? "" :
                                record?.status === "Void" ?
                                    <div className="action__button" onClick={() => showModal(record)}>
                                        <Tooltip title="Delete" color='red' placement="bottom">
                                            <img src={deleteIcon} alt="deleteIcon" />
                                        </Tooltip>
                                    </div>
                                    :
                                    <>
                                        <div className="action__button" onClick={() => navigate(`/payment/edit/${record.receipt_id}`)} >
                                            <Tooltip title="Edit" color='blue' placement="bottom">
                                                <img src={editIcon} alt="editIcon" />
                                            </Tooltip>
                                        </div>
                                        <div className="action__button" onClick={() => showModal(record)}>
                                            <Tooltip title="Delete" color='red' placement="bottom">
                                                <img src={deleteIcon} alt="deleteIcon" />
                                            </Tooltip>
                                        </div>
                                    </>
                        }
                    </div>
                ),
            });
            return columns;
        }
    } else if (role === 1 || role === 2) {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 120,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons payments">
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/payment/view/${record.receipt_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/payment/view/${record.receipt_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Pending Approval" ?
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/payment/edit/${record.receipt_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/payment/edit/${record.receipt_id}`)}>
                                    <Tooltip title="Edit" color='blue' placement="bottom">
                                        <img src={editIcon} alt="editIcon" />
                                    </Tooltip>
                                </div>
                                <div className="action__button" onClick={() => { showModal(record) }}>
                                    <Tooltip title="Approve" color='green' placement="bottom">
                                        <img src={approveIcon} alt="approveIcon" />
                                    </Tooltip>
                                </div>
                            </> : ""
                    }
                </div>
            ),
        });
        return columns;
    } else {
        return [];
    }
}