import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchTrends } from './research/rss.js';
import { generatePost } from './ai/generator.js';
import { getState, replaceCandidates, approveCandidate, markPublished } from './store/memory.js';
import { facebookConfigured, checkFacebookPage, publishTextPost } from './facebook/client.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.APP_ORIGIN || true }));
app.use(express.json({ limit: '250kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.use(express.static(publicDir));

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  facebookConfigured: facebookConfigured(),
  graphVersion: process.env.META_GRAPH_VERSION || 'v26.0'
}));

app.get('/api/facebook/status', async (_req, res, next) => {
  if (!facebookConfigured()) {
    return res.json({ configured: false, connected: false });
  }

  try {
    const page = await checkFacebookPage();
    res.json({ configured: true, ...page });
  } catch (e) {
    e.statusCode = 502;
    next(e);
  }
});

app.get('/api/state', (_req, res) => res.json(getState()));

app.post('/api/research/refresh', async (_req, res, next) => {
  try {
    const items = await fetchTrends();
    replaceCandidates(items);
    res.json({ count: items.length, items });
  } catch (e) { next(e); }
});

app.post('/api/posts/:id/generate', async (req, res, next) => {
  try {
    const item = getState().candidates.find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Candidate not found' });
    const draft = await generatePost(item, req.body || {});
    Object.assign(item, draft);
    res.json(item);
  } catch (e) { next(e); }
});

app.post('/api/posts/:id/approve', (req, res) => {
  const item = approveCandidate(req.params.id);
  if (!item) return res.status(404).json({ error: 'Candidate not found' });
  res.json(item);
});

app.post('/api/posts/:id/publish', async (req, res, next) => {
  try {
    const state = getState();
    const item = state.approved.find(x => x.id === req.params.id) || state.candidates.find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Post not found' });
    if (!item.caption) return res.status(400).json({ error: 'Generate the post first' });

    const result = await publishTextPost(item.caption);
    const saved = markPublished(item.id, result.id || null);
    res.json({ post: saved, meta: result });
  } catch (e) { next(e); }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || (err.code === 'FB_NOT_CONFIGURED' ? 503 : 500);
  res.status(status).json({ error: err.message, details: err.details || undefined });
});

app.listen(port, () => console.log(`FB Growth Autopilot running on http://localhost:${port}`));
