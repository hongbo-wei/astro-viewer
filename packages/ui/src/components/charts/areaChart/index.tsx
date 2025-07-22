import { Area } from '@ant-design/plots'
import { isEqual } from 'lodash-es'
import React, { memo } from 'react'

import Empty from '../../Empty'

// TODO: any type 转换
const AreaChart: React.FC<any> = memo(
  ({ data, areaConfig, theme }: any) => {
    const colorDisplay =
      theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'
    const config = {
      height: 180, //  图表高度
      theme: theme === 'dark' ? 'classicDark' : 'classic',

      axis: {
        //  坐标轴相关
        x: {
          tickStroke: colorDisplay, //  刻度线颜色
          labelFill: colorDisplay, //  刻度值字体颜色
          labelAutoRotate: false,
          ...areaConfig.axisConfig.x,
        },
        y: {
          tick: false, //  是否显示刻度
          gridLineDash: [0, 0], //  网格线描边的虚线配置
          labelFill: colorDisplay, //  刻度值字体颜色
          gridStroke: colorDisplay, //  网格线颜色
          ...areaConfig.axisConfig.y,
        },
      },
      legend: {
        //  图例相关
        color: {
          itemLabelFontSize: 12, //  图例字体大小
          itemLabelFill: colorDisplay, //  图例字体颜色
        },
      },

      data, //  绘图数据

      shapeField: 'smooth', //  指定 line 是否平滑，点图形状等
      stack: true, //  是否堆积
      scale: { color: { range: [...areaConfig.color] } }, //  色板
      ...areaConfig, //  props传入的配置
    }
    return data.length > 0 ? <Area {...config} /> : <Empty />
  },
  (prev, next) => {
    return prev?.theme === next?.theme && isEqual(prev?.data, next?.data)
  },
)

AreaChart.displayName = 'AreaChart'

export default AreaChart
