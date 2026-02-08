import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                primary: {
                    DEFAULT: "#3b82f6",
                    light: "#60a5fa",
                    dark: "#2563eb",
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#10b981",
                    light: "#34d399",
                    dark: "#059669",
                },
                surface: {
                    DEFAULT: "rgba(255,255,255,0.03)",
                    hover: "rgba(255,255,255,0.06)",
                    active: "rgba(255,255,255,0.08)",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "float-slow": "float 8s ease-in-out infinite",
                "float-slower": "float 10s ease-in-out infinite",
                "pulse-glow": "pulse-glow 4s ease-in-out infinite",
                "spin-slow": "spin 20s linear infinite",
                "aurora": "aurora-shift 15s ease-in-out infinite",
                "gradient-border": "gradient-rotate 4s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.4" },
                    "50%": { opacity: "0.8" },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
