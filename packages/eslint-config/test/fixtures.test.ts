import { ESLint, type Linter } from 'eslint'
import { describe, expect, it } from 'vitest'

import lintspec, { type LintspecOptions } from '../src/index'

/** 用指定配置对内联代码执行 lint，返回触发的规则 ID 列表。 */
async function lint(options: LintspecOptions, filePath: string, code: string): Promise<string[]> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: lintspec(options) as Linter.Config[],
  })
  const [result] = await eslint.lintText(code, { filePath })
  return result.messages.map(message => message.ruleId ?? `fatal:${message.message}`)
}

describe('规则层运行时校验', () => {
  it('基线层捕获核心问题', async () => {
    const ids = await lint({}, 'sample.js', 'var x = 1\n')
    expect(ids).toContain('no-var')
  })

  it('TypeScript 层捕获 any', async () => {
    const ids = await lint({ typescript: true }, 'sample.ts', 'export const value: any = 1\n')
    expect(ids).toContain('@typescript-eslint/no-explicit-any')
  })

  it('import 层捕获重复导入', async () => {
    const ids = await lint(
      { importX: true },
      'sample.js',
      'import a from "./mod.js"\nimport b from "./mod.js"\nexport { a, b }\n',
    )
    expect(ids).toContain('import-x/no-duplicates')
  })

  it('perfectionist 层按行长排序导入', async () => {
    const ids = await lint(
      { perfectionist: true },
      'sample.js',
      'import longer from "longer-package"\nimport a from "a"\nexport { a, longer }\n',
    )
    expect(ids).toContain('perfectionist/sort-imports')
  })

  it('react 层捕获缺失的 Hook 依赖', async () => {
    const ids = await lint(
      { react: true, browser: true },
      'Sample.jsx',
      'import { useEffect } from "react"\nexport function Sample({ value }) {\n  useEffect(() => {\n    console.log(value)\n  }, [])\n  return null\n}\n',
    )
    expect(ids).toContain('react-hooks/exhaustive-deps')
  })

  it('vue 层加载并校验单文件组件', async () => {
    const ids = await lint({ vue: true }, 'sample.vue', '<template><div></div></template>\n')
    expect(ids).toContain('vue/multi-word-component-names')
  })
})

describe('新增规则校验', () => {
  it('类型导入要求顶层 import type', async () => {
    const ids = await lint(
      { typescript: true },
      'sample.ts',
      'import { A } from "./m"\nexport const x: A = 1\n',
    )
    expect(ids).toContain('@typescript-eslint/consistent-type-imports')
  })

  it('禁止内联 import { type X }', async () => {
    const ids = await lint(
      { typescript: true },
      'sample.ts',
      'import { type A } from "./m"\nexport const x: A = 1\n',
    )
    expect(ids).toContain('@typescript-eslint/no-import-type-side-effects')
  })

  it('类名要求 PascalCase', async () => {
    const ids = await lint({ typescript: true }, 'sample.ts', 'export class widget {}\n')
    expect(ids).toContain('@typescript-eslint/naming-convention')
  })

  it('简化多余三元', async () => {
    const ids = await lint({}, 'sample.js', 'export const f = a => (a ? true : false)\n')
    expect(ids).toContain('no-unneeded-ternary')
  })

  it('import 强制省略后缀，可关闭', async () => {
    const code = 'import { a } from "./m.ts"\nexport const x = a\n'
    expect(await lint({ importX: true, typescript: true }, 'sample.ts', code)).toContain(
      'import-x/extensions',
    )
    expect(
      await lint({ importX: { extensions: false }, typescript: true }, 'sample.ts', code),
    ).not.toContain('import-x/extensions')
  })

  it('maxLines 限制文件行数，可关闭', async () => {
    const longFile = `${Array.from({ length: 12 }, (_, i) => `export const v${i} = ${i}`).join('\n')}\n`
    expect(await lint({ maxLines: 5 }, 'sample.js', longFile)).toContain('max-lines')
    expect(await lint({ maxLines: false }, 'sample.js', longFile)).not.toContain('max-lines')
  })

  it('require 仅为警告而非错误', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: lintspec({ typescript: true }) as Linter.Config[],
    })
    const [result] = await eslint.lintText('const a = require("node:fs")\nexport { a }\n', {
      filePath: 'sample.ts',
    })
    const message = result.messages.find(m => m.ruleId === '@typescript-eslint/no-require-imports')
    expect(message?.severity).toBe(1)
  })
})
