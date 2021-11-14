// const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ["Poppins", "sans-serif"],
      // },
      colors: {
        gray: {
          light: "#353535",
          dark: "#080707",
          900: "#1A1A1A",
        },
        accent: "#FEB00A",
      },
      letterSpacing: {
        widest: "0.125rem",
      },
      lineHeight: {
        "extra-loose": "2.5",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [], //require('@tailwindcss/forms')],
};
