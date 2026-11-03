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
        brandOrange: '#eb6923',
        brandOrangeHover: '#ff7828',
        brandOrangeDark: '#c44f12',
        brandBlue: '#4a77b3',
        brandBlueGlow: '#38bdf8',
        slate: {
          850: '#111b2e',
          925: '#0a0f1d',
          950: '#060a14',
        }
      },
      boxShadow: {
        '3d-orange': '0 8px 24px -4px rgba(235, 105, 35, 0.35), 0 2px 6px -1px rgba(235, 105, 35, 0.2)',
        '3d-dark': '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 4px 10px -2px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'cad-glow': '0 0 15px 1px rgba(235, 105, 35, 0.25)',
      }
    },
  },
  plugins: [],
}
