/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'da': {
          'green': '#1E5E4B',
          'green-hover': '#174A3B',
          'green-light': '#E8F5F0',
          'deep-blue': '#334156',
          'deep-blue-dark': '#283545',
          'black': '#1A1A1A',
          'grey': '#28282F',
          'light-grey': '#4D4D4D',
          'bg': '#F3F4F6',
          'card': '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
