# GitHub Card Creator — Status

> Last updated: 2026-06-03

## Legend

| Icon | Meaning |
|------|---------|
| ✅ | Completed |
| 🟡 | Partially completed |
| ❌ | Missing / not started |

---

## 1. Server (Express)

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 1.1 | Routes — `/api/card/:owner/:repo` | ✅ | Generates SVG card from owner/repo with query params |
| 1.2 | Routes — `/api/preview` | ✅ | Same as card but for web UI inline preview |
| 1.3 | Routes — `/api/variants` | ✅ | Returns list of available template variants |
| 1.4 | Routes — `GET /` (index.html) | ✅ | Serves the web UI |
| 1.5 | Static file serving | ✅ | Express serves `public/` directory |
| 1.6 | Cache headers (1h max-age) | ✅ | Set on card/preview responses |
| 1.7 | Global error handler | ✅ | Structured error logging with pino, distinct 404 handler, returns JSON errors with context |
| 1.8 | Security headers (Helmet) | ✅ | 11 security headers set — CSP disabled for inline styles, cross-origin resource policy on |
| 1.9 | Rate limiting | ✅ | 30 req/min on `/api/`, 100 req/min on general — with standard headers |
| 1.10 | Input validation | ✅ | `owner`/`repo` validated against `^[a-zA-Z0-9._-]+$` regex, returns 400 with details |
| 1.11 | CORS configuration | ✅ | Enabled with configurable origin (defaults to `*`), GET-only |
| 1.12 | Request body size limit | ✅ | JSON body parsing limited to 1kb |
| 1.13 | Structured logging | ✅ | pino + pino-http with full request/response logging, error context in logs |

---

## 2. GitHub API Client

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 2.1 | `getRepo(owner, repo)` | ✅ | Fetches repo data from GitHub REST API |
| 2.2 | `getOwner(owner)` | ✅ | Fetches user/org data from GitHub REST API |
| 2.3 | Token auth (optional) | ✅ | Reads `GITHUB_TOKEN` from env, 60→5000 req/hr |
| 2.4 | User-Agent header | ✅ | Set to `GitHub-Card-Creator` |
| 2.5 | Error handling with retry | ✅ | Retries on 429/5xx up to 2 times with exponential backoff |
| 2.6 | Timeout handling | ✅ | 8s timeout via AbortController, retries on timeout |
| 2.7 | Response caching (in-memory) | ✅ | 5-minute TTL cache, transparent cache-hit for duplicate requests |
| 2.8 | Rate limit awareness | ✅ | Logs warning when `X-RateLimit-Remaining` drops below 10 |

---

## 3. SVG Generation

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 3.1 | `generateSVG()` orchestrator | ✅ | Prepares context, picks template, calls render |
| 3.2 | Default template | ✅ | Two-column layout with avatar, stats, description |
| 3.3 | Terminal template | ✅ | Terminal emulator aesthetic with prompts, header dots |
| 3.4 | Gradient template | ✅ | Language-color-based gradient background, pill stats |
| 3.5 | Minimal template | ✅ | Centered single-column, clean typography |
| 3.6 | Newspaper template | ✅ | Serif font, masthead, sidebar stats |
| 3.7 | Template registry (`templates/index.js`) | ✅ | Lookup by name with default fallback |
| 3.8 | Watermarks (`_watermarks.js`) | ✅ | Reusable logo watermark and ghost mark helpers |
| 3.9 | Dark theme | ✅ | Dark color scheme (`#0d1117` bg) |
| 3.10 | Light theme | ✅ | Light color scheme (`#ffffff` bg) |
| 3.11 | Per-template theme overrides | ✅ | Each variant has dark/light sub-themes |
| 3.12 | Avatar rendering | ✅ | Circular avatar clipped from owner image |
| 3.13 | Avatar via query param (`avatar=false`) | ✅ | Accepts `false`, `0`, `no`, `off` to hide avatar |
| 3.14 | Star count | ✅ | Formatted with `formatCount` (1k, 2.5k, etc.) |
| 3.15 | Fork count | ✅ | Same formatting as stars |
| 3.16 | Open issues count | ✅ | Same formatting as stars |
| 3.17 | Language display | ✅ | Shown with color dot from `LANGUAGE_COLORS` |
| 3.18 | Homepage URL | ✅ | Displayed when repo has one |
| 3.19 | License | ✅ | Displayed with spdx_id |
| 3.20 | Description | ✅ | Wrapped text up to 3 lines |
| 3.21 | Description overflow | 🟡 | Silently truncated after max lines — no indicator like `…` in all templates |
| 3.22 | Manrope font via Google Fonts | ✅ | Imported in each template's `<style>` |
| 3.23 | Gradient color generation | ✅ | `gradientStopsForColor` utility |
| 3.24 | Date stamp | ✅ | Used by newspaper template |

---

