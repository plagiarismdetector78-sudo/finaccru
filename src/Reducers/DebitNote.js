import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const debitNoteReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateDebitNoteRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateDebitNoteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateDebitNoteSuccess", (state, action) => {
        state.loading = false;
        state.debitNote = action.payload;
        state.error = null;
    })
    .addCase("DebitNoteDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("DebitNoteDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DebitNoteDetailsSuccess", (state, action) => {
        state.loading = false;
        state.debitNote = action.payload;
        state.error = null;
    })
    .addCase("DebitNoteListRequest", (state) => {
        state.loading = true;
    })
    .addCase("DebitNoteListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DebitNoteListSuccess", (state, action) => {
        state.loading = false;
        state.debitNotes = action.payload;
        state.error = null;
    })
    .addCase("DebitNoteDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("DebitNoteDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DebitNoteDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("DebitNoteUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("DebitNoteUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DebitNoteUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("DebitNoteMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("DebitNoteMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DebitNoteMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewDebitNoteNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewDebitNoteNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewDebitNoteNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadDebitNoteRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadDebitNoteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadDebitNoteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("SubmitDebitNoteForApprovalRequest", (state) => {
        state.loading = true;
    })
    .addCase("SubmitDebitNoteForApprovalFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("SubmitDebitNoteForApprovalSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ReadOpenDebitNotesForVendorRequest", (state) => {
        state.loading = true;
    })
    .addCase("ReadOpenDebitNotesForVendorFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ReadOpenDebitNotesForVendorSuccess", (state, action) => {
        state.loading = false;
        state.openDebitNotes = action.payload;
        state.error = null;
    })
    .addCase("ApproveDebitNoteRequest", (state) => {
        state.loading = true;
    })
    .addCase("ApproveDebitNoteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ApproveDebitNoteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})

