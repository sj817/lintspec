import lintspec from '@qwqo/eslint-config'

// 演练场启用全部规则层；各层按文件类型自动生效。
export default lintspec({
  browser: true,
  importX: true,
  node: true,
  perfectionist: true,
  react: true,
  typescript: true,
  vue: true,
})
