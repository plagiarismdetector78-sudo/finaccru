import axios from "axios";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";

export const createDebitNote = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateDebitNoteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.post(
            `${url}/private/client/debit-notes/create`,
            data,
            config
        );
        dispatch({ type: "CreateDebitNoteSuccess", payload: response.data });
        toast.success("Debit Note created successfully");
        navigate("/debit-note");
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
                type: "CreateDebitNoteFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreateDebitNoteFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getDebitNoteDetails =
    (id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "DebitNoteDetailsRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/debit-notes/read/${id}`,
                    config
                );
                dispatch({
                    type: "DebitNoteDetailsSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-debit-note/${id}`,
                    config
                );
                dispatch({
                    type: "DebitNoteDetailsSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "DebitNoteDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getDebitNoteList =
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
            dispatch({ type: "DebitNoteListRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/debit-notes/read-list/${page}?keyword=${keyword}${
                        customer_id !== 0 ? `&customer_id=${customer_id}` : ""
                    }`,
                    config
                );
                dispatch({
                    type: "DebitNoteListSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/read-debit-notes/${client_id}/${page}?show_all=${showAll}`,
                    config
                );
                dispatch({
                    type: "DebitNoteListSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "DebitNoteListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteDebitNote = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DebitNoteDeleteRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.delete(
            `${url}/private/client/debit-notes/delete/${id}`,
            config
        );
        dispatch({ type: "DebitNoteDeleteSuccess", payload: response.data });
        toast.success("DebitNote deleted successfully");
        dispatch(getDebitNoteList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DebitNoteDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateDebitNote =
    (id, data, navigate, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "DebitNoteUpdateRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.put(
                    `${url}/private/client/debit-notes/update/${id}`,
                    data,
                    config
                );
                dispatch({
                    type: "DebitNoteUpdateSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.put(
                    `${commonUrl}/private/accountant/update-debit-note/${id}`,
                    data,
                    config
                );
                dispatch({
                    type: "DebitNoteUpdateSuccess",
                    payload: response.data,
                });
            }
            if (role === 0) navigate(`/debit-note/view/${id}`);
            toast.success("DebitNote updated successfully");
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
                    type: "DebitNoteUpdateFailure",
                    payload: err.response?.data || err.message,
                });
            } else {
                dispatch({
                    type: "DebitNoteUpdateFailure",
                    payload: err.response?.data || err.message,
                });
                toast.error(err.response?.data || err.message);
            }
        }
    };

export const markDebitNoteVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DebitNoteMarkVoidRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.put(
            `${url}/private/client/debit-notes/mark-void/${id}`,
            {},
            config
        );
        dispatch({ type: "DebitNoteMarkVoidSuccess", payload: response.data });
        toast.success("Debit Note marked as void successfully");
        dispatch(getDebitNoteDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "DebitNoteMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const getNewDebitNoteNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewDebitNoteNumberRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${url}/private/client/debit-notes/read-new-dn-number`,
            config
        );
        dispatch({
            type: "GetNewDebitNoteNumberSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewDebitNoteNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadDebitNoteList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadDebitNoteListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: "blob",
        };
        const response = await axios.get(
            `${url}/private/client/debit-notes/download`,
            config
        );
        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "DebitNoteList.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch({
            type: "DownloadDebitNoteListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadDebitNoteListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const submitDebitNoteForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitDebitNoteForApprovalRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.put(
            `${url}/private/client/debit-notes/submit-for-approval/${id}`,
            {},
            config
        );
        dispatch({
            type: "SubmitDebitNoteForApprovalSuccess",
            payload: response.data,
        });
        toast.success("Debit Note submitted for approval successfully");
        dispatch(getDebitNoteDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "SubmitDebitNoteForApprovalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readOpenDebitNotesForVendor =
    (id, currency_id = 1, role = 0, client_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ReadOpenDebitNotesForVendorRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/debit-notes/read-open-debit-notes-for-vendor/${id}?currency_id=${currency_id}`,
                    config
                );
                dispatch({
                    type: "ReadOpenDebitNotesForVendorSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-open-debit-notes-for-vendor/${id}?currency_id=${currency_id}`,
                    config
                );
                dispatch({
                    type: "ReadOpenDebitNotesForVendorSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadOpenDebitNotesForVendorFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const adjustDebitNoteAgainstInvoice = (id, data) => async (dispatch) => {
    try {
        dispatch({ type: "AdjustDebitNoteAgainstInvoiceRequest" });
        const token = await auth.currentUser.getIdToken(true);
        const config = {
            headers: {
                token: token,
            },
        };

        const response = await axios.post(
            `${url}/private/client/debit-notes/adjust-against-bills/${id}`,
            data,
            config
        );
        dispatch({
            type: "AdjustDebitNoteAgainstInvoiceSuccess",
            payload: response.data,
        });
        toast.success("Debit Note adjusted against bills successfully");
        dispatch(getDebitNoteDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "AdjustDebitNoteAgainstInvoiceFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const approveDebitNote =
    (id, role = 1, client_id) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ApproveDebitNoteRequest" });
            const token = await auth.currentUser.getIdToken(true);
            const config = {
                headers: {
                    token: token,
                },
            };

            const response = await axios.put(
                `${commonUrl}/private/accountant/${
                    role === 1 ? "jr" : "sr"
                }/approve-debit-note/${id}`,
                {},
                config
            );
            dispatch({
                type: "ApproveDebitNoteSuccess",
                payload: response.data,
            });
            toast.success("Debit Note approved successfully");
            dispatch(getDebitNoteList(1, "", 0, role, client_id));
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ApproveDebitNoteFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };
