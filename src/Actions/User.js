import axios from "axios";
import { toast } from "react-toastify";
import { commonUrl, url } from "../data/url";
import { auth } from "../firebase";
import {
    setPersistence,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    sendPasswordResetEmail,
    confirmPasswordReset,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
    createUserWithEmailAndPassword,
    applyActionCode,
    signInWithCustomToken,
} from "firebase/auth";
import {
    AUTH_API_ROUTES,
    baseUrl,
    LOGIN_URL,
    ONBOARDING_URL,
} from "../constant/endpoints";
import apiResponseMessages from "../constant/apiResponseMessages";

export const sendLink = (user) => async (dispatch) => {
    try {
        dispatch({ type: "RegisterRequest" });
        const { email_id, password, full_name, mobile_number } = user;
        const urlObject = new URL(`${commonUrl}/public/check-user-existence`);
        urlObject.searchParams.append("email_id", email_id);
        window.localStorage.setItem("email_id", email_id);
        axios
            .get(`${urlObject.toString()}`, {})
            .then((data) => {
                if (data.data) {
                    dispatch({
                        type: "RegisterFailure",
                        payload: "User already exists",
                    });
                    toast.error("User already exists");
                }
            })
            .catch((error) => {
                // if error is 404 then user does not exist
                if (error.response.status === 404) {
                    createUserWithEmailAndPassword(auth, email_id, password)
                        .then(async (userCredential) => {
                            // send verification mail.
                            await sendEmailVerification(userCredential.user);
                            const token =
                                await userCredential.user.getIdToken();
                            const urlObject2 = new URL(
                                `${commonUrl}/private/client/onboarding/create`
                            );
                            axios
                                .post(
                                    `${urlObject2.toString()}`,
                                    {
                                        full_name: full_name,
                                        mobile_number: mobile_number,
                                    },
                                    {
                                        headers: {
                                            accept: "application/json",
                                            token: token,
                                        },
                                    }
                                )
                                .then((data) => {
                                    dispatch({
                                        type: "RegisterSuccess",
                                        payload: data.data,
                                    });
                                    toast.success("User Created");
                                    signOut(auth)
                                        .then(() => {
                                            dispatch({
                                                type: "LogoutSuccess",
                                            });
                                            dispatch({
                                                type: "LoadUserRequest",
                                            });
                                            window.location.href = "/confirm";
                                            // Redirect to home page after logout
                                        })
                                        .catch((error) => {
                                            dispatch({
                                                type: "LogoutFailure",
                                                payload: error.message,
                                            });
                                            toast.error(
                                                error.response?.data ||
                                                    error.message
                                            );
                                        });
                                })
                                .catch((error) => {
                                    if (error.response?.status === 422) {
                                        // I will get an array of errors from the backend in details
                                        const errors =
                                            error.response.data.detail;
                                        // I will loop through the array and display the errors
                                        errors?.forEach((err) => {
                                            toast.error(
                                                err.loc[1] + ": " + err.msg
                                            );
                                        });
                                    } else {
                                        toast.error(
                                            error.response?.data ||
                                                error.message
                                        );
                                    }
                                    dispatch({
                                        type: "RegisterFailure",
                                        payload: error.message,
                                    });
                                    // delete user from firebase
                                    userCredential.user.delete();
                                });
                        })
                        .catch((error) => {
                            dispatch({
                                type: "RegisterFailure",
                                payload: error.message,
                            });
                            toast.error(error.response?.data || error.message);
                        });
                } else {
                    dispatch({
                        type: "RegisterFailure",
                        payload: error.message,
                    });
                    toast.error(error.response?.data || error.message);
                }
            });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "RegisterFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const confirmEmail = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ConfirmEmailRequest" });
        const { oobCode } = user;
        applyActionCode(auth, oobCode)
            .then(() => {
                dispatch({ type: "ConfirmEmailSuccess" });
                toast.success("Email Verified");
                dispatch({ type: "LoadUserRequest" });
                window.location.href = "/";
            })
            .catch((error) => {
                dispatch({
                    type: "ConfirmEmailFailure",
                    payload: error.message,
                });
            });
        dispatch({ type: "ConfirmEmailSuccess" });
        toast.success("Email Verified");
    } catch (error) {
        // console.log(error);
        dispatch({ type: "ConfirmEmailFailure", payload: error.message });
        toast.error(error.response?.data || error.message);
    }
};

