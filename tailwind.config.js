/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep night background system
        night: {
          950: '#06080f',
          900: '#0a0e1a',
          850: '#0d1220',
          800: '#111726',
          700: '#1a2236',
        },
        // Warm gold accent
        gold: {
          50: '#fbf6e9',
          100: '#f6ecc9',
          200: '#ecd896',
          300: '#e3c463',
          400: '#d9b54a',
          500: '#c99b2e',
          600: '#a87d22',
        },
        // Subtle pitch green
        pitch: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Soft sky / celeste
        sky2: {
          300: '#7dd3fc',
          400: '#38bdf8',
        },
        // Warm white
        cream: '#f4f1ea',
      },
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', '"Inter var"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
        'glass-lg': '0 24px 64px -16px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'gold-glow': '0 0 0 1px rgba(217, 181, 74, 0.2), 0 8px 40px -8px rgba(217, 181, 74, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f6ecc9 0%, #d9b54a 45%, #a87d22 100%)',
        'night-radial':
          'radial-gradient(120% 120% at 50% 0%, #131a2e 0%, #0a0e1a 45%, #06080f 100%)',
      },
      keyframes: {
        'live-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'score-pop': {
          '0%': { transform: 'scale(1)', color: 'inherit' },
          '30%': { transform: 'scale(1.35)', color: '#e3c463' },
          '100%': { transform: 'scale(1)', color: 'inherit' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 1.4s ease-in-out infinite',
        'score-pop': 'score-pop 0.6s ease-out',
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
