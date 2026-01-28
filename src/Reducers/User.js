import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    check: false,
    loading: true,
    otpLoading: false,
    authLoading: false,
    user: null,
    role: null,
    isUserTaxRegistered: false,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("CheckUserRequest", (state) => {
            state.authLoading = true;
        })
        .addCase("CheckUserFailure", (state, action) => {
            state.authLoading = false;
            state.error = action.payload;
        })
        .addCase("CheckUserSuccess", (state, action) => {
            state.authLoading = false;
            state.check = action.payload;
            state.error = null;
        })
        .addCase("LoginRequest", (state) => {
            state.authLoading = true;
        })
        .addCase("LoginFailure", (state, action) => {
            state.authLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("LoginSuccess", (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            state.role = action.payload.role;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase("SendOtpRequest", (state) => {
            state.otpauthLoading = true;
        })
        .addCase("SendOtpFailure", (state, action) => {
            state.otpauthLoading = false;
            state.error = action.payload;
        })
        .addCase("SendOtpSuccess", (state) => {
            state.otpauthLoading = false;
            state.error = null;
        })

        .addCase("ForgotPasswordRequest", (state) => {
            state.authLoading = true;
        })
        .addCase("ForgotPasswordFailure", (state, action) => {
            state.authLoading = false;
            state.error = action.payload;
        })
        .addCase("ForgotPasswordSuccess", (state) => {
            state.authLoading = false;
            state.error = null;
        })
        .addCase("ResetPasswordRequest", (state) => {
            state.authLoading = true;
        })
        .addCase("ResetPasswordFailure", (state, action) => {
            state.authLoading = false;
            state.error = action.payload;
        })
        .addCase("ResetPasswordSuccess", (state) => {
            state.authLoading = false;
            state.error = null;
        })
        .addCase("RegisterRequest", (state) => {
            state.authLoading = true;
        })
        .addCase("RegisterFailure", (state, action) => {
            state.authLoading = false;
            state.error = action.payload;
        })
        .addCase("RegisterSuccess", (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            state.role = action.payload.role;
            state.error = null;
        })
        .addCase("ResendEmailRequest", (state) => {
            state.authLoading = true;
        })
        .addCase("ResendEmailFailure", (state, action) => {
            state.authLoading = false;
            state.error = action.payload;
        })
        .addCase("ResendEmailSuccess", (state) => {
            state.authLoading = false;
            state.error = null;
        })
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.role = action.payload.role;
            state.isUserTaxRegistered = action.payload.isUserTaxRegistered;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase("LogoutRequest", (state) => {
            state.loading = true;
        })
        .addCase("LogoutFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("LogoutSuccess", (state) => {
            state.loading = false;
            state.user = null;
            state.role = null;
            state.isUserTaxRegistered = false;
            state.error = null;
            state.isAuthenticated = false;
        })
        .addCase("ConfirmEmailRequest", (state) => {
            state.check = false;
        })
        .addCase("ConfirmEmailFailure", (state, action) => {
            state.check = false;
            state.error = action.payload;
        })
        .addCase("ConfirmEmailSuccess", (state) => {
            state.check = true;
            state.error = null;
        })
        .addCase("ClearUserError", (state) => {
            state.error = null;
        });
});
