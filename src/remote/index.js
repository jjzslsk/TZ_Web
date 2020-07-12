import {
    generateGet,
    generatePost,
    generateDelete,
    generatePostJSON,
    generateDownload
} from '@/common/request';
import * as vender from './vender'
import * as dataSupply from './data-supply'
import { Alert } from 'element-ui';

const dataStaticBase = './static/data/';

const commonSuccess = dataStaticBase + 'common-success.json';

const hostEvn = `/ssd`;
// const hostEvn = `/boot`;

const transformUrlWithEnv = url => url.replace(/{{host}}/g, hostEvn)

const HeadersToken = {
    localData: function() {
        const loginData = JSON.parse(localStorage.getItem('loginData'))
        if (loginData !== null) {
            if (loginData.jwt !== null) {
                if (loginData.jwt.access_token !== null) {
                    var tokenInfo = loginData.jwt.access_token
                }
            }
        } else {
            console.log(loginData)
        }
        // if(loginData.jwt !== null || loginData.jwt !== undefined || loginData.jwt !== ''){console.log(loginData.jwt)}else{console.log('null')}
        // if(!loginData.jwt.access_token){
        //     localStorage.clear();
        //     vm.$router.push({
        //         'name': 'login'
        //       });
        // }
        return tokenInfo || null
    }
}

const transformConfig = url => ({
    url: transformUrlWithEnv(url),
    setHeaders: () => ({'Authorization': HeadersToken.localData()})
})

export const localStorageToken = HeadersToken.localData()

const generateGetWithEvn = url => generateGet(transformUrlWithEnv(url))
const generateDeleteWithEvn = url => generateDelete(transformUrlWithEnv(url))
const generateDeleteWithEvnToken = url => generateDelete(transformConfig(url))
// const generateDeleteWithEvn = url => generateGet(transformUrlWithEnv(url))
const generateGetWithEvnToken = url => generateGet(transformConfig(url))
const generatePostWithEvnToken = url => generatePost(transformConfig(url))
const generatePostWithEvn = url => generatePost(transformUrlWithEnv(url))
const generatePostJSONWithEvn = url => generatePostJSON(transformUrlWithEnv(url))
const generatePostJSONWithEvnToken = url => generatePostJSON(transformConfig(url))
const generateDownloadWithEvn = url => generateDownload(transformUrlWithEnv(url))

const generateGetGeojson = url => generateGet({
    url,
    transformResponse: [function (res) {
        const data = JSON.parse(res);
        return {
            "success": !!data,
            data
        };
    }]
});

// common
export const urlImageUploadPoint = generateGet(commonSuccess);
export const requestAreas = generateGet(commonSuccess);
export const requestChangePassword = generateGet(commonSuccess);

// geojson

// page

// requests
// 获取省geojson
export const requestGeojsonOfKey = data => generateGetGeojson(`/static/data/geojson/taizhou/${data.key}.geojson`)(data)

// 登录
export const requestLogin = generatePostWithEvn('{{host}}/system/ssd-sys-user/login');
// export const requestLogin = generatePostWithEvn(dataStaticBase + 'login1.json');
// export const requestLogin = generatePostWithEvn(dataStaticBase + 'login.json');

// export const requestLogin = generatePostWithEvn(commonSuccess);

// 获取用户信息
export const requestMyAccountInfo = generateGetWithEvnToken('{{host}}/system/ssd-sys-user/selectUserById');
// export const requestMyAccountInfo = generatePostWithEvn(dataStaticBase + 'selectUserById.json');
// export const requestMyAccountInfo = generatePostWithEvn(dataStaticBase + 'get-userInfo.json');
// export const requestLogin = generatePostWithEvn(commonSuccess);

//获取所有用户列表
export const requestAllUserList = generateGetWithEvnToken('{{host}}/system/ssd-sys-user/getUserList');


// 获取头部菜单列表
// export const requestMenu = generateGetWithEvnToken(dataStaticBase + 'menu.json');
export const requestMenu = generateGetWithEvnToken('{{host}}/system/ssd-sys-menu/selectMenuTree');

// 退出 GET /ssd-sys-user/logout
export const requestLogout = generatePostWithEvnToken('{{host}}/system/ssd-sys-user/logout');
// export const requestLogout = generateGet(commonSuccess);

// 产品制作-产品制作-分组左侧导航
// export const requestProductClassTreeList = generateGetWithEvn(dataStaticBase + 'product-tree.json');
// export const requestProductTabTreeList = generateGetWithEvn(dataStaticBase + 'product-tab-tree.json');
export const requestProductClassTreeList = generateGetWithEvn('{{host}}/product/ssd-product-template-type/getDataTree');

//产品制作 左侧 制作流程 完成提交 GET /ssd-business-duty-task/doFinish
export const requestProductDoFinish = generateGetWithEvn('{{host}}/business/ssd-business-duty-task/doFinish');


// // 产品制作-产品制作-分组左侧 流程信息
export const requestProductTaskList = generateGetWithEvn('{{host}}/business/ssd-business-index/getSsdBusinessIndexTask');

// 产品制作-产品制作-获取产品信息（多个） ssd/product/ssd-product-info/getProductList?productTypeId=xxxxx
export const requestProducInfos = generateGetWithEvn('{{host}}/product/ssd-product-info/getProductList');

// 产品制作-产品制作-获取产品信息(单个) product/ssd-product-publish/openProductTxt?productInfoId=x&isReload=false
export const requestProducInfo = generateGetWithEvn('{{host}}/product/ssd-product-publish/openProductTxt');

// 产品制作-产品制作-获取产品信息 多个产品查询发布记录：ssd/product/ssd-product-publish/getPublishList?productInfoIds=aa,bb,cc
export const requestProductInfoIds = generateGetWithEvn('{{host}}/product/ssd-product-publish/getPublishList');

// 产品制作-产品制作-右侧保存
export const requestProducTreleaseSave = generatePostWithEvn('{{host}}/product/ssd-product-publish/doSave');
export const requestProducDoQuickPublish = generatePostJSONWithEvn('{{host}}/product/ssd-product-publish/doQuickPublish');

// 产品制作-产品制作-右侧发布提交
export const requestProducTreleaseDoPublish = generatePostJSONWithEvn('{{host}}/product/ssd-product-publish/doPublish');

// // 产品模板配置，获取数据源
export const requestProductSourceNameList = generateGetWithEvn('{{host}}/product/ssd-product-source/getSourceList');

//产品模板配置，传入渠道编码获取单个产品标签 
// export const requestProductLabelTree = generateGetWithEvn(dataStaticBase + 'getDetailTree.json');
export const requestProductLabelTree = generateGetWithEvn('{{host}}/product/ssd-product-label-detail/getDetailTree');

//产品模板配置，右侧产品标签树 /ssd/product/ssd-product-source/getSourceLabel?sourceIds=xxx
export const requestProductLabelTrees = generateGetWithEvn('{{host}}/product/ssd-product-source/getSourceLabel');

// 产品制作-中部标签tabs列表
export const requestProductReferenceTabsList = generateGetWithEvn(dataStaticBase + 'reference.json');


// 产品制作-左侧标签tree
// export const requestProductTabTreeList = generateGetWithEvn(dataStaticBase + 'product-tab-tree.json');
export const requestProductTabTreeList = generateGetWithEvn('{{host}}/product/ssd-product-template-type/getDataTree');

// 产品制作-添加分类
export const requestDialogFormProductClassInput = payload => {
    if (!payload.pid) { delete payload.pid }
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-template-type/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-template-type/add')(payload)
};

// 产品制作-删除分类 POST /ssd-product-template-type/delete
export const requestProductClassTreeDel = generatePostWithEvn('{{host}}/product/ssd-product-template-type/delete');

