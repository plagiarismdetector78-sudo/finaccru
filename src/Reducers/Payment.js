import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const paymentReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreatePaymentsRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreatePaymentsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreatePaymentsSuccess", (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.error = null;
    })
    .addCase("PaymentsDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("PaymentsDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PaymentsDetailsSuccess", (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.error = null;
    })
    .addCase("PaymentsListRequest", (state) => {
        state.loading = true;
    })
    .addCase("PaymentsListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PaymentsListSuccess", (state, action) => {
        state.loading = false;
        state.payments = action.payload;
        state.error = null;
    })
    .addCase("PaymentsDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("PaymentsDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PaymentsDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("PaymentsUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("PaymentsUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PaymentsUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("PaymentsMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("PaymentsMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("PaymentsMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewPaymentsNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewPaymentsNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewPaymentsNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadPaymentsRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadPaymentsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadPaymentsSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("SubmitPaymentsForApprovalRequest", (state) => {
        state.loading = true;
    })
    .addCase("SubmitPaymentsForApprovalFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("SubmitPaymentsForApprovalSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ReadOpenPaymentsForCustomerRequest", (state) => {
        state.loading = true;
    })
    .addCase("ReadOpenPaymentsForCustomerFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ReadOpenPaymentsForCustomerSuccess", (state, action) => {
        state.loading = false;
        state.openPayments = action.payload;
        state.error = null;
    })
    .addCase("ApprovePaymentsRequest", (state) => {
        state.loading = true;
    })
    .addCase("ApprovePaymentsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ApprovePaymentsSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})
