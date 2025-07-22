import MdKatex from '@vscode/markdown-it-katex'
import clsx from 'clsx'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import MdLinkAttributes from 'markdown-it-link-attributes'
import MdMermaid from 'mermaid-it-markdown'
import React, { useEffect, useMemo, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { copyToClip } from './utils'

import 'katex/dist/katex.min.css'

// markdown基础样式 dark/light
import './theme/index.css'
// 补充github-markdown-css没有的样式，我们自己的定制
import './theme/supplement.css'
import styles from './index.module.scss'

// 动态加载highlight.js主题
const loadHighlightTheme = async (isDark: boolean) => {
  const existingThemeLink = document.getElementById('highlight-theme')
  if (existingThemeLink) {
    existingThemeLink.remove()
  }

  if (isDark) {
    // @ts-ignore
    await import('highlight.js/styles/github-dark.css')
  } else {
    // @ts-ignore
    await import('highlight.js/styles/github.css')
  }
}

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  asRawText?: boolean
  noCopy?: boolean
  plugins?: any[]
  markdownItOptions?: { [key: string]: any }
  lang?: 'en' | 'zh'
  theme?: 'light' | 'dark'
}

const MarkdownViewer: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 设置文档根元素的 color-scheme
    document.documentElement.style.setProperty(
      'color-scheme',
      props.theme === 'dark' ? 'dark' : 'light',
    )
    // 加载对应的highlight.js主题
    loadHighlightTheme(props.theme === 'dark').catch((err) => {
      console.error(`load highlightTheme error: ${err}`)
    })
    return () => {
      // 组件卸载时恢复默认值
      document.documentElement.style.removeProperty('color-scheme')
      // 移除highlight.js主题
      const existingThemeLink = document.getElementById('highlight-theme')
      if (existingThemeLink) {
        existingThemeLink.remove()
      }
    }
  }, [props.theme])

  const resource = useMemo(() => {
    return {
      copyCode: props.lang === 'en' ? 'Copy Code' : '复制代码',
      copied: props.lang === 'en' ? 'Copied' : '已复制',
    }
  }, [props.lang])

  const mdi = useMemo(
    () =>
      new MarkdownIt({
        html: true,
        linkify: true,
        highlight(code, language) {
          const validLang = !!(language && hljs.getLanguage(language))
          if (validLang) {
            const lang = language ?? ''
            return highlightBlock(
              hljs.highlight(code, { language: lang }).value,
              lang,
            )
          }
          return highlightBlock(hljs.highlightAuto(code).value, '')
        },
        ...props.markdownItOptions,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  mdi
    .use(MdLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
    .use(MdKatex)
    .use(MdMermaid)

  // 注册自定义插件
  if (Array.isArray(props.plugins) && props.plugins.length > 0) {
    props.plugins.forEach((plugin) => mdi.use(plugin))
  }

  const text = useMemo(() => {
    const value = props.text ?? ''
    if (!props.asRawText) {
      // 对数学公式进行处理，自动添加 $$ 符号
      const escapedText = escapeBrackets(escapeDollarNumber(value))
      return mdi.render(escapedText)
    }
    return value
  }, [props.text, props.asRawText, mdi])

  function highlightBlock(str: string, lang?: string) {
    const copyBtn = props.noCopy
      ? ''
      : `<span class="code-block-header__copy">${props.lang ? resource.copyCode : t('ai.copyCode')}</span>`
    const head =
      `<div class="code-block-header"><span class="code-block-header__lang">${lang}</span>` +
      copyBtn +
      `</div>`
    return (
      `<div class="code-block-wrapper">` +
      head +
      `<pre><code class="hljs ${lang}">${str}</code></pre>` +
      `</div>`
    )
  }

  const copyButtonListeners = useRef(new Map<Element, () => void>())

  const addCopyEvents = useCallback(() => {
    if (textRef.current) {
      const copyBtn = textRef.current.querySelectorAll(
        '.code-block-header__copy',
      )
      copyBtn.forEach((btn) => {
        const clickHandler = () => {
          const codeElement =
            btn.parentElement?.parentElement?.querySelector('code')
          const code = codeElement?.textContent
          if (code) {
            copyToClip(code).then(() => {
              btn.textContent = props.lang ? resource.copied : t('ai.copied')
              setTimeout(() => {
                btn.textContent = props.lang
                  ? resource.copyCode
                  : t('ai.copyCode')
              }, 1000)
            })
          }
        }
        copyButtonListeners.current.set(btn, clickHandler)
        btn.addEventListener('click', clickHandler)
      })
    }
  }, [props.lang, resource.copied, resource.copyCode, t])

  function removeCopyEvents() {
    if (textRef.current) {
      const copyBtn = textRef.current.querySelectorAll(
        '.code-block-header__copy',
      )
      copyBtn.forEach((btn) => {
        const listener = copyButtonListeners.current.get(btn)
        if (listener) {
          btn.removeEventListener('click', listener)
          copyButtonListeners.current.delete(btn)
        }
      })
    }
  }

  useEffect(() => {
    addCopyEvents()
    return () => {
      removeCopyEvents()
    }
  }, [text, addCopyEvents])

  function escapeDollarNumber(text: string) {
    let escapedText = ''

    for (let i = 0; i < text.length; i += 1) {
      let char = text[i]
      const nextChar = text[i + 1] || ' '

      if (char === '$' && nextChar >= '0' && nextChar <= '9') char = '\\$'

      escapedText += char
    }

    return escapedText
  }

  function escapeBrackets(text: string) {
    const pattern =
      /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g
    return text.replace(
      pattern,
      (match, codeBlock, squareBracket, roundBracket) => {
        if (codeBlock) return codeBlock
        else if (squareBracket) return `$$${squareBracket}$$`
        else if (roundBracket) return `$${roundBracket}$`
        return match
      },
    )
  }

  return (
    <div className={clsx(styles.md, 'mdWrapper')}>
      <div ref={textRef} className={clsx(styles.text)}>
        {!props.inversion ? (
          !props.asRawText ? (
            <div
              data-theme={props.theme || 'light'}
              className={clsx(
                'markdown-body',
                'astro-markdown',
                props.loading ? 'markdown-body-generate' : '',
              )}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : (
            <div className="whitespace-pre-wrap">{text}</div>
          )
        ) : (
          <div className="whitespace-pre-wrap">{text}</div>
        )}
      </div>
    </div>
  )
}

export default MarkdownViewer
