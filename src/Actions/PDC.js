import axios from "axios";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";

export const createPDC = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreatePDCRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(
            `${url}/private/client/pdc/create`,
            data,
            config
        );
        dispatch({ type: "CreatePDCSuccess", payload: response.data });
        toast.success("PDC created successfully");
        navigate("/bank");
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
                type: "CreatePDCFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreatePDCFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getPDCDetails =
    (id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "PDCDetailsRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/pdc/read/${id}`,
                    config
                );
                dispatch({ type: "PDCDetailsSuccess", payload: response.data });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-pdc-receipt/${id}`,
                    config
                );
                dispatch({ type: "PDCDetailsSuccess", payload: response.data });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "PDCDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getPDCList =
    (
        page = 1,
        keyword = "",
        customer_id = 0,
        role = 0,
        client_id = 0,
        showAll = false
    ) =>
    async (dispatch) => {
        try {
            dispatch({ type: "PDCListRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/pdc/read-list/${page}?keyword=${keyword}${
                        customer_id !== 0 ? `&customer_id=${customer_id}` : ""
                    }`,
                    config
                );
                dispatch({ type: "PDCListSuccess", payload: response.data });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/read-receipts/${client_id}/${page}?show_all=${showAll}`,
                    config
                );
                dispatch({ type: "PDCListSuccess", payload: response.data });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "PDCListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deletePDC = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PDCDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(
            `${url}/private/client/pdc/delete/${id}`,
            config
        );
        dispatch({ type: "PDCDeleteSuccess", payload: response.data });
        toast.success("PDC deleted successfully");
        dispatch(getPDCList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "PDCDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updatePDC =
    (id, data, navigate, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "PDCUpdateRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.put(
                    `${url}/private/client/pdc/update/${id}`,
                    data,
                    config
                );
                dispatch({ type: "PDCUpdateSuccess", payload: response.data });
            } else {
                const response = await axios.put(
                    `${commonUrl}/private/accountant/update-pdc/${id}`,
                    data,
                    config
                );
                dispatch({ type: "PDCUpdateSuccess", payload: response.data });
            }
            toast.success("PDC updated successfully");
            if (role === 0) navigate("/bank/view/" + id + "?type=pdc");
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
                    type: "PDCUpdateFailure",
                    payload: err.response?.data || err.message,
                });
            } else {
                dispatch({
                    type: "PDCUpdateFailure",
                    payload: err.response?.data || err.message,
                });
                toast.error(err.response?.data || err.message);
            }
        }
    };

export const downloadPDCList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadPDCListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: "blob",
        };
        const response = await axios.get(
            `${url}/private/client/pdc/download`,
            config
        );
        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "PDCList.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadPDCListSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadPDCListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readPDCStatusList = () => async (dispatch) => {
    try {
        dispatch({ type: "ReadPDCStatusListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${commonUrl}/private/pdc-status-list`,
            config
        );
        dispatch({ type: "ReadPDCStatusListSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadPDCStatusListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
