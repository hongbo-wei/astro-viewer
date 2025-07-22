import { LeftOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import clsx from 'clsx'
import { PropsWithChildren, useMemo } from 'react'

import style from './index.module.scss'

export interface Props extends PropsWithChildren {
  text: string
  className?: string
  go?: () => void
  lang: 'en' | 'zh'
}
const BackBreadcrumb = ({ text, className, go, lang }: Props) => {
  const defaultText = useMemo(() => {
    return lang === 'en' ? 'back' : '返回'
  }, [lang])
  const goBack = () => {
    if (go) {
      go()
    } else {
      history.back()
    }
  }
  return (
    <Breadcrumb
      items={[
        {
          title: (
            <>
              <LeftOutlined />
              <a className={style.back} onClick={goBack}>
                {defaultText}
              </a>
            </>
          ),
        },
        {
          title: text,
        },
      ]}
      className={clsx(style.breadcrumb, className)}
    />
  )
}

export default BackBreadcrumb
