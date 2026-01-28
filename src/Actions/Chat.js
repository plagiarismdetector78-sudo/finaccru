import axios from "axios";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { url, commonUrl } from "../data/url";

export const sendChatMessage =
    (data, role = 0, type = "1", id = "") =>
    async (dispatch) => {
        try {
            dispatch({ type: "SendChatMessageRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            let response;
            if (role === 0) {
                response = await axios.post(
                    `${commonUrl}/private/client/chats/create`,
                    data,
                    config
                );
            } else {
                if (type === "1") {
                    response = await axios.post(
                        `${commonUrl}/private/user/chats/create-internal-message`,
                        data,
                        config
                    );
                } else {
                    response = await axios.post(
                        `${commonUrl}/private/accountant/jr/create-message-for-client/${id}`,
                        data,
                        config
                    );
                }
            }
            dispatch({
                type: "SendChatMessageSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "SendChatMessageFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const markMessageAsRead =
    (role = 0, type = "1", id = "") =>
    async (dispatch) => {
        try {
            dispatch({ type: "MarkMessageAsReadRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            let response;
            if (role === 0) {
                response = await axios.put(
                    `${commonUrl}/private/client/chats/mark-read`,
                    {},
                    config
                );
            } else {
                if (type === "1") {
                    response = await axios.put(
                        `${commonUrl}/private/user/chats/mark-read/${id}`,
                        {},
                        config
                    );
                } else {
                    response = await axios.put(
                        `${commonUrl}/private/accountant/jr/mark-messages-read-for-client/${id}`,
                        {},
                        config
                    );
                }
            }
            dispatch({
                type: "MarkMessageAsReadSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "MarkMessageAsReadFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const openChatModal = () => async (dispatch) => {
    try {
        dispatch({ type: "OpenChatModal" });
    } catch (error) {
        // console.log(error);
    }
};

export const closeChatModal = () => async (dispatch) => {
    try {
        dispatch({ type: "CloseChatModal" });
    } catch (error) {
        // console.log(error);
    }
};

export const setChatDocument = (data) => async (dispatch) => {
    try {
        dispatch({ type: "SetChatDocument", payload: data });
    } catch (error) {
        // console.log(error);
    }
};
