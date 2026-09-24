import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockJson = vi.fn();
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: mockJson,
    headers: new Map([['X-RateLimit-Remaining', '5000']]),
  })
);

vi.mock('node-fetch', () => ({
  default: mockFetch,
}));

const githubClient = await import('./githubClient');

beforeEach(() => {
  vi.clearAllMocks();
  githubClient.default._cache.clear();
});

describe('getRepo', () => {
  it('fetches repo data successfully', async () => {
    mockJson.mockResolvedValueOnce({ full_name: 'facebook/react', stargazers_count: 100000 });

    const data = await githubClient.default.getRepo('facebook', 'react');

    expect(data.full_name).toBe('facebook/react');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/facebook/react',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Card-Creator',
        }),
      })
    );
  });

  it('caches responses', async () => {
    mockJson.mockResolvedValue({ full_name: 'facebook/react' });

    await githubClient.default.getRepo('facebook', 'react');
    await githubClient.default.getRepo('facebook', 'react');

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Not Found' }),
      headers: new Map([['X-RateLimit-Remaining', '5000']]),
    });

    await expect(githubClient.default.getRepo('unknown', 'nope')).rejects.toThrow('Not Found');
  });
});

describe('getOwner', () => {
  it('fetches owner data successfully', async () => {
    mockJson.mockResolvedValueOnce({ login: 'facebook', avatar_url: 'https://example.com/avatar' });

    const data = await githubClient.default.getOwner('facebook');

    expect(data.login).toBe('facebook');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/facebook',
      expect.any(Object)
    );
  });
});
