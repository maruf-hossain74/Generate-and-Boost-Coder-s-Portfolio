/** @type {import('tailwindcss').Config} */
function shade(varName) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgba(var(${varName}), ${opacityValue})`
      : `rgb(var(${varName}))`;
}

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "app-bg": "var(--color-app-bg)",
        "primary-dark": "var(--color-primary-dark)",
        "sidebar-bg": "var(--color-sidebar-bg)",
        "panel-bg": "var(--color-panel-bg)",
        "card-bg": "var(--color-card-bg)",
        "input-bg": "var(--color-input-bg)",
        "border-dim": "var(--color-border-dim)",
        "border-strong": "var(--color-border-strong)",
        "text-muted": "var(--color-text-muted)",
        "accent-cyan": "var(--color-accent-cyan)",
        "accent-green": "var(--color-accent-green)",
        "accent-orange": "var(--color-accent-orange)",
        "accent-purple": "var(--color-accent-purple)",
        gold: "var(--color-gold)",
        silver: "var(--color-silver)",
        bronze: "var(--color-bronze)",
        gray: {
          200: shade("--gray-200"),
          300: shade("--gray-300"),
          400: shade("--gray-400"),
          500: shade("--gray-500"),
          600: shade("--gray-600"),
          700: shade("--gray-700"),
          800: shade("--gray-800"),
          900: shade("--gray-900"),
        },
        white: shade("--white"),
        black: shade("--black"),
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
