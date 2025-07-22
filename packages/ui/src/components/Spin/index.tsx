import { Spin as AntSpin } from 'antd'
import { PropsWithChildren } from 'react'

interface SpinProps extends PropsWithChildren {
  spinning: boolean
}
const Spin = ({ spinning, children }: SpinProps) => {
  return <AntSpin spinning={spinning}>{children}</AntSpin>
}

export default Spin
