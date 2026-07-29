/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Veda Clinical Luxury Color Palette
        primary: {
          DEFAULT: '#9F0311',
          hover: '#83020E',
          active: '#66010B',
          container: '#C22626',
          onContainer: '#FFDBD7',
        },
        crimson: {
          DEFAULT: '#C22626',
          hover: '#9F0311',
          active: '#83020E',
          light: '#FFF8F7',
          dark: '#410003',
          50: '#FFF8F7',
          100: '#FFDBD7',
          200: '#FFB4AC',
          300: '#E3BEBA',
          400: '#C22626',
          500: '#9F0311', // Deep Crimson Primary
          600: '#83020E',
          700: '#66010B',
          800: '#410003',
          900: '#1E1B1B',
        },
        secondary: {
          DEFAULT: '#F9A825',
          hover: '#FCAB28',
          active: '#835400',
        },
        ochre: {
          DEFAULT: '#F9A825', // Royal Amber Gold
          50: '#FFFDF5',
          100: '#FFEDC2',
          200: '#FFDDB5',
          300: '#FFB957',
          400: '#FCAB28',
          500: '#F9A825',
          600: '#D98200',
          700: '#835400',
          800: '#643F00',
          900: '#2A1800',
        },
        tertiary: {
          DEFAULT: '#2E7D32',
          container: '#24742A',
        },
        botanical: {
          50: '#F4FBF3',
          100: '#A4F79D',
          200: '#88D982',
          300: '#4CA34B',
          400: '#2E7D32',
          500: '#24742A', // Herbal Emerald Green
          600: '#005312',
          700: '#005B14',
          800: '#003A0B',
          900: '#002204',
          950: '#001402',
        },
        ivory: {
          50: '#FDFBF7', // Warm Silk Cream Canvas
          100: '#FFF8F7',
          200: '#F4ECEC',
          300: '#EEE6E6',
          400: '#E8E1E0',
          500: '#E3BEBA',
          600: '#8F706C',
          700: '#5B403D',
          800: '#33302F',
          900: '#1E1B1B', // Rich Espresso Charcoal
        },
        surface: {
          DEFAULT: '#FDFBF7',
          dim: '#E0D8D8',
          bright: '#FFF8F7',
          container: '#F4ECEC',
          high: '#EEE6E6',
          highest: '#E8E1E0',
        },
        // Legacy compatibility mappings aligned to Crimson & Ochre Hero Palette
        'sus-crimson': '#C22626',
        'sus-gold': '#FCAB28',
        'sus-gold-soft': '#FFDDB5',
        'sus-gold-bright': '#FFC86B',
        'sus-cream': '#FDFBF7',
        'sus-sand': '#F8F4EC',
        'sus-border': '#E3BEBA',
        'sus-ink': '#1E1B1B',
        'sus-muted': '#5B403D',
        'sus-green-deep': '#003A0B',
        'sus-green': '#2E7D32',
        'sus-terracotta': '#C86D4B',
      },


      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 10px rgba(18, 51, 37, 0.04)',
        'soft-md': '0 6px 24px rgba(18, 51, 37, 0.07)',
        'soft-lg': '0 16px 40px rgba(18, 51, 37, 0.10)',
        'spa-glow': '0 8px 24px rgba(45, 106, 79, 0.20)',
        'ochre-glow': '0 8px 24px rgba(212, 163, 89, 0.25)',
        'glass-card': '0 8px 32px 0 rgba(11, 34, 24, 0.06)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};


