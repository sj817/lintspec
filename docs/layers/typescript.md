# TypeScript

基于 [typescript-eslint](https://typescript-eslint.io/) 推荐配置，仅作用于 `.ts` / `.tsx` 文件。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ typescript: true })
```

传入对象可开启需要类型信息的规则（依赖 `tsconfig.json`，能力更强但更慢）：

```js
export default lintspec({ typescript: { typeAware: true } })
```

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## 一致的类型导入（consistent-type-imports） <span class="ls-cap ignore-header">🔧</span>

类型导入约定使用顶层 `import type {...}`。

::: bad

```ts
import { User } from './types'

const user: User = load()
```
:::

::: good

```ts
import type { User } from './types'

const user: User = load()
```
:::

## 顶层 import type（no-import-type-side-effects） <span class="ls-cap ignore-header">🔧</span>

整条导入仅含类型时，约定改为顶层 `import type`，不使用内联 `type` 限定符。

::: bad

```ts
import { type User } from './types'
```
:::

::: good

```ts
import type { User } from './types'
```
:::

## 命名约定（naming-convention）

类、接口、类型别名、枚举等类型名称约定使用 PascalCase（不以小写开头）。

::: bad

```ts
class widget {}
```
:::

::: good

```ts
class Widget {}
```
:::

## 禁止显式 any（no-explicit-any） <span class="ls-cap ignore-header">🔧 💡</span>

约定避免显式 `any`。

::: bad

```ts
const value: any = fetchData()
```
:::

::: good

```ts
const value: unknown = fetchData()
```
:::

## 禁止空对象类型（no-empty-object-type） <span class="ls-cap ignore-header">💡</span>

约定避免意义不明的 `{}` 类型。

::: bad

```ts
type Props = {}
```
:::

::: good

```ts
type Props = Record<string, never>
```
:::

## 限制 @ts 注释（ban-ts-comment） <span class="ls-cap ignore-header">💡</span>

约定用带说明的 `@ts-expect-error` 取代裸 `@ts-ignore`。

::: bad

```ts
// @ts-ignore
const x = unsafe()
```
:::

::: good

```ts
// @ts-expect-error 第三方类型缺失，已确认运行时安全
const x = unsafe()
```
:::

## 禁止 require（no-require-imports）

约定使用 ESM `import` 取代 `require`。考虑到渐进迁移，**该规则为警告（warn）而非错误**，且不支持自动修复。

::: bad

```ts
const fs = require('node:fs')
```
:::

::: good

```ts
import fs from 'node:fs'
```
:::

## 禁止 namespace（no-namespace）

约定使用 ES 模块取代 TypeScript `namespace`。

::: bad

```ts
export namespace Utils {
  export const version = 1
}
```
:::

::: good

```ts
export const version = 1
```
:::
