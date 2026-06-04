import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Auto-updates the app when you push new code
      devOptions: {
        enabled: true // Allows us to test PWA features in development mode
      },
      manifest: {
        name: 'Student Attendance Monitoring System',
        short_name: 'SAMS QR',
        description: 'A QR-based app for tracking student attendance.',
        theme_color: '#059669', // Matches the updated emerald brand color
        background_color: '#F5FAF7',
        display: 'standalone', // Makes it look like a native app (hides browser URL bar)
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
});
