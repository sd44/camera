export type AddressHistory = {
  address: string
  latitude: number
  longitude: number
}

export const getAddressHistory = (): AddressHistory[] => {
  const addressHistory = wx.getStorageSync("addressHistory")
  if (addressHistory) {
    return addressHistory
  }
  return []
}

export const setAddressHistory = (addressHistory: AddressHistory[]) => {
  wx.setStorageSync("addressHistory", addressHistory)
}

export const clearAddressHistory = () => {
  wx.removeStorageSync("addressHistory")
}

export const addAddressHistory = (address: AddressHistory) => {
  const addressHistory = getAddressHistory()
  // 去重
  const index = addressHistory.findIndex((item) => item.address === address.address)
  if (index !== -1) {
    addressHistory.splice(index, 1)
  }

  addressHistory.unshift(address)
  setAddressHistory(addressHistory)
}
