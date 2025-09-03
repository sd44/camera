import type { PriceType, PriceUnit } from "~/types/common"

Component({
  externalClasses: ["wr-class", "symbol-class", "decimal-class"],
  // useStore: [],
  properties: {
    priceUnit: {
      type: String,
      value: "fen" as PriceUnit,
    },
    price: {
      type: null,
      value: "",
    }, // 价格, 以分为单位
    type: {
      type: String,
      value: "main" as PriceType,
    },
    symbol: {
      type: String,
      value: "¥",
    }, // 货币符号，默认是人民币符号￥
    fill: {
      type: Boolean,
      value: false,
    }, // 是否自动补齐两位小数
    decimalSmaller: {
      type: Boolean,
      value: false,
    }, // 小数字号小一点
    lineThroughWidth: {
      type: String,
      value: "0.12em",
    }, // 划线价线条高度
  },

  observers: {
    price(price) {
      this.format(price)
    },
  },
  data: {
    pArr: [] as string[],
  },

  methods: {
    formatYuanPrice(absPrice: number, pArr: string[]) {
      const priceSplit = absPrice.toString().split(".")
      const fraction = priceSplit[1] || ""
      let nextFrac: string
      if (fraction.length >= 2) {
        nextFrac = fraction.slice(0, 2)
      } else if (fraction.length === 1) {
        nextFrac = `${fraction}0`
      } else {
        nextFrac = "00"
      }
      pArr[0] = priceSplit[0]
      pArr[1] = nextFrac
    },

    formatFenPrice(absPrice: number, pArr: string[]) {
      const fen = Math.round(absPrice * 1e8) / 1e8
      const fenInt = Math.ceil(fen)
      pArr[0] = fenInt >= 100 ? `${fenInt}`.slice(0, -2) : "0"
      pArr[1] = `${fenInt + 100}`.slice(-2)
    },

    trimTrailingZeros(pArr: string[]) {
      if (pArr[1] === "00") {
        pArr[1] = ""
      } else if (pArr[1][1] === "0") {
        pArr[1] = pArr[1][0]
      }
    },

    format(price: string) {
      const num = Number.parseFloat(price)
      const pArr: string[] = []
      if (Number.isNaN(num)) {
        this.setData({ pArr })
        return
      }

      const absPrice = Math.abs(num)
      const isMinus = num < 0

      if (this.data.priceUnit === "yuan") {
        this.formatYuanPrice(absPrice, pArr)
      } else {
        this.formatFenPrice(absPrice, pArr)
      }

      if (!this.data.fill) {
        this.trimTrailingZeros(pArr)
      }

      if (isMinus) {
        pArr[0] = `-${pArr[0]}`
      }

      this.setData({ pArr })
    },
  },
})
