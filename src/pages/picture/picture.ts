import QQMapWX from "~/libs/qqmap-wx-jssdk"
import { formatTime } from "~/utils/date"

const qqmapsdk = new QQMapWX({
  key: "RTQBZ-S6GC5-KG5I2-IRR5G-QFWR2-7GF3N", // 必填
})

Page({
  data: {
    imageUrl: "https://img.btstu.cn/api/images/5bd2af56cbbed.jpg",
    canvasHeight: 0,
    canvasWidth: 0,
    date: "",
    time: "",
    week: "",
    address: "",
    showPicker: false,
    timer: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTime()
    this.getLocation()

    if (options.imageUrl) {
      const imageUrl = options.imageUrl

      // 最好是在导入照片时就直接做一个安全检测
      // let checkResult = await this.checkImage(imageUrl)

      this.init(imageUrl)
      // this.setData({
      // 	imageUrl
      // })
    }
    // this.init(this.data.imageUrl)
  },

  /**
   * 初始化canvas
   */
  init(imageUrl: string) {
    const systemInfo = wx.getWindowInfo()
    const canvasWidth = systemInfo.screenWidth
    const dpr = systemInfo.pixelRatio
    wx.getImageInfo({
      src: imageUrl,
      success: (res) => {
        console.log(res)
        const watermarkScale = res.width / canvasWidth
        this.setData({
          canvasHeight: Math.round(res.height / watermarkScale),
          canvasWidth,
          imageUrl: res.path,
        })

        console.log(this.data.canvasHeight, this.data.canvasWidth)
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

  /**
   * 获取地址信息
   */
  getLocation() {
    wx.getLocation({
      success: (res) => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: (res: any) => {
            const address = res.result.address
            this.setData({
              address,
            })
          },
        })
      },
    })
  },

  /**
   * 手动选择地点
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
   * 手动选择时间
   */
  setTime() {
    clearInterval(this.data.timer)
    this.setData({
      showPicker: true,
      timer: 0,
    })
  },

  /**
   * 关闭设置时间框
   */
  closePicker() {
    this.setData({
      showPicker: false,
    })
  },

  /**
   * 生成图片
   */
  async createPicture() {
    const imageUrl = this.data.imageUrl
    console.log(imageUrl)
    // let checkResult = await this.checkImage(imageUrl)
    const picture = (await this.addWatermark(imageUrl)) as string
    console.log(picture)
    wx.previewImage({
      urls: [picture],
    })
  },

  /**
   * 图片安全检测
   */
  // checkImage() {
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
   * 文本安全检测
   */
  checkText() {
    //这个目前不需要，暂时不支持自定义文字
    return new Promise((resolve, reject) => {})
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
   * 设置日期
   */
  bindDateChange(e: WechatMiniprogram.CustomEvent) {
    const date = e.detail.value
    const dateStr = new Date(date)
    const week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][
      dateStr.getDay()
    ]
    console.log(date, week)
    this.setData({
      date,
      week,
    })
  },

  /**
   * 设置时间
   */
  bindTimeChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      time: e.detail.value,
    })
  },

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
  onShareTimeline() {},
})
