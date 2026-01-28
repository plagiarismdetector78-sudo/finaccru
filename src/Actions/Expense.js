import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";
import { auth } from "../firebase";

export const getExpenseList =
    (page = 1, keyword = "") =>
    async (dispatch) => {
        try {
            dispatch({ type: "ExpenseListRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.get(
                `${url}/private/client/expenses/read-list/${page}?keyword=${keyword}`,
                config
            );
            dispatch({ type: "ExpenseListSuccess", payload: response.data });
        } catch (error) {
            // console.log(error);
            dispatch({
                type: "ExpenseListFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    };

export const createExpense =
    (data, handleExpenseSubmit, navigate) => async (dispatch) => {
        try {
            dispatch({ type: "CreateExpenseRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            const response = await axios.post(
                `${url}/private/client/expenses/create`,
                data,
                config
            );
            dispatch({ type: "CreateExpenseSuccess", payload: response.data });
            toast.success("Expense created successfully");
            if (handleExpenseSubmit) {
                handleExpenseSubmit(response.data);
            }
            dispatch(getExpenseList());
            navigate("/expense");
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
                    type: "CreateExpenseFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "CreateExpenseFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const updateExpense =
    (data, id, handleExpenseSubmit, navigate) => async (dispatch) => {
        try {
            dispatch({ type: "UpdateExpenseRequest" });
            const token = await auth.currentUser.getIdToken();
            const config = {
                headers: {
                    token: token,
                },
            };
            await axios.put(
                `${url}/private/client/expenses/update/${id}`,
                data,
                config
            );
            dispatch({ type: "UpdateExpenseSuccess", payload: data });
            toast.success("Expense updated successfully");
            if (handleExpenseSubmit) {
                handleExpenseSubmit(data);
            } else {
                navigate("/expense/view/" + id);
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
                    type: "UpdateExpenseFailure",
                    payload: error.response?.data || error.message,
                });
            } else {
                dispatch({
                    type: "UpdateExpenseFailure",
                    payload: error.response?.data || error.message,
                });
                toast.error(error.response?.data || error.message);
            }
        }
    };

export const getExpenseDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ExpenseDetailsRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${url}/private/client/expenses/read/${id}`,
            config
        );
        dispatch({ type: "ExpenseDetailsSuccess", payload: response.data });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ExpenseDetailsFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const deleteExpense = (id) => async (dispatch) => {
    try {
        dispatch({ type: "DeleteExpenseRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        await axios.delete(
            `${url}/private/client/expenses/delete/${id}`,
            config
        );
        dispatch({ type: "DeleteExpenseSuccess", payload: id });
        dispatch(getExpenseList());
        toast.success("Expense deleted successfully");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DeleteExpenseFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const downloadExpenseList = () => async (dispatch) => {
    try {
        dispatch({ type: "DownloadExpenseListRequest" });
        const token = await auth.currentUser.getIdToken(true);
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const config = {
            headers: {
                token: token,
            },
            responseType: "blob",
        };
        const response = await axios.get(
            `${url}/private/client/expenses/download`,
            config
        );
        const url2 = window.URL.createObjectURL(
            new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
        );
        const link = document.createElement("a");
        link.href = url2;
        link.setAttribute("download", "ExpenseList.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch({
            type: "DownloadExpenseListSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "DownloadExpenseListFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const readExpenseCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "ReadExpenseCategoriesRequest" });
        const token = await auth.currentUser.getIdToken();
        const config = {
            headers: {
                token: token,
            },
        };
        const response = await axios.get(
            `${commonUrl}/private/read-expense-categories`,
            config
        );
        dispatch({
            type: "ReadExpenseCategoriesSuccess",
            payload: response.data,
        });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ReadExpenseCategoriesFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};
