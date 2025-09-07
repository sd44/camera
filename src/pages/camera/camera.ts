import { config } from "~/config/index"
import QQMapWX from "~/libs/qqmap-wx-jssdk"
import { addAddressHistory } from "~/libs/storage"
import { formatTime } from "~/utils/date"
import log from "~/utils/log"

const CAMERA_PADDING_BOTTOM = 90 // 相机页面底部的预留空间高度，可根据设计需求调整

const qqmapsdk = new QQMapWX({
  key: config.qqMapKey, // 从配置文件中获取密钥
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
    cameraWidth: 0,
    cameraHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,

    tempImagePath: "",

    timer: 0,
  },

  // 窗口大小变化的回调函数
  updateCameraSizeCallback: null as any,

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.updateCameraSize()

    // 保存更新相机尺寸的回调函数，以便在卸载时移除
    this.updateCameraSizeCallback = () => {
      this.updateCameraSize()
    }

    wx.onWindowResize(this.updateCameraSizeCallback)
  },
  updateCameraSize() {
    const systemInfo = wx.getWindowInfo()
    const screenWidth = systemInfo.screenWidth
    const screenHeight = systemInfo.screenHeight
    const statusBarHeight = systemInfo.statusBarHeight
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect()

    const menuButtonTopDistance = menuButtonInfo.top - statusBarHeight
    const cameraHeight =
      screenHeight -
      statusBarHeight -
      menuButtonInfo.height -
      menuButtonTopDistance * 2 -
      CAMERA_PADDING_BOTTOM
    const cameraWidth = screenWidth

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
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        log.info("初始位置：", res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        this.getAddressFromLocation(res.latitude, res.longitude)
      },
      fail: (err) => {
        log.error("获取初始位置失败", err)
        wx.showToast({
          title: "获取位置失败，部分功能受限",
          icon: "none",
          duration: 2000,
        })
      },
    })
    // 2. 地理位置监听完整流程：检查权限 → 开启定位 → 监听变化
    // this.initLocationListener()
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
  // 逆地理编码：将经纬度转换为具体地址（如"北京市朝阳区..."）
  getAddressFromLocation(lat: number, lng: number) {
    qqmapsdk.reverseGeocoder({
      location: { latitude: lat, longitude: lng, poi_options: "address_format=short" },
      success: (addrRes: any) => {
        if (addrRes?.result?.address) {
          const address = addrRes.result.formatted_addresses.recommend // 完整地址
          this.setData({ address }) // 更新到页面数据
        } else {
          log.error("逆地理编码返回数据格式异常", addrRes)
          this.setData({ address: "未知位置" })
        }
      },
      fail: (error: any) => {
        log.error("逆地理编码失败", error)
        this.setData({ address: "定位失败" })
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

    // 显示加载提示
    wx.showLoading({
      title: "处理中...",
      mask: true,
    })

    ctx.takePhoto({
      quality: "high",
      success: (res) => {
        if (!res?.tempImagePath) {
          wx.hideLoading()
          wx.showToast({
            title: "拍照结果异常",
            icon: "none",
          })
          return
        }

        wx.getImageInfo({
          src: res.tempImagePath, // 传入拍摄得到的临时路径
          success: async (imageInfo) => {
            log.info("图片信息", imageInfo)

            // 检查图片尺寸是否合理
            if (
              !(imageInfo.width && imageInfo.height) ||
              imageInfo.width <= 0 ||
              imageInfo.height <= 0
            ) {
              wx.hideLoading()
              wx.showToast({
                title: "图片尺寸异常",
                icon: "none",
              })
              return
            }

            this.setData({
              canvasWidth: imageInfo.width, // 图片实际宽度
              canvasHeight: imageInfo.height, // 图片实际高度
              tempImagePath: res.tempImagePath,
            })

            // 图片内容安全检测可在此处添加
            // let checkResult = await this.checkImage(res.tempImagePath)
            // if(checkResult==0){

            try {
              const watermarkedImage = await this.addWatermark(res.tempImagePath)
              wx.hideLoading()

              if (!watermarkedImage) {
                throw new Error("水印图片生成失败")
              }

              wx.previewImage({
                urls: [watermarkedImage as string],
                fail: (previewErr) => {
                  log.error("预览失败", previewErr)
                  wx.showToast({
                    title: "图片预览失败",
                    icon: "none",
                  })
                },
              })

              this.setData({
                tempImagePath: "",
              })
            } catch (error) {
              wx.hideLoading()
              log.error("添加水印失败", error)
              wx.showToast({
                title: "添加水印失败",
                icon: "none",
              })
            }
            // }
          },
          fail: (error) => {
            wx.hideLoading()
            log.error("获取图片信息失败", error)
            wx.showToast({
              title: "获取图片信息失败",
              icon: "none",
            })
          },
        })
      },
      fail: (error) => {
        wx.hideLoading()
        log.error("拍照失败", error)
        wx.showToast({
          title: "拍照失败",
          icon: "none",
        })
      },
    })
  },

  /**
   * 获取Canvas节点
   */
  getCanvasNode(): Promise<{ node: WechatMiniprogram.Canvas; width: number; height: number }> {
    // 使用wx.createSelectorQuery()的in方法指定页面上下文
    const query = wx.createSelectorQuery().in(this)

    return new Promise((resolve, reject) => {
      query
        .select("#canvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res?.[0]?.node) {
            resolve(res[0])
          } else {
            reject(new Error("获取Canvas元素失败"))
          }
        })
    })
  },

  /**
   * 加载图片到Canvas
   */
  async loadImage(canvas: WechatMiniprogram.Canvas, src: string) {
    const image = canvas.createImage()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error("图片加载失败"))
      image.src = src
    })
    return image
  },

  /**
   * 将Canvas转换为临时文件
   */
  async canvasToTempFile(canvas: WechatMiniprogram.Canvas) {
    const res = await wx.canvasToTempFilePath({ canvas })
    if (!res?.tempFilePath) {
      throw new Error("转换为图片失败")
    }
    return res.tempFilePath
  },

  /**
   * 给图片添加水印
   */
  async addWatermark(imageUrl: string) {
    if (!imageUrl) {
      throw new Error("图片路径为空")
    }

    try {
      // 获取Canvas节点
      const canvasRes = await this.getCanvasNode()
      if (!canvasRes?.node) {
        throw new Error("获取Canvas节点失败")
      }

      const canvas = canvasRes.node as WechatMiniprogram.Canvas
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("获取Canvas上下文失败")
      }

      // 设置Canvas尺寸
      const dpr = wx.getWindowInfo().pixelRatio || 1
      const { canvasWidth, canvasHeight } = this.data

      if (!(canvasWidth && canvasHeight) || canvasWidth <= 0 || canvasHeight <= 0) {
        throw new Error("Canvas尺寸无效")
      }

      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr
      ctx.scale(dpr, dpr)

      // 加载并绘制图片
      const image = await this.loadImage(canvas, imageUrl)
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)

      // 添加半透明背景以增强水印可读性
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.fillRect(0, canvasHeight - 230, canvasWidth, 240)

      // 设置文本样式
      ctx.font = "normal 28px sans-serif"
      ctx.fillStyle = "#ffffff"
      ctx.textBaseline = "bottom"

      // 绘制地址 - 添加文本截断处理
      const address = this.data.address || "未知位置"
      const maxWidth = canvasWidth - 40
      let displayAddress = address

      // 简单的文本截断处理
      if (ctx.measureText(address).width > maxWidth) {
        let tempText = address
        while (ctx.measureText(`${tempText}...`).width > maxWidth && tempText.length > 0) {
          tempText = tempText.substring(0, tempText.length - 1)
        }
        displayAddress = `${tempText}...`
      }

      ctx.fillText(displayAddress, 20, canvasHeight - 20)

      // 绘制时间
      const dateTime = `${this.data.date || "未知日期"} ${this.data.time || "未知时间"} ${this.data.week}`
      ctx.fillText(dateTime, 20, canvasHeight - 55)

      // 绘制经纬度
      ctx.fillText(`纬度： ${this.data.latitude.toFixed(8)}`, 20, canvasHeight - 90)
      ctx.fillText(`经度： ${this.data.longitude.toFixed(8)}`, 20, canvasHeight - 125)

      addAddressHistory({
        address,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
      })

      // 转换为图片并返回
      return await this.canvasToTempFile(canvas)
    } catch (error) {
      log.error("添加水印失败", error)
      throw error
    }
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

    wx.showToast({
      title: `闪光灯${this.data.flash === "torch" ? "开启" : "关闭"}`,
    })
  },

  /**
   * 选择位置信息
   */
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        log.info(res)
        this.setData({
          address: res.address,
        })
      },
      fail: (err) => {
        log.info(err)
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

    // 清除定时器，防止内存泄漏
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }

    // 移除窗口大小变化的监听器
    if (this.updateCameraSizeCallback) {
      wx.offWindowResize(this.updateCameraSizeCallback)
    }
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

  // 初始化地理位置监听
  initLocationListener() {
    // 第一步：检查用户是否授权位置权限
    wx.getSetting({
      success: (settingRes) => {
        // 若已授权，直接开启定位
        if (settingRes.authSetting["scope.userLocation"]) {
          this.startLocationUpdate()
        } else {
          wx.authorize({
            scope: "scope.userLocation",
            success: () => {
              // 授权成功后，开启前台定位
              this.startLocationUpdate()
            },
            fail: () => {
              // 用户拒绝授权，引导用户手动开启
              wx.showModal({
                title: "位置权限提示",
                content: "需要获取您的地理位置，请确认授权",
                confirmText: "去设置",
                cancelText: "取消",
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res2) => {
                        if (res2.authSetting["scope.userLocation"]) {
                          this.startLocationUpdate()
                        }
                      },
                    })
                  } else {
                    wx.showToast({
                      title: "未授权位置权限，部分功能受限",
                      icon: "none",
                      duration: 2000,
                    })
                  }
                },
              })
            },
          })
        }
      },
      fail: (err) => {
        log.error("获取设置失败", err)
      },
    })
  },

  // 开启前台定位监听
  startLocationUpdate() {
    wx.startLocationUpdate({
      success: () => {
        // 定位开启成功后，监听位置变化
        wx.onLocationChange((res) => {
          log.info("最新位置：", res)
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
        log.error("开启定位失败：", err)
        wx.showToast({
          title: "定位开启失败，请检查设置",
          icon: "none",
        })
      },
    })
  },
})
