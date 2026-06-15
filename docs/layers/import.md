# import-x

基于 [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)，校验导入的正确性。启用 `typescript` 时会自动追加 TypeScript 解析设置。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ importX: true })
```

> import 的**分组与排序**由 [perfectionist](./perfectionist) 层负责（Node 内置 → npm 包 → 内部源码 → 类型导入）。

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## 导入后缀一致（extensions） <span class="ls-cap ignore-header">🔧 💡</span>

相对导入约定省略 `.ts` / `.tsx` / `.js` / `.jsx` 后缀（构建工具会处理解析）。

::: bad

```ts
import { config } from './config.ts'
```
:::

::: good

```ts
import { config } from './config'
```
:::

如项目使用 NodeNext / 纯 ESM（运行时需要后缀），可关闭该约定：

```js
export default lintspec({ importX: { extensions: false } })
```

## 禁止重复导入（no-duplicates） <span class="ls-cap ignore-header">🔧</span>

同一模块的多次导入约定合并。

::: bad

```js
import { a } from './model'
import { b } from './model'
```
:::

::: good

```js
import { a, b } from './model'
```
:::

## 禁止无法解析的导入（no-unresolved）

约定不导入无法解析的模块（拼错路径、文件不存在）。

::: bad

```js
import { config } from './conifg'
```
:::

::: good

```js
import { config } from './config'
```
:::
