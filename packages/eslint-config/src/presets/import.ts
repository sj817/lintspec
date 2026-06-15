import type { Linter } from 'eslint'
import importX from 'eslint-plugin-import-x'

import { GLOB_JS_TS, GLOB_TS } from '../globs'

/**
 * 导入管理层：基于 eslint-plugin-import-x，校验未解析、重复等导入问题。
 *
 * @param typescript - 是否追加 TypeScript 解析器设置，使其能解析 `.ts` 导入
 * @param extensions - 是否强制相对导入省略 `.ts`/`.js` 等后缀
 */
export function importPreset(typescript: boolean, extensions: boolean): Linter.Config[] {
  const configs: Linter.Config[] = [
    {
      ...(importX.flatConfigs.recommended as Linter.Config),
      name: 'qwqo/import',
      files: GLOB_JS_TS,
    },
  ]

  if (typescript) {
    configs.push({
      ...(importX.flatConfigs.typescript as Linter.Config),
      name: 'qwqo/import/typescript',
      files: GLOB_TS,
    })
  }

  if (extensions) {
    // 相对导入一律省略后缀（bundler / tsc moduleResolution bundler 风格），npm 包不受影响。
    configs.push({
      name: 'qwqo/import/extensions',
      files: GLOB_JS_TS,
      rules: {
        'import-x/extensions': [
          'error',
          'ignorePackages',
          { ts: 'never', tsx: 'never', js: 'never', jsx: 'never', mjs: 'never', cjs: 'never' },
        ],
      },
    })
  }

  return configs
}
