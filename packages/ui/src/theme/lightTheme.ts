import { theme } from 'antd'

export default {
  algorithm: theme.defaultAlgorithm,
  components: {
    Button: {
      borderRadius: 2,
      borderRadiusSM: 2,
      colorPrimary: '#0098FF',
      colorPrimaryHover: '#91caff',
    },
    Input: {
      borderRadius: 2,
    },
    Select: {
      borderRadius: 2,
    },
    Radio: {
      borderRadius: 2,
    },
    Menu: {
      itemBorderRadius: 0,
      itemSelectedColor: '#1890FF',
      itemSelectedBg: '#E6F7FF',
      itemMarginInline: 0,
    },
  },
}
