import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#1B3A4B',
        'brand-light': '#2D5A6E',
        champagne: '#F7E7CE',
        'champagne-light': '#FBF3E4',
        cream: '#FFFDF7',
        charcoal: '#2C3E50',
        'evening-plum': '#4A3728',
        gold: '#C9A962',
        'gold-light': '#D4BC7D',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
