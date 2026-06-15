import type { Linter } from 'eslint'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

import { GLOB_VUE } from '../globs'

/**
 * Vue 规则层：基于 eslint-plugin-vue 的扁平推荐配置。
 *
 * @param typescript - 是否在 `.vue` 单文件组件中启用 TypeScript 解析
 */
export function vuePreset(typescript: boolean): Linter.Config[] {
  const configs = [...(vue.configs['flat/recommended'] as Linter.Config[])]

  if (typescript) {
    configs.push({
      name: 'qwqo/vue/typescript',
      files: GLOB_VUE,
      languageOptions: {
        parserOptions: {
          parser: tseslint.parser,
          tsconfigRootDir: process.cwd(),
        },
      },
    })
  }

  return configs
}
