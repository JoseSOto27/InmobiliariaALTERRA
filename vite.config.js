import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza los archivos en segundo plano automáticamente
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Alterra Haus Inmobiliaria',
        short_name: 'AlterraHaus',
        description: 'Panel administrativo y catálogo unificado de propiedades',
        theme_color: '#1A1A1A', // Color de la barra de estado del celular (coincide con tu sidebar)
        background_color: '#FFFFFF', // Fondo al abrir la app
        display: 'standalone', // Oculta las barras del navegador web para que parezca app nativa
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});