/**
 * 通用全局类型
 */

// biome-ignore lint/suspicious/noExplicitAny: need any
export type PlainObject = Record<string, any>
// export type PlainObject = { [key: string]: any }

// export type StringObject = { [key: string]: string }
export type StringObject = Record<string, string>

// 价格单位，分 | 元, fen，yuan
export type PriceUnit = "fen" | "yuan"
//价格类型
//  main 粗体, lighter 细体, mini 黑色, del 中划线, delthrough 中划线，包括货币符号

export type PriceType = "main" | "lighter" | "mini" | "del" | "delthrough"
export type PriceData = {
  originPrice?: number | string
  price?: number | string
}

export type Weight = {
  value: number | null
  unit: string
}

export type LimitInfo = {
  text: string
}

export type Price = { priceType: number; price: string; priceTypeName: string }

export type Stock = {
  stockQuantity: number
  safeStockQuantity: number
  soldQuantity: number
}

export type SpuTag = {
  id: string | null
  title: string
  image?: string | null
}

export type SpecsArray = Record<string, string[]>

export type SpecValue = {
  specId: string
  specTitle?: string | null
  specValueId: string
  specValue: string | null
  saasId?: string | null
  image?: string | null
  hasStockObj?: {
    hasStock: boolean
    specsArray: SpecsArray
  }
  isSelected?: boolean
}

export type SpecItem = {
  specId: string
  title: string
  specValueList: SpecValue[]
}

export type SkuItem = {
  skuId: string
  skuImage?: string | null
  specInfo: SpecValue[]
  priceInfo?: Price[]
  price?: number
  quantity?: number
  stockInfo?: Stock
  weight?: Weight | null
  volume?: number | null
  profitPrice?: number | null
}

// TODO: goods 类型不明确，除id, PriceData外，起码还有wxml中thumb, title, tags等成员
export type Good = PriceData & {
  // id: string
  thumb?: string
  title: string
  tags?: string[]
  currency?: "¥"
  saasId?: string
  storeId?: string
  spuId: string
  primaryImage?: string
  images?: string[]
  // TODO: video 类型错误
  video?: null
  available?: number

  minSalePrice?: string | number
  minLinePrice?: string | number
  maxSalePrice?: string | number
  maxLinePrice?: string | number

  isSoldOut?: boolean
  groupIdList?: string[]
  isAvailable?: number
  spuStockQuantity?: number
  soldNum?: number
  isPutOnSale?: boolean | number
  categoryIds?: string[]
  specList: SpecItem[]

  spuTagList: SpuTag[]
  skuList: SkuItem[]
  limitInfo?: LimitInfo[]
  desc: string[]
  etitle: string
  // TODO: promotionList 在 tdesign mall中为null，作用不详
  promotionList?: null
  minProfitPrice?: number | null
}

export type MockGoodLit = {
  spuId: string
  thumb?: string
  title: string
  price?: number | string
  originPrice?: number | string
  tags: string[]
} // TODO: 本页面数据均是mock this.loadGoodsList,实际情况下应当根据分页/分标签/刷新等方式设立不同获取方式。
// TODO: goodsListLoadStatus 为 0 表示加载中，为 1 表示加载完成，为 3 表示错误。实际情况应当详细设定并有不同处理方式。传递给load-more 组件

export type LoadStatus = 0 | 1 | 3

export type Activity = {
  promotionId: string
  title: string
  description: null
  promotionCode: string
  promotionSubCode: string
  tag: string
  timeType: number
  startTime: string
  endTime: string
  teasingStartTime: null
  activityLadder: {
    label: string
  }[]
}
export type CommentCount = {
  commentCount: string
  badCount: string
  middleCount: string
  goodCount: string
  hasImageCount: string
  goodRate: number
  uidCount: string
}
export type GoodDetailsComments = {
  homePageComments: {
    spuId: string
    skuId: null
    specInfo: null
    commentContent: string
    commentScore: number
    uid: string
    userName: string
    userHeadUrl: string
  }[]
}
