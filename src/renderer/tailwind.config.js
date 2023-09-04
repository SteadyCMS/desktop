/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Ubuntu", "Cantarell", 
             "Noto Sans", "sans-serif", "BlinkMacSystemFont", "Oxygen", "Open Sans", "Helvetica Neue"],
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: "#29C2E1",
          glow: "#0A2E36",
        },
        dark: "#121B1D",
        light: {
          gray: "#DFDFDF",
        },
        tint: {
          0: "#f8fafa",
          1: "#eaeeef",
          2: "#dbe2e3",
          3: "#cbd5d7",
          4: "#b9c6c9",
          5: "#a6b6b9",
          6: "#8fa3a8",
          7: "#758d92",
          8: "#5c6f73",
          9: "#364144",
          10: "#202628",
          11: "#0F1213",
        }
      }
    },
  },
  plugins: [],
}

