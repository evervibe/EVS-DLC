import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        bg: '#0a0a0a',
        accent: '#6f42c1',
        charcoal: '#1a1a1a',
        mist: '#1f1b2e',
      },
      fontFamily: {
        display: ['Cinzel Decorative', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #d4af37 0%, #6f42c1 100%)',
        'card-gradient':
          'linear-gradient(145deg, rgba(31, 27, 46, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'inner-ring': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
