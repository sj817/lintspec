# 基线层

规则全部为 ESLint 内置规则（不依赖任何插件），覆盖代码安全与潜在错误，**随任意配置默认启用**。

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## 严格相等（eqeqeq） <span class="ls-cap ignore-header">🔧 💡</span>

约定使用 `===` / `!==`，避免隐式类型转换带来的意外。

::: bad

```js
const valid = a == 1
```
:::

::: good

```js
const valid = a === 1
```
:::

## 禁用 var（no-var） <span class="ls-cap ignore-header">🔧</span>

约定用 `const` / `let` 取代 `var`。

::: bad

```js
var count = 0
```
:::

::: good

```js
let count = 0
```
:::

## 优先 const（prefer-const） <span class="ls-cap ignore-header">🔧</span>

从未重新赋值的变量约定使用 `const`。

::: bad

```js
let name = 'lintspec'
```
:::

::: good

```js
const name = 'lintspec'
```
:::

## 对象简写（object-shorthand） <span class="ls-cap ignore-header">🔧</span>

约定使用对象属性与方法简写。

::: bad

```js
const user = { id: id, getName: function () {} }
```
:::

::: good

```js
const user = { id, getName() {} }
```
:::

## 禁止多余的三元（no-unneeded-ternary） <span class="ls-cap ignore-header">🔧</span>

约定去掉多余的布尔三元，默认用取反形式（`!!` / `!`，与 `eslint --fix` 产物一致）。

::: bad

```js
const exists = items.find(item => item.active) ? true : false
const missing = items.find(item => item.active) ? false : true
```
:::

::: good

```js
const exists = !!items.find(item => item.active)
const missing = !items.find(item => item.active)
```
:::

> `Boolean(...)` 同样合法，若更看重可读性可改用它。

## 禁止抛出字面量（no-throw-literal）

约定只抛出 `Error` 对象，不抛出字面量。

::: bad

```js
throw 'something went wrong'
```
:::

::: good

```js
throw new Error('something went wrong')
```
:::

## 禁止 Yoda 条件（yoda） <span class="ls-cap ignore-header">🔧</span>

约定条件表达式变量在前。

::: bad

```js
if (1 === status) {
  retry()
}
```
:::

::: good

```js
if (status === 1) {
  retry()
}
```
:::

## 禁止无意义的重命名（no-useless-rename） <span class="ls-cap ignore-header">🔧</span>

约定不要把解构 / 导入 / 导出重命名为同名。

::: bad

```js
const { id: id } = user
```
:::

::: good

```js
const { id } = user
```
:::

## 优先 Object.hasOwn（prefer-object-has-own） <span class="ls-cap ignore-header">🔧</span>

约定使用 `Object.hasOwn`。

::: bad

```js
const has = Object.prototype.hasOwnProperty.call(object, key)
```
:::

::: good

```js
const has = Object.hasOwn(object, key)
```
:::

## 禁止未使用变量（no-unused-vars） <span class="ls-cap ignore-header">💡</span>

约定不保留未使用的变量（以 `_` 开头的参数除外）。

::: bad

```js
function handle(used, extra) {
  return used
}
```
:::

::: good

```js
function handle(used, _extra) {
  return used
}
```
:::

## 文件最大行数（max-lines）

约定单个文件不宜过长，过长往往意味着职责过多、应当拆分。由 `maxLines` 选项控制上限（默认 **300** 行，统计时跳过空行与注释），超出仅 `warn` 提示、不阻断。

::: bad

```js
// utils.js —— 把所有工具函数塞进一个文件（420 行）
export function a() {}
export function b() {}
// …此处省略 400+ 行
```

:::

::: good

```js
// 按职责拆成多个小文件
import { a } from './utils/a'
import { b } from './utils/b'
```

:::

通过 `maxLines` 选项调整上限或关闭（详见 [配置项总览](../guide/options)）：

```js
// eslint.config.js
export default lintspec({
  maxLines: 500, // 放宽到 500 行
  // maxLines: false, // 或彻底关闭
})
```

::: tip
基线层还包含大量安全相关规则（`no-eval`、`no-self-compare`、`no-unsafe-*`、`use-isnan` 等），完整列表见 [全部规则](../reference/rules) 或 [配置源码](https://github.com/sj817/lintspec/blob/main/packages/eslint-config/src/rules/base.ts)。
:::
