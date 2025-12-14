# AutoClip 主题切换功能

## 功能概述

AutoClip 前端现在支持白天和黑夜主题切换，提供更好的用户体验。

## 实现的功能

### 1. 主题状态管理
- 使用 Zustand 管理主题状态
- 支持持久化存储，刷新页面后保持用户选择
- 自动检测系统主题偏好（首次访问时）

### 2. 主题切换组件
- 位于导航栏的主题切换按钮
- 太阳图标（浅色主题）和月亮图标（深色主题）
- 平滑的切换动画效果

### 3. 完整的主题适配
- 支持 Ant Design 组件的主题切换
- 自定义 CSS 变量系统
- 所有 UI 组件都适配了两种主题

## 文件结构

```
frontend/src/
├── stores/
│   └── useThemeStore.ts          # 主题状态管理
├── components/
│   ├── ThemeToggle.tsx           # 主题切换按钮
│   └── ThemeDemo.tsx             # 主题演示组件
├── hooks/
│   └── useThemeInit.ts           # 主题初始化 Hook
├── styles/
│   └── themes.css                # 主题样式定义
└── App.tsx                       # 主应用配置
```

## 使用方法

### 1. 主题切换
用户可以通过点击导航栏右侧的主题切换按钮来切换主题：
- 🌙 图标：当前为浅色主题，点击切换到深色主题
- ☀️ 图标：当前为深色主题，点击切换到浅色主题

### 2. 自动主题检测
- 首次访问时，系统会自动检测用户的系统主题偏好
- 如果系统设置为深色模式，则默认使用深色主题
- 如果系统设置为浅色模式，则默认使用浅色主题

### 3. 主题持久化
- 用户的主题选择会自动保存到本地存储
- 刷新页面或重新访问时会保持用户的选择

## 技术实现

### 1. CSS 变量系统
使用 CSS 自定义属性实现主题切换：

```css
:root {
  --bg-primary: #0f0f0f;      /* 深色主题 */
  --text-primary: #ffffff;
}

[data-theme="light"] {
  --bg-primary: #ffffff;      /* 浅色主题 */
  --text-primary: #212529;
}
```

### 2. Ant Design 主题配置
通过 ConfigProvider 动态配置 Ant Design 主题：

```typescript
const antdTheme = {
  algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    colorBgContainer: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    // ... 更多配置
  },
}
```

### 3. 状态管理
使用 Zustand 进行轻量级状态管理：

```typescript
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => { /* 切换逻辑 */ },
      setTheme: (theme: Theme) => { /* 设置逻辑 */ }
    }),
    { name: 'autoclip-theme-storage' }
  )
)
```

## 主题变量

### 深色主题（默认）
- 主背景：`#0f0f0f`
- 次背景：`#1a1a1a`
- 三级背景：`#2d2d2d`
- 主文字：`#ffffff`
- 次文字：`#cccccc`
- 主色调：`#4facfe`

### 浅色主题
- 主背景：`#ffffff`
- 次背景：`#f8f9fa`
- 三级背景：`#e9ecef`
- 主文字：`#212529`
- 次文字：`#495057`
- 主色调：`#1890ff`

## 扩展指南

### 添加新的主题变量
1. 在 `frontend/src/styles/themes.css` 中定义新的 CSS 变量
2. 为深色和浅色主题分别设置值
3. 在组件中使用 `var(--variable-name)` 引用

### 创建新的主题组件
1. 使用 `useThemeStore` Hook 获取当前主题
2. 根据主题状态调整组件样式
3. 确保组件在两种主题下都有良好的视觉效果

## 注意事项

1. **性能优化**：主题切换使用 CSS 变量，避免了重新渲染整个应用
2. **兼容性**：支持现代浏览器的 CSS 自定义属性
3. **可访问性**：确保两种主题下的对比度都符合可访问性标准
4. **一致性**：所有组件都应该遵循统一的主题变量系统

## 测试

可以通过访问 `/theme-test` 路由查看主题演示页面，测试各种组件在不同主题下的表现。