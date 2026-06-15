// 一次性生成脚本：从解析后的配置中提取每一层的全部规则，输出到 docs/reference/rules.md。
// 用法：node gen-rule-reference.mjs
import { readFileSync, writeFileSync } from 'node:fs'

import eslintReact from '@eslint-react/eslint-plugin'
import { builtinRules } from 'eslint/use-at-your-own-risk'
import importX from 'eslint-plugin-import-x'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import unicorn from 'eslint-plugin-unicorn'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

import lintspec from './dist/index.mjs'

const config = lintspec({
  node: true,
  browser: true,
  typescript: true,
  importX: true,
  perfectionist: true,
  react: true,
  vue: true,
})

// 根据规则名前缀，从对应插件取出 meta。
const metaFor = rule => {
  if (rule.startsWith('unicorn/')) return unicorn.rules[rule.slice(8)]?.meta
  if (rule.startsWith('@typescript-eslint/')) return tseslint.plugin.rules[rule.slice(19)]?.meta
  if (rule.startsWith('import-x/')) return importX.rules[rule.slice(9)]?.meta
  if (rule.startsWith('perfectionist/')) return perfectionist.rules[rule.slice(14)]?.meta
  if (rule.startsWith('vue/')) return vue.rules[rule.slice(4)]?.meta
  if (rule.startsWith('react-hooks/')) return reactHooks.rules[rule.slice(12)]?.meta
  if (rule.startsWith('@eslint-react/')) {
    return eslintReact.rules[rule.slice(14)]?.meta ?? eslintReact.rules[rule]?.meta
  }
  if (!rule.includes('/')) return builtinRules.get(rule)?.meta
  return
}

const capabilities = rule => {
  const meta = metaFor(rule)
  return { fix: meta?.fixable ? '✅' : '—', suggest: meta?.hasSuggestions ? '✅' : '—' }
}

// 级别渲染为彩色徽章（红=错误 / 黄=警告），配合 custom.css 上色。
const severityBadge = severity =>
  severity === 'warn'
    ? '<span class="ls-sev ls-sev-warn">警告</span>'
    : '<span class="ls-sev ls-sev-error">错误</span>'

// 中文名称翻译表；缺失时回退到插件的英文描述。
const ruleNames = JSON.parse(readFileSync(new URL('rule-names.json', import.meta.url), 'utf8'))
// 转义尖括号，避免 <Context> 等被 VitePress 当作 HTML 标签解析。
const escapeHtml = text => text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const nameOf = rule => escapeHtml(ruleNames[rule] ?? metaFor(rule)?.docs?.description ?? '—')

// 标出控制该规则的 lintspec() 选项。
const optionOf = (rule, layer) => {
  if (rule === 'max-lines') return '`maxLines`'
  if (layer === '基线层') return '`overrides`'
  if (rule === 'import-x/extensions') return '`importX.extensions`'
  if (rule === 'perfectionist/sort-imports') return '`perfectionist.sort`'
  const map = {
    unicorn: '`unicorn`',
    TypeScript: '`typescript`',
    'import-x': '`importX`',
    perfectionist: '`perfectionist`',
    React: '`react`',
    Vue: '`vue`',
  }
  return map[layer] ?? '`overrides`'
}

// 按配置块名称归类到各规则层。
const layerOf = name => {
  if (!name) return null
  if (name === 'qwqo/base') return '基线层'
  if (name.startsWith('qwqo/unicorn')) return 'unicorn'
  if (name.startsWith('typescript-eslint') || name.startsWith('qwqo/typescript')) {
    return 'TypeScript'
  }
  if (name.startsWith('qwqo/import')) return 'import-x'
  if (name.startsWith('qwqo/perfectionist')) return 'perfectionist'
  if (name.startsWith('qwqo/react')) return 'React'
  if (name.startsWith('vue/') || name.startsWith('qwqo/vue')) return 'Vue'
  return null
}

const order = ['基线层', 'unicorn', 'TypeScript', 'import-x', 'perfectionist', 'React', 'Vue']
const layers = new Map(order.map(name => [name, new Map()]))

const severityOf = value => {
  const level = Array.isArray(value) ? value[0] : value
  if (level === 'error' || level === 2) return 'error'
  if (level === 'warn' || level === 1) return 'warn'
  return 'off'
}

for (const block of config) {
  const layer = layerOf(block.name)
  if (!layer || !block.rules) continue
  const bucket = layers.get(layer)
  for (const [rule, value] of Object.entries(block.rules)) {
    const severity = severityOf(value)
    if (severity === 'off') {
      bucket.delete(rule)
    } else {
      bucket.set(rule, severity)
    }
  }
}

let md = `# 全部规则

本页由配置自动生成，列出每一层启用的全部规则。具体规则的 ❌/✅ 示例见各[规则层](../layers/base)页面。

- **配置方式**：控制该规则的 \`lintspec()\` 选项；基线层规则只能通过 \`overrides\` 调整。
- **修复 / 建议**：✅ 修复 = 可通过 \`eslint --fix\` 自动修复；✅ 建议 = 在编辑器中提供修复建议。
- **级别**：<span class="ls-sev ls-sev-error">错误</span> 报错并阻断；<span class="ls-sev ls-sev-warn">警告</span> 仅提示。
`

for (const layer of order) {
  const rules = [...layers.get(layer).entries()].toSorted((a, b) => a[0].localeCompare(b[0]))
  if (rules.length === 0) continue
  md += `\n## ${layer}（${rules.length}）\n\n| 规则名称 | 规则 | 配置方式 | 级别 | 修复 | 建议 |\n| --- | --- | --- | --- | --- | --- |\n`
  for (const [rule, severity] of rules) {
    const { fix, suggest } = capabilities(rule)
    md += `| ${nameOf(rule)} | \`${rule}\` | ${optionOf(rule, layer)} | ${severityBadge(severity)} | ${fix} | ${suggest} |\n`
  }
}

writeFileSync(new URL('../../docs/reference/rules.md', import.meta.url), md)
console.log('written docs/reference/rules.md')
for (const layer of order) console.log(`${layer}: ${layers.get(layer).size} rules`)
