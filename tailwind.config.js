/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        cream: '#f5f0e8',
        warm: '#ede5d4',
        brown: {
          DEFAULT: '#2c1f14',
          mid: '#5a3e28',
          light: '#8b6347',
        },
        gold: {
          DEFAULT: '#c9922a',
          light: '#e8b84b',
        }
      }
    },
  },
  plugins: [],
}
