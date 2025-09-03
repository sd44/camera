import { gql } from "@urql/core"
import type { MyQuery1Query, MyQuery2Query } from "@/gql/graphql"
import { urqlClient } from "./fetcher"

// 就生成文档，codegen 推荐使用其自动生成的graphql函数，其实使用urql自带的gql也可以
export const TESTQUERY1 = gql`
query MyQuery1 {
  litemallAd {
    id
    name
    }
  }
`

export const TESTQUERY2 = gql`
query MyQuery2 {
  litemallRole {
    name
    id
    enabled
  }
}
`

// Example: using urql client (you need to implement or import urqlClient)
export async function xx() {
  // Replace this with your actual GraphQL client call
  // For example, using urql:
  // 详见 @/utils/fetcher.ts

  // 蹩脚的微信小程序，不能使用 urql 的 useQuery hooks，只能手动带入类型，如 MyQuery1Query
  const adResult = await urqlClient.query<MyQuery1Query>(TESTQUERY1, {}).toPromise()
  adResult.data?.litemallAd?.forEach((_ad) => {})

  const roleResult = await urqlClient.query<MyQuery2Query>(TESTQUERY2, {}).toPromise()
  roleResult.data?.litemallRole?.forEach((_role) => {})
}
