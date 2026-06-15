# 快速开始

Lintspec 提供两个共享配置包：

- `@qwqo/eslint-config` —— ESLint 代码质量规范
- `@qwqo/prettier-config` —— Prettier 格式化规范

## 安装

```bash
pnpm add -D eslint prettier @qwqo/eslint-config @qwqo/prettier-config
```

## 配置 ESLint

新建 `eslint.config.js`：

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ node: true, typescript: true })
```

详见 [配置项总览](./options)。

## 配置 Prettier

新建 `prettier.config.js`：

```js
export { default } from '@qwqo/prettier-config'
```

详见 [Prettier 配置](./prettier)。

## 脚本

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

## 设计理念

ESLint 负责代码质量，Prettier 负责代码格式化。两者通过内置的 Prettier 协调层解耦，互不冲突。
