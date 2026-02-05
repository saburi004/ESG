import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                navy: {
                    900: "#0a0f1c", // Very dark navy
                    800: "#111827", // Slightly lighter
                    700: "#1f2937",
                },
                eco: {
                    green: "#00ff88", // Vibrant eco green
                    light: "#4ade80",
                    dark: "#059669",
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00ff88' },
                    '100%': { boxShadow: '0 0 20px #00ff88, 0 0 10px #4ade80' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
