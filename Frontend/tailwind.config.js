/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FAF8F0',
          200: '#F5EFE1',
          300: '#EBDDC5',
        },
        charcoal: {
          900: '#1C1E24',
          800: '#2A2E39',
          700: '#3F4555',
          600: '#5F677D',
          500: '#858FA8',
        },
        baby: {
          pink: '#FFE5EC',
          'pink-dark': '#FB6F92',
          rose: '#F8B4C4',
          blue: '#D8EEFE',
          'blue-dark': '#3A86FF',
          sky: '#BEE1E6',
          mint: '#E2ECE9',
          'mint-dark': '#52B788',
          peach: '#FFE5D9',
          'peach-dark': '#F07167',
          lavender: '#E8DFF5',
          'lavender-dark': '#9B5DE5',
          yellow: '#FFF1C5',
          'yellow-dark': '#F39C12',
        },
        gold: {
          400: '#E5A93C',
          500: '#D4AF37',
          600: '#B8860B',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        display: ['var(--font-sniglet)', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 20px 40px rgba(0, 0, 0, 0.06)',
        'soft-xl': '0 25px 60px rgba(0, 0, 0, 0.08)',
        'glow-pink': '0 0 25px rgba(251, 111, 146, 0.25)',
        'glow-blue': '0 0 25px rgba(58, 134, 255, 0.25)',
        'glow-whatsapp': '0 10px 25px rgba(37, 211, 102, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
