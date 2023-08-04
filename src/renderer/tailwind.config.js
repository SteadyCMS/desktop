/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      sans: ["Roboto", "arial", "sans-serif"],
    },
    extend: {
      colors: {
        accent: "#1C7384",
      }
    },
  },
  plugins: [],
}