// 产品制作-添加产品模板
export const requestDialogFormProductTemplateInput = payload => {
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-template/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-template/add')(payload)
};

// 产品制作-删除产品模板 POST /ssd-product-template/delete
export const requestProductTemplateTreeDel = generatePostWithEvn('{{host}}/product/ssd-product-template/delete');

// 产品制作 参考资料 常用语
export const requestProductMakePhrase = generateGetWithEvn('{{host}}/product/ssd-data-constant/getList');

// 产品制作 参考资料 历史查看
export const requestProductMakeHistoryList = generateGetWithEvn('{{host}}/product/ssd-product-history/getHistoryList');
// 产品制作 参考资料 文字资料
export const requestProductMakeTextList = generateGetWithEvn('{{host}}/product/ssd-data-constant/getReferDataByType?dataCodeType=TextForecast');
// 产品制作 参考资料 会商通知 
export const requestProductMakeMessageList = generateGetWithEvn('{{host}}/product/ssd-data-constant/getReferData?dataCode=quansheng_hs');
// 产品制作 参考资料 提示语
export const requestProductMakeAlertList = generateGetWithEvn('{{host}}/product/ssd-data-tip/getLatestData');
// 产品制作 参考资料 提示语 弹窗列表
export const requestProductMakeAlertPageList = generateGetWithEvn('{{host}}/product/ssd-data-tip/getLatestList');
// 产品制作 参考资料 提示语 弹窗保存
export const requestProductMakeAlertPageSave = generatePostWithEvn('{{host}}/product/ssd-data-tip/add');

// 产品制作-中部标签业务规范列表
export const requestrulesList = generateGetWithEvn('{{host}}/product/ssd-data-words/getDataList?');

// 产品制作-中部标签业务规范 新增/编辑
export const requestrulesListAdd = payload => {
    if (payload.updateDate) { delete payload.updateDate }
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-data-words/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-data-words/add')(payload)
};
// 产品制作-中部标签业务规范 删除
export const requestrulesListDel = generatePostWithEvn('{{host}}/product/ssd-data-words/delete');


// 产品制作 参考资料 业务规范 类型
export const requestProductMakerulesType = generateGetWithEvn('{{host}}/product/ssd-data-words/getTypeList');

// ----
// 产品属性-分组左侧导航 /ssd-product-template-type/getDataTree
export const requestProductInfoTpyeTreeList = generateGetWithEvn('{{host}}/product/ssd-product-info-type/getDataTree');

// 产品属性，右侧选择产品模板  product/ssd-product-template/getTemplateList?orgId=xxx&type=txt
export const requestProductTemplateList = generateGetWithEvn('{{host}}/product/ssd-product-template/getTemplateList');

// 产品属性，绑定服务用户弹窗  /product/ssd-product-info-user/getBindServiceUser?orgId=xx&productInfoId=xx&channelCodes=xx,xx
export const requestProductUserList = generateGetWithEvn('{{host}}/product/ssd-product-info-user/getBindServiceUser');

// 产品属性，绑定服务用户弹窗绑定提交
export const requestProductUserBound = generatePostJSONWithEvn('{{host}}/product/ssd-product-info-user/add');

// 产品属性，获取岗位 /ssd/business/ssd-business-job/getDataTree?orgId=登录用户所在机构ID
export const requestProductInfoJobs = generateGetWithEvn('{{host}}/business/ssd-business-job/getDataTree');


// 产品制作-添加分类
export const requestDialogFormProductInfoTpyeInput = payload => {
    if (!payload.pid) { delete payload.pid }
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-info-type/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-info-type/add')(payload)
};

// 产品制作-删除分类 POST /ssd-product-info-type/delete
export const requestProductInfoTpyeTreeDel = generatePostWithEvn('{{host}}/product/ssd-product-info-type/delete');

// 产品制作-分类产品 POST /ssd-product-info/delete
export const requestProductInfoTpyeDel = generatePostWithEvn('{{host}}/product/ssd-product-info/delete');


// 产品制作-添加产品
export const requestDialogFormProductInfoInput = payload => {
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-info/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-info/add')(payload)
};

//产品制作 电视预报 最右侧的城市气象网预报接口
export const requestProductCityData = generateGetWithEvn('{{host}}/product/ssd-product-publish/getLatestPublish?queryType=equals&productCode=csybqxw');

//产品制作 电视预报编码转为文字的接口,失去焦点触发
export const requestProductTvTextByCode = generateGetWithEvn('{{host}}/product/ssd-product-publish/getTvTextByCode');

// 产品属性配置，获取详情 GET /ssd-product-info/getOne
export const requestProductInfoTreeItem = payload => generateGetWithEvn('{{host}}/product/ssd-product-info/getOne')(payload).then(res => {
    let resData = res
    if(res.data.list[0].ruleMonth){ //转数组
        let ruleMonth = res.data.list[0].ruleMonth.split(",")
        resData.data.list[0].ruleMonth = ruleMonth
        res.data.list[0].ruleMonth = ruleMonth
    }
    if(res.data.list[0].ruleWeek){
        let ruleWeek = res.data.list[0].ruleWeek.split(",")
        resData.data.list[0].ruleWeek = ruleWeek
        res.data.list[0].ruleWeek = ruleWeek
    }
    if(res.data.list[0].ruleDay){
        let ruleDay = res.data.list[0].ruleDay.split(",")
        resData.data.list[0].ruleDay = ruleDay
        res.data.list[0].ruleDay = ruleDay
    }
    if(res.data.list[0].ruleTime){
        let ruleTime = res.data.list[0].ruleTime.split(",")
        resData.data.list[0].ruleTime = ruleTime
        res.data.list[0].ruleTime = ruleTime
    }
    if(res.data.list[0].ruleMinute){
        let ruleMinute = res.data.list[0].ruleMinute.split(",")
        resData.data.list[0].ruleMinute = ruleMinute
        res.data.list[0].ruleMinute = ruleMinute
    }

    if(res.data.list[0].ruleMonth == null || res.data.list[0].ruleMonth == '' || res.data.list[0].ruleMonth == undefined){ //判空
        resData.data.list[0].ruleMonth = []
        res.data.list[0].ruleMonth = []
    }
    if(res.data.list[0].ruleWeek == null || res.data.list[0].ruleWeek == '' || res.data.list[0].ruleWeek == undefined){
        resData.data.list[0].ruleWeek = []
        res.data.list[0].ruleWeek = []
    }
    if(res.data.list[0].ruleDay == null || res.data.list[0].ruleDay == '' || res.data.list[0].ruleDay == undefined){
        resData.data.list[0].ruleDay = []
        res.data.list[0].ruleDay = []
    }
    if(res.data.list[0].ruleTime == null || res.data.list[0].ruleTime == '' || res.data.list[0].ruleTime == undefined){
        resData.data.list[0].ruleTime = []
        res.data.list[0].ruleTime = []
    }
    if(res.data.list[0].ruleMinute == null || res.data.list[0].ruleMinute == '' || res.data.list[0].ruleMinute == undefined){
        resData.data.list[0].ruleMinute = []
        res.data.list[0].ruleMinute = []
    }
    if(res.data.list[0].ruleWeek == null || res.data.list[0].ruleWeek == '' || res.data.list[0].ruleWeek == undefined){
        resData.data.list[0].ruleWeek = []
        res.data.list[0].ruleWeek = []
    }
    
    if(res.data.list[0].publishChannel){
        let publishChannel = res.data.list[0].publishChannel.split(",")
        resData.data.list[0].publishChannel = publishChannel
        return resData
    }else{
        return res
    }
});

