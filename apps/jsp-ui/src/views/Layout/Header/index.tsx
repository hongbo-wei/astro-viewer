import { LangBtn, transLangToText, AIcon } from '@zj-astro/ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { i18nNS } from '@/constants'
import Menu from '@/views/Layout/Menu'

import style from './index.module.scss'

// TODO: 需要换成template的name
function Header() {
  const { t, i18n } = useTranslation(i18nNS)
  const navigate = useNavigate()
  const { lang } = useParams()
  const location = useLocation()
  const { pathname, search, hash } = location

  useEffect(() => {
    document.title = t('appName')
  }, [lang, t])

  const changeLang = (lang) => {
    const fullURL = `${pathname}${search}${hash}`
    const arr = fullURL.split('/')
    arr[1] = lang
    navigate(arr.join('/'), { replace: true })
  }

  return (
    <div className={style.header}>
      <div className={style.titleWrap}>
        <AIcon className={style.logo} type="icon-a-Frame32" />
        <div className={style.title}>{t('appName')}</div>
      </div>
      <Menu />
      <LangBtn
        className={style.langBtn}
        onClick={changeLang}
        defaultText={transLangToText(i18n.language)}
      />
    </div>
  )
}

export default Header
