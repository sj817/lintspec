# unicorn

基于 [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) 推荐集的现代化增强层，**默认开启**，已覆盖 178/182 条规则。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ unicorn: true })
```

默认关闭 6 条较激进的规则（`filename-case`、`prevent-abbreviations`、`no-null`、`no-array-reduce`、`no-nested-ternary`、`prefer-top-level-await`）。如需启用：

```js
export default lintspec({ unicorn: { strict: true } })
```

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## 优先 node: 协议（prefer-node-protocol） <span class="ls-cap ignore-header">🔧</span>

约定导入 Node 内置模块时使用 `node:` 协议。

::: bad

```js
import { readFile } from 'fs'
```
:::

::: good

```js
import { readFile } from 'node:fs'
```
:::

## 创建错误须用 new（throw-new-error） <span class="ls-cap ignore-header">🔧</span>

约定抛出错误时使用 `new`。

::: bad

```js
throw Error('boom')
```
:::

::: good

```js
throw new Error('boom')
```
:::

## 优先 Number 静态属性（prefer-number-properties） <span class="ls-cap ignore-header">🔧 💡</span>

约定使用 `Number` 上的方法取代全局函数。

::: bad

```js
const valid = isNaN(value)
```
:::

::: good

```js
const valid = Number.isNaN(value)
```
:::

## 优先 for…of 替代 forEach（no-array-for-each） <span class="ls-cap ignore-header">🔧 💡</span>

约定用 `for...of` 取代 `Array#forEach`（更易于配合 `await` / `break` / `continue`）。

::: bad

```js
items.forEach(item => handle(item))
```
:::

::: good

```js
for (const item of items) {
  handle(item)
}
```
:::

## 优先 some（prefer-array-some） <span class="ls-cap ignore-header">🔧 💡</span>

判断是否存在匹配项时约定使用 `Array#some`。

::: bad

```js
const exists = items.find(item => item.active) !== undefined
```
:::

::: good

```js
const exists = items.some(item => item.active)
```
:::

## 禁止 Promise 方法参数中 await（no-await-in-promise-methods） <span class="ls-cap ignore-header">💡</span>

约定不要在 `Promise.all` 等方法的参数里使用 `await`（会让并发退化为串行）。

::: bad

```js
const results = await Promise.all([await fetchA(), await fetchB()])
```
:::

::: good

```js
const results = await Promise.all([fetchA(), fetchB()])
```
:::

## 优先 Date.now()（prefer-date-now） <span class="ls-cap ignore-header">🔧</span>

获取时间戳时约定使用 `Date.now()`。

::: bad

```js
const time = new Date().getTime()
```
:::

::: good

```js
const time = Date.now()
```
:::

## 内置对象须用 new（new-for-builtins） <span class="ls-cap ignore-header">🔧 💡</span>

约定构造内置对象时使用 `new`。

::: bad

```js
const list = Array(1, 2, 3)
```
:::

::: good

```js
const list = new Array(1, 2, 3)
```
:::

## 优先 slice（prefer-string-slice） <span class="ls-cap ignore-header">🔧</span>

约定使用 `String#slice` 取代已废弃的 `substr` / `substring`。

::: bad

```js
const head = text.substr(0, 1)
```
:::

::: good

```js
const head = text.slice(0, 1)
```
:::

::: tip
unicorn 共启用 170+ 条规则，完整列表见 [全部规则](../reference/rules)。
:::
