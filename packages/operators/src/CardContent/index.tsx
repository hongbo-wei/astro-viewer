import { Text } from '@zj-astro/ui/text'
import { Tag } from 'antd'
import type { CardMetaProps } from 'antd/es/card'
import clsx from 'clsx'
import React from 'react'

import { CardItem } from '../type'

import './index.scss'

export interface Props extends CardMetaProps {
  data?: CardItem
  className?: string
}

const CardContent: React.FC<Props> = ({ data, className }) => {
  if (!data) {
    return null
  }
  const { title, author, tag, desc } = data
  return (
    <div className={clsx('astro-operator-card-content', className)}>
      <div className={'astro-operator-card-content-title'}>
        <Text value={title} />
      </div>
      <div className={'astro-operator-card-content-author'}>
        {author.join(', ')}
      </div>
      <div className={'astro-operator-card-content-tagList'}>
        {tag.map((tag, tagIndex) => {
          return <Tag key={tagIndex}>{tag}</Tag>
        })}
      </div>
      <Text
        value={desc}
        lineClamp={3}
        className={'astro-operator-card-content-text'}
      />
    </div>
  )
}

export default CardContent
