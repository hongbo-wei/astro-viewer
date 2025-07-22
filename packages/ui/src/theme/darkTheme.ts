import { theme } from 'antd'

export default {
  algorithm: theme.darkAlgorithm,
  components: {
    Button: {
      borderRadius: 2,
      colorPrimary: 'red',
      algorithm: true, // 启用算法
    },
    Input: {
      algorithm: true, // 启用算法
    },
    Menu: {
      itemBorderRadius: 0,
      itemSelectedColor: '#1890FF',
      itemSelectedBg: '#E6F7FF',
      itemMarginInline: 0,
    },
  },
} as any
