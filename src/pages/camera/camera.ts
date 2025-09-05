import QQMapWX from "~/libs/qqmap-wx-jssdk"
import { formatTime } from "~/utils/date"

const qqmapsdk = new QQMapWX({
  key: "RTQBZ-S6GC5-KG5I2-IRR5G-QFWR2-7GF3N", //在这里输入你在腾讯位置服务平台申请的KEY
})

Page({
  data: {
    device: "back",
    flash: "",
    date: "",
    time: "",
    week: "",
    // 纬度，范围为 -90~90，负数表示南纬。使用 gcj02 国测局坐标系
    latitude: 0.0,
    // 经度，范围为 -180~180，负数表示西经。使用 gcj02 国测局坐标系
    longitude: 0.0,
    address: "",
    addressName: "",
    cameraWidth: 0,
    cameraHeight: 0,
    tempImagePath: "",

    timer: 0,
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const systemInfo = wx.getWindowInfo()
    const screenWidth = systemInfo.screenWidth
    const screenHeight = systemInfo.screenHeight
    const statusBarHeight = systemInfo.statusBarHeight
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
    const cameraWidth = screenWidth
    const cameraHeight =
      screenHeight -
      statusBarHeight -
      menuButtonInfo.height -
      (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 -
      90

    console.log(systemInfo)
    this.setData({
      cameraWidth,
      cameraHeight,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getTime()
    // 2. 地理位置监听完整流程：检查权限 → 开启定位 → 监听变化
    this.initLocationListener()
  },

  /**
   * 获取当前时间
   */
  getTime() {
    const timer = setInterval(() => {
      const timeData = formatTime()
      this.setData({
        date: timeData.date,
        time: timeData.time,
        week: timeData.week,
      })
    }, 1000)
    this.setData({ timer })
  },
  // 初始化地理位置监听
  initLocationListener() {
    // 第一步：检查用户是否授权位置权限
    wx.getSetting({
      success: (settingRes) => {
        // 若未授权，引导用户授权
        if (settingRes.authSetting["scope.userLocation"]) {
          // 已授权，直接开启定位
          this.startLocationUpdate()
        } else {
          wx.authorize({
            scope: "scope.userLocation",
            success: () => {
              // 授权成功后，开启前台定位
              this.startLocationUpdate()
            },
            fail: () => {
              // 用户拒绝授权，提示无法使用定位功能
              wx.showToast({
                title: "请授权位置权限以使用该功能",
                icon: "none",
                duration: 2000,
              })
            },
          })
        }
      },
    })
  },

  // 开启前台定位监听
  startLocationUpdate() {
    wx.startLocationUpdate({
      success: () => {
        // 定位开启成功后，监听位置变化
        wx.onLocationChange((res) => {
          console.log("最新位置：", res)
          // 示例：更新页面数据中的经纬度，用于地图渲染或其他逻辑
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })

          // 若需要根据位置更新地址信息（如逆地理编码），可调用wx.reverseGeocoder
          this.getAddressFromLocation(res.latitude, res.longitude)
        })
      },
      fail: (err) => {
        console.error("开启定位失败：", err)
        wx.showToast({
          title: "定位开启失败，请检查设置",
          icon: "none",
        })
      },
    })
  },

  // 逆地理编码：将经纬度转换为具体地址（如"北京市朝阳区..."）
  getAddressFromLocation(lat: number, lng: number) {
    qqmapsdk.reverseGeocoder({
      location: { latitude: lat, longitude: lng },
      success: (addrRes: any) => {
        const address = addrRes.result.address // 完整地址
        this.setData({ address }) // 更新到页面数据
      },
    })
  },
  /**
   * 图片安全检测
   */
  // checkImage(imageUrl) {
  //   //自己去接入一下
  //   return new Promise((resolve, reject) => {
  //     wx.request({
  //       url: checkApi,
  //       method: "POST",
  //       data: {
  //         image: imageUrl,
  //       },
  //       success: (res) => {
  //         wx.hideLoading()
  //         resolve(res.data.errcode)
  //         if (res.data.errcode == 0) {
  //         } else if (res.data.errcode == 87_014) {
  //           wx.showModal({
  //             title: "温馨提示",
  //             content: "您的照片存在违规内容，请规范本小程序使用。",
  //             showCancel: false,
  //             complete: (res) => {
  //               wx.reLaunch({
  //                 url: "/pages/index/index",
  //               })
  //             },
  //           })
  //         } else {
  //           wx.showToast({
  //             title: "图片检测失败，请重试",
  //             success: () => {
  //               wx.reLaunch({
  //                 url: "/pages/index/index",
  //               })
  //             },
  //           })
  //         }
  //       },
  //     })
  //   })
  // },

  /**
   * 拍摄事件
   */
  takePhoto() {
    const ctx = wx.createCameraContext()

    ctx.takePhoto({
      quality: "high",
      success: async (res) => {
        console.log(res)
        this.setData({
          tempImagePath: res.tempImagePath,
        })
        // 先图片内容安全检测
        // let checkResult = await this.checkImage(imageUrl)
        // if(checkResult==0){}

        const addWatermark = (await this.addWatermark(res.tempImagePath)) as string
        wx.previewImage({
          urls: [addWatermark],
        })
        this.setData({
          tempImagePath: "",
        })
      },
    })
  },

  /**
   * 给图片添加水印
   */
  addWatermark(imageUrl: string) {
    console.log(imageUrl)
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: "图片生成中...",
      })
      const query = wx.createSelectorQuery()
      const x = query.select("#canvas").fields({
        node: true,
        size: true,
      })

      x.exec((res) => {
        const canvas = res[0].node as WechatMiniprogram.Canvas
        const ctx = canvas.getContext("2d")

        const dpr = wx.getWindowInfo().pixelRatio
        const canvasWidth: number = res[0].width
        const canvasHeight: number = res[0].height
        canvas.width = canvasWidth * dpr
        canvas.height = canvasHeight * dpr
        ctx.scale(dpr, dpr)

        // 绘制背景图片
        const image = canvas.createImage()
        image.onload = () => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)

          ctx.font = "normal 28px null"
          ctx.fillStyle = "#ffffff"
          ctx.textBaseline = "bottom"

          // 绘制地址
          ctx.fillText(this.data.address, 20, canvasHeight - 20)

          // 绘制时间
          ctx.fillText(`${this.data.date} ${this.data.time}`, 20, canvasHeight - 65)

          // 绘制星期
          ctx.fillText(this.data.week, 20, canvasHeight - 115)

          wx.canvasToTempFilePath({
            canvas,
            success: (res) => {
              wx.hideLoading()
              resolve(res.tempFilePath)
            },
            fail: () => {
              wx.hideLoading()
              reject(new Error("转换为图片失败"))
            },
          })
        }
        image.src = imageUrl
      })
    })
  },

  /**
   * 切换摄像头
   */
  setDevice() {
    this.setData({
      device: this.data.device === "back" ? "front" : "back",
    })
    const text = this.data.device === "back" ? "后置" : "前置"
    wx.showToast({
      title: `摄像头${text}`,
    })
  },

  /**
   * 闪光灯开关
   */
  setFlash() {
    this.setData({
      flash: this.data.flash === "torch" ? "off" : "torch",
    })
  },

  /**
   * 选择位置信息
   */
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          address: res.address,
        })
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },

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
  onUnload() {
    // 移除地理位置监听（若有多个监听，可传具体回调函数移除指定监听）
    wx.offLocationChange()
  },

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
  onShareTimeline() {},
})
