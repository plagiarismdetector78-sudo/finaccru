import { EyeOutlined } from '@ant-design/icons';

import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

export default function vendorColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Vendor Name',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
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
            title: 'Amount Payable',
            dataIndex: 'amount_payable',
            key: 'amount_payable',
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
                    <div className="action__button" onClick={() => navigate(`/vendor/view/${record.vendor_id}`)}>
                        <EyeOutlined />
                    </div>
                    <div className="action__button" onClick={() => navigate(`/vendor/edit/${record.vendor_id}`)} >
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