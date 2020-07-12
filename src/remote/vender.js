import {
    generateGet
} from '@/common/request';

export const requestMinutePrecipitationInfo = ({
    name,
    lon,
    lat
}) => generateGet({
    url: `http://222.216.5.171:8888/NowcastData/r/fcst1/${lon},${lat}`,
    transformResponse: [function(data) {
        const res = JSON.parse(data)
        return {
            "code": res.returnCode - 0,
            "success": res.returnCode === "0",
            "message": res.message,
            "data": res
        };
    }],
    noShowMessage: true
})().then(res => {
    return {
        "code": 0,
        "success": true,
        "message": "请求成功",
        "data": {
            "alert": {
                "title": "未来120分钟降水预测",
                "content": `${name}：${res.data.message}`
            }
        }
    };
}).catch((err) => {
    return {
        "code": 0,
        "success": true,
        "message": "请求失败（返回数据）",
        "data": {
            alert: {
                "title": "未来120分钟降水预测",
                "content": `${name}：暂无数据`
            }
        }
    };
})
