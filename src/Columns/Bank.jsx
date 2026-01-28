import {Tooltip} from 'antd';
import {EyeOutlined} from '@ant-design/icons';

import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

export default function bankingColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Bank ID',
            dataIndex: 'bank_id',
            key: 'bank_id',
            width: 150
        },
        {
            title: 'Bank',
            dataIndex: 'bank_name',
            key: 'bank_name',
        },
        {
            title: 'Account Number',
            dataIndex: 'account_number',
            key: 'account_number',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            width: 300,
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
                    <div className="action__button" onClick={() => navigate(`/bank/view/${record.bank_id}?type=bank`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined/>
                        </Tooltip>
                    </div>
                    <div className="action__button" onClick={() => navigate(`/bank/edit/${record.bank_id}?type=bank`)}>
                        <Tooltip title="Edit" color='blue' placement="bottom">
                            <img src={editIcon} alt="editIcon"/>
                        </Tooltip>
                    </div>
                    <div className="action__button" onClick={() => showModal(record)}>
                        <Tooltip title="Delete" color='red' placement="bottom">
                            <img src={deleteIcon} alt="deleteIcon"/>
                        </Tooltip>
                    </div>
                </div>
            ),
        });
    }
    return columns;
}