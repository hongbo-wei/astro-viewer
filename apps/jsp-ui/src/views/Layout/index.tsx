import { Layout as AntLayout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'



import style from './index.module.scss'

const Layout: React.FC = () => (
  <AntLayout className={style.layout}>
    <AntLayout.Content className={style.content}>
      <Outlet />
    </AntLayout.Content>
  </AntLayout>
)
export default Layout
