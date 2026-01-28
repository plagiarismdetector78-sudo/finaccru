import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    check: false,
    units: []
}

export const unitReducer = createReducer(initialState, (builder) => {

    builder
        .addCase("GetUnitRequest", (state) => {
            state.loading = true;
        })
        .addCase("GetUnitFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("GetUnitSuccess", (state, action) => {
            state.loading = false;
            state.units = action.payload;
            state.error = null;
        })
        .addCase("CreateUnitRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateUnitFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateUnitSuccess", (state, action) => {
            state.loading = false;
            state.check = action.payload;
            state.error = null;
        })
})
