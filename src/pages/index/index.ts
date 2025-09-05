import log from "~/utils/log"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    camera: false,
    userLocation: false,
    writePhotosAlbum: false,

    showPrivacy: false, // 控制隐私协议弹窗显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // this.getAuth()
  },

  // getAuth() {
  //   wx.getSetting({
  //     success: (res) => {
  //       this.setData({ hasCheckedAuth: true })
  //       log.info(res.authSetting)
  //       // 确保所有值都是布尔值，避免 undefined
  //       const cameraAuth = res.authSetting["scope.camera"] ?? false
  //       const albumAuth = res.authSetting["scope.writePhotosAlbum"] ?? false
  //       const locationAuth = res.authSetting["scope.userLocation"] ?? false
  //       log.info("权限状态", { cameraAuth, albumAuth, locationAuth })

  //       this.setData({
  //         camera: cameraAuth,
  //         writePhotosAlbum: albumAuth,
  //         userLocation: locationAuth,
  //       })
  //     },
  //   })
  // },

  // getWritePhotosAlbum() {
  //   wx.authorize({
  //     scope: "scope.writePhotosAlbum",
  //     success: () => {
  //       // 直接设置状态，避免再次调用 getSetting
  //       this.setData({
  //         writePhotosAlbum: true,
  //       })
  //       wx.showToast({
  //         title: "已获得相册权限",
  //         icon: "success",
  //         duration: 1500,
  //       })
  //     },
  //     fail: (err) => {
  //       log.error("获取相册权限失败", err)
  //       wx.showModal({
  //         title: "权限申请失败",
  //         content: "请在设置中手动开启权限",
  //         confirmText: "去设置",
  //         success: (res) => {
  //           if (res.confirm) {
  //             wx.openSetting()
  //           }
  //         },
  //       })
  //     },
  //   })
  // },

  // getCamera() {
  //   log.info("请求相机权限")
  //   wx.authorize({
  //     scope: "scope.camera",
  //     success: () => {
  //       // 直接设置状态，避免再次调用 getSetting
  //       this.setData({
  //         camera: true,
  //       })
  //       wx.showToast({
  //         title: "已获得相机权限",
  //         icon: "success",
  //         duration: 1500,
  //       })
  //     },
  //     fail: (err) => {
  //       log.error("获取相机权限失败", err)
  //       wx.showModal({
  //         title: "权限申请失败",
  //         content: "请在设置中手动开启权限",
  //         confirmText: "去设置",
  //         success: (res) => {
  //           if (res.confirm) {
  //             wx.openSetting()
  //           }
  //         },
  //       })
  //     },
  //   })
  // },

  // getUserLocation() {
  //   wx.authorize({
  //     scope: "scope.userLocation",
  //     success: () => {
  //       // 直接设置状态，避免再次调用 getSetting
  //       this.setData({
  //         userLocation: true,
  //       })
  //       wx.showToast({
  //         title: "已获得位置权限",
  //         icon: "success",
  //         duration: 1500,
  //       })
  //     },
  //     fail: (err) => {
  //       log.error("获取位置权限失败", err)
  //       wx.showModal({
  //         title: "权限申请失败",
  //         content: "请在设置中手动开启权限",
  //         confirmText: "去设置",
  //         success: (res) => {
  //           if (res.confirm) {
  //             wx.openSetting()
  //           }
  //         },
  //       })
  //     },
  //   })
  // },

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
