/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        online: {
          orange: "#fab759",
          darkTeal: "#005476",
          darkBlue: "#10243e",
          blueGray: "#131620",
          snowWhite: "#edf6ff",
          white: "#fdfdfe",
        },
      },
    },
  },
  plugins: [],
};
