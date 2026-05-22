/** @type {import('tailwindcss').Config} */
module.exports = {
  // THIS IS THE MISSING LINE:
  presets: [require("nativewind/preset")],
  
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}