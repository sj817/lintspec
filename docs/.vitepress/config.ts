import container from 'markdown-it-container'
import { defineConfig } from 'vitepress'

/** 注册 ❌/✅ 示例容器：固定标签，配合 custom.css 渲染红/绿卡片。 */
const exampleContainer = (md, name, label, variant) => {
  md.use(container, name, {
    render(tokens, index) {
      if (tokens[index].nesting === 1) {
        return `<div class="ls-example ls-${variant}"><div class="ls-example-label">${label}</div>\n`
      }
      return '</div>\n'
    },
  })
}

// 简体中文 locale 的导航与侧边栏。将来新增语言时，在 locales 下追加对应配置即可。
const zhNav = [
  { text: '指南', link: '/guide/introduction' },
  { text: '规则层', link: '/layers/base' },
  { text: '配置项', link: '/guide/options' },
  { text: 'Prettier', link: '/guide/prettier' },
  { text: '全部规则', link: '/reference/rules' },
]

const zhSidebar = [
  {
    text: '指南',
    items: [
      { text: '简介', link: '/guide/introduction' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '配置项总览', link: '/guide/options' },
    ],
  },
  {
    text: 'ESLint 规则层',
    items: [
      { text: '基线层', link: '/layers/base' },
      { text: 'unicorn', link: '/layers/unicorn' },
      { text: 'TypeScript', link: '/layers/typescript' },
      { text: 'import-x', link: '/layers/import' },
      { text: 'perfectionist', link: '/layers/perfectionist' },
      { text: 'React', link: '/layers/react' },
      { text: 'Vue', link: '/layers/vue' },
      { text: 'Prettier 协调层', link: '/layers/prettier' },
    ],
  },
  {
    text: 'Prettier',
    items: [{ text: 'Prettier 配置', link: '/guide/prettier' }],
  },
  {
    text: '规则参考',
    items: [{ text: '全部规则', link: '/reference/rules' }],
  },
]

export default defineConfig({
  title: 'Lintspec',
  description: 'qwqo 的 ESLint 与 Prettier 共享规范',
  head: [['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }]],
  lastUpdated: true,
  markdown: {
    config(md) {
      exampleContainer(md, 'bad', '不推荐', 'bad')
      exampleContainer(md, 'good', '推荐', 'good')
      exampleContainer(md, 'before', '格式化前', 'before')
      exampleContainer(md, 'after', '格式化后', 'after')
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    // 右侧大纲展示 h2 + h3，让每条规则/选项的小标题都可见。
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/sj817/lintspec' }],
    search: {
      provider: 'local',
    },
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
      },
    },
  },
})
