require('dotenv').config();
const express = require('express');
const path = require('path');
const githubClient = require('./githubClient');
const { generateSVG } = require('./svgGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/card/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { theme, avatar } = req.query;

    const [repoData, ownerData] = await Promise.all([
      githubClient.getRepo(owner, repo),
      githubClient.getOwner(owner)
    ]);

    const options = {
      theme: theme || 'dark',
      showOwner: avatar !== 'false'
    };

    const svg = await generateSVG(repoData, ownerData, options);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svg);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/api/preview', async (req, res) => {
  try {
    const { owner, repo, theme } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'owner and repo are required' });
    }

    const [repoData, ownerData] = await Promise.all([
      githubClient.getRepo(owner, repo),
      githubClient.getOwner(owner)
    ]);

    const svg = await generateSVG(repoData, ownerData, { theme });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`GitHub Card Creator running on http://localhost:${PORT}`);
});
