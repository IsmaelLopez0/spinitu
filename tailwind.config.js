/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

const spinituColors = {
  cararra: {
    50: '#ffffff',
    100: '#efefef',
    200: '#dcdcdc',
    300: '#bdbdbd',
    400: '#989898',
    500: '#7c7c7c',
    600: '#656565',
    700: '#525252',
    800: '#464646',
    900: '#3d3d3d',
    950: '#292929',
  },
  swirl: {
    50: '#f6f6f6',
    100: '#e7e7e7',
    200: '#d1d1d1',
    300: '#b0b0b0',
    400: '#888888',
    500: '#6d6d6d',
    600: '#5d5d5d',
    700: '#4f4f4f',
    800: '#454545',
    900: '#3d3d3d',
    950: '#000000',
  },
  mindaro: {
    50: '#f8f6f4',
    100: '#eeeae6',
    200: '#d7ccc3',
    300: '#c7b7aa',
    400: '#af9788',
    500: '#9f7f70',
    600: '#927064',
    700: '#7a5c54',
    800: '#644d48',
    900: '#52403c',
    950: '#2b211f',
  },
  orchid: {
    50: '#f3f6f4',
    100: '#e2e9e2',
    200: '#c7d3c8',
    300: '#a1b4a4',
    400: '#77907d',
    500: '#597460',
    600: '#425949',
    700: '#35473b',
    800: '#2c3931',
    900: '#243028',
    950: '#141a17',
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
    extend: {
      fontFamily: {
        'cormorant-upright': ['Cormorant Upright', 'serif'],
        cormorant: ['Cormorant', 'serif'],
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
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
      },
      fontSize: {
        'tremor-label': ['0.75rem', { lineHeight: '1rem' }],
        'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
        'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
        'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
        '6xl': '3.815rem',
        '7xl': '4.6rem',
        '8xl': '6.25rem',
        '9xl': '8.625rem',
        '10xl': '11.25rem',
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss'), require('@tailwindcss/forms')],
};
