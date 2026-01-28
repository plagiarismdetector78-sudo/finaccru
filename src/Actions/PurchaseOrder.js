import axios from "axios";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { url } from "../data/url";

export const createPurchaseOrder = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreatePurchaseOrderRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(
            `${url}/private/client/purchase-orders/create`,
            data,
            config
        );
        dispatch({
            type: "CreatePurchaseOrderSuccess",
            payload: response.data,
        });
        dispatch({ type: "ClearExpectedDeliveryDate" });
        toast.success("Purchase Order created successfully");
        navigate("/purchase-order");
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
                type: "CreatePurchaseOrderFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreatePurchaseOrderFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getPurchaseOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PurchaseOrderDetailsRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${url}/private/client/purchase-orders/read/${id}`,
            config
        );
        dispatch({
            type: "PurchaseOrderDetailsSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "PurchaseOrderDetailsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const getPurchaseOrderList =
    (page = 1, keyword = "", vendor_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "PurchaseOrderListRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.get(
                `${url}/private/client/purchase-orders/read-list/${page}?keyword=${keyword}${
                    vendor_id !== 0 ? `&vendor_id=${vendor_id}` : ""
                }`,
                config
            );
            dispatch({
                type: "PurchaseOrderListSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "PurchaseOrderListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deletePurchaseOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PurchaseOrderDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(
            `${url}/private/client/purchase-orders/delete/${id}`,
            config
        );
        dispatch({
            type: "PurchaseOrderDeleteSuccess",
            payload: response.data,
        });
        toast.success("Purchase Order deleted successfully");
        dispatch(getPurchaseOrderList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "PurchaseOrderDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updatePurchaseOrder = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "PurchaseOrderUpdateRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(
            `${url}/private/client/purchase-orders/update/${id}`,
            data,
            config
        );
        dispatch({
            type: "PurchaseOrderUpdateSuccess",
            payload: response.data,
        });
        navigate("/purchase-order/view/" + id);
        toast.success("Purchase Order updated successfully");
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
                type: "PurchaseOrderUpdateFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "PurchaseOrderUpdateFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getNewPurchaseOrderNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewPurchaseOrderNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${url}/private/client/purchase-orders/read-new-po-number`,
            config
        );
        dispatch({
            type: "GetNewPurchaseOrderNumberSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewPurchaseOrderNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const markPurchaseOrderSent = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PurchaseOrderMarkSentRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(
            `${url}/private/client/purchase-orders/mark-sent/${id}`,
            {},
            config
        );
        dispatch({
            type: "PurchaseOrderMarkSentSuccess",
            payload: response.data,
        });
        toast.success("PurchaseOrder marked as sent successfully");
        dispatch(getPurchaseOrderDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "PurchaseOrderMarkSentFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const markPurchaseOrderVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "PurchaseOrderMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(
            `${url}/private/client/purchase-orders/mark-void/${id}`,
            {},
            config
        );
        dispatch({
            type: "PurchaseOrderMarkVoidSuccess",
            payload: response.data,
        });
        toast.success("Purchase Order marked as void successfully");
        dispatch(getPurchaseOrderDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "PurchaseOrderMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const downloadPurchaseOrderList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadPurchaseOrderListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: "blob",
        };
        const response = await axios.get(
            `${url}/private/client/purchase-orders/download`,
            config
        );
        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "PurchaseOrderList.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch({
            type: "DownloadPurchaseOrderListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadPurchaseOrderListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
