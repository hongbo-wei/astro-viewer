import { Text } from '../../Text'
import './index.scss'
export function ListVal({
  value,
}: {
  value?: Array<string | { id: string | number; value: string }>
}) {
  return (
    <div className="listval">
      {value // 不存在时不显示
        ? value.length // 为空数组时显示‘--’
          ? value.map((item) => {
              const key =
                typeof item === 'string' ? `${item}-${Math.random()}` : item.id
              const text = typeof item === 'string' ? item : item.value
              return <Text key={key} value={text} />
            })
          : '--'
        : null}
    </div>
  )
}
