import { Divider } from 'antd'
import clsx from 'clsx'
import { ReactElement } from 'react'

import style from './index.module.scss'

export interface Props {
  subject: string | ReactElement
  children: React.ReactNode
  className?: string
}

function Subject({ subject, children, className }: Props) {
  return (
    <div className={clsx(style.wrap, className)}>
      <div className={style.title}>
        <Divider type="vertical" className={style.divider} />
        {subject}
      </div>
      {children}
    </div>
  )
}

export default Subject
