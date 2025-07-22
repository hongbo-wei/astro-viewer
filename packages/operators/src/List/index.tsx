import clsx from 'clsx'
import { useMemo } from 'react'

import Section from './Section'
import '../common.scss'
import { defaultData, colors } from '../data'

export interface Props {
  lang: 'en' | 'zh'
  theme?: 'dark' | 'light'
}

const AOperators = ({ theme = 'light', lang }: Props) => {
  const language: 'en' | 'zh' = lang.toLowerCase().includes('en') ? 'en' : 'zh'
  const data = useMemo(() => {
    return defaultData[language]
  }, [language])
  return (
    <div className={clsx(`astro-operator-common-${theme}`)}>
      {data.map((item, index) => (
        <Section
          key={`${index}_${item.title}`}
          data={{ ...item, color: colors[index] }}
        />
      ))}
    </div>
  )
}

export default AOperators
