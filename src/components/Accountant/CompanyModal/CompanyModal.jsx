

import React, { useState } from 'react';
import "./CompanyModal.css";
import { Modal, Input, Button, Upload } from 'antd';
import { PaperClipOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBank} from '../../../Actions/Bank'; 
import {updateCompanyDetails,updateDocumentDetails} from '../../../Actions/Onboarding';


const CompanyModal = ({ isCompanyModalOpen, handleCompanyCancel, clientData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isCompanyDetailsEditable, setIsCompanyDetailsEditable] = useState(false);
    const [isBankDetailsEditable, setIsBankDetailsEditable] = useState(false);
    const [isDocumentsEditable, setIsDocumentsEditable] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(clientData?.company_data || {});
    const [primaryBankDetails, setPrimaryBankDetails] = useState(clientData?.primary_bank || {});
    const [documents, setDocuments] = useState({
        emirates_id_url: clientData?.emirates_id_url,
        moa_url: clientData?.moa_url,
        vat_url: clientData?.vat_url,
        corporate_tax_certificate_url: clientData?.corporate_tax_certificate_url,
        passport_url: clientData?.passport_url,
        trade_licence_url: clientData?.trade_licence_url,
        company_logo_url: clientData?.company_logo_url,
    });

    const handleEditToggle = (section) => {
        switch (section) {
            case 'companyDetails':
                if (isCompanyDetailsEditable) {
                    dispatch(updateCompanyDetails(companyDetails));
                }
                setIsCompanyDetailsEditable(!isCompanyDetailsEditable);
                break;
            case 'bankDetails':
                if (isBankDetailsEditable) {
                    const bankId = clientData?.primary_bank?.bank_id; // Assuming bank ID is available in clientData
                    dispatch(updateBank(primaryBankDetails, bankId,null,navigate));
                }
                setIsBankDetailsEditable(!isBankDetailsEditable);
                break;
            case 'documents':
                if (isDocumentsEditable) {
                    dispatch(updateDocumentDetails(documents));
                }
                setIsDocumentsEditable(!isDocumentsEditable);
                break;
            default:
                break;
        }
    };
    const handleInputChange = (section, field, value) => {
        switch (section) {
            case 'companyDetails':
                setCompanyDetails({ ...companyDetails, [field]: value });
                break;
            case 'bankDetails':
                setPrimaryBankDetails({ ...primaryBankDetails, [field]: value });
                break;
            case 'documents':
                setDocuments({ ...documents, [field]: value });
                break;
            default:
                break;
        }
    };
    const renderEditButton = (section, isEditable) => (
        <Button
            icon={isEditable ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => handleEditToggle(section)}
            style={{ position: 'absolute', right: 10 }}
        >
            {isEditable ? 'Save' : 'Edit'}
        </Button>
    );
    const renderSection = (sectionData, sectionName, fields, isEditable, sectionKey) => {
        if (!sectionData) return null;
        return (
            <div className="company__modal" style={{ position: 'relative' }}>
                <span className='company__modal--header'>{sectionName}</span>
                <div className="company__modal--data">
                    <div className="company__modal--left">
                        {fields.slice(0, Math.ceil(fields.length / 2)).map(field => (
                            (sectionData[field] || isEditable) && (
                                <div className="company__modal--input" key={field}>
                                    <span>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                    {isEditable ? (
                                        <Input value={sectionData[field] || ''} onChange={(e) => handleInputChange(sectionKey, field, e.target.value)} />
                                    ) : (
                                        <p>{sectionData[field]}</p>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                    <div className="company__modal--right">
                        {fields.slice(Math.ceil(fields.length / 2)).map(field => (
                            (sectionData[field] || isEditable) && (
                                <div className="company__modal--input" key={field}>
                                    <span>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                    {isEditable ? (
                                        <Input value={sectionData[field] || ''} onChange={(e) => handleInputChange(sectionKey, field, e.target.value)} />
                                    ) : (
                                        <p>{sectionData[field]}</p>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
                {renderEditButton(sectionKey, isEditable)}
            </div>
        );
    };

    const renderDocumentsSection = () => {
        // Filter out fields that are undefined or empty strings
        const fields = Object.keys(documents).filter(field => {
            return documents[field] !== undefined && documents[field] !== '' && documents[field] !== null;
        });

        if (fields.length === 0) return null;
    
        return (
            <div className="company__modal" style={{ position: 'relative' }}>
                <span className='company__modal--header'>Company Documents</span>
                <div className="company__modal--data">
                    <div className="company__modal--left">
                        {fields.slice(0, Math.ceil(fields.length / 2)).map(field => (
                            (documents[field] || isDocumentsEditable) && (
                                <div className="company__modal--links" key={field}>
                                    <span>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                    {isDocumentsEditable ? (
                                        <Upload
                                            beforeUpload={file => {
                                                handleInputChange('documents', field, URL.createObjectURL(file));
                                                return false;
                                            }}
                                            showUploadList={false}
                                        >
                                            <Button icon={<PaperClipOutlined />}>Upload</Button>
                                        </Upload>
                                    ) : (
                                        documents[field] && (
                                            <Link to={documents[field]} target="_blank">
                                                <PaperClipOutlined />
                                            </Link>
                                        )
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                    <div className="company__modal--right">
                        {fields.slice(Math.ceil(fields.length / 2)).map(field => (
                            (documents[field] || isDocumentsEditable) && (
                                <div className="company__modal--links" key={field}>
                                    <span>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                    {isDocumentsEditable ? (
                                        <Upload
                                            beforeUpload={file => {
                                                handleInputChange('documents', field, URL.createObjectURL(file));
                                                return false;
                                            }}
                                            showUploadList={false}
                                        >
                                            <Button icon={<PaperClipOutlined />}>Upload</Button>
                                        </Upload>
                                    ) : (
                                        documents[field] && (
                                            <Link to={documents[field]} target="_blank">
                                                <PaperClipOutlined />
                                            </Link>
                                        )
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
                {renderEditButton('documents', isDocumentsEditable)}
            </div>
        );
    };
    
    return (
        <Modal
            open={isCompanyModalOpen}
            onCancel={handleCompanyCancel}
            footer={null}
            width={900}
            style={{ top: 15 }}
            className='company__modal'
        >
            <>
                {renderSection(companyDetails, 'Company Details', ['company_name', 'company_type_name', 'trade_license_number', 'email', 'telephone_number', 'industry', 'address_line_1', 'address_line_2', 'address_line_3', 'state', 'country', 'po_box'], isCompanyDetailsEditable, 'companyDetails')}
                {renderSection(primaryBankDetails, 'Primary Bank Details', ['bank_name', 'account_number', 'iban_number', 'account_holder_name', 'branch_name', 'currency_abv'], isBankDetailsEditable, 'bankDetails')}
                {renderDocumentsSection()}
            </>
        </Modal>
    );
}
export default CompanyModal;