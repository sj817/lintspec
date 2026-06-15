import type { Linter } from 'eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

/** unicorn 推荐集中过于激进、默认关闭的规则。开启 `strict` 后这些规则会被启用。 */
const unicornOverrides: Linter.RulesRecord = {
  'unicorn/filename-case': 'off',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/no-null': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/no-nested-ternary': 'off',
  'unicorn/prefer-top-level-await': 'off',
}

/**
 * unicorn 现代化增强层：基于 unicorn 推荐配置（已覆盖 178/182 条规则）。
 *
 * @param files - 该层适用的文件匹配模式
 * @param strict - 是否启用默认关闭的 6 条激进规则
 */
export function unicornPreset(files: string[], strict: boolean): Linter.Config[] {
  const recommended = eslintPluginUnicorn.configs.recommended as Linter.Config

  const configs: Linter.Config[] = [
    {
      ...recommended,
      name: 'qwqo/unicorn',
      files,
    },
  ]

  if (!strict) {
    configs.push({
      name: 'qwqo/unicorn/overrides',
      files,
      rules: unicornOverrides,
    })
  }

  return configs
}
