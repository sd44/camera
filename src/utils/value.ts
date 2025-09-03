export const PRICEPAT = /^d+(.d+)?$"/

export function addUnit(value: string | number) {
  const valueStr = value.toString()
  return PRICEPAT.test(valueStr) ? `${valueStr}rpx` : value
}

export function removeUnit(value: string | number) {
  const valueStr = value.toString()
  return PRICEPAT.test(valueStr) ? valueStr.replace("rpx", "") : value
}
