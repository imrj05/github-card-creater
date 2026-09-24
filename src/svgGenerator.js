const { THEMES, resolveTheme } = require('./themes');
const { fetchAvatarBase64, escapeXml, formatCount, LANGUAGE_COLORS } = require('./utils');
const templates = require('./templates');

const W = 1280;
const H = 640;

async function generateSVG(repo, owner, options = {}) {
  const variant = options.variant || 'default';
  const template = templates.get(variant);
  const baseTheme = THEMES[options.theme] || THEMES.dark;
  const theme = resolveTheme(variant, baseTheme);

  const showOwner = options.showOwner !== false;
  const repoName = escapeXml(repo.name || '');
  const ownerLogin = escapeXml(owner?.login || repo.owner?.login || '');
  const language = repo.language || null;
  const langColor = language ? (LANGUAGE_COLORS[language] || '#586069') : null;
  const stars = formatCount(repo.stargazers_count);
  const forks = formatCount(repo.forks_count);
  const issues = formatCount(repo.open_issues_count);
  const homepage = repo.homepage ? escapeXml(repo.homepage.replace(/^https?:\/\//, '')) : null;
  const license = repo.license ? escapeXml(repo.license.spdx_id || repo.license.name || '') : null;
  const hasOwner = showOwner && ownerLogin;
  const avatarUrl = hasOwner ? (owner?.avatar_url || null) : null;
  const avatarBase64 = avatarUrl ? await fetchAvatarBase64(avatarUrl) : null;

  const ctx = {
    W, H,
    theme,
    repoName,
    ownerLogin,
    description: repo.description || '',
    language,
    langColor,
    stars,
    forks,
    issues,
    homepage,
    license,
    hasOwner,
    avatarBase64,
    repo,
    owner,
  };

  return template.render(ctx);
}

module.exports = { generateSVG };
