// URLSearchParams polyfill 测试函数
export function testURLSearchParams() {
  // 测试 URLSearchParams 基本功能
  try {
    const _params = new URLSearchParams("key1=value1&key2=value2")
  } catch (_error) {}
}
