// import type { FetchTabsQuery } from "~/gql/graphql"

Component({
  properties: {
    tablist: {
      type: Object,
      // value: {} as FetchTabsQuery,
      value: {},
    },
  },
  observers: {
    tablist(_tablist) {},
  },
  methods: {
    onClickItem(_e: WechatMiniprogram.TouchEvent) {
      // const { id } = e.currentTarget.dataset
      // TODO: 跳转到分类页面
      // wx.navigateTo({
      //   url: `/pages/category/index?categoryId=${id}`,
      // })
    },
  },
})
