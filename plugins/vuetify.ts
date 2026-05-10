import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#4CAF50',
            secondary: '#8BC34A',
            accent: '#CDDC39',
            success: '#2E7D32',
            warning: '#FF9800',
            error: '#E53935',
            info: '#2196F3',
            background: '#F5F5F5',
            surface: '#FFFFFF',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#66BB6A',
            secondary: '#9CCC65',
            accent: '#D4E157',
            success: '#43A047',
            warning: '#FFA726',
            error: '#EF5350',
            info: '#42A5F5',
            background: '#121212',
            surface: '#1E1E1E',
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
