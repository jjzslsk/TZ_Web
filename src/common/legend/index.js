import info from './info'
export const getInfoOfKeySync = key => info[key];
export const getDataOfKey = key => getInfoOfKeySync(key) ? Promise.resolve(info[key]) : Promise.reject({
    message: `找不到${key}的图例`
})
export const getInfoOfKeyVal = key => valRaw => {
    if (info[key] == null || valRaw == null) {
        return {
            // color: "#fff"
        }
    } else {
        const val = valRaw - 0;
        return info[key].list.find(e => Object.entries({
            eq: () => e.eq == val,
            minEq: () => e.minEq <= val,
            min: () => e.min < val,
            max: () => e.max > val
        }).every(([prop, fn]) => {
            if (typeof(e[prop]) !== "undefined") {
                return fn()
            } else {
                return true;
            }
        })) || {
            // color: "#fff"
        }
    }
}
