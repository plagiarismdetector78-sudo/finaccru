import { Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import convertIcon from '../assets/Icons/convertIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';
import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function performaColumns(showModal, navigate) {
    const columns = [
        {
            title: 'PI Date',
            dataIndex: 'pi_date',
            key: 'pi_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.pi_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'PI Number',
            dataIndex: 'pi_number',
            key: 'pi_number',
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
        },
    ];

    if (!navigate || !showModal) {
        return columns;
    } else {
        columns.push({
            title: 'Reference',
            key: 'related_document_1_number',
            align: 'left',
            width: 120,
            render: (text, record) => (
                <>
                    <div className="action__button" onClick={() => {
                        if (record?.related_document_1_number.startsWith("EST")) {
                            navigate(`/estimate/view/${record.related_document_1_id}`)
                        }
                    }}>
                        {record.related_document_1_number ? record.related_document_1_number : ""}
                    </div>
                    <div className="action__button" onClick={() => {
                        if (record?.related_document_2_number.startsWith("INV")) {
                            navigate(`/tax-invoice/view/${record.related_document_2_id}`)
                        }
                    }}>
                        {record.related_document_2_number ? record.related_document_2_number : ""}
                    </div>
                </>
            ),
        });
        columns.push({ 
            title: 'Actions',
            key: 'actions',
            width: 150,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons">
                    <div className="action__button" onClick={() => navigate(`/proforma/view/${record.pi_id}`)}>
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
                                        <Tooltip title="Convert" color='green' placement="bottom" onClick={() => navigate(`/tax-invoice/create?convert=true&reference=proforma&reference_id=${record.pi_id}`)}>
                                            <img src={convertIcon} alt="convertIcon" />
                                        </Tooltip>
                                    </div>
                                    <div className="action__button" onClick={() => navigate(`/proforma/edit/${record.pi_id}`)} >
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