// Inlined Heroicons (outline, 24px grid) + one HugeIcons git-fork for the
// GitHub "forks" stat. Inlined so generated cards stay dependency-free and
// rasterise to PNG without external requests.

const PATHS = {
  star: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.56.56 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.56.56 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.56.56 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.56.56 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.56.56 0 0 0 .475-.345z',
  scale: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48 48 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0q1.515.215 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a6 6 0 0 1-2.031.352a6 6 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202zm-16.5.52q1.485-.305 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a6 6 0 0 1-2.031.352a6 6 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202z',
  link: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
  user: 'M15.75 6a3.75 3.75 0 1 1-7.5 0a3.75 3.75 0 0 1 7.5 0M4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.9 17.9 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632',
  issues: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-9 3.75h.008v.008H12z',
};

function icon(name, { x = 0, y = 0, size = 24, color = 'currentColor', stroke = 1.5, opacity } = {}) {
  const scale = size / 24;
  const op = opacity == null ? '' : ` opacity="${opacity}"`;

  if (name === 'fork') {
    return `<g transform="translate(${x}, ${y}) scale(${scale})"${op} fill="none" stroke="${color}" stroke-width="${stroke}">` +
      `<path fill="${color}" d="M6 8a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm6 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm6-12a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/>` +
      `<path stroke-linecap="round" stroke-linejoin="round" d="M6.017 8.74c0 1.674-.242 3.46 3.204 3.246h2.784m5.988-3.41c.133 3.41-1.073 3.189-2.207 3.41h-3.78m0 3.714v-3.714"/>` +
      '</g>';
  }

  const body = PATHS[name];
  if (!body) return '';
  return `<g transform="translate(${x}, ${y}) scale(${scale})"${op}>` +
    `<path d="${body}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>` +
    '</g>';
}

module.exports = { icon };
