/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./assets/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary UC Davis brand colors (from the official brand guide)
        'ucd-blue': '#022851',   // UC Davis Blue
        'ucd-blue-90': '#033266', // blue, 90% opacity
        'ucd-blue-70': '#355B85', // blue, 70% opacity
        'ucd-blue-10': '#CDD6E0', // blue, 10% opacity
        'ucd-gold': '#FDB927',   // UC Davis Gold
        'ucd-gold-70': '#FFD24C', // gold, 70% opacity
        'ucd-gold-10': '#FFF9E5', // gold, 10% opacity

        // Optionally, add neutrals or other supporting colors
        'ucd-gray-dark': '#4C4C4C',   // Dark Gray
        'ucd-gray-light': '#E5E5E5',  // Light Gray
        'gunrock': '0047BA', // Gunrock blue
        'bodega': '#003A5D', // Bodega blue
        'doubledecker': '#C10230', // Double Decker Red
        'redwood': '#266041', // Redwood Green
        
      },
    },
  },
  plugins: [],
}