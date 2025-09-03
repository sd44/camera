Component({
  properties: {
    scrollTop: { type: Number, value: 0 },
  },
  data: {
    backTopTheme: "round",
    backTopText: "顶部",
  },
  methods: {
    onToTop(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent("to-top", e)
    },
  },
})
