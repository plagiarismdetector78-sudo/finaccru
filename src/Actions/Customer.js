import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../data/url";
import handleApiError from "../utils/handleApiError";
import { getAuthConfig } from "../utils/authConfig";

export const DEV_TOKEN =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE5ZGRjYTc2YzEyMzMyNmI5ZTJlODJkOGFjNDg0MWU1MzMyMmI3NmEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2h1YmhhbSBEd2l2ZWRpIiwicm9sZSI6MCwiZmluYWNjcnVfYWNjZXNzIjp0cnVlLCJmaW52YXVsdF9hY2Nlc3MiOnRydWUsImZpbnZvaWNlX2FjY2VzcyI6dHJ1ZSwiZmluYmlsbF9hY2Nlc3MiOnRydWUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9maW5hY2NydS1zdGFnaW5nIiwiYXVkIjoiZmluYWNjcnUtc3RhZ2luZyIsImF1dGhfdGltZSI6MTc0MzQ5MDY2NSwidXNlcl9pZCI6IklXdWtpWVpXMDFmSlRRYUpCcHR3eVNmalJENDMiLCJzdWIiOiJJV3VraVlaVzAxZkpUUWFKQnB0d3lTZmpSRDQzIiwiaWF0IjoxNzQzNDkwNjY1LCJleHAiOjE3NDM0OTQyNjUsImVtYWlsIjoiZGV2LnNodWJoYW0xNzA2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrOTcxOTcxMTU3OTM3IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJkZXYuc2h1YmhhbTE3MDZAZ21haWwuY29tIl0sInBob25lIjpbIis5NzE5NzExNTc5MzciXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Jacx04L_nxAR5o-ijQz9iL4qz3cziIIiNw1OvCRLO5Z2W0ZHmhLs32T-PEpUwsXkeNjPtz8O7Dmoyy6DMGDvwUnJ_hZEI48QV_U_GvFm3FvM1LJZiEfZo7jsw-P1jF32JX9eC_NNVdJ0JWm7FRil7OVXVqyv90A7_N2qFdRhqrKF6NXXTl7B6LYZg6Fso_mhyPBedu2cV2PKur4Xy0Kooh0FqPxjZt1XqAx9RZr3ABmf000B5dYSwZy0nAzugMxTn75uq1-vWUTFnpvH47P8VuqdwxV7Belu5r8xHb1fDsJMJ-puG-NSCXo_QL4LpVxP86TYNJwTk3SbbA9YoS_MTg";

export const getCustomerList =
    (page = 1, keyword = "") =>
    async (dispatch) => {
        try {
            dispatch({ type: "CustomerListRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/customers/read-customers-list/${page}?keyword=${keyword}`,
                config
            );
            dispatch({ type: "CustomerListSuccess", payload: response.data });
        } catch (error) {
            handleApiError(error, dispatch, "CustomerListFailure");
        }
    };

export const createCustomer = (data, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "CreateCustomerRequest" });
        const config = await getAuthConfig();

        const response = await axios.post(
            `${url}/private/client/customers/create`,
            data,
            config
        );
        dispatch({ type: "CreateCustomerSuccess", payload: response.data });
        toast.success("Customer created successfully");
        dispatch(getCustomerList());
        navigate("/customer");
    } catch (error) {
        handleApiError(error, dispatch, "CreateCustomerFailure");
    }
};

export const createInSalesDocument =
    (data, handleCustomerSubmit) => async (dispatch) => {
        try {
            dispatch({ type: "CreateInSalesDocumentRequest" });
            const config = await getAuthConfig();

            const response = await axios.post(
                `${url}/private/client/customers/create-in-sales-document`,
                data,
                config
            );
            dispatch({
                type: "CreateInSalesDocumentSuccess",
                payload: response.data,
            });
            toast.success("InSales Document created successfully");

            if (handleCustomerSubmit) {
                handleCustomerSubmit(response.data);
            }

            dispatch(getCustomerList());
        } catch (error) {
            handleApiError(error, dispatch, "CreateInSalesDocumentFailure");
        }
    };

export const createInDocument =
    (data, handleCustomerSubmit) => async (dispatch) => {
        try {
            dispatch({ type: "CreateInSalesDocumentRequest" });
            const config = await getAuthConfig();

            const response = await axios.post(
                `${url}/private/client/customers/create-in-sales-document`,
                data,
                config
            );
            dispatch({
                type: "CreateInSalesDocumentSuccess",
                payload: response.data,
            });
            toast.success("InSales Document created successfully");

            if (handleCustomerSubmit) {
                handleCustomerSubmit(response.data);
            }
            dispatch(getCustomerList());
        } catch (error) {
            handleApiError(error, dispatch, "CreateInSalesDocumentFailure");
        }
    };

