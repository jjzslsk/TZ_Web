import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
import qs from 'qs'
import {
    baseURL
} from '@/config'
// import {
//     catchError
// } from '@/util'
// import router from '../router'

import Vue from 'vue'
const showMessageOnVue = message => Vue.$message({
    message,
    type: 'error'
})
let proGoLogin;
const CancelToken = axios.CancelToken;
let source = CancelToken.source();

export const catchError = function(error) {
    const {
        config: {
            noShowMessage
        } = {}
    } = error;
    const showMessage = noShowMessage ? () => {} : showMessageOnVue
    if (error.response) {
        const infos = {
            '400': () => {
                // Vue.$message({
                //     message: error.response.data.message || '请求参数异常',
                //     type: 'error'
                // });
                // Vue.$toast({
                //     position: 'top',
                //     message: error.response.data.message || '请求参数异常'
                //     // iconClass: 'icon icon-success'
                // })
                // MessageBox.alert(error.response.data.message || '请求参数异常').then(action => {
                //     console.log(action);
                // });
                showMessage(error.response.data.message || '请求参数异常')
            },
            '401': () => {
                // sessionStorage.removeItem('user')
                // Vue.$message({
                //     message: error.response.data.message || '密码错误或账号不存在！',
                //     type: 'warning',
                //     onClose: function() {
                //         location.reload();
                //     }
                // });
                // Vue.$toast({
                //     position: 'top',
                //     message: error.response.data.message || '密码错误或账号不存在！'
                //     // iconClass: 'icon icon-success'
                // })
                // MessageBox.alert(error.response.data.message || '密码错误或账号不存在！').then(action => {
                //     location.reload();
                // });
                if (!proGoLogin && mainVue.$route.name != 'welcome-login') {
                    showMessage(error.response.data.message || '请先登录')
                    proGoLogin = mainVue.$route.fullPath;
                    source.cancel();
                    source = CancelToken.source();
                    window.mainVue.$router.push({
                        name: 'welcome-login',
                        query: {
                            'rf': encodeURIComponent(mainVue.$route.fullPath)
                        }
                    }, res => {
                        proGoLogin = null;
                        return res;
                    }, err => {
                        proGoLogin = null;
                        return Promise.reject(err)
                    })
                }
                // debugger
            },
            '403': () => {
                // sessionStorage.removeItem('user')
                // Vue.$message({
                //     message: error.response.data.message || '无访问权限，请联系企业管理员',
                //     type: 'warning'
                // });
                // Vue.$toast({
                //     position: 'top',
                //     message: error.response.data.message || '无访问权限，请联系管理员！'
                //     // iconClass: 'icon icon-success'
                // })
                // MessageBox.alert(error.response.data.message || '无访问权限，请联系企业管理员！').then(action => {
                //     console.log(action);
                // });
                showMessage(error.response.data.message || '密码错误或账号不存在！')
            }
        }
        if (infos.hasOwnProperty(`${error.response.status}`)) {
            infos[`${error.response.status}`]()
        } else {
            // Vue.$message({
            //     message: error.response.data.message || '服务端异常，请联系技术支持',
            //     type: 'error'
            // });
            // Vue.$toast({
            //     position: 'top',
            //     message: error.response.data.message || '服务端异常，请联系技术支持。'
            //     // iconClass: 'icon icon-success'
            // })
            // MessageBox.alert(error.response.data.message || '服务端异常，请联系技术支持。').then(action => {
            //     console.log(action);
            // });
            showMessage(error.response.data.message || '服务端异常，请联系技术支持')
        }
    } else {
        if (error.message === 'Network Error') {
            showMessage(`网络错误，请稍后再试`)
        } else {
            showMessage(`请求异常，请联系技术支持(${error.message})`)
        }
    }
    return Promise.reject(error)
}


const instance = axios.create({
    baseURL,
    timeout: 30000
})

const checkStatus = response => {
    // console.log('check')
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response) {
        if (response.status === 200 || response.status === 304 || response.status === 400) {
            if (response.data.success) {
                return response.data
                // 如果不需要除了data之外的数据，可以直接 return response.data
            } else {
                catchError({
                    response
                })
                return Promise.reject(response.data)
            }
        } else if (response.status === 404 || response.status === 500 || response.status === 501) {
            console.log('response.status', response.status)
            // router.replace({
            //     path: '/404page'
            // });
            return Promise.reject(response.data)
        }
    }
}

