import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import approveIcon from '../assets/Icons/approveIcon.svg';
import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function creditNoteColumns(showModal, navigate, showAdjustModal, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'CN Date',
            dataIndex: 'cn_date',
            key: 'cn_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.cn_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'CN Number',
            dataIndex: 'cn_number',
            key: 'cn_number',
            width: 130
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Amount (excl. VAT)',
            dataIndex: 'total_amount_excl_tax',
            key: 'total_amount_excl_tax',
            align: 'right'
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
                        <div className="action__button" onClick={() => navigate(`/credit-note/view/${record.cn_id}`)}>
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
                                        <div className="action__button" onClick={() => navigate(`/credit-note/edit/${record.cn_id}`)} >
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
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/credit-note/view/${record.cn_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/credit-note/view/${record.cn_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Pending Approval" ?
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/credit-note/edit/${record.cn_id}`) : navigate(`/jr/${jr_id}/clients/${client_id}/credit-note/edit/${record.cn_id}`)} >
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