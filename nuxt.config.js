export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'fpl-live',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'fantasy premier league',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  target: 'static',
  ssr: false,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/fontawesome',
      {
        component: 'fa',
        icons: {
          solid: true,
        },
        suffix: true,
      },
    ],
    '@nuxtjs/firebase',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/cloudinary',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL:
      'https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/',
    debug: true,
    proxyHeaders: false,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  cloudinary: {
    cloudName: process.env.CLOUDNAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    useComponent: true,
  },
  firebase: {
    lazy: false,
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH,
      databaseURL: process.env.FIREBASE_DB_URL,
      projectId: process.env.FIREBASE_PROJ_ID,
      storageBucket: process.env.FIREBASE_STORAGE,
      messagingSenderId: process.env.FIREBASE_MSG_SENDER,
      appId: process.env.FIREBASE_APP_ID,
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChanged',
        },
        ssr: true,
        // emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : false,
      },
      firestore: {
        memoryOnly: true,
      },
    },
  },
  privateRuntimeConfig: {},
}
