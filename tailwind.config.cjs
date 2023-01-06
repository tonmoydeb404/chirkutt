const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "900px",
      // => @media (min-width: 900px) { ... }
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      colors: {
        // site colors
        primary: colors.blue,
        secondary: colors.slate,
        neutral: colors.neutral,
        // action colors
        danger: colors.red,
        success: colors.green,
        warning: colors.yellow,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
