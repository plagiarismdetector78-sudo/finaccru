import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";
import { auth } from "../firebase";

export const getVendorList =
    (page = 1, keyword = "") =>
    async (dispatch) => {
        try {
            dispatch({ type: "VendorListRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.get(
                `${url}/private/client/vendors/read-vendors-list/${page}?keyword=${keyword}`,
                config
            );
            dispatch({ type: "VendorListSuccess", payload: response.data });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "VendorListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const createVendor =
    (data, handleVendorSubmit, navigate) => async (dispatch) => {
        try {
            dispatch({ type: "CreateVendorRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.post(
                `${url}/private/client/vendors/create`,
                data,
                config
            );
            dispatch({ type: "CreateVendorSuccess", payload: response.data });
            toast.success("Vendor created successfully");
            if (handleVendorSubmit) {
                handleVendorSubmit(response.data);
            }
            dispatch(getVendorList());
            navigate("/vendor");
        } catch (error) {
            // console.log(error);
            if (error.response?.status === 422) {
                // I will get an array of errors from the backend in details
                const errors = error.response.data.detail;
                // I will loop through the array and display the errors
                errors?.forEach((error) => {
                    toast.error(error.loc[1] + ": " + error.msg);
                });
                dispatch({
                    type: "CreateVendorFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "CreateVendorFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const createInPurchaseDocument =
    (data, handleVendorSubmit) => async (dispatch) => {
        try {
            dispatch({ type: "CreateInPurchaseDocumentRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            let urlEndpoint = `${url}/private/client/vendors/create-in-purchase-document`;

            // if client_id is present in data
            if (data.client_id) {
                urlEndpoint = `${commonUrl}/private/accountant/jr/create-in-purchase-document`;
            }

            const response = await axios.post(urlEndpoint, data, config);
            dispatch({
                type: "CreateInPurchaseDocumentSuccess",
                payload: response.data,
            });
            toast.success("Vendor Created successfully");

            if (handleVendorSubmit) {
                handleVendorSubmit(response.data);
            }
            dispatch(getVendorList());
        } catch (error) {
            // console.log(error);
            if (error.response?.status === 422) {
                // I will get an array of errors from the backend in details
                const errors = error.response.data.detail;
                // I will loop through the array and display the errors
                errors?.forEach((error) => {
                    toast.error(error.loc[1] + ": " + error.msg);
                });
                dispatch({
                    type: "CreateInPurchaseDocumentFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "CreateInPurchaseDocumentFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const updateVendor =
    (data, id, handleVendorSubmit, navigate) => async (dispatch) => {
        try {
            dispatch({ type: "UpdateVendorRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            await axios.put(
                `${url}/private/client/vendors/update/${id}`,
                data,
                config
            );
            dispatch({ type: "UpdateVendorSuccess", payload: data });
            toast.success("Vendor updated successfully");
            if (handleVendorSubmit) {
                handleVendorSubmit(data);
            } else {
                navigate("/vendor/view/" + id);
            }
        } catch (error) {
            // console.log(error);
            if (error.response?.status === 422) {
                // I will get an array of errors from the backend in details
                const errors = error.response.data.detail;
                // I will loop through the array and display the errors
                errors?.forEach((error) => {
                    toast.error(error.loc[1] + ": " + error.msg);
                });
                dispatch({
                    type: "UpdateVendorFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "UpdateVendorFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const getVendorDetails =
    (id, role = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "VendorDetailsRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/vendors/read/${id}`,
                    config
                );
                dispatch({
                    type: "VendorDetailsSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/read-vendor/${id}`,
                    config
                );
                dispatch({
                    type: "VendorDetailsSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "VendorDetailsFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const getVendorInfiniteScroll =
    (page = 1, refresh = false, keyword = "", role = 0, client_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "VendorInfiniteScrollRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/vendors/read-vendors-list/${page}?keyword=${keyword}`,
                    config
                );
                dispatch({
                    type: "VendorInfiniteScrollSuccess",
                    payload: { data: response.data, refresh: refresh },
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/read-vendors-list/${page}?keyword=${keyword}&client_id=${client_id}`,
                    config
                );
                dispatch({
                    type: "VendorInfiniteScrollSuccess",
                    payload: { data: response.data, refresh: refresh },
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "VendorInfiniteScrollFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const createVendorShippingAddress =
    (
        data,
        vendor_id,
        handleVendorShippingAddressSubmit,
        role = 0,
        client_id = 0
    ) =>
    async (dispatch) => {
        try {
            dispatch({ type: "CreateVendorShippingAddressRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.post(
                    `${url}/private/client/vendors/${vendor_id}/create-shipping-address`,
                    data,
                    config
                );
                dispatch({
                    type: "CreateVendorShippingAddressSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.post(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/vendor/${vendor_id}/create-shipping-address?client_id=${client_id}`,
                    data,
                    config
                );
                dispatch({
                    type: "CreateVendorShippingAddressSuccess",
                    payload: response.data,
                });
            }
            toast.success("Vendor Shipping Address created successfully");
            if (handleVendorShippingAddressSubmit) {
                handleVendorShippingAddressSubmit(response.data);
            }
        } catch (error) {
            // console.log(error);
            if (error.response?.status === 422) {
                // I will get an array of errors from the backend in details
                const errors = error.response.data.detail;
                // I will loop through the array and display the errors
                errors?.forEach((error) => {
                    toast.error(error.loc[1] + ": " + error.msg);
                });
                dispatch({
                    type: "CreateVendorShippingAddressFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "CreateVendorShippingAddressFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const getVendorShippingAddressList =
    (vendor_id, role = 0, client_id = 0) =>
    async (dispatch) => {
        try {
            dispatch({ type: "VendorShippingAddressListRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            if (role === 0) {
                const response = await axios.get(
                    `${url}/private/client/vendors/${vendor_id}/read-shipping-address-list`,
                    config
                );
                dispatch({
                    type: "VendorShippingAddressListSuccess",
                    payload: response.data,
                });
            } else {
                const response = await axios.get(
                    `${commonUrl}/private/accountant/${
                        role === 1 ? "jr" : "sr"
                    }/vendor/${vendor_id}/read-shipping-address-list?client_id=${client_id}`,
                    config
                );
                dispatch({
                    type: "VendorShippingAddressListSuccess",
                    payload: response.data,
                });
            }
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "VendorShippingAddressListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const deleteVendor = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteVendorRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(
            `${url}/private/client/vendors/delete/${id}`,
            config
        );
        dispatch({ type: "DeleteVendorSuccess", payload: id });
        dispatch(getVendorList());
        toast.success("Vendor deleted successfully");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DeleteVendorFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const updateVendorShippingAddress =
    (data, shipping_address_id, handleVendorShippingAddressSubmit) =>
    async (dispatch) => {
        try {
            dispatch({ type: "UpdateVendorShippingAddressRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            await axios.put(
                `${url}/private/client/vendors/update-shipping-address/${shipping_address_id}`,
                data,
                config
            );
            dispatch({
                type: "UpdateVendorShippingAddressSuccess",
                payload: data,
            });
            toast.success("Vendor Shipping Address updated successfully");
            if (handleVendorShippingAddressSubmit) {
                handleVendorShippingAddressSubmit(data);
            }
        } catch (error) {
            // console.log(error);
            if (error.response?.status === 422) {
                // I will get an array of errors from the backend in details
                const errors = error.response.data.detail;
                // I will loop through the array and display the errors
                errors?.forEach((error) => {
                    toast.error(error.loc[1] + ": " + error.msg);
                });
                dispatch({
                    type: "UpdateVendorShippingAddressFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "UpdateVendorShippingAddressFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const deleteVendorShippingAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteVendorShippingAddressRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(
            `${url}/private/client/vendors/delete-shipping-address/${id}`,
            config
        );
        dispatch({ type: "DeleteVendorShippingAddressSuccess", payload: id });
        toast.success("VendorShipping Address deleted successfully");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DeleteVendorShippingAddressFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const createPettyCashHandler = (data) => async (dispatch) => {
    try {
        dispatch({ type: "CreatePettyCashHandlerRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.post(
            `${url}/private/client/vendors/petty_cash_handler/create`,
            data,
            config
        );
        dispatch({ type: "CreatePettyCashHandlerSuccess" });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "CreatePettyCashHandlerFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const createOtherPayment = (data) => async (dispatch) => {
    try {
        dispatch({ type: "CreateOtherPaymentRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.post(
            `${url}/private/client/vendors/other_payment/create`,
            data,
            config
        );
        dispatch({ type: "CreateOtherPaymentSuccess" });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "CreateOtherPaymentFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readPaymentMethod = () => async (dispatch) => {
    try {
        dispatch({ type: "ReadPaymentMethodRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${commonUrl}/private/read-payment-method`,
            config
        );
        dispatch({ type: "ReadPaymentMethodSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadPaymentMethodFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readPaymentMethodSubCategories =
    (payment_type) => async (dispatch) => {
        try {
            dispatch({ type: "ReadPaymentMethodSubCategoriesRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.get(
                `${commonUrl}/private/read-payment-method-subcategories/${payment_type}`,
                config
            );
            dispatch({
                type: "ReadPaymentMethodSubCategoriesSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ReadPaymentMethodSubCategoriesFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const readPaymentTerms = () => async (dispatch) => {
    try {
        dispatch({ type: "ReadPaymentTermsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${commonUrl}/private/read-payment-terms`,
            config
        );
        dispatch({ type: "ReadPaymentTermsSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadPaymentTermsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const calculateExpectedDeliveryDate =
    (order_date, payment_term_id) => async (dispatch) => {
        try {
            dispatch({ type: "CalculateExpectedDeliveryDateRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.get(
                `${commonUrl}/private/calculate-expected-delivery-date?order_date=${order_date}&payment_term_id=${payment_term_id}`,
                config
            );
            dispatch({
                type: "CalculateExpectedDeliveryDateSuccess",
                payload: response.data,
            });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "CalculateExpectedDeliveryDateFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const readVendorStatement = (id, data) => async (dispatch) => {
    try {
        dispatch({ type: "ReadVendorStatementRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(
            `${url}/private/client/vendors/read-statement/${id}`,
            data,
            config
        );
        dispatch({
            type: "ReadVendorStatementSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadVendorStatementFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
