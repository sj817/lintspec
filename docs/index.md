---
layout: home

hero:
  name: Lintspec
  text: 一个函数搞定 ESLint 与 Prettier
  tagline: 工厂式分层配置，TypeScript / React / Vue 开箱即用，每条规则都有真实示例。
  image:
    src: /logo.svg
    alt: Lintspec logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 规则示例
      link: /layers/base
    - theme: alt
      text: GitHub
      link: https://github.com/sj817/lintspec

features:
  - icon: { src: /icons/zap.svg, width: 26, height: 26 }
    title: 工厂函数
    details: 一个 lintspec() 函数加几个开关即可组合配置，告别复制粘贴上百行规则。
  - icon: { src: /icons/layers.svg, width: 26, height: 26 }
    title: 分层可选
    details: 基线、TypeScript、import-x、perfectionist、React、Vue、unicorn 各自独立，按需开启。
  - icon: { src: /icons/check.svg, width: 26, height: 26 }
    title: 真实示例
    details: 每条规则都配「不推荐 / 推荐」对照代码，并标注是否支持自动修复与编辑建议。
  - icon: { src: /icons/sparkles.svg, width: 26, height: 26 }
    title: 与 Prettier 协调
    details: 内置 eslint-config-prettier 协调层，ESLint 管质量、Prettier 管格式，永不打架。
  - icon: { src: /icons/list.svg, width: 26, height: 26 }
    title: 487 条规则
    details: 精心挑选并归类的规则集，附带完整的「全部规则」参考表与配置方式。
  - icon: { src: /icons/code.svg, width: 26, height: 26 }
    title: TypeScript 源码
    details: 全量 TypeScript 编写，tsdown 构建，提供完整类型声明与编辑器补全。
---

<div class="ls-stats">
  <div class="ls-stat"><div class="num">487</div><div class="label">条精选规则</div></div>
  <div class="ls-stat"><div class="num">7</div><div class="label">个规则层</div></div>
  <div class="ls-stat"><div class="num">100%</div><div class="label">真实示例</div></div>
  <div class="ls-stat"><div class="num">TS</div><div class="label">源码 + 类型</div></div>
</div>

## 快速预览

```js
// eslint.config.js
import lintspec from '@qwqo/eslint-config'

export default lintspec({
  node: true,
  typescript: true,
  importX: true,
  perfectionist: true,
})
```

```js
// prettier.config.js
export { default } from '@qwqo/prettier-config'
```

每个开关都支持「布尔」或「子选项对象」两种写法，外加 `overrides` 万能覆盖 —— 详见 [配置项总览](./guide/options)。
