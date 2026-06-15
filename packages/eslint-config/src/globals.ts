import type { Linter } from 'eslint'
import globals from 'globals'

/** 各环境通用的忽略路径，覆盖常见的构建产物与缓存目录。 */
export const commonIgnores: string[] = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/coverage/**',
  '**/.turbo/**',
  '**/.cache/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.output/**',
  '**/.vercel/**',
  '**/.svelte-kit/**',
  '**/.vitepress/cache/**',
  '**/.vitepress/dist/**',
  '**/*.min.js',
]

/** 浏览器环境全局变量。 */
export const browserGlobals = globals.browser as Linter.Globals

/** Node.js 环境全局变量。 */
export const nodeGlobals = globals.node as Linter.Globals
