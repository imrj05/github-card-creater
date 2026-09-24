const { escapeXml, wrapText, fitFontSize } = require('../utils');
const { logoMark, ghostMark } = require('./_watermarks');
const { icon } = require('./_icons');

function render(ctx) {
  const { W, H, theme, repoName, ownerLogin, description, language, langColor, stars, forks, issues, homepage, license, avatarBase64 } = ctx;
  const pad = 48;
  const termW = W - pad * 2;
  const termH = H - pad * 2;
  const x0 = pad;
  const y0 = pad;
  const headerH = 76;
  const sepY1 = y0 + headerH;
  const sepY2 = y0 + termH - 140;
  const titleY = y0 + headerH + 162;
  const descStartY = titleY + 42;
  const descLines = wrapText(description || 'No description provided.', 62, 3);
  const statY1 = y0 + termH - 90;
  const statY2 = y0 + termH - 56;
  const promptColor = theme.prompt || theme.accent;
  const dimBg = theme.dim || theme.bg;
  const accent = theme.accent || theme.title;
  const repoFull = `${ownerLogin}/${repoName}`;
  const repoFontSize = fitFontSize(repoName, termW - 56, 56, 34, 0.6);

  const statFs = 22;
  const charW = statFs * 0.6;
  const statRow = (items, baseY) => {
    let cx = x0 + 28;
    return items.map((it) => {
      if (it.sep) {
        const sep = `<text x="${cx}" y="${baseY}" class="t t-stat" fill="${theme.border}">│</text>`;
        cx += charW + 22;
        return sep;
      }
      let out = '';
      if (it.icon) {
        out += icon(it.icon, { x: cx, y: baseY - 16, size: 20, color: it.color || accent });
        cx += 26;
      } else if (it.dot) {
        out += `<circle cx="${cx + 7}" cy="${baseY - 7}" r="7" fill="${it.dot}"/>`;
        cx += 20;
      }
      if (it.text != null) {
        out += `<text x="${cx}" y="${baseY}" class="t ${it.cls || 't-stat'}"${it.color ? ` fill="${it.color}"` : ''}>${escapeXml(it.text)}</text>`;
        cx += String(it.text).length * charW + (it.gap || 0);
      }
      return out;
    }).join('');
  };

  const row1Items = [
    { icon: 'star', color: accent },
    { text: stars, cls: 't-stat-n', gap: 6 },
    { text: 'stars', gap: 24 },
    { sep: true },
    { icon: 'fork', color: accent },
    { text: forks, cls: 't-stat-n', gap: 6 },
    { text: 'forks', gap: 24 },
    { sep: true },
    { icon: 'issues', color: accent },
    { text: issues, cls: 't-stat-n', gap: 6 },
    { text: 'issues' },
  ];
  const row2Items = [];
  if (language) row2Items.push({ dot: langColor }, { text: language, gap: license ? 24 : 0 });
  if (language && license) row2Items.push({ sep: true });
  if (license) row2Items.push({ icon: 'scale', color: accent }, { text: license });

  const avatarR = 24;
  const avatarCX = x0 + 124;
  const avatarCY = y0 + headerH / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" overflow="hidden">
  <defs>
    <clipPath id="termClip">
      <rect x="${x0}" y="${y0}" width="${termW}" height="${termH}" rx="14" ry="14"/>
    </clipPath>
    <clipPath id="termAvatar">
      <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}"/>
    </clipPath>
  </defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&amp;display=swap');
    .t  { font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Consolas, monospace; }
    .t-prompt  { font: 700 22px 'JetBrains Mono', monospace; fill: ${promptColor}; }
    .t-cmd     { font: 500 24px 'JetBrains Mono', monospace; fill: ${theme.text}; }
    .t-out     { font: 400 22px 'JetBrains Mono', monospace; fill: ${theme.subtext}; }
    .t-title   { font: 800 56px 'JetBrains Mono', monospace; fill: ${theme.title}; letter-spacing: -1.5px; }
    .t-desc    { font: 400 26px 'JetBrains Mono', monospace; fill: ${theme.text}; }
    .t-stat    { font: 500 22px 'JetBrains Mono', monospace; fill: ${theme.subtext}; }
    .t-stat-n  { font: 700 22px 'JetBrains Mono', monospace; fill: ${theme.text}; }
    .t-tag     { font: 600 20px 'JetBrains Mono', monospace; fill: ${theme.subtext}; }
    .t-user    { font: 700 20px 'JetBrains Mono', monospace; fill: ${theme.text}; letter-spacing: 0.3px; }
  </style>
  <rect x="${x0}" y="${y0}" width="${termW}" height="${termH}" rx="14" ry="14" fill="${dimBg}" stroke="${theme.border}" stroke-width="1.5"/>
  ${ghostMark({ x: 900, y: 240, scale: 22, opacity: 0.05, fill: theme.accent })}
  <g clip-path="url(#termClip)">
    <rect x="${x0}" y="${y0}" width="${termW}" height="${headerH}" fill="${theme.bg}" opacity="0.6"/>
    <circle cx="${x0 + 24}" cy="${y0 + headerH / 2}" r="7" fill="${theme.border}"/>
    <circle cx="${x0 + 48}" cy="${y0 + headerH / 2}" r="7" fill="${theme.border}"/>
    <circle cx="${x0 + 72}" cy="${y0 + headerH / 2}" r="7" fill="${theme.border}"/>
    ${avatarBase64 ? `
    <image href="${avatarBase64}" x="${avatarCX - avatarR}" y="${avatarCY - avatarR}" width="${avatarR * 2}" height="${avatarR * 2}" clip-path="url(#termAvatar)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}" fill="none" stroke="${theme.border}" stroke-width="1.5"/>` : `
    <circle cx="${avatarCX}" cy="${avatarCY}" r="${avatarR}" fill="${theme.subtext}" opacity="0.4"/>`}
    <text x="${avatarCX + avatarR + 14}" y="${avatarCY + 7}" class="t t-user">${escapeXml(ownerLogin || 'guest')}<tspan fill="${theme.subtext}" font-weight="400">@github: ~/repos</tspan></text>
    <line x1="${x0 + 16}" y1="${sepY1}" x2="${x0 + termW - 16}" y2="${sepY1}" stroke="${theme.border}" stroke-width="1"/>
    <text x="${x0 + 28}" y="${y0 + headerH + 50}" class="t t-prompt">$</text>
    <text x="${x0 + 56}" y="${y0 + headerH + 50}" class="t t-cmd">gh repo view <tspan fill="${theme.title}" font-weight="700">${escapeXml(repoFull)}</tspan></text>
    ${homepage ? `
    <text x="${x0 + 28}" y="${y0 + headerH + 88}" class="t t-prompt">$</text>
    <text x="${x0 + 56}" y="${y0 + headerH + 88}" class="t t-out"># homepage: <tspan fill="${theme.accent}">${escapeXml(homepage)}</tspan></text>` : `
    <text x="${x0 + 28}" y="${y0 + headerH + 88}" class="t t-prompt">$</text>
    <text x="${x0 + 56}" y="${y0 + headerH + 88}" class="t t-out"># no homepage configured</text>`}
    <text x="${x0 + 28}" y="${titleY}" class="t t-title" style="font-size:${repoFontSize}px">${escapeXml(repoName)}</text>
    ${descLines.map((line, i) => `<text x="${x0 + 28}" y="${descStartY + i * 40}" class="t t-desc">${escapeXml(line)}</text>`).join('\n    ')}
    <line x1="${x0 + 16}" y1="${sepY2}" x2="${x0 + termW - 16}" y2="${sepY2}" stroke="${theme.border}" stroke-width="1"/>
    ${statRow(row1Items, statY1)}
    ${row2Items.length ? statRow(row2Items, statY2) : ''}
    ${logoMark({ x: x0 + termW - 168, y: y0 + termH - 50, opacity: 0.22, markFill: theme.text, accentFill: theme.accent, bgFill: theme.bg, textFill: theme.text, accentTextFill: theme.accent, idSuffix: 'term' })}
  </g>
</svg>`;
}

module.exports = {
  name: 'terminal',
  width: 1280,
  height: 640,
  render,
};
