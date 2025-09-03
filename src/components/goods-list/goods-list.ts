import type { LitemallGoodsSelectItem } from "~/gql/graphql"

Component({
  externalClasses: ["wr-class"],

  properties: {
    goodsList: {
      type: Array,
      value: [] as LitemallGoodsSelectItem[],
    },
    thresholds: {
      type: Array,
      value: [],
    },
  },
  methods: {
    onClickGoods(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent("click", { ...e.detail, index })
    },

    onAddCart(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent("addcart", { ...e.detail, index })
    },

    onClickGoodsThumb(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent("thumb", { ...e.detail, index })
    },
  },
})
