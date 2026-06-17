/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ye line zaroori hai dark mode memory ke liye
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandOrange: '#eb6923', // Logo Orange
        brandBlue: '#4a77b3',   // Logo Blue
      }
    },
  },
  plugins: [],
}
