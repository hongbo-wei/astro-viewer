import { Layout as AntLayout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header/index.js'

import style from './index.module.scss'

const Layout: React.FC = () => (
  <AntLayout className={style.layout}>
    <AntLayout.Header>
      <Header />
    </AntLayout.Header>
    <AntLayout.Content className={style.content}>
      <Outlet />
    </AntLayout.Content>
  </AntLayout>
)
export default Layout
