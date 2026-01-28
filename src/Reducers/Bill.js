import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const billReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("CreateBillRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateBillFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateBillSuccess", (state, action) => {
            state.loading = false;
            state.bill = action.payload;
            state.error = null;
        })
        .addCase("BillDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("BillDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BillDetailsSuccess", (state, action) => {
            state.loading = false;
            state.bill = action.payload;
            state.error = null;
        })
        .addCase("BillListRequest", (state) => {
            state.loading = true;
        })
        .addCase("BillListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BillListSuccess", (state, action) => {
            state.loading = false;
            state.bills = action.payload;
            state.error = null;
        })
        .addCase("BillDeleteRequest", (state) => {
            state.loading = true;
        })
        .addCase("BillDeleteFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BillDeleteSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("BillUpdateRequest", (state) => {
            state.loading = true;
        })
        .addCase("BillUpdateFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BillUpdateSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("BillMarkVoidRequest", (state) => {
            state.loading = true;
        })
        .addCase("BillMarkVoidFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("BillMarkVoidSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("GetNewBillNumberRequest", (state) => {
            state.loading = true;
        })
        .addCase("GetNewBillNumberFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("GetNewBillNumberSuccess", (state, action) => {
            state.loading = false;
            state.number = action.payload;
            state.error = null;
        })
        .addCase("DownloadBillRequest", (state) => {
            state.loading = true;
        })
        .addCase("DownloadBillFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("DownloadBillSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ExtractDataFromBillRequest", (state) => {
            state.loading = true;
        })
        .addCase("ExtractDataFromBillFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ExtractDataFromBillSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("SubmitBillForApprovalRequest", (state) => {
            state.loading = true;
        })
        .addCase("SubmitBillForApprovalFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("SubmitBillForApprovalSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ReadOpenBillsForVendorRequest", (state) => {
            state.loading = true;
        })
        .addCase("ReadOpenBillsForVendorFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ReadOpenBillsForVendorSuccess", (state, action) => {
            state.loading = false;
            state.openBills = action.payload;
            state.error = null;
        })
        .addCase("ApproveBillRequest", (state) => {
            state.loading = true;
        })
        .addCase("ApproveBillFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ApproveBillSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ExtractedBillListRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ExtractedBillListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ExtractedBillListSuccess", (state, action) => {
            state.loading = false;
            state.extractedBills = action.payload;
            state.error = null;
        })
        .addCase("ExtractedBillDetailsRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ExtractedBillDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ExtractedBillDetailsSuccess", (state, action) => {
            state.loading = false;
            state.extractedBill = action.payload;
            state.error = null;
        })
        .addCase("ConvertStagingToBillRequest", (state, action) => {
            state.loading = true;
        })
        .addCase("ConvertStagingToBillFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ConvertStagingToBillSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })

})

