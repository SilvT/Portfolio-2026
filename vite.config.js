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
        'marketing-management': path.resolve(__dirname, 'marketing-management.html'),
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io', '.ngrok-free.app'],
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    exclude: ['*.mov', '*.mp4', '*.webm'],
  },
  assetsInclude: ['**/*.mov', '**/*.mp4', '**/*.webm', '**/*.ogg'],
});
