import { useState } from 'react'

import { Text } from '../../Text'

import './index.scss'

interface Props {
  value: string
  lineClamp?: number
}

export function MulLineVal({ value, lineClamp = 1 }: Props) {
  const [isFold, setFold] = useState(true)
  return (
    <div>
      {isFold ? (
        <Text value={value} lineClamp={lineClamp} />
      ) : (
        <div>{value}</div>
      )}
      {lineClamp ? (
        <div className="unflodBtn" onClick={() => setFold(!isFold)}>
          {isFold ? '展开' : '收起'}
        </div>
      ) : null}
    </div>
  )
}
