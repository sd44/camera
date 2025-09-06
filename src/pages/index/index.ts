import type { AddressHistory } from "~/libs/storage"
import { getAddressHistory } from "~/libs/storage"
import log from "~/utils/log"
import { clearAddressHistory } from "../../libs/storage"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressHistoy: [] as AddressHistory[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      addressHistoy: getAddressHistory(),
    })
  },

  goCamera() {
    wx.navigateTo({
      url: "/pages/camera/camera",
    })
  },

  goPicture() {
    log.info("goPicture")
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"],
      success: (res) => {
        log.info(res)
        wx.navigateTo({
          url: `/pages/picture/picture?imageUrl=${res.tempFiles[0].tempFilePath}`,
        })
      },
      fail: (err) => {
        log.error("获取图片失败", err)
        wx.showToast({
          title: "获取图片失败",
          icon: "none",
        })
      },
    })
  },

  clearAddressHistory() {
    clearAddressHistory()
    this.setData({
      addressHistoy: [],
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
