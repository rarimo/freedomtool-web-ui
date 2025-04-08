import { use } from 'i18next'
import { initReactI18next } from 'react-i18next'

import _resources from './resources'
import countries from './resources/countries_en.json'

const STORAGE_KEY = 'freedom-tool-app-locale'
export const ENGLISH_LOCALE = 'en-US'

const locale = localStorage?.getItem(STORAGE_KEY) ?? ENGLISH_LOCALE

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}

export function transformCountriesToI18nResources() {
  return countries.reduce(
    (acc, { name, flag, codes }) => {
      codes.forEach(code => {
        acc.names[code] = name
        acc.flags[code] = flag
      })
      return acc
    },
    {
      names: {} as Record<string, string>,
      flags: {} as Record<string, string>,
    },
  )
}

export const countriesEn = transformCountriesToI18nResources()

const resources = {
  en: {
    translation: {
      ..._resources.en.translation,
      countries: countriesEn,
    },
  },
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