// 产品属性配置，保存详情 POST /ssd-product-info/add
// export const requestProductInfoSave = generatePostWithEvn('{{host}}/product/ssd-product-info/update');
export const requestProductInfoSave = payload => {
    let saveData = {...payload}
    if(saveData.publishChannel){
        saveData.publishChannel = payload.publishChannel.toString()
    }
    if(saveData.ruleMonth){
        saveData.ruleMonth = payload.ruleMonth.toString()
    }
    if(saveData.ruleWeek){
        saveData.ruleWeek = payload.ruleWeek.toString()
    }
    if(saveData.ruleDay){
        saveData.ruleDay = payload.ruleDay.toString()
    }
    if(saveData.ruleTime){
        saveData.ruleTime = payload.ruleTime.toString()
    }
    if(saveData.ruleMinute){
        saveData.ruleMinute = payload.ruleMinute.toString()
    }
    console.log(saveData)
    return saveData.id ? generatePostWithEvn('{{host}}/product/ssd-product-info/update')(saveData) : generatePostWithEvn('{{host}}/product/ssd-product-info/add')(saveData)
};

//产品属性配置，制作时次 保存 POST /ssd-product-info/addMakeTimes
export const requestProductMakeTimesSave = payload => {
    let saveData = {...payload}
    // if(saveData.publishChannel){
    //     saveData.publishChannel = payload.publishChannel.toString()
    // }
    // if(saveData.ruleMonth){
    //     saveData.ruleMonth = payload.ruleMonth.toString()
    // }
    // if(saveData.ruleWeek){
    //     saveData.ruleWeek = payload.ruleWeek.toString()
    // }
    // if(saveData.ruleDay){
    //     saveData.ruleDay = payload.ruleDay.toString()
    // }
    // if(saveData.ruleTime){
    //     saveData.ruleTime = payload.ruleTime.toString()
    // }
    payload.list.forEach((i,index)=>{
        if(i.makeWeek){
            saveData.list[index].makeWeek = i.makeWeek.toString()
        }
        delete saveData.list[index].time
    })
    console.log(saveData)
    return generatePostJSONWithEvn('{{host}}/product/ssd-product-info/addMakeTimes')(saveData);
};

//产品属性配置，获取制作时次 POST /ssd-product-info/getMakeTimes
export const requestProductMakeTimesInfo = generateGetWithEvnToken('{{host}}/product/ssd-product-info/getMakeTimes');



// 产品制作-删除产品 POST /ssd-product-info/delete
export const requestProductInfoTreeDel = generatePostWithEvn('{{host}}/product/ssd-product-info/delete');

// 产品制作 - 状态监控列表
export const requestPublishList = payload => {
    delete payload.time
    return generateGetWithEvnToken('{{host}}/product/ssd-product-publish/getDataByCondition')(payload)
};
// 产品制作 - 状态监控弹窗列表 /ssd-product-task/getTaskDetail
export const requestProductTaskList1 = generateGetWithEvnToken('{{host}}/product//ssd-product-task/getTaskDetail');
// export const requestProductTaskList = generateGetWithEvnToken('{{host}}/product//ssd-product-task/getTaskDetail');
// export const requestProductTaskList = payload => generateGetWithEvnToken('{{host}}/product/ssd-product-task/getList')(payload).then(res => {
//     let resData = {
//         "code": res.code,
//         "success": res.success,
//         "message": res.message,
//         "data": {
//             "list": res.data.detailList
//         }
//     }
//     return resData
// })

//监控下载
export const requesProductMadeDown = generateDownloadWithEvn(`{{host}}/product/ssd-file-operate/download`);

// 产品制作 - 状态监控弹窗统计
export const requestTraceDialogProductTask = generateGetWithEvnToken(`{{host}}/product/ssd-product-task-detail/getStatistics`);

//获取所有渠道信息
export const requestChannelList = generateGetWithEvnToken(`{{host}}/system/ssd-sys-dictionary/getDictListByDictTypeCode?dictTypeCode=Channel`);
// ---

// 获取导航列表
// export const requestRouterList = generateGet(dataStaticBase + 'router.json');
// export const requestRouterList = generateGet(dataStaticBase + 'selectMenuTreeByNowUser.json');
export const requestRouterList = generateGetWithEvnToken('{{host}}/system/ssd-sys-menu/selectMenuTreeByNowUser');

// 获取三级导航
export const requesMenuList = generateGetWithEvnToken('{{host}}/system/ssd-sys-menu/getUserMenuByPid');

// 获取字典管理列表
// export const requestDictList = generateGet(dataStaticBase + 'dict-page.json');
export const requestDictList = generateGetWithEvnToken(`{{host}}/system/ssd-sys-dictionary/selectDictionaryTreeListById`);
// 获取字典左侧导航  selectDictionaryTypeTree
export const requestDictTree = payload => generateGetWithEvnToken('{{host}}/system/ssd-sys-dictionary-type/selectDictionaryTypeTree')(payload).then(res => {
    const dataList = res.data.list
    function remoteData(list) {
        list.map((item) => {
            item.label = item.name
            item.isLeaf = item.ifLeaf
            delete item.ifLeaf
            delete item.name
            if (item.children) {
                remoteData(item.children)
            }
        })
        return list
    }
    const data = remoteData(dataList)
    return {data}
});

// 删除字典管理列表数据
// export const requestDictListDelItem = generateGetWithEvn(dataStaticBase + 'submit-success.json');
export const requestDictListDelItem = generateDeleteWithEvnToken(`{{host}}/system/ssd-sys-dictionary/deleteDictionaryById`);
// 新增字典数据
// export const requestDictInputCreate = generateGetWithEvn(dataStaticBase + 'submit-success.json');
// 修改字典数据
// export const requestDictInputUpdate = generateGetWithEvn(dataStaticBase + 'submit-success.json');

// 字典条目添加，编辑弹窗确认请求 addDictionary
// export const requestDialogFormDictItemInput = generatePostWithEvn(dataStaticBase + 'submit-success.json');
// export const requestDialogFormDictItemInput = generatePostWithEvn(`{{host}}/ssd-sys-dictionary/addDictionary`);
export const requestDialogFormDictItemInput = payload => {
    return payload.id ? generatePostWithEvnToken('{{host}}/system/ssd-sys-dictionary/updateDictionary')(payload) : generatePostWithEvnToken('{{host}}/system/ssd-sys-dictionary/addDictionary')(payload)
};
// 字典类型，根据node获取子结点数据 GET /ssd-sys-dictionary-type/selectDictionaryTypeTree
// export const requestTreeChildrenOfDictNode = payload => generateGetWithEvn('{{host}}/system/ssd-sys-dictionary-type/selectDictionaryTypeTree')(payload).then(res => {
//     const menuList = res.data.list
//     function remoteData(list){
//         list.map((item)=>{
//             item.label = item.name
//             item.isLeaf = item.ifLeaf
//             delete item.ifLeaf
//             delete item.name
//             if(item.children){
//                 remoteData(item.children)
//             }
//         })
//          return list
//     }
//     const data = remoteData(menuList)
//     return {data}
// });
export const requestTreeChildrenOfDictNode = payload => generateGetWithEvn(dataStaticBase + 'common-success.json')(payload.node.data).then(res => {
    const {node} = payload;
    if (node.level === 0) {
        return {data: [{
            id: null,
            label: '数据字典'
        }]};
    }
    // if (node.level > 1) return resolve([]);
    if (node.data.isLeaf) {
        return {data: []};
    }

    const data = [{
        id: "leaf" + node.level,
        label: '叶子结点' + node.level,
        isLeaf: true
    }, {
        id: "zone" + node.level,
        label: '可展开类目' + node.level
    }].map(item => ({
        parentId: node.data.id,
        ...item
    }));

    return {data}
})

