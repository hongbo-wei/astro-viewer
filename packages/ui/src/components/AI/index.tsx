import type { UploadFile, UploadProps } from 'antd'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { i18nNS } from './constants'
import NewChat from './NewChat'
import { Provider } from './useContext'

import styles from './index.module.scss'

export type ChatItem = {
  type: 'question' | 'answer' | 'other'
  content: string
  sentenceId: string | number
  uploadFile?: Array<UploadFile>
  searchType?: 'csstInfoSearch' | 'academicSearch'
}

type Props = {
  getAnswer?: ({ question, sessionId }) => Promise<{
    answer: string
    sessionId: string
    sentenceId: string
  }>
  comment?: ({ sentenceId, comment }) => Promise<Record<string, never>>
  operate?: ({ sentenceId, emotion }) => Promise<Record<string, never>>
  greeting?: string
  avatarMap?: {
    latest: string
    outdated: string
    pending?: string
  }
  sse?: boolean // 是否使用sse方式获取数据，不传表示不用
  sseApi?: string // sse方式获取数据的接口地址 例如/api/chat/qa/sse由项目转发/api前缀或完整的地址
  sseAcademicApi?: string // 学术搜索sse方式获取数据的接口地址 例如/api/chat/qa/sse由项目转发/api前缀或完整的地址
  hasOperate?: boolean
  upload?: UploadProps
  FilePreview?: React.ReactNode
  validateBeforeSend?: (question: string) => boolean
  handleNewChat?: () => void // 开启新对话
  noCopy?: boolean
  extraQuestion?: string // 外部输入的问题，如语音识别的，变化时需要加入到问题，并触发问答
  onChange?: (data: { type: string; content: string }) => void
}

