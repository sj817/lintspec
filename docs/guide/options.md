# 配置项总览

`@qwqo/eslint-config` 默认导出工厂函数 `lintspec(options)`，返回 ESLint 扁平配置数组。每个规则层都支持「布尔开关」或「子选项对象」两种写法，便于自由组合。

## 完整默认配置

下面列出**全部选项及其默认值**，可直接复制后按需修改 —— 没写到的选项都会回退到这里的默认值。

```js
// eslint.config.js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  // —— 全局变量 ——
  node: false, // Node.js 全局：process、Buffer、__dirname…
  browser: false, // 浏览器全局：window、document、fetch…

  // —— 规则层（布尔开关 或 子选项对象）——
  unicorn: true, // 现代化增强层，默认开启
  typescript: false, // TypeScript 规则层
  importX: false, // import-x 导入管理层
  perfectionist: false, // perfectionist 排序层
  react: false, // React 层
  vue: false, // Vue 层

  // —— 其它 ——
  maxLines: 300, // 单文件最大行数（max-lines，跳过空行/注释）；传 false 关闭

  // —— 文件范围与覆盖 ——
  files: ['**/*.{js,mjs,cjs,jsx}'], // 基线层适用文件
  ignores: [], // 追加的忽略模式（默认已忽略 node_modules 等，见下）
  overrides: {}, // 单条规则覆盖（优先级最高）
})
```

## 选项

| 选项            | 类型                         | 默认值                      | 说明                                                 |
| --------------- | ---------------------------- | --------------------------- | ---------------------------------------------------- |
| `node`          | `boolean`                    | `false`                     | 启用 Node.js 全局变量                                |
| `browser`       | `boolean`                    | `false`                     | 启用浏览器全局变量                                   |
| `unicorn`       | `boolean \| { strict? }`     | `true`                      | 启用 [unicorn](../layers/unicorn) 现代化增强层       |
| `typescript`    | `boolean \| { typeAware? }`  | `false`                     | 启用 [TypeScript](../layers/typescript) 层           |
| `importX`       | `boolean \| { extensions? }` | `false`                     | 启用 [import-x](../layers/import) 导入管理层          |
| `perfectionist` | `boolean \| { sort? }`       | `false`                     | 启用 [perfectionist](../layers/perfectionist) 排序层 |
| `react`         | `boolean`                    | `false`                     | 启用 [React](../layers/react) 层                     |
| `vue`           | `boolean`                    | `false`                     | 启用 [Vue](../layers/vue) 层                         |
| `maxLines`      | `number \| false`            | `300`                       | 单文件最大行数（`max-lines`，跳过空行/注释）；`false` 关闭 |
| `files`         | `string[]`                   | `['**/*.{js,mjs,cjs,jsx}']` | 基线层适用的文件匹配模式                             |
| `ignores`       | `string[]`                   | `[]`                        | 在默认忽略项之后追加的忽略模式                       |
| `overrides`     | `Linter.RulesRecord`         | `{}`                        | 优先级最高的规则覆盖                                 |

## 默认忽略

无需任何配置，下列目录与文件已被**默认忽略**（`ignores` 选项是在此基础上追加）：

```
**/node_modules/**   **/dist/**          **/build/**        **/out/**
**/coverage/**       **/.turbo/**        **/.cache/**       **/.next/**
**/.nuxt/**          **/.output/**       **/.vercel/**      **/.svelte-kit/**
**/.vitepress/cache/**   **/.vitepress/dist/**   **/*.min.js**
```

即 `node_modules` 等依赖与常见构建产物开箱即忽略。需要再忽略其它路径时用 `ignores`：

```js
export default lintspec({
  ignores: ['vendor/**', '**/*.gen.ts'],
})
```

## 子选项 / 自定义

| 子选项                 | 默认值          | 作用                                                  |
| ---------------------- | --------------- | ----------------------------------------------------- |
| `unicorn.strict`       | `false`         | 启用默认关闭的 6 条激进规则                            |
| `typescript.typeAware` | `false`         | 启用需要类型信息的规则（依赖 tsconfig）                |
| `importX.extensions`   | `true`          | 是否强制相对导入省略后缀；NodeNext 项目可设为 `false` |
| `perfectionist.sort`   | `'line-length'` | import 排序方式，可设为 `'natural'` 切回自然顺序       |

```js
export default lintspec({
  node: true,
  typescript: { typeAware: true }, // 开启类型感知规则
  unicorn: { strict: true }, // 开启全部 unicorn 规则
  importX: { extensions: false }, // 关闭无后缀强制
  perfectionist: { sort: 'natural' }, // 改用自然排序
})
```

## 场景示例

下面是几种常见项目的**完整 `eslint.config.js`**，可直接照搬。

### 最小 JS 项目

仅基线层 + unicorn（默认开启），加上 Node 全局。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ node: true })
```

### 纯 Node + TypeScript 库

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  node: true,
  typescript: true,
  importX: true,
  perfectionist: true,
})
```

### Vue 3 + TypeScript 项目

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  browser: true,
  typescript: true,
  vue: true,
  importX: true,
  perfectionist: true,
})
```

### React + TypeScript 项目

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  browser: true,
  typescript: true,
  react: true,
  importX: true,
  perfectionist: true,
})
```

### Monorepo / 自定义文件范围

开启类型感知规则、保留 NodeNext 的 `.js` 后缀，并把基线层限定到各包的 `src`。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  node: true,
  typescript: { typeAware: true },
  importX: { extensions: false }, // NodeNext：导入保留 .js 后缀
  perfectionist: { sort: 'natural' },
  files: ['packages/*/src/**/*.{ts,tsx}'],
  ignores: ['**/dist/**', '**/*.gen.ts'],
})
```

## 组合顺序

各层按固定顺序组合，[Prettier 协调层](../layers/prettier) 始终位于末尾，`overrides` 优先级最高：

```
基线层 → TypeScript → import-x → perfectionist → React → Vue → unicorn → Prettier 协调层 → overrides
```

每层仅作用于其目标文件类型（如 TypeScript 层仅作用于 `.ts`，Vue 层仅作用于 `.vue`），因此可安全地同时开启。

## 规则示例

每一层的具体规则与「不推荐 / 推荐」示例见「规则层」章节：

- [基线层](../layers/base)
- [unicorn](../layers/unicorn)
- [TypeScript](../layers/typescript)
- [import-x](../layers/import)
- [perfectionist](../layers/perfectionist)
- [React](../layers/react)
- [Vue](../layers/vue)
- [Prettier 协调层](../layers/prettier)

## 覆盖规则

任何单条规则都可以用 `overrides` 精确调整，优先级高于所有规则层：

```js
export default lintspec({
  typescript: true,
  overrides: {
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
```
