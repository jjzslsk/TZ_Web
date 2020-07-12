
// 服务器地址
const system_url = 'http://172.21.158.162:4001' //系统管理
const business_url = 'http://172.21.158.162:6001' //综合管理
const backLxy_url = 'http://192.168.5.105:6002' //产品制作
const backWarning_url = 'http://192.168.5.105:6003' //天气警报
const ajaxTimeout = 10000 //超时

//获取缓存用户信息
const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
    let userInfo
    if(!loginInfo){
        userInfo = null
    }else{
        userInfo = {
            loginAreaId:loginInfo.areaId? loginInfo.areaId:null,
            loginOrgId:loginInfo.orgId? loginInfo.orgId:null,
            loginUserId:loginInfo.id? loginInfo.id:null,
        }
    }
var objectToQueryString = function objectToQueryString(obj) {
  return Object.keys(obj).map(function (key) {
    return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key]));
  }).join('&');
};

//获取token
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
      return tokenInfo || null
  }
}

//http请求 类
class EasyHttp {
  get = function (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl + param;
    // var url = actionUrl + objectToQueryString(userInfo) + param;
    $.ajax({
      url: url,
      type:'get',
      timeout: ajaxTimeout,
      headers: {
        'Authorization': HeadersToken.localData() 
      },
      success: function (res) {
        layer.close(loading);
        funRecall(res)
      },
      error: function (result) {
        layer.close(loading);
        errFunRecall(result)
      }
    });
  }

  postJson = function (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl;
    $.ajax({
      url: url,
      type:'POST',  
      dataType: 'json',
      contentType: "application/json; charset=utf-8",  
      timeout: ajaxTimeout,
      data: JSON.stringify({...param,...userInfo}),
      success: function (res) {
        layer.close(loading);
        funRecall(res)
      },
      error: function (result) {
        layer.close(loading);
        errFunRecall(result)
      }
    });
  }

  postForm = function (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl;
    $.ajax({
      url: url,
      type:'post',  
      timeout: ajaxTimeout,
      data: {
        ...param,
        ...userInfo
      },
      success: function (res) {
        layer.close(loading);
        funRecall(res)
      },
      error: function (result) {
        layer.close(loading);
        errFunRecall(result)
      }
    });
  }

  delete = function (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl;
    $.ajax({
      url: url,
      type: 'DELETE',
      dataType: 'json',
      timeout: ajaxTimeout,
      data: {
        ...param,
        ...userInfo
      },
      success: function (res) {
        layer.close(loading);
        funRecall(res)
      },
      error: function (result) {
        layer.close(loading);
        errFunRecall(result)
      }
    });
  }

  put = function (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl;
    $.ajax({
      url: url,
      type: 'put',
      dataType: 'json',
      timeout: ajaxTimeout,
      data: {
        ...param,
        ...userInfo
      },
      success: function (res) {
        layer.close(loading);
        funRecall(res)
      },
      error: function (result) {
        layer.close(loading);
        errFunRecall(result)
      }
    });
  }

  

}