interface Props {
  title?: string
  content?: string
}

const ErrPage = ({
  title = '路由错误页面',
  content = '抱歉，页面未找到或发生了错误。',
}: Props) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  )
}
export default ErrPage