export default function AI({
  getAnswer,
  comment,
  operate,
  greeting,
  avatarMap,
  sse,
  sseApi,
  sseAcademicApi,
  upload,
  FilePreview,
  validateBeforeSend,
  handleNewChat,
  hasOperate = true,
  noCopy,
  extraQuestion,
  onChange,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [questionKey, setQuestionKey] = useState(0)
  const [list, setList] = useState<ChatItem[]>([])
  const [key, setKey] = useState(0)

  const [latestQuestion, setLatestQuestion] = useState('')
  const [isAcademicSearch, setIsAcademicSearch] = useState(false)
  const { t } = useTranslation(i18nNS)

  useLayoutEffect(() => {
    // 每次list更新后并渲染完成后滚动到底部
    if (contentRef.current) {
      contentRef.current?.scrollTo(0, contentRef.current.scrollHeight)
    }
  }, [list])

  const handleNew = () => {
    setList([])
    // 更新 key 属性来重新挂载组件
    setKey(key + 1)
    // 重置sessionId
    setSessionId('')
    handleNewChat?.()
  }

  // 将问题加入列表
  const addQuestion = (value, isAcademicSearch = false) => {
    setList((list) => {
      const newList = [...list]
      newList.push({
        type: 'question',
        content: value,
        uploadFile: upload?.fileList,
        sentenceId: questionKey,
        searchType: isAcademicSearch ? 'academicSearch' : 'csstInfoSearch',
      })
      return newList
    })
    setQuestionKey(questionKey + 1)

    // 触发onChange
    onChange?.({ type: 'question', content: value })
  }

  const fetchAnswer = (value: string, isAcademicSearch: boolean = false) => {
    // 添加loading状态
    setLoading(true)
    // 添加loading卡片
    setList((list) => {
      const newList = [...list]
      newList.push({
        type: 'other',
        content: 'loading',
        sentenceId: Math.random(),
      })
      return newList
    })

    // sse 方式获取数据
    if (sse) {
      const api = isAcademicSearch && sseAcademicApi ? sseAcademicApi : sseApi
      getAnswerSse(api || '', value)
    } else {
      getAnswerHttp(value)
    }
  }

  const getAnswerHttp = (value: string) => {
    if (!getAnswer) return
    // 第一次调用接口sessionId为空
    getAnswer({ question: value, sessionId })
      .then((res) => {
        setList((list) => {
          const newList = [...list]
          newList.splice(newList.length - 1, 1, {
            type: 'answer',
            content: res.answer,
            sentenceId: res.sentenceId,
          })
          return newList
        })

        // 增加type answer后触发onChange
        onChange?.({ type: 'answer', content: res.answer })

        setSessionId(res.sessionId)
      })
      .catch((e) => {
        setList((list) => {
          const newList = [...list]
          newList.splice(newList.length - 1, 1, {
            type: 'other',
            // TODO: 确认两种错误情况怎么区分
            content: e.code === 300 ? 'much' : 'server',
            sentenceId: Math.random(),
          })
          return newList
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getAnswerSse = (basePath: string, question: string) => {
    const params = {
      question,
      sessionId,
    }

    const searchParams = new URLSearchParams(params)
    const url = `${basePath}?${searchParams.toString()}`

    const eventSource = new EventSource(url)

    let currentAnswer = ''

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data)
      const res = data.result
      // 最后返回sentenceId
      if (res.sentenceId) {
        eventSource.close()
        setSessionId(res.sessionId)
        setLoading(false)

        //返回最后一句完整的，增加type answer后触发onChange
        onChange?.({ type: 'answer', content: res.answer })
      } else {
        if (res.preAnswer) {
          // for Code生成知识检索工程化 by zhangfanfan 03-12
          if (+res.preAnswer.paperNum > 0) {
            const categoInfo = Array.isArray(res.preAnswer.categories)
              ? res.preAnswer.categories.map((c) => `\`${c}\``).join(' ')
              : res.preAnswer.categories
            currentAnswer += t('ai.academicPreAnswer', {
              categoInfo,
              paperNum: res.preAnswer.paperNum,
            })
          }
          res.answer = ''
        }

        // 拼接answer
        currentAnswer += res.answer
      }
      setList((list) => {
        const newList = [...list]
        newList.splice(newList.length - 1, 1, {
          type: 'answer',
          content: currentAnswer,
          sentenceId: res.sentenceId,
        })
        return newList
      })
    }

    eventSource.onerror = function (event) {
      console.error('EventSource failed:', event)
      eventSource.close()
      setList((list) => {
        const newList = [...list]
        newList.splice(newList.length - 1, 1, {
          type: 'other',
          // TODO: 确认两种错误情况怎么区分
          content: event.type === 'error' ? 'server' : 'much',
          sentenceId: Math.random(),
        })
        return newList
      })
      setLoading(false)
    }
  }

  const onSubmit = (value: string, isAcademicSearch: boolean = false) => {
    setIsAcademicSearch(isAcademicSearch)
    // 保存最新问题
    setLatestQuestion(value)

    // 将问题加入列表
    addQuestion(value, isAcademicSearch)

    // 获取回答
    fetchAnswer(value, isAcademicSearch)
  }

  const regenerate = () => {
    // 删除当前最新的回答
    setList((list) => {
      const newList = [...list]
      newList.splice(newList.length - 1, 1)
      return newList
    })

    // 获取回答
    fetchAnswer(latestQuestion, isAcademicSearch)
  }

  // 外部输入的问题，如语音识别的，变化时需要加入到问题，并触发问答
  useEffect(() => {
    if (extraQuestion) {
      onSubmit(extraQuestion)
    }
    // eslint-disable-next-line
  }, [extraQuestion])

  return (
    <Provider
      value={{
        regenerate,
        comment,
        operate,
        avatarMap,
        upload,
        FilePreview,
        validateBeforeSend,
        hasOperate,
        loading,
        noCopy,
      }}
    >
      <div className={styles.ai}>
        <div className={styles.new}>
          <NewChat onAdd={handleNew} />
        </div>
        <div className={styles.main} key={key}>
          <div className={styles.content} ref={contentRef}>
            <div className={styles.wrap}>
              <ChatMessage list={list} loading={loading} greeting={greeting} />
            </div>
          </div>
          <div className={styles.input}>
            <ChatInput onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </Provider>
  )
}
