import express from 'express';
import path from 'path';
import { createApiMiddleware } from './apiMiddleware';

const PORT = process.env.PORT || 3000;
const app = express();

// API middleware
app.use(createApiMiddleware());

// Serve static assets from dist (after vite build) and public
const distPath = path.join(process.cwd(), 'dist');
const publicPath = path.join(process.cwd(), 'public');

app.use(express.static(publicPath));
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
