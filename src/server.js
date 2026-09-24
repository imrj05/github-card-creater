require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const githubClient = require('./githubClient');
const { generateSVG } = require('./svgGenerator');
const templates = require('./templates');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level(label) { return { level: label }; },
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security headers ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// ── CORS ──
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET'],
}));

// ── Structured request logging ──
app.use(pinoHttp({ logger }));

// ── Body parsing with size limit ──
app.use(express.json({ limit: '1kb' }));

// ── Static files ──
app.use(express.static('public', {
  maxAge: '1h',
  etag: true,
}));

// ── Rate limiters ──
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/', apiLimiter);
app.use('/', generalLimiter);

// ── Validation helper ──
const REPO_REGEX = /^[a-zA-Z0-9._-]+$/;

function validateParams(owner, repo) {
  const errors = [];
  if (!owner || !REPO_REGEX.test(owner)) errors.push('Invalid owner — must be alphanumeric with . _ -');
  if (!repo || !REPO_REGEX.test(repo)) errors.push('Invalid repo — must be alphanumeric with . _ -');
  return errors;
}

// ── Routes ──
app.get('/api/card/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { theme, avatar, variant } = req.query;

    const validation = validateParams(owner, repo);
    if (validation.length) {
      return res.status(400).json({ error: validation.join('; ') });
    }

    const [repoData, ownerData] = await Promise.all([
      githubClient.getRepo(owner, repo),
      githubClient.getOwner(owner),
    ]);

    const options = {
      theme: theme || 'dark',
      variant: templates.get(variant).name,
      showOwner: !['false', '0', 'no', 'off'].includes(avatar),
    };

    const svg = await generateSVG(repoData, ownerData, options);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svg);
  } catch (error) {
    logger.error({ err: error, params: req.params }, 'Card generation failed');
    res.status(error.status || 502).json({ error: error.message || 'Failed to generate card' });
  }
});

app.get('/api/preview', async (req, res) => {
  try {
    const { owner, repo, theme, variant, avatar } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'owner and repo are required' });
    }

    const validation = validateParams(owner, repo);
    if (validation.length) {
      return res.status(400).json({ error: validation.join('; ') });
    }

    const [repoData, ownerData] = await Promise.all([
      githubClient.getRepo(owner, repo),
      githubClient.getOwner(owner),
    ]);

    const svg = await generateSVG(repoData, ownerData, {
      theme,
      variant: templates.get(variant).name,
      showOwner: !['false', '0', 'no', 'off'].includes(avatar),
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    logger.error({ err: error, query: req.query }, 'Preview generation failed');
    res.status(error.status || 502).json({ error: error.message || 'Failed to generate preview' });
  }
});

app.get('/api/variants', (req, res) => {
  res.json({ variants: templates.list() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ──
app.use((err, req, res, _next) => {
  logger.error({ err, method: req.method, url: req.url }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'GitHub Card Creator started');
});
