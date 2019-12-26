const { merge } = require('lodash/fp')

let custom
try {
  custom = require('./gatsby-config.custom')
} catch (err) {
  custom = {}
}

const config = {
  pathPrefix: '/vedux/',

  siteMetadata: {
    title: 'Pocket',
    description: '小程序平台化主站，汇聚优秀小程序项目',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        docgenConfig: {},
        menu: [
          { name: 'Home', title: '首页', href: 'http://pocket.sankuai.com/' },
          {
            name: 'ProjectList',
            title: '项目列表页',
            href: 'http://pocket.sankuai.com/project-list',
          },
          {
            name: 'Docs',
            title: '接入文档',
            href: 'http://pocket.sankuai.com/docs',
          },
        ],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: false,
        'props-parser': true,
        debug: true,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: '/Users/ludejun/ludejun/vedux/docs/.docz',
        base: '/vedux/',
        source: './',
        src: './doc/',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Pocket',
        description: '小程序平台化主站，汇聚优秀小程序项目',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '/',
        paths: {
          root: '/Users/ludejun/ludejun/vedux/docs',
          templates:
            '/Users/ludejun/ludejun/vedux/docs/node_modules/docz-core/dist/templates',
          packageJson: '/Users/ludejun/ludejun/vedux/docs/package.json',
          docz: '/Users/ludejun/ludejun/vedux/docs/.docz',
          cache: '/Users/ludejun/ludejun/vedux/docs/.docz/.cache',
          app: '/Users/ludejun/ludejun/vedux/docs/.docz/app',
          appPublic: '/Users/ludejun/ludejun/vedux/docs/.docz/public',
          appNodeModules: '/Users/ludejun/ludejun/vedux/docs/node_modules',
          appPackageJson: '/Users/ludejun/ludejun/vedux/docs/package.json',
          appYarnLock:
            '/Users/ludejun/ludejun/vedux/docs/node_modules/docz-core/yarn.lock',
          ownNodeModules:
            '/Users/ludejun/ludejun/vedux/docs/node_modules/docz-core/node_modules',
          gatsbyConfig: '/Users/ludejun/ludejun/vedux/docs/gatsby-config.js',
          gatsbyBrowser: '/Users/ludejun/ludejun/vedux/docs/gatsby-browser.js',
          gatsbyNode: '/Users/ludejun/ludejun/vedux/docs/gatsby-node.js',
          gatsbySSR: '/Users/ludejun/ludejun/vedux/docs/gatsby-ssr.js',
          importsJs: '/Users/ludejun/ludejun/vedux/docs/.docz/app/imports.js',
          rootJs: '/Users/ludejun/ludejun/vedux/docs/.docz/app/root.jsx',
          indexJs: '/Users/ludejun/ludejun/vedux/docs/.docz/app/index.jsx',
          indexHtml: '/Users/ludejun/ludejun/vedux/docs/.docz/app/index.html',
          db: '/Users/ludejun/ludejun/vedux/docs/.docz/app/db.json',
        },
        sidebar: [
          {
            title: 'vedux 概述',
            name: 'Introduction',
            children: [
              { title: '快速接入', name: 'JoinUp' },
              { title: 'API介绍', name: 'API' },
            ],
          },
          { title: '高级使用', name: 'Senior' },
          { title: 'CHANGLOG', name: 'CHANGLOG' },
        ],
      },
    },
  ],
}

module.exports = merge(config, custom)
