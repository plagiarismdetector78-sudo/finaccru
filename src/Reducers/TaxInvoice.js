import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const taxInvoiceReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("CreateTaxInvoiceRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateTaxInvoiceFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateTaxInvoiceSuccess", (state, action) => {
            state.loading = false;
            state.taxInvoice = action.payload;
            state.error = null;
        })
        .addCase("TaxInvoiceDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("TaxInvoiceDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("TaxInvoiceDetailsSuccess", (state, action) => {
            state.loading = false;
            state.taxInvoice = action.payload;
            state.error = null;
        })
        .addCase("TaxInvoiceListRequest", (state) => {
            state.loading = true;
        })
        .addCase("TaxInvoiceListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("TaxInvoiceListSuccess", (state, action) => {
            state.loading = false;
            state.taxInvoices = action.payload;
            state.error = null;
        })
        .addCase("TaxInvoiceDeleteRequest", (state) => {
            state.loading = true;
        })
        .addCase("TaxInvoiceDeleteFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("TaxInvoiceDeleteSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("TaxInvoiceUpdateRequest", (state) => {
            state.loading = true;
        })
        .addCase("TaxInvoiceUpdateFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("TaxInvoiceUpdateSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("TaxInvoiceMarkVoidRequest", (state) => {
            state.loading = true;
        })
        .addCase("TaxInvoiceMarkVoidFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("TaxInvoiceMarkVoidSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("GetNewTaxInvoiceNumberRequest", (state) => {
            state.loading = true;
        })
        .addCase("GetNewTaxInvoiceNumberFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("GetNewTaxInvoiceNumberSuccess", (state, action) => {
            state.loading = false;
            state.number = action.payload;
            state.error = null;
        })
        .addCase("DownloadTaxInvoiceRequest", (state) => {
            state.loading = true;
        })
        .addCase("DownloadTaxInvoiceFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("DownloadTaxInvoiceSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ExtractDataFromTaxInvoiceRequest", (state) => {
            state.loading = true;
        })
        .addCase("ExtractDataFromTaxInvoiceFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ExtractDataFromTaxInvoiceSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("SubmitTaxInvoiceForApprovalRequest", (state) => {
            state.loading = true;
        })
        .addCase("SubmitTaxInvoiceForApprovalFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("SubmitTaxInvoiceForApprovalSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ReadOpenTaxInvoicesForCustomerRequest", (state) => {
            state.loading = true;
        })
        .addCase("ReadOpenTaxInvoicesForCustomerFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ReadOpenTaxInvoicesForCustomerSuccess", (state, action) => {
            state.loading = false;
            state.openTaxInvoices = action.payload;
            state.error = null;
        })
        .addCase("AdjustCreditNoteAgainstInvoiceRequest", (state) => {
            state.loading = true;
        })
        .addCase("AdjustCreditNoteAgainstInvoiceFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("AdjustCreditNoteAgainstInvoiceSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ApproveTaxInvoiceRequest", (state) => {
            state.loading = true;
        })
        .addCase("ApproveTaxInvoiceFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ApproveTaxInvoiceSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ExtractedTaxInvoiceListRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ExtractedTaxInvoiceListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ExtractedTaxInvoiceListSuccess", (state, action) => {
            state.loading = false;
            state.extractedTaxInvoices = action.payload;
            state.error = null;
        })
        .addCase("ExtractedTaxInvoiceDetailsRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ExtractedTaxInvoiceDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ExtractedTaxInvoiceDetailsSuccess", (state, action) => {
            state.loading = false;
            state.extractedTaxInvoice = action.payload;
            state.error = null;
        })
        .addCase("ConvertStagingToTaxInvoiceRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ConvertStagingToTaxInvoiceFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ConvertStagingToTaxInvoiceSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })

})
