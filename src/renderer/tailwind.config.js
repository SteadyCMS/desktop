/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      sans: ["Roboto", "Arial", "sans-serif"],
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: "#29C2E1",
          glow: "#0A2E36",
        },
        dark: "#121B1D",
        gray: "#DFDFDF",
      }
    },
  },
  plugins: [],
}

