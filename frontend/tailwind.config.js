/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0D1117',
        'card-bg': '#161B22',
        'border': '#30363D',
        'text-primary': '#C9D1D9',
        'text-secondary': '#8B949E',
        'text-muted': '#6E7681',
        'accent': '#64FFDA',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
