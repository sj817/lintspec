# 简介

Lintspec 是 [qwqo](https://github.com/sj817) 的一套 ESLint 与 Prettier 共享规范，目标是用**一个函数**把代码质量与格式化标准统一收口，开箱即用又能自由组合。

## 它解决什么问题

- 不想在每个项目里复制粘贴几十上百行 ESLint 配置；
- 希望 TypeScript、import 管理、排序、React/Vue 等能力按需开启，而不是装一堆插件各自配置；
- 希望 ESLint 与 Prettier 各司其职、互不打架。

## 两个包

- **`@qwqo/eslint-config`** —— 代码质量规范。默认导出工厂函数 `lintspec(options)`，按需组合各规则层。
- **`@qwqo/prettier-config`** —— 代码格式化规范。一份开箱即用的 Prettier 配置。

## 设计理念

- **职责分离**：ESLint 负责代码质量，Prettier 负责代码格式化；内置 [Prettier 协调层](../layers/prettier) 关闭一切冲突规则，两者永不打架。
- **分层可选**：基线层始终启用，其余（TypeScript、import-x、perfectionist、React、Vue、unicorn）均为独立开关，每层只作用于其目标文件类型。
- **可组合自定义**：每个开关都支持「布尔」或「子选项对象」两种写法，外加 `overrides` 万能覆盖。
- **真实示例**：每条规则都配 ❌/✅ 代码示例，并标注是否支持自动修复。

## 下一步

- [快速开始](./getting-started) —— 安装与最小配置
- [配置项总览](./options) —— 所有选项与子选项
- [规则层](../layers/base) —— 每条规则的 ❌/✅ 示例
