import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";
import { getAuthConfig } from "../utils/authConfig";
import { loadUser } from "../Actions/User";

export const updateCompanyDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "UPDATE_COMPANY_REQUEST" });
        const config = await getAuthConfig();

        const response = await axios.put(
            `${url}/private/client/update-company-details`,
            data,
            config
        );

        dispatch({ type: "UPDATE_COMPANY_SUCCESS", payload: data });
        toast.success("Company details updated successfully");
        dispatch(loadUser());
    } catch (error) {
        dispatch({ type: "UPDATE_COMPANY_FAILURE", payload: error.message });
    }
};

export const saveCompanyDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "CompanyDetailsRequest" });
        const config = await getAuthConfig();

        const response = await axios.post(
            `${commonUrl}/private/client/onboarding/save-company-details`,
            data,
            config
        );

        dispatch({ type: "CompanyDetailsSuccess", payload: response.data });
        dispatch({ type: "LoadUserRequest" });
        window.localStorage.removeItem("should_logout");
        window.location.href = "/onboard/bank";
        toast.success("Company Details Saved Successfully");
    } catch (error) {
        // console.log(error);
        if (error.response?.status === 422) {
            const errors = error.response.data.detail;
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "CompanyDetailsFailure",
                payload: error.response?.data || error.message,
            });
        } else {
            dispatch({
                type: "CompanyDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const saveBankDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "BankDetailsRequest" });
        const config = await getAuthConfig();

        const response = await axios.post(
            `${commonUrl}/private/client/onboarding/save-primary-bank-details`,
            data,
            config
        );

        dispatch({ type: "BankDetailsSuccess", payload: response.data });
        dispatch({ type: "LoadUserRequest" });
        window.localStorage.removeItem("should_logout");
        window.location.href = "/onboard/upload";
        toast.success("Bank Details Saved Successfully");
    } catch (error) {
        // console.log(error);
        if (error.response?.status === 422) {
            const errors = error.response.data.detail;
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "BankDetailsFailure",
                payload: error.response?.data || error.message,
            });
        } else {
            dispatch({
                type: "BankDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const updateDocumentDetails = (data) => async (dispatch) => {
    try {
        dispatch({ type: "UPDATE_DOCUMENTS_REQUEST" });
        const config = await getAuthConfig();

        await axios.put(
            `${url}/private/client/update-document-details`,
            data,
            config
        );

        dispatch({ type: "UPDATE_DOCUMENTS_SUCCESS", payload: data });
        toast.success("Document details updated successfully");
    } catch (error) {
        // console.log(error);
        if (error.response?.status === 422) {
            const errors = error.response.data.detail;
            errors?.forEach((error) => {
                toast.error(error.loc[1] + ": " + error.msg);
            });
            dispatch({
                type: "UPDATE_DOCUMENTS_FAILURE",
                payload: error.response?.data || error.message,
            });
        } else {
            dispatch({
                type: "UPDATE_DOCUMENTS_FAILURE",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const uploadDocuments = (data) => async (dispatch) => {
    try {
        dispatch({ type: "UploadDocumentsRequest" });
        const config = await getAuthConfig();
        config.headers["Content-Type"] = "multipart/form-data";

        const form = new FormData();
        form.append("logo_file", data.logo_file);
        form.append("trade_license_file", data.trade_license_file);
        form.append("moa_file", data.moa_file);
        form.append("emirates_id_file", data.emirates_id_file);
        form.append("passport_file", data.passport_file);

        if (data.corporate_tax_certificate_file) {
            form.append(
                "corporate_tax_certificate_file",
                data.corporate_tax_certificate_file
            );
        }
        if (data.vat_file) {
            form.append("vat_file", data.vat_file);
        }

        const jsonData = {
            managers: data.managers || [],
            stakeholders: data.stakeholders || [],
        };
        form.append("json_data", JSON.stringify(jsonData));

        const response = await axios.post(
            `${commonUrl}/private/client/onboarding/save-documents-dummy`,
            form,
            config
        );

        toast.success("Documents Uploaded Successfully!");
        dispatch({ type: "LoadUserRequest" });
        window.localStorage.removeItem("should_logout");
        window.location.href = "/";
        dispatch({ type: "UploadDocumentsSuccess", payload: response.data });
    } catch (error) {
        console.error("Error response:", error.response);
        if (error.response?.status === 422) {
            const errors = error.response.data.detail;
            errors?.forEach((err) => {
                toast.error(err.loc[1] + ": " + err.msg);
            });
            dispatch({
                type: "UploadDocumentsFailure",
                payload: error.response?.data || error.message,
            });
        } else {
            dispatch({
                type: "UploadDocumentsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const getCompanyType = () => async (dispatch) => {
    try {
        dispatch({ type: "GetCompanyTypeRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${commonUrl}/private/read-company-types`,
            config
        );

        dispatch({ type: "GetCompanyTypeSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetCompanyTypeFailure",
            payload: error.response?.data || error.message,
        });
    }
};

export const getIndustry = () => async (dispatch) => {
    try {
        dispatch({ type: "GetIndustryRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${commonUrl}/private/read-box/industry`,
            config
        );

        dispatch({ type: "GetIndustrySuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetIndustryFailure",
            payload: error.response?.data || error.message,
        });
    }
};

export const getCurrency = () => async (dispatch) => {
    try {
        dispatch({ type: "GetCurrencyRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${commonUrl}/private/read-currencies`,
            config
        );

        dispatch({ type: "GetCurrencySuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetCurrencyFailure",
            payload: error.response?.data || error.message,
        });
    }
};

export const getTaxRate = () => async (dispatch) => {
    try {
        dispatch({ type: "GetTaxRateRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${commonUrl}/private/read-tax-rates`,
            config
        );

        dispatch({ type: "GetTaxRateSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "GetTaxRateFailure",
            payload: error.response?.data || error.message,
        });
    }
};
