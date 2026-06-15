import { describe, expect, it } from 'vitest'

import config from '../src/index'

describe('prettier-config', () => {
  it('导出有效的 Prettier 配置对象', () => {
    expect(config).toBeTypeOf('object')
    expect(config.semi).toBe(false)
    expect(config.singleQuote).toBe(true)
    expect(config.printWidth).toBe(100)
  })
})
