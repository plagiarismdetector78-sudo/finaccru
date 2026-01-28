import axios from "axios";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";

export const createBill = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateBillRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(
            `${url}/private/client/bills/create`,
            data,
            config
        );
        dispatch({ type: "CreateBillSuccess", payload: response.data });
        toast.success("Bill created successfully");
        navigate("/bill");
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
                type: "CreateBillFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreateBillFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getBillDetails =
    (id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "BillDetailsRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bills/read/${id}`,
                    config
                );
                dispatch({
                    type: "BillDetailsSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-bill/${id}`,
                    config
                );
                dispatch({
                    type: "BillDetailsSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "BillDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getBillList =
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
            dispatch({ type: "BillListRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bills/read-list/${page}?keyword=${keyword}${
                        vendor_id !== 0 ? `&vendor_id=${vendor_id}` : ""
                    }`,
                    config
                );
                dispatch({ type: "BillListSuccess", payload: response.data });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/read-bills/${client_id}/${page}?show_all=${showAll}`,
                    config
                );
                dispatch({ type: "BillListSuccess", payload: response.data });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "BillListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteBill = (id) => async (dispatch) => {
    try {
        dispatch({ type: "BillDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(
            `${url}/private/client/bills/delete/${id}`,
            config
        );
        dispatch({ type: "BillDeleteSuccess", payload: response.data });
        toast.success("Bill deleted successfully");
        dispatch(getBillList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "BillDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateBill =
    (id, data, navigate, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "BillUpdateRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.put(
                    `${url}/private/client/bills/update/${id}`,
                    data,
                    config
                );
                dispatch({ type: "BillUpdateSuccess", payload: response.data });
            } else {
                const response = await axios.put(
                    `${commonUrl}/private/accountant/update-bill/${id}`,
                    data,
                    config
                );
                dispatch({ type: "BillUpdateSuccess", payload: response.data });
            }
            if (role === 0) navigate("/bill/view/" + id);
            toast.success("Bill updated successfully");
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
                    type: "BillUpdateFailure",
                    payload: err.response?.data || err.message,
                });
            } else {
                dispatch({
                    type: "BillUpdateFailure",
                    payload: err.response?.data || err.message,
                });
                toast.error(err.response?.data || err.message);
            }
        }
    };

export const markBillVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "BillMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(
            `${url}/private/client/bills/mark-void/${id}`,
            {},
            config
        );
        dispatch({ type: "BillMarkVoidSuccess", payload: response.data });
        toast.success("Bill marked as void successfully");
        dispatch(getBillDetails(id));
    } catch (err) {
        // // console.log(err);
        dispatch({
            type: "BillMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const getNewBillNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewBillNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${url}/private/client/bills/read-new-bill-number`,
            config
        );
        dispatch({ type: "GetNewBillNumberSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewBillNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadBillList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadBillListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: "blob",
        };
        const response = await axios.get(
            `${url}/private/client/bills/download`,
            config
        );
        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "BillList.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "DownloadBillListSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadBillListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const submitBillForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitBillForApprovalRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(
            `${url}/private/client/bills/submit-for-approval/${id}`,
            {},
            config
        );
        dispatch({
            type: "SubmitBillForApprovalSuccess",
            payload: response.data,
        });
        toast.success("Bill submitted for approval successfully");
        dispatch(getBillDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "SubmitBillForApprovalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const extractDataFromBill = (file, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "ExtractDataFromBillRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const form = new FormData();
        form.append("bill_file", file);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(
            `${url}/private/client/bills/extract-data-from-bill`,
            form,
            config
        );
        dispatch(getBillList());
        dispatch({
            type: "ExtractDataFromBillSuccess",
            payload: response.data,
        });
        toast.success("BIll uploaded successfully");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ExtractDataFromBillFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readOpenBillsForVendor =
    (id, currency_id = 1, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ReadOpenBillsForVendorRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bills/read-open-bills-for-vendors/${id}?currency_id=${currency_id}`,
                    config
                );
                dispatch({
                    type: "ReadOpenBillsForVendorSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-open-bills-for-vendor/${id}?currency_id=${currency_id}`,
                    config
                );
                dispatch({
                    type: "ReadOpenBillsForVendorSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadOpenBillsForVendorFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const approveBill =
    (id, role = 1, client_id) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ApproveBillRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };

            const response = await axios.put(
                `${commonUrl}/private/accountant/${
                    role === 1 ? "jr" : "sr"
                }/approve-bill/${id}`,
                {},
                config
            );
            dispatch({ type: "ApproveBillSuccess", payload: response.data });
            toast.success("Bill approved successfully");
            dispatch(getBillList(1, "", 0, role, client_id));
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ApproveBillFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const extractDataFromTaxInvoice =
    (file, navigate) => async (dispatch) => {
        try {
            dispatch({ type: "ExtractDataFromBillRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const form = new FormData();
            form.append("invoice_file", file);
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.post(
                `${url}/private/client/bills/extract-data-from-bill`,
                form,
                config
            );
            dispatch(getBillList());
            dispatch({
                type: "ExtractDataFromBillSuccess",
                payload: response.data,
            });
            toast.success("BIll uploaded successfully");
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExtractDataFromBillFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getExtractedBillList =
    (role = 0, page = 1, client_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ExtractedBillListRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/bills/extracted/read-list`,
                    config
                );
                dispatch({
                    type: "ExtractedBillListSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/read-extracted-bills/${client_id}/${page}`,
                    config
                );
                dispatch({
                    type: "ExtractedBillListSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExtractedBillListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getExtractedBillDetails =
    (staging_id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ExtractedBillDetailsRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };

            if (role !== 0) {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-extracted-bill/${staging_id}`,
                    config
                );
                dispatch({
                    type: "ExtractedBillDetailsSuccess",
                    payload: response.data,
                });
            } else {
                toast.error("You are not authorized to view this page");
                dispatch({
                    type: "ExtractedBillDetailsFailure",
                    payload: "You are not authorized to view this page",
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExtractedBillDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const convertStagingToBill =
    (staging_id, data, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ConvertStagingToBillRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role !== 0) {
                const response = await axios.post(
                    `${commonUrl}/private/accountant/convert-staging-to-bill/${staging_id}`,
                    data,
                    config
                );
                dispatch({
                    type: "ConvertStagingToBillSuccess",
                    payload: response.data,
                });
            } else {
                toast.error("You are not authorized to view this page");
                dispatch({
                    type: "ConvertStagingToBillFailure",
                    payload: "You are not authorized to view this page",
                });
            }
            toast.success("Bill updated successfully");
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ConvertStagingToBillFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };
