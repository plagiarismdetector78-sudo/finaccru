import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function estimateColumns(showModal, showConvertModal, navigate) {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'estimate_date',
            key: 'estimate_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.estimate_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'Estimate No.',
            dataIndex: 'estimate_number',
            key: 'estimate_number',
            width: 130,
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
            align: 'right',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
        },
    ];

    if (!navigate || !showModal || !showConvertModal) {
        return columns;
    } else {
        columns.push({
            title: 'Reference',
            key: 'related_document_number',
            align: 'left',
            width: 120,
            render: (text, record) => (
                <div className="action__button" onClick={() => {
                    if (record?.related_document_number.startsWith("PI")) {
                        navigate(`/proforma/view/${record.related_document_id}`)
                    } else if (record?.related_document_number.startsWith("INV")) {
                        navigate(`/tax-invoice/view/${record.related_document_id}`)
                    }
                }}>
                    {
                        record.related_document_number ? record.related_document_number : ""
                    }
                </div>
            ),
        });
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons">
                    <div className="action__button" onClick={() => navigate(`/estimate/view/${record.estimate_id}`)}>
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
                                        <Tooltip title="Convert" color='blue' placement="bottom" onClick={() => { showConvertModal(record) }}>
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => navigate(`/estimate/edit/${record.estimate_id}`)} >
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
        return columns;
    }
}