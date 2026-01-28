import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    statsLoading: false,
    balanceLoading: false,

}

export const dashboardReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("DashboardStatsRequest", (state) => {
            state.statsLoading = true;
        })
        .addCase("DashboardStatsFailure", (state, action) => {
            state.statsLoading = false;
            state.error = action.payload;
        })
        .addCase("DashboardStatsSuccess", (state, action) => {
            state.statsLoading = false;
            state.stats = action.payload;
            state.error = null;
        })
        .addCase("DashboardBalanceRequest", (state) => {
            state.balanceLoading = true;
        })
        .addCase("DashboardBalanceFailure", (state, action) => {
            state.balanceLoading = false;
            state.error = action.payload;
        })
        .addCase("DashboardBalanceSuccess", (state, action) => {
            state.balanceLoading = false;
            state.balance = action.payload;
            state.error = null;
        })
});

