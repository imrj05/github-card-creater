const { escapeXml, wrapText, fitFontSize } = require('../utils');
const { icon } = require('./_icons');

function render(ctx) {
  const { W, H, theme, repoName, ownerLogin, description, language, langColor, stars, forks, issues, homepage, license, hasOwner, avatarBase64 } = ctx;
  const pad = 80;
  const avatarR = 110;
  const avatarCX = pad + avatarR;
  const avatarCY = H / 2;
  const dividerX = avatarCX * 2 + 60;
  const textX = dividerX + 70;
  const rightEdge = W - 64;
  const textWidth = rightEdge - textX;
  const titleY = homepage ? 212 : 232;
  const urlY = titleY + 46;
  const descStartY = (homepage ? urlY : titleY) + 56;
  const descLines = wrapText(description || 'No description provided.', 42, 3);
  const statsY = 492;
  const repoDisplay = repoName.length > 34 ? repoName.slice(0, 33) + '…' : repoName;
  const fullTitle = hasOwner ? `${ownerLogin}/${repoDisplay}` : repoDisplay;
  const repoFontSize = fitFontSize(fullTitle, textWidth, 58, 30, 0.55);
  const urlFontSize = fitFontSize(homepage || '', textWidth - 32, 24, 16, 0.52);
  const leftItemX = avatarCX - 80;
  const issuesTextY = statsY;
  const licTextY = statsY + 52;
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
  <rect width="${W}" height="${H}" rx="24" ry="24" fill="${theme.bg}" clip-path="url(#cardClip)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${accentBar}" clip-path="url(#cardClip)"/>
  <rect width="${W}" height="${H}" rx="24" ry="24" fill="none" stroke="${theme.border}" stroke-width="2"/>
  <g transform="translate(${pad}, ${pad - 10})" opacity="0.18">
    <defs>
      <clipPath id="logoClip">
        <rect width="36" height="36" rx="8" ry="8"/>
      </clipPath>
    </defs>
    <rect width="36" height="36" rx="8" fill="${theme.text}"/>
    <rect width="36" height="3" fill="${theme.title}" clip-path="url(#logoClip)"/>
    <g transform="translate(6.75, 9) scale(1.40625)" fill="${theme.bg}">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </g>
    <text x="44" y="16" font-family="'Manrope', sans-serif" font-weight="700" font-size="13" fill="${theme.text}" letter-spacing="-0.3">GitHub Card</text>
    <text x="44" y="31" font-family="'Manrope', sans-serif" font-weight="800" font-size="13" fill="${theme.title}" letter-spacing="-0.3">Creator</text>
  </g>
  ${avatarBase64 ? `
  <image href="${avatarBase64}"
    x="${avatarCX - avatarR}" y="${avatarCY - avatarR}"
    width="${avatarR * 2}" height="${avatarR * 2}"
    clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}"
    fill="none" stroke="${theme.border}" stroke-width="3"/>` : `
  ${icon('user', { x: avatarCX - 60, y: avatarCY - 60, size: 120, color: theme.subtext, stroke: 0.4, opacity: 0.4 })}`}
  <line x1="${dividerX}" y1="${pad}" x2="${dividerX}" y2="${H - pad}"
    stroke="${theme.border}" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="${textX}" y="${titleY}" class="repo" style="font-size:${repoFontSize}px">
    ${hasOwner ? `<tspan class="owner">${ownerLogin}/</tspan>` : ''}<tspan>${repoDisplay}</tspan>
  </text>
  ${homepage ? `
  ${icon('link', { x: textX, y: urlY - 17, size: 20, color: theme.subtext })}
  <text x="${textX + 30}" y="${urlY}" class="meta" style="font-size:${urlFontSize}px">${homepage}</text>` : ''}
  ${descLines.map((line, i) => `<text x="${textX}" y="${descStartY + i * 46}" class="desc">${escapeXml(line)}</text>`).join('\n  ')}
  ${icon('star', { x: textX, y: statsY - 21, size: 26, color: theme.icon })}
  <text x="${textX + 38}" y="${statsY}"><tspan class="stat-n">${escapeXml(stars)}</tspan><tspan class="stat" dx="10"> stars</tspan></text>
  ${icon('fork', { x: textX + 238, y: statsY - 21, size: 26, color: theme.icon })}
  <text x="${textX + 276}" y="${statsY}"><tspan class="stat-n">${escapeXml(forks)}</tspan><tspan class="stat" dx="10"> forks</tspan></text>
  ${language ? `
  <circle cx="${textX + 460}" cy="${statsY - 8}" r="12" fill="${langColor}"/>
  <text x="${textX + 484}" y="${statsY}" class="stat">${escapeXml(language)}</text>` : ''}
  ${icon('issues', { x: leftItemX, y: issuesTextY - 19, size: 22, color: theme.icon })}
  <text x="${leftItemX + 30}" y="${issuesTextY}"><tspan class="stat-n">${escapeXml(issues)}</tspan><tspan class="stat" dx="10"> issues</tspan></text>
  ${icon('scale', { x: leftItemX, y: licTextY - 19, size: 22, color: theme.subtext })}
  <text x="${leftItemX + 30}" y="${licTextY}" class="meta">${license ? license : '<tspan font-style="italic">No license</tspan>'}</text>
  <g transform="translate(${avatarCX * 2 + 60 + (W - (avatarCX * 2 + 60)) / 2 - 200}, ${H / 2 - 200}) scale(25)" opacity="0.06" fill="${theme.text}">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </g>
</svg>`;
}

module.exports = {
  name: 'default',
  width: 1280,
  height: 640,
  render,
};
