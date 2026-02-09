/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'bg-cream', 'text-cream', 'text-text-dark', 'text-text-light',
    'bg-text-dark', 'bg-dark-beige', 'font-heading', 'font-body',
  ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0.7', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0.85', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
      },
      colors: {
        cream: '#faf8f5',
        beige: '#f0ebe3',
        'dusty-pink': '#dfc9b8',
        'sage-green': '#b5b0a4',
        'dark-beige': '#c4b5a4',
        'gold-accent': '#c4a35a',
        'text-dark': '#4f4235',
        'text-light': '#7a6b5c',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'cursive'],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
};
