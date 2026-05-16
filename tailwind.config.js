/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1a1a2e',
        surface: '#16213e',
        primary: '#e94560',
        secondary: '#0f3460',
        accent: '#f5c518',
        common: '#a0a0a0',
        rare: '#4da6ff',
        epic: '#c471ed',
        legendary: '#ffd700',
        energy: '#00e5ff',
        danger: '#ff4757',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'fall': 'fall linear forwards',
        'shake': 'shake 0.5s ease-in-out',
        'crack': 'crack 0.3s ease-in-out forwards',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'float-up': 'float-up 1s ease-out forwards',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        // Battle theme animations
        'enemy-glow': 'enemy-glow 2s ease-in-out infinite',
        'card-shatter': 'card-shatter 0.5s ease-out forwards',
        'creature-idle': 'creature-idle 1.5s ease-in-out infinite',
        'creature-lunge': 'creature-lunge 0.3s ease-out',
        'creature-hit': 'creature-hit 0.4s ease-in-out',
        'creature-celebrate': 'creature-celebrate 0.6s ease-out',
        'flag-wave': 'flag-wave 2s ease-in-out infinite',
        'spark-burst': 'spark-burst 0.6s ease-out forwards',
        'fire-pulse': 'fire-pulse 0.5s ease-in-out infinite',
        'story-fade': 'story-fade 0.8s ease-in-out',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(var(--fall-distance))', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        crack: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px var(--glow-color, #f5c518)' },
          '50%': { boxShadow: '0 0 20px var(--glow-color, #f5c518), 0 0 40px var(--glow-color, #f5c518)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'enemy-glow': {
          '0%, 100%': { boxShadow: '0 0 4px rgba(147, 51, 234, 0.3), 0 0 8px rgba(147, 51, 234, 0.1)' },
          '50%': { boxShadow: '0 0 12px rgba(147, 51, 234, 0.6), 0 0 24px rgba(147, 51, 234, 0.3)' },
        },
        'card-shatter': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '30%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'creature-idle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'creature-lunge': {
          '0%': { transform: 'translateX(0) scale(1)' },
          '40%': { transform: 'translateX(12px) scale(1.2)' },
          '100%': { transform: 'translateX(0) scale(1)' },
        },
        'creature-hit': {
          '0%': { transform: 'translateX(0)' },
          '30%': { transform: 'translateX(-8px)' },
          '60%': { transform: 'translateX(4px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'creature-celebrate': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-16px) scale(1.2)' },
          '50%': { transform: 'translateY(0) scale(0.9)' },
          '70%': { transform: 'translateY(-8px) scale(1.1)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'flag-wave': {
          '0%, 100%': { transform: 'skewX(-2deg)' },
          '50%': { transform: 'skewX(2deg)' },
        },
        'spark-burst': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--sx), var(--sy)) scale(0)', opacity: '0' },
        },
        'fire-pulse': {
          '0%, 100%': { textShadow: '0 0 4px #e94560, 0 0 8px #e94560' },
          '50%': { textShadow: '0 0 8px #ff6b6b, 0 0 16px #ff6b6b, 0 0 24px #e94560' },
        },
        'story-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
