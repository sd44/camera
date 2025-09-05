App({
  globalData: {
    privacyResolver: null as WechatMiniprogram.OnNeedPrivacyAuthorizationListenerResult | null,
  },

  // 小程序启动之后 触发
  onLaunch() {
    wx.onNeedPrivacyAuthorization((resolve) => {
      this.globalData.privacyResolver = resolve
    })
    // if (wx.onNeedPrivacyAuthorization) {
    //   wx.onNeedPrivacyAuthorization((resolve) => {
    //     this.privacyAuthorization = resolve
    //     wx.navigateTo({
    //       url: "/services/pages/privacy/auth",
    //     })
    //   })
    // }
  },
})
