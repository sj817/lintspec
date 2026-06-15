import type { Linter } from 'eslint'
import tseslint from 'typescript-eslint'

import { GLOB_TS } from '../globs'

/**
 * TypeScript 规则层：基于 typescript-eslint 推荐配置，仅作用于 TypeScript 文件。
 *
 * @param typeAware - 是否启用需要类型信息的规则（依赖 tsconfig，速度较慢）
 */
export function typescriptPreset(typeAware: boolean): Linter.Config[] {
  const recommended = (typeAware
    ? tseslint.configs.recommendedTypeChecked
    : tseslint.configs.recommended) as unknown as Linter.Config[]

  const configs: Linter.Config[] = recommended.map(config => ({
    ...config,
    files: GLOB_TS,
  }))

  // 显式指定 tsconfig 根目录，避免多包仓库中自动探测产生歧义；并叠加 lintspec 的 TypeScript 约定。
  configs.push({
    name: 'qwqo/typescript/overrides',
    files: GLOB_TS,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      // TypeScript 自身已做未定义检查，关闭 no-undef 以避免误报。
      'no-undef': 'off',
      // 类型导入统一为顶层 `import type {...}`，禁止内联 `import { type X }`。
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      // 整条导入仅含内联类型时，改为顶层 `import type`。
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // 类、接口、类型别名、枚举等类型名称统一使用 PascalCase（禁止小写开头）。
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
      // 使用 require 仅提示而非报错，便于渐进迁移到 ESM。
      '@typescript-eslint/no-require-imports': 'warn',
    },
  })

  if (typeAware) {
    configs.push({
      name: 'qwqo/typescript/type-aware',
      files: GLOB_TS,
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    })
  }

  return configs
}
