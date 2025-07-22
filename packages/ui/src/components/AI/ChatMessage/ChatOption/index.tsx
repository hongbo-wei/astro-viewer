// import { comment, operate } from '@/api/ai'
// import { i18nNS } from '@/components/i18next'
import {
  CloseOutlined,
  DislikeOutlined,
  LikeOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { Button, Input, Popover, Tooltip, message } from 'antd'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { i18nNS } from '../../constants'
import { useChat } from '../../useContext'

import styles from './index.module.scss'

const { TextArea } = Input

export default function ChatOption({
  sentenceId,
  options,
}: {
  sentenceId: string
  options: string[]
}) {
  const { t } = useTranslation(i18nNS)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [value, setValue] = useState('')
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const { regenerate, comment, operate } = useChat()

  const close = () => {
    setOpen(false)
  }

  const handleMouseEnter = () => {
    setTooltipOpen(true)
  }

  const handleMouseLeave = () => {
    setTooltipOpen(false)
  }

  useEffect(() => {
    document.addEventListener('click', close)
    return () => {
      document.removeEventListener('click', close)
    }
  }, [])

  const handleLike = () => {
    operate({ sentenceId, emotion: status === 'like' ? '' : 'like' }).then(
      () => {
        setStatus(status === 'like' ? '' : 'like')
      },
    )
  }
  const toggleDislike = async () => {
    setTooltipOpen(false)
    // 没点踩的时候打开弹框
    if (!open && status !== 'dislike') {
      setValue('')
      setOpen(true)
    }
    // 已经点踩的时候取消踩
    if (status === 'dislike') {
      await operate({
        sentenceId,
        emotion: status === 'dislike' ? '' : 'dislike',
      })
      setStatus(status === 'dislike' ? '' : 'dislike')
    }
  }
  const handleUnlike = async () => {
    try {
      await operate({
        sentenceId,
        emotion: status === 'dislike' ? '' : 'dislike',
      })
      await comment({ sentenceId, comment: value })

      setStatus(status === 'dislike' ? '' : 'dislike')
      message.success(t('ai.feedbackSuccess'))
      setOpen(false)
    } catch (e: any) {
      message.error(e?.message)
    }
  }
  const handleRegenerate = () => {
    regenerate()
  }

  const optionMap = {
    like: (
      <Tooltip title={t('ai.right')}>
        <div
          className={clsx(styles.block, status === 'like' ? styles.active : '')}
          onClick={handleLike}
        >
          <LikeOutlined />
        </div>
      </Tooltip>
    ),
    dislike: (
      <Popover
        icon={false}
        placement="topRight"
        open={open}
        overlayClassName={styles.popover}
        onClick={(e) => e.stopPropagation()}
        content={
          <div onClick={(e) => e.stopPropagation()}>
            <div className={styles.title}>
              <span>{t('ai.feedbackTitle')}</span>
              <CloseOutlined className={styles.cancel} onClick={close} />
            </div>
            <div className={styles.content}>
              <TextArea
                placeholder={t('ai.feedbackPlaceholder')}
                autoSize={{ minRows: 4, maxRows: 4 }}
                disabled={status === 'dislike'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Button
                type="primary"
                onClick={handleUnlike}
                disabled={status === 'dislike' || !value}
              >
                {t('ai.submit')}
              </Button>
            </div>
          </div>
        }
        arrow={false}
        trigger="click"
      >
        <Tooltip title={t('ai.wrong')} open={tooltipOpen}>
          <div
            className={clsx(
              styles.block,
              status === 'dislike' ? styles.active : '',
            )}
            onClick={toggleDislike}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <DislikeOutlined />
          </div>
        </Tooltip>
      </Popover>
    ),
    regenerate: (
      <Tooltip title={t('ai.regenerate')}>
        <div
          className={clsx(styles.block, styles.refresh)}
          onClick={handleRegenerate}
        >
          <SyncOutlined />
        </div>
      </Tooltip>
    ),
  }

  return (
    <div className={styles.option}>
      {options.map((option) => (
        <div key={option} className={styles.blockWrap}>
          {optionMap[option]}
        </div>
      ))}
    </div>
  )
}
