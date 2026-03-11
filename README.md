# GitHub Card Creator
Generate beautiful 1280×640 social preview cards for any GitHub repository.
## Features
- Generate SVG cards showing repository info
- Display stars, forks, language, and topics
- Dark and light themes
- Easy to use web interface
- Download or embed in markdown
## Quick Start
```bash
# Install dependencies
npm install
# Copy environment file
cp .env.example .env
# Start the server
npm start
```
Open http://localhost:3000 in your browser.
## GitHub Token (Recommended)
To avoid rate limiting, add your GitHub token:
1. Go to https://github.com/settings/tokens
2. Generate a new token (no scopes needed for public repos)
3. Add to `.env`: `GITHUB_TOKEN=your_token_here`
## API Usage
### Generate Card
```
GET /api/card/:owner/:repo?theme=dark|light
```
**Example:**
```
https://your-app.com/api/card/facebook/react?theme=dark
```
### Response
Returns SVG image with:
- Repository name
- Owner avatar
- Description
- Stars, forks count
- Primary language
- Topics
## Embed in Markdown
```markdown
[![GitHub Card](https://your-app.com/api/card/owner/repo)](https://github.com/owner/repo)
```
## Tech Stack
- Node.js + Express
- SVG generation (no external image libraries)
- GitHub REST API
## License
MIT
