import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    customerLoading: false,
    taxInvoiceLoading: false,
    paymentLoading: false,
    creditNoteLoading: false,
}

export const accountantReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("ReadAccountantClientsListRequest", (state, action) => {
        state.loading = true;
    })
    .addCase("ReadAccountantClientsListSuccess", (state, action) => {
        state.loading = false;
        state.clients = action.payload;
    })
    .addCase("ReadAccountantClientsListFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ReadAccountantClientRequest", (state, action) => {
        state.loading = true;
    })
    .addCase("ReadAccountantClientSuccess", (state, action) => {
        state.loading = false;
        state.client = action.payload;
    })
    .addCase("ReadAccountantClientFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("ReadJrAccountantsRequest", (state, action) => {
        state.loading = true;
    })
    .addCase("ReadJrAccountantsSuccess", (state, action) => {
        state.loading = false;
        state.jr_accountants = action.payload;
    })
    .addCase("ReadJrAccountantsFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
});
