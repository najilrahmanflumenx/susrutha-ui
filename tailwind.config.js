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
        primary: {
          DEFAULT: '#2D0A0A', // Deep Logo Mahogany/Maroon (Replaces Green)
          light: '#4A1212',
          dark: '#1A0505',
          container: '#3B0F0F',
        },
        gold: {
          DEFAULT: '#FCAB28', // Susrutha Logo Gold/Amber
          light: '#FFD385',
          dark: '#D98908',
          muted: '#EBC07B',
        },
        bronze: {
          DEFAULT: '#B87B1E',
          dark: '#8C5B0D',
        },
        surface: {
          DEFAULT: '#FBF9F4', // Warm Luxury Cream
          elevated: '#FAF5EB',
          container: '#F2EBE0',
          card: '#FFFFFF',
          dark: '#1A0505',
        },
        text: {
          primary: '#240808',
          secondary: '#6E564F',
          muted: '#9E857C',
          inverse: '#FBF9F4',
        },
        status: {
          success: '#27AE60',
          warning: '#F39C12',
          error: '#C0392B',
          info: '#2980B9',
        }
      },
      fontFamily: {
        display: ['EB Garamond', 'serif'],
        sans: ['Hanken Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(252, 171, 40, 0.3)',
        'glow-mahogany': '0 20px 40px -15px rgba(45, 10, 10, 0.18)',
        'glass': '0 8px 32px 0 rgba(45, 10, 10, 0.08)',
      },
    },
  },
  plugins: [],
};
