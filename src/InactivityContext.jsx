import React, { createContext, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./Actions/User";

const INACTIVITY_TIME_LIMIT = 60 * 60 * 1000; // 60 minutes

const InactivityContext = createContext();

export const InactivityProvider = ({ children }) => {
    const dispatch = useDispatch();
    const logoutTimerRef = useRef(null);
    const lastActivityTimeRef = useRef(Date.now());

    const resetTimer = () => {
        lastActivityTimeRef.current = Date.now();

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }

        logoutTimerRef.current = setTimeout(
            handleLogout,
            INACTIVITY_TIME_LIMIT
        );
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            // Check if the time passed while the document was hidden exceeds the inactivity limit
            const timeSinceLastActivity =
                Date.now() - lastActivityTimeRef.current;

            if (timeSinceLastActivity >= INACTIVITY_TIME_LIMIT) {
                handleLogout();
            } else {
                // If the time is within the limit, reset the timer
                resetTimer();
            }
        }
    };

    useEffect(() => {
        // Attach event listeners to reset timer on user activity
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Start the timer for the first time
        resetTimer();

        // Cleanup listeners and timer on unmount
        return () => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []); // Empty dependency array

    return (
        <InactivityContext.Provider value={{ resetTimer }}>
            {children}
        </InactivityContext.Provider>
    );
};

export const useInactivity = () => {
    return useContext(InactivityContext);
};
