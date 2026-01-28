import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";
import { getAuthConfig } from "../utils/authConfig";

export const createCreditNote = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateCreditNoteRequest" });
        const config = await getAuthConfig();

        const response = await axios.post(
            `${url}/private/client/credit-notes/create`,
            data,
            config
        );

        dispatch({ type: "CreateCreditNoteSuccess", payload: response.data });
        toast.success("Credit Note created successfully");
        navigate("/credit-note");
    } catch (err) {
        // console.log(err);
        if (err.response?.status === 422) {
            const errs = err.response.data.detail;
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "CreateCreditNoteFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreateCreditNoteFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getCreditNoteDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteDetailsRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${url}/private/client/credit-notes/read/${id}`,
            config
        );
        dispatch({
            type: "CreditNoteDetailsSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "CreditNoteDetailsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const getCreditNoteList =
    (page = 1, keyword = "", customer_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "CreditNoteListRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/credit-notes/read-list/${page}?keyword=${keyword}${
                    customer_id !== 0 ? `&customer_id=${customer_id}` : ""
                }`,
                config
            );
            dispatch({
                type: "CreditNoteListSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "CreditNoteListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteCreditNote = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteDeleteRequest" });
        const config = await getAuthConfig();

        const response = await axios.delete(
            `${url}/private/client/credit-notes/delete/${id}`,
            config
        );

        dispatch({ type: "CreditNoteDeleteSuccess", payload: response.data });
        toast.success("Credit Note deleted successfully");
        dispatch(getCreditNoteList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "CreditNoteDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateCreditNote = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteUpdateRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/credit-notes/update/${id}`,
            data,
            config
        );
        dispatch({
            type: "CreditNoteUpdateSuccess",
            payload: response.data,
        });

        toast.success("Credit Note updated successfully");
        navigate(`/credit-note/view/${id}`);
    } catch (err) {
        // console.log(err);
        if (err.response?.status === 422) {
            const errs = err.response.data.detail;
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "CreditNoteUpdateFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreditNoteUpdateFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const markCreditNoteVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CreditNoteMarkVoidRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/credit-notes/mark-void/${id}`,
            {},
            config
        );

        dispatch({ type: "CreditNoteMarkVoidSuccess", payload: response.data });
        toast.success("Credit Note marked as void successfully");
        dispatch(getCreditNoteDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "CreditNoteMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const getNewCreditNoteNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewCreditNoteNumberRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${url}/private/client/credit-notes/read-new-cn-number`,
            config
        );

        dispatch({
            type: "GetNewCreditNoteNumberSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewCreditNoteNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadCreditNoteList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadCreditNoteListRequest" });
        const config = await getAuthConfig();
        config.responseType = "blob";

        const response = await axios.get(
            `${url}/private/client/credit-notes/download`,
            config
        );

        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "CreditNoteList.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
            type: "DownloadCreditNoteListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadCreditNoteListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const submitCreditNoteForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitCreditNoteForApprovalRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/credit-notes/submit-for-approval/${id}`,
            {},
            config
        );

        dispatch({
            type: "SubmitCreditNoteForApprovalSuccess",
            payload: response.data,
        });
        toast.success("Credit Note submitted for approval successfully");
        dispatch(getCreditNoteDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "SubmitCreditNoteForApprovalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readOpenCreditNotesForCustomer =
    (id, currency_id = 1) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ReadOpenCreditNotesForCustomerRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/credit-notes/read-open-credit-notes-for-customer/${id}?currency_id=${currency_id}`,
                config
            );
            dispatch({
                type: "ReadOpenCreditNotesForCustomerSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadOpenCreditNotesForCustomerFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const adjustCreditNoteAgainstInvoice =
    (id, data) => async (dispatch) => {
        try {
            dispatch({ type: "AdjustCreditNoteAgainstInvoiceRequest" });
            const config = await getAuthConfig();

            const response = await axios.post(
                `${url}/private/client/credit-notes/adjust-against-invoices/${id}`,
                data,
                config
            );

            dispatch({
                type: "AdjustCreditNoteAgainstInvoiceSuccess",
                payload: response.data,
            });
            toast.success("Credit Note adjusted against invoice successfully");
            dispatch(getCreditNoteDetails(id));
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "AdjustCreditNoteAgainstInvoiceFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const approveCreditNote = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ApproveCreditNoteRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${commonUrl}/private/accountant/jr/approve-credit-note/${id}`,
            {},
            config
        );

        dispatch({
            type: "ApproveCreditNoteSuccess",
            payload: response.data,
        });
        toast.success("Credit Note approved successfully");
        dispatch(getCreditNoteList(1, "", 0));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ApproveCreditNoteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const markAsFinalCreditNote = (id) => async (dispatch) => {
    try {
        dispatch({ type: "MarkCreditNoteAsFinalRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/credit-notes/mark-client-accepted/${id}`,
            {},
            config
        );

        dispatch({
            type: "MarkCreditNoteAsFinalSuccess",
            payload: response.data,
        });
        toast.success("Credit Note marked as final successfully");
        dispatch(getCreditNoteDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "MarkCreditNoteAsFinalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
