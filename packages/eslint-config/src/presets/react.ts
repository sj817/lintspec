import type { ESLint, Linter } from 'eslint'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'

import { GLOB_JSX_TSX } from '../globs'

/**
 * React 规则层：以 flat config 原生的 @eslint-react 推荐配置为主（兼容 ESLint 10），
 * 并补充 react-hooks 独有的 `exhaustive-deps` 依赖检查规则。
 */
export function reactPreset(): Linter.Config[] {
  const recommended = eslintReact.configs.recommended as unknown as Linter.Config

  return [
    {
      ...recommended,
      name: 'qwqo/react',
      files: GLOB_JSX_TSX,
    },
    {
      name: 'qwqo/react/hooks',
      files: GLOB_JSX_TSX,
      plugins: {
        'react-hooks': reactHooks as unknown as ESLint.Plugin,
      },
      rules: {
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ]
}
