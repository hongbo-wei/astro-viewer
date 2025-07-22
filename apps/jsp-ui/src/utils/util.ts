/**
 * @description 获取转换后的存储量和单位
 * @param value 存储量数值 1024
 * @param unit 存储量单位 'MB'
 * @param join 返回结果是否合并数值和单位 true的话返回 1GB
 * @returns array  [1, 'GB']
 */
export const getStorageValue = (
  value: number,
  unit: string,
  join?: boolean,
): [number, string | undefined] | string => {
  join = join ?? true
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
  let currentValue = value
  let currentUnitIndex = units.indexOf((unit || '').toUpperCase())

  // 如果单位不在列表中，则返回原始值和单位
  if (currentUnitIndex === -1) {
    return [currentValue, unit]
  }

  // 循环直到当前值小于 1024 或者到达最大单位为止
  while (currentValue >= 1024 && currentUnitIndex < units.length - 1) {
    currentValue /= 1024
    currentUnitIndex++
  }
  const result: [number, string | undefined] = [
    formatDecimalPlaces(currentValue),
    units[currentUnitIndex],
  ]
  // 返回转换后的值和单位
  return join ? result.join('') : result
}

/**
 * @description 获取时间转换，
 * @param value 36062
 * @param unit 's'
 * @returns string 最高两个时间单位 10h1min [忽略秒]
 */
export const getTimeValueComb = (value: number, unit: string) => {
  // 定义单位之间的转换关系
  const conversions = {
    s: 1, // 秒
    m: 60, // 分钟
    h: 3600, // 小时
  }

  // 计算当前值对应的秒数
  let currentValueInSeconds = value * conversions[unit]
  //  值为0时 直接返回
  if (currentValueInSeconds === 0) {
    return currentValueInSeconds
  }

  // 初始化输出数组
  const outputUnits: string[] = []

  // 检查小时数
  const hours = Math.floor(currentValueInSeconds / conversions.h)
  if (hours > 0) {
    outputUnits.push(hours + 'h')
    currentValueInSeconds %= 3600 // 减去已经计算的小时数对应的秒数
  }

  // 检查分钟数
  const minutes = Math.floor(currentValueInSeconds / conversions.m)
  if (minutes > 0 || (outputUnits.length === 0 && hours > 0)) {
    // 如果还没有输出任何单位且小时数大于0，即使分钟为0也加上
    outputUnits.push(minutes + 'min')
    currentValueInSeconds %= 60 // 减去已经计算的分钟数对应的秒数
  }

  // 如果秒数是非零的，且前两个单位还未填满，则检查剩余的秒数
  if (currentValueInSeconds > 0 && outputUnits.length < 2) {
    outputUnits.push(currentValueInSeconds + 's')
  }

  // 如果输出数组中有多个单位，返回前两个单位；否则返回整个数组
  return outputUnits.slice(0, 2).join('')
}

/**
 * @description 对有小数的数字，默认保留两位小数
 * @param num 数字
 * @param places 需要保留的小数位数，默认为2位
 * @returns number
 */
export const formatDecimalPlaces = (num: number, places?: number) => {
  places = places ?? 2
  // 如果数字有小数，则保留两位小数，否则返回原数字
  return Number.isInteger(num) ? num : parseFloat(num.toFixed(places))
}

export const includes = (big: string | number, small: string | number) => {
  big = String(big).toLowerCase()
  small = String(small).toLowerCase()
  return big.includes(small)
}

// 辅助函数，接受对象和需要去掉的属性作为参数，并返回去掉指定属性的新对象
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  // eslint-disable-next-line
  const { [key]: _, ...rest } = obj
  return rest as Omit<T, K>
}
