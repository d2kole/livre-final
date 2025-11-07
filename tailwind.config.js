/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#e7f1f3',
          100: '#d0e3e7',
          200: '#a1c7cf',
          300: '#72abb7',
          400: '#438f9f',
          500: '#2E8B57', // Primary teal accent
          600: '#256f46',
          700: '#1c5335',
          800: '#133723',
          900: '#0a1b12',
        },
      },
    },
  },
  plugins: [],
};
