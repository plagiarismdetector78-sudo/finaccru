export const baseUrl = import.meta.env.VITE_BASE_URL;
export const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
export const ONBOARDING_URL = import.meta.env.VITE_ONBOARDING_URL;
export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;
export const PROFILE_URL = `${DASHBOARD_URL}account?currentTab=basic-info`;

export const AUTH_API_ROUTES = {
    READ_USER_DATA: "/private/user/read",
    LOGOUT: "/firebase-cookies-logout",
    VERIFY_FIREBASE_COOKIES: "/verify-firebase-cookies",
};
