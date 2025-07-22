import { Pie } from '@ant-design/plots'
import { isEqual } from 'lodash-es'
import React, { memo } from 'react'

import Empty from '../../Empty'

// TODO: any type 转换
const PieChart: React.FC<any> = memo(
  ({ data, pieConfig, handleClick, theme }: any) => {
    const config = {
      height: 142, //  图表高度
      theme: theme === 'dark' ? 'classicDark' : 'classic',

      data, //  绘图数据

      scale: { color: { range: [...pieConfig.color] } }, //  色板
      legend: {
        //  图例相关
        color: {
          //  https://ant-design-charts.antgroup.com/options/plots/component/legend
          itemMarker: 'circle',
          itemLabelFontSize: 12,
          itemLabelFill:
            theme === 'dark'
              ? 'rgba(255, 255, 255, 0.45)'
              : 'rgba(0, 0, 0, 0.45)',
          itemSpan: 8,
          title: false,
          position: 'top',
          rowPadding: 8,

          autoWrap: true,
          maxRows: 1,

          navOrient: 'horizontal',
          navEffect: 'linear',
          navInitPage: 1,
        },
      },
      //  选中状态配置
      state: {
        unselected: { opacity: 0.5 },
        selected: { fill: 'orange' },
      },
      // 图表交互 - 仅单选
      interaction: {
        elementSelect: {
          single: true,
        },
      },
      onReady: ({ chart }) => {
        //  图表点击事件响应
        chart.on(`element:click`, (ev) => {
          handleClick && handleClick(ev.data.data.name)
        })
      },
      ...pieConfig, //  props传入的配置
    }
    return data.length > 0 ? <Pie {...config} /> : <Empty />
  },
  (prev, next) => {
    return isEqual(prev?.data, next?.data)
  },
)

PieChart.displayName = 'PieChart'

export default PieChart