// 删除字典类型
export const requestDictListDelType = generateDeleteWithEvnToken('{{host}}/system/ssd-sys-dictionary-type/deleteDictionaryTypeById');

// 字典类型添加子结点，编辑结点弹窗确认请求
export const requestDialogFormDictTypeInput = payload => {
    return payload.id ? generatePostWithEvnToken('{{host}}/system/ssd-sys-dictionary-type/updateDictionaryType')(payload) : generatePostWithEvnToken('{{host}}/system/ssd-sys-dictionary-type/addDictionaryType')(payload)
};

// 地区管理
// 地区信息，根据node获取子结点数据 GET /ssd-sys-area/selectAreaTreeList
export const requestTreeChildrenOfAreaNode = payload => generateGetWithEvnToken('{{host}}/system/ssd-sys-area/selectAreaTreeList')(payload).then(res => {
    const dataList = res.data.list
    function remoteData(list) {
        list.map((item) => {
            item.label = item.name
            item.isLeaf = item.ifLeaf
            delete item.ifLeaf
            delete item.name
            if (item.children) {
                remoteData(item.children)
            }
        })
        return list
    }
    const data = remoteData(dataList)
    return {data}
});

// export const requestTreeChildrenOfAreaNode1 = payload => generateGetWithEvn(dataStaticBase + 'common-success.json')(payload.node.data).then(res => {
//     const {node} = payload;
//     if (node.level === 0) {
//         return {data: [{
//             id: '330000',
//             label: '浙江省'
//         }]};
//     }
//     if (node.level > 5) {
//         return {data: []};
//     }
//     if (node.data.isLeaf) {
//         return {data: []};
//     }

//     const data = [{
//         id: "leaf" + node.level,
//         label: '叶子结点' + node.level,
//         isLeaf: true
//     }, {
//         id: "zone" + node.level,
//         label: '可展开类目' + node.level
//     }].map(item => ({
//         parentId: node.data.id,
//         ...item
//     }));

//     return {data}
// });
// 获取地区管理列表 GET GET /ssd-sys-area/selectAreaTreeListByUser
// export const requestAreaList = generateGet(dataStaticBase + 'area-page.json');
export const requestAreaList = generateGetWithEvnToken('{{host}}/system/ssd-sys-area/selectAreaTreeListByUser');

// 新增地区管理列表数据
export const requestDialogFormAreaItemInput = payload => {
    return payload.id ? generatePostWithEvnToken('{{host}}/system/ssd-sys-area/updateArea')(payload) : generatePostWithEvnToken('{{host}}/system/ssd-sys-area/addArea')(payload)
};

// 删除地区管理列表数据 DELETE /ssd-sys-area/deleteAreaById
export const requestAreaListDelItem = generateDeleteWithEvnToken('{{host}}/system/ssd-sys-area/deleteAreaById');

// 机构管理左侧导航tree GET /ssd-sys-org/selectOrgTreeByUserId
export const requestTreeChildrenOfOrganNode = payload => generateGetWithEvnToken('{{host}}/system/ssd-sys-org/selectOrgTreeByUserId')(payload).then(res => {
    const dataList = res.data.list
    function remoteData(list) {
        list.map((item) => {
            item.label = item.name
            item.isLeaf = item.ifLeaf
            delete item.ifLeaf
            delete item.name
            if (item.children) {
                remoteData(item.children)
            }
        })
        return list
    }
    const data = remoteData(dataList)
    return {data}
});
// 获取机构管理列表
// export const requestOrganList = generateGet(dataStaticBase + 'organ-page.json');
export const requestOrganList = generateGetWithEvnToken('{{host}}/system/ssd-sys-org/selectOrgTreeList');

// 机构弹窗 addOrg
export const requestDialogFormOrganItemInput = payload => {
    return payload.id ? generatePostWithEvnToken('{{host}}/system/ssd-sys-org/updateOrg')(payload) : generatePostWithEvnToken('{{host}}/system/ssd-sys-org/addOrg')(payload)
};

// 删除机构管理列表数据
export const requestOrganListDelItem = generateDeleteWithEvnToken('{{host}}/system/ssd-sys-org/deleteOrgById');

// 菜单管理
// 菜单类型，根据node获取子结点数据
// export const requestTreeChildrenOfDutyPostNode = payload => generateGetWithEvn(dataStaticBase + 'common-success.json')(payload.node.data).then(res => {
export const requestTreeChildrenOfMenuNode = payload => generateGetWithEvn('{{host}}/system/ssd-sys-menu/selectMenuTree')(payload).then(res => {
    const menuList = res.data.list
    function remoteData(list) {
        list.map((item) => {
            item.label = item.name
            item.isLeaf = item.ifLeaf
            delete item.ifLeaf
            delete item.name
            if (item.children) {
                remoteData(item.children)
            }
        })
        return list
    }
    const data = remoteData(menuList)
    return {data}
});
// export const requestTreeChildrenOfMenuNode = payload => generateGetWithEvn(dataStaticBase + 'common-success.json')(payload.node.data).then(res => {
//     const {node} = payload;
//     if (node.level === 0) {
//         return {data: [{
//             id: '',
//             label: '模块管理'
//         }]};
//     }
//     // if (node.level > 1) return resolve([]);
//     if (node.data.isLeaf) {
//         return {data: []};
//     }

//     const data = [{
//         id: "leaf" + node.level,
//         label: '叶子结点' + node.level,
//         isLeaf: true
//     }, {
//         id: "zone" + node.level,
//         label: '可展开类目' + node.level
//     }].map(item => ({
//         parentId: node.data.id,
//         ...item
//     }));

//     return {data}
// });
// 获取菜单管理列表
export const requestMenuList = generateGetWithEvnToken('{{host}}/system/ssd-sys-menu/selectMenuList');
// export const requestMenuList = generateGetWithEvnToken(dataStaticBase + 'selectMenuList.json');

// 删除菜单管理列表数据
export const requestMenuListDelItem = generateDeleteWithEvnToken('{{host}}/system/ssd-sys-menu/deleteMenuById');
// export const requestMenuListDelItem = generateGetWithEvn(dataStaticBase + 'submit-success.json');

// 菜单弹窗提交数据
// export const requestDialogFormMenuItemInput =  generatePostWithEvn('{{host}}/system/ssd-sys-menu/updateMenu');
export const requestDialogFormMenuItemInputAdd = generatePostWithEvnToken('{{host}}/system/ssd-sys-menu/addMenu');
export const requestDialogFormMenuItemInputUpdate = generatePostWithEvnToken('{{host}}/system/ssd-sys-menu/updateMenu');
// export const requestDialogFormMenuItemInput = payload => {
//     return  payload.id? generatePostWithEvnToken('{{host}}/system/ssd-sys-menu/addMenu')(payload): generatePostWithEvnToken('{{host}}/system/ssd-sys-menu/updateMenu')(payload)
// };
// export const requestDialogFormUserItemInput = generateGetWithEvn(dataStaticBase + 'submit-success.json'); addMenu updateMenu

// 用户管理
// 获取用户管理列表
export const requestUserList = generateGetWithEvnToken('{{host}}/system/ssd-sys-user/selectUserTreeList');
export const requestUserList1 = generateGet(dataStaticBase + 'user-page.json');

