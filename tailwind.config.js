/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#EBE5DD',
          300: '#DDD4C8',
        },
        beige: {
          100: '#F3EFE6',
          200: '#E8DEC8',
          300: '#D4C5B9',
          400: '#C4B4A5',
        },
        coffee: {
          100: '#7A6255',
          200: '#5C4639',
          300: '#3C2A21',
          400: '#2D1E18',
          500: '#1F130E',
        },
        gold: {
          100: '#F7E9BE',
          200: '#E6C875',
          300: '#D4AF37',
          400: '#C5A059',
          500: '#A38038',
        },
        softblack: '#1A1A1A',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(60, 42, 33, 0.08)',
        'glow': '0 0 35px rgba(212, 175, 55, 0.25)',
        'floating': '0 20px 40px -15px rgba(60, 42, 33, 0.12)',
      },
      animation: {
        'candle-glow': 'glow 4s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' },
          '100%': { boxShadow: '0 0 45px rgba(212, 175, 55, 0.45)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
