const apiResponseMessages = {
    // Registration/Login messages
    LOGIN_SUCCESSFUL: "Login successful.",

    // User-related messages
    USER_NOT_FOUND: "User not found.",
    USER_LOGOUT_SUCCESSFUL: "User logged out successfully.",

    // Token-related messages
    INVALID_TOKEN: "Invalid or expired token.",
    TOKEN_REFRESH_SUCCESSFUL: "Token refreshed successfully.",
    TOKEN_EXPIRED: "Token has expired.",
    ACCESS_DENIED: "Access denied. Invalid token.",

    // Onboarding messages
    COMPANY_DETAILS_SAVED_SUCCESSFULLY: "Company Details Saved Successfully.",
    COMPANY_DETAILS_FAILED_TO_SAVE:
        "Failed to Save Company Details. Please try again later.",

    // Cookie messages
    SESSION_COOKIE_STORED: "Session Cookie Stored.",
    SESSION_COOKIE_FAILED_TO_STORED:
        "Session Cookie failed to Stored. Please try again.",
    SESSION_COOKIE_CLEARED: "Session Cookie Cleared Successfully.",
    SESSION_COOKIE_FAILED_TO_CLEAR:
        "Session Cookie Failed to Clear. Please try again.",

    // Verification messages
    EMAIL_VERIFICATION_SUCCESSFUL: "Email verified successfully.",
    EMAIL_VERIFICATION_SENT: "Verification Email sent.",
    EMAIL_ALREADY_VERIFIED: "Email is already verified.",
    EMAIL_VERIFICATION_FAILED: "Email verification failed.",
    EMAIL_NOT_VERIFIED: "Email not verified",

    // Miscellaneous messages
    UNAUTHORIZED_ACCESS: "Unauthorized access. Please log in to continue.",
    FORBIDDEN: "Forbidden. You don't have permission to access this resource.",
    SERVER_ERROR: "Something went wrong. Please try again later.",
    MISSING_REQUIRED_FIELDS: "Required fields are missing.",
    INVALID_REQUEST: "Invalid request.",
    TOO_MANY_REQUEST: "Too Many Request. Please try again later",
};

export default apiResponseMessages;
