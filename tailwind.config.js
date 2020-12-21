const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: {
    //enable remove unused CSS only in production
    enabled: process.env.NODE_ENV === 'production',
    //any file that may contain the reference of CSS styles by class name.
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
    ],
  },
  theme: {
    minHeight: {
      0: '0',
      2: '2rem',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
    },
    extend: {
      colors: {
        'primary-light': '#26de81',
        primary: '#20bf6b',
      },
      fontFamily: {
        body: ['Lato', ...defaultTheme.fontFamily.sans],
      },
      height: {
        100: '30rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
