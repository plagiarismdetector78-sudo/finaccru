import { toast } from "react-toastify";

const handleApiError = (err, dispatch, failureType) => {
    if (err.response?.status === 422) {
        const errors = err.response.data.detail;
        errors?.forEach((error) => {
            toast.error(`${error.loc?.[1] || "Error"}: ${error.msg}`);
        });
    } else {
        toast.error(
            err.response?.data?.message || err.message || "An error occurred"
        );
    }

    dispatch({
        type: failureType,
        payload: err.response?.data || err.message,
    });
};

export default handleApiError;
