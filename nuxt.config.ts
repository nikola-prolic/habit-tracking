// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
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
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true
    },
    baseURL: process.env.BASE_URL + "/api/auth",
    globalAppMiddleware: true
  },
  runtimeConfig: {
    // Keys within public are also exposed client-side
    googleAuthClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET, // Another way to set, with no default
    authSecret: process.env.AUTH_APP_SECRET,
    public: {
      baseURL: 'http://localhost:3000', //Default value if no env var
      googleAuthClientId: process.env.AUTH_GOOGLE_CLIENT_ID, // Another way to set, with no default
    },
  },
  imports: {

  }
})
