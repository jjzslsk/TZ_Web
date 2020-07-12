import {
    generateGet
} from '@/common/request';

const hostEvn = `http://192.168.18.94:8088/DataSupply`;

const transformUrlWithEnv = url => url.replace(/{{host}}/g, hostEvn)

export const requestGetValidWarnInfo = generateGet({
    url: transformUrlWithEnv(`{{host}}/warnAPI/getValidWarnInfo.do`),
    transformResponse: [function(data) {
        const res = JSON.parse(data)
        return {
            "code": res.resultCode - 0,
            "success": res.resultCode === "0",
            "message": res.resultMessage,
            "data": res.result
        };
    }],
    noShowMessage: true
})
