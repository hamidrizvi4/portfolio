import type { Config } from 'tailwindcss';

// Every color, font, and easing points at a CSS variable in app/globals.css,
// so the tokens live in exactly one place. Colors are RGB channels so
// opacity modifiers (bg-ink/85, bg-ink-2/70) work.
const channel = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: channel('ink'), 2: channel('ink-2'), 3: channel('ink-3') },
        rule: 'var(--rule)',
        beige: channel('beige'),
        camel: { DEFAULT: channel('camel'), dim: channel('camel-dim') },
        burgundy: { DEFAULT: channel('burgundy'), bright: channel('burgundy-bright') },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        serif: ['var(--font-body)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(4rem, 13vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        section: ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        statement: ['clamp(1.75rem, 3.6vw, 3.25rem)', { lineHeight: '1.15' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      maxWidth: { site: '1600px' },
      spacing: { gutter: 'var(--gutter)', section: 'var(--section-gap)' },
      transitionTimingFunction: { out: 'var(--ease-out)', 'in-out': 'var(--ease-in-out)' },
      transitionDuration: { fast: '180ms', base: '320ms', slow: '700ms' },
    },
  },
  plugins: [],
};

export default config;