function timingLogin(config){
   return new Promise((resolve, reject) => {
    const indexKey = window.location.href.indexOf("/#/")
    let cut = window.location.href.substring(indexKey)
    let url1 = '/#/situation-page?key=%2Fsituation-page'
    let url2 = '/#/welcome-trace/alarm'
    function timingLoginFn() {
        if (`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`  == '07:50:00') {
            alert("登录超时，请重新登录！ 0750")
            sessionStorage.clear()
            window.location.href="/";
            reject('reject')
            return
        }else{
            resolve('resolve')
        }
    }

        if(config.url == '/integration/system/ssd-sys-user/login' || config.url == '/integration/system/ssd-sys-user/logout' || pathCheck()){
            resolve('resolve')
        }else{
            timingLoginFn()
        }
    });
}


//路径过滤 true 为包含过滤
function pathCheck (){
    const filterUrl = [
        '/#/welcome-login',
        '/#/welcome-login?key=%2Flogin',
        '/#/html-page',

        '/#/situation-page',
        '/#/situation-page?key=%2Fsituation-page',
        '/#/html-page?key=%2Fforecast',
        '/#/html-page?key=%2FTZ_3D',
        '/#/html-page?key=%2FTZ_typhoon',
        '/#/html-page?key=%2Freminder',
        '/#/html-page?key=%2Fremindergis',
        '/#/html-page?key=%2FsuddenWeather',
        '/#/html-page?key=%2FQJT',

        '/#/welcome-trace/alarm'
    ]
    let indexKey = window.location.href.indexOf("/#/")
    let cut = window.location.href.substring(indexKey)
    let routeUrl = filterUrl.find(item => {
        return cut.indexOf(item) != -1 == true
    });
    return routeUrl? true:false
}
console.log('pathCheck:',pathCheck())

// targetHour   目标时间  小时
// targetSec   目标时间  分钟
function setRegular(targetHour,targetSec){
var timeInterval,nowTime,nowSeconds,targetSeconds
nowTime = new Date()
// 计算当前时间的秒数
nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()
// 计算目标时间对应的秒数
targetSeconds =  targetHour * 3600 + targetSec * 60
//  判断是否已超过今日目标小时，若超过，时间间隔设置为距离明天目标小时的距离
timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds: targetSeconds + 24 * 3600 - nowSeconds
setTimeout(getProductFileList,timeInterval * 1000)
}
function getProductFileList(){
console.log('时间到啦')
setTimeout(getProductFileList,24*3600 * 1000)//之后每天调用一次

//退出操作
if(!pathCheck()){
    alert("登录超时，请重新登录！0750")
    sessionStorage.clear()
    window.location.href="/";
}
}
setRegular(7,50);


function overtime10(config){
    return new Promise((resolve, reject) => {
        //10小时超时登录 （分钟 60*1000）（小时 60*60*1000）（天 24*60*60*1000）
        function checkTimeout10() {
            let timeOut = 10 * 60*60*1000  //设置超时时间: 10小时
            let currentTime = new Date().getTime()//更新当前时间
            let lastTime = localStorage.getItem("lastTime10");//登录时间
            if (currentTime - lastTime > timeOut) {
                alert("登录超时，请重新登录！010")
                sessionStorage.clear()
                window.location.href="/";
                reject('reject')
            }else{
                resolve('resolve')
            }
        }
        if(config.url == '/integration/system/ssd-sys-user/login' || config.url == '/integration/system/ssd-sys-user/logout' || pathCheck()){
            resolve('resolve')
        }else{
            checkTimeout10()
        }
    });
}

