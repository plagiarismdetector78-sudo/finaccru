import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";
import { getAuthConfig } from "../utils/authConfig";

export const createTaxInvoice = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateTaxInvoiceRequest" });
        const config = await getAuthConfig();

        const response = await axios.post(
            `${url}/private/client/tax-invoices/create`,
            data,
            config
        );

        dispatch({ type: "CreateTaxInvoiceSuccess", payload: response.data });
        toast.success("Invoice created successfully");
        navigate("/tax-invoice");
    } catch (err) {
        // console.log(err);
        if (err.response?.status === 422) {
            const errs = err.response.data.detail;
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "CreateTaxInvoiceFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "CreateTaxInvoiceFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const getTaxInvoiceDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceDetailsRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${url}/private/client/tax-invoices/read/${id}`,
            config
        );
        dispatch({
            type: "TaxInvoiceDetailsSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "TaxInvoiceDetailsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const getTaxInvoiceList =
    (page = 1, keyword = "", customer_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "TaxInvoiceListRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/tax-invoices/read-list/${page}?keyword=${keyword}${
                    customer_id !== 0 ? `&customer_id=${customer_id}` : ""
                }`,
                config
            );
            dispatch({
                type: "TaxInvoiceListSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "TaxInvoiceListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteTaxInvoice = (id) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceDeleteRequest" });
        const config = await getAuthConfig();

        const response = await axios.delete(
            `${url}/private/client/tax-invoices/delete/${id}`,
            config
        );

        dispatch({ type: "TaxInvoiceDeleteSuccess", payload: response.data });
        toast.success("Invoice deleted successfully");
        dispatch(getTaxInvoiceList());
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "TaxInvoiceDeleteFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateTaxInvoice = (id, data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceUpdateRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/tax-invoices/update/${id}`,
            data,
            config
        );
        dispatch({
            type: "TaxInvoiceUpdateSuccess",
            payload: response.data,
        });

        toast.success("Invoice updated successfully");
        navigate("/tax-invoice/view/" + id);
    } catch (err) {
        // console.log(err);
        if (err.response?.status === 422) {
            const errs = err.response.data.detail;
            errs?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "TaxInvoiceUpdateFailure",
                payload: err.response?.data || err.message,
            });
        } else {
            dispatch({
                type: "TaxInvoiceUpdateFailure",
                payload: err.response?.data || err.message,
            });
            toast.error(err.response?.data || err.message);
        }
    }
};

