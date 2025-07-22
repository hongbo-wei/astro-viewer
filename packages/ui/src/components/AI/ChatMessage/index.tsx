import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import ChatOption from './ChatOption'
import ChatOther from './ChatOther'
import ChatQuestion from './ChatQuestion'
import ChatResponse from '../../ChatResponse'
// eslint-disable-next-line
import { i18nNS } from '../constants'
import { ChatItem } from '../index'
import { useChat } from '../useContext'

import styles from './index.module.scss'

export default function ChatMessage({ list, greeting }: any) {
  const { avatarMap, hasOperate = true, loading, noCopy } = useChat() // props hasOperate: default true
  const { t } = useTranslation(i18nNS)
  const greetItem: ChatItem = {
    type: 'answer',
    content: greeting ?? t('ai.intro'),
    sentenceId: '',
  }

  return (
    <div className={styles.message}>
      <ChatResponse
        content={greetItem.content}
        status={list.length === 0 ? 'latest' : 'outdated'}
        key={greetItem.sentenceId}
        hasOption={false}
        showTime={false}
        {...(avatarMap ? { avatarMap } : {})}
        noCopy={noCopy}
      />
      {list.map((item, index, arr) => (
        <div
          key={item.sentenceId}
          className={clsx(styles.line, styles[item.type])}
        >
          {item.type === 'question' ? (
            <ChatQuestion
              question={item.content}
              key={item.sentenceId}
              showTime={false}
              uploadFile={item.uploadFile}
              searchType={item.searchType}
            />
          ) : item.type === 'answer' ? (
            <ChatResponse
              content={item.content}
              status={
                index < arr.length - 1
                  ? 'outdated'
                  : loading
                    ? 'pending'
                    : 'latest'
              }
              key={item.sentenceId}
              hasOption={
                item.sentenceId && index === arr.length - 1 && hasOperate
              }
              option={
                <ChatOption
                  sentenceId={item.sentenceId}
                  options={['like', 'dislike', 'regenerate']}
                />
              }
              showTime={false}
              {...(avatarMap ? { avatarMap } : {})}
              noCopy={noCopy}
            />
          ) : (
            <ChatOther
              type={item.content}
              status={
                index < arr.length - 1
                  ? 'outdated'
                  : loading
                    ? 'pending'
                    : 'latest'
              }
            />
          )}
        </div>
      ))}
    </div>
  )
}
