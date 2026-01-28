import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
}

export const bankReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("CreateBankRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateBankFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateBankSuccess", (state, action) => {
            state.loading = false;
            state.bank = action.payload;
            state.error = null;
        })
        .addCase("BankDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("BankDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BankDetailsSuccess", (state, action) => {
            state.loading = false;
            state.bank = action.payload;
            state.error = null;
        })
        .addCase("BankListRequest", (state) => {
            state.loading = true;
        })
        .addCase("BankListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BankListSuccess", (state, action) => {
            state.loading = false;
            state.banks = action.payload;
            state.error = null;
        })
        .addCase("BankDeleteRequest", (state) => {
            state.loading = true;
        })
        .addCase("BankDeleteFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BankDeleteSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("BankUpdateRequest", (state) => {
            state.loading = true;
        })
        .addCase("BankUpdateFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BankUpdateSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("DownloadBankRequest", (state) => {
            state.loading = true;
        })
        .addCase("DownloadBankFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("DownloadBankSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ReadBankStatementRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ReadBankStatementFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ReadBankStatementSuccess", (state, action) => {
            state.loading = false;
            state.bankStatement = action.payload;
            state.error = null;
        })
})

