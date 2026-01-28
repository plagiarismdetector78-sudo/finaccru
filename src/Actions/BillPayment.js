import axios from "axios";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";

export const createBillPayment = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateBillPaymentRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(
            `${url}/private/client/bill-payments/create`,
            data,
            config
        );
        dispatch({ type: "CreateBillPaymentSuccess", payload: response.data });
        toast.success("Bill Payment created successfully");
        navigate("/bill-payment");
    } catch (err) {
        // // console.log(err);
        if (err.response?.status === 422) {
            // I will get an array of errs from the backend in details
            const errs = err.response.data.detail;
            // I will loop through the array and display the errs
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "CreateBillPaymentFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreateBillPaymentFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getBillPaymentDetails =
    (id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "BillPaymentDetailsRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bill-payments/read/${id}`,
                    config
                );
                dispatch({
                    type: "BillPaymentDetailsSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-bill-payment/${id}`,
                    config
                );
                dispatch({
                    type: "BillPaymentDetailsSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "BillPaymentDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getBillPaymentList =
    (
        page = 1,
        keyword = "",
        vendor_id = 0,
        role = 0,
        client_id = 0,
        showAll = false
    ) =>
    async (dispatch) => {
        try {
            dispatch({ type: "BillPaymentListRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bill-payments/read-list/${page}?keyword=${keyword}${
                        vendor_id !== 0 ? `&vendor_id=${vendor_id}` : ""
                    }`,
                    config
                );
                dispatch({
                    type: "BillPaymentListSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/read-bill-payments/${client_id}/${page}?show_all=${showAll}`,
                    config
                );
                dispatch({
                    type: "BillPaymentListSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "BillPaymentListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteBillPayment = (id) => async (dispatch) => {
    try {
        dispatch({ type: "BillPaymentDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(
            `${url}/private/client/bill-payments/delete/${id}`,
            config
        );
        dispatch({ type: "BillPaymentDeleteSuccess", payload: response.data });
        toast.success("Bill Payment deleted successfully");
        dispatch(getBillPaymentList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "BillPaymentDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateBillPayment =
    (id, data, navigate, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "BillPaymentUpdateRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.put(
                    `${url}/private/client/bill-payments/update/${id}`,
                    data,
                    config
                );
                dispatch({
                    type: "BillPaymentUpdateSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.put(
                    `${commonUrl}/private/accountant/update-bill-payment/${id}`,
                    data,
                    config
                );
                dispatch({
                    type: "BillPaymentUpdateSuccess",
                    payload: response.data,
                });
            }
            if (role === 0) navigate("/bill-payment/view/" + id);
            toast.success("Bill Payment updated successfully");
        } catch (err) {
            // // console.log(err);
            if (err.response?.status === 422) {
                // I will get an array of errs from the backend in details
                const errs = err.response.data.detail;
                // I will loop through the array and display the errs
                errs?.forEach((err) => {
                    toast.error(err.loc[1] + ": " + err.msg);
                });
                dispatch({
                    type: "BillPaymentUpdateFailure",
                    payload: err.response?.data || err.message,
                });
            } else {
                dispatch({
                    type: "BillPaymentUpdateFailure",
                    payload: err.response?.data || err.message,
                });
                toast.error(err.response?.data || err.message);
            }
        }
    };

export const markBillPaymentVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "BillPaymentMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(
            `${url}/private/client/bill-payments/mark-void/${id}`,
            {},
            config
        );
        dispatch({
            type: "BillPaymentMarkVoidSuccess",
            payload: response.data,
        });
        toast.success("Bill Payment marked as void successfully");
        dispatch(getBillPaymentDetails(id));
    } catch (err) {
        // // console.log(err);
        dispatch({
            type: "BillPaymentMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const getNewBillPaymentNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewBillPaymentNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${url}/private/client/bill-payments/read-new-payment-number`,
            config
        );
        dispatch({
            type: "GetNewBillPaymentNumberSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewBillPaymentNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadBillPaymentList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadBillPaymentListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: "blob",
        };
        const response = await axios.get(
            `${url}/private/client/bill-payments/download`,
            config
        );
        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "BillPaymentList.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch({
            type: "DownloadBillPaymentListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadBillPaymentListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const submitBillPaymentForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitBillPaymentForApprovalRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(
            `${url}/private/client/bill-payments/submit-for-approval/${id}`,
            {},
            config
        );
        dispatch({
            type: "SubmitBillPaymentForApprovalSuccess",
            payload: response.data,
        });
        toast.success("Bill Payment submitted for approval successfully");
        dispatch(getBillPaymentDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "SubmitBillPaymentForApprovalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

// export const extractDataFromBillPayment = (file, navigate) => async (dispatch) => {
//     try {
//         dispatch({ type: "ExtractDataFromBillPaymentRequest" });
//         const token = await auth.currentUser.getIdToken(true);
//         const form = new FormData();
//         form.append("invoice_file", file);
//         const config = {
//             headers: {
//                 token: token,
//             },
//         };
//         const response = await axios.post(`${url}/private/client/bill-payments/extract-data-from-invoice`, form, config);
//         navigate("/bill/create?file=true", { state: response.data });
//         dispatch({ type: "ExtractDataFromBillPaymentSuccess", payload: response.data });
//     } catch (error) {
//         // console.log(error);
//         dispatch({ type: "ExtractDataFromBillPaymentFailure", payload: error.response?.data || error.message });
//         toast.error(error.response?.data || error.message);
//     }
// }

export const readOpenBillPaymentsForVendor =
    (id, currency_id = 1, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ReadOpenBillPaymentsForVendorRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bill-payments/read-open-bill-payments-for-vendor/${id}?currency_id=${currency_id}`,
                    config
                );
                dispatch({
                    type: "ReadOpenBillPaymentsForVendorSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-open-bill-payments-for-vendor/${id}?currency_id=${currency_id}`,
                    config
                );
                dispatch({
                    type: "ReadOpenBillPaymentsForVendorSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadOpenBillPaymentsForVendorFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const approveBillPayment =
    (id, role = 1, client_id) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ApproveBillPaymentRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };

            const response = await axios.put(
                `${commonUrl}/private/accountant/${
                    role === 1 ? "jr" : "sr"
                }/approve-bill-payment/${id}`,
                {},
                config
            );
            dispatch({
                type: "ApproveBillPaymentSuccess",
                payload: response.data,
            });
            toast.success("Bill Payment approved successfully");
            dispatch(getBillPaymentList(1, "", 0, role, client_id));
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ApproveBillPaymentFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };
