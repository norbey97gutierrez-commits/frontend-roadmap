/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Opcional: Puedes personalizar colores aquí
      colors: {
        azure: {
          light: '#f0f7ff',
          main: '#0078d4',
          dark: '#005a9e',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}