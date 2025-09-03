export type TabBarItem = {
  url: string
  text: string
  icon: string
}

export const tabBarData: TabBarItem[] = [
  { url: "/pages/index/index", text: "首页", icon: "home" },
  { url: "/pages/hello-world/hello-world", text: "Hello", icon: "app" },
  // { value: "label_3", text: "聊天", icon: "chat" },
  // { value: "label_4", text: "我的", icon: "user" },
]