// 删除用户管理列表数据 /ssd-sys-user/deleteUserById
export const requestUserListDelItem = generateDeleteWithEvnToken('{{host}}/system/ssd-sys-user/deleteUserById');
// 用户弹窗提交数据
export const requestDialogFormUserItemInput = payload => {
    return payload.id ? generatePostWithEvnToken('{{host}}/system/ssd-sys-user/updateUser')(payload) : generatePostWithEvnToken('{{host}}/system/ssd-sys-user/addUser')(payload)
};
// export const requestDialogFormUserItemInput = generatePostWithEvn('{{host}}/system/ssd-sys-user/addUser');
// export const requestDialogFormUserItemInput = generateGetWithEvn(dataStaticBase + 'submit-success.json');

// 角色管理
// 获取角色管理列表 GET /ssd-sys-role/selectRoleTreeList
// export const requestRoleList = generateGet(dataStaticBase + 'role-page.json');
// export const requestRoleList = generateGetWithEvnToken('{{host}}/system/ssd-sys-role/selectRoleTreeList');
export const requestRoleList = generateGetWithEvnToken('{{host}}/system/ssd-sys-role/selectRoleTreeList');

// 获取所有角色 GET /ssd-sys-role/selectRoleList
export const requestRoleListItem = generateGetWithEvnToken('{{host}}/system/ssd-sys-role/selectRoleList');

// 删除角色管理列表数据
// export const requestRoleListDelItem = generateGetWithEvn(dataStaticBase + 'submit-success.json');
export const requestRoleListDelItem = generateDeleteWithEvnToken('{{host}}/system/ssd-sys-role/deleteRoleById');
// 角色弹窗提交数据
// export const requestDialogFormRoleItemInput = generatePostWithEvnToken('{{host}}/system/ssd-sys-role/addRole');
// export const requestDialogFormRoleItemInput = generateGetWithEvn(dataStaticBase + 'submit-success.json');
export const requestDialogFormRoleItemInput = payload => {
    delete payload.createTime
    delete payload.updateTime
    return payload.id ? generatePostWithEvnToken('{{host}}/system/ssd-sys-role/updateRole')(payload) : generatePostWithEvnToken('{{host}}/system/ssd-sys-role/addRole')(payload)
};

// 菜单授权弹窗
export const requestRoleMenuInput = payload => {
    delete payload.rows;
    return generatePostJSONWithEvnToken('{{host}}/system/ssd-sys-role-menu/addRoleMenu')(payload)
}

// 人员授权弹窗
export const requestRoleAuthInput = payload => {
    return generatePostJSONWithEvnToken('{{host}}/system/ssd-sys-role-user/addRoleUser')(payload)
}

// 获取人员授权列表
export const requestRoleAuthList = payload => {
    return generateGetWithEvnToken('{{host}}/system/ssd-sys-role-user/selectRoleUserListByRoleId')(payload)
}

// 菜单授权获取数据
// export const requestAuthList = generateGet(dataStaticBase + 'auth-list.json');
// export const requestAuthList1 = generateGetWithEvnToken('{{host}}/system/ssd-sys-role-menu/selectRoleMenuListByRoleId');
export const requestAuthTreeList = payload => generateGetWithEvnToken('{{host}}/system/ssd-sys-role-menu/selectRoleMenuListByRoleId')(payload).then(res => {
    let resData = {
        "code": res.code,
        "success": res.success,
        "message": res.message,
        "data": {
            "list": res.data
        }
    }
    return resData
})
export const requestAuthList = payload => generateGetWithEvnToken(dataStaticBase + 'router.json')(payload).then(res => {
    // const {node} = payload;
    // if (node.level === 0) {
    //     return {data: [{
    //         id: '',
    //         label: '模块管理'
    //     }]};
    // }
    // // if (node.level > 1) return resolve([]);
    // if (node.data.isLeaf) {
    //     return {data: []};
    // }

    // const data = [{
    //     id: "leaf" + node.level,
    //     label: '叶子结点' + node.level,
    //     isLeaf: true
    // }, {
    //     id: "zone" + node.level,
    //     label: '可展开类目' + node.level
    // }].map(item => ({
    //     parentId: node.data.id,
    //     ...item
    // }));
    let test = {
        "code": 0,
        "success": true,
        "message": "请求成功",
        "data": {
            "list": [{
                "XXXPROP_AUTH_id": 1,
                "XXXPROP_AUTH_NAME": "首页111",
                "XXXPROP_AUTH_CHECKED": true
            }, {
                "XXXPROP_AUTH_id": 2,
                "XXXPROP_AUTH_NAME": "系统管理",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "xtgg-jsgl",
                "XXXPROP_AUTH_NAME_LVL_2": "角色管理",
                "XXXPROP_AUTH_CHECKED_LVL_2": true
            }, {
                "XXXPROP_AUTH_id": 2,
                "XXXPROP_AUTH_NAME": "系统管理",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "xtgg-yhgl",
                "XXXPROP_AUTH_NAME_LVL_2": "用户管理",
                "XXXPROP_AUTH_CHECKED_LVL_2": false
            }, {
                "XXXPROP_AUTH_id": 3,
                "XXXPROP_AUTH_NAME": "产品制作",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "cpzz-lcjk",
                "XXXPROP_AUTH_NAME_LVL_2": "流程监控",
                "XXXPROP_AUTH_CHECKED_LVL_2": false
            }, {
                "XXXPROP_AUTH_id": 3,
                "XXXPROP_AUTH_NAME": "产品制作",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "cpzz-mbpz",
                "XXXPROP_AUTH_NAME_LVL_2": "模板配置",
                "XXXPROP_AUTH_CHECKED_LVL_2": false
            }, {
                "XXXPROP_AUTH_id": 3,
                "XXXPROP_AUTH_NAME": "产品制作",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "cpzz-fwyh",
                "XXXPROP_AUTH_NAME_LVL_2": "服务用户",
                "XXXPROP_AUTH_CHECKED_LVL_2": true
            }, {
                "XXXPROP_AUTH_id": 4,
                "XXXPROP_AUTH_NAME": "值班管理系统",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "zbgg-zblc",
                "XXXPROP_AUTH_NAME_LVL_2": "值班流程配置",
                "XXXPROP_AUTH_CHECKED_LVL_2": true
            },
            {
                "XXXPROP_AUTH_id": 4,
                "XXXPROP_AUTH_NAME": "值班管理系统",
                "XXXPROP_AUTH_CHECKED": true,
                "XXXPROP_AUTH_id_LVL_2": "zbgg-zbgl",
                "XXXPROP_AUTH_NAME_LVL_2": "值班管理",
                "XXXPROP_AUTH_CHECKED_LVL_2": true,
                "XXXPROP_AUTH_CHILDREN": [{
                    "label": "岗位管理",
                    "value": "zbgl-gwgl",
                    "checked": true
                }, {
                    "label": "加班管理",
                    "value": "zbgl-jbgl",
                    "checked": false
                }]
            }
            // {
            //     "XXXPROP_AUTH_id": 4,
            //     "XXXPROP_AUTH_NAME": "值班管理系统",
            //     "XXXPROP_AUTH_CHECKED": true,
            //     "XXXPROP_AUTH_id_LVL_2": "zbgg-zbgl",
            //     "XXXPROP_AUTH_NAME_LVL_2": "值班管理",
            //     "XXXPROP_AUTH_CHECKED_LVL_2": true,
            //     "XXXPROP_AUTH_id_LVL_3": "zbgl-gwgl",
            //     "XXXPROP_AUTH_NAME_LVL_3": "岗位管理",
            //     "XXXPROP_AUTH_CHECKED_LVL_3": true,
            // },
            // {
            //     "XXXPROP_AUTH_id": 4,
            //     "XXXPROP_AUTH_NAME": "值班管理系统",
            //     "XXXPROP_AUTH_CHECKED": true,
            //     "XXXPROP_AUTH_id_LVL_2": "zbgg-zbgl",
            //     "XXXPROP_AUTH_NAME_LVL_2": "值班管理",
            //     "XXXPROP_AUTH_CHECKED_LVL_2": true,
            //     "XXXPROP_AUTH_id_LVL_3": "zbgl-jbgl",
            //     "XXXPROP_AUTH_NAME_LVL_3": "加班管理",
            //     "XXXPROP_AUTH_CHECKED_LVL_3": true,
            // }
            ]
        }
    }
    let test1 = {
        "code": 0,
        "success": true,
        "message": "请求成功",
        "data": {
            list: [
                {
                    XXXPROP_AUTH_id: 1,
                    XXXPROP_AUTH_pid: 1,
                    XXXPROP_AUTH_NAME: "首页111",
                    XXXPROP_AUTH_CHECKED: true
                }
            ]
        }
    }
    res.data.list.forEach(item => {
        test1.data.list.push({
            XXXPROP_AUTH_id: item.id,
            XXXPROP_AUTH_pid: item.pid,
            XXXPROP_AUTH_NAME: item.name,
            XXXPROP_AUTH_CHECKED: item.checked
        })
    })

    let additional = []
    res.data.list.forEach((item, index) => {
        if (item.children) {
            item.children.forEach((i, childIndex) => {
                // i.pid
            })
            // item.children.forEach(items =>{  //拿到第一个children
            //     test1.data.list.forEach((i,index) =>{
            //         if(toString(i.XXXPROP_AUTH_pid) == toString(items.pid)){ //对比一级XXXPROP_AUTH_pid
            //             test1.data.list.splice(index,0,{name:'a'})
            //                     // console.log(index)
            //         }

            //     })
            //     // console.log(items.pid)
            // })
        }
    })

    console.log('123:', test1.data.list)
    return test
});

