const { escapeXml, wrapText, fitFontSize, gradientStopsForColor } = require('../utils');
const { logoMark, ghostMark } = require('./_watermarks');
const { icon } = require('./_icons');

function render(ctx) {
  const { W, H, theme, repoName, ownerLogin, description, language, stars, forks, issues, homepage, license, avatarBase64 } = ctx;
  const baseHex = ctx.language ? (ctx.langColor || '#5b6cff') : '#5b6cff';
  const stops = gradientStopsForColor(baseHex);
  const gradId = 'gradBg';
  const glowId = 'glowBlob';
  const contentWidth = 860;
  const contentCenter = 520;
  const descLines = wrapText(description || 'No description provided.', 54, 2);
  const pillY = H - 120;
  const ownerY = 258;
  const titleY = 334;
  const descStartY = titleY + 66;
  const urlY = descStartY + descLines.length * 40 + 8;
  const repoFontSize = fitFontSize(repoName, contentWidth, 88, 40, 0.5);
  const urlFontSize = fitFontSize(homepage || '', contentWidth, 22, 15, 0.52);
  const ghostWhite = 'rgba(255,255,255,0.18)';
  const avatarR = 110;
  const avatarCX = W - 170;
  const avatarCY = 200;

  const pillContent = (name, label, pillW) => {
    const text = String(label);
    const total = 18 + 6 + text.length * 11.5;
    const startX = Math.max(10, Math.round((pillW - total) / 2));
    return icon(name, { x: startX, y: 19, size: 18, color: theme.title }) +
      `<text x="${startX + 24}" y="36" text-anchor="start" class="g-pill">${escapeXml(text)}</text>`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">
  <defs>
    <clipPath id="cardClip">
      <rect width="${W}" height="${H}" rx="24" ry="24"/>
    </clipPath>
    <clipPath id="gradAvatar">
      <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}"/>
    </clipPath>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${stops.dark}"/>
      <stop offset="55%" stop-color="${baseHex}"/>
      <stop offset="100%" stop-color="${stops.light}"/>
    </linearGradient>
    <radialGradient id="${glowId}" cx="0.15" cy="0.15" r="0.7">
      <stop offset="0%" stop-color="rgba(255,255,255,0.32)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&amp;display=swap');
    .g-owner  { font: 500 30px 'Manrope', sans-serif; fill: ${theme.subtext}; letter-spacing: -0.3px; }
    .g-title  { font: 800 ${repoFontSize}px 'Manrope', sans-serif; fill: ${theme.title}; letter-spacing: -2.5px; }
    .g-desc   { font: 400 26px 'Manrope', sans-serif; fill: ${theme.text}; }
    .g-url    { font: 500 22px 'Manrope', sans-serif; fill: ${theme.icon}; letter-spacing: 0.2px; }
    .g-pill   { font: 700 22px 'Manrope', sans-serif; fill: ${theme.title}; letter-spacing: 0.2px; }
    .g-pill-m { font: 500 22px 'Manrope', sans-serif; fill: ${theme.icon}; }
    .g-tag    { font: 700 16px 'Manrope', sans-serif; fill: ${theme.title}; letter-spacing: 2px; }
  </style>
  <g clip-path="url(#cardClip)">
    <rect width="${W}" height="${H}" fill="url(#${gradId})"/>
    <rect width="${W}" height="${H}" fill="url(#${glowId})"/>
    <circle cx="${W - 180}" cy="${H + 120}" r="380" fill="rgba(255,255,255,0.08)"/>
    <circle cx="120" cy="120" r="200" fill="rgba(255,255,255,0.06)"/>
    ${ghostMark({ x: 700, y: 380, scale: 30, opacity: 0.1, fill: ghostWhite })}
    ${logoMark({ x: 80, y: 70, opacity: 0.22, markFill: '#ffffff', accentFill: 'rgba(255,255,255,0.85)', bgFill: baseHex, textFill: '#ffffff', accentTextFill: 'rgba(255,255,255,0.9)', idSuffix: 'grad' })}
    ${avatarBase64 ? `
    <image href="${avatarBase64}" x="${avatarCX - avatarR}" y="${avatarCY - avatarR}" width="${avatarR * 2}" height="${avatarR * 2}" clip-path="url(#gradAvatar)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR + 4}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>
    <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR + 10}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>` : `
    <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR + 4}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>`}
    <text x="80" y="180" class="g-tag">GITHUB REPOSITORY</text>
    <text x="80" y="208" class="g-tag" opacity="0.7">${escapeXml((language || 'OPEN SOURCE').toUpperCase())}</text>
    <line x1="80" y1="232" x2="320" y2="232" stroke="${theme.title}" stroke-width="1" opacity="0.4"/>
    <text x="${contentCenter}" y="${ownerY}" text-anchor="middle" class="g-owner">${escapeXml(ownerLogin)}/</text>
    <text x="${contentCenter}" y="${titleY}" text-anchor="middle" class="g-title" style="font-size:${repoFontSize}px">${escapeXml(repoName)}</text>
    ${descLines.map((line, i) => `<text x="${contentCenter}" y="${descStartY + i * 40}" text-anchor="middle" class="g-desc">${escapeXml(line)}</text>`).join('\n    ')}
    ${homepage ? `<text x="${contentCenter}" y="${urlY}" text-anchor="middle" class="g-url" style="font-size:${urlFontSize}px">${escapeXml(homepage)}</text>` : ''}
    <g transform="translate(0, ${pillY})">
      <g transform="translate(${contentCenter - 420}, 0)">
        <rect x="0" y="0" width="140" height="56" rx="28" fill="${theme.pillBg}" stroke="${theme.pillBorder}" stroke-width="1"/>
        ${pillContent('star', stars, 140)}
      </g>
      <g transform="translate(${contentCenter - 260}, 0)">
        <rect x="0" y="0" width="140" height="56" rx="28" fill="${theme.pillBg}" stroke="${theme.pillBorder}" stroke-width="1"/>
        ${pillContent('fork', forks, 140)}
      </g>
      <g transform="translate(${contentCenter - 100}, 0)">
        <rect x="0" y="0" width="140" height="56" rx="28" fill="${theme.pillBg}" stroke="${theme.pillBorder}" stroke-width="1"/>
        ${pillContent('issues', issues, 140)}
      </g>
      <g transform="translate(${contentCenter + 60}, 0)">
        <rect x="0" y="0" width="140" height="56" rx="28" fill="${theme.pillBg}" stroke="${theme.pillBorder}" stroke-width="1"/>
        <text x="70" y="36" text-anchor="middle" class="g-pill">${language ? escapeXml(language) : '—'}</text>
      </g>
      <g transform="translate(${contentCenter + 220}, 0)">
        <rect x="0" y="0" width="200" height="56" rx="28" fill="${theme.pillBg}" stroke="${theme.pillBorder}" stroke-width="1"/>
        ${pillContent('scale', license || 'NO LICENSE', 200)}
      </g>
    </g>
  </g>
</svg>`;
}

module.exports = {
  name: 'gradient',
  width: 1280,
  height: 640,
  render,
};
