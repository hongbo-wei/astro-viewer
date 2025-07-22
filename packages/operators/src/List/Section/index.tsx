import Subject from '@zj-astro/ui/subject'
import { Col, Row } from 'antd'
import clsx from 'clsx'
import React from 'react'

import '../../common.scss'
import { OperatorItem } from '../../type'
import Card from '../Card'

import './index.scss'

export interface Props {
  data: OperatorItem
}

const Section: React.FC<Props> = ({ data }) => {
  return (
    <div className={'astro-operator-list-section'}>
      <Subject
        subject={data.title}
        className={data.color && `astro-operator-list-section-${[data.color]}`}
      >
        <div>
          {Array.from({ length: Math.ceil(data.children.length / 3) }).map(
            (_, rowIndex) => {
              return (
                <Row gutter={20} key={`row_${rowIndex}`}>
                  {/* 对当前行的3个数据进行遍历 */}
                  {data.children
                    .slice(rowIndex * 3, (rowIndex + 1) * 3)
                    .map((item, colIndex) => (
                      <Col
                        span={8}
                        key={`${rowIndex}_${colIndex}_${item.title}`}
                      >
                        <div
                          className={clsx(
                            'astro-operator-list-section-cardWrap',
                            data.color &&
                              `astro-operator-common-${data.color}Tag`,
                          )}
                        >
                          <Card
                            data={{ ...item }}
                            className={'astro-operator-list-section-card'}
                          />
                        </div>
                      </Col>
                    ))}
                </Row>
              )
            },
          )}
        </div>
      </Subject>
    </div>
  )
}

export default Section
