// 转换px为设备相关px
import { weatherWarningType as weatherWarningTypeMapper, weatherWarningTypeGB as weatherWarningTypeGBMapper, areaCodeInfo } from '@/internal/mappers'
export const pxToRatedPx = px => (parseFloat(document.querySelector('html').style.fontSize) / 108) * px
// 生成地图计算属性
export const mapComputedTools = (toolsInit) => {
    let i = 0
    const res = toolsInit.map(e => e.key).reduce((p, c) => {
        const index = i++
        p[c] = {
            get () {
                return this.tools[index].active
            },
            set (val) {
                this.tools[index].active = val
            }
        }
        return p
    }, {})
    return res
}
const toolsGroupInfo = {}
// 生成地图关联属性
export const mapWatchTools = (toolsInit) => {
    let i = 0
    const res = toolsInit.reduce((p, c) => {
        const index = i++
        const group = c.group
        const handler = c.handler
        let groupItems
        if (group) {
            groupItems = toolsGroupInfo[group]
            if (!groupItems) {
                toolsGroupInfo[group] = groupItems = []
            }
            groupItems.push(index)
        }
        p[`tools.${index}.active`] = {
            handler: function (val, old) {
                const tools = this.tools
                if (group) {
                    if (val) {
                        groupItems.forEach(ei => {
                            if (index !== ei) {
                                tools[ei].active = false
                            }
                        })
                    } else if (groupItems.every(ei => !tools[ei].active)) {
                        tools[index].active = true
                    }
                }
                if (handler) {
                    if (val) {
                        this[handler](val, old)
                    }
                }
            }
        }
        return p
    }, {})
    return res
}
// 转换预警数据为图片信息
export const transformAlarmsInfo = info => {
    let imageColor, levelName, imageType
    switch ("" + info.level) {
        case '蓝色':
        case 'blue':
        case '5':
            imageColor = '5'
            levelName = '无'
            break
        case '4':
            imageColor = '4'
            levelName = '蓝色'
            break
        case '黄色':
        case 'yellow':
        case '3':
            imageColor = '3'
            levelName = '黄色'
            break
        case '橙色':
        case 'orange':
        case '2':
            imageColor = '2'
            levelName = '橙色'
            break
        case '红色':
        case 'red':
        case '1':
            imageColor = '1'
            levelName = '红色'
            break
        default:
            console.error(`Warning level:(${info.level}) not found`)
    }
    if (info.code) {
        imageType = weatherWarningTypeGBMapper[info.code] || info.code
    } else {
        imageType = weatherWarningTypeMapper[info.type] || info.type
    }
    return { imageType, imageColor, levelName }
}
// 转换地点信息
export const transformAreaCode = areaCode => (areaCodeInfo[areaCode] || {})
// 打断中文分割符
export const getSplitCnIndex = (strCn, index, moreSplit = []) => {
    let res = ''
    if (strCn) {
        res = strCn.split(new RegExp(`[：；，。${moreSplit.join('')}]`))[index] || ''
    }
    return res
}
// 打断属性中文
export const splitCnProps = (data, info) => {
    Object.entries(info).forEach(e => {
        const [key, value] = e
        data[`${key}Show`] = getSplitCnIndex(data[key], ...value)
    })
}
