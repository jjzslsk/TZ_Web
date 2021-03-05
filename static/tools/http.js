
// 服务器地址
const main_url = 'http://10.137.4.30:6001/integration/main';
//const main_url = 'http://192.168.0.122:6001/integration/main';

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
  get (actionUrl, param, funRecall, errFunRecall, isAsync) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl + param;
    // var url = actionUrl + objectToQueryString(userInfo) + param;
      if(isAsync){//参数默认可以不传
          isAsync = false;
      }else{
          isAsync = true;
      }
    $.ajax({
      url: url,
      type:'get',
      async:isAsync,
      timeout: ajaxTimeout,
      // headers: {
      //   'Authorization': HeadersToken.localData()
      // },
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

  postJson (actionUrl, param, funRecall, errFunRecall) {
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

  postForm (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl;
    $.ajax({
      url: url,
      type:'POST',
      timeout: ajaxTimeout,
      data: param,
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

  postFileDownload (actionUrl, param, funRecall, errFunRecall) {
    var loading = layer.load(0, {
        shade: false,
        time: 2*1000
    });
    var url = actionUrl;
    $.ajax({
      url: url,
      type:'POST',
      timeout: ajaxTimeout,
      data: param,
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      responseType:'arraybuffer',
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

  delete (actionUrl, param, funRecall, errFunRecall) {
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

  put (actionUrl, param, funRecall, errFunRecall) {
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
