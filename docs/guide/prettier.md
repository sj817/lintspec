# Prettier 配置

`@qwqo/prettier-config` 导出一份 Prettier 配置对象，负责所有代码格式化。与 ESLint 不同，格式化是**自动**的 —— 保存或 `prettier --write` 即可，无需记忆。

## 使用

新建 `prettier.config.js`：

```js
export { default } from '@qwqo/prettier-config'
```

## 格式化示例

下列展示 lintspec 规范下的格式化效果（上为输入，下为 `prettier --write` 后的结果）。

### 单引号（singleQuote）

字符串统一使用单引号。

::: before

```js
const a = "abc"
```

:::

::: after

```js
const a = 'abc'
```

:::

### 不使用分号（semi: false）

省略语句末尾的分号。

::: before

```js
const a = 1;
```

:::

::: after

```js
const a = 1
```

:::

### 箭头函数省略括号（arrowParens: avoid）

单参数箭头函数省略括号。

::: before

```js
const fn = (x) => x + 1
```

:::

::: after

```js
const fn = x => x + 1
```

:::

### 尾逗号（trailingComma: all）

多行结构尽可能补上尾逗号。

::: before

```js
const obj = {
  a: 1,
  b: 2
}
```

:::

::: after

```js
const obj = {
  a: 1,
  b: 2,
}
```

:::

### 对象属性引号（quoteProps: as-needed）

仅在语法需要时才为对象属性加引号。

::: before

```js
const obj = { 'a': 1, 'b-c': 2 }
```

:::

::: after

```js
const obj = { a: 1, 'b-c': 2 }
```

:::

### 花括号内侧空格（bracketSpacing: true）

对象字面量花括号内侧保留一个空格。

::: before

```js
const obj = {a: 1}
```

:::

::: after

```js
const obj = { a: 1 }
```

:::

### JSX 使用双引号（jsxSingleQuote: false）

JSX 属性使用双引号，与普通字符串的单引号区分开。

::: before

```jsx
const el = <input type='text' />
```

:::

::: after

```jsx
const el = <input type="text" />
```

:::

### 保留对象换行（objectWrap: preserve）

对象首属性前若有换行，则保持多行；否则尽量收成一行。

::: before

```js
const a = {
  x: 1, y: 2 }
```

:::

::: after

```js
const a = {
  x: 1,
  y: 2,
}
```

:::

### 关键字与括号间距

`if` / `for` 等关键字、括号、花括号之间的空格由 Prettier 统一处理。

::: before

```js
if(a===b){
  return a
}
```

:::

::: after

```js
if (a === b) {
  return a
}
```

:::

## 为什么选项这么少？

这不是漏了 —— **Prettier 刻意只提供极少的选项**。它的设计哲学是「一种风格、减少争论」，官方甚至明确表示会克制添加新选项。因此可用于配置文件的选项总共也就 20 个左右，下表已**全部覆盖**。其余像 `parser`、`filepath`、`rangeStart`、`rangeEnd`、`requirePragma`、`insertPragma` 等仅用于命令行 / API 调用，不适合写进共享配置。

> 参考：Prettier 官方 [Options](https://prettier.io/docs/options) 与 [Option Philosophy](https://prettier.io/docs/option-philosophy)。

## 完整配置

`@qwqo/prettier-config` 显式声明了全部 18 个稳定选项，避免依赖不同 Prettier 版本的默认值。

| 选项                          | 值           | 说明                                            |
| ----------------------------- | ------------ | ----------------------------------------------- |
| `printWidth`                  | `100`        | 每行最大宽度                                    |
| `tabWidth`                    | `2`          | 缩进空格数                                      |
| `useTabs`                     | `false`      | 使用空格而非 Tab 缩进                           |
| `semi`                        | `false`      | 不使用分号                                      |
| `singleQuote`                 | `true`       | 字符串使用单引号                                |
| `quoteProps`                  | `'as-needed'`| 仅在必要时为对象属性加引号                      |
| `jsxSingleQuote`              | `false`      | JSX 属性使用双引号                              |
| `trailingComma`               | `'all'`      | 尽可能添加尾逗号                                |
| `bracketSpacing`              | `true`       | 对象花括号内侧保留空格                          |
| `objectWrap`                  | `'preserve'` | 依据原始换行决定对象是否多行                    |
| `bracketSameLine`             | `false`      | 多行标签的 `>` 另起一行                         |
| `arrowParens`                 | `'avoid'`    | 单参数箭头函数省略括号                          |
| `proseWrap`                   | `'preserve'` | 保持 Markdown 文本原有换行                      |
| `htmlWhitespaceSensitivity`   | `'css'`      | 按 CSS `display` 处理 HTML 空白敏感性           |
| `vueIndentScriptAndStyle`     | `false`      | 不额外缩进 Vue 的 `<script>` / `<style>`        |
| `endOfLine`                   | `'lf'`       | 换行符使用 LF                                   |
| `embeddedLanguageFormatting`  | `'auto'`     | 自动格式化内嵌代码（如模板字符串中的 HTML）     |
| `singleAttributePerLine`      | `false`      | 不强制每个属性单独成行                          |

## 实验性选项

Prettier 另有 2 个**实验性**选项。它们可能在未来版本调整或移除，因此本配置**默认未启用**（保持经典排版）。如需尝试，可在本地配置中自行开启。

| 选项                            | 默认值    | 说明                                                  |
| ------------------------------- | --------- | ----------------------------------------------------- |
| `experimentalTernaries`         | `false`   | 新的三元排版（问号置于条件之后，嵌套三元更易读）      |
| `experimentalOperatorPosition`  | `'end'`   | 控制二元运算符换行时的位置（`'start'` 或 `'end'`）    |

```js
import config from '@qwqo/prettier-config'

export default {
  ...config,
  experimentalTernaries: true, // 自行开启实验特性
}
```

## 自定义

如需覆盖个别选项，在本地配置中展开后修改：

```js
import config from '@qwqo/prettier-config'

export default {
  ...config,
  printWidth: 120,
}
```
