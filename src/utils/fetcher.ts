import { Client, cacheExchange, fetchExchange } from "@urql/core"

// 微信小程序兼容的fetch实现 - 使用原生wx.request
const customClient = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input.toString()
  const method = (init?.method || "GET") as "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "HEAD"
  const headers = (init?.headers as Record<string, string>) || {}
  const data = init?.body || undefined

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header: headers,
      data,
      responseType: "text",
      success: (response) => {
        // 返回一个类似Response的对象
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          statusText: response.errMsg || "",
          headers: {
            get: (name: string) => {
              const headerName = name.toLowerCase()
              return response.header?.[headerName] || null
            },
          },
          text: () => {
            if (typeof response.data === "string") {
              return response.data
            }
            return JSON.stringify(response.data)
          },
          json: () => {
            if (typeof response.data === "string") {
              try {
                return JSON.parse(response.data)
              } catch {
                throw new Error("Invalid JSON response")
              }
            }
            return response.data
          },
        })
      },
      fail: (error) => {
        const errorMessage = error.errMsg || "Unknown network error"
        reject(new Error(`Network error: ${errorMessage}`))
      },
    })
  })
}

// 使用 urql client 时
export const urqlClient = new Client({
  url: "http://localhost:3000/graphql",
  exchanges: [cacheExchange, fetchExchange],
  fetch: customClient as any,
})
