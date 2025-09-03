import type { CodegenConfig } from "@graphql-codegen/cli"

// 以下我选择了生成客户端代码，而不是服务端
const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  documents: ["src/schema/*.graphql", "src/schema/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
