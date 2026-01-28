import { Tooltip } from 'antd';
import { EyeOutlined, FileOutlined } from '@ant-design/icons';

// import deleteIcon from '../assets/Icons/deleteIcon.svg';
import editIcon from '../assets/Icons/editIcon.svg';

import moment from "moment";

export default function extractedTaxInvoiceColumns(showModal, navigate, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'Staging ID',
            dataIndex: 'staging_id',
            key: 'staging_id',
            width: 120
        },
        {
            title: 'TI Date',
            dataIndex: 'ti_date',
            key: 'ti_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.ti_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'TI Number',
            dataIndex: 'ti_number',
            key: 'ti_number',
            width: 130
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Attachment',
            dataIndex: 'attachment_url',
            key: 'attachment_url',
            width: 120,
            align: "center",
            render: (text, record) => (
                <div className="action__button" onClick={() => window.open(record.attachment_url, "_blank")}>
                    <Tooltip title="View Attachment" color='gray' placement="bottom">
                        <FileOutlined />
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'ti_status',
            key: 'ti_status',
            width: 160
        },
    ];

    if (role === 0) {
        if (!navigate || !showModal) {
            return columns;
        } else {
            // columns.push({
            //     title: 'Actions',
            //     key: 'actions',
            //     width: 120,
            //     align: 'right',
            //     render: (text, record) => (
            //         <div className="action__buttons">
            //             <div className="action__button" onClick={() => navigate(`/tax-invoice/view/${record.ti_id}`)}>
            //                 <Tooltip title="View" color='gray' placement="bottom">
            //                     <EyeOutlined />
            //                 </Tooltip>
            //             </div>
            //             {
            //                 record?.status === "Approved" ? "" :
            //                     record?.status === "Void" ?
            //                         <div className="action__button" onClick={() => { showModal(record) }}>
            //                             <Tooltip title="Delete" color='red' placement="bottom">
            //                                 <img src={deleteIcon} alt="deleteIcon" />
            //                             </Tooltip>
            //                         </div>
            //                         :
            //                         <>
            //                             <div className="action__button" onClick={() => navigate(`/tax-invoice/edit/${record.ti_id}`)} >
            //                                 <Tooltip title="Edit" color='blue' placement="bottom">
            //                                     <img src={editIcon} alt="editIcon" />
            //                                 </Tooltip>
            //                             </div>
            //                             <div className="action__button" onClick={() => { showModal(record) }}>
            //                                 <Tooltip title="Delete" color='red' placement="bottom">
            //                                     <img src={deleteIcon} alt="deleteIcon" />
            //                                 </Tooltip>
            //                             </div>
            //                         </>
            //             }
            //         </div>
            //     ),
            // });
            // return columns;
            return [];
        }
    } else if (role === 1 || role === 2) {
        columns.push({
            title: 'Actions',
            key: 'actions',
            width: 120,
            align: 'right',
            render: (text, record) => (
                <div className="action__buttons tax-invoices">
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/tax-invoice/view/${record.staging_id}?extracted=true`) : navigate(`/jr/${jr_id}/clients/${client_id}/tax-invoice/view/${record.staging_id}?extracted=true`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.ti_status === "Pending Approval" ?
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/tax-invoice/edit/${record.staging_id}?extracted=true`) : navigate(`/jr/${jr_id}/clients/${client_id}/tax-invoice/edit/${record.staging_id}?extracted=true`)} >
                                    <Tooltip title="Edit" color='blue' placement="bottom">
                                        <img src={editIcon} alt="editIcon" />
                                    </Tooltip>
                                </div>
                            </> : ""
                    }
                </div>
            ),
        });
        return columns;
    } else {
        return [];
    }
}