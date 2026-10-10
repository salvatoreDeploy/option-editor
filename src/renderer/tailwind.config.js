import plugin from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.tsx']
export const theme = {
  extend: {
    fontFamily: {
      sans: 'Geist, sans-serif',
      mono: 'Geist Mono, monospace',
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
    },
    colors: {
      sidebar: 'rgb(var(--sidebar) / <alpha-value>)',
      background: 'rgb(var(--background) / <alpha-value>)',
      foreground: 'rgb(var(--foreground) / <alpha-value>)',
      card: {
        DEFAULT: 'rgb(var(--card) / <alpha-value>)',
        foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
      },
      popover: {
        DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
        foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
      },
      primary: {
        DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
        foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
      },
      secondary: {
        DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
        foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
      },
      muted: {
        DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
        foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
      },
      accent: {
        DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
        foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
      },
      destructive: {
        DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
        foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
      },
      success: 'rgb(var(--success) / <alpha-value>)',
      warning: 'rgb(var(--warning) / <alpha-value>)',
      border: 'rgb(var(--border) / <alpha-value>)',
      input: 'rgb(var(--input) / <alpha-value>)',
      ring: 'rgb(var(--ring) / <alpha-value>)',
    },
    keyframes: {
      slideIn: {
        from: { width: 0 },
        to: { width: 'var(--radix-collapsible-content-width)' },
      },
      slideOut: {
        from: { width: 'var(--radix-collapsible-content-width)' },
        to: { width: 0 },
      },
    },
    animation: {
      slideIn: 'slideIn 0.25s',
      slideOut: 'slideOut 0.25s',
    },
  },
}
export const plugins = [
  require('@tailwindcss/typography'),
  require('tailwind-scrollbar'),
  plugin(({ addUtilities }) => {
    addUtilities({
      '.region-drag': {
        '-webkit-app-region': 'drag',
      },
      '.region-no-drag': {
        '-webkit-app-region': 'no-drag',
      },
    })
  }),
]
