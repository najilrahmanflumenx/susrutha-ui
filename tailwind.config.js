/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sus-green-deep': '#123524',
        'sus-green': '#1E5631',
        'sus-green-soft': '#3E7C59',
        'sus-gold': '#B8860B',
        'sus-gold-soft': '#D4AF6A',
        'sus-cream': '#F6F1E7',
        'sus-sand': '#E9DFC9',
        'sus-terracotta': '#B4532A',
        'sus-ink': '#1C1B17',
        'sus-muted': '#6B6659',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
