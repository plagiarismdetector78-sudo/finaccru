import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const billPaymentReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateBillPaymentRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateBillPaymentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateBillPaymentSuccess", (state, action) => {
        state.loading = false;
        state.billPayment = action.payload;
        state.error = null;
    })
    .addCase("BillPaymentDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("BillPaymentDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("BillPaymentDetailsSuccess", (state, action) => {
        state.loading = false;
        state.billPayment = action.payload;
        state.error = null;
    })
    .addCase("BillPaymentListRequest", (state) => {
        state.loading = true;
    })
    .addCase("BillPaymentListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("BillPaymentListSuccess", (state, action) => {
        state.loading = false;
        state.billPayments = action.payload;
        state.error = null;
    })
    .addCase("BillPaymentDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("BillPaymentDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("BillPaymentDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("BillPaymentUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("BillPaymentUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("BillPaymentUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("BillPaymentMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("BillPaymentMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("BillPaymentMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewBillPaymentNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewBillPaymentNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewBillPaymentNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadBillPaymentRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadBillPaymentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadBillPaymentSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ExtractDataFromBillPaymentRequest", (state) => {
        state.loading = true;
    })
    .addCase("ExtractDataFromBillPaymentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ExtractDataFromBillPaymentSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("SubmitBillPaymentForApprovalRequest", (state) => {
        state.loading = true;
    })
    .addCase("SubmitBillPaymentForApprovalFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("SubmitBillPaymentForApprovalSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ReadOpenBillPaymentsForVendorRequest", (state) => {
        state.loading = true;
    })
    .addCase("ReadOpenBillPaymentsForVendorFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ReadOpenBillPaymentsForVendorSuccess", (state, action) => {
        state.loading = false;
        state.openBillPayments = action.payload;
        state.error = null;
    })
    .addCase("ApproveBillPaymentRequest", (state) => {
        state.loading = true;
    })
    .addCase("ApproveBillPaymentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ApproveBillPaymentSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})

