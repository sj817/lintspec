import type { Linter } from 'eslint'

import { browserGlobals, commonIgnores, nodeGlobals } from './globals'
import { GLOB_JS, GLOB_JS_TS, GLOB_TS } from './globs'
import { importPreset } from './presets/import'
import { type PerfectionistSort, perfectionistPreset } from './presets/perfectionist'
import { prettierPreset } from './presets/prettier'
import { reactPreset } from './presets/react'
import { typescriptPreset } from './presets/typescript'
import { unicornPreset } from './presets/unicorn'
import { vuePreset } from './presets/vue'
import { baseRules } from './rules/base'

/** TypeScript 规则层的细粒度配置。 */
export interface TypeScriptOptions {
  /**
   * 是否启用需要类型信息的规则（依赖 tsconfig，速度较慢）。
   * @default false
   */
  typeAware?: boolean
}

/** unicorn 规则层的细粒度配置。 */
export interface UnicornOptions {
  /**
   * 是否启用默认关闭的 6 条激进规则（filename-case、prevent-abbreviations 等）。
   * @default false
   */
  strict?: boolean
}

/** import-x 规则层的细粒度配置。 */
export interface ImportXOptions {
  /**
   * 是否强制相对导入省略 `.ts`/`.js` 等后缀。
   * @default true
   */
  extensions?: boolean
}

/** perfectionist 规则层的细粒度配置。 */
export interface PerfectionistOptions {
  /**
   * 排序方式：`line-length`（行长短→长）或 `natural`（自然顺序）。
   * @default 'line-length'
   */
  sort?: PerfectionistSort
}

/** 工厂函数的配置项。 */
export interface LintspecOptions {
  /**
   * 启用 Node.js 全局变量（`process`、`Buffer`、`__dirname` 等）。
   * @default false
   */
  node?: boolean
  /**
   * 启用浏览器全局变量（`window`、`document`、`fetch` 等）。
   * @default false
   */
  browser?: boolean
  /**
   * 启用 eslint-plugin-unicorn 现代化增强层。传入对象可开启 `strict`。
   * @default true
   */
  unicorn?: boolean | UnicornOptions
  /**
   * 启用 TypeScript 规则层。传入对象可进一步开启类型感知规则。
   * @default false
   */
  typescript?: boolean | TypeScriptOptions
  /**
   * 启用 eslint-plugin-import-x 导入管理层。传入对象可关闭无后缀强制。
   * @default false
   */
  importX?: boolean | ImportXOptions
  /**
   * 启用 eslint-plugin-perfectionist 排序层。传入对象可切换排序方式。
   * @default false
   */
  perfectionist?: boolean | PerfectionistOptions
  /**
   * 启用 React 规则层（基于 @eslint-react 与 react-hooks）。
   * @default false
   */
  react?: boolean
  /**
   * 启用 Vue 规则层。
   * @default false
   */
  vue?: boolean
  /**
   * 限制单个文件的最大行数（`max-lines`，统计时跳过空行与注释）。
   * 传入数字设定上限，传入 `false` 关闭该限制。
   * @default 300
   */
  maxLines?: number | false
  /**
   * 基线层适用的文件匹配模式。
   * @default ['**\/*.{js,mjs,cjs,jsx}']
   */
  files?: string[]
  /**
   * 追加到内置忽略项之后的额外忽略模式。
   * @default []
   */
  ignores?: string[]
  /**
   * 叠加在所有层之上的规则覆盖，优先级最高。
   * @default {}
   */
  overrides?: Linter.RulesRecord
}

/**
 * 构建 lintspec 扁平配置。
 *
 * 各规则层均为可选开关，按固定顺序组合；Prettier 协调层始终置于末尾，
 * 用户 `overrides` 拥有最高优先级。
 *
 * @example
 * ```js
 * import lintspec from '@qwqo/eslint-config'
 *
 * export default lintspec({ node: true, typescript: true })
 * ```
 */
export default function lintspec(options: LintspecOptions = {}): Linter.Config[] {
  const {
    node = false,
    browser = false,
    unicorn = true,
    typescript = false,
    importX = false,
    perfectionist = false,
    react = false,
    vue = false,
    maxLines = 300,
    files = GLOB_JS,
    ignores = [],
    overrides = {},
  } = options

  // 文件行数上限规则：跳过空行与注释，默认 300，传 false 关闭。
  const maxLinesRule: Linter.RulesRecord =
    maxLines === false
      ? {}
      : { 'max-lines': ['warn', { max: maxLines, skipBlankLines: true, skipComments: true }] }

  const typescriptEnabled = typescript !== false
  const typeAware = typeof typescript === 'object' && typescript.typeAware === true

  const unicornEnabled = unicorn !== false
  const unicornStrict = typeof unicorn === 'object' && unicorn.strict === true

  const importXEnabled = importX !== false
  const importExtensions = typeof importX === 'object' ? importX.extensions !== false : true

  const perfectionistEnabled = perfectionist !== false
  const perfectionistSort: PerfectionistSort =
    typeof perfectionist === 'object' && perfectionist.sort === 'natural'
      ? 'natural'
      : 'line-length'

  // 基线层及通用增强层的适用范围：启用 TypeScript 时扩展到 .ts 文件。
  const baseFiles = typescriptEnabled ? [...files, ...GLOB_TS] : files
  const lintFiles = typescriptEnabled ? GLOB_JS_TS : files

  const globals: Linter.Globals = {
    ...(browser ? browserGlobals : {}),
    ...(node ? nodeGlobals : {}),
  }

  const config: Linter.Config[] = [
    {
      name: 'qwqo/ignores',
      ignores: [...commonIgnores, ...ignores],
    },
    {
      name: 'qwqo/base',
      files: baseFiles,
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
        reportUnusedInlineConfigs: 'error',
      },
      rules: { ...baseRules, ...maxLinesRule },
    },
  ]

  if (typescriptEnabled) {
    config.push(...typescriptPreset(typeAware))
  }

  if (importXEnabled) {
    config.push(...importPreset(typescriptEnabled, importExtensions))
  }

  if (perfectionistEnabled) {
    config.push(...perfectionistPreset(perfectionistSort))
  }

  if (react) {
    config.push(...reactPreset())
  }

  if (vue) {
    config.push(...vuePreset(typescriptEnabled))
  }

  if (unicornEnabled) {
    config.push(...unicornPreset(lintFiles, unicornStrict))
  }

  // Prettier 协调层：关闭格式化类规则，必须位于所有规则层之后。
  config.push(prettierPreset)

  if (Object.keys(overrides).length > 0) {
    config.push({
      name: 'qwqo/overrides',
      files: baseFiles,
      rules: overrides,
    })
  }

  return config
}

export type { Linter } from 'eslint'
