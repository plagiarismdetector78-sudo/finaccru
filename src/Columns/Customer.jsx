import { EyeOutlined } from '@ant-design/icons';

import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

export default function customerColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Display Name',
            dataIndex: 'display_name',
            key: 'display_name',
        },
        {
            title: 'Contact Name',
            dataIndex: 'contact_name',
            key: 'contact_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 230,
        },
        {
            title: 'Amount Receivable',
            dataIndex: 'amount_receivable',
            key: 'amount_receivable',
            align: 'right',
        },
        {
            title: 'Active',
            key: 'is_active',
            width: 100,
            render: (text, record) => (
                <>
                    {record.is_active ? <p style={{ color: "green" }}>Active</p> : <p style={{ color: "red" }}>Inactive</p>}
                </>
            ),
        },
        
    ];
    if (!navigate || !showModal) {
        return columns;
    } else { 
        columns.push({
            title: 'Actions',
            key: 'actions',
            align: 'right',
            width: 120,
            render: (text, record) => (
                <div className="action__buttons">
                    <div className="action__button" onClick={() => navigate(`/customer/view/${record.customer_id}`)}>
                        <EyeOutlined />
                    </div>
                    <div className="action__button" onClick={() => navigate(`/customer/edit/${record.customer_id}`)} >
                        <img src={editIcon} alt="editIcon" />
                    </div>
                    <div className="action__button" onClick={() => showModal(record)}>
                        <img src={deleteIcon} alt="deleteIcon" />
                    </div>
                </div>
            ),
        });
        return columns;
    }
}