export const login = (user) => async (dispatch) => {
    const { email_id, mobile_number, password, remember_me } = user;
    try {
        dispatch({ type: "CheckUserRequest" });
        const urlObject = new URL(`${commonUrl}/public/check-user-existence`);
        const urlObject2 = new URL(`${commonUrl}/private/user/read`);
        if (email_id) urlObject.searchParams.append("email_id", email_id);
        if (mobile_number)
            urlObject.searchParams.append("mobile_number", mobile_number);
        const data = await axios.get(`${urlObject.toString()}`);
        dispatch({ type: "LoginRequest" });
        if (email_id) {
            window.localStorage.setItem("email_id", email_id);

            await setPersistence(auth, browserSessionPersistence);
            const user = await signInWithEmailAndPassword(
                auth,
                email_id,
                password
            );
            if (!user.user.emailVerified) {
                dispatch({
                    type: "LoginFailure",
                    payload: "User not verified",
                });
                await sendEmailVerification(user.user);
                toast.error("User not verified! Resent verification link");
                setTimeout(() => {
                    dispatch({ type: "LoadUserRequest" });
                    window.location.href = "/confirm";
                }, 1000);
                return;
            }
            dispatch({
                type: "LoginSuccess",
                payload: user.user.reloadUserInfo,
            });
            toast.success("Login Successfull");
            const token = await user.user.getIdToken();
            const data = await axios.get(`${urlObject2.toString()}`, {
                headers: {
                    accept: "application/json",
                    token: token,
                },
            });
            const status = data.data.status;
            // dispatch({ type: "LoadUserRequest" });
            if (status === 3) {
                if (window.location.pathname !== "/onboard")
                    window.location.href = "/onboard";
            } else if (status === 2) {
                if (window.location.pathname !== "/onboard/bank")
                    window.location.href = "/onboard/bank";
            } else if (status === 1) {
                if (window.location.pathname !== "/onboard/upload")
                    window.location.href = "/onboard/upload";
            } else if (window.location.pathname !== "/")
                window.location.href = "/";
        }
        if (mobile_number) {
            window.localStorage.setItem("mobile_number", mobile_number);
            window.location.href = "/verifyotp";
        }
    } catch (error) {
        // console.log(error);
        if (error?.response?.status === 404) {
            dispatch({ type: "LoginFailure", payload: "User not found" });
            toast.error("User not found. Redirecting to register page");
            setTimeout(() => {
                dispatch({ type: "LoadUserRequest" });
                if (email_id)
                    window.location.href = "/register?email_id=" + email_id;
                else if (mobile_number)
                    window.location.href =
                        "/register?mobile_number=" + mobile_number;
            }, 2000);
        } else {
            dispatch({
                type: "LoginFailure",
                payload: error.response?.data || error.message,
            });
            toast.error(error.response?.data || error.message);
        }
    }
};

