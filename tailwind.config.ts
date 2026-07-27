import type { Config } from 'tailwindcss';

const colors = {
  maroon: '#5C1A2B',
  'maroon-deep': '#3E1220',
  gold: '#C6963A',
  'gold-soft': '#E4C88A',
  cream: '#FBF5EA',
  ink: '#2A1B1F',
  teal: '#1F4B47',
};

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Karla', 'sans-serif'],
      },
      borderRadius: {
        card: '6px',
        chip: '999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