// 综合管理
// 综合管理首页
// 历史交接班 历史交接班展示-只查看当天的交接班信息
export const requestIntegratedHoneHistoryList = generateGetWithEvn('{{host}}/business/ssd-business-index/SsdBusinessIndexHistory');
// 历史交接班 左侧时间 - 类型数据 /ssd/business/ssd-business-job/getDataTree
export const requestIntegratedHoneOption = generateGetWithEvn('{{host}}/business/ssd-business-job/getDataTree');

// 历史交接班 左侧时间 - 数据 GET /ssd-business-index/getWeekDuty
export const requestIntegratedHoneWeeks = generateGetWithEvn('{{host}}/business/ssd-business-index/getWeekDuty');

// 历史交接班 添加 /ssd-business-handover/addSsd_Business_Handover
export const requestIntegratedHoneHistoryAdd = payload => {
    const node = payload;
    return  generatePostWithEvn('{{host}}/business/ssd-business-handover/addSsd_Business_Handover')(node)
};

// 首页 值班表
// export const requestIntegratedHoneDutyList = generateGet(dataStaticBase + `getSsdBusinessIndexDuty.json`);
export const requestIntegratedHoneDutyList = generateGetWithEvn('{{host}}/business/ssd-business-index/getSsdBusinessIndexDuty');
// 首页 值班流程信息
export const requestIntegratedHoneDutyTaskList = generateGetWithEvn('{{host}}/business/ssd-business-index/getSsdBusinessIndexTask');

// 值班管理
// 岗位管理
// 获取岗位管理列表 GET /ssd-business-job/getSsdBusinessJob
export const requestPostList = generateGetWithEvn('{{host}}/business/ssd-business-job/getSsdBusinessJob');
// export const requestPostList = generateGet(dataStaticBase + 'getSsdBusinessJob.json');

// 岗位 获取值班用户列表
export const requestPostUserList = generateGetWithEvn('{{host}}/business/ssd-business-job/getUserInfo');

// 删除岗位管理列表数据 GET /ssd-business-job/deleteSsdBusinessJob
// export const requestPostListDelItem = generateGetWithEvn(dataStaticBase + 'submit-success.json');
export const requestPostListDelItem = generateGetWithEvn('{{host}}/business/ssd-business-job/deleteSsdBusinessJob');

// 岗位弹窗提交数据 POST /ssd-business-job/addSsdBusinessJob POST /ssd-business-job/updateSsdBusinessJob
export const requestDialogFormPostItemInput = payload => {
    return payload.id ? generatePostWithEvn('{{host}}/business/ssd-business-job/updateSsdBusinessJob')(payload)
        : generatePostWithEvn('{{host}}/business/ssd-business-job/addSsdBusinessJob')(payload)
};
// export const requestDialogFormPostItemInput = generateGetWithEvn(dataStaticBase + 'submit-success.json');

// 历史交接班记录
// 历史交接班记录分页列表数据 GET /ssd-business-handover/ssd_Business_Handover
export const requestHistoryList = generateGetWithEvn('{{host}}/business/ssd-business-handover/ssd_Business_Handover');
// export const requestHistoryList = generateGet(dataStaticBase + 'history-page.json'); GET /ssd-business-handover/getType

// 历史交接班类型
export const requestHistoryGetType = generateGetWithEvn('{{host}}/business/ssd-business-handover/getType');

// 排班管理
// 排班管理分页列表数据 GET /ssd-business-duty/getSsdBusinessDuty
export const requestSchedulingList = generateGetWithEvn('{{host}}/business/ssd-business-duty/getSsdBusinessDuty');
// export const requestSchedulingList = generateGet(dataStaticBase + 'scheduling.json');
// export const requestSchedulingList = payload => generateGetWithEvn('{{host}}/business/ssd-business-duty/getSsdBusinessDuty')(payload).then(res => {
//     const menuList = res.data.list
//     // function remoteData(list){
//     //     list.map((item)=>{
//     //         item.label = item.name
//     //         item.isLeaf = item.ifLeaf
//     //         delete item.ifLeaf
//     //         delete item.name
//     //         if(item.children){
//     //             remoteData(item.children)
//     //         }
//     //     })
//     //      return list
//     // }
//     // const data = remoteData(menuList)
//     console.log('menuList::',res.data.list.list)
//     return {menuList}
// });
// export const requestSchedulingList = generateGet(dataStaticBase + 'scheduling-page.json');

// 排班管理-表头 getDutyUser
export const requestSchedulingDutyUser = generateGetWithEvn('{{host}}/business/ssd-business-duty/getDutyUser');

// 排班管理-首席 用户option数据 getUserForJob?orgId=xxxxxxxxxxxx&jobCode=shouxi
export const requestSchedulingSxOptionList = generateGetWithEvn('{{host}}/business/ssd-business-job/getUserForJob');

// 排班管理-非首席 岗位option数据 getDataTree?orgId=xxxxxxxxxx&isNormal=0
export const requestSchedulingOptionList = generateGetWithEvn('{{host}}/business/ssd-business-job/getDataTree');

// 排班管理-编辑提交数据  POST /ssd-business-duty/updateSsdBusinessDuty
export const requestSchedulingUpdate = generatePostJSONWithEvn('{{host}}/business/ssd-business-duty/updateSsdBusinessDuty');

// 排班导入  POST /ssd-business-duty/saveExcel
// export const requestSchedulingUpload = generateGet(commonSuccess);
export const requestSchedulingUpload = payload => generateGetWithEvn(commonSuccess)(payload).then(res => {
    let param = transformUrlWithEnv(url)
    console.log(param)
    return res
});

// 排班导出  GET /ssd-business-duty/OutSsdBusinessDutyExcel
export const requestSchedulingDownload = generateDownloadWithEvn(`{{host}}/business/ssd-business-duty/OutSsdBusinessDutyExcel`);

