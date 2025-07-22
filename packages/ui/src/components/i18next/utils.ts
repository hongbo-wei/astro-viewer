import { ELangBtn } from './type'

function transLangToText(lang: string): ELangBtn {
  const map = {
    en: ELangBtn.EN,
    zh: ELangBtn.ZH,
    'zh-CN': ELangBtn.ZH,
  }
  return map[lang] ? map[lang] : 'Zh'
}
function transTextToLang(lang: string): ELangBtn {
  const map = {
    [ELangBtn.EN]: 'en',
    [ELangBtn.ZH]: 'zh-CN',
  }
  return map[lang] ? map[lang] : 'Zh'
}

function switchText(text: ELangBtn): ELangBtn {
  const map = {
    [ELangBtn.EN]: ELangBtn.ZH,
    [ELangBtn.ZH]: ELangBtn.EN,
  }
  return map[text]
}

export { transLangToText, transTextToLang, switchText }
