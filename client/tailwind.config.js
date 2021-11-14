// const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  // mode: "jit",
  // purge: ["**/*.html", "**/*.scss", "**/*.pcss", "**/*.jsx", "**/*.js"],
  theme: {
    colors: {
      gray: {
        50: "#F0F0F0",
        100: "#F8F8F8",
        200: "#E0E0E0",
        300: "#C8C8C8",
        400: "#888888",
        500: "#707070",
        600: "#505050",
        700: "#383838",
        800: "#282828",
        900: "#101010",
      },
      white: "white",
      black: "#1A140E",
      transparent: "transparent",
      balance: {
        basic: {
          dark: "#C2DA8D",
          sec: "#E1A761",
          ter: "#3D3229",
          dgray: "#686C7A",
          gray: "#C4C4C4",
          black: "#261C15",
          digblue: "#6478E9",
          default: "#DADECD",
        },
        digblue: {
          light: "#5568d2",
          dark: "#283a99",
          sat: "#2741cd",
          desat: "#3f51b5",
          gray: "#7a7a7a",
          brighten: "#4c62da",
          default: "#3349c1",
        },
        pshades: {
          light: "#634a36",
          dark: "#211912",
          sat: "#47301f",
          desat: "#3d3229",
          gray: "#3d3229",
          brighten: "#3d3229",
        },
        sshades: {
          light: "#f2aa53",
          dark: "#d0790f",
          sat: "#fb9417",
          desat: "#e3922f",
          gray: "#898989",
          brighten: "#ffac3c",
        },
        tershades: {
          light: "#d5e2b9",
          dark: "#a9c471",
          sat: "#c2da8d",
          desat: "#bccb9c",
          gray: "#d7dbc5",
          brighten: "#d8ecae",
        },
        buttonbg: {
          digblue: "#3349c1",
          digbluelighter: "#5568d2",
          success: "#71c475",
          successlighter: "#93cc96",
          submit: "#fb9417",
          submitlighter: "#fb9417",
          reset: "#47301f",
          resetlighter: "#634a36",
          close: "#e74a33 ",
          closelighter: "#e06a58 ",
          neutral: "#3d3229",
          disabled: "#898989",
        },
        buttontext: {
          digblue: "#fff",
          success: "#fff",
          submit: "#fff",
          reset: "#211912",
          close: "#fff",
          neutral: "#fff",
          disabled: "#d8ecae",
        },
      },
    },

    extend: {
      spacing: {
        "1/3": "33%",
        "2/3": "66%",
      },
      boxShadow: {
        button: "0 0 0 1px #47301f",
      },
      outline: {
        light: "3px solid #fffffe; outline-offset: 3px; outline-style: dashed",
        dark: "3px solid #283a99; outline-offset: 3px; outline-style: dashed",
      },
      fontFamily: {
        sans: [
          "Silka",
          "Montserrat",
          "Nunito",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        std: ["Poppins", "Nunito", "Roboto", "sans-serif"],
        serif: ['"DejaVu Serif"', "Georgia", "serif"],
      },
    },
    // Replace the default Tailwind config here
  },
  variants: {
    extend: {},
  },
  plugins: [], //require('@tailwindcss/forms')],
};