export const forgotPassword = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ForgotPasswordRequest" });
        const { email_id } = user;
        await sendPasswordResetEmail(auth, email_id);
        dispatch({ type: "ForgotPasswordSuccess" });
        toast.success("Reset Password Link Sent to your Email");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ForgotPasswordFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const resetPassword = (user) => async (dispatch) => {
    try {
        dispatch({ type: "ResetPasswordRequest" });
        const { newPassword, oobCode } = user;
        await confirmPasswordReset(auth, oobCode, newPassword);
        dispatch({ type: "ResetPasswordSuccess" });
        toast.success("Password Reset Successfull");
        window.location.href = "/";
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ResetPasswordFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const sendOtp = (user) => async (dispatch) => {
    try {
        dispatch({ type: "SendOtpRequest" });
        const { mobile_number } = user;
        const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
        });
        const data = await signInWithPhoneNumber(
            auth,
            mobile_number,
            appVerifier
        );
        const confirmationResult = await data;
        window.confirmationResult = confirmationResult;
        dispatch({ type: "SendOtpSuccess" });
        toast.success("OTP Sent");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "SendOtpFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const verifyOTP = (user) => async (dispatch) => {
    try {
        const { otpString } = user;
        const code = otpString;
        if (window.confirmationResult === undefined) {
            toast.error("Too many attempts");
        }
        const urlObject = new URL(`${commonUrl}/private/user/read`);
        window.confirmationResult
            .confirm(code)
            .then(async (result) => {
                const user = result.user;
                // Check if user is verified
                if (!user.emailVerified) {
                    dispatch({
                        type: "LoginFailure",
                        payload: "User not verified",
                    });
                    await sendEmailVerification(user);
                    toast.error("User not verified! Resent verification link");
                    setTimeout(() => {
                        dispatch({ type: "LoadUserRequest" });
                        window.location.href = "/confirm";
                    }, 1000);
                    return;
                }
                dispatch({
                    type: "LoginSuccess",
                    payload: user.reloadUserInfo,
                });

                // const token = await user.getIdToken();
                // const data = await axios.get(`${urlObject.toString()}`, {
                //     headers: {
                //         'accept': 'application/json',
                //         'token': token,
                //     }
                // });
                // const status = data.data.status;

                toast.success("Login Successfull");
                window.location.href = "/";
                // if (status === 3) {
                //     if (window.location.pathname !== "/onboard") window.location.href = "/onboard";
                // } else if (status === 2) {
                //     if (window.location.pathname !== "/onboard/bank") window.location.href = "/onboard/bank";
                // } else if (status === 1) {
                //     if (window.location.pathname !== "/onboard/upload") window.location.href = "/onboard/upload";
                // }
            })
            .catch((error) => {
                dispatch({
                    type: "LoginFailure",
                    payload: error.message,
                });
                toast.error(error.response?.data || error.message);
            });
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "LoginFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const loadUser = () => async (dispatch) => {
    try {
        // console.log("Dispatching LoadUserRequest");
        dispatch({ type: "LoadUserRequest" });

        await onAuthStateChanged(auth, async (user) => {
            // console.log("onAuthStateChanged triggered", user);

            if (user) {
                const token = await user.getIdToken();
                // console.log("FINVOICE USER ID TOKEN: ", token);

                if (!token) {
                    // console.log("User token not found");
                    dispatch({
                        type: "LoadUserFailure",
                        payload: "User not found",
                    });
                    return;
                }

                if (!user.emailVerified) {
                    // console.log("User email not verified");
                    dispatch({
                        type: "LoadUserFailure",
                        payload: "User not verified",
                    });
                    return;
                }

                const urlObject = new URL(`${commonUrl}/private/user/read`);
                // console.log("Fetching user data from: ", urlObject.toString());

                axios
                    .get(`${urlObject.toString()}`, {
                        headers: {
                            accept: "application/json",
                            token: token,
                        },
                    })
                    .then(async (data) => {
                        // console.log("User API Response: ", data.data);

                        if (data.data.status === 0 && data.data.role === 0) {
                            let isUserTaxRegistered = false;
                            // console.log(
                            //     "Fetching client data from: ",
                            //     `${url}/private/client/read`
                            // );

                            const client = await axios.get(
                                `${url}/private/client/read`,
                                {
                                    headers: {
                                        accept: "application/json",
                                        token: token,
                                    },
                                }
                            );

                            // console.log("Client API Response: ", client.data);

                            if (client.data.vat_url || client.data.vat_string) {
                                isUserTaxRegistered = true;
                            }

                            // console.log(
                            //     "Is User Tax Registered: ",
                            //     isUserTaxRegistered
                            // );

                            await dispatch({
                                type: "LoadUserSuccess",
                                payload: {
                                    ...user.reloadUserInfo,
                                    localInfo: data.data,
                                    clientInfo: client.data,
                                    role: data.data.role,
                                    isUserTaxRegistered: isUserTaxRegistered,
                                },
                            });

                            localStorage.setItem(
                                "isUserTaxRegistered",
                                isUserTaxRegistered
                            );
                        } else {
                            // console.log(
                            //     "User has a different role or status",
                            //     data.data
                            // );

                            await dispatch({
                                type: "LoadUserSuccess",
                                payload: {
                                    ...user.reloadUserInfo,
                                    localInfo: data.data,
                                    role: data.data.role,
                                },
                            });
                        }

                        const status = data.data.status;
                        // console.log("User status: ", status);

                        if ([1, 2, 3].includes(status)) {
                            // console.log("Redirecting to onboarding URL");
                            window.location.replace(ONBOARDING_URL);
                        }
                    })
                    .catch((error) => {
                        dispatch({
                            type: "LoadUserFailure",
                            payload: error.message,
                        });
                    });
            } else {
                // console.log("No authenticated user found");
                dispatch({
                    type: "LoadUserFailure",
                    payload: "User not found",
                });
            }
        });
    } catch (error) {
        dispatch({
            type: "LoadUserFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const resendEmail = () => async (dispatch) => {
    try {
        dispatch({ type: "ResendEmailRequest" });
        const user = auth.currentUser;
        if (!user) {
            dispatch({ type: "ResendEmailFailure", payload: "User not found" });
            return;
        }
        await sendEmailVerification(user);
        dispatch({ type: "ResendEmailSuccess" });
        toast.success("Email Sent");
    } catch (error) {
        // console.log(error);
        dispatch({
            type: "ResendEmailFailure",
            payload: error.response?.data || error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: "LogoutRequest" });

    try {
        const response = await axios.post(
            `${baseUrl}${AUTH_API_ROUTES.LOGOUT}`,
            {},
            { withCredentials: true }
        );

        if (response.status === 200) {
            toast.success(apiResponseMessages.SESSION_COOKIE_CLEARED);
        } else {
            toast.error(apiResponseMessages.SESSION_COOKIE_FAILED_TO_CLEAR);
        }

        await signOut(auth);
        toast.success(apiResponseMessages.USER_LOGOUT_SUCCESSFUL);

        localStorage.removeItem("isUserTaxRegistered");
        dispatch({ type: "LogoutSuccess" });
        dispatch({ type: "LoadUserRequest" });

        window.location.replace(LOGIN_URL);
    } catch (error) {
        dispatch({
            type: "LogoutFailure",
            payload: error.message,
        });
        toast.error(error.response?.data || error.message);
    }
};

// Helper functions
const handleError = (error) => {
    if (error?.response?.data) {
        toast.error(error.response.data);
    } else if (error?.message) {
        toast.error(error.message);
    } else {
        toast.error(apiResponseMessages.SERVER_ERROR);
    }
};

const verifyFirebaseCookies = async () => {
    try {
        // console.log("Verifying Firebase Cookies...");
        const verifyFirebaseCookiesResponse = await axios.post(
            `${baseUrl}${AUTH_API_ROUTES.VERIFY_FIREBASE_COOKIES}`,
            {},
            {
                withCredentials: true,
            }
        );

        // console.log(
        //     "Firebase Cookies Verification Response: ",
        //     verifyFirebaseCookiesResponse
        // );

        if (verifyFirebaseCookiesResponse.status === 200) {
            const customToken = verifyFirebaseCookiesResponse.data;
            // console.log("Custom Token Received: ", customToken);

            if (!customToken) {
                // console.log("No custom token found");
                return { success: false, customToken: null };
            } else {
                return { success: true, customToken };
            }
        }
    } catch (error) {
        handleError(error);
    }
};

export const checkAndLoginWithCustomToken = () => async (dispatch) => {
    try {
        // console.log("Checking and logging in with custom token...");
        const verifyFirebaseCookiesResponse = await verifyFirebaseCookies();
        // console.log("Verification Response: ", verifyFirebaseCookiesResponse);

        if (!verifyFirebaseCookiesResponse?.success) {
            // console.log("Verification failed, redirecting to login");
            window.location.replace(LOGIN_URL);
            return;
        }

        // console.log("Signing in with custom token...");
        const loginUserCredentials = await signInWithCustomToken(
            auth,
            verifyFirebaseCookiesResponse.customToken
        );

        // console.log("Login Credentials: ", loginUserCredentials);

        if (loginUserCredentials.user) {
            // console.log("Setting Firebase session persistence...");
            setPersistence(auth, browserSessionPersistence); // Add Firebase Session Persistence
            dispatch(loadUser());

            if (!sessionStorage.getItem("loginToastShown")) {
                // console.log("Showing login success toast");
                toast.success(apiResponseMessages.LOGIN_SUCCESSFUL);
                sessionStorage.setItem("loginToastShown", "true");
            }
        }
    } catch (error) {
        handleError(error);
    }
};