function overtime04(config){
    return new Promise((resolve, reject) => {
        //4小时超时登录 （分钟 60*1000）（小时 60*60*1000）（天 24*60*60*1000）
        function checkTimeout04() {
            let timeOut = 4 * 60*60*1000  //设置超时时间: 10小时
            let currentTime = new Date().getTime()//更新当前时间
            let lastTime = localStorage.getItem("lastTime04");//登录时间
            if (currentTime - lastTime > timeOut) {
                alert("登录超时，请重新登录！004")
                sessionStorage.clear()
                window.location.href="/";
                reject('reject')
                return
            }else{
                localStorage.setItem("lastTime04",new Date().getTime())
                resolve('resolve')
            }
        }
        if(config.url == '/integration/system/ssd-sys-user/login' || config.url == '/integration/system/ssd-sys-user/logout' || pathCheck()){
            resolve('resolve')
        }else{
            checkTimeout04()
        }
    });
}


const generateRequest = config => async (param, {
    target
} = {}) => {
    // let loginTiming = await timingLogin(config)
    let over10 = await overtime10(config)
    let over04 = await overtime04(config)
    // if(over10 == 'reject'|| over04 == 'reject' || loginTiming == 'reject') return
    if(over10 == 'reject'|| over04 == 'reject') return

    const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
    let data
    if(!loginInfo){
        data = {
            ...param
        }
    }else{
        data = {
            loginAreaId:loginInfo.areaId? loginInfo.areaId:null,
            loginOrgId:loginInfo.orgId? loginInfo.orgId:null,
            loginUserId:loginInfo.id? loginInfo.id:null,
            ...param
        }
    }
    
    try {
        const info = {
            ...config,
            target,
            cancelToken: source.token
        }
        if (info.paramsSerializer) {
            info.data = info.paramsSerializer(data)
        } else {
            if (typeof(data) !== 'undefined') {
                if (info.method === 'post') {
                    info.data = data;
                } else {
                    // get 请求时带的参数
                    info.params = data
                }
            }
        }
        if(info.setHeaders){
            info.headers=info.setHeaders()
        }
        const res = await instance(info)
        return checkStatus(res)
    } catch (err) {
        console.error(err)
        if (err.message) {
            catchError(err)
        }
        return Promise.reject(err)
    }
}
const autoMergeOptionsAndConfig = (
    options, config) => {
    if (typeof(config) === 'string') {
        config = {
            url: config
        }
    }
    return {
        ...options,
        ...config
    }
}
export const generatePost = config => generateRequest(autoMergeOptionsAndConfig({
    method: 'post',
    paramsSerializer: function(params) {
        return qs.stringify(params)
    },
    timeout: 100000
}, config))
export const generatePostJSON = config => generateRequest(autoMergeOptionsAndConfig({
    method: 'post',
    timeout: 100000
}, config))
export const generateGet = config => generateRequest(autoMergeOptionsAndConfig({
    method: 'get',
}, config))
export const generateDelete = config => generateRequest(autoMergeOptionsAndConfig({
    method: 'delete',
}, config))

export const generateDownload = url => data => Promise.resolve({data: window.open(`${url}?${qs.stringify(data)}`)})

let requestCountAll = 0;
// 设置请求进度条
instance.interceptors.request.use(
    config => {
        // loading
        let process = 0.4
        const {
            target
        } = config
        requestCountAll++
        if (target) {
            if (typeof(target.requestCount) !== 'undefined') {
                target.requestCount++
            } else {
                target.requestCount = 1
            }
        }
        process = 1 / (requestCountAll + 1.2)
        // NProgress.set(process)
        mainVue.$emit("loading", requestCountAll)
        return config
    },
    error => catchError(error)
)

const checkResponseInfo = responseInfo => {
    let isDone = true
    let target;
    if (responseInfo.config) {
        target = responseInfo.config.target
    }
    requestCountAll--
    if (target) {
        target.requestCount--
        if (target.requestCount < 0) {
            target.requestCount = 0
        }
    }
    if (requestCountAll > 0) {
        isDone = false
        // NProgress.set(1 / (requestCountAll + 1.2))
    } else {
        // default isDone = true
        requestCountAll = 0;
    }
    if (isDone) {
        mainVue.$emit("all-loaded")
        // NProgress.done()
    }
}
instance.interceptors.response.use(
    response => {
        checkResponseInfo(response)
        return response
    },
    error => {
        checkResponseInfo(error)
        // return catchError(error)
        return Promise.reject(error)
    }
)
