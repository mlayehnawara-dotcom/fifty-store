/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 60px -20px rgba(69, 18, 44, 0.38)',
        glow: '0 0 0 1px rgba(236, 72, 153, 0.28), 0 0 42px rgba(249, 115, 22, 0.28)',
      },
      keyframes: {
        'page-enter': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'page-enter': 'page-enter 0.35s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        'bounce-soft': 'bounceSoft 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
