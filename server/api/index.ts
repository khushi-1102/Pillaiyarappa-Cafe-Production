import express from 'express';
import cors from 'cors';
import menuRoutes from './menu';
import adminRoutes from './admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for Hostinger domains, subdomains & local testing
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Resolve public uploads directory (supports both client/public/uploads and root public/uploads)
const uploadsStaticPath = [
  path.resolve(process.cwd(), 'client/public/uploads'),
  path.resolve(process.cwd(), 'public/uploads'),
  path.resolve(__dirname, '../../client/public/uploads'),
  path.resolve(__dirname, '../uploads'),
].find((p) => fs.existsSync(p)) || path.resolve(process.cwd(), 'public/uploads');

// Serve static uploaded media files
app.use('/uploads', express.static(uploadsStaticPath));

// Mount routers
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Pillaiyarappa Dynamic Menu Engine',
  });
});

export default app;
