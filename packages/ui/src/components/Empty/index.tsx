import { Empty as AntEmpty } from 'antd'

import style from './index.module.scss'

const Empty = ({ desc }: { desc?: React.ReactNode }) => {
  return (
    <AntEmpty
      className={style.empty}
      image={AntEmpty.PRESENTED_IMAGE_SIMPLE}
      description={desc}
    />
  )
}

export default Empty
