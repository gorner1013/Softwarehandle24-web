import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
} from 'unocss'

export default defineConfig({
  rules: [],
  theme: {
    fontFamily: {
      sans: 'Raleway',
    },
    colors: {
      'gray-100': '#F9F9FB',
      'gray-200': '#F0F0F3',
      'gray-300': '#E0E1E6',
      'gray-400': '#D9D9E0',
      'gray-500': '#B9BBC6',
      'gray-600': '#8B8D98',
      'gray-700': '#60646C',
      'gray-800': '#1C2024',
      'green-300': '#8AE5CF',
      'green-400': '#199A7B',
      'slate-2': '#18191B',
      'slate-light-7': '#CDCED6',
      'slate-light-11': '#60646C',
      primary: '#FF8C1A',
    },
    boxShadow: {
      '1.5xl': '0px 2px 10px 0px rgba(0, 0, 0, 0.15)',
      '2xl': '0px 0px 10px 0px rgba(0, 0, 0, 0.25)',
    },
    width: {
      '1/3p': '30%',
      calc: 'calc(100% - 20px)',
      '1xs': '343px',
    },
    maxWidth: {
      '8xl': '96rem',
      '4/5': '80%',
    },
    extend: {
      spacing: {
        '1.5xl': '1300px',
      },
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () =>
          import('@iconify-json/carbon/icons.json').then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
})
