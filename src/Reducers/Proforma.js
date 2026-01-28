import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const proformaReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateProformaRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateProformaFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateProformaSuccess", (state, action) => {
        state.loading = false;
        state.proforma = action.payload;
        state.error = null;
    })
    .addCase("ProformaDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("ProformaDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ProformaDetailsSuccess", (state, action) => {
        state.loading = false;
        state.proforma = action.payload;
        state.error = null;
    })
    .addCase("ProformaListRequest", (state) => {
        state.loading = true;
    })
    .addCase("ProformaListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ProformaListSuccess", (state, action) => {
        state.loading = false;
        state.proformas = action.payload;
        state.error = null;
    })
    .addCase("ProformaDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("ProformaDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ProformaDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ProformaUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("ProformaUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ProformaUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ProformaMarkSentRequest", (state) => {
        state.loading = true;
    })
    .addCase("ProformaMarkSentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ProformaMarkSentSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ProformaMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("ProformaMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ProformaMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewProformaNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewProformaNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewProformaNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadProformaRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadProformaFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadProformaSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})

