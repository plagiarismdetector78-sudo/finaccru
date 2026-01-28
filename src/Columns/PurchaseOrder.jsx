import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function purchaseOrderColumns(showModal, navigate) {
    const columns = [
        {
            title: 'Order Date',
            dataIndex: 'order_date',
            key: 'order_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.order_date).format('DD-MM-YYYY')}</span>
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
            title: 'PO Number',
            dataIndex: 'po_number',
            key: 'po_number',
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
                    <div className="action__button" onClick={() => navigate(`/purchase-order/view/${record.po_id}`)}>
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
                                    <div className="action__button">
                                        <Tooltip title="Convert" color='green' placement="bottom" onClick={() => navigate(`/bill/create?convert=true&reference=purchase-order&reference_id=${record.po_id}`)}>
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => navigate(`/purchase-order/edit/${record.po_id}`)} >
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