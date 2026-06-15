# Prettier 协调层

内置 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)，**始终位于配置末尾**，关闭所有与 Prettier 冲突的格式化类规则，确保格式化统一由 Prettier 负责。

该层无需配置、无法关闭，是 lintspec「ESLint 管质量、Prettier 管格式」分工的保障。

## 工作原理

各规则层可能引入一些格式化相关规则（如引号、分号、缩进）。协调层在最后将这些规则统一关闭，避免 ESLint 与 Prettier 互相打架。

```js
// lintspec() 返回的配置（简化）
;[
  { name: 'qwqo/base' /* ... */ },
  { name: 'qwqo/unicorn' /* ... */ },
  // ...其余规则层
  { name: 'qwqo/prettier' }, // ← 始终最后，关闭格式化类规则
]
```

## 设计原则

lintspec **不引入** `@stylistic` 等格式化类 ESLint 规则。代码质量由 ESLint 负责，代码格式化完全交给 [Prettier](../guide/prettier)。
