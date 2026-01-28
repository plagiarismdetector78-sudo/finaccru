/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6",
                secondary: "#F9FAFB",
            // AI Chat purple theme colors
            "ai-purple": {
                50: "#FAF5FF",
                100: "#F3E8FF",
                200: "#E9D5FF",
                300: "#D8B4FE",
                400: "#C084FC",
                500: "#A855F7",
                600: "#9333EA",
                700: "#7E22CE",
                800: "#6B21A8",
                900: "#581C87",
            },
            },
            backgroundImage: {
                global: "url('/assets/images/global-background.svg')",
            },
        },
    },
    plugins: [],
};
