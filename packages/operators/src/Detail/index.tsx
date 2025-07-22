import { GithubOutlined } from '@ant-design/icons'
import BackBreadcrumb from '@zj-astro/ui/back-breadcrumb'
import MarkdownViewer from '@zj-astro/ui/markdown-viewer'
import { Divider, Button } from 'antd'
import clsx from 'clsx'
import React, { useMemo, useEffect, useState } from 'react'

import CardContent from '../CardContent'
import '../common.scss'
import { defaultData } from '../data'
import { getLocale } from '../locales'
import { Data, CardItem } from '../type'

import './index.scss'

export interface Props extends React.CSSProperties {
  theme?: 'dark' | 'light'
  lang: string
  className?: string
}

const idPathMap = {
  package1:
    'https://astro-cms-inner.lab.zjvis.net/uploads/package1_d19e50c806.md',
  model6: 'https://astro-cms-inner.lab.zjvis.net/uploads/model6_7ec6e6cdf2.md',
  model5: 'https://astro-cms-inner.lab.zjvis.net/uploads/model5_41c3deb3fb.md',
  model4: 'https://astro-cms-inner.lab.zjvis.net/uploads/model4_8d953762ca.md',
  model3: 'https://astro-cms-inner.lab.zjvis.net/uploads/model3_c90ec8f6b0.md',
  model2: 'https://astro-cms-inner.lab.zjvis.net/uploads/model2_3903b2c20a.md',
  model1: 'https://astro-cms-inner.lab.zjvis.net/uploads/model1_e893fe7021.md',
  dataset1:
    'https://astro-cms-inner.lab.zjvis.net/uploads/dataset1_a1232ee250.md',
}

const AOperatorDetail: React.FC<Props> = ({
  theme = 'light',
  lang,
  className,
}) => {
  const language = lang.toLowerCase().includes('en') ? 'en' : 'zh'
  const [mdContent, setMdContent] = useState('')
  const [id, setId] = useState('')
  const getOperatorId = (url?: string) => {
    if (!url) return null
    const regex = /\/operators\/([^/]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }
  useEffect(() => {
    if (location.href) {
      const id = getOperatorId(location.href) || ''
      setId(id)
    }
  }, [])
  const operatorData: Data = useMemo(() => {
    return defaultData[language]
  }, [language])
  const data = React.useMemo<CardItem | undefined>(() => {
    let foundItem: CardItem | undefined
    operatorData.forEach((category) => {
      const item = category.children.find((child) => child.id === id)
      if (item) foundItem = item
    })
    return foundItem
  }, [id, operatorData])
  const gotoGithub = (url: string) => {
    window.open(url, '_blank')
  }
  const resource = useMemo(() => {
    return {
      detail: getLocale(language, 'detail'),
      github: getLocale(language, 'github'),
    }
  }, [language])

  useEffect(() => {
    if (id && idPathMap[id]) {
      fetch(idPathMap[id])
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.text()
        })
        .then((text) => {
          setMdContent(text)
        })
        .catch((error) => {
          console.error('Error fetching markdown:', error)
          setMdContent('# Content not found')
        })
    }
  }, [id])

  return (
    <div
      className={clsx(
        'astro-operator-common-wrapper',
        `astro-operator-common-${theme}`,
        'astro-operator-detail',
        className,
      )}
    >
      <div className={'astro-operator-detail-topSection'}>
        <div className={'astro-operator-detail-backWrap'}>
          <BackBreadcrumb
            text={resource.detail}
            go={() => {
              location.href = `${location.origin}/${lang}/operators`
            }}
            lang={language}
          />
        </div>
        <div className={'astro-operator-detail-divider'}>
          <Divider />
        </div>
        <div className={'astro-operator-detail-cardWrap'}>
          <CardContent
            data={data}
            className={'astro-operator-common-blueTag'}
          />
          {data && (
            <Button
              type="primary"
              icon={<GithubOutlined />}
              onClick={() => gotoGithub(data.link)}
              className={'astro-operator-detail-btn'}
            >
              {resource.github}
            </Button>
          )}
        </div>
      </div>
      <div className={'astro-operator-detail-mdWrap'}>
        <MarkdownViewer text={mdContent} lang={language} theme={theme} />
      </div>
    </div>
  )
}

export default AOperatorDetail
