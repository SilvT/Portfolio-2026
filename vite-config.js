import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  
 
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'index-static': path.resolve(__dirname, 'index-static.html'),
        'cv-silvia-travieso': path.resolve(__dirname, 'cv-silvia-travieso.html'),
        'marketing-management': path.resolve(__dirname, 'marketing-management.html'),
        'design-system': path.resolve(__dirname, 'design-system.html'),
        'energy-tracker': path.resolve(__dirname, 'energy-tracker.html'),
        'figma-plugin': path.resolve(__dirname, 'figma-plugin.html'),
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io', '.ngrok-free.app'],
    port: 3000,
    open: '/'
  },
  optimizeDeps: {
    exclude: ['*.mov', '*.mp4', '*.webm'],
  },
  assetsInclude: ['**/*.mov', '**/*.mp4', '**/*.webm', '**/*.ogg'],
});
