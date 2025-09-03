type QueryParamValue = string | number | boolean
type QueryParams = Record<string, QueryParamValue | null | undefined>

export const obj2Params = (obj: QueryParams, encode = true): string => {
  const result: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    if (value != null) {
      const stringValue = String(value)
      result.push(`${key}=${encode ? encodeURIComponent(stringValue) : stringValue}`)
    }
  }

  return result.join("&")
}

export function genQueryString(obj: QueryParams): string {
  const hasValidParams = Object.values(obj).some((value) => value != null)
  return hasValidParams ? `?${obj2Params(obj)}` : ""
}
