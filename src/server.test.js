import { describe, it, expect } from 'vitest';

describe('GET /api/variants', () => {
  it('returns list of variants from the module', async () => {
    const templates = await import('./templates');
    const variants = templates.list();
    expect(variants).toContain('default');
    expect(variants).toContain('terminal');
    expect(variants).toContain('gradient');
    expect(variants).toContain('minimal');
    expect(variants).toContain('newspaper');
  });
});

describe('Themes', () => {
  it('has dark and light themes', async () => {
    const { THEMES } = await import('./themes');
    expect(THEMES.dark).toBeDefined();
    expect(THEMES.light).toBeDefined();
    expect(THEMES.dark.bg).toBe('#0d1117');
    expect(THEMES.light.bg).toBe('#ffffff');
  });

  it('resolves theme per variant', async () => {
    const { resolveTheme, THEMES } = await import('./themes');
    const terminalDark = resolveTheme('terminal', THEMES.dark);
    expect(terminalDark.prompt).toBe('#00ff88');
  });
});
