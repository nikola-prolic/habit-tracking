// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMTUpdate'] }],
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    'nuxt-echarts',
    "@prisma/nuxt",
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-fonts', {
      families: {
        Roboto: true,
        Inter: [400, 700],
        'Josefin+Sans': true,
        Lato: [100, 300],
        Raleway: {
          wght: [100, 400],
          ital: [100]
        },
        'Crimson Pro': {
          wght: '200..900',
          ital: '200..700',
        },
        'Poppins': {
          wght: '200..900',
          ital: '200..700',
        }
      }
    }],
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false, // Optional:  If true, component names will include the directory prefix
      extensions: ['.vue'], // File extensions to scan for
    }
  ],
  prisma: {
    runMigration: false, // Important for MongoDB
    generateClient: true
  },
  devtools: { enabled: true },
  echarts: {
    renderer: ['svg', 'canvas']
  },
  auth: {
    globalAppMiddleware: true,
    baseURL: process.env.BASE_URL + "/api/auth"
  },

  runtimeConfig: {
    // Keys within public are also exposed client-side
    DATABASE_URL: process.env.DATABASE_URL || 'file:' + require('path').join(process.cwd(), 'prisma', 'dev.db'),
    googleAuthClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    authSecret: process.env.AUTH_APP_SECRET,
    public: {
      baseURL: 'http://localhost:3000', //Default value if no env var
      googleAuthClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    },
  },

  imports: {
    dirs: ['./stores']
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      }
    }
  },
  compatibilityDate: '2025-02-08'
})
