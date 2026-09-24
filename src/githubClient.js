const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GITHUB_API_BASE = 'https://api.github.com';
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class GitHubClient {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this._cache = new Map();
  }

  getHeaders() {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Card-Creator',
    };
    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }
    return headers;
  }

  _cacheKey(endpoint) {
    return endpoint;
  }

  _getCached(endpoint) {
    const entry = this._cache.get(endpoint);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
      this._cache.delete(endpoint);
      return null;
    }
    return entry.data;
  }

  _setCache(endpoint, data) {
    this._cache.set(endpoint, { data, ts: Date.now() });
  }

  async _fetchWithRetry(url, retries = MAX_RETRIES) {
    const cached = this._getCached(url);
    if (cached) return cached;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          headers: this.getHeaders(),
          signal: controller.signal,
        });

        // Rate limit awareness
        const remaining = response.headers.get('X-RateLimit-Remaining');
        if (remaining !== null && Number(remaining) < 10) {
          console.warn(
            `[GitHubClient] Rate limit low: ${remaining} remaining (token: ${this.token ? 'set' : 'none'})`
          );
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          const msg = body.message || `GitHub API responded with ${response.status}`;

          // Retry on 429 or 5xx
          if (attempt < retries && (response.status === 429 || response.status >= 500)) {
            const backoff = Math.pow(2, attempt) * 500;
            await new Promise((r) => setTimeout(r, backoff));
            continue;
          }

          const err = new Error(msg);
          err.status = response.status;
          throw err;
        }

        const data = await response.json();
        this._setCache(url, data);
        return data;
      } catch (error) {
        clearTimeout(timer);

        if (error.name === 'AbortError') {
          if (attempt < retries) {
            const backoff = Math.pow(2, attempt) * 500;
            await new Promise((r) => setTimeout(r, backoff));
            continue;
          }
          const err = new Error('GitHub API request timed out');
          err.status = 504;
          throw err;
        }

        // Re-throw non-retryable errors (like validation errors from our code)
        if (error.status && error.status < 500) throw error;

        if (attempt < retries) {
          const backoff = Math.pow(2, attempt) * 500;
          await new Promise((r) => setTimeout(r, backoff));
          continue;
        }

        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async getRepo(owner, repo) {
    return this._fetchWithRetry(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  }

  async getOwner(owner) {
    return this._fetchWithRetry(`${GITHUB_API_BASE}/users/${owner}`);
  }
}

module.exports = new GitHubClient();
