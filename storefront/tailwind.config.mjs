// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // desactivamos dark mode automático (puedes cambiar a 'class' si lo quieres manual)
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        tz: {
          primary: "var(--tz-primary)",
          "primary-600": "var(--tz-primary-600)",
          "primary-700": "var(--tz-primary-700)",
          bg: "var(--tz-bg)",
          "bg-soft": "var(--tz-bg-soft)",
          fg: "var(--tz-fg)",
          muted: "var(--tz-muted)",
          border: "var(--tz-border)",
          success: "var(--tz-success)",
          warning: "var(--tz-warning)",
          danger: "var(--tz-danger)",
        },
      },
      borderRadius: {
        tz: "var(--tz-radius)",
      },
      boxShadow: {
        tz: "var(--tz-shadow-md)",
        "tz-sm": "var(--tz-shadow-sm)",
      },
      fontFamily: {
        sans: ["var(--tz-font-sans)"],
      },
      maxWidth: {
        container: "var(--tz-container)",
      },
    },
  },
  plugins: [],
};

export default config;