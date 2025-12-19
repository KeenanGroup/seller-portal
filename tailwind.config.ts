import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        mulberry: '#4C2230',
        'mulberry-light': '#5D3A4A',
        'honed-stone': '#D5CBBF',
        'honed-stone-light': '#E5DED4',

        // Supporting Colors
        black: '#000000',
        white: '#FFFFFF',

        // Legacy aliases for compatibility
        brand: '#4C2230',
        'brand-light': '#5D3A4A',
        champagne: '#D5CBBF',
        'champagne-light': '#E5DED4',
        cream: '#FAFAF8',
        charcoal: '#1A1A1A',

        // Accent
        gold: '#C9A962',
        'gold-light': '#D4BC7D',

        // Status
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Compass Sans Medium', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
