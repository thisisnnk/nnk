import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens — resolve to CSS variables so light/dark switching
        // flows through both Tailwind classes and inline var() styles.
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        accent: '#00AAFF',
        'accent-fg': '#FFFFFF',
        // Legacy aliases kept for Creatives page compatibility
        dark: 'var(--dark)',
        light: 'var(--light)',
        'dark-2': 'var(--surface)',
        'dark-3': 'var(--surface-2)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Poppins', 'sans-serif'],
        body: ['var(--font-body)', 'Poppins', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-amber': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        bounce2: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        // Legacy — used by Creatives page
        pulse2: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-amber': 'pulse-amber 2s ease-in-out infinite',
        bounce2: 'bounce2 1.5s ease-in-out infinite',
        pulse2: 'pulse2 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
      },
      boxShadow: {
        'glow-accent': '0 0 40px rgba(0,170,255,0.2), 0 0 80px rgba(0,170,255,0.06)',
        'glow-sm': '0 0 20px rgba(0,170,255,0.12)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}
export default config
