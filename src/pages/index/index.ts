const app = getApp()
// pages/index/index.js
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
    this.observerPrivacyChange()
    this.getAuth()
  },

  // 监听隐私协议需要确认的状态
  observerPrivacyChange() {
    wx.onNeedPrivacyAuthorization((resolve) => {
      this.setData({ showPrivacy: true })
      app.globalData.privacyResolve = resolve
    })
  },

  // 用户同意隐私协议
  agreePrivacy() {
    this.setData({ showPrivacy: false })
    // 调用微信提供的回调，确认用户已同意隐私协议
    if (app.globalData.privacyResolve) {
      app.globalData.privacyResolve({ agree: true })
      app.globalData.privacyResolve = null
    }
    // 同意后再尝试申请相机权限
    this.getCamera()
    this.getUserLocation()
    this.getWritePhotosAlbum()
  },

  // 用户拒绝隐私协议
  refusePrivacy() {
    this.setData({ showPrivacy: false })
    if (app.globalData.privacyResolve) {
      app.globalData.privacyResolve({ agree: false })
      app.globalData.privacyResolve = null
    }
  },

  getAuth() {
    if (!this.data.showPrivacy) {
      return
    }
    wx.getSetting({
      success: (res) => {
        this.setData({ hasCheckedAuth: true })
        console.log(res.authSetting)
        // 确保所有值都是布尔值，避免 undefined
        const cameraAuth = res.authSetting["scope.camera"] ?? false
        const albumAuth = res.authSetting["scope.writePhotosAlbum"] ?? false
        const locationAuth = res.authSetting["scope.userLocation"] ?? false
        console.log("权限状态", { cameraAuth, albumAuth, locationAuth })

        this.setData({
          camera: cameraAuth,
          writePhotosAlbum: albumAuth,
          userLocation: locationAuth,
        })
      },
    })
  },

  getWritePhotosAlbum() {
    wx.authorize({
      scope: "scope.writePhotosAlbum",
      success: () => {
        // 直接设置状态，避免再次调用 getSetting
        this.setData({
          writePhotosAlbum: true,
        })
        wx.showToast({
          title: "已获得相册权限",
          icon: "success",
          duration: 1500,
        })
      },
      fail: (err) => {
        console.error("获取相册权限失败", err)
        wx.showModal({
          title: "权限申请失败",
          content: "请在设置中手动开启权限",
          confirmText: "去设置",
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          },
        })
      },
    })
  },

  getCamera() {
    console.log("请求相机权限")
    wx.authorize({
      scope: "scope.camera",
      success: () => {
        // 直接设置状态，避免再次调用 getSetting
        this.setData({
          camera: true,
        })
        wx.showToast({
          title: "已获得相机权限",
          icon: "success",
          duration: 1500,
        })
      },
      fail: (err) => {
        console.error("获取相机权限失败", err)
        wx.showModal({
          title: "权限申请失败",
          content: "请在设置中手动开启权限",
          confirmText: "去设置",
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          },
        })
      },
    })
  },

  getUserLocation() {
    wx.authorize({
      scope: "scope.userLocation",
      success: () => {
        // 直接设置状态，避免再次调用 getSetting
        this.setData({
          userLocation: true,
        })
        wx.showToast({
          title: "已获得位置权限",
          icon: "success",
          duration: 1500,
        })
      },
      fail: (err) => {
        console.error("获取位置权限失败", err)
        wx.showModal({
          title: "权限申请失败",
          content: "请在设置中手动开启权限",
          confirmText: "去设置",
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          },
        })
      },
    })
  },

  goCamera() {
    // 先检查相机权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.camera"] === true) {
          // 有权限，直接跳转
          wx.navigateTo({
            url: "/pages/camera/camera",
          })
        } else {
          // 没有权限，先请求
          wx.showModal({
            title: "需要相机权限",
            content: "使用相机功能需要您授权相机权限",
            confirmText: "去授权",
            cancelText: "取消",
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.getCamera()
              }
            },
          })
        }
      },
      fail: (err) => {
        console.error("获取权限设置失败", err)
        wx.showToast({
          title: "获取权限设置失败",
          icon: "none",
        })
      },
    })
  },

  goPicture() {
    console.log("goPicture")
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album"],
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: `/pages/picture/picture?imageUrl=${res.tempFiles[0].tempFilePath}`,
        })
      },
      fail: (err) => {
        console.error("获取图片失败", err)
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
