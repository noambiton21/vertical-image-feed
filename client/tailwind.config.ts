import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ff4d6d',
        bg: '#0a0a0c',
        'slide-bg': '#15151a',
      },
      backgroundImage: {
        'slide-overlay':
          'linear-gradient(to bottom, rgba(0,0,0,.42) 0%, transparent 16%, transparent 52%, rgba(0,0,0,.28) 74%, rgba(0,0,0,.82) 100%)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.4)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        burstHeart: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '20%': { transform: 'scale(1.15)', opacity: '0.95' },
          '45%': { transform: 'scale(1)', opacity: '0.95' },
          '100%': { transform: 'scale(1.25) translateY(-30px)', opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.3s linear infinite',
        heartPop: 'heartPop 0.45s cubic-bezier(0.2, 1.4, 0.4, 1)',
        burstHeart: 'burstHeart 0.8s cubic-bezier(0.2, 1.3, 0.4, 1) forwards',
        fadeUp: 'fadeUp 0.5s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
