/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shimmer-slide':
          'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        /** Aura del botón flotante WhatsApp (#293d51) — box-shadow para verla en fondos claros y oscuros */
        'whatsapp-aura': 'whatsapp-aura 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'whatsapp-aura': {
          '0%': { boxShadow: '0 0 0 0 rgba(41, 61, 81, 0.55)' },
          '85%': { boxShadow: '0 0 0 16px rgba(41, 61, 81, 0.08)' },
          '100%': { boxShadow: '0 0 0 20px rgba(41, 61, 81, 0)' },
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      colors: {
        accent: {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'spektr-cyan': {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
        },
      },
    },
  },
  plugins: [],
}
