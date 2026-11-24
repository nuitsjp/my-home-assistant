import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Home Assistant',
  description: 'Home Assistantの設定、機器連携、運用のナレッジ',
  lang: 'ja',
  base: process.env.SITE_BASE_PATH ?? '/',
  outDir: '../dist',
  themeConfig: {
    nav: [
      { text: 'GitHub', link: 'https://github.com/nuitsjp/my-home-assistant', noIcon: true },
    ],
    outline: {
      level: [2, 3],
      label: '目次',
    },
    returnToTopLabel: 'ページの先頭へ',
    darkModeSwitchLabel: '表示テーマ',
  },
})
