/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      online: {
        darkTeal: "#005577",
        darkBlue: "#10243e",
        orange: "#fab759",
        blueGray: "#131620",
        snowWhite: "#edf6ff",
        white: "#fdfdfe",
      },
    },
    extend: {},
  },
  plugins: [],
};
