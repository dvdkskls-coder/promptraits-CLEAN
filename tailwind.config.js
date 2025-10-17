/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Oswald"', 'system-ui', 'sans-serif'],
        body: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}