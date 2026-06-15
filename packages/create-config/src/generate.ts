/** 交互问题收集到的回答。 */
export interface ScaffoldAnswers {
  /** 框架：无 / React / Vue。 */
  framework: 'none' | 'react' | 'vue'
  /** 是否使用 TypeScript。 */
  typescript: boolean
  /** 运行环境：Node / 浏览器 / 两者。 */
  environment: 'node' | 'browser' | 'both'
}

/** 依据回答生成 `eslint.config.mjs` 内容。 */
export function buildEslintConfig(answers: ScaffoldAnswers): string {
  const { framework, typescript, environment } = answers
  const lines: string[] = []
  if (environment === 'node' || environment === 'both') lines.push('  node: true,')
  if (environment === 'browser' || environment === 'both') lines.push('  browser: true,')
  if (typescript) lines.push('  typescript: true,')
  if (framework === 'react') lines.push('  react: true,')
  if (framework === 'vue') lines.push('  vue: true,')
  lines.push('  importX: true,', '  perfectionist: true,')

  return `import lintspec from '@qwqo/eslint-config'

export default lintspec({
${lines.join('\n')}
})
`
}

/** 生成 `prettier.config.mjs` 内容。 */
export function buildPrettierConfig(): string {
  return `export { default } from '@qwqo/prettier-config'
`
}

/** 注入到 package.json 的脚本。 */
export const scaffoldScripts: Record<string, string> = {
  lint: 'eslint .',
  'lint:fix': 'eslint . --fix',
  format: 'prettier . --write',
  'format:check': 'prettier . --check',
}

/** 需要安装的开发依赖。 */
export function devDependencies(): string[] {
  return ['eslint', 'prettier', '@qwqo/eslint-config', '@qwqo/prettier-config']
}

/** 支持的包管理器。 */
export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun'

/** 从 `npm_config_user_agent` 推断当前包管理器，识别不到时回退 npm。 */
export function detectPackageManager(userAgent?: string): PackageManager {
  if (!userAgent) return 'npm'
  const name = userAgent.split(' ', 1)[0]?.split('/', 1)[0]
  const known: PackageManager[] = ['pnpm', 'yarn', 'bun']
  return known.includes(name as PackageManager) ? (name as PackageManager) : 'npm'
}

/** 给定包管理器，返回安装开发依赖的命令参数。 */
export function installArgs(pm: PackageManager, deps: string[]): string[] {
  switch (pm) {
    case 'pnpm': {
      return ['add', '-D', ...deps]
    }
    case 'yarn': {
      return ['add', '-D', ...deps]
    }
    case 'bun': {
      return ['add', '-d', ...deps]
    }
    default: {
      return ['install', '-D', ...deps]
    }
  }
}
