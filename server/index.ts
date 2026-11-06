import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiApp from './api/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Mount API
app.use(apiApp);

// Look for production static build in root dist or client/dist
const possibleDistPaths = [
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, '../../dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'dist'),
];

const distPath = possibleDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

if (distPath) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Pillaiyarappa South Indian Corner - Dynamic Menu & Order API',
      message: 'API is running in production mode. Static frontend build not loaded in server directory.',
      endpoints: {
        health: '/api/health',
        menuCategories: '/api/menu/categories',
        menuItems: '/api/menu/items',
        adminLogin: '/api/admin/login',
      },
    });
  });
}

app.listen(PORT, () => {
  console.log(`[Pillaiyarappa Server] Running at http://localhost:${PORT}`);
});

export default app;
