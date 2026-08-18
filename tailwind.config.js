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
        cyber: {
          green: '#10B981',
          emerald: '#059669',
          glow: '#34D399',
          dark: '#020d08',
          panel: '#03170e',
          accent: '#06b6d4',
          warn: '#f59e0b',
          danger: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        mono: ['monospace'],
        serif: ['var(--font-cinzel)', 'serif'],
      },
    },
  },
  plugins: [],
};
