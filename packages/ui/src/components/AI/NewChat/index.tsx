import { PlusCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

import { i18nNS } from '../constants'

import styles from './index.module.scss'

export default function NewChat({ onAdd }: any) {
  const { t } = useTranslation(i18nNS)

  const handleNew = () => {
    onAdd()
  }

  return (
    <div className={styles.new} onClick={handleNew}>
      <div className={styles.content}>
        <PlusCircleOutlined className={styles.icon} />
        <div className={styles.text}>{t('ai.newChat')}</div>
      </div>
    </div>
  )
}
