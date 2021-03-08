/**
 * 定义一些工具信息
 */

const Util =function () {
    //初始化加载 省市县 地区
    let param = config.api.baseDataParam;
    let p = {
        'level':'1,3,4'
    };
    param.params = JSON.stringify(p);
    param.interfaceCode = 'T0002';
    $.ajax({
        type: "post",
        cache: false,
        //async: false,
        data: param,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success:function(data){
            if(data.returnCode=='0'){
                sessionStorage.setItem("ssxAreas",JSON.stringify(data.data));
            }
        },error:function (data) {
            console.log(data);
        }
    });
}
//获取当前登录用户所在的地区编码
Util.prototype.getCurrentUserAreaCode = function(){
    let user =JSON.parse(sessionStorage.getItem("curArea"));
    return user.areaCode;
}
//根据当前登录用户获取地区编码   省级用户 返回省级和市级 的编码  市级用户返回市级编码  县级用户返回当前县编码
Util.prototype.getUserAreaCode =function  (){
    let user =JSON.parse(sessionStorage.getItem("curArea"));
    let areaLevel =user.area_level;
    if(1 == areaLevel *1){//省级用户
        let provinceCode =user.provinceAreaCodes;
        let cityCode = user.cityAreaCodes;
        return provinceCode+","+cityCode;
    }else if(3===areaLevel*1){
        return user.cityAreaCodes;

    }else if(4===areaLevel *1){
        return user.countyAreaCodes;
    }

}
/**
 * 获取登录用户所在的县级地区编码  如果是县级用户则返回 null
 * @returns {*}
 */
Util.prototype.getCountyAreaCode =function (){
    let user =JSON.parse(sessionStorage.getItem("curArea"));
    let  areaLevel = user.area_level;
    if(1 == areaLevel *1 || 3===areaLevel*1){//省级市级用户
        return user.countyAreaCodes;
    }else if(4===areaLevel *1){

        return null;
    }
}

Util.prototype.getTopColor=function(oldColor, newColor) {
    let oldNum = this.levelColorToNum(oldColor);
    if(!oldColor) {
        return newColor;
    }
    var newNum = this.levelColorToNum(newColor);
    if(newNum >= oldNum) {
        return newColor;
    } else {
        return oldColor;
    }
}

Util.prototype.levelColorToNum=function(color) {
    var colorNum = 0;
    switch(color) {
        case 'Red':
            colorNum = 4;
            break;
        case 'Orange':
            colorNum = 3;
            break;
        case 'Yellow':
            colorNum = 2;
            break;
        case 'Blue':
            colorNum = 1;
            break;

    }
    return colorNum;
}
Util.prototype.getAreaLonLat=function(areaCode) {
    areaCode = areaCode.substr(0, 6);
    let feature = boundaryGeo[areaCode];
    let lonLat = {};
    if(feature) {
        let lon = feature.properties.x;
        let lat = feature.properties.y;
        lonLat.x = lon;
        lonLat.y = lat;
    }

    return lonLat;

}
Util.prototype.getAreaCodeLevel=function(areaCode) {
    areaCode = areaCode.substr(0, 6);
    if(areaCode.endsWith("0000")) {
        return 1;
    } else if(areaCode.endsWith("00")) {
        return 2;
    } else {
        return 3;
    }
}

Util.prototype.getAreaNameByCode=function(areaCode){
    var ssxAreas = sessionStorage["ssxAreas"];
    if(ssxAreas){
        var areas=JSON.parse(ssxAreas);
        for(var i in areas){
            if(areas[i].id==areaCode){
                return areas[i];
            }
        }
    }
    return null;
}



