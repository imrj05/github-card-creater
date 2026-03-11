const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubClient {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
  }

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Card-Creator'
    };
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    return headers;
  }

  async getRepo(owner, repo) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch repo ${owner}/${repo}`);
    }

    return response.json();
  }

  async getOwner(owner) {
    const response = await fetch(`${GITHUB_API_BASE}/users/${owner}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch user ${owner}`);
    }

    return response.json();
  }
}

module.exports = new GitHubClient();
