# React

基于 flat config 原生的 [@eslint-react](https://eslint-react.xyz/)（兼容 ESLint 10），并补充 `react-hooks` 的 `exhaustive-deps` 依赖检查规则。作用于 `.jsx` / `.tsx` 文件。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ react: true })
```

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## Hook 依赖完整（react-hooks/exhaustive-deps） <span class="ls-cap ignore-header">🔧 💡</span>

约定 `useEffect` 等 Hook 的依赖数组保持完整。

::: bad

```jsx
useEffect(() => {
  console.log(value)
}, [])
```
:::

::: good

```jsx
useEffect(() => {
  console.log(value)
}, [value])
```
:::

## 列表须有 key（no-missing-key）

列表渲染约定提供 `key`。

::: bad

```jsx
items.map(item => <li>{item.label}</li>)
```
:::

::: good

```jsx
items.map(item => <li key={item.id}>{item.label}</li>)
```
:::

## 禁止用数组下标作 key（no-array-index-key）

约定不用数组下标作为 `key`。

::: bad

```jsx
items.map((item, index) => <li key={index}>{item.label}</li>)
```
:::

::: good

```jsx
items.map(item => <li key={item.id}>{item.label}</li>)
```
:::

## 禁止嵌套定义组件（no-nested-component-definitions）

约定不要在组件内部定义组件（每次渲染都会重建，破坏状态）。

::: bad

```jsx
export function Page() {
  function Item() {
    return <span />
  }
  return <Item />
}
```
:::

::: good

```jsx
function Item() {
  return <span />
}

export function Page() {
  return <Item />
}
```
:::

## 禁止 children 作属性（jsx-no-children-prop）

约定通过子节点传递 children，而非 `children` 属性。

::: bad

```jsx
<List children={items} />
```
:::

::: good

```jsx
<List>{items}</List>
```
:::

::: tip
React 层共启用 60+ 条规则，完整列表见 [全部规则](../reference/rules)。
:::
