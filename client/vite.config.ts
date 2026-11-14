import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    async configureServer(server) {
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL) return;
      try {
        const { default: apiApp } = await server.ssrLoadModule('../server/api/index.ts');
        server.middlewares.use(apiApp);
        console.log('[Vite Dev Server] Express API middleware mounted successfully');
      } catch (err) {
        console.warn('[Vite Dev Server] Express API middleware skipped in lightweight mode');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      outDir: process.env.VERCEL ? 'dist' : '../dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Ignore database JSON file writes and public uploads so server persistence does not trigger full page reload
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/server/data/**', '**/server/data/db.json*', '**/*.json', '**/public/uploads/**'],
      },
    },
  };
});