## 4. Web UI (public/index.html)

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 4.1 | Repo input field | ✅ | Accepts `owner/repo` and full GitHub URLs |
| 4.2 | Theme selector (dark/light) | ✅ | Dropdown with dark/light options |
| 4.3 | Variant selector | ✅ | Dropdown with 5 template options |
| 4.4 | Generate button | ✅ | Triggers card generation |
| 4.5 | URL parsing (`parseRepo()`) | ✅ | Strips GitHub URLs to owner/repo |
| 4.6 | Loading spinner | ✅ | Shown during fetch with descriptive text |
| 4.7 | Error display | ✅ | Inline error box with message |
| 4.8 | Live preview | ✅ | SVG rendered directly in DOM |
| 4.9 | Copy Markdown button | ✅ | Copies `[![GitHub Card](url)](repo)` to clipboard |
| 4.10 | Copy URL button | ✅ | Copies card API URL to clipboard |
| 4.11 | Download SVG button | ✅ | Triggers file download with blob |
| 4.12 | Download PNG button | ✅ | Canvas-based SVG→PNG conversion |
| 4.13 | Temporary "Copied!" feedback | ✅ | 2-second flash on copy buttons |
| 4.14 | Markdown output textarea | ✅ | Shows generated Markdown embed |
| 4.15 | Example quick-links (4 repos) | ✅ | facebook/react, vercel/next.js, nodejs/node, twbs/bootstrap |
| 4.16 | Dark/light theme toggle | ✅ | Navbar button, persists in localStorage |
| 4.17 | System preference detection | ✅ | Checks `prefers-color-scheme` on initial load |
| 4.18 | Sticky navbar | ✅ | `position: sticky` with backdrop blur |
| 4.19 | Responsive layout (≤640px) | ✅ | Mobile breakpoint with adjusted grid |
| 4.20 | Responsive layout (≤380px) | ✅ | Compact breakpoint, hides brand name |
| 4.21 | Footer with branding | ✅ | MIT badge, links to source/issues |
| 4.22 | Accessibility | 🟡 | Has `aria-label` on theme toggle, but no focus management or screen reader support on dynamic content |
| 4.23 | Keyboard shortcuts | ❌ | No keyboard shortcuts (e.g., Enter to generate only works on input) |
| 4.24 | PNG generation loading state | 🟡 | Button text changes to "Generating…" but button is disabled only on client-side |

---

## 5. Themes System

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 5.1 | `THEMES` (dark/light base) | ✅ | In `themes.js` — bg, border, title, text, subtext, icon |
| 5.2 | `TEMPLATE_THEMES` per variant | ✅ | In `themes.js` — each variant has extended color props |
| 5.3 | `resolveTheme()` function | ✅ | Merges variant overrides onto base theme |
| 5.4 | Terminal-specific colors | ✅ | accent, dim, prompt |
| 5.5 | Gradient-specific colors | ✅ | pillBg, pillBorder (translucent) |
| 5.6 | Minimal-specific colors | ✅ | rule (line color) |
| 5.7 | Newspaper-specific colors | ✅ | accent, rule, serif font family |

---

## 6. Utilities (src/utils.js)

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 6.1 | `LANGUAGE_COLORS` | ✅ | 20 language→hex color mappings |
| 6.2 | `fetchAvatarBase64(url)` | ✅ | Fetches avatar, converts to inline base64 data URI |
| 6.3 | `escapeXml(str)` | ✅ | Escapes &, <, >, " |
| 6.4 | `formatCount(num)` | ✅ | Formats 1000+ as 1k, 2.5k, etc. |
| 6.5 | `wrapText(text, maxChars, maxLines)` | ✅ | Word-wrap with line and line-count limits |
| 6.6 | `dateStamp()` | ✅ | Returns "MONTH YEAR" uppercase |
| 6.7 | `gradientStopsForColor(hex)` | ✅ | Generates light/dark gradient stop colors |

---

## 7. Developer Experience

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 7.1 | Unit tests | ✅ | 18 tests across 3 suites — utils (11), githubClient (4), server/themes (3) |
| 7.2 | Integration tests | ✅ | Server/themes test covers template registry and theme resolution |
| 7.3 | CI/CD (GitHub Actions) | ✅ | Tests on Node 18/20/22, lint step, on push/PR to main |
| 7.4 | Linting (ESLint) | ✅ | ESLint 10 with flat config, 0 errors/warnings |
| 7.5 | Code formatting (Prettier) | ✅ | Prettier config with `prettier --check` in CI |
| 7.6 | TypeScript support | ❌ | Still pure JavaScript — would need migration |
| 7.7 | Git hooks (husky) | ❌ | No pre-commit hooks |
| 7.8 | npx nodemon for dev | ✅ | `npm run dev` with hot reload |
| 7.9 | `.env.example` | ✅ | Documents env vars |
| 7.10 | `.gitignore` | ✅ | Covers deps, env, logs, OS files, build output |
| 7.11 | Docker | ✅ | Multi-stage Alpine Dockerfile with `.dockerignore` |
| 7.12 | Error tracking (Sentry, etc.) | ❌ | No error reporting integration |
| 7.13 | Request logging (pino-http) | ✅ | Structured HTTP request/response logging with pino |

---

## 8. Deployment

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 8.1 | `npm start` script | ✅ | `node src/server.js` |
| 8.2 | PORT env config | ✅ | Defaults to 3000 |
| 8.3 | Vercel-ready | ✅ | Deployed at `github-card-creater.vercel.app` |
| 8.4 | Cache headers | ✅ | 1-hour max-age on card responses |
| 8.5 | `.env` in gitignore | ✅ | `.env` properly gitignored — not tracked in version control |

---

## Summary

| Category | Total | ✅ Done | 🟡 Partial | ❌ Missing |
|----------|-------|---------|------------|------------|
| Server | 13 | 12 | 0 | 1 |
| GitHub API | 8 | 8 | 0 | 0 |
| SVG Generation | 24 | 20 | 2 | 2 |
| Web UI | 24 | 19 | 3 | 2 |
| Themes | 7 | 7 | 0 | 0 |
| Utilities | 7 | 7 | 0 | 0 |
| Developer Experience | 13 | 11 | 0 | 2 |
| Deployment | 5 | 5 | 0 | 0 |
| **Total** | **101** | **89** | **5** | **7** |
