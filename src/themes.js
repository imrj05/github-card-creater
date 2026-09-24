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

const TEMPLATE_THEMES = {
  default: null,
  terminal: {
    dark: {
      bg: '#0a0e0a',
      border: '#1a2e1a',
      title: '#39ff14',
      text: '#c9d1c9',
      subtext: '#6a8a6a',
      icon: '#6a8a6a',
      accent: '#00ff88',
      dim: '#0d1a0d',
      prompt: '#00ff88',
    },
    light: {
      bg: '#f4f6f0',
      border: '#c2cdb6',
      title: '#1f6f1f',
      text: '#1a241a',
      subtext: '#5a6e5a',
      icon: '#5a6e5a',
      accent: '#1f6f1f',
      dim: '#e3e9df',
      prompt: '#1f6f1f',
    },
  },
  gradient: {
    dark: {
      bg: '#0d1117',
      border: 'transparent',
      title: '#ffffff',
      text: 'rgba(255,255,255,0.92)',
      subtext: 'rgba(255,255,255,0.65)',
      icon: 'rgba(255,255,255,0.7)',
      pillBg: 'rgba(255,255,255,0.14)',
      pillBorder: 'rgba(255,255,255,0.22)',
    },
    light: {
      bg: '#f6f8fa',
      border: 'transparent',
      title: '#ffffff',
      text: 'rgba(255,255,255,0.95)',
      subtext: 'rgba(255,255,255,0.78)',
      icon: 'rgba(255,255,255,0.85)',
      pillBg: 'rgba(255,255,255,0.22)',
      pillBorder: 'rgba(255,255,255,0.35)',
    },
  },
  minimal: {
    dark: {
      bg: '#0d1117',
      border: '#21262d',
      title: '#e6edf3',
      text: '#c9d1d9',
      subtext: '#6e7681',
      icon: '#6e7681',
      rule: '#21262d',
    },
    light: {
      bg: '#ffffff',
      border: '#eaeef2',
      title: '#1f2328',
      text: '#24292e',
      subtext: '#656d76',
      icon: '#656d76',
      rule: '#eaeef2',
    },
  },
  newspaper: {
    dark: {
      bg: '#0d0f12',
      border: '#2a2f36',
      title: '#e8e6df',
      text: '#cfcabb',
      subtext: '#8a8676',
      icon: '#8a8676',
      rule: '#3a3a32',
      accent: '#c9a96a',
      serif: 'Georgia, "Times New Roman", serif',
    },
    light: {
      bg: '#f4efe6',
      border: '#1a1a1a',
      title: '#1a1a1a',
      text: '#2a2a2a',
      subtext: '#5a5a5a',
      icon: '#5a5a5a',
      rule: '#1a1a1a',
      accent: '#8a3a1a',
      serif: 'Georgia, "Times New Roman", serif',
    },
  },
};

function resolveTheme(variant, baseTheme) {
  if (variant === 'default') return baseTheme;
  const t = TEMPLATE_THEMES[variant];
  if (!t) return baseTheme;
  return t[baseTheme === THEMES.light ? 'light' : 'dark'] || t.dark;
}

module.exports = { THEMES, TEMPLATE_THEMES, resolveTheme };
