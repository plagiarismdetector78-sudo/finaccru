import { Tooltip } from 'antd';
import { EyeOutlined, FilePdfOutlined } from '@ant-design/icons';

import approveIcon from '../assets/Icons/approveIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function billColumns(showModal, navigate, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'Bill Date',
            dataIndex: 'bill_date',
            key: 'bill_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.bill_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'Expected Date',
            dataIndex: 'expected_delivery_date',
            key: 'expected_delivery_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.expected_delivery_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'Bill Number',
            dataIndex: 'bill_number',
            key: 'bill_number',
            width: 130
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160
        },
    ];

    if (role === 0) {
        if (!navigate || !showModal) {
            return columns;
        } else {
            columns.push({
                title: 'Reference',
                key: 'related_document_number',
                align: 'left',
                width: 120,
                render: (text, record) => (
                    <div className="action__button" onClick={() => {
                        if (record?.related_document_number.startsWith("PO")) {
                            navigate(`/purchase-order/view/${record.related_document_id}`)
                        }
                    }}>
                        {
                            record.related_document_number ? record.related_document_number : ""
                        }
                    </div>
                ),
            });
            columns.push({
                title: 'Actions',
                key: 'actions',
                width: 140,
                align: 'right',
                render: (text, record) => (
                    <div className="action__buttons">
                        <div className="action__button" onClick={() => navigate(`/bill/view/${record.bill_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.attachment_url ? (
                                <div className="action__button" onClick={() => window.open(record.attachment_url)}>
                                    <Tooltip title="Download" color='gray' placement="bottom">
                                        <FilePdfOutlined />
                                    </Tooltip>
                                </div>
                            ) : ""
                        }
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
                                        <div className="action__button" onClick={() => navigate(`/bill/edit/${record.bill_id}`)} >
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
                <div className="action__buttons bills">
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/bill/view/${record.bill_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/bill/view/${record.bill_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Pending Approval" ?
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/bill/edit/${record.bill_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/bill/edit/${record.bill_id}`)}>
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