import { tabBarData } from "./tab-bar-data"

Component({
  data: {
    active: 0,
    list: tabBarData,
  },

  attached() {
    const page = getCurrentPages().pop()
    const route = page ? page.route.split("?")[0] : ""
    const active = this.data.list.findIndex(
      (item) => (item.url.startsWith("/") ? item.url.slice(1) : item.url) === `${route}`
    )
    this.setData({ active })
  },

  methods: {
    onChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        active: e.detail.value,
      })
      wx.switchTab({
        url: this.data.list[e.detail.value].url.startsWith("/")
          ? this.data.list[e.detail.value].url
          : `/${this.data.list[e.detail.value].url}`,
      })
    },

    init() {
      const page = getCurrentPages().pop()
      const route = page ? page.route.split("?")[0] : ""
      const active = this.data.list.findIndex(
        (item) => (item.url.startsWith("/") ? item.url.slice(1) : item.url) === `${route}`
      )
      this.setData({ active })
    },
  },
})
