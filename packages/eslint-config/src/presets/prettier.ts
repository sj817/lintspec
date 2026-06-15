import type { Linter } from 'eslint'
import prettierConfig from 'eslint-config-prettier/flat'

/**
 * Prettier 协调层：关闭所有与 Prettier 冲突的格式化类规则，确保由 Prettier 统一负责格式化。
 * 该层仅关闭规则，因此始终安全地置于配置末尾。
 */
export const prettierPreset: Linter.Config = {
  ...(prettierConfig as Linter.Config),
  name: 'qwqo/prettier',
}
