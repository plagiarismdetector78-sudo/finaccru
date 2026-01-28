import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import approveIcon from '../assets/Icons/approveIcon.svg';
import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function debitNoteColumns(showModal, navigate, showAdjustModal, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'DN Number',
            dataIndex: 'dn_number',
            key: 'dn_number',
            width: 130
        },
        {
            title: 'DN Date',
            dataIndex: 'dn_date',
            key: 'dn_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.dn_date).format('DD-MM-YYYY')}</span>
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
        if (!navigate || !showModal || !showAdjustModal) {
            return columns;
        } else {
            columns.push({
                title: 'Actions',
                key: 'actions',
                width: 150,
                align: 'right',
                render: (text, record) => (
                    <div className="action__buttons">
                        <div className="action__button" onClick={() => navigate(`/debit-note/view/${record.dn_id}`)}>
                            <Tooltip title="View" color='gray' placement="bottom">
                                <EyeOutlined />
                            </Tooltip>
                        </div>
                        {
                            record?.status === "Approved" ?
                                <div className="action__button" onClick={() => showAdjustModal(record)} >
                                    <Tooltip title="Adjust" color='blue' placement="bottom">
                                        <img src={convertIcon} alt="convert" />
                                    </Tooltip>
                                </div>
                                : record?.status === "Void" ?
                                    <div className="action__button" onClick={() => { showModal(record) }}>
                                        <Tooltip title="Delete" color='red' placement="bottom">
                                            <img src={deleteIcon} alt="deleteIcon" />
                                        </Tooltip>
                                    </div>
                                    :
                                    <>
                                        <div className="action__button" onClick={() => navigate(`/debit-note/edit/${record.dn_id}`)} >
                                            <Tooltip title="Edit" color='blue' placement="bottom">
                                                <img src={editIcon} alt="editIcon" />
                                            </Tooltip>
                                        </div>
                                        <div className="action__button" onClick={() => { showModal(record) }}>
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
                <div className="action__buttons credit-notes">
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/debit-note/view/${record.dn_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/debit-note/view/${record.dn_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Pending Approval" ?
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/debit-note/edit/${record.dn_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/debit-note/edit/${record.dn_id}`)} >
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