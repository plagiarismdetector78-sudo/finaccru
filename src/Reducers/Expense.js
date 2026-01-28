import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
}

export const expenseReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("CreateExpenseRequest", (state) => {
        state.loading = true;
    })
    .addCase("CreateExpenseFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("CreateExpenseSuccess", (state, action) => {
        state.loading = false;
        state.expense = action.payload;
        state.error = null;
    })
    .addCase("ExpenseDetailsRequest", (state) => {
        state.loading = true;
    })
    .addCase("ExpenseDetailsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ExpenseDetailsSuccess", (state, action) => {
        state.loading = false;
        state.expense = action.payload;
        state.error = null;
    })
    .addCase("ExpenseListRequest", (state) => {
        state.loading = true;
    })
    .addCase("ExpenseListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ExpenseListSuccess", (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.error = null;
    })
    .addCase("ExpenseDeleteRequest", (state) => {
        state.loading = true;
    })
    .addCase("ExpenseDeleteFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ExpenseDeleteSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ExpenseUpdateRequest", (state) => {
        state.loading = true;
    })
    .addCase("ExpenseUpdateFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ExpenseUpdateSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("DownloadExpenseRequest", (state) => {
        state.loading = true;
    })
    .addCase("DownloadExpenseFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("DownloadExpenseSuccess", (state, action) => {
        state.loading = false;
        state.success = action.payload;
        state.error = null;
    })
    .addCase("ReadExpenseCategoriesRequest", (state) => {
        state.categoryLoading = true;
    })
    .addCase("ReadExpenseCategoriesFailure", (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload;
    })
    .addCase("ReadExpenseCategoriesSuccess", (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
        state.error = null;
    })
})

