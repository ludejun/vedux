/**
 * 导航菜单
 */
const menu = [
    { name: 'Home', title: '首页', href: 'http://pocket.sankuai.com/' },
    {
        name: 'ProjectList',
        title: '项目列表页',
        href: 'http://pocket.sankuai.com/project-list'
    },
    {
        name: 'Docs',
        title: '接入文档',
        href: 'http://pocket.sankuai.com/docs'
    }
];

//route, href
const sidebar = [
    {
        title: 'vedux 概述',
        name: 'Introduction',
        children: [
            {
                title: '快速接入',
                name: 'JoinUp'
            },
            {
                title: 'API介绍',
                name: 'API'
            }
        ]
    },
    {
        title: '高级使用',
        name: 'Senior'
    },
    // {
    //     title: '技术原理',
    //     name: 'Technical'
    // },
    // {
    //     title: '常见问题',
    //     name: 'Question'
    // },
    // {
    //     title: '贡献指南',
    //     name: 'Contribute'
    // },
    {
        title: 'CHANGLOG',
        name: 'CHANGLOG'
    }
];

module.exports = {
    src: './doc/',
    title: 'Pocket',
    base: '/vedux/',
    description: '小程序平台化主站，汇聚优秀小程序项目',
    propsParser: false,
    debug: true,
    separator: '/',
    menu,
    sidebar
};
