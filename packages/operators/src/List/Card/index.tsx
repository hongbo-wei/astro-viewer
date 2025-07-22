import { Card as AntdCard } from 'antd'
import type { CardMetaProps } from 'antd/es/card'
import clsx from 'clsx'
import React from 'react'

import CardContent from '../../CardContent'
import { CardItem } from '../../type'

import './index.scss'

export interface Props extends CardMetaProps {
  data: CardItem
}

const Card: React.FC<Props> = ({ data, className }) => {
  const onClick = (id: string) => {
    location.href = `${location.origin}${location.pathname}/${id}`
  }
  return (
    <AntdCard
      className={clsx('astro-operator-card', className)}
      onClick={() => onClick(data.id)}
    >
      <CardContent data={data} />
    </AntdCard>
  )
}

export default Card
