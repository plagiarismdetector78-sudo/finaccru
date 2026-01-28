// AI Chat Configuration
export const ENABLE_AI_CHAT = true;

export const AI_MOCK_MODE = false; // Set to true for testing without backend

export const AI_CHAT_CONFIG = {
    MAX_MESSAGE_LENGTH: 500,
    TYPING_INDICATOR_DELAY: 1000,
    AUTO_SCROLL_DELAY: 100,
    VOICE_RECORDING_MAX_DURATION: 120, // seconds
};

// N8N Webhook Configuration
// Always use proxy path - Vite will forward to the correct server
export const N8N_WEBHOOK_URL = "/n8n-webhook";
export const N8N_AUTH_TOKEN = import.meta.env.VITE_N8N_AUTH_TOKEN || "";

// Firestore Collections
export const FIRESTORE_COLLECTIONS = {
    AI_MESSAGES: "ai_messages",
    USER_CONTEXTS: "user_contexts",
};

