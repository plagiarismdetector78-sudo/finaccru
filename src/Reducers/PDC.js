import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const pdcReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreatePDCRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreatePDCFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreatePDCSuccess", (state, action) => {
        state.loading = false;
        state.pdc = action.payload;
        state.error = null;
    })
    .addCase("PDCDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("PDCDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PDCDetailsSuccess", (state, action) => {
        state.loading = false;
        state.pdc = action.payload;
        state.error = null;
    })
    .addCase("PDCListRequest", (state) => {
        state.loading = true;
    })
    .addCase("PDCListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PDCListSuccess", (state, action) => {
        state.loading = false;
        state.pdcs = action.payload;
        state.error = null;
    })
    .addCase("PDCDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("PDCDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PDCDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("PDCUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("PDCUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PDCUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("DownloadPDCRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadPDCFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadPDCSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ReadPDCStatusListRequest", (state) => {
        state.pdcStatusLoading = true;
    })
    .addCase("ReadPDCStatusListFailure", (state, action) => {
        state.pdcStatusLoading = false;
        state.error = action.payload;
    })
    .addCase("ReadPDCStatusListSuccess", (state, action) => {
        state.pdcStatusLoading = false;
        state.statuses = action.payload;
        state.error = null;
    })
})