export const updateCustomer = (data, id) => async (dispatch) => {
    try {
        dispatch({ type: "UpdateCustomerRequest" });
        const config = await getAuthConfig();

        await axios.put(
            `${url}/private/client/customers/update/${id}`,
            data,
            config
        );
        dispatch({ type: "UpdateCustomerSuccess", payload: data });
        toast.success("Customer updated successfully");
    } catch (error) {
        handleApiError(error, dispatch, "UpdateCustomerFailure");
    }
};

export const getCustomerDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "CustomerDetailsRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${url}/private/client/customers/read/${id}`,
            config
        );
        dispatch({
            type: "CustomerDetailsSuccess",
            payload: response.data,
        });
    } catch (error) {
        handleApiError(error, dispatch, "CustomerDetailsFailure");
    }
};

export const getCustomerInfiniteScroll =
    (page = 1, refresh = false, keyword = "", is_active = true) =>
    async (dispatch) => {
        try {
            dispatch({ type: "CustomerInfiniteScrollRequest" });
            const config = await getAuthConfig();

            const response = await axios.get(
                `${url}/private/client/customers/read-customers-list/${page}?keyword=${keyword}&is_active=${is_active}`,
                config
            );
            dispatch({
                type: "CustomerInfiniteScrollSuccess",
                payload: { data: response.data, refresh: refresh },
            });
        } catch (error) {
            handleApiError(error, dispatch, "CustomerInfiniteScrollFailure");
        }
    };

export const createShippingAddress =
    (data, customer_id) => async (dispatch) => {
        try {
            dispatch({ type: "CreateShippingAddressRequest" });
            const config = await getAuthConfig();

            const response = await axios.post(
                `${url}/private/client/customers/${customer_id}/create-shipping-address`,
                data,
                config
            );
            dispatch({
                type: "CreateShippingAddressSuccess",
                payload: response.data,
            });
            dispatch(getShippingAddressList(customer_id));

            toast.success("Shipping Address created successfully");
        } catch (error) {
            handleApiError(error, dispatch, "CreateShippingAddressFailure");
        }
    };

export const getShippingAddressList = (customer_id) => async (dispatch) => {
    try {
        dispatch({ type: "ShippingAddressListRequest" });
        const config = await getAuthConfig();

        const response = await axios.get(
            `${url}/private/client/customers/${customer_id}/read-shipping-address-list`,
            config
        );
        dispatch({
            type: "ShippingAddressListSuccess",
            payload: response.data,
        });
    } catch (error) {
        handleApiError(error, dispatch, "ShippingAddressListFailure");
    }
};

export const deleteCustomer = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteCustomerRequest" });
        const config = await getAuthConfig();

        await axios.delete(
            `${url}/private/client/customers/delete/${id}`,
            config
        );
        dispatch({ type: "DeleteCustomerSuccess", payload: id });
        dispatch(getCustomerList());
        toast.success("Customer deleted successfully");
    } catch (error) {
        handleApiError(error, dispatch, "DeleteCustomerFailure");
    }
};

export const updateShippingAddress =
    (data, shipping_address_id, customerId) => async (dispatch) => {
        try {
            dispatch({ type: "UpdateShippingAddressRequest" });
            const config = await getAuthConfig();

            await axios.post(
                `${url}/private/client/customers/update-shipping-address/${shipping_address_id}`,
                data,
                config
            );
            dispatch({ type: "UpdateShippingAddressSuccess", payload: data });
            toast.success("Shipping Address updated successfully");
            dispatch(getShippingAddressList(customerId));
        } catch (error) {
            handleApiError(error, dispatch, "UpdateShippingAddressFailure");
        }
    };

export const deleteShippingAddress = (id, customerId) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteShippingAddressRequest" });
        const config = await getAuthConfig();

        await axios.delete(
            `${url}/private/client/customers/delete-shipping-address/${id}`,
            config
        );
        dispatch({ type: "DeleteShippingAddressSuccess", payload: id });
        toast.success("Shipping Address deleted successfully");
        dispatch(getShippingAddressList(customerId));
    } catch (error) {
        handleApiError(error, dispatch, "DeleteShippingAddressFailure");
    }
};

export const readCustomerStatement = (id, data) => async (dispatch) => {
    try {
        dispatch({ type: "ReadCustomerStatementRequest" });
        const config = await getAuthConfig();

        const response = await axios.post(
            `${url}/private/client/customers/read-statement/${id}`,
            data,
            config
        );
        dispatch({
            type: "ReadCustomerStatementSuccess",
            payload: response.data,
        });
    } catch (error) {
        handleApiError(error, dispatch, "ReadCustomerStatementFailure");
    }
};
