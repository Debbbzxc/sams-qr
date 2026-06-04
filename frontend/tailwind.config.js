/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#059669",
        accent: "#14B8A6",
        background: "#F5FAF7",
        surface: "#FFFFFF",
        ink: "#0F172A",
      },
      boxShadow: {
        card: "0 18px 45px rgba(15, 23, 42, 0.08)",
        soft: "0 24px 70px rgba(15, 23, 42, 0.12)",
        green: "0 14px 28px rgba(5, 150, 105, 0.22)",
      }
    },
  },
  plugins: [],
}