// 考勤管理
// 考勤管理分页列表数据
export const requestAttendanceList = generateGetWithEvn('{{host}}/business/ssd-business-check/getSsdBusinessCheck');
// export const requestAttendanceList = generateGet(dataStaticBase + 'attendance-page.json');

// 考勤管理编辑 POST /ssd-business-check/updateSsdBusinessCheck
export const requestAttendanceUpdate = generatePostJSONWithEvn('{{host}}/business/ssd-business-check/updateSsdBusinessCheck');
// export const requestAttendanceUpdate = generateGet(dataStaticBase + 'attendance-page.json');

// 加班管理
// 加班管理分页列表数据
// export const requestOvertimeList = payload=> generateGet(dataStaticBase + 'overtime-page.json')(payload).then(res=>{
//         const dates = payload.dates;
//         return res
// });
export const requestOvertimeList1 = generateGet(dataStaticBase + 'overtime-page.json');
export const requestOvertimeList = generateGetWithEvn('{{host}}/business/ssd-business-overtime/getSsdBusinessOvertime'); ;

// 加班管理-编辑提交数据 POST /ssd-business-overtime/updateSsdBusinessOvertime
export const requestOverUpdate = generatePostJSONWithEvn('{{host}}/business/ssd-business-overtime/updateSsdBusinessOvertime');

// 下载夜班表格
export const requestDialogFormNightDownload = generateDownload(commonSuccess);
// 获取夜班统计列表数据
// export const requestNightStaticsList = generateGet(dataStaticBase + `night-statistics-page.json`);
export const requestNightStaticsList = generateGetWithEvn('{{host}}/business/ssd-business-overtime/getSsdBusinessOvertimeCount');

// 获取夜班发放列表数据
export const requestNightDistributionList = generateGet(dataStaticBase + `night-distribution-page.json`);
// 下载应急响应表格
export const requestDialogFormNightEmergencyDownload = generateDownload(commonSuccess);

// 值班流程配置
// 岗位流程配置
// 岗位，根据node获取子结点数据 generateGetWithEvn(dataStaticBase + 'product-tree.json');
// export const requestTreeChildrenOfDutyPostNode = generateGetWithEvn(dataStaticBase + 'product-tree.json');
export const requestTreeChildrenOfDutyPostNode = generateGetWithEvn('{{host}}/business/ssd-business-job/getDataTree');
// export const requestTreeChildrenOfDutyPostNode = payload => generateGetWithEvn(dataStaticBase + 'common-success.json')(payload.node.data).then(res => {
//     const {node} = payload;
//     if (node.level === 0) {
//         return {data: [{
//             id: '',
//             label: '岗位'
//         }]};
//     }
//     // if (node.level > 1) return resolve([]);
//     if (node.data.isLeaf) {
//         return {data: []};
//     }

//     const data = [{
//         id: "leaf" + node.level,
//         label: '叶子结点' + node.level,
//         isLeaf: true
//     }, {
//         id: "zone" + node.level,
//         label: '可展开类目' + node.level
//     }].map(item => ({
//         parentId: node.data.id,
//         ...item
//     }));

//     return {data}
// });
// 获取岗位流程配置列表
// export const requestDutyPostList = generateGet(dataStaticBase + 'duty-post-page.json');
export const requestDutyPostList = payload => generateGetWithEvn('{{host}}/business/ssd-business-job-task/getJobTaskById')(payload).then(res => {
    return res
});

// 删除岗位流程配置列表数据
export const requestDutyPostListDelItem = generatePostWithEvn('{{host}}/business/ssd-business-job-task/deleteSsdBusinessJobTask');
// export const requestDutyPostListDelItem = generateGetWithEvn(dataStaticBase + 'submit-success.json');
// 岗位流程配置弹窗提交数据
// export const requestDialogFormDutyPostItemInput = generateGetWithEvn(dataStaticBase + 'submit-success.json');
// export const requestDialogFormDutyPostItemInput = generatePostJSONWithEvn('{{host}}/business/ssd-business-job-task/addSsdBusinessJobTask');

export const requestDialogFormDutyPostItemInput = payload => {
    const node = payload;
    // node.remindDay.length == 0? node.remindDay=null:node.remindDay=node.remindDay
    // node.remindWeek.length == 0? node.remindWeek=null:node.remindWeek=node.remindWeek
    // node.remindMonth.length == 0? node.remindMonth=null:node.remindMonth=node.remindMonth
    delete node.XXXPROP_DUTY_POST_X3
    console.log(node)
    return node.id ? generatePostJSONWithEvn('{{host}}/business/ssd-business-job-task/updateSsdBusinessJobTask')(node) : generatePostJSONWithEvn('{{host}}/business/ssd-business-job-task/addSsdBusinessJobTask')(node)
};

// 值班流程配置
// 获取值班流程配置列表
export const requestDutySchedulingList = generateGetWithEvn('{{host}}/business/ssd-business-duty-task/getSsdBusinessDutyTaskList');
// export const requestDutySchedulingList = generateGet(dataStaticBase + 'duty-scheduling-page.json');
// 删除值班流程配置列表数据 ssd-business-duty-task/deleteSsdBusinessDutyTask
export const requestDutySchedulingListDelItem = generatePostWithEvn('{{host}}/business/ssd-business-duty-task/deleteSsdBusinessDutyTask');
// export const requestDutySchedulingListDelItem = generateGetWithEvn(dataStaticBase + 'submit-success.json');
// 值班流程配置弹窗提交数据 POST
export const requestDialogFormDutySchedulingItemInput = payload => {
    const node = payload;
    delete node.XXXPROP_DUTY_SCHEDULING_X3
    console.log(node)
    return node.id ? generatePostJSONWithEvn('{{host}}/business/ssd-business-duty-task/updateSsdBusinessDutyTask')(node) : generatePostJSONWithEvn('{{host}}/business/ssd-business-duty-task/addSsdBusinessDutyTask')(node)
};
// export const requestDialogFormDutySchedulingItemInput = generateGetWithEvn(dataStaticBase + 'submit-success.json');

// 服务用户

// 获取服务用户左侧导航 GET /ssd-service-user-type/getDataTree
export const requestServiceUserTreeList = generateGetWithEvn('{{host}}/product/ssd-service-user-type/getDataTree');

// 获取服务用户列表
// export const requestServiceUserList = generateGet(dataStaticBase + 'product-service-user-list.json');
export const requestServiceUserList = generateGetWithEvn(`{{host}}/product/ssd-service-user/getList`);

// 获取服务用户列表删除
export const requestServiceUserListDelItem = generatePostWithEvn('{{host}}/product/ssd-service-user/delete');

// 服务用户弹窗
// export const requestServiceUserList = generateGet(dataStaticBase + 'product-service-user-list.json');
export const requestDialogFormServiceUserItemInput = payload => {
    delete payload.createTime
    delete payload.updateTime
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-service-user/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-service-user/add')(payload)
};

// 服务用户分类弹窗
// export const requestServiceUserList = generateGet(dataStaticBase + 'product-service-user-list.json');
export const requestDialogFormServiceUserInput = payload => {
    payload.pid == 'null' ? delete payload.pid : payload.pid = payload.pid
    delete payload.createTime
    delete payload.updateTime
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-service-user-type/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-service-user-type/add')(payload)
};

// 服务用户分类删除
export const requestServiceUserTreeListDelItem = generatePostWithEvn('{{host}}/product/ssd-service-user-type/delete');

// 产品数据源
// 产品数据源列表
export const requestProductSourceList = generateGetWithEvnToken(`{{host}}/product/ssd-product-source/getList`);

// 产品数据源弹窗
export const requestDialogFormProductSourceInput = payload => {
    delete payload.createTime
    delete payload.updateTime
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-source/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-source/add')(payload)
};

