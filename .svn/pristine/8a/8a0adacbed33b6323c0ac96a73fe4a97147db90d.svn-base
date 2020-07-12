import moment from 'moment'
import {mapKey2Value} from '@/common/mapper/'
import {mapKeyValue2Label} from '@/common/options/'
export const transformDate = function(value, to, from = "YYYYMMDDHHmmss") {
    return value ? moment(value, from).format(to) : value;
};
export const addDate = (value, duration, format = "YYYYMMDDHHmmss") => {
    return value ? moment(value, format).add(moment.duration(duration)) : value
}
export const transformType = function(value) {
    return ({
        precipitation: "降水",
        temperature: "温度",
        relativeHumidity: "相对湿度",
        wind: "风速",
        visibility: "能见度"
    })[value]
};
export const weatherVal = function(value, unit = "") {
    return value == null || value === '' ? '缺值' : `${value}${unit}`
};
export const legendTitle = function(value) {
    const prop = ['title', 'minEq', 'min'].find(prop => value[prop] != null);
    return value[prop]
};
export const codeToWeatherIcon = value => '../../static/images/weather_icons/' + value + '.png';
export const leftPad = (value, length, fill = "0") => {
    if (value == null) {
        return value
    } else {
        const val = "" + value;
        return fill.repeat(length).substr(val.length) + val;
    }
}
export const transformRedHead = (value, isWarning) => {
    const form = value;
    if (!form) {
        return {};
    }
    const common = {
        XXXPROP_RED_HEAD_PUB_TIME: form.publishTime,
        // // NOTE: 当前用户信息
        XXXPROP_RED_HEAD_USER: form.accountName
    }
    if (isWarning) {
        return {
            ...common,
            XXXPROP_RED_HEAD_NO: form.issue,
            XXXPROP_RED_HEAD_TYPE: form.XXX_PROP_WARNING_TYPE,
            XXXPROP_RED_HEAD_CONTENT: form.alarmContent,
            XXXPROP_RED_HEAD_ALL_READY: form.warningContent,
            XXXPROP_RED_HEAD_SEND_TIME: form.publishTime
        }
    } else {
        return {
            ...common,
            XXXPROP_RED_HEAD_NO: form.issue,
            XXXPROP_RED_HEAD_ORGANIZE: form.XXX_PROP_WARNING_ORGANIZE_NAME,
            XXXPROP_RED_HEAD_TITLE: form.title,
            XXXPROP_RED_HEAD_CONTENT: form.content,
            XXXPROP_TRACE_ALARM_TYPE: form.imageType,
            code: form.code,
            level: form.imageColor || form.level,
            XXXPROP_RED_HEAD_GUID: form.defense
        }
    }
}
export const frontMapper = (value, key) => {
    return mapKey2Value(key, value)
}
export const frontOptionLabel = (value, key) => mapKeyValue2Label(key, value)

// export const mapFilters = (filterKeys, {
//     afterFix = "Filter"
// } = {}) => filterKeys.reduce((p, c) => {
//     p[c + afterFix] = () => this[c]
//     return p;
// }, {})
