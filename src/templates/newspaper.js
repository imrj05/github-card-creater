const { escapeXml, wrapText, fitFontSize, dateStamp } = require('../utils');
const { logoMark, ghostMark } = require('./_watermarks');

function render(ctx) {
  const { W, H, theme, repoName, ownerLogin, description, language, license, stars, forks, issues, homepage, avatarBase64 } = ctx;
  const serif = theme.serif || 'Georgia, serif';
  const dateStr = dateStamp();
  const frameX = 56;
  const frameY = 56;
  const frameW = W - frameX * 2;
  const frameH = H - frameY * 2;
  const innerX = frameX + 40;
  const innerRight = W - frameX - 40;
  const leftX = innerX;
  const leftTextX = innerX + 130;
  const rightX = W - frameX - 300;
  const gutterX = rightX - 24;
  const leftMax = gutterX - leftTextX;
  const headlineSize = fitFontSize(repoName, leftMax, 64, 32, 0.48);
  const mastheadY = 110;
  const rule1Y = 142;
  const rule2Y = 150;
  const avatarR = 45;
  const avatarCX = leftX + avatarR + 10;
  const avatarCY = 260;
  const headlineY = 260;
  const subheadY = 302;
  const descStartY = 352;
  const descLines = wrapText(description || '— No description provided —', 52, 3);
  const sidebarTop = 230;
  const statLineH = 64;
  const statNums = [stars, forks, issues, license || '—'];
  const statLabels = ['STARS', 'FORKS', 'OPEN ISSUES', 'LICENSE'];
  const footerRuleY = frameY + frameH - 72;
  const footerY = footerRuleY + 28;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">
  <defs>
    <clipPath id="newsAvatar">
      <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}"/>
    </clipPath>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&amp;display=swap');
    .n { font-family: ${serif}; }
    .n-mast    { font: 900 40px ${serif}; fill: ${theme.title}; letter-spacing: 6px; }
    .n-mast-r  { font: 400 italic 18px ${serif}; fill: ${theme.subtext}; letter-spacing: 1px; }
    .n-head    { font: 900 64px ${serif}; fill: ${theme.title}; letter-spacing: -1.5px; }
    .n-sub     { font: italic 400 22px ${serif}; fill: ${theme.subtext}; }
    .n-desc    { font: 400 22px ${serif}; fill: ${theme.text}; }
    .n-label   { font: 700 13px ${serif}; fill: ${theme.accent}; letter-spacing: 3px; }
    .n-num     { font: 900 44px ${serif}; fill: ${theme.title}; }
    .n-num-sm  { font: 700 30px ${serif}; fill: ${theme.title}; }
    .n-foot    { font: 700 13px ${serif}; fill: ${theme.subtext}; letter-spacing: 3px; }
    .n-foot-r  { font: italic 400 15px ${serif}; fill: ${theme.subtext}; }
  </style>
  <rect width="${W}" height="${H}" fill="${theme.bg}"/>
  <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" fill="none" stroke="${theme.border}" stroke-width="2"/>
  ${ghostMark({ x: 760, y: 360, scale: 18, opacity: 0.04, fill: theme.text })}
  ${logoMark({ x: innerX, y: mastheadY - 28, opacity: 0.16, markFill: theme.text, accentFill: theme.accent, bgFill: theme.bg, textFill: theme.text, accentTextFill: theme.accent, idSuffix: 'news' })}
  <text x="${leftTextX}" y="${mastheadY}" class="n n-mast">THE GITHUB CHRONICLE</text>
  <text x="${innerRight}" y="${mastheadY}" text-anchor="end" class="n n-mast-r">Vol. I · ${escapeXml(dateStr)}</text>
  <line x1="${frameX}" y1="${rule1Y}" x2="${frameX + frameW}" y2="${rule1Y}" stroke="${theme.rule}" stroke-width="2"/>
  <line x1="${frameX}" y1="${rule2Y}" x2="${frameX + frameW}" y2="${rule2Y}" stroke="${theme.rule}" stroke-width="0.5"/>
  ${avatarBase64 ? `
  <image href="${avatarBase64}" x="${avatarCX - avatarR}" y="${avatarCY - avatarR}" width="${avatarR * 2}" height="${avatarR * 2}" clip-path="url(#newsAvatar)" preserveAspectRatio="xMidYMid slice"/>
  <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}" fill="none" stroke="${theme.border}" stroke-width="2"/>` : `
  <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}" fill="${theme.subtext}" opacity="0.3"/>`}
  <text x="${leftTextX}" y="${headlineY}" class="n n-head" style="font-size:${headlineSize}px">${escapeXml(repoName)}</text>
  <text x="${leftTextX}" y="${subheadY}" class="n n-sub">a repository by ${escapeXml(ownerLogin)}</text>
  ${descLines.map((line, i) => `<text x="${leftTextX}" y="${descStartY + i * 34}" class="n n-desc">${escapeXml(line)}</text>`).join('\n  ')}
  ${homepage ? `<text x="${leftTextX}" y="${descStartY + descLines.length * 34 + 16}" class="n n-sub" fill="${theme.accent}" font-style="normal" font-weight="700">→ ${escapeXml(homepage)}</text>` : ''}
  <line x1="${gutterX}" y1="${sidebarTop - 30}" x2="${gutterX}" y2="${sidebarTop + statLineH * 4 - 8}" stroke="${theme.rule}" stroke-width="0.5"/>
  <g transform="translate(${rightX}, ${sidebarTop})">
    ${statLabels.map((label, i) => `
    <text x="0" y="${i * statLineH + 14}" class="n n-label">${label}</text>
    <text x="0" y="${i * statLineH + 52}" class="n ${i === 3 ? 'n-num-sm' : 'n-num'}">${escapeXml(statNums[i])}</text>`).join('')}
  </g>
  <line x1="${frameX}" y1="${footerRuleY}" x2="${frameX + frameW}" y2="${footerRuleY}" stroke="${theme.rule}" stroke-width="0.5"/>
  <text x="${innerX}" y="${footerY}" class="n n-foot">EST. ${new Date().getFullYear()}${language ? ` · ${escapeXml(language)}` : ''}</text>
  <text x="${innerRight}" y="${footerY}" text-anchor="end" class="n n-foot-r">github.com/${escapeXml(ownerLogin)}/${escapeXml(repoName)}</text>
</svg>`;
}

module.exports = {
  name: 'newspaper',
  width: 1280,
  height: 640,
  render,
};
