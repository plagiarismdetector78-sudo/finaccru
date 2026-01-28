import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../data/url";
import { getAuthConfig } from "../utils/authConfig";

export const createProforma = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateProformaRequest" });
        const config = await getAuthConfig();
        const response = await axios.post(
            `${url}/private/client/proforma-invoices/create`,
            data,
            config
        );
        dispatch({ type: "CreateProformaSuccess", payload: response.data });
        toast.success("Proforma created successfully");
        navigate("/proforma");
    } catch (err) {
        // console.log(err);
        if (err.response?.status === 422) {
            const errs = err.response.data.detail;
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "CreateProformaFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreateProformaFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getProformaDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ProformaDetailsRequest" });
        const config = await getAuthConfig();
        const response = await axios.get(
            `${url}/private/client/proforma-invoices/read/${id}`,
            config
        );
        dispatch({ type: "ProformaDetailsSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ProformaDetailsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const getProformaList =
    (page = 1, keyword = "", customer_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ProformaListRequest" });
            const config = await getAuthConfig();
            const response = await axios.get(
                `${url}/private/client/proforma-invoices/read-list/${page}?keyword=${keyword}${
                    customer_id !== 0 ? `&customer_id=${customer_id}` : ""
                }`,
                config
            );
            dispatch({ type: "ProformaListSuccess", payload: response.data });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ProformaListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteProforma = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ProformaDeleteRequest" });
        const config = await getAuthConfig();
        const response = await axios.delete(
            `${url}/private/client/proforma-invoices/delete/${id}`,
            config
        );
        dispatch({ type: "ProformaDeleteSuccess", payload: response.data });
        toast.success("Proforma deleted successfully");
        dispatch(getProformaList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ProformaDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateProforma = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "ProformaUpdateRequest" });
        const config = await getAuthConfig();
        const response = await axios.put(
            `${url}/private/client/proforma-invoices/update/${id}`,
            data,
            config
        );
        dispatch({ type: "ProformaUpdateSuccess", payload: response.data });
        navigate("/proforma/view/" + id);
        toast.success("Proforma updated successfully");
    } catch (err) {
        // console.log(err);
        if (err.response?.status === 422) {
            // I will get an array of errs from the backend in details
            const errs = err.response.data.detail;
            // I will loop through the array and display the errs
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "ProformaUpdateFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "ProformaUpdateFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const markProformaSent = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ProformaMarkSentRequest" });
        const config = await getAuthConfig();
        const response = await axios.put(
            `${url}/private/client/proforma-invoices/mark-sent/${id}`,
            {},
            config
        );
        dispatch({ type: "ProformaMarkSentSuccess", payload: response.data });
        toast.success("Proforma marked as sent successfully");
        dispatch(getProformaDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "ProformaMarkSentFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const markProformaVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ProformaMarkVoidRequest" });
        const config = await getAuthConfig();
        const response = await axios.put(
            `${url}/private/client/proforma-invoices/mark-void/${id}`,
            {},
            config
        );
        dispatch({ type: "ProformaMarkVoidSuccess", payload: response.data });
        toast.success("Proforma marked as void successfully");
        dispatch(getProformaDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "ProformaMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const getNewProformaNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewProformaNumberRequest" });
        const config = await getAuthConfig();
        const response = await axios.get(
            `${url}/private/client/proforma-invoices/read-new-pi-number`,
            config
        );
        dispatch({
            type: "GetNewProformaNumberSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewProformaNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadProformaList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadProformaListRequest" });
        const config = await getAuthConfig();
        config.responseType = "blob";

        const response = await axios.get(
            `${url}/private/client/proforma-invoices/download`,
            config
        );

        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "ProformaList.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
            type: "DownloadProformaListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadProformaListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
