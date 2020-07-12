// mockSettings.js

// zs
// const backCommon = `https://qxfw.tqonline.top:8900`

// 系统设置 zyd
const system = `http://172.21.158.161:4001`
// const system = `http://192.168.5.105:4001`

// 综合管理 
const business = 'http://172.21.158.161:6001'
// const business = 'http://192.168.5.122:6001'
// const business = 'http://192.168.5.105:6001'
// const business = 'http://192.168.1.9:6001'

// 产品制作 lxy
// const backLxy = 'http://192.168.5.122:9527'
// const backLxy = 'http://192.168.5.105:6002'
const backLxy = 'http://172.21.158.161:6002'
// const backLxy = 'http://192.168.1.9:9527'

//天气警报
// const backWarning = 'http://192.168.5.105:6003'
const backWarning = 'http://172.21.158.161:6003'

// pageoffice
const pageoffice = `http://192.168.0.201:62689`

const mockServerJson = [];
// ([{
//     key: `trace-dialog-statistic`,
//     reg: `warning/ssd-early-warning-publish-detail/getStatistics`
//     // pathPrefix: ''
// // }, {
// //     key: `common-success-list`,
// //     reg: `system/ssd-sys-menu/selectMenuTreeByNowUser`
//     // pathPrefix: ''
// }]).forEach(({key, reg, pathPrefix = '/ssd/'}) => {
//     const regInner = `${pathPrefix}${reg}`;
//     mockServerJson.push({
//         'reg': regInner,
//         'handle': routerReplace(regInner, `/static/data/${key}.json`) // 替换router url的指定正则表达式部分为指定内容
//     })
// })

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
        // }, {
        //     'reg': '/activities/activityAreaInfo/getFiveDaysForecast',
        //     'handle': routerReplace('/activities/activityAreaInfo/getFiveDaysForecast', '/static/data/server/getFiveDaysForecast.json') // 替换router url的指定正则表达式部分为指定内容
        // }, {
    //     'reg': '/ssd/system/ssd-sys-menu/selectMenuTreeByNowUser',
    //     'handle': routerReplace('/ssd/system/ssd-sys-menu/selectMenuTreeByNowUser', '/static/data/common-success-list.json') // 替换router url的指定正则表达式部分为指定内容
    // }, {
    //     'reg': '/ssd/system/ssd-sys-menu/selectMenuList',
    //     'handle': routerReplace('/ssd/system/ssd-sys-menu/selectMenuList', '/static/data/common-success-list.json') // 替换router url的指定正则表达式部分为指定内容
    // }, {
        'reg': '/static/pages/images/',
        'handle': ajaxDirSync() // 默认参数{dirBasePath: './',pathPrefix: '/'}
    },
    ...mockServerJson,
    {
        'reg': '/data/',
        'handle': ajaxDirSync() // 默认参数{dirBasePath: './',pathPrefix: '/'}
        // }, {
        //     'reg': '^/activities/weatherPredict',
        //     'handle': requestRemote(pq) // 代理到对应的远端
    // }, {
    //     'reg': '^/ssddraw/',
    //     'handle': requestRemote(backCommon) // 代理到对应的远端
    // }, {
    //     'reg': '^/filePath/',
    //     'handle': requestRemote(backCommon) // 代理到对应的远端
    // }, {
    //     'reg': '^/gcisAPP-service/',
    //     'handle': requestRemote(backCommon) // 代理到对应的远端
    },
    {
        'reg': '^/ssd/warning',
        'handle': requestRemote(backWarning) // 代理到对应的远端-warning lxy
    },
    {
        'reg': '^/ssd/product',
        'handle': requestRemote(backLxy) // 代理到对应的远端-产品制作 lxy
    },
    {
        'reg': '^/ssd/system',
        'handle': requestRemote(system) // 代理到对应的远端-系统设置 zyd
    },
    {
        'reg': '^/ssd/business',
        'handle': requestRemote(business) // 代理到对应的远端-综合管理 wzl
    },
    {
        'reg': '^/product/ssd-page-office/',
        'handle': requestRemote(pageoffice) // 代理到对应的远端-pageoffice
    }
    ]
}
