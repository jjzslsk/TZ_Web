import * as options from '@/internal/opitons'
export const getOptionsOfKey = k => options[k];
export const mapFrontOptions = (optionKeys, {
    afterFix = "Options"
} = {}) => optionKeys.reduce((p, c) => {
    p[c + afterFix] = () => getOptionsOfKey(c)
    return p;
}, {})
export const mapKeyValue2Label = (k, v) => getOptionsOfKey(k).find(e => e.value == v).label
