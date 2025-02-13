import { use } from 'i18next'
import { initReactI18next } from 'react-i18next'

import resources from './resources'

const STORAGE_KEY = 'freedom-tool-app-locale'
export const ENGLISH_LOCALE = 'en-US'

const locale = localStorage?.getItem(STORAGE_KEY) ?? ENGLISH_LOCALE

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}

// for configuration options read: https://www.i18next.com/overview/configuration-options
const i18n = use(initReactI18next).init({
  fallbackLng: locale,
  returnNull: false,
  lng: locale,
  resources,
  interpolation: {
    escapeValue: false, // not needed for React as it escapes by default
  },
})

export default i18n
