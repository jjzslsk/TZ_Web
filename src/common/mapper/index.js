import * as mappers from '@/internal/mappers'
export const mapOfKey = k => mappers[k];
export const mapKey2Value = (k, c) => mapOfKey(k)[c];
export const mapFrontMapper = (optionKeys, {
    afterFix = "Mapper"
} = {}) => optionKeys.reduce((p, c) => {
    p[c + afterFix] = () => mapOfKey(c)
    return p;
}, {})
const invertKeyValues = obj => Object.keys(obj).reduce((p, c) => {
    p[obj[c]] = c;
    return p;
}, {});
export const mapFrontInvertMapper = (optionKeys, {
    afterFix = "InvertMapper"
} = {}) => {
    const mapRoot = mapFrontMapper(optionKeys, {afterFix});
    Object.entries(mapRoot).forEach(([k, v]) => mapRoot[k] = invertKeyValues(v))
}
