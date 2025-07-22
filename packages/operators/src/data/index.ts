import { default as enDataFile } from './en'
import { default as zhDataFile } from './zh'
import { Colors, Data } from '../type'

const colors: Colors[] = ['blue', 'cyan', 'purple']
const defaultData: { en: Data; zh: Data } = {
  en: enDataFile,
  zh: zhDataFile,
}

export { colors, defaultData }
