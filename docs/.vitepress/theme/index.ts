import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './custom.css'

export default {
  extends: DefaultTheme,
} satisfies Theme
