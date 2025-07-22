// import { i18nNS } from '@/components/i18next'
import { UploadOutlined, ReadOutlined } from '@ant-design/icons'
import { Button, Input, Upload } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { i18nNS } from '../constants'
import { useChat } from '../useContext'

import styles from './index.module.scss'

const { TextArea } = Input

export default function ChatInput({ onSubmit }: any) {
  const { t } = useTranslation(i18nNS)
  const [value, setValue] = useState(undefined)
  const { upload, FilePreview, validateBeforeSend, loading } = useChat()
  // 是否开启学术搜索
  const [isAcademicSearch, setIsAcademicSearch] = useState(false)
  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const onSend = () => {
    if (loading) {
      return
    }
    if (!value || !(value as string).trim()) {
      return
    }
    // 默认校验通过
    const validation = validateBeforeSend ? validateBeforeSend(value) : true
    if (!validation) {
      return
    }
    onSubmit(value, isAcademicSearch)
    setValue(undefined)
  }

  const onPressEnter = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // @ts-ignore
      setValue(value + '\n')
    } else if (e.keyCode !== 229) {
      // 229 mac中文输入法回车时不发送
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div
      className={clsx(
        styles.wrap,
        // 有文字时候激活
        value ? styles.active : '',
      )}
    >
      {upload && (
        <Upload {...upload}>
          <Button
            className={styles.btnUpload}
            shape="circle"
            size="small"
            icon={<UploadOutlined />}
          />
        </Upload>
      )}
      <div style={{ flex: 1 }}>
        {FilePreview}
        <TextArea
          onChange={onChange}
          placeholder={t('ai.placeholder')}
          className={styles.textarea}
          style={{ resize: 'none' }}
          autoSize
          variant="borderless"
          value={value}
          onPressEnter={onPressEnter}
        />
      </div>
      <div className={styles.btnWrap}>
        <span
          className={clsx(
            isAcademicSearch ? styles.active : '',
            styles.academicSearch,
          )}
          onClick={() => setIsAcademicSearch(!isAcademicSearch)}
        >
          <ReadOutlined style={{ marginRight: 8 }} />
          {t('ai.academicSearch')}
        </span>
        <svg
          width="28"
          height="28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(
            styles.send,
            // 有文字且非loading时候激活
            value && !loading ? styles.active : '',
          )}
          onClick={onSend}
        >
          <g>
            <path
              id="Subtract"
              d="M14.0002 28C10.2872 28.0001 6.72623 26.5251 4.10068 23.8997C1.47512 21.2742 6.48093e-05 17.7133 2.13531e-09 14.0002C-6.48008e-05 10.2872 1.47487 6.72623 4.10033 4.10068C6.7258 1.47512 10.2867 6.48093e-05 13.9998 2.1353e-09C17.7128 -6.48008e-05 21.2738 1.47487 23.8993 4.10033C26.5249 6.7258 27.9999 10.2867 28 13.9998C28.0001 17.7128 26.5251 21.2738 23.8997 23.8993C21.2742 26.5249 17.7133 27.9999 14.0002 28ZM19.8051 7.8339L5.9057 11.2414C5.17974 11.4199 5.05004 12.3969 5.70358 12.7573L9.65848 14.9403C9.78289 15.0087 9.92291 15.0437 10.0649 15.042C10.2069 15.0402 10.346 15.0017 10.4687 14.9301L14.0513 12.8398C14.2652 12.7135 14.4859 12.9881 14.3208 13.1717L11.6191 16.1665C11.523 16.2735 11.4566 16.4038 11.4265 16.5445C11.3963 16.6851 11.4035 16.8312 11.4473 16.9682L13.0272 21.8832C13.2546 22.5907 14.2299 22.6547 14.5499 21.9843L20.7416 8.98432C21.0398 8.35942 20.4772 7.66883 19.8051 7.8339Z"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
