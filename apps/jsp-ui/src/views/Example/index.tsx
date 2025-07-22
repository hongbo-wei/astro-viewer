import { Empty } from '@zj-astro/ui'
import { useTranslation } from 'react-i18next'

import { i18nNS } from '@/constants'

import style from './index.module.scss'

export default function StarCat() {
  const { t } = useTranslation(i18nNS)

  return (
    <div className={style.wrap}>
      <Empty desc={<span>{t('common:export')}</span>} />
    </div>
  )
}
