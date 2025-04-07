import countriesEn from './resources/countries_en.json'
import en from './resources/en.json'

export default {
  en: {
    translation: {
      ...en,
      ...countriesEn,
    },
  },
}
