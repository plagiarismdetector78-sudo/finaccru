import { Tooltip } from 'antd';
import { EyeOutlined, FileOutlined } from '@ant-design/icons';

import editIcon from '../assets/Icons/editIcon.svg';
// import deleteIcon from '../assets/Icons/deleteIcon.svg';

import moment from "moment";

export default function billColumns(showModal, navigate, role = 0, client_id = 0, jr_id = 0) {
    const columns = [
        {
            title: 'Staging ID',
            dataIndex: 'staging_bill_id',
            key: 'staging_bill_id',
            width: 120
        },
        {
            title: 'Bill Date',
            dataIndex: 'bill_date',
            key: 'bill_date',
            width: 120,
            render: (text, record) => (
                <span>{moment(record.bill_date).format('DD-MM-YYYY')}</span>
            )
        },
        {
            title: 'Bill Number',
            dataIndex: 'bill_number',
            key: 'bill_number',
            width: 130
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
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
            dataIndex: 'bill_status',
            key: 'bill_status',
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
            //     width: 150,
            //     align: 'right',
            //     render: (text, record) => (
            //         <div className="action__buttons">
            //             <div className="action__button" onClick={() => navigate(`/bill/view/${record.bill_id}`)}>
            //                 <Tooltip title="View" color='gray' placement="bottom">
            //                     <EyeOutlined />
            //                 </Tooltip>
            //             </div>
            //             {
            //                 record?.status === "Approved" ? "" :
            //                     record?.status === "Void" ?
            //                         <div className="action__button" onClick={() => showModal(record)}>
            //                             <Tooltip title="Delete" color='red' placement="bottom">
            //                                 <img src={deleteIcon} alt="deleteIcon" />
            //                             </Tooltip>
            //                         </div>
            //                         :
            //                         <>
            //                             <div className="action__button" onClick={() => navigate(`/bill/edit/${record.bill_id}`)} >
            //                                 <Tooltip title="Edit" color='blue' placement="bottom">
            //                                     <img src={editIcon} alt="editIcon" />
            //                                 </Tooltip>
            //                             </div>
            //                             <div className="action__button" onClick={() => showModal(record)}>
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
                <div className="action__buttons bills">
                    <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/bill/view/${record.staging_bill_id}?extracted=true`) : navigate(`/jr/${jr_id}/clients/${client_id}/bill/view/${record.staging_bill_id}?extracted=true`)}>
                        <Tooltip title="View" color='gray' placement="bottom">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    {
                        record?.bill_status === "Pending Approval" ?
                            <>
                                <div className="action__button" onClick={() => role === 1 ? navigate(`/clients/${client_id}/bill/edit/${record.staging_bill_id}?extracted=true`) : navigate(`/jr/${jr_id}/clients/${client_id}/bill/edit/${record.staging_bill_id}?extracted=true`)}>
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