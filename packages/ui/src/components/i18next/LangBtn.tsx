import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ELangBtn } from './type'
import { transLangToText, transTextToLang, switchText } from './utils'

import style from './index.module.scss'

interface LangBtnProps {
  className?: string
  onClick?: (text: string) => void
  defaultText?: ELangBtn
}

function LangBtn(props: LangBtnProps) {
  const { i18n } = useTranslation()
  const defaultText = props.defaultText || transLangToText(i18n.language)
  //  语言btn展示的文案 为当前语言相反的语言
  const [text, setText] = useState(defaultText)
  const handleChange = (e) => {
    const nextText = e.target.innerText
    const lang = transTextToLang(nextText)
    setText(switchText(nextText))

    i18n.changeLanguage(lang)
    if (props.onClick) {
      props.onClick(nextText)
    }
  }

  useEffect(() => {
    props.defaultText && setText(switchText(props.defaultText))
  }, [props.defaultText])

  return (
    <div
      className={clsx(style.langChangeBtn, ...[props.className])}
      onClick={handleChange}
    >
      {text}
    </div>
  ) // 欢迎
}

export default LangBtn
