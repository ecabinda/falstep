/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#201511",
        secondary: "#4a3226",
        tertiary: "#f3efe8",
        canvas: "#fbfbfb",
        border: "#d2c3bf"
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["Hanken Grotesk", "sans-serif"],
      }
    },
  },
  plugins: [],
}
