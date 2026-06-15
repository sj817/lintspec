# Lintspec

[![CI](https://github.com/sj817/lintspec/actions/workflows/ci.yml/badge.svg)](https://github.com/sj817/lintspec/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@qwqo/eslint-config?label=eslint-config)](https://www.npmjs.com/package/@qwqo/eslint-config)
[![npm](https://img.shields.io/npm/v/@qwqo/prettier-config?label=prettier-config)](https://www.npmjs.com/package/@qwqo/prettier-config)

自用的 ESLint 与 Prettier 共享规范：工厂式、分层、TypeScript 优先

📖 **文档：<https://eslint.qwqo.cn/>**

## 包

- `@qwqo/eslint-config` —— ESLint 代码质量规则
- `@qwqo/prettier-config` —— Prettier 格式化规则
- `create-qwqo-config` —— 交互式脚手架

## 快速开始

最快的方式是用脚手架，按提示选框架 / TS / 环境，自动写配置、装依赖、加脚本：

```bash
pnpm create qwqo-config
```

或手动安装：

```bash
pnpm add -D eslint prettier @qwqo/eslint-config @qwqo/prettier-config
```

## ESLint

配置是一个工厂函数。新建 `eslint.config.mjs`：

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ node: true, typescript: true })
```

每个规则层都是可选开关，且只作用于其目标文件类型，可安全地同时开启：

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  node: true,
  browser: false,
  unicorn: true, // 默认开启；{ strict: true } 启用激进规则
  typescript: true, // 或 { typeAware: true }
  importX: true, // 或 { extensions: false }
  perfectionist: true, // 或 { sort: 'natural' }
  react: true,
  vue: true,
  maxLines: 300, // 单文件最大行数；传 false 关闭
  ignores: ['vendor/**'],
  overrides: { 'no-await-in-loop': 'off' },
})
```

每个开关都支持「布尔」或「子选项对象」两种写法，可自由组合。完整选项、子选项与每条规则的「不推荐 / 推荐」示例见[文档](https://eslint.qwqo.cn/)。

### 选项

| 选项            | 类型                         | 默认值                      | 说明                                  |
| --------------- | ---------------------------- | --------------------------- | ------------------------------------- |
| `node`          | `boolean`                    | `false`                     | 启用 Node.js 全局变量                 |
| `browser`       | `boolean`                    | `false`                     | 启用浏览器全局变量                    |
| `unicorn`       | `boolean \| { strict? }`     | `true`                      | 启用 `eslint-plugin-unicorn` 层       |
| `typescript`    | `boolean \| { typeAware? }`  | `false`                     | 启用 TypeScript 层                    |
| `importX`       | `boolean \| { extensions? }` | `false`                     | 启用 `eslint-plugin-import-x` 层      |
| `perfectionist` | `boolean \| { sort? }`       | `false`                     | 启用 `eslint-plugin-perfectionist` 层 |
| `react`         | `boolean`                    | `false`                     | 启用 React 层                         |
| `vue`           | `boolean`                    | `false`                     | 启用 Vue 层                           |
| `maxLines`      | `number \| false`            | `300`                       | 单文件最大行数（跳过空行/注释）       |
| `files`         | `string[]`                   | `['**/*.{js,mjs,cjs,jsx}']` | 基线层适用的文件匹配模式              |
| `ignores`       | `string[]`                   | `[]`                        | 在默认忽略项之后追加的忽略模式        |
| `overrides`     | `Linter.RulesRecord`         | `{}`                        | 优先级最高的规则覆盖                  |

## Prettier

新建 `prettier.config.mjs`：

```js
export { default } from '@qwqo/prettier-config'
```

## 设计理念

ESLint 负责代码质量，Prettier 负责格式化。两者通过内置的、始终置于末尾的 `eslint-config-prettier` 协调层解耦，格式化规则永不冲突 —— Lintspec 不含任何风格/格式化类 ESLint 规则。

基线层基于 ESLint 内置规则，其余层（unicorn、TypeScript、import-x、perfectionist、React、Vue）按需叠加。React 层使用扁平配置原生的 `@eslint-react`（兼容 ESLint 10）加 `react-hooks`。

源码用 TypeScript 编写，`tsc` 做类型检查，`tsdown` 构建为 ESM + 类型声明。

## 开发

```bash
pnpm check       # 构建 + 类型检查 + lint + 格式检查 + 测试
pnpm docs:dev    # 本地预览文档站
```

发版：把各包 `version` 改成同一新版本，提交后打 `v*` 标签推送，CI 经可信发布（OIDC，免 token）发布到 npm。
