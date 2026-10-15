import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine dist directory reliably whether running from root or dist/
const distPath = fs.existsSync(path.resolve(__dirname, 'index.html'))
  ? __dirname
  : path.resolve(__dirname, 'dist');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Amarelinhos - Grupo de Ciclismo',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// Cache control headers for static assets
app.use(
  express.static(distPath, {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// Fallback to index.html for Single Page Application routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Amarelinhos server running on http://localhost:${PORT}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
