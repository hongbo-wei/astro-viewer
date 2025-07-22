import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import defaultActiveAvatar from '../../assets/aiBlue.svg'
import defaultOutdatedAvatar from '../../assets/aiGray.svg'
import defaultPendingAvatar from '../../assets/loading.gif'
import { i18nNS } from '../../constants'
import { useChat } from '../../useContext'
import ChatOption from '../ChatOption'

import styles from './index.module.scss'

const defaultAvatarMap = {
  latest: defaultActiveAvatar,
  outdated: defaultOutdatedAvatar,
  pending: defaultPendingAvatar,
}

export default function ChatOther({
  type,
  status,
}: {
  type: string
  status: string
}) {
  const { t } = useTranslation(i18nNS)
  const { avatarMap } = useChat()
  const content = {
    much: t('ai.muchError'),
    server: t('ai.serverError'),
    loading: (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined spin />} /> {t('ai.loading')}
      </div>
    ),
  }

  const avatarSrc = useMemo(() => {
    if (avatarMap) {
      return avatarMap[status]
    }
    return defaultAvatarMap[status]
  }, [avatarMap, status])

  return (
    <div className={`${styles.response}`}>
      <div className={styles.avatar}>
        <img src={avatarSrc} alt="avatar" />
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          {content[type]}
          {type !== 'loading' && status !== 'outdated' && (
            <ChatOption
              sentenceId={String(Math.random)}
              options={['regenerate']}
            />
          )}
        </div>
      </div>
    </div>
  )
}
