# GitHub Card Creator
[![GitHub Card](https://github-card-creater.vercel.app/api/card/imrj05/github-card-creater?theme=dark)](https://github.com/imrj05/github-card-creater)
Generate beautiful **1280×640** social preview cards for any GitHub repository — perfect for README embeds, link previews, and sharing.
## Features
- 🎨 **Dark & Light themes** — clean, modern design
- 👤 **Owner avatar** — fetched and embedded server-side
- 📊 **Rich stats** — stars, forks, open issues, language
- 🔗 **Homepage URL** — shown when the repo has one
- ⚖️ **License** — displayed with icon
- 🖼️ **1280×640px** — GitHub's recommended social preview size
- 📋 **One-click copy** — Markdown embed, direct URL, or download SVG
- 🔤 **Manrope font** — rendered via Google Fonts
- ⚡ **No image libraries** — pure SVG generation
## Quick Start
```bash
# Clone the repo
git clone https://github.com/imrj05/github-card-creater.git
cd github-card-creater
# Install dependencies
npm install
# Set up environment
cp .env.example .env        # then add your GitHub token
# Start dev server (with hot reload)
npm run dev
# Or start production server
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
## GitHub Token (Recommended)
Without a token, the GitHub API is limited to **60 requests/hour**. With one, it's **5,000/hour**.
1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate a new token — no scopes needed for public repos
3. Add it to `.env`:
```env
GITHUB_TOKEN=your_token_here
```
## API
### Generate Card
```
GET /api/card/:owner/:repo?theme=dark|light
```
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `owner` | string | — | GitHub username or org |
| `repo` | string | — | Repository name |
| `theme` | string | `dark` | `dark` or `light` |
**Example:**
```
https://github-card-creater.vercel.app/api/card/facebook/react?theme=dark
```
Returns an `image/svg+xml` response with a 1-hour cache.
### Preview Endpoint
```
GET /api/preview?owner=:owner&repo=:repo&theme=dark|light
```
Same as above but used by the web UI for inline preview rendering.
## Embed in Markdown
```markdown
[![GitHub Card](https://github-card-creater.vercel.app/api/card/owner/repo?theme=dark)](https://github.com/owner/repo)
```
## Input Formats
The web UI accepts both formats:
- Short: `owner/repo` — e.g. `imrj05/github-card-creater`
- Full URL: `https://github.com/owner/repo`
## Tech Stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Server | Express |
| SVG | Pure string generation |
| GitHub data | GitHub REST API v3 |
| Font | Manrope via Google Fonts |
| Dev server | nodemon |
## Project Structure
```
├── src/
│   ├── server.js        # Express routes
│   ├── svgGenerator.js  # SVG card builder
│   └── githubClient.js  # GitHub API client
├── public/
│   └── index.html       # Web UI
├── .env                 # Environment variables (gitignored)
└── package.json
```
## License
MIT © 2026 [imrj05](https://github.com/imrj05)
