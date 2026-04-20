/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f4e4c1',
        darkwood: '#3e2723',
        gold: '#ffd700',
        bloodred: '#8b0000',
        forest: '#2e7d32',
        ocean: '#1565c0',
        midnight: '#1a1a2e',
        mystic: '#6a0dad',
      },
      fontFamily: {
        medieval: ['"MedievalSharp"', 'cursive'],
        game: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