// 产品数据源删除
export const requestProductSourceListDelItem = generatePostWithEvn('{{host}}/product/ssd-product-source/delete');

// 产品标签
// 获取产品标签左侧导航
export const requestProductLabelTreeList = payload => generateGetWithEvn('{{host}}/product/ssd-product-label-type/getDataTree')(payload).then(res => {
    let treeData = res
    function changeName(tree) {
        tree.map(item => {
            item.label = item.name
            if (item.children) {
                changeName(item.children)
            }
        })
    }
    changeName(treeData.data.list)
    return treeData
})


// export const requestProductLabelTreeList = generateGetWithEvn(dataStaticBase + 'product-tree.json');

// 获取产品标签列表
export const requestProductLabelList = generateGetWithEvn('{{host}}/product/ssd-product-label-detail/getList');

// 获取产品标签列表删除
export const requestProductLabelListDelItem = generatePostWithEvn('{{host}}/product/ssd-product-label-detail/delete');

// 产品标签弹窗
export const requestDialogFormProductLabelItemInput = payload => {
    // const node = payload;
    delete payload.createTime
    delete payload.updateTime
    // console.log(node)
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-label-detail/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-label-detail/add')(payload)
};

// 产品标签分类弹窗
export const requestDialogFormProductLabelTreeItemInput = payload => {
    // const node = payload;
    // delete payload.createTime
    // delete payload.updateTime
    delete payload.label
    console.log(payload)
    return payload.id ? generatePostWithEvn('{{host}}/product/ssd-product-label-type/update')(payload) : generatePostWithEvn('{{host}}/product/ssd-product-label-type/add')(payload)
};

// 产品标签分类删除  POST /ssd-product-label-type/delete
export const requestProductLabelTreeListDelItem = generatePostWithEvn('{{host}}/product/ssd-product-label-type/delete');

const transformDetailListOfTaceDialog = ({list, payload}) => (list || []).filter(e => e.publishChannel == payload.publishChannel).map(e => ({...e,
    result: (["success",
        "fail",
        "pushing",
        "push-success",
        "push-fail"])[e.result]}));
const transformResOfTaceDialog = payload => res => {
    res.data.list = transformDetailListOfTaceDialog({list: res.data.detailList, payload});
    return res
}

//天气概览 首页
//左侧 天气警报
export const requestWarningAlarm = generateGetWithEvn('{{host}}/warning/ssd-early-alarm-publish/getOverView');

//左侧 市县警报
export const requestWarningEarly = generateGetWithEvn('{{host}}/warning/ssd-early-warning-publish/getOverView');

//左侧 短期/短临 预报
export const requestWarningShort = generateGetWithEvn('{{host}}/product/ssd-product-publish/getLatestPublish?queryType=like&productCode=DQYB');
export const requestWarningTemporary = generateGetWithEvn('{{host}}/product/ssd-product-publish/getLatestPublish?queryType=like&productCode=DSLJYB');

//左侧 十天预报
export const requestWarningForecast = generateGetWithEvn('{{host}}/product/ssd-product-publish/getLatestPublish?queryType=like&productCode=STTQ');

//左侧 城市预报
export const requestWarningCity = generateGetWithEvn('{{host}}/product/ssd-product-publish/getLatestPublish?queryType=like&productCode=CSYBQXW');

//底部 chart.json
export const requestWarningObj = generateGet(dataStaticBase + 'wind-barb-hobart.json');

//底部 降水 风力 能见度
export const requestWarningBottomTabList = generateGet(dataStaticBase + 'situather-tab-monitoring.json');

// 天气警报
// 天气警报-天气警报追溯 列表
// export const requestTracewarningList = generateGet(dataStaticBase + 'warning-trace-page.json');
export const requestTracewarningList = generateGetWithEvnToken(`{{host}}/warning/ssd-early-alarm-publish/getDataByCondition`);
// 天气警报-天气警报追溯 弹窗 状态列表
// export const requestTraceDialogList = generateGet(dataStaticBase + 'warning-trace-dialog-page.json');
export const requestTraceDialogList = payload => generateGetWithEvnToken(`{{host}}/warning/ssd-early-alarm-publish-detail/getList`)(payload).then(transformResOfTaceDialog(payload))
// 预警信号追溯 弹窗 状态列表
export const requestTraceDialogListAlarm = payload => generateGetWithEvnToken(`{{host}}/warning/ssd-early-warning-publish-detail/getList`)(payload).then(transformResOfTaceDialog(payload))
// 弹窗统计信息
export const requestTraceDialogStatisticsalarm = generateGetWithEvnToken(`{{host}}/warning/ssd-early-warning-publish-detail/getStatistics`);
// 弹窗统计信息
export const requestTraceDialogStatisticswarning = generateGetWithEvnToken(`{{host}}/warning/ssd-early-alarm-publish-detail/getStatistics`);

// 天气警报制作
// 获取已发送预警列表
// export const requestGetAlarms = generateGet(dataStaticBase + 'alarms.json');
export const requestGetAlarms = generateGetWithEvnToken(`{{host}}/warning/ssd-early-warning-publish/getDataOfToday`);

// 获取期号
// export const requestGetAlarms = generateGet(dataStaticBase + 'alarms.json');
export const requestGetIssue = generateGetWithEvnToken(`{{host}}/warning/ssd-early-alarm-publish/getIssue`);

// 获取弹窗用户列表
// export const requestMakeDialogTabTreeList = generateGet(dataStaticBase + 'make-dialog-tab-tree.json');
export const requestMakeDialogTabTreeList = payload => generateGetWithEvnToken('{{host}}/product/ssd-service-user-type/getServiceUserTree')(payload).then(res => {
    // res.data.list = res.data.treeList;
    return res
})
// 获取左侧列表
export const requestSelectorList = generateGetWithEvnToken(`{{host}}/warning/ssd-early-alarm/getAll`);
export const requestSelectorListAlarm = generateGetWithEvnToken(`{{host}}/warning/ssd-early-warning/getAll`);
// 弹窗发布确认
export const requestDialogFormWeatherSend = payload => {
    const {list, ...payloadAdd} = payload;
    return generatePostWithEvn('{{host}}/warning/ssd-early-alarm-publish/add')(payloadAdd).then(res => {
        list.forEach(e => {
            e.publishId = res.data.id
        })
        return generatePostJSONWithEvn('{{host}}/warning/ssd-early-alarm-publish/addTaskAndDetail')({list:list})
    })
};
// 弹窗发布确认-预警
export const requestDialogFormAlarmSend = payload => {
    const {list, ...payloadAdd} = payload;
    return generatePostWithEvn('{{host}}/warning/ssd-early-warning-publish/add')(payloadAdd).then(res => {
        list.forEach(e => {
            e.publishId = res.data.id
        })
        return generatePostJSONWithEvn('{{host}}/warning/ssd-early-warning-publish/addTaskAndDetail')(list)
    })
};

// 天气警报-预警信号追溯 列表
// export const requestTracealarmList = generateGet(dataStaticBase + 'warning-trace-alarm-page.json');
export const requestTracealarmList = generateGetWithEvnToken(`{{host}}/warning/ssd-early-warning-publish/getDataByCondition`);
// 获取查询选项
export const requestWeatherTypeOptions = payload => generateGetWithEvnToken(`{{host}}/warning/ssd-early-alarm/getList`)(payload).then(res => {
    const data = res.data || {};
    const list = data.list || [];
    data.list = list.map(e => ({label: e.name, value: e.code}));
    return res
})

// 应发预警提醒 - 实发预警提醒
export const requestMonitorAllList = generateGetWithEvnToken(`{{host}}/warning/ssd-early-warning-monitor/getDataByCondition`);
