import URLSearchParamsPolyfill from "./utils/url-search-params-polyfill"

// 全局注册polyfill - 小程序环境兼容
// 小程序环境下的全局对象可能是 wx、global 或 globalThis
;(globalThis as any).URLSearchParams = URLSearchParamsPolyfill

App({
  globalData: {},

  // 小程序启动之后 触发
  onLaunch() {},
})
