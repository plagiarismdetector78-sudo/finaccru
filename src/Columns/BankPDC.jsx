import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function bankPDCColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Cheque Number',
            dataIndex: 'cheque_number',
            key: 'cheque_number',
        },
        {
            title: 'Issue Date',
            dataIndex: 'issue_date',
            key: 'issue_date',
            width: 120,
            render: (text, record) => (
                <span>{record.issue_date ? moment(record.issue_date).format('DD-MM-YYYY') : ''}</span>
            )
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            width: 120
        },
        {
            title: 'In Favour Of',
            dataIndex: 'in_favour_of',
            key: 'in_favour_of',
        },
        {
            title: 'Recipient Name',
            dataIndex: 'recipient_name',
            key: 'recipient_name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
        },
        {
            title: 'Status',
            dataIndex: 'pdc_status',
            key: 'pdc_status',
        },
        {
            title: 'Bank Name',
            dataIndex: 'bank_name',
            key: 'bank_name',
        },
    ];

    if (!navigate || !showModal) {
        return columns;
    } else {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 120,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons">
                    <div className="action__button" onClick={() => navigate(`/bank/view/${record.pdc_id}?type=pdc`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    <div className="action__button" onClick={() => navigate(`/bank/edit/${record.pdc_id}?type=pdc`)} >
                        <Tooltip title="Edit" color='blue' placement="bottom">
                            <img src={editIcon} alt="editIcon" />
                        </Tooltip>
                    </div>
                    <div className="action__button" onClick={() => showModal(record)}>
                        <Tooltip title="Delete" color='red' placement="bottom">
                            <img src={deleteIcon} alt="deleteIcon" />
                        </Tooltip>
                    </div>
                </div>
            ),
        });
    }
    return columns;
}