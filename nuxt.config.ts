import { locales } from './config/i18n'
import modules from './config/modules'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: '',
        shopwareAccessToken: '',
      },

      i18n: {
        baseUrl: '',
      },
    },
  },



  i18nModules: {
    initial: ['global'],
  },
  content: modules.content,
  devtools: { enabled: true },

  modules: [
    '@modernice/nuxt-i18n-modules',
    '@vueuse/nuxt',
    '@shopware-pwa/nuxt3-module',
    '@shopware-pwa/cms-base',
    'nuxt-swiper',
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@morev/vue-transitions/nuxt',
    '@nuxt/image',
  ],
  i18n: {
    locales: locales,
    defaultLocale: 'de',
    detectBrowserLanguage: false,

  },
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
        },
      ],
    },
  },
  swiper: {},

  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },

  postcss: {
    plugins: {
      '@unocss/postcss': {},
    },
  },

  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@unocss/reset/tailwind.css',
  ],
})
