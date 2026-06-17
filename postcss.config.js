// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // 👈 El plugin correcto para procesar la v4
    autoprefixer: {},
  },
}