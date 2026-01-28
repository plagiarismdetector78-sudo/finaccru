import axios from "axios";
// import { baseUrl } from "../constant/endpoints.js";
import { getAuth, getIdToken } from "firebase/auth";
import { url } from "../data/url";

const apiService = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

const getFirebaseToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            return await getIdToken(user, true);
        } catch (error) {
            console.error("Error refreshing token:", error);
            throw error;
        }
    } else {
        throw new Error("No user is signed in");
    }
};

apiService.interceptors.request.use(
    async (config) => {
        try {
            const token = await getFirebaseToken();
            if (token) {
                config.headers.token = token;
            }
            return config;
        } catch (error) {
            console.error("Error in request interceptor:", error);
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const token = await getFirebaseToken();
                originalRequest.headers.token = token;
                return apiService(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiService;