export const markTaxInvoiceVoid = (id) => async (dispatch) => {
    try {
        dispatch({ type: "TaxInvoiceMarkVoidRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/tax-invoices/mark-void/${id}`,
            {},
            config
        );

        dispatch({ type: "TaxInvoiceMarkVoidSuccess", payload: response.data });
        toast.success("Invoice marked as void successfully");
        dispatch(getTaxInvoiceDetails(id));
    } catch (err) {
        // console.log(err);
        dispatch({
            type: "TaxInvoiceMarkVoidFailure",
            payload: err.response?.data || err.message,
        });
        toast.error(err.response?.data || err.message);
    }
};

export const getNewTaxInvoiceNumber = () => async (dispatch) => {
    try {
        dispatch({ type: "GetNewTaxInvoiceNumberRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${url}/private/client/tax-invoices/read-new-ti-number`,
            config
        );

        dispatch({
            type: "GetNewTaxInvoiceNumberSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetNewTaxInvoiceNumberFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadTaxInvoiceList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadTaxInvoiceListRequest" });
        const config = await getAuthConfig();
        config.responseType = "blob";

        const response = await axios.get(
            `${url}/private/client/tax-invoices/download`,
            config
        );

        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "TaxInvoiceList.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
            type: "DownloadTaxInvoiceListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadTaxInvoiceListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const submitTaxInvoiceForApproval = (id) => async (dispatch) => {
    try {
        dispatch({ type: "SubmitTaxInvoiceForApprovalRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/tax-invoices/submit-for-approval/${id}`,
            {},
            config
        );

        dispatch({
            type: "SubmitTaxInvoiceForApprovalSuccess",
            payload: response.data,
        });
        toast.success("Invoice submitted for approval successfully");
        dispatch(getTaxInvoiceDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "SubmitTaxInvoiceForApprovalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const extractDataFromTaxInvoice =
    (file, navigate) => async (dispatch) => {
        try {
            dispatch({ type: "ExtractDataFromTaxInvoiceRequest" });
            const config = await getAuthConfig();
            const form = new FormData();
            form.append("invoice_file", file);

            const response = await axios.post(
                `${url}/private/client/tax-invoices/extract-data-from-invoice`,
                form,
                config
            );

            dispatch(getTaxInvoiceList());
            dispatch({
                type: "ExtractDataFromTaxInvoiceSuccess",
                payload: response.data,
            });
            toast.success("Invoice uploaded successfully");
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExtractDataFromTaxInvoiceFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const readOpenTaxInvoicesForCustomer =
    (id, currency_id = 1) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ReadOpenTaxInvoicesForCustomerRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/tax-invoices/read-open-invoices-for-customer/${id}?currency_id=${currency_id}`,
                config
            );
            dispatch({
                type: "ReadOpenTaxInvoicesForCustomerSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadOpenTaxInvoicesForCustomerFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const approveTaxInvoice =
    (id, role = 1, client_id) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ApproveTaxInvoiceRequest" });
            const config = await getAuthConfig();

            const response = await axios.put(
                `${commonUrl}/private/accountant/${
                    role === 1 ? "jr" : "sr"
                }/approve-tax-invoice/${id}`,
                {},
                config
            );

            dispatch({
                type: "ApproveTaxInvoiceSuccess",
                payload: response.data,
            });
            toast.success("Invoice approved successfully");
            dispatch(getTaxInvoiceList(1, "", 0, role, client_id));
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ApproveTaxInvoiceFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const markAsFinalTaxInvoice = (id) => async (dispatch) => {
    try {
        dispatch({ type: "MarkTaxInvoiceAsFinalRequest" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/tax-invoices/mark-client-accepted/${id}`,
            {},
            config
        );

        dispatch({
            type: "MarkTaxInvoiceAsFinalSuccess",
            payload: response.data,
        });
        toast.success("Invoice marked as final successfully");
        dispatch(getTaxInvoiceDetails(id));
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "MarkTaxInvoiceAsFinalFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const getExtractedTaxInvoiceList =
    (page = 1) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ExtractedTaxInvoiceListRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/tax-invoices/extracted/read-list?page=${page}`,
                config
            );
            dispatch({
                type: "ExtractedTaxInvoiceListSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExtractedTaxInvoiceListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };
export const getExtractedTaxInvoiceDetails =
    (staging_id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ExtractedTaxInvoiceDetailsRequest" });
            const config = await getAuthConfig();

            if (role !== 0) {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-extracted-tax-invoice/${staging_id}`,
                    config
                );
                dispatch({
                    type: "ExtractedTaxInvoiceDetailsSuccess",
                    payload: response.data,
                });
            } else {
                toast.error("You are not authorized to view this page");
                dispatch({
                    type: "ExtractedTaxInvoiceDetailsFailure",
                    payload: "You are not authorized to view this page",
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExtractedTaxInvoiceDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const convertStagingToTaxInvoice =
    (staging_id, data, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "ConvertStagingToTaxInvoiceRequest" });
            const config = await getAuthConfig();

            if (role !== 0) {
                const response = await axios.post(
                    `${commonUrl}/private/accountant/convert-staging-to-tax-invoice/${staging_id}`,
                    data,
                    config
                );
                dispatch({
                    type: "ConvertStagingToTaxInvoiceSuccess",
                    payload: response.data,
                });
                toast.success("Invoice created successfully");
            } else {
                toast.error("You are not authorized to perform this action");
                dispatch({
                    type: "ConvertStagingToTaxInvoiceFailure",
                    payload: "You are not authorized to perform this action",
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ConvertStagingToTaxInvoiceFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };
