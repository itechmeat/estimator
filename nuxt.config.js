export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  server: {
    port: 5600, // default: 3000
    host: '0.0.0.0', // default: localhost
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'estimator',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vue-placeholders.js',
    '~/plugins/vue-observe-visibility.client.js',
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    {
      path: '~/components/ui/',
      prefix: 'ui',
      ignore: ['**/*.js'],
    },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  styleResources: {
    scss: ['~/assets/styles/main.scss'],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'http://localhost:5600/',
  },
  privateRuntimeConfig: {
    apiSecret: process.env.API_SECRET,
  },
}
