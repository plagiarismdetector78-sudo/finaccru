import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../data/url";
import { getAuthConfig } from "../utils/authConfig";

export const getDashboardStats = (data) => async (dispatch) => {
    dispatch({ type: "DashboardStatsRequest" });
    try {
        const config = await getAuthConfig();

        const response = await axios.post(
            `${url}/private/client/dashboard/read-stats`,
            data,
            config
        );
        dispatch({ type: "DashboardStatsSuccess", payload: response.data });
    } catch (error) {
        dispatch({ type: "DashboardStatsFailure", payload: error });
        toast.error(error.response?.data || "Failed to fetch dashboard stats");
    }
};

export const getDashboardBalance = (data) => async (dispatch) => {
    dispatch({ type: "DashboardBalanceRequest" });
    try {
        const config = await getAuthConfig();

        const response = await axios.post(
            `${url}/private/client/dashboard/read-balance`,
            data,
            config
        );
        dispatch({ type: "DashboardBalanceSuccess", payload: response.data });
    } catch (error) {
        dispatch({ type: "DashboardBalanceFailure", payload: error });
        toast.error(
            error.response?.data || "Failed to fetch dashboard balance"
        );
    }
};
