/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#090d14",
        "primary-dark": "#0a0f1a",
        "sidebar-bg": "#0c121e",
        "panel-bg": "#121927",
        "card-bg": "#1a2235",
        "input-bg": "#1a1a1a",
        "border-dim": "rgba(255, 255, 255, 0.05)",
        "border-strong": "rgba(255, 255, 255, 0.1)",
        "text-muted": "#8f9bb3",
        "accent-cyan": "#13d4f1",
        "accent-green": "#10b981",
        "accent-orange": "#f97316",
        "accent-purple": "#a855f7",
        gold: "#f59e0b",
        silver: "#cbd5e1",
        bronze: "#d97706",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
