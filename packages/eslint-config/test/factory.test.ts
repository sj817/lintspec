import { describe, expect, it } from 'vitest'

import lintspec from '../src/index'

/** 取出配置数组中所有具名的层名称。 */
function names(config: ReturnType<typeof lintspec>): string[] {
  return config.map(item => item.name).filter((name): name is string => typeof name === 'string')
}

describe('lintspec 工厂', () => {
  it('默认包含基线、unicorn 与 prettier 协调层', () => {
    const layers = names(lintspec())
    expect(layers).toContain('qwqo/base')
    expect(layers).toContain('qwqo/unicorn')
    expect(layers).toContain('qwqo/prettier')
  })

  it('prettier 协调层始终位于最后', () => {
    const config = lintspec({ typescript: true, importX: true, react: true })
    expect(config.at(-1)?.name).toBe('qwqo/prettier')
  })

  it('unicorn 可关闭', () => {
    expect(names(lintspec({ unicorn: false }))).not.toContain('qwqo/unicorn')
  })

  it('typescript 开关控制 TypeScript 层', () => {
    expect(names(lintspec())).not.toContain('qwqo/typescript/overrides')
    expect(names(lintspec({ typescript: true }))).toContain('qwqo/typescript/overrides')
  })

  it('typeAware 追加类型感知层', () => {
    expect(names(lintspec({ typescript: { typeAware: true } }))).toContain(
      'qwqo/typescript/type-aware',
    )
    expect(names(lintspec({ typescript: true }))).not.toContain('qwqo/typescript/type-aware')
  })

  it('各规则层均可独立开启', () => {
    expect(names(lintspec({ importX: true }))).toContain('qwqo/import')
    expect(names(lintspec({ perfectionist: true }))).toContain('qwqo/perfectionist')
    expect(names(lintspec({ react: true }))).toContain('qwqo/react')
    expect(names(lintspec({ vue: true })).some(name => name.startsWith('vue/'))).toBe(true)
  })

  it('unicorn.strict 启用被默认关闭的激进规则', () => {
    expect(names(lintspec())).toContain('qwqo/unicorn/overrides')
    expect(names(lintspec({ unicorn: { strict: true } }))).not.toContain('qwqo/unicorn/overrides')
  })

  it('importX.extensions 控制无后缀强制层', () => {
    expect(names(lintspec({ importX: true }))).toContain('qwqo/import/extensions')
    expect(names(lintspec({ importX: { extensions: false } }))).not.toContain(
      'qwqo/import/extensions',
    )
  })

  it('perfectionist 始终配置 import 分组排序', () => {
    expect(names(lintspec({ perfectionist: true }))).toContain('qwqo/perfectionist/imports')
    expect(names(lintspec({ perfectionist: { sort: 'natural' } }))).toContain('qwqo/perfectionist')
  })

  it('overrides 非空时追加最高优先级层', () => {
    const config = lintspec({ overrides: { 'no-console': 'error' } })
    const overrides = config.find(item => item.name === 'qwqo/overrides')
    expect(overrides?.rules?.['no-console']).toBe('error')
  })

  it('ignores 追加到内置忽略项之后', () => {
    const config = lintspec({ ignores: ['vendor/**'] })
    const ignores = config.find(item => item.name === 'qwqo/ignores')
    expect(ignores?.ignores).toContain('vendor/**')
    expect(ignores?.ignores).toContain('**/node_modules/**')
  })

  it('maxLines 默认在基线层注入 max-lines（300）', () => {
    const base = lintspec().find(item => item.name === 'qwqo/base')
    expect(base?.rules?.['max-lines']).toEqual([
      'warn',
      { max: 300, skipBlankLines: true, skipComments: true },
    ])
  })

  it('maxLines 可自定义上限，传 false 关闭', () => {
    const custom = lintspec({ maxLines: 500 }).find(item => item.name === 'qwqo/base')
    expect(custom?.rules?.['max-lines']).toEqual([
      'warn',
      { max: 500, skipBlankLines: true, skipComments: true },
    ])
    const off = lintspec({ maxLines: false }).find(item => item.name === 'qwqo/base')
    expect(off?.rules?.['max-lines']).toBeUndefined()
  })
})
