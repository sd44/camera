/**
 * URLSearchParams polyfill for mini-program environments
 * 小程序环境下的URLSearchParams兼容实现
 */

export class URLSearchParamsPolyfill {
  private params: Map<string, string[]>

  constructor(
    init?: string | Record<string, string> | URLSearchParamsPolyfill | [string, string][]
  ) {
    this.params = new Map()

    if (init) {
      if (typeof init === "string") {
        this.parseString(init)
      } else if (Array.isArray(init)) {
        this.parseArray(init)
      } else if (typeof init === "object") {
        this.parseObject(init)
      }
    }
  }

  private parseString(queryString: string): void {
    if (queryString.startsWith("?")) {
      queryString = queryString.substring(1)
    }

    const pairs = queryString.split("&")
    for (const pair of pairs) {
      if (pair) {
        const [key, value] = pair.split("=").map(decodeURIComponent)
        this.append(key, value || "")
      }
    }
  }

  private parseArray(pairs: [string, string][]): void {
    for (const [key, value] of pairs) {
      this.append(key, value)
    }
  }

  private parseObject(obj: Record<string, string> | URLSearchParamsPolyfill): void {
    if (obj instanceof URLSearchParamsPolyfill) {
      for (const [key, value] of obj) {
        this.append(key, value)
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        this.append(key, value)
      }
    }
  }

  append(name: string, value: string): void {
    const values = this.params.get(name) || []
    values.push(value)
    this.params.set(name, values)
  }

  delete(name: string): void {
    this.params.delete(name)
  }

  get(name: string): string | null {
    const values = this.params.get(name)
    return values && values.length > 0 ? values[0] : null
  }

  getAll(name: string): string[] {
    return this.params.get(name) || []
  }

  has(name: string): boolean {
    return this.params.has(name)
  }

  set(name: string, value: string): void {
    this.params.set(name, [value])
  }

  sort(): void {
    const sortedKeys = Array.from(this.params.keys()).sort()
    const sortedMap = new Map()
    for (const key of sortedKeys) {
      sortedMap.set(key, this.params.get(key))
    }
    this.params = sortedMap
  }

  toString(): string {
    const pairs: string[] = []
    for (const [key, values] of this.params) {
      for (const value of values) {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    }
    return pairs.join("&")
  }

  entries(): IterableIterator<[string, string]> {
    const entries: [string, string][] = []
    for (const [key, values] of this.params) {
      for (const value of values) {
        entries.push([key, value])
      }
    }
    return entries[Symbol.iterator]()
  }

  keys(): IterableIterator<string> {
    return this.params.keys()
  }

  values(): IterableIterator<string> {
    const values: string[] = []
    for (const valueList of this.params.values()) {
      values.push(...valueList)
    }
    return values[Symbol.iterator]()
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries()
  }

  forEach(callback: (value: string, key: string, parent: URLSearchParamsPolyfill) => void): void {
    for (const [key, value] of this) {
      callback(value, key, this)
    }
  }

  // Add size property to match URLSearchParams interface
  get size(): number {
    let count = 0
    for (const values of this.params.values()) {
      count += values.length
    }
    return count
  }
}
export default URLSearchParamsPolyfill
