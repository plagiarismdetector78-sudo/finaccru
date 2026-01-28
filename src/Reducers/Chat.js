import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    open: false,
    document: null,
}

export const chatReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("SendChatMessageRequest", (state) => {
        state.loading = true;
    })
    .addCase("SendChatMessageFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("SendChatMessageSuccess", (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
    })

    .addCase("MarkMessageAsReadRequest", (state) => {
        // state.loading = true;
    })
    .addCase("MarkMessageAsReadFailure", (state, action) => {
        // state.loading = false;
        state.error = action.payload;
    })
    .addCase("MarkMessageAsReadSuccess", (state, action) => {
        // state.loading = false;
        state.message = action.payload;
        state.error = null;
    })
    .addCase("OpenChatModal", (state) => {
        state.open = true;
    })  
    .addCase("CloseChatModal", (state) => {
        state.open = false;
    })
    .addCase("SetChatDocument", (state, action) => {
        state.document = action.payload;
    })
    .addCase("RemoveChatDocument", (state) => {
        state.document = null;
    })
})
