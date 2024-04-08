/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        chakra: ["Chakra Petch", "sans-serif"],
        archivo: ["Archivo", 'sans-serif'],
        oju: ["Ojuju",'sans-serif']
      },
    },
  },
  plugins: [],
};

