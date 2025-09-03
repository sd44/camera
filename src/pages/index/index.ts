import ActionSheet, { ActionSheetTheme } from "tdesign-miniprogram/action-sheet/index"

const firstGrid = [
  {
    label: "微信",
    image: "https://tdesign.gtimg.com/mobile/demos/wechat.png",
  },
  {
    label: "朋友圈",
    image: "https://tdesign.gtimg.com/mobile/demos/times.png",
  },
  {
    label: "QQ",
    image: "https://tdesign.gtimg.com/mobile/demos/qq.png",
  },
  {
    label: "企业微信",
    image: "https://tdesign.gtimg.com/mobile/demos/wecom.png",
  },
  {
    label: "收藏",
    icon: "star",
  },
  {
    label: "刷新",
    icon: "refresh",
  },
  {
    label: "下载",
    icon: "download",
  },
  {
    label: "复制",
    icon: "queue",
  },
]
Page({
  data: {
    mode: "light",
  },
  switchMode() {
    if (this.data.mode === "light") {
      this.setData({
        mode: "dark",
      })
    } else {
      this.setData({
        mode: "light",
      })
    }
  },
  async copy(e: WechatMiniprogram.BaseEvent) {
    if (e.mark?.url) {
      await wx.setClipboardData({
        data: e.mark.url,
      })
    }
  },
  handleSelected(_e: WechatMiniprogram.CustomEvent) {},
  onLoad() {},
  handleAction() {
    ActionSheet.show({
      theme: ActionSheetTheme.Grid,
      selector: "#t-action-sheet",
      context: this,
      items: firstGrid,
      align: "center",
      description: "",
    })
  },
})
