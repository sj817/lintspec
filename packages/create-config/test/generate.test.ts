import { describe, expect, it } from 'vitest'

import {
  buildEslintConfig,
  buildPrettierConfig,
  detectPackageManager,
  devDependencies,
  installArgs,
  type ScaffoldAnswers,
} from '../src/generate'

describe('buildEslintConfig', () => {
  it('Node + TypeScript 项目', () => {
    const answers: ScaffoldAnswers = { framework: 'none', typescript: true, environment: 'node' }
    const out = buildEslintConfig(answers)
    expect(out).toContain("import lintspec from '@qwqo/eslint-config'")
    expect(out).toContain('node: true,')
    expect(out).toContain('typescript: true,')
    expect(out).toContain('importX: true,')
    expect(out).toContain('perfectionist: true,')
    expect(out).not.toContain('browser')
    expect(out).not.toContain('react')
    expect(out).not.toContain('vue')
  })

  it('React + 浏览器', () => {
    const out = buildEslintConfig({ framework: 'react', typescript: true, environment: 'browser' })
    expect(out).toContain('browser: true,')
    expect(out).toContain('react: true,')
    expect(out).not.toContain('node: true,')
    expect(out).not.toContain('vue: true,')
  })

  it('Vue + 两种环境', () => {
    const out = buildEslintConfig({ framework: 'vue', typescript: false, environment: 'both' })
    expect(out).toContain('node: true,')
    expect(out).toContain('browser: true,')
    expect(out).toContain('vue: true,')
    expect(out).not.toContain('typescript: true,')
    expect(out).not.toContain('react: true,')
  })
})

describe('buildPrettierConfig', () => {
  it('re-export 共享配置', () => {
    expect(buildPrettierConfig()).toBe("export { default } from '@qwqo/prettier-config'\n")
  })
})

describe('detectPackageManager', () => {
  it('从 user agent 识别', () => {
    expect(detectPackageManager('pnpm/10.0.0 npm/? node/v22')).toBe('pnpm')
    expect(detectPackageManager('yarn/4.0.0 npm/? node/v22')).toBe('yarn')
    expect(detectPackageManager('bun/1.0.0')).toBe('bun')
    expect(detectPackageManager('npm/10.0.0 node/v22')).toBe('npm')
  })

  it('识别不到回退 npm', () => {
    expect(detectPackageManager()).toBe('npm')
    expect(detectPackageManager('unknown/1.0.0')).toBe('npm')
  })
})

describe('installArgs', () => {
  const deps = devDependencies()

  it('各包管理器的安装参数', () => {
    expect(installArgs('pnpm', deps)).toEqual(['add', '-D', ...deps])
    expect(installArgs('yarn', deps)).toEqual(['add', '-D', ...deps])
    expect(installArgs('bun', deps)).toEqual(['add', '-d', ...deps])
    expect(installArgs('npm', deps)).toEqual(['install', '-D', ...deps])
  })

  it('依赖清单含共享配置与底层工具', () => {
    expect(deps).toContain('eslint')
    expect(deps).toContain('prettier')
    expect(deps).toContain('@qwqo/eslint-config')
    expect(deps).toContain('@qwqo/prettier-config')
  })
})
