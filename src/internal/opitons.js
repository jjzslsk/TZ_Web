export const weather = [
    "晴",
    "多云",
    "阴",
    "小雨",
    "中雨",
    "大雨",
    "暴雨",
    "大暴雨",
    "特大暴雨"
];
export const windDirection = [
    "静风",
    "北风",
    "西北风",
    "东北风",
    "南风",
    "西南风",
    "东南风",
    "西风",
    "东风"
];
export const audit = [{
    value: 'all',
    label: '全部'
}, {
    value: 'successful',
    label: '通过'
}, {
    value: 'failure',
    label: '不通过'
}];

export const region = [
    {
        value: "huhehaote",
        label: "呼和浩特"
    },
    {
        value: "chifeng",
        label: "赤峰"
    }
];

export const warningType = [
    {
        value: "wind",
        label: "大风"
    },
    {
        value: "rain",
        label: "暴雨"
    }
];

export const warningLevel = [
    {
        value: undefined,
        label: '全部'
    },
    {
        value: "1",
        label: "红色"
    },
    {
        value: "2",
        label: "橙色"
    },
    {
        value: "3",
        label: "黄色"
    },
    {
        value: "4",
        label: "蓝色"
    },
    {
        value: "5",
        label: "无级别"
    }
];

export const warningState = [
    {
        value: undefined,
        label: '全部'
    },
    {
        value: '6',
        label: '生效'
    },
    {
        value: "7",
        label: "失效"
    }
];

export const organiseType = [
    {
        value: "1",
        label: "台州市气象台"
    },
    {
        value: "2",
        label: "临海气象台"
    }
];

export const areas = [
    {
        "value": "331001",
        "label": "市区"
    },
    {
        "value": "331083",
        "label": "玉环"
    },
    {
        "value": "331082",
        "label": "临海"
    },
    {
        "value": "331081",
        "label": "温岭"
    },
    {
        "value": "331024",
        "label": "仙居"
    },
    {
        "value": "331023",
        "label": "天台"
    },
    {
        "value": "331022",
        "label": "三门"
    },
    {
        "value": "331004",
        "label": "路桥"
    },
    {
        "value": "331003",
        "label": "黄岩"
    },
    {
        "value": "331002",
        "label": "椒江"
    }
];

export const channels = [{
    "label": "传真",
    "value": "FAX",
    "selected": false
}, {
    "label": "邮件",
    "value": "EMAIL",
    "selected": false
}, {
    "label": "FTP",
    "value": "FTP",
    "selected": false
}, {
    "label": "短信",
    "value": "BSMS",
    "selected": false
}, {
    "label": "微博",
    "value": "WEIBO",
    "selected": false
}, {
    "label": "微信",
    "value": "WeChat",
    "selected": false
}]
