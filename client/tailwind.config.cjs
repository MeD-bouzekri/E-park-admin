/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#3a70e3ff', 800: '#88adedff' },
        brand: { 500: '#10b981', 600: '#059669', 700: '#047857' },
        dashboard: {
          green: '#22C55E',
          lightgreen: '#D1FADF',
          orange: '#F97316',
          red: '#F43F5E',
          blue: '#0F172A',
          white: '#FFFFFF',
          gray: '#F8FAFC',
          border: '#E5E7EB',
        },
      },
      boxShadow: { card: '0 10px 25px -10px rgba(0,0,0,0.25)' },
      borderRadius: { xl2: '1rem' }
    }
  },
  plugins: []
};
