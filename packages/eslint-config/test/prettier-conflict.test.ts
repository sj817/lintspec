import { describe, expect, it } from 'vitest'

import lintspec from '../src/index'

describe('Prettier 协调层', () => {
  it('关闭与 Prettier 冲突的格式化类规则', () => {
    const config = lintspec()
    const prettierLayer = config.find(item => item.name === 'qwqo/prettier')
    const rules = prettierLayer?.rules ?? {}

    // 该层应包含规则项，且全部被关闭（off / 0）。
    expect(Object.keys(rules).length).toBeGreaterThan(0)
    for (const value of Object.values(rules)) {
      const severity = Array.isArray(value) ? value[0] : value
      expect(severity === 'off' || severity === 0).toBe(true)
    }
  })
})
