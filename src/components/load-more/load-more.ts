// LoadStatus 为 0 表示正常， 1 表示加载完成，2 表示全部加载， 3 表示错误。
export type LoadStatus = 0 | 1 | 2 | 3

Component({
  externalClasses: ["wr-class", "wr-class--no-more"],

  options: { multipleSlots: true },

  properties: {
    status: {
      type: Number,
      value: 0 as LoadStatus,
    },
    loadingText: {
      type: String,
      value: "加载中...",
    },
    noMoreText: {
      type: String,
      value: "没有更多了",
    },
    failedText: {
      type: String,
      value: "加载失败，点击重试",
    },
    color: {
      type: String,
      value: "#BBBBBB",
    },
    failedColor: {
      type: String,
      value: "#FA550F",
    },
    size: {
      type: null,
      value: "40rpx",
    },
    loadingBackgroundColor: {
      type: String,
      value: "#F5F5F5",
    },
    listIsEmpty: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    /** 点击处理 */
    tapHandle() {
      // 失败重试
      if (this.data.status === 3) {
        this.triggerEvent("retry")
      }
    },
  },
})
