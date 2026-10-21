/**
 * JobConnect Kenya - Full-Stack Express Server Entry Point
 * 
 * Complies with Prompt 1 & environment constraints:
 * - Listens on process.env.PORT and 0.0.0.0
 * - GET /api/health returns {"status": "ok"}
 * - Serves API routes and mounts Vite middleware in development
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = '0.0.0.0';

  // Body parsing middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Basic security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Prompt 1 Requirement: GET /api/health returning {"status":"ok"}
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'JobConnect Kenya',
      timezone: 'Africa/Nairobi',
      timestamp: new Date().toISOString()
    });
  });

  // Robots.txt
  app.get('/robots.txt', (req: Request, res: Response) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: /sitemap.xml');
  });

  // Sitemap.xml for Google Visibility
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jobconnect.co.ke/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jobconnect.co.ke/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://jobconnect.co.ke/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
  });

  // Dedicated HTML Portal Endpoints
  app.get('/jobseeker.html', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'jobseeker.html'));
  });

  app.get('/employer.html', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'employer.html'));
  });

  // Serve static assets from public (e.g. style.css, logo.svg)
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Vite Integration
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`[JobConnect] Server listening on http://${HOST}:${PORT}`);
    console.log(`[JobConnect] Health endpoint: http://${HOST}:${PORT}/api/health`);
  });
}

startServer().catch(err => {
  console.error('[JobConnect] Failed to start server:', err);
  process.exit(1);
});
