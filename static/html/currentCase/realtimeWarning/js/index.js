//引用 http请求 类
const http = new EasyHttp;
function getData(url,param){
    return new Promise((resolve, reject) => {http.get(url, param,function (res) {resolve(res)},function (err) {layer.msg('错误', {icon: 5});reject(err)},)});
}

// function getData(param){
//     http.get('' + '', '',
//         function (res) {
//             console.log(res)
//         },
//         function (err) {
//             console.log(err)
//         }
//     )
//  }

 function postJson(param){
    http.postJson('' + '', '',
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

 function postForm(param){
    http.postForm(system_url + '/ssd/system/ssd-sys-role/addRole', param,
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

 function delData(param){
    http.delete(system_url + '/ssd/system/ssd-sys-role/deleteRoleById', param,
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

 function putData(param){
    http.put(system_url + '/ssd/product/ssd-product-publish/doPublish', param,
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

// $("#getExport").click(function(){
//    var param = `&pageIndex=1&pageSize=10`
//     //    getData('http://172.21.158.161:4001','/ssd/system/ssd-sys-role/selectRoleTreeList?',param)
//        getData('http://jsonplaceholder.typicode.com/posts','','')
//        .then(res=>console.log('res:',res))
//        .catch(err => console.log('err:',err))
// });

//使用http 请求方法
$("#getExport").click(function(){
    var param = `&pageIndex=1&pageSize=10`
    getExport(param)
})

$("#formExport").click(function(){
    postForm({name:'111',code:'222'})
});

$("#formExport").click(function(){
    postForm({name:'111',code:'222'})
});
$("#jsonExport").click(function(){
    postJson({user:'222',code:'333'})
});
$("#delExport").click(function(){
    delData({id:"1f6c4caa9b8648f28be4fce9e888eccb"})
});
$("#putExport").click(function(){
    putData({user:'小明',id:'123'})
});

$("#click_browse").click(function(){
    $(".browse-box").show()
    $(".stamps-box").hide()
});

$("#click_stamps").click(function(){
    $(".browse-box").hide()
    $(".stamps-box").show()
});