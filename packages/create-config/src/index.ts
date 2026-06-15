#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import * as p from '@clack/prompts'

import {
  buildEslintConfig,
  buildPrettierConfig,
  detectPackageManager,
  devDependencies,
  installArgs,
  scaffoldScripts,
  type ScaffoldAnswers,
} from './generate'

async function main(): Promise<void> {
  const cwd = process.cwd()

  p.intro('create-qwqo-config · 一个函数搞定 ESLint 与 Prettier')

  const framework = await p.select({
    message: '使用哪个框架？',
    options: [
      { value: 'none', label: '无 / 纯 JS·TS' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
    ],
    initialValue: 'none',
  })
  if (p.isCancel(framework)) return cancelled()

  const typescript = await p.confirm({ message: '使用 TypeScript？', initialValue: true })
  if (p.isCancel(typescript)) return cancelled()

  const environment = await p.select({
    message: '运行环境？',
    options: [
      { value: 'node', label: 'Node' },
      { value: 'browser', label: '浏览器' },
      { value: 'both', label: '两者' },
    ],
    initialValue: 'node',
  })
  if (p.isCancel(environment)) return cancelled()

  const scaffold: ScaffoldAnswers = {
    framework: framework as ScaffoldAnswers['framework'],
    typescript,
    environment: environment as ScaffoldAnswers['environment'],
  }

  // 1. 写入配置文件（统一用 .mjs，免受 package.json type 影响）。
  await writeConfigFile(path.resolve(cwd, 'eslint.config.mjs'), buildEslintConfig(scaffold))
  await writeConfigFile(path.resolve(cwd, 'prettier.config.mjs'), buildPrettierConfig())

  // 2. 合并 package.json 脚本（不存在则创建最小化清单）。
  ensurePackageScripts(path.resolve(cwd, 'package.json'))

  // 3. 安装依赖。
  const pm = detectPackageManager(process.env.npm_config_user_agent)
  const deps = devDependencies()
  const shouldInstall = await p.confirm({
    message: `用 ${pm} 安装依赖（${deps.join('、')}）？`,
    initialValue: true,
  })

  if (p.isCancel(shouldInstall) || !shouldInstall) {
    p.note(`${pm} ${installArgs(pm, deps).join(' ')}`, '稍后手动安装：')
    p.outro('配置文件已写入。')
    return
  }

  const spinner = p.spinner()
  spinner.start(`正在用 ${pm} 安装依赖`)
  const result = spawnSync(pm, installArgs(pm, deps), { cwd, stdio: 'ignore', shell: true })
  spinner.stop(result.status === 0 ? '依赖安装完成。' : '依赖安装失败，请稍后手动安装。')

  p.outro(`完成！运行 \`${pm} run lint\` 与 \`${pm} run format\` 试试。`)
}

/** 用户取消时的统一收尾。 */
function cancelled(): void {
  p.cancel('已取消。')
}

/** 写入文件；已存在时询问是否覆盖。 */
async function writeConfigFile(filePath: string, content: string): Promise<void> {
  if (existsSync(filePath)) {
    const overwrite = await p.confirm({
      message: `${path.basename(filePath)} 已存在，覆盖？`,
      initialValue: false,
    })
    if (p.isCancel(overwrite) || !overwrite) return
  }
  writeFileSync(filePath, content, 'utf8')
}

/** 把 lint/format 脚本合并进 package.json，缺失时创建最小清单。 */
function ensurePackageScripts(pkgPath: string): void {
  let pkg: Record<string, unknown>
  if (existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>
    } catch {
      p.log.warn('package.json 解析失败，跳过脚本注入。')
      return
    }
  } else {
    pkg = { name: 'my-project', version: '0.0.0', private: true, type: 'module' }
  }

  const scripts = (pkg.scripts as Record<string, string> | undefined) ?? {}
  pkg.scripts = { ...scaffoldScripts, ...scripts }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
}

main().catch((error: unknown) => {
  p.log.error(String(error))
  process.exitCode = 1
})
