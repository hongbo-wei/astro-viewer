import { ReadOutlined } from '@ant-design/icons'
import { Image } from 'antd'
import { useTranslation } from 'react-i18next'

import UserAvatar from '../../assets/user.svg'
import { i18nNS } from '../../constants'

import styles from './index.module.scss'

export default function ChatQuestion({
  question,
  showTime,
  time,
  uploadFile,
  searchType,
}: {
  question: string
  showTime: boolean
  time?: string
  uploadFile?: Array<{ src: string }>
  searchType?: 'csstInfoSearch' | 'academicSearch'
}) {
  const { t } = useTranslation(i18nNS)
  return (
    <div
      className={`${styles.question} ${showTime && time ? styles.showTime : ''}`}
    >
      <div className={styles.avatar}>
        <div className={styles.img}>
          <img src={UserAvatar} alt="avatar" />
        </div>
      </div>
      <div className={styles.content}>
        {showTime && <div className={styles.time}>{time}</div>}
        <div className={styles.text}>
          {searchType === 'academicSearch' && (
            <div className={styles.academicSearch}>
              <ReadOutlined style={{ marginRight: 8 }} />
              {t('ai.academicSearch')}
            </div>
          )}

          {question}
        </div>
        {uploadFile && (
          <Image src={uploadFile[0]?.src} className={styles.uploadImg} />
        )}
      </div>
    </div>
  )
}
