import { Menu as AntMenu } from 'antd'
import type { MenuProps } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

import { i18nNS } from '@/constants'
import { ETab } from '@/types/menu'

import style from './index.module.scss'

const Menu: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(i18nNS)
  const { pathname } = useLocation()

  // TODO: 临时解决方案
  const defaultKey = pathname.split('/').at(-1)
  const [selectedKey, setSelectedKey] = useState(defaultKey)

  const items: MenuProps['items'] = [
    {
      label: t('common:expand'),
      key: ETab.StarCat,
    },
    {
      label: t('common:collapse'),
      key: ETab.Retrieval,
    },
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
    navigate(`${e.key}`)
  }

  return (
    <AntMenu
      onClick={onClick}
      mode="horizontal"
      items={items}
      selectedKeys={[selectedKey]}
      className={clsx(style.menu)}
    />
  )
}

export default Menu
