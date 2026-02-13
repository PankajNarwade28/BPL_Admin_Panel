/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ipl-blue': '#1e40af',
        'ipl-purple': '#7c3aed',
        'ipl-orange': '#f97316',
        'ipl-gold': '#fbbf24',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'scale(1.5)', 
            opacity: '0' 
          },
        }
      }
    },
  },
  plugins: [],
}
