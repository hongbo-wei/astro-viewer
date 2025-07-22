import { ELangBtn, light } from '@zj-astro/ui'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import 'dayjs/locale/zh-cn'
import '@zj-astro/ui/i18n.tsx'

import Layout from '@/views/Layout'

//  dayjs with zh-cn
dayjs.locale('zh-cn')

function App() {
  const { lang: defaultLang } = useParams()

  const getLocale = () => {
    const currentLang =
      defaultLang.toLocaleLowerCase() === ELangBtn.ZH.toLocaleLowerCase()
        ? zhCN
        : enUS
    return currentLang
  }

  return (
    <ConfigProvider locale={getLocale()} theme={light}>
      <Layout />
    </ConfigProvider>
  )
}

export default App
