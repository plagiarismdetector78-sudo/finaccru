import { Tooltip } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';

export default function JuniorAccountantColumns(navigate) {
    const columns = [
        {
            title: 'Accountant Name',
            dataIndex: 'accountant_name',
            key: 'accountant_name',
        },
        {
            title: 'Number of Clients',
            dataIndex: 'number_of_clients',
            key: 'number_of_clients',
            align: 'right',
            width: 150,
        },
        {
            title: 'Jr. Accountant Pending Tasks',
            dataIndex: 'jr_accountant_pending_tasks',
            key: 'jr_accountant_pending_tasks',
            align: 'right',
            width: 250,
        },
        {
            title: 'Your Pending Tasks',
            dataIndex: 'sr_accountant_pending_tasks',
            key: 'sr_accountant_pending_tasks',
            align: 'right',
            width: 200,
        },
        {
            title: 'Last Active',
            dataIndex: 'last_active',
            key: 'last_active',
            align: 'right',
            width: 200,
        },
    ];
    
    if (!navigate) {
        return columns;
    } else {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'right',
            render: (text, record) => (
                <div className="accountant__action__buttons">
                    <div className="accountant__action__button" onClick={() => navigate(`/jr/${record.accountant_id}`)} >
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    <div className="accountant__action__button small__button">
                        <Tooltip title="Chat" color='blue' placement="bottom">
                            <MessageOutlined onClick={() => navigate(`/chat?id=${record.accountant_id}&type=1`)} />
                        </Tooltip>
                    </div>
                </div>
            ),
        });

        return columns;
    }
}
