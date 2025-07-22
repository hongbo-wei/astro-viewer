// eslint-disable-next-line
import MdContent from '../MarkdownViewer'
import AIBlue from './assets/aiBlue.svg'
import AIGray from './assets/aiGray.svg'
import AILoading from './assets/loading.gif'

import styles from './index.module.scss'

const defaultAvatarMap = {
  latest: AIBlue,
  outdated: AIGray,
  pending: AILoading,
}

export default function ChatResponse({
  content,
  status,
  hasOption,
  option,
  showTime,
  time,
  avatarMap,
  noCopy,
}: {
  content: string // markdown内容
  status: string // 'pending' | 'latest' | 'outdated' 作用于头像
  hasOption?: boolean // 是否展示操作按钮
  option?: any // 操作组件
  showTime: boolean // 是否展示时间
  time?: string // 时间
  avatarMap?: {
    latest: string
    outdated: string
    pending?: string
  } // 头像映射, key为status值, value为头像url
  noCopy?: boolean // 是否有复制代码按钮
}) {
  return (
    <div
      className={`${styles.response} ${showTime && time ? styles.showTime : ''}`}
    >
      <div className={styles.avatar}>
        <img
          src={avatarMap ? avatarMap[status] : defaultAvatarMap[status]}
          alt="avatar"
        />
      </div>
      <div className={styles.content}>
        {showTime && <div className={styles.time}>{time}</div>}
        <div className={styles.text}>
          <MdContent text={content} noCopy={noCopy} />
          {hasOption && <div>{option}</div>}
        </div>
      </div>
    </div>
  )
}
