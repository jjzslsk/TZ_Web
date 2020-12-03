#接口联调文档说明

-----

# 接口联调文档（请直接在本文档编辑）

通用返回结果：
```json
{
    "code": 0,
    "success": true,
    "message": "请求成功",
    "data": {}
}
```
```json
{
    "code": 0,
    "success": false,
    "message": "[测试]失败原因",
    "data": {}
}
```
通用分页列表返回格式：
pageIndex：页码
pageSize：页数
pageIndex：当前所在页
```
{
    "success": true,
    "code": 0,
    "message": "查询成功",
    "data": {
        "rowCount": 1,
        "pageSize": 10,
        "pageIndex": 1,
        "list": [
            {
                "areaCode": "150100",
                "id": 3,
                "areaName": "111",
                "content": "内容1111"
            }
        ]
    }
}
```
-----

### 登录功能
接口地址： post方式
```
http://192.168.0.69:4001/ssd/mgr-service/ssd-sys-user/login?uid=123&password=123
```

提交json格式：
```
{
	uid：'123',
	password: '123'
}
```
返回格式：
```
{
  "success": true,
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "45645646FHFGDGFHRT"
    "userId": "81c2ecdabfe54aff9e4c38be54f3691e"
  }
}

```
---
### 注销功能
接口地址： get方式
```
 `http://192.168.0.69:4001/ssd/mgr-service/ssd-sys-user/logout?token=234345345345` 
```

提交格式：
```
{
	token：'234345345345',
}
```
返回格式：
```
使用通用返回结果

```
---
###获取当前用户信息
接口地址： get方式
```
http://192.168.0.69:4001/ssd/mgr-service/ssd-sys-user/selectUserById?id=234345345345
```

提交格式：
```
{
	userId：'234345345345',
}
```
返回格式：
```
使用通用返回结果

```
---

###获取数据字典列表list
接口地址：get方式
```
http://192.168.0.69:4001/ssd/mgr-service/ssd-sys-dictionary/selectDictionaryById?id=a4c781f77787445fa683355118a47506
```
提交json格式：
```
{
	"rowCount": 1,
      "pageSize": 10,
      "pageIndex": 1,
	"id":'a4c781f77787445fa683355118a47506`
}
```
返回格式：
```
使用通用分页返回结果

```


* 详情

### 6-1-1-0
### 6-1-1-3


