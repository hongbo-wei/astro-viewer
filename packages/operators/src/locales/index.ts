import en from './en'
import zh from './zh'

type LocaleKey = keyof typeof en

export const getLocale = (lang: 'en' | 'zh', key: LocaleKey) => {
  return lang === 'zh' ? zh[key] : en[key]
}
