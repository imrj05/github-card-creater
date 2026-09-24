const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (let i = 0; i < words.length; i++) {
    const raw = words[i];
    const word = raw.length > maxCharsPerLine
      ? raw.slice(0, maxCharsPerLine - 1) + '…'
      : raw;
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (lines.length === maxLines - 1) {
      current = current.slice(0, Math.max(0, maxCharsPerLine - 1)) + '…';
      break;
    }

    lines.push(current);
    current = word;
  }

  if (current && lines.length < maxLines) lines.push(current);
  return lines.length ? lines : [''];
}

function fitFontSize(text, maxWidth, maxSize, minSize, factor = 0.55) {
  const len = String(text || '').length || 1;
  const size = Math.floor(maxWidth / (len * factor));
  return Math.max(minSize, Math.min(maxSize, size));
}

function truncateToWidth(text, fontSize, maxWidth, factor = 0.55) {
  const value = String(text == null ? '' : text);
  const maxChars = Math.max(4, Math.floor(maxWidth / (fontSize * factor)));
  return value.length <= maxChars ? value : value.slice(0, maxChars - 1) + '…';
}

function dateStamp() {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

function gradientStopsForColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const dark = `#${[r, g, b].map(v => Math.max(0, Math.floor(v * 0.25)).toString(16).padStart(2, '0')).join('')}`;
  return { light: hex, dark };
}

module.exports = {
  LANGUAGE_COLORS,
  fetchAvatarBase64,
  escapeXml,
  formatCount,
  wrapText,
  fitFontSize,
  truncateToWidth,
  dateStamp,
  gradientStopsForColor,
};
