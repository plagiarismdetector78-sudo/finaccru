export const IS_DEV = process.env.NODE_ENV === "development" ? true : false;

export const MAX_LENGTH = 150;

export const LOGIN_PAGE_REDIRECTION_TIME = 1000;

export const TAX_INVOICE_API_RECALL_TIME = 4000;

export const SHOW_CHAT_IN_SIDEBAR =
    import.meta.env?.VITE_SHOW_CHAT_IN_SIDEBAR === "true";

export const SHOW_PROFILE_IN_SIDEBAR =
    import.meta.env?.VITE_SHOW_PROFILE_IN_SIDEBAR === "true";

export const SHOW_TAX_INVOICE_FILE_UPLOAD_BUTTON =
    import.meta.env?.VITE_SHOW_TAX_INVOICE_FILE_UPLOAD_BUTTON === "true";

export const SHOW_SUBMIT_FOR_APPROVAL_BUTTON =
    import.meta.env?.VITE_SHOW_SUBMIT_FOR_APPROVAL_BUTTON === "true";

export const SHOW_STATUS_COLUMN_TAX_INVOICE =
    import.meta.env?.VITE_SHOW_STATUS_COLUMN_TAX_INVOICE === "true";

export const SHOW_DUMMY_DATA = import.meta.env?.VITE_SHOW_DUMMY_DATA === "true";

export const dummyCompanyData = {
    company_name: "Dummy Company Pvt. Ltd.",
    address_line_1: "123 Dummy Street",
    address_line_2: "Suite 456",
    address_line_3: "Business Tower",
    state: "Dummy State",
    country: "Dummyland",
    vat_trn: "DUMMY-VAT-123456",
    corporate_tax_trn: "DUMMY-CORP-TAX-789012",
};

export const pdfTemplates = [
    {
        title: "Modern Blue",

        url: "/assets/images/pdf-templates/templates/template-1.png",
        key: "template-1",
    },
    {
        title: "Elegant Black",
        url: "/assets/images/pdf-templates/templates/template-2.png",
        key: "template-2",
    },
    {
        title: "Plain White",
        url: "/assets/images/pdf-templates/templates/template-3.png",
        key: "template-3",
    },
    {
        title: "Classic Red",
        url: "/assets/images/pdf-templates/templates/template-4.png",
        key: "template-4",
    },
];
