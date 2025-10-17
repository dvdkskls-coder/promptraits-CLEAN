/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        foreground: 'var(--fg)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        border: 'var(--border)',
      },
      fontFamily: {
        heading: ['"Saira Extra Condensed"', 'system-ui', 'sans-serif'],
        body: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}