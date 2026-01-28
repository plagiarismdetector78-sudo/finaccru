import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const creditNoteReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateCreditNoteRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateCreditNoteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateCreditNoteSuccess", (state, action) => {
        state.loading = false;
        state.creditNote = action.payload;
        state.error = null;
    })
    .addCase("CreditNoteDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreditNoteDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreditNoteDetailsSuccess", (state, action) => {
        state.loading = false;
        state.creditNote = action.payload;
        state.error = null;
    })
    .addCase("CreditNoteListRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreditNoteListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreditNoteListSuccess", (state, action) => {
        state.loading = false;
        state.creditNotes = action.payload;
        state.error = null;
    })
    .addCase("CreditNoteDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreditNoteDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreditNoteDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("CreditNoteUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreditNoteUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreditNoteUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("CreditNoteMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreditNoteMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreditNoteMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewCreditNoteNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewCreditNoteNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewCreditNoteNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadCreditNoteRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadCreditNoteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadCreditNoteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("SubmitCreditNoteForApprovalRequest", (state) => {
        state.loading = true;
    })
    .addCase("SubmitCreditNoteForApprovalFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("SubmitCreditNoteForApprovalSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ReadOpenCreditNotesForCustomerRequest", (state) => {
        state.loading = true;
    })
    .addCase("ReadOpenCreditNotesForCustomerFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ReadOpenCreditNotesForCustomerSuccess", (state, action) => {
        state.loading = false;
        state.openCreditNotes = action.payload;
        state.error = null;
    })
    .addCase("ApproveCreditNoteRequest", (state) => {
        state.loading = true;
    })
    .addCase("ApproveCreditNoteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ApproveCreditNoteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})

