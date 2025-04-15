/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#faf6f2',
          100: '#f5ede6',
          200: '#ebd9cc',
          300: '#d9b8a3',
          400: '#c4927a',
          500: '#b3745a',
          600: '#a05c4a',
          700: '#85493d',
          800: '#6f3d35',
          900: '#5d342f',
        },
      },
    },
  },
  plugins: [],
} 