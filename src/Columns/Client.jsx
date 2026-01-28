import { Tooltip } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';

export default function clientColumns(navigate, role = 1, jr_id = 0) {
    const columns = [
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contact_number',
            key: 'contact_number',
            width: 200,
        },
    ];
    
    if (role === 1) {
        columns.push({
            title: 'Pending Actions',
            dataIndex: 'pending_actions',
            key: 'pending_actions',
            align: 'right',
            width: 150,
        })
    } else if (role === 2) {
        columns.push({
            title: 'Jr. Accountant Pending Tasks',
            dataIndex: 'jr_accountant_pending_tasks',
            key: 'jr_accountant_pending_tasks',
            align: 'right'
        })
        columns.push({
            title: 'Your Pending Tasks',
            dataIndex: 'sr_accountant_pending_tasks',
            key: 'sr_accountant_pending_tasks',
            align: 'right'
        })
    }
    if (!navigate) {
        return columns;
    } else {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 120,
            align: 'right',
            render: (text, record) => (
                <div className="accountant__action__buttons">
                    <div className="accountant__action__button" onClick={() => role === 1 ? navigate(`/clients/${record.client_id}`) : navigate(`/jr/${jr_id}/clients/${record.client_id}`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    <div className="accountant__action__button small__button">
                        <Tooltip title="Chat" color='blue' placement="bottom">
                            <MessageOutlined onClick={() => navigate(`/chat?id=${record.client_id}&type=2`)} />
                        </Tooltip>
                    </div>
                </div>
            ),
        });

        return columns;
    }
}