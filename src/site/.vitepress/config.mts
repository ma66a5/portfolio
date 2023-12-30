import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Matt's Portfolio",
  description: "A site to describe work experience and present personal projects",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Skills', link: '/skills' },
      { text: 'Experience', link: '/experience' }
    ],

    sidebar: [
      {
        text: 'Portfolio',
        items: [
          { text: 'Skills', link: '/skills' },
          { text: 'Experience', link: '/experience' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ma66a5' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/matthew-abbas-335a52a/' }
    ]
  }
})
