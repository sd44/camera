import type { LitemallGoodsSelectItem } from "~/gql/graphql"

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    goods: {
      type: Object,
      value: {} as LitemallGoodsSelectItem,
    },
    currency: {
      type: String,
      value: "¥",
    },
    thresholds: Array,
  },

  data: {
    independentID: "",
    isValidityLinePrice: false,
    _observer: null as null | WechatMiniprogram.IntersectionObserver, // 用于存储 IntersectionObserver 实例
  },

  observers: {
    goods(goods: LitemallGoodsSelectItem) {
      if (!goods) {
        return
      }
      let isValidityLinePrice = true
      if (goods.retailPrice && goods.counterPrice && goods.retailPrice < goods.counterPrice) {
        isValidityLinePrice = true
      }
      this.setData({ isValidityLinePrice })
    },
    // Note: data is both a property and observer by design
    thresholds(thresholds: number[]) {
      if (thresholds?.length) {
        this.createIntersectionObserverHandle()
      } else {
        this.clearIntersectionObserverHandle()
      }
    },
  },
  lifetimes: {
    ready() {
      this.init()
    },
    detached() {
      this.clear()
    },
  },

  methods: {
    clickHandle() {
      this.triggerEvent("click", { goods: this.data.goods })
    },

    clickThumbHandle() {
      this.triggerEvent("thumb", { goods: this.data.goods })
    },

    //TODO: 购物车点击事件处理
    addCartHandle(_e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent("add-cart", {
        goods: this.data.goods,
      })
    },

    init() {
      const { thresholds } = this.data
      if (thresholds?.length) {
        this.createIntersectionObserverHandle()
      }
    },
    clear() {
      this.clearIntersectionObserverHandle()
    },

    createIntersectionObserverHandle() {
      if (this.data._observer || !this.data.independentID) {
        return
      }
      const _observer = this.createIntersectionObserver({
        thresholds: this.data.thresholds,
      }).relativeToViewport()

      _observer.observe(`#${this.data.independentID}`, (res) => {
        this.intersectionObserverCB(res)
      })
      this.setData({ _observer })
    },

    intersectionObserverCB(_res: WechatMiniprogram.IntersectionObserverObserveCallbackResult) {
      // res.id // 目标节点 id
      // res.dataset // 目标节点 dataset
      // res.intersectionRatio // 相交区域占目标节点的布局区域的比例
      // res.intersectionRect // 相交区域
      // res.intersectionRect.left // 相交区域的左边界坐标
      // res.intersectionRect.top // 相交区域的上边界坐标
      // res.intersectionRect.width // 相交区域的宽度
      // res.intersectionRect.height // 相交区域的高度
      this.triggerEvent("ob", {
        goods: this.data.goods,
        context: this.data._observer, // 交叉观察器实例
        // res, // 可见性变化的详细信息（如可见比例、边界等）
      })
    },

    clearIntersectionObserverHandle() {
      if (this.data._observer) {
        try {
          this.data._observer.disconnect()
        } catch (_e) {}
        this.setData({ _observer: null })
      }
    },
  },
})
