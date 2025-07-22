import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { ELangBtn, EApp } from './type'
import { en, zh } from '../../locales'

i18next.use(LanguageDetector).use(initReactI18next)

i18next.init({
  ns: [EApp.cockpit, EApp.mdf, EApp.common],
  resources: {
    en,
    zh,
  },
  lng: location.pathname.includes(ELangBtn.EN) ? 'en' : 'zh',
})

export { i18next }
