/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F7F5F0',
        graphite: '#1A1917',
        'graphite-soft': '#3A3835',
        champagne: '#B8A080',
        'champagne-light': '#D4C4A8',
        'champagne-dark': '#8C7A60',
        muted: '#9A958D',
        border: '#E8E4DC',
        text: '#2C2A28',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(44px, 6.5vw, 96px)', { lineHeight: '1.05' }],
        'section': ['clamp(36px, 4vw, 56px)', { lineHeight: '1.1' }],
        'cta': ['clamp(40px, 5vw, 72px)', { lineHeight: '1.1' }],
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(.16, 1, .3, 1)',
      },
      maxWidth: {
        'container': '1400px',
      },
    },
  },
  plugins: [],
}