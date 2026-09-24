import { describe, it, expect } from 'vitest';
import {
  escapeXml,
  formatCount,
  wrapText,
  dateStamp,
  LANGUAGE_COLORS,
} from './utils';

describe('escapeXml', () => {
  it('escapes & < > "', () => {
    expect(escapeXml('&<>"')).toBe('&amp;&lt;&gt;&quot;');
  });

  it('returns empty string for null/undefined', () => {
    expect(escapeXml(null)).toBe('');
    expect(escapeXml(undefined)).toBe('');
  });

  it('passes through normal text', () => {
    expect(escapeXml('hello world')).toBe('hello world');
  });
});

describe('formatCount', () => {
  it('formats thousands as k', () => {
    expect(formatCount(1234)).toBe('1.2k');
    expect(formatCount(2500)).toBe('2.5k');
  });

  it('returns string for numbers under 1000', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(999)).toBe('999');
  });

  it('handles null/undefined', () => {
    expect(formatCount(null)).toBe('0');
    expect(formatCount(undefined)).toBe('0');
  });
});

describe('wrapText', () => {
  it('wraps text at maxCharsPerLine', () => {
    const lines = wrapText('hello world foo bar baz', 10, 5);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[0].length).toBeLessThanOrEqual(10);
  });

  it('limits to maxLines', () => {
    const lines = wrapText('a b c d e f g h i j k l m n o p', 5, 2);
    expect(lines.length).toBeLessThanOrEqual(2);
  });

  it('returns array with empty string for empty text', () => {
    expect(wrapText('', 10, 3)).toEqual(['']);
  });
});

describe('dateStamp', () => {
  it('returns uppercase month year', () => {
    const stamp = dateStamp();
    expect(stamp).toMatch(/^[A-Z]+ \d{4}$/);
  });
});

describe('LANGUAGE_COLORS', () => {
  it('has expected languages', () => {
    expect(LANGUAGE_COLORS.JavaScript).toBe('#f1e05a');
    expect(LANGUAGE_COLORS.TypeScript).toBe('#3178c6');
    expect(LANGUAGE_COLORS.Python).toBe('#3572A5');
  });
});
