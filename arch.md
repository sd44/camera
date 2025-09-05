# 项目架构文档

## 概述
本项目是一个基于微信小程序的相机应用，主要功能包括拍照、图片浏览等。

## 目录结构
```
/home/sd44/test/camera
├── src/
│   ├── app.ts                # 应用入口文件
│   ├── app.jsonc             # 应用配置文件
│   ├── components/           # 组件目录
│   ├── pages/                # 页面目录
│   ├── utils/                # 工具函数目录
│   ├── types/                # 类型定义目录
│   ├── image/                # 图片资源目录
│   └── gitimage/             # Git 图片资源目录
├── dist/                     # 构建输出目录
└── ...
```

## 核心文件
1. **app.ts**
   - 定义全局数据（如隐私授权处理）。
   - 生命周期钩子（如 `onLaunch`）。

2. **app.jsonc**
   - 配置页面路由、窗口标题等。

## 页面结构
- `pages/index/index`：首页
- `pages/camera/camera`：相机页面
- `pages/picture/picture`：图片浏览页面
- `pages/hello-world/hello-world`：测试页面

## 功能模块
- **组件**：`components/` 存放可复用的 UI 组件。
- **工具函数**：`utils/` 提供辅助功能。
- **资源管理**：`image/` 和 `gitimage/` 存放图片资源。

## 隐私保护
通过 `wx.onNeedPrivacyAuthorization` 处理隐私授权逻辑。