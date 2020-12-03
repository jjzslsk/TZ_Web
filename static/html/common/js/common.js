// Plane section temporal sounding
//引用 http请求 类
const http = new EasyHttp;
function getData(url,port,param){
    return new Promise((resolve, reject) => {http.get(url + port,urlEncode(param),function (res) {if(res.success){resolve(res)}else{layer.msg(res.message, {icon: 5});reject(res)}},function (err) {layer.msg('错误', {icon: 5});reject(err)})})
}
function postJson(url,port,param){
    return new Promise((resolve, reject) => {http.postJson(url + port,urlEncode(param),function (res) {if(res.success){resolve(res)}else{layer.msg(res.message, {icon: 5});reject(res)}},function (err) {layer.msg('错误', {icon: 5});reject(err)})})
}
function postForm(url,port,param){
    return new Promise((resolve, reject) => {http.postForm(url + port,urlEncode(param),function (res) {if(res.success){resolve(res)}else{layer.msg(res.message, {icon: 5});reject(res)}},function (err) {layer.msg('错误', {icon: 5});reject(err)})})
}
function delData(url,port,param){
    return new Promise((resolve, reject) => {http.delData(url + port,urlEncode(param),function (res) {if(res.success){resolve(res)}else{layer.msg(res.message, {icon: 5});reject(res)}},function (err) {layer.msg('错误', {icon: 5});reject(err)})})
}

//格式URL
let urlEncode = function(param, key, encode) {
    if (param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '='  + ((encode==null||encode) ? encodeURIComponent(param) : param); 
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
            paramStr += urlEncode(param[i], k, encode)
        }
    }
    return paramStr;
}

// $(function() {// 页面加载之后调用
//     $.ajax({
//         type: "get",    //请求方式为get，也可以是设置为post
//         url: "roleList.json",     //所要获取的json文件相对地址，注意不要写错了，我这里放在同一个目录下的
//         async: true,　　　　　　　　//是否为异步请求，ture为异步请求，false为同步请求
//         success: function(d) {    //当请求之后调用。传入返回后的数据，以及包含成功代码的字符串
            
//         }
//     });
// });