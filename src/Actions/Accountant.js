import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl } from "../data/url";
import { auth } from "../firebase";

export const readAccountantClientsList =
    (type = "jr", jr_accountant_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ReadAccountantClientsListRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            if (type === "jr") {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/jr/read-clients`,
                    config
                );
                dispatch({
                    type: "ReadAccountantClientsListSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/sr/read-clients-for-jr-accountant/${jr_accountant_id}`,
                    config
                );
                dispatch({
                    type: "ReadAccountantClientsListSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadAccountantClientsListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const readAccountantClient = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ReadAccountantClientRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.get(
            `${commonUrl}/private/accountant/read-client-details/${id}`,
            config
        );
        dispatch({
            type: "ReadAccountantClientSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadAccountantClientFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readJrAccountants = () => async (dispatch) => {
    try {
        dispatch({ type: "ReadJrAccountantsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.get(
            `${commonUrl}/private/accountant/sr/read-jr-accountants`,
            config
        );
        dispatch({ type: "ReadJrAccountantsSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadJrAccountantsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
