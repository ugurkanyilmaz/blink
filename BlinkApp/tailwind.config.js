/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#00FFFF',
        secondary: '#1A1A2E',
        dark: '#222831',
        light: '#F0F0F0',
      },
    },
  },
  plugins: [],
};
