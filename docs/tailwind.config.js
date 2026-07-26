/** Chanchal design tokens — hand this file to Copilot as-is */
const colors = {
  maroon: '#5C1A2B',
  'maroon-deep': '#3E1220',
  gold: '#C6963A',
  'gold-soft': '#E4C88A',
  cream: '#FBF5EA',
  ink: '#2A1B1F',
  teal: '#1F4B47',
};

module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],   // product names, headings
        sans: ['Karla', 'sans-serif'],                // body, labels, buttons
      },
      borderRadius: {
        card: '6px',   // cards, images — subtle, not pill-shaped
        chip: '999px',  // filter chips, tags, status pills — the ONE place pills belong
      },
    },
  },
  plugins: [],
};
