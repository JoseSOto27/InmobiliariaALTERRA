import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'], // Incluimos tus assets actuales
      manifest: {
        name: 'Alterra Haus Inmobiliaria',
        short_name: 'AlterraHaus',
        description: 'Panel administrativo y catálogo unificado de propiedades',
        theme_color: '#1A1A1A',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            // Usamos tu logo.png directo como icono universal
            src: 'favicon.svg', // Puedes generar un favicon.svg a partir de tu logo.png para mejor compatibilidad
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});