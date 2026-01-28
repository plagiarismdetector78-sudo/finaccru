import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function expenseColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Expense ID',
            dataIndex: 'expense_id',
            key: 'expense_id',
            width: 120
        },
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
        },
        {
            title: 'Expense Date',
            dataIndex: 'expense_date',
            key: 'expense_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.expense_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right'
        },
    ];

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
                    <div className="action__button" onClick={() => navigate(`/expense/view/${record.expense_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.status === "Converted" ? "" :
                            record?.status === "Void" ?
                                <div className="action__button" onClick={() => showModal(record)}>
                                    <Tooltip title="Delete" color='red' placement="bottom">
                                        <img src={deleteIcon} alt="deleteIcon" />
                                    </Tooltip>
                                </div>
                                :
                                <>
                                    <div className="action__button" onClick={() => navigate(`/expense/edit/${record.expense_id}`)} >
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
    }
    return columns;
}