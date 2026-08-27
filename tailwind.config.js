/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        altrium: {
          light: '#E7F0F8',
          blue: '#1A2F45',
          orange: '#F68B1F',
        }
      }
    },
  },
  plugins: [],
}
