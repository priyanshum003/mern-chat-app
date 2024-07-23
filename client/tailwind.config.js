/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode : false,
  theme: {
    extend: {
      backgroundColor : {
        'dark-bg' : '#001529',
        'light-bg' : '#f3f4f6'
      }
    },
  },
  plugins: [],
}