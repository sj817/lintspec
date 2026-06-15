# perfectionist

基于 [eslint-plugin-perfectionist](https://perfectionist.dev/) 的排序层。对象、类型等按自然顺序排序；import 单独配置分组与行长排序。全部支持自动修复。

```js
import lintspec from '@qwqo/eslint-config'

export default lintspec({ perfectionist: true })
```

> 标记说明：🔧 可通过 `eslint --fix` 自动修复 · 💡 在编辑器中提供修复建议。

## 导入排序（sort-imports） <span class="ls-cap ignore-header">🔧</span>

import 约定按以下**分组顺序**排列，组与组之间空一行；**组内按行长短→长**排序。

1. Node 内置模块（`node:*`）
2. npm 包
3. 内部源码（相对路径、别名）
4. 类型导入（`import type`）

::: bad

```ts
import type { Linter } from 'eslint'
import xyz from 'some-long-package'
import { readFile } from 'node:fs'
import a from 'aa'
import { local } from './local'
```
:::

::: good

```ts
import { readFile } from 'node:fs'

import a from 'aa'
import xyz from 'some-long-package'

import { local } from './local'

import type { Linter } from 'eslint'
```
:::

如更习惯自然（字母）顺序，可切换：

```js
export default lintspec({ perfectionist: { sort: 'natural' } })
```

## 具名导入排序（sort-named-imports） <span class="ls-cap ignore-header">🔧</span>

具名导入内部约定排序。

::: bad

```js
import { bbb, a } from 'mod'
```
:::

::: good

```js
import { a, bbb } from 'mod'
```
:::

## 对象键排序（sort-objects） <span class="ls-cap ignore-header">🔧</span>

对象字面量的键约定按自然顺序排列。

::: bad

```js
const config = { zebra: 1, apple: 2 }
```
:::

::: good

```js
const config = { apple: 2, zebra: 1 }
```
:::

::: tip
排序类规则较为主观，但全部支持自动修复。若某处需要保留特定顺序，可在该行使用 `// eslint-disable-next-line perfectionist/sort-objects`。
:::
