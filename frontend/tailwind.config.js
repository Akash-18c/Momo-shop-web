/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#c9a84c', light: '#f0d060', dark: '#8b5e1a', muted: '#c9a84c33' },
        cream: { DEFAULT: '#f8f5f0', dark: '#ede8e0' },
        ink: { DEFAULT: '#1a0e00', 900: '#0d0a05', 800: '#1a0e00', 700: '#2a1a00' },
        surface: { DEFAULT: '#12121e', 2: '#1a1a2e', 3: '#1e1e30', 4: '#252540' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #f0d060 50%, #c9a84c 100%)',
        'dark-gradient': 'linear-gradient(135deg, #080810 0%, #12121e 100%)',
        'hero-dots': "radial-gradient(circle, rgba(201,168,76,0.15) 1px, transparent 1px)",
      },
      backgroundSize: { 'dots': '24px 24px' },
      boxShadow: {
        'gold': '0 4px 24px rgba(201,168,76,0.25)',
        'gold-lg': '0 8px 40px rgba(201,168,76,0.35)',
        'dark': '0 4px 24px rgba(0,0,0,0.4)',
        'dark-lg': '0 8px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
