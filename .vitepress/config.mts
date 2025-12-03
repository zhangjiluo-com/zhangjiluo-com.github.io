import { defineConfig } from "vitepress";

export default defineConfig({
  title: "www.zhangjiluo.com",
  description: "zhangjiluo.com",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "札记", link: "/blog" },
      { text: "简历", link: "/resume" },
      { text: "联系", link: "/contact" },
      { text: "关于", link: "/about" },
    ],

    sidebar: [
      {
        text: "JavaScript",
        items: [
          { text: "Promise", link: "/js/promise" },
          { text: "this", link: "/js/this" },
          { text: "作用域", link: "/js/scope" },
          { text: "原型与原型链", link: "/js/prototype" },
        ],
      },
      {
        text: "工具",
        items: [{ text: "Windows App", link: "/tools/windows-app" }],
      },
      {
        text: "其它",
        items: [{ text: "创建此站", link: "/etc/create-this-site" }],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/zhangjiluo-com/zhangjiluo-com.github.io",
      },
    ],

    lastUpdatedText: "最近更新于",
    lastUpdated: {
      formatOptions: {
        dateStyle: "long",
        timeZone: "Asia/Shanghai",
      },
    },
  },
});
