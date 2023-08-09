/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      sans: ["Roboto", "arial", "sans-serif"],
    },
    extend: {
      colors: {
        // scms: {
        //   light: {
        //     blue: "#29C2E1",

        //   },
        //   dark: {
        //     blue: "#0A2E36",

        //   }

        // },
        

        accent: "#1C7384",
      }
    },
  },
  plugins: [],
}

