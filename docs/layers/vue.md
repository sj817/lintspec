# Vue

基于 [eslint-plugin-vue](https://eslint.vuejs.org/) 的扁平推荐配置，作用于 `.vue` 单文件组件。启用 `typescript` 时会在 `<script>` 中开启 TypeScript 解析。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ vue: true })
```

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## 组件名多词（multi-word-component-names）

组件名约定为多词，避免与 HTML 元素冲突。

::: bad

```vue
<!-- Todo.vue -->
<template>
  <div />
</template>
```
:::

::: good

```vue
<!-- TodoItem.vue -->
<template>
  <div />
</template>
```
:::

## v-for 须有 key（require-v-for-key）

`v-for` 约定配合 `key`。

::: bad

```vue
<template>
  <li v-for="item in items">{{ item.label }}</li>
</template>
```
:::

::: good

```vue
<template>
  <li v-for="item in items" :key="item.id">{{ item.label }}</li>
</template>
```
:::

## 禁止未使用组件（no-unused-components）

约定不注册未使用的组件。

::: bad

```vue
<script>
export default { components: { UnusedItem } }
</script>

<template>
  <div />
</template>
```
:::

::: good

```vue
<script>
export default { components: { TodoItem } }
</script>

<template>
  <TodoItem />
</template>
```
:::

## 禁止修改 props（no-mutating-props）

约定不直接修改 props，改用本地状态或向父组件 `emit` 事件。

::: bad

```vue
<script setup>
const props = defineProps(['value'])
props.value = 1
</script>
```
:::

::: good

```vue
<script setup>
const props = defineProps(['value'])
const emit = defineEmits(['update:value'])
emit('update:value', 1)
</script>
```
:::

## 禁用 v-html（防 XSS）（no-v-html）

约定避免 `v-html`（存在 XSS 风险）。

::: bad

```vue
<template>
  <div v-html="userContent" />
</template>
```
:::

::: good

```vue
<template>
  <div>{{ userContent }}</div>
</template>
```
:::

::: tip
Vue 层共启用 110+ 条规则，完整列表见 [全部规则](../reference/rules)。
:::
