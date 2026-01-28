import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const estimateReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateEstimateRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateEstimateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateEstimateSuccess", (state, action) => {
        state.loading = false;
        state.estimate = action.payload;
        state.error = null;
    })
    .addCase("EstimateDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("EstimateDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("EstimateDetailsSuccess", (state, action) => {
        state.loading = false;
        state.estimate = action.payload;
        state.error = null;
    })
    .addCase("EstimateListRequest", (state) => {
        state.loading = true;
    })
    .addCase("EstimateListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("EstimateListSuccess", (state, action) => {
        state.loading = false;
        state.estimates = action.payload;
        state.error = null;
    })
    .addCase("EstimateDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("EstimateDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("EstimateDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("EstimateUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("EstimateUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("EstimateUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("EstimateMarkSentRequest", (state) => {
        state.loading = true;
    })
    .addCase("EstimateMarkSentFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("EstimateMarkSentSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("EstimateMarkVoidRequest", (state) => {
        state.loading = true;
    })
    .addCase("EstimateMarkVoidFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("EstimateMarkVoidSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("GetNewEstimateNumberRequest", (state) => {
        state.loading = true;
    })
    .addCase("GetNewEstimateNumberFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("GetNewEstimateNumberSuccess", (state, action) => {
        state.loading = false;
        state.number = action.payload;
        state.error = null;
    })
    .addCase("DownloadEstimateRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadEstimateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadEstimateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
})

