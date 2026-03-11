const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
async function fetchAvatarBase64(url) {
  try {
    const response = await fetch(`${url}&s=400`);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const mime = response.headers.get('content-type') || 'image/png';
    return `data:${mime};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
  } catch {
    return null;
  }
}
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#fa7343',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  R: '#198CE7',
};
const THEMES = {
  dark: {
    bg: '#0d1117',
    border: '#30363d',
    title: '#58a6ff',
    text: '#c9d1d9',
    subtext: '#8b949e',
    icon: '#8b949e',
  },
  light: {
    bg: '#ffffff',
    border: '#e1e4e8',
    title: '#0366d6',
    text: '#24292e',
    subtext: '#6a737d',
    icon: '#6a737d',
  },
};
function escapeXml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function formatCount(num) {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return String(num);
}
function wrapText(text, maxCharsPerLine, maxLines) {
  if (!text) return [''];
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (lines.length >= maxLines) { current = ''; break; }
      current = word.length > maxCharsPerLine
        ? word.slice(0, maxCharsPerLine - 3) + '...'
        : word;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}
async function generateSVG(repo, owner, options = {}) {
  const theme = THEMES[options.theme] || THEMES.dark;
  const showOwner = options.showOwner !== false;
  // 1280×640 — GitHub recommended social preview size
  const W = 1280;
  const H = 640;
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
  // Layout constants
  const pad = 80;
  const avatarR = 110;
  const avatarCX = pad + avatarR;       // 190
  const avatarCY = H / 2;              // 320
  const dividerX = avatarCX * 2 + 60;  // 440
  const textX = dividerX + 70;         // 510
  const titleY = homepage ? 215 : 235;
  const urlY = titleY + 48;
  const descStartY = homepage ? 318 : 302;
  const descLines = wrapText(repo.description || 'No description provided.', 44, 3);
  const statsY = 490;
  // Left panel: issues + license below avatar
  const leftItemX = avatarCX - 80;      // 110 — left-aligned under avatar
  const issuesIconY = avatarCY + avatarR + 30;  // 460
  const issuesTextY = issuesIconY + 23;         // 483  (icon center + half cap-height)
  const licIconY = issuesTextY + 38;            // 521
  const licTextY = licIconY + 21;              // 542  (24px font — slightly less offset)
  // Accent colour depending on theme
  const accentBar = theme.title;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">
  <defs>
    <clipPath id="avatarClip">
      <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}"/>
    </clipPath>
    <clipPath id="cardClip">
      <rect width="${W}" height="${H}" rx="24" ry="24"/>
    </clipPath>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap');
    .repo  { font: 800 58px 'Manrope', sans-serif; fill: ${theme.title}; }
    .owner { font: 400 38px 'Manrope', sans-serif; fill: ${theme.subtext}; }
    .desc  { font: 400 30px 'Manrope', sans-serif; fill: ${theme.text}; }
    .stat  { font: 400 28px 'Manrope', sans-serif; fill: ${theme.subtext}; }
    .stat-n{ font: 700 28px 'Manrope', sans-serif; fill: ${theme.text}; }
    .meta  { font: 500 24px 'Manrope', sans-serif; fill: ${theme.subtext}; }
    .copy  { font: 600 20px 'Manrope', sans-serif; fill: ${theme.text}; }
  </style>
  <!-- Card background -->
  <rect width="${W}" height="${H}" rx="24" ry="24" fill="${theme.bg}" clip-path="url(#cardClip)"/>
  <!-- Subtle top accent bar -->
  <rect x="0" y="0" width="${W}" height="6" fill="${accentBar}" clip-path="url(#cardClip)"/>
  <!-- Border -->
  <rect width="${W}" height="${H}" rx="24" ry="24" fill="none" stroke="${theme.border}" stroke-width="2"/>
  <!-- Copyright — top left, low opacity -->
  <text x="${pad}" y="${pad + 26}" class="copy" opacity="0.18">github card creator</text>
  ${avatarBase64 ? `
  <!-- Avatar -->
  <image href="${avatarBase64}"
    x="${avatarCX - avatarR}" y="${avatarCY - avatarR}"
    width="${avatarR * 2}" height="${avatarR * 2}"
    clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}"
    fill="none" stroke="${theme.border}" stroke-width="3"/>` : `
  <!-- Fallback repo icon (no avatar) -->
  <g transform="translate(${avatarCX - 60},${avatarCY - 60}) scale(7.5)" fill="${theme.subtext}" opacity="0.4">
    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
  </g>`}
  <!-- Vertical divider -->
  <line x1="${dividerX}" y1="${pad}" x2="${dividerX}" y2="${H - pad}"
    stroke="${theme.border}" stroke-width="1.5" stroke-dasharray="6 4"/>
  <!-- Owner / repo name on one line -->
  <text x="${textX}" y="${titleY}" class="repo">
    ${hasOwner ? `<tspan class="owner">${ownerLogin}/</tspan>` : ''}<tspan>${repoName}</tspan>
  </text>
  ${homepage ? `
  <!-- URL -->
  <g transform="translate(${textX}, ${urlY - 20}) scale(1.4)" fill="${theme.subtext}">
    <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/>
  </g>
  <text x="${textX + 32}" y="${urlY}" class="meta">${homepage}</text>` : ''}
  <!-- Description -->
  ${descLines.map((line, i) => `<text x="${textX}" y="${descStartY + i * 46}" class="desc">${escapeXml(line)}</text>`).join('\n  ')}
  <!-- Stars -->
  <g transform="translate(${textX}, ${statsY - 22}) scale(1.8)" fill="${theme.icon}">
    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
  </g>
  <text x="${textX + 40}" y="${statsY}"><tspan class="stat-n">${escapeXml(stars)}</tspan><tspan class="stat" dx="10"> stars</tspan></text>
  <!-- Forks -->
  <g transform="translate(${textX + 240}, ${statsY - 22}) scale(1.8)" fill="${theme.icon}">
    <path d="M5 3.25a.75.75 0 110-1.5.75.75 0 010 1.5zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 110-1.5.75.75 0 010 1.5zm3-8.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
  </g>
  <text x="${textX + 280}" y="${statsY}"><tspan class="stat-n">${escapeXml(forks)}</tspan><tspan class="stat" dx="10"> forks</tspan></text>
  ${language ? `
  <!-- Language -->
  <circle cx="${textX + 460}" cy="${statsY - 8}" r="12" fill="${langColor}"/>
  <text x="${textX + 484}" y="${statsY}" class="stat">${escapeXml(language)}</text>` : ''}
  <!-- Issues — left panel below avatar -->
  <g transform="translate(${leftItemX}, ${issuesIconY}) scale(1.6)" fill="${theme.icon}">
    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
    <path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
  </g>
  <text x="${leftItemX + 30}" y="${issuesTextY}"><tspan class="stat-n">${escapeXml(issues)}</tspan><tspan class="stat" dx="10"> issues</tspan></text>
  <!-- License — left panel below issues (balance scale icon, 16×16 viewBox) -->
  <g transform="translate(${leftItemX}, ${licIconY}) scale(1.6)" fill="${theme.subtext}">
    <!-- pole --><path d="M7.5 1h1v13h-1z"/>
    <!-- beam --><path d="M1 2.5h14v1H1z"/>
    <!-- left pan --><path d="M1 3.5Q3.5 9 6 3.5Z"/>
    <!-- right pan --><path d="M10 3.5Q12.5 9 15 3.5Z"/>
    <!-- base --><path d="M5 14.5h6v1H5z"/>
  </g>
  <text x="${leftItemX + 30}" y="${licTextY}" class="meta">${license ? license : '<tspan font-style="italic">No license</tspan>'}</text>
  <!-- GitHub mark — large ghost watermark centred on right panel -->
  <g transform="translate(${avatarCX * 2 + 60 + (W - (avatarCX * 2 + 60)) / 2 - 200}, ${H / 2 - 200}) scale(25)" opacity="0.06" fill="${theme.text}">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </g>
</svg>`;
}
module.exports = { generateSVG };
