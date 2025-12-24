/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cern-blue': '#0033A0',
        'pion-red': '#E74C3C',
        'kaon-blue': '#3498DB',
        'muon-green': '#2ECC71',
      }
    },
  },
  plugins: [],
}
