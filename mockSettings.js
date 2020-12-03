// mockSettings.js
//主业务 接口
const integration = `http://10.137.4.30:6001`;

// 系统设置
const system = `http://10.137.4.36:4001`;

const mockServerJson = [];
mockSettings = {
    "delay": 0, // 全局延时
    "timeout": 100000, // 请求超时设置
    "temDir": "tem", // 自动记录requestRemote的结果目录
    "dist_dir": {
        "js": "dist-prod/js"
    },
    "mockList": [{
        //     'reg': '/api/controller/action', // 匹配的正则表达式
        //     'handle': ajaxSync('./path/to/mockdata.json') // 发送对应json文件
        // }, {
        //     //     'reg': '/api',
        //     //     'handle': requestRemote('https://publish.online.url/')
        //     // }, {
        //     //     'reg': '/data/',
        //     //     'handle': ajaxDirSync({dirBasePath: './data/', pathPrefix: '/data/'}) // 返回文件，将url的前缀用pathPrefix替换，并返回相对于dirBasePath地址的文件。
        // // }, {
        // //     'reg': '^/dist/',
        // //     'handle': routerReplace('^/dist/', '/') // 替换router url的指定正则表达式部分为指定内容
        // }, {
        //     'reg': '/my-menu.json$',
        //     'handle': routerReplace('/my-menu.json', '/my-menu-system.json') // 替换router url的指定正则表达式部分为指定内容
        // }, {
        //     'reg': '/common-success.json$',
        //     'handle': routerReplace('/common-success.json', '/common-failed.json') // 替换router url的指定正则表达式部分为指定内容
        // }, {
        //     'reg': '/activities/activityAreaInfo/getActivityAreaSubordinateInfoByActivityId',
        //     'handle': routerReplace('/activities/activityAreaInfo/getActivityAreaSubordinateInfoByActivityId', '/static/data/server/cards.json') // 替换router url的指定正则表达式部分为指定内容
        // },
        'reg': '/static/pages/images/',
        'handle': ajaxDirSync() // 默认参数{dirBasePath: './',pathPrefix: '/'}
    },
    ...mockServerJson,
    {
        'reg': '/data/',
        'handle': ajaxDirSync() // 默认参数{dirBasePath: './',pathPrefix: '/'}
    },
    {
        'reg': '^/integration/main',
        'handle': requestRemote(integration) // 代理主业务
    },
    {
        'reg': '^/integration/system',
        'handle': requestRemote(system) // 代理系统管理
    }
    ]
}
