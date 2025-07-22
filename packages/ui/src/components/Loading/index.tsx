import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'

import style from './index.module.scss'

export default function Loading() {
  const { t } = useTranslation(['common'])
  return (
    <div className={style.loading}>
      <Spin indicator={<LoadingOutlined spin />} />
      <div>{t('loading')}</div>
    </div>
  )
}
