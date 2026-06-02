import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
        panel: '0 18px 40px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        primary: '#0062FF',
        surface: '#F8FAFF',
      },
    },
  },
  plugins: [forms],
};
