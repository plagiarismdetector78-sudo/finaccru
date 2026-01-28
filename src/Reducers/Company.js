// Extended Company Reducer
const initialState = {
  companyDetails: {},
  primaryBankDetails: {},
  documents: {
    emirates_id_url: null,
    moa_url: null,
    vat_url: null,
    corporate_tax_certificate_url: null,
    passport_url: null,
    trade_licence_url: null,
    company_logo_url: null,
  },
  isCompanyDetailsEditable: false,
  isBankDetailsEditable: false,
  isDocumentsEditable: false,
  loading: false,
  error: null,
  user: {}
};

export const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_COMPANY_DETAILS":
    case "UPDATE_COMPANY_SUCCESS":
      return {
        ...state,
        companyDetails: action.payload,
        user: {
          ...state.user,
          clientInfo: {
            ...state.user.clientInfo,
            company_data: action.payload
          }
        },
        loading: false,
        error: null
      };
    case "SET_PRIMARY_BANK_DETAILS":
    case "UPDATE_BANK_SUCCESS":
      return {
        ...state,
        primaryBankDetails: action.payload,
        user: {
          ...state.user,
          clientInfo: {
            ...state.user.clientInfo,
            primary_bank: action.payload
          }
        },
        loading: false,
        error: null
      };
    case "SET_DOCUMENTS":
    case "UPDATE_DOCUMENTS_SUCCESS":
      return {
        ...state,
        documents: action.payload,
        user: {
          ...state.user,
          clientInfo: {
            ...state.user.clientInfo,
            ...action.payload
          }
        },
        loading: false,
        error: null
      };
    case "SET_COMPANY_DETAILS_EDITABLE":
      return {
        ...state,
        isCompanyDetailsEditable: action.payload
      };
    case "SET_BANK_DETAILS_EDITABLE":
      return {
        ...state,
        isBankDetailsEditable: action.payload
      };
    case "SET_DOCUMENTS_EDITABLE":
      return {
        ...state,
        isDocumentsEditable: action.payload
      };
    case "UPDATE_COMPANY_REQUEST":
    case "UPDATE_BANK_REQUEST":
    case "UPDATE_DOCUMENTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null
      };
    case "UPDATE_COMPANY_FAILURE":
    case "UPDATE_BANK_FAILURE":
    case "UPDATE_DOCUMENTS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
        companyDetails: action.payload.clientInfo?.company_data || {},
        primaryBankDetails: action.payload.clientInfo?.primary_bank || {},
        documents: {
          emirates_id_url: action.payload.clientInfo?.emirates_id_url,
          moa_url: action.payload.clientInfo?.moa_url,
          vat_url: action.payload.clientInfo?.vat_url,
          corporate_tax_certificate_url: action.payload.clientInfo?.corporate_tax_certificate_url,
          passport_url: action.payload.clientInfo?.passport_url,
          trade_licence_url: action.payload.clientInfo?.trade_licence_url,
          company_logo_url: action.payload.clientInfo?.company_logo_url,
        }
      };
    default:
      return state;
  }
};