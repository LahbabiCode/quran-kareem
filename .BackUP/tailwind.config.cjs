/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx,js,jsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1faf4',
          100: '#dff3e0',
          200: '#bde6c1',
          300: '#8ed69a',
          400: '#53b66a',
          500: '#0B6B3A',
          DEFAULT: '#0B6B3A',
          600: '#095c33',
          700: '#074a27',
          800: '#05361b'
        },
        accent: {
          DEFAULT: '#C9A04A'
        },
        'soft-bg': '#F6F4EE',
        'muted-gray': '#9CA3AF',
        'dark-text': '#0F1722'
      },
      fontFamily: {
        arabic: ['"Noto Naskh Arabic"', 'Tajawal', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
