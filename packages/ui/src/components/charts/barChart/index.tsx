import { Bar } from '@ant-design/plots'
import { isEqual } from 'lodash-es'
import React, { memo } from 'react'

import Empty from '../../Empty'

const BarChart: React.FC<any> = memo(
  ({ data, barConfig, handleClick, theme }: any) => {
    let timer
    const config = {
      // height: 142, //  图表高度
      theme: theme === 'dark' ? 'classicDark' : 'classic',

      data, //  绘图数据

      onReady: ({ chart }) => {
        //  不使用plot:click 避免滚动滑动条引发重置操作【该操作触发plot:click / up】
        chart.on('plot:pointerdown', () => {
          //  如果没有点击在bar 上，为了和默认的选中样式被清除保持统一，手动触发 取消之前的选择
          timer = setTimeout(() => {
            chart.emit('element:unselect', {})
            chart.emit('element:click', {})
          }, 200)
        })

        chart.on(`element:click`, (ev) => {
          clearTimeout(timer)
          if (!ev.data) {
            handleClick && handleClick({})
            return
          }
          //  一直都是有值的
          handleClick && handleClick(ev.data.data)
        })

        // chart.on(`element:select`, (ev) => {
        //   handleClick && handleClick(ev.data.data)
        // })

        // chart.on(`element:unselect`, (ev) => {
        //   //  没有一个选中的情况触发
        //   const { nativeEvent } = ev
        //   if (nativeEvent) handleClick && handleClick([])
        // })

        // setTimeout(() => {
        //   chart.emit('element:select', {
        //     data: { channel: 'color', values: ['London'] },
        //   })
        // }, 2000)
      },
      ...barConfig, //  props传入的配置
    }
    return data.length > 0 ? <Bar {...config} /> : <Empty />
  },
  (prev, next) => {
    return isEqual(prev?.data, next?.data)
  },
)

BarChart.displayName = 'BarChart'

export default BarChart
