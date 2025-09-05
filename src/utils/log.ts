/** biome-ignore-all lint/suspicious/noConsole: easy logger */
/** biome-ignore-all lint/suspicious/noExplicitAny: easy logger */

let isProduction = false

const Log = {
  // 初始化：根据环境设置是否启用调试日志
  init() {
    const accountInfo = wx.getAccountInfoSync()
    isProduction = accountInfo.miniProgram.envVersion === "release"
  },

  // 调试日志（生产环境不输出）
  debug(...args: any[]) {
    if (!isProduction) {
      console.debug("[DEBUG]", ...args)
    }
  },

  // 错误日志（所有环境都输出）
  error(...args: any[]) {
    console.error("[ERROR]", ...args)
  },

  // 信息日志（按需控制）
  info(...args: any[]) {
    if (!isProduction) {
      console.info("[INFO]", ...args)
    }
  },
}

// 初始化（在app.js中调用一次）
Log.init()

export default Log
