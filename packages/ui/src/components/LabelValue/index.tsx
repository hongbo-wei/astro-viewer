import clsx from 'clsx'
import { Link, useParams } from 'react-router-dom'

import { ListVal } from './ListVal'
import { MulLineVal } from './MulLineVal'
import { KeyValues } from '../../types'
import { Text } from '../Text'

import './index.scss'

interface TextProps {
  value: string | number | (() => JSX.Element)
  label?: string
  unit?: string
  className?: string
  params?: KeyValues
}
const LabelValue = ({
  value = '--',
  label,
  unit,
  className,
  params,
}: TextProps) => {
  const { lang } = useParams()

  return (
    <div className={clsx('labelvalue', ...[className])}>
      {label && <div className="key">{label}:</div>}
      {typeof value === 'function' ? (
        value()
      ) : params?.url ? (
        <Link to={`/${lang}${params.url}`} className="value">
          <Text value={value} />
        </Link>
      ) : (
        <Text value={value} />
      )}
      {/* TODO: unit需要另外写一个组件包在text外面 */}
      {unit && <div>{unit}</div>}
    </div>
  )
}

export { LabelValue, ListVal, MulLineVal }
