App({
  globalData: {
    privacyResolve: null as null | WechatMiniprogram.OnNeedPrivacyAuthorizationListenerResult, // 用于保存隐私协议的回调函数
    needPrivacyAuth: false, // 标记是否需要显示隐私弹窗
  },

  // 小程序启动之后 触发
  onLaunch() {
    // 监听隐私协议需要用户确认的事件
    wx.onNeedPrivacyAuthorization((resolve) => {
      // 这里可以显示自定义的隐私协议弹窗
      this.globalData.privacyResolve = resolve
      // 触发页面显示隐私弹窗
      this.globalData.needPrivacyAuth = true
    })
  },
})
