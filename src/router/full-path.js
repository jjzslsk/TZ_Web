export default [{
    path: '/',
    // redirect: '/welcome'
    // redirect: '/login',
    redirect: '/welcome-login'
},{
    name: "welcome-login",
    path: '/welcome-login',
    component: () => import('../views/welcome/welcome-login.vue'),
}, {
    name: "welcome-home",
    path: '/welcome-home',
    component: () => import('../views/welcome/welcome-home.vue'),
    children: [
        {
            path: '/html-page',
            name: 'html-page',
            component: () => import('../views/welcome/html-page.vue')
        },
        {
            path: '/situation-page',
            name: 'situation-page',
            component: () => import('../views/welcome/situation-page.vue')
        }
    ]
},{
    name: "welcome-trace",
    path: '/welcome-trace/:type',
    component: () => import('../views/welcome/trace-page.vue'),
}, {
    path: '/admin',
    redirect: '/admin/menu',
    name: 'admin',
    component: () => import('../views/admin/index.vue'),
    children: [{
        path: 'dict',
        name: 'dict',
        redirect: 'dict/list',
        meta: {
            icon: "iconfont caidan",
            title: "字典管理"
        },
        component: () => import('../views/admin/dict/index.vue'),
        children: [
            {
                path: 'list',
                name: 'dict-list',
                component: () => import('../views/admin/dict/list.vue')
            }
        ]
    }, {
        path: 'area',
        name: 'area',
        redirect: 'area/list',
        meta: {
            icon: "iconfont caidan",
            title: "地区管理"
        },
        component: () => import('../views/admin/area/index.vue'),
        children: [
            {
                path: 'list',
                name: 'area-list',
                component: () => import('../views/admin/area/list.vue')
            }
        ]
    }, {
        path: 'organ',
        name: 'organ',
        redirect: 'organ/list',
        meta: {
            icon: "iconfont caidan",
            title: "机构管理"
        },
        component: () => import('../views/admin/organ/index.vue'),
        children: [
            {
                path: 'list',
                name: 'organ-list',
                component: () => import('../views/admin/organ/list.vue')
            }
        ]
    }, {
        path: 'menu',
        name: 'menu',
        redirect: 'menu/list',
        meta: {
            icon: "iconfont caidan",
            title: "菜单管理"
        },
        component: () => import('../views/admin/menu/index.vue'),
        children: [
            {
                path: 'list',
                name: 'menu-list',
                component: () => import('../views/admin/menu/list.vue')
            }
        ]
    }, {
        path: 'user',
        name: 'user',
        redirect: 'user/list',
        meta: {
            icon: "iconfont caidan",
            title: "用户管理"
        },
        component: () => import('../views/admin/user/index.vue'),
        children: [
            {
                path: 'list',
                name: 'user-list',
                component: () => import('../views/admin/user/list.vue')
            }
        ]
    }, {
        path: 'role',
        name: 'role',
        redirect: 'role/list',
        meta: {
            icon: "iconfont caidan",
            title: "角色管理"
        },
        component: () => import('../views/admin/role/index.vue'),
        children: [
            {
                path: 'list',
                name: 'role-list',
                component: () => import('../views/admin/role/list.vue')
            }
        ]
    }]
}, 
{
    path: '/integrated-management',
    redirect: '/integrated-management/home',
    name: 'integrated-management',
    component: () => import('../views/integrated-management/index.vue'),
    children: [{
        path: 'home',
        name: 'home',
        meta: {
            icon: "iconfont shouye",
            title: "值班展示"
        },
        component: () => import('../views/integrated-management/home/index.vue')
    }, {
        path: 'duty-management',
        redirect: '/integrated-management/duty-management/post',
        name: 'duty-management',
        meta: {
            icon: "iconfont zhibanguanli",
            title: "值班管理"
        },
        component: () => import('../views/integrated-management/duty-management/index.vue'),
        children: [
            {
                path: 'post',
                name: 'post',
                meta: {
                    icon: "iconfont pageManage",
                    title: "岗位管理"
                },
                component: () => import('../views/integrated-management/duty-management/post.vue')
            },
            // {
            //     path: 'personnel',
            //     name: 'personnel',
            //     meta: {
            //         icon: "iconfont pageManage",
            //         title: "人员管理"
            //     },
            //     component: () => import('../views/integrated-management/duty-management/personnel.vue')
            // },
            {
                path: 'scheduling',
                name: 'scheduling',
                meta: {
                    icon: "iconfont pageManage",
                    title: "排班管理"
                },
                component: () => import('../views/integrated-management/duty-management/scheduling.vue')
            },
            {
                path: 'history',
                name: 'history',
                meta: {
                    icon: "iconfont pageManage",
                    title: "历史交接班"
                },
                component: () => import('../views/integrated-management/duty-management/history.vue')
            },
            {
                path: 'attendance',
                name: 'attendance',
                meta: {
                    icon: "iconfont pageManage",
                    title: "考勤管理"
                },
                component: () => import('../views/integrated-management/duty-management/attendance.vue')
            },
            {
                path: 'overtime',
                name: 'overtime',
                meta: {
                    icon: "iconfont pageManage",
                    title: "加班管理"
                },
                component: () => import('../views/integrated-management/duty-management/overtime.vue')
            }
        ]
    }, {
        path: 'duty-process',
        redirect: 'duty-process/post',
        name: 'duty-process',
        meta: {
            icon: "iconfont zhibanliuchengpeizhi",
            title: "值班流程配置"
        },
        component: () => import('../views/integrated-management/duty-process/index.vue'),
        children: [
            {
                path: 'post',
                name: 'duty-process-post',
                meta: {
                    icon: "iconfont pageManage",
                    title: "岗位流程配置"
                },
                component: () => import('../views/integrated-management/duty-process/post.vue')
            },
            {
                path: 'scheduling',
                name: 'duty-process-scheduling',
                meta: {
                    icon: "iconfont pageManage",
                    title: "值班流程配置"
                },
                component: () => import('../views/integrated-management/duty-process/scheduling.vue')
            }
        ]
    }, {
        path: 'work-evidence',
        name: 'work-evidence',
        meta: {
            icon: "iconfont gongzuoliuhen",
            title: "工作留痕"
        },
        component: () => import('../views/integrated-management/work-evidence/index.vue')
    },{
        path: 'duty-holiday',
        name: 'duty-holiday',
        meta: {
            icon: "iconfont shouye",
            title: "节假日修改"
        },
        component: () => import('../views/integrated-management/duty-holiday/index.vue')
    }
    ]
}, {
    path: '/product-made',
    redirect: '/product-made/product-make',
    name: 'product-made',
    component: () => import('../views/product-made/index.vue'),
    children: [{
        path: 'product-template',
        name: 'product-template',
        meta: {
            icon: "iconfont shouye",
            title: "产品模板"
        },
        component: () => import('../views/product-made/product-template/index.vue')
    }, {
        path: 'service-user',
        name: 'service-user',
        meta: {
            icon: "iconfont shouye",
            title: "服务用户"
        },
        component: () => import('../views/product-made/service-user/index.vue')
    }, {
        path: 'product-data-origin',
        name: 'product-data-origin',
        meta: {
            icon: "iconfont shouye",
            title: "产品数据源"
        },
        component: () => import('../views/product-made/product-data-origin/index.vue')
    }, {
        path: 'product-label',
        name: 'product-label',
        meta: {
            icon: "iconfont shouye",
            title: "产品标签"
        },
        component: () => import('../views/product-made/product-label/index.vue')
    }, {
        path: 'product-attribute',
        name: 'product-attribute',
        meta: {
            icon: "iconfont shouye",
            title: "产品配置"
        },
        component: () => import('../views/product-made/product-attribute/index.vue')
    }, {
        path: 'product-state',
        name: 'product-state',
        meta: {
            icon: "iconfont shouye",
            title: "产品监控"
        },
        component: () => import('../views/product-made/product-state/index.vue')
    }, {
        path: 'product-appoint',
        name: 'product-appoint',
        meta: {
            icon: "iconfont shouye",
            title: "预约管理"
        },
        component: () => import('../views/product-made/product-appoint/index.vue')
    }, {
        path: 'product-make',
        name: 'product-make',
        meta: {
            icon: "iconfont shouye",
            title: "产品制作"
        },
        component: () => import('../views/product-made/product-make/index.vue'),
        children: [{
            path: 'product-make-images',
            name: 'product-make-images',
            meta: {
                icon: "iconfont shouye",
                title: "图片资料"
            },
            component: () => import('../views/product-made/product-make/information/images.vue')
        },{
            path: 'product-make-history',
            name: 'product-make-history',
            meta: {
                icon: "iconfont shouye",
                title: "历史参看"
            },
            component: () => import('../views/product-made/product-make/information/history.vue')
        }, {
            path: 'product-make-text',
            name: 'product-make-text',
            meta: {
                icon: "iconfont shouye",
                title: "文字资料"
            },
            component: () => import('../views/product-made/product-make/information/text.vue')
        }, {
            path: 'product-make-alert',
            name: 'product-make-alert',
            meta: {
                icon: "iconfont shouye",
                title: "提示栏"
            },
            component: () => import('../views/product-made/product-make/information/alert.vue')
        }, {
            path: 'product-make-phrase',
            name: 'product-make-phrase',
            meta: {
                icon: "iconfont shouye",
                title: "常用语"
            },
            component: () => import('../views/product-made/product-make/information/phrase.vue')
        }, {
            path: 'product-make-rules',
            name: 'product-make-rules',
            meta: {
                icon: "iconfont shouye",
                title: "业务规范"
            },
            component: () => import('../views/product-made/product-make/information/rules.vue')
        }, {
            path: 'product-make-message',
            name: 'product-make-message',
            meta: {
                icon: "iconfont shouye",
                title: "会商通知"
            },
            component: () => import('../views/product-made/product-make/information/message.vue')
        }, {
            path: 'product-make-prediction',
            name: 'product-make-prediction',
            meta: {
                icon: "iconfont shouye",
                title: "模式预报"
            },
            component: () => import('../views/product-made/product-make/information/prediction.vue')
        }, {
            path: 'product-make-warms',
            name: 'product-make-warms',
            meta: {
                icon: "iconfont shouye",
                title: "浙江warms"
            },
            component: () => import('../views/product-made/product-make/information/warms.vue')
        }
        ]
    }
    ]
}, {
    path: '/weather-situation',
    redirect: '/weather-situation/home',
    name: 'weather-situation',
    component: () => import('../views/weather-situation/index.vue'),
    children: [{
        path: 'home',
        name: 'home',
        meta: {
            icon: "iconfont shouye",
            title: "天气概览"
        },
        component: () => import('../views/weather-situation/home/index.vue')
    }]
},
{
    path: '/network-monitor',
    name: 'network-monitor',
    component: () => import('../views/network-monitor/index.vue'),
    children: [
{
    path: 'voice-monitor',
    name: 'voice-monitor',
    meta: {
        icon: "iconfont shouye",
        title: "声讯监控"
    },
    component: () => import('../views/network-monitor/voice-monitor/index.vue'),
},
]
}, {
    path: '/weather-warning',
    redirect: '/weather-warning/made/warning',
    name: 'weather-warning',
    component: () => import('../views/weather-warning/index.vue'),
    children: [{
        path: 'made/:type',
        name: 'weather-warning-made',
        meta: {
            icon: "iconfont shouye",
            title: "天气制作警报制作"
        },
        component: () => import('../views/weather-warning/made/index.vue')
    }, {
        path: 'trace/:type',
        name: 'trace',
        meta: {
            icon: "iconfont shouye",
            title: "警报追溯"
        },
        component: () => import('../views/weather-warning/trace/list.vue')
    },
    {
        path: 'signal',
        redirect: 'signal/guid',
        name: 'signal',
        component: () => import('../views/weather-warning/signal/index.vue'),
        children: [{
            path: 'guid',
            name: 'signal-guid',
            meta: {
                icon: "iconfont shouye",
                title: "预警信号指导"
            },
            component: () => import('../views/weather-warning/signal/guid.vue')
        }, {
            path: 'show',
            name: 'signal-show',
            meta: {
                icon: "iconfont shouye",
                title: "预警信号展示"
            },
            component: () => import('../views/weather-warning/signal/show.vue')
        }]
    }]
}, 
{
    path: '/numerical-forecast',
    redirect: '/numerical-forecast/home',
    name: 'numerical-forecast',
    component: () => import('../views/numerical-forecast/index.vue'),
    children: [{
        path: 'home',
        name: 'home',
        meta: {
            icon: "iconfont shouye",
            title: "数值预报"
        },
        component: () => import('../views/numerical-forecast/home/index.vue')
        }]
    },
        {
        path: '/web',
        redirect: '/web/home',
        name: 'web',
        component: () => import('../views/web/index.vue'),
        children: [{
            path: 'home',
            name: 'home',
            meta: {
                icon: "iconfont",
                title: "web"
            },
            component: () => import('../views/web/home/index.vue')
            }]
        },
{
    path: '/root/',
    redirect: '/',
    name: 'root',
    component: () => import('../views/root/index.vue'),
    children: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/root/login.vue')
        },
        {
            path: '/sudoku',
            name: 'sudoku',
            component: () => import('../views/root/sudoku.vue')
        }
    ]
}, {
    name: "outlink",
    path: '/outlink/:out*'
}]
