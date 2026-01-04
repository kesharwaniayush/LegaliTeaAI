import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import analysisRoutes from './routes/analysis.js';
import healthRoutes from './routes/health.js';
import { searchUrlGetContent } from './utils/searchUrlGetContent.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);
app.use(rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api', analysisRoutes);

app.post('/getTextByURL', async (req, res) => {
  let { url } = req.body;
  url = url.trim();
  if (!url) {
    return res.status(400).json({ content: 'URL is required' });
  }
  return res.json({ content: await searchUrlGetContent(url) });
})

// Serve static files in production (Note: express.static() won't work on Vercel)
// Use public directory instead for static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));

  // SPA fallback for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;