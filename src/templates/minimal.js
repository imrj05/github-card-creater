const { escapeXml, wrapText, fitFontSize } = require('../utils');
const { logoMark, ghostMark } = require('./_watermarks');

function render(ctx) {
  const { W, H, theme, repoName, ownerLogin, description, language, langColor, stars, forks, issues, homepage, license, avatarBase64 } = ctx;
  const cx = W / 2;
  const descLines = wrapText(description || 'No description provided.', 58, 2);
  const avatarR = 50;
  const avatarCY = 150;
  const subY = 248;
  const titleY = 306;
  const descStartY = titleY + 58;
  const urlY = descStartY + descLines.length * 40 + 16;
  const ruleY = urlY + (homepage ? 64 : 34);
  const statsY = ruleY + 58;
  const titleFs = fitFontSize(repoName, 1080, 84, 44, 0.46);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">
  <defs>
    <clipPath id="minAvatar">
      <circle cx="${cx}" cy="${avatarCY}" r="${avatarR}"/>
    </clipPath>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&amp;display=swap');
    .m-sub  { font: 500 28px 'Manrope', sans-serif; fill: ${theme.subtext}; letter-spacing: 4px; text-transform: uppercase; }
    .m-title{ font: 700 ${titleFs}px 'Manrope', sans-serif; fill: ${theme.title}; letter-spacing: -2.5px; }
    .m-desc { font: 400 26px 'Manrope', sans-serif; fill: ${theme.text}; }
    .m-url  { font: 500 22px 'Manrope', sans-serif; fill: ${theme.subtext}; }
    .m-stat { font: 500 26px 'Manrope', sans-serif; fill: ${theme.subtext}; }
    .m-stat-n{ font: 600 26px 'Manrope', sans-serif; fill: ${theme.text}; }
    .m-sep  { font: 400 26px 'Manrope', sans-serif; fill: ${theme.icon}; }
  </style>
  <rect width="${W}" height="${H}" fill="${theme.bg}"/>
  ${ghostMark({ x: cx - 200, y: 120, scale: 25, opacity: 0.05, fill: theme.text })}
  ${logoMark({ x: 80, y: 70, opacity: 0.15, markFill: theme.text, accentFill: theme.title, bgFill: theme.bg, textFill: theme.text, accentTextFill: theme.title, idSuffix: 'min' })}
  ${avatarBase64 ? `
  <image href="${avatarBase64}" x="${cx - avatarR}" y="${avatarCY - avatarR}" width="${avatarR * 2}" height="${avatarR * 2}" clip-path="url(#minAvatar)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${cx}" cy="${avatarCY}" r="${avatarR}" fill="none" stroke="${theme.border}" stroke-width="2"/>` : `
  <circle cx="${cx}" cy="${avatarCY}" r="${avatarR}" fill="${theme.subtext}" opacity="0.3"/>`}
  <text x="${cx}" y="${subY}" text-anchor="middle" class="m-sub">${escapeXml(ownerLogin)}</text>
  <text x="${cx}" y="${titleY}" text-anchor="middle" class="m-title">${escapeXml(repoName)}</text>
  ${descLines.map((line, i) => `<text x="${cx}" y="${descStartY + i * 40}" text-anchor="middle" class="m-desc">${escapeXml(line)}</text>`).join('\n  ')}
  ${homepage ? `<text x="${cx}" y="${urlY}" text-anchor="middle" class="m-url">${escapeXml(homepage)}</text>` : ''}
  <line x1="${cx - 60}" y1="${ruleY}" x2="${cx + 60}" y2="${ruleY}" stroke="${theme.rule}" stroke-width="1.5"/>
  <text x="${cx}" y="${statsY}" text-anchor="middle" class="m-stat">
    <tspan class="m-stat-n">${escapeXml(stars)}</tspan><tspan dx="4">stars</tspan>
    <tspan class="m-sep" dx="20">·</tspan>
    <tspan class="m-stat-n" dx="20">${escapeXml(forks)}</tspan><tspan dx="4">forks</tspan>
    <tspan class="m-sep" dx="20">·</tspan>
    <tspan class="m-stat-n" dx="20">${escapeXml(issues)}</tspan><tspan dx="4">open</tspan>
    ${language ? `<tspan class="m-sep" dx="20">·</tspan><tspan dx="20" fill="${langColor}">●</tspan><tspan class="m-stat" dx="6">${escapeXml(language)}</tspan>` : ''}
    ${license ? `<tspan class="m-sep" dx="20">·</tspan><tspan class="m-stat-n" dx="20">${escapeXml(license)}</tspan>` : ''}
  </text>
</svg>`;
}

module.exports = {
  name: 'minimal',
  width: 1280,
  height: 640,
  render,
};
