import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Separate Firebase instance for AI Chat (connects to YOUR Firestore)
const aiChatFirebaseConfig = {
    apiKey: import.meta.env.VITE_AI_CHAT_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_AI_CHAT_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_AI_CHAT_FIREBASE_PROJ_ID,
    storageBucket: import.meta.env.VITE_AI_CHAT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_AI_CHAT_FIREBASE_MSG_SENDER_ID,
    appId: import.meta.env.VITE_AI_CHAT_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_AI_CHAT_FIREBASE_MEASUREMENT_ID,
};

// Initialize separate Firebase app for AI Chat
export const aiChatApp = initializeApp(aiChatFirebaseConfig, "aiChatApp");
export const aiChatStore = getFirestore(aiChatApp);

console.log('🤖 AI Chat Firebase initialized:', {
    projectId: aiChatFirebaseConfig.projectId,
    authDomain: aiChatFirebaseConfig.authDomain
});

