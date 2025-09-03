Component({
  properties: {
    imgSrcs: {
      type: Array,
      value: [] as string[],
    },
    pageLoading: {
      type: Boolean,
      value: false,
    },
    current: {
      type: Number,
      value: 0,
    },
    autoplay: {
      type: Boolean,
      value: true,
    },
    duration: {
      type: Number,
      value: 500,
    },
    interval: {
      type: Number,
      value: 5000,
    },
    navigation: { type: Object, value: { type: "dots" } },
    swiperImageProps: { type: Object, value: { mode: "scaleToFill" } },
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      if (this.data.imgSrcs.length === 0) {
        const images = [
          "https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner1.png",
          "https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner2.png",
          "https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner3.png",
          "https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner4.png",
          "https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner5.png",
          "https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner6.png",
        ]
        this.setData({
          imgSrcs: images,
        })
      }
    },
  },
  methods: {
    navToActivityDetail({ detail }: WechatMiniprogram.CustomEvent) {
      // TODO: imgsrc传递时，其实应当也传递相应的 url,以便跳转。为开发方便，先如此
      const { index: promotionID = 0 } = detail || {}
      wx.navigateTo({
        url: `/pages/promotion/promotion-detail/promotion-detail?promotion_id=${promotionID}`,
      })
    },
  },
})
