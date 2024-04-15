/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

const spinituColors = {
  cararra: {
    50: '#f7f7f5',
    100: '#efefea',
    200: '#dad9ce',
    300: '#c2c1af',
    400: '#a8a58f',
    500: '#979278',
    600: '#8a836c',
    700: '#736c5b',
    800: '#5f594d',
    900: '#4e4940',
    950: '#292621',
  },
  swirl: {
    50: '#f7f6f5',
    100: '#edeae7',
    200: '#d6cfc8',
    300: '#c3b8ae',
    400: '#aa998d',
    500: '#988377',
    600: '#8c756a',
    700: '#756059',
    800: '#60504c',
    900: '#4f423f',
    950: '#292221',
  },
  mindaro: {
    50: '#fbffe6',
    100: '#f5fec9',
    200: '#e9fd99',
    300: '#d9f86a',
    400: '#c1ed2e',
    500: '#a2d30f',
    600: '#7ea907',
    700: '#5f800b',
    800: '#4c650f',
    900: '#405512',
    950: '#213003',
  },
  orchid: {
    50: '#fef5fc',
    100: '#fdeafb',
    200: '#fbd3f7',
    300: '#f7b0ed',
    400: '#f181de',
    500: '#e765d1',
    600: '#c831ac',
    700: '#a5268a',
    800: '#872170',
    900: '#6f205b',
    950: '#490939',
  },
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      theseasons: ['theseasons', 'sans-serif'],
      ttchocolates: ['ttchocolates', 'sans-serif'],
    },
    colors: {
      ...colors,
      ...spinituColors,
      // light mode
      tremor: {
        brand: {
          faint: colors.blue[50],
          muted: colors.blue[200],
          subtle: colors.blue[400],
          DEFAULT: colors.blue[500],
          emphasis: colors.blue[700],
          inverted: colors.white,
          ...colors,
          ...spinituColors,
        },
        background: {
          muted: colors.gray[50],
          subtle: colors.gray[100],
          DEFAULT: colors.white,
          emphasis: colors.gray[700],
          ...colors,
          ...spinituColors,
        },
        border: {
          DEFAULT: colors.gray[200],
          ...colors,
          ...spinituColors,
        },
        ring: {
          DEFAULT: colors.gray[200],
          ...colors,
          ...spinituColors,
        },
        content: {
          subtle: colors.gray[400],
          DEFAULT: colors.gray[500],
          emphasis: colors.gray[700],
          strong: colors.gray[900],
          inverted: colors.white,
          ...colors,
          ...spinituColors,
        },
      },
    },
    boxShadow: {
      // light
      'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'tremor-card':
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      'tremor-dropdown':
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      // dark
      'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'dark-tremor-card':
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      'dark-tremor-dropdown':
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    borderRadius: {
      'tremor-small': '0.375rem',
      'tremor-default': '0.5rem',
      'tremor-full': '9999px',
    },
    fontSize: {
      'tremor-label': ['0.75rem', { lineHeight: '1rem' }],
      'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
      'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
      'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
    },
  },
  plugins: [require('@headlessui/tailwindcss'), require('@tailwindcss/forms')],
};
