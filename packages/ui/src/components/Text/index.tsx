import { Tooltip } from 'antd'
import clsx from 'clsx'
import { useRef, useEffect, useState, RefObject } from 'react'

import { PropsWithClass } from '../../types'

import './index.scss'

export interface TextProps extends PropsWithClass {
  value: string | number
  lineClamp?: number
}

const Text = ({ value, lineClamp, className }: TextProps) => {
  const ref: RefObject<HTMLDivElement> = useRef(null)
  const [ellipsis, enableEllipsis] = useState(false)

  useEffect(() => {
    if (ref.current) {
      enableEllipsis(ref.current.clientWidth < ref.current.scrollWidth)
    }
  }, [value])

  const style = lineClamp
    ? {
        WebkitLineClamp: lineClamp,
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      }
    : {
        whiteSpace: 'nowrap',
      }

  return (
    <>
      {ellipsis ? (
        <Tooltip title={value} className={clsx('tooltip', className)}>
          <div ref={ref} className="tooltipText" style={style}>
            {value}
          </div>
        </Tooltip>
      ) : (
        // 多行的时候走的是ellipsis为false
        // 指定lineClamp为1时，也走这里，不会有tooltip
        <div ref={ref} className={clsx('tooltipText', className)} style={style}>
          {value}
        </div>
      )}
    </>
  )
}

export { Text }
