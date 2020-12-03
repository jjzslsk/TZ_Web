let map1;
let map2;
var offsetXY = [{
    x: 0.1,
    y: 0.1
}, {
    x: 0,
    y: 0.1
}, {
    x: 0.1,
    y: 0
}, {
    x: 0,
    y: -0.1
}, {
    x: -0.1,
    y: 0
}, {
    x: -0.1,
    y: -0.1
}];
var boundaryGeo = {};
const tdt = new TDT(config.tdt.tk);
$(function(){
    initMap();
})
function initMap(){
    map1 = mapUtil.createMap('map1', config.map.center, config.map.projection, config.map.minZoom, config.map.baseZoom,
        config.map.maxZoom);
    map2 = mapUtil.createMap('map2', config.map.center, config.map.projection, config.map.minZoom, config.map.baseZoom,
        config.map.maxZoom);
    initBaseLayer1();
    initBaseLayer2();
    loadBoundary();
    getWarningSend();
    // getWarningSendNot();
}
//初始化默认图层
function initBaseLayer1() {
    let layers = tdt.createLayer([LAYERTYPE.VECTOR, LAYERTYPE.VECTORTEXT]);
    if (layers) {
        if (layers instanceof Array) {
            layers.forEach((l) => {
                map1.addLayer(l);
                // map2.addLayer(l);
            })
        }
    }
}
function initBaseLayer2() {
    let layers = tdt.createLayer([LAYERTYPE.VECTOR, LAYERTYPE.VECTORTEXT]);
    if (layers) {
        if (layers instanceof Array) {
            layers.forEach((l) => {
                // map1.addLayer(l);
                map2.addLayer(l);
            })
        }
    }
}


// function getWarningSend(){
//     $.ajax({
//         type:'get',
//         url:'',
//         success:function(result){
//             var areaOffsetIndex = {};
//             let mapData = [];
//             for(let i=0;i<result.data.length;i++){
//                 let id = result.data[i].id;
//                 let longitude = result.data[i].longitude;
//                 let latitude = result.data[i].latitude;
//                 let time = result.data[i].time;
//                 let img = result.data[i].img;
//                 let areaName = result.data[i].areaName;
//                 var item = {
//                     id,
//                     longitude,
//                     latitude,
//                     time,
//                     img,
//                     areaName
//                 };
//                 var index = areaOffsetIndex[item.areaName];
//                 if(index == undefined) {
//                     index = 0;
//                 } else if(index == offsetXY.length - 1) {
//                     index = 0
//                 } else {
//                     index = index + 1;
//                 }
//                 var lonlat = getAreaLonLat(item.areaName);
//                 if(lonlat.x) {
//                     item.longitude = lonlat.longitude * 1 + offsetXY[index].longitude;
//                 }
//                 if(lonlat.y) {
//                     item.latitude = lonlat.latitude * 1 + offsetXY[index].latitude;
//                 }
//                 areaOffsetIndex[item.areaName] = index;
//                 mapData.push(item);
//             }
//             var layerid = "WarningSendLayer";
//             var params = {
//                 "layerId": layerid,
//                 "opacity": 1,
//                 "zIndex": 22,
//                 "crs": "EPSG:3857",
//                 "style": warningStyle,
//                 "x": "longitude",
//                 "y": "latitude"
//             };
//             var jsonLayer = layerUtil.createPointJsonLayer(mapData, params);
//             jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
//             map1.addLayer(jsonLayer);
//         }
//     })
// }

//测试左边
function getWarningSend(){
    var result={
        "state":true,
        "data":[
                    // {
                    //     id:"2",//唯一标识
                    //     level:"黄色",//等级
                    //     longitude:121.257222,//经度
                    //     latitude:28.669444,//纬度
                    //     areaCode:"758201",//地区编码
                    //     areaName:"黄岩局",//地区名称
                    //     time:"2020-11-01 08:00",//发布时间
                    //     img:"../early/image/11B03_02.png"//图片路径
                    // }
                ]
            };
    var areaOffsetIndex = {};
    let mapData = [];
    var warnArr = [];
    for(let i=0;i<result.data.length;i++){
        let id = result.data[i].id;
        let longitude = result.data[i].longitude;
        let latitude = result.data[i].latitude;
        let time = result.data[i].time;
        let img = result.data[i].img;
        let areaName = result.data[i].areaName;
        let areaCode = result.data[i].areaCode;
        let level = result.data[i].level;
        warnArr.push(areaCode+"_"+level);
        var item = {
            id,
            longitude,
            latitude,
            time,
            img,
            areaName
        };
        var index = areaOffsetIndex[item.areaName];
        if(index == undefined) {
            index = 0;
        } else if(index == offsetXY.length - 1) {
            index = 0
        } else {
            index = index + 1;
        }
        var lonlat = getAreaLonLat(item.areaName);
        if(lonlat.x) {
            item.longitude = lonlat.longitude * 1 + offsetXY[index].longitude;
        }
        if(lonlat.y) {
            item.latitude = lonlat.latitude * 1 + offsetXY[index].latitude;
        }
        areaOffsetIndex[item.areaName] = index;
        mapData.push(item);
    }
    var layerid = "WarningSendLayer";
    var params = {
        "layerId": layerid,
        "opacity": 1,
        "zIndex": 22,
        "crs": "EPSG:3857",
        "style": warningStyle,
        "x": "longitude",
        "y": "latitude"
    };
    var jsonLayer = layerUtil.createPointJsonLayer(mapData, params);
    jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
    map1.addLayer(jsonLayer);
    getWarningSendNot(warnArr);
}


function getWarningSendNot(warnArr){
    $.ajax({
        type:'get',
        url:main_url + '/ssd-reminder-warn/getRegionalAlertNow',
        dataType: 'json',
        success:function(result){
            var areaOffsetIndex = {};
            let mapData = [];
            var tabHtml = '';
            for(let i=0;i<result.data.length;i++){
                let id = result.data[i].id;
                let longitude = result.data[i].longitude;
                let latitude = result.data[i].latitude;
                let time = result.data[i].time;
                let img = result.data[i].img;
                img = ".."+img;
                let areaName = result.data[i].areaName;
                let areaCode = result.data[i].areaCode;
                let level = result.data[i].level;
                var nw = areaCode+"_"+level;
                if(!checkWarn(warnArr,nw)){
                    continue;
                }
                tabHtml+='<tr>';
                tabHtml+='<td><input type="checkbox" name="notSentCheck" onclick="checkTabBox(this,\''+areaName+'\',\'暴雨\',\''+level+'\')" id="" value="" /></td>';
                tabHtml+='<td><span>'+areaName+'</span></td>';
                tabHtml+='<td><span>暴雨</span></td>';
                tabHtml+='<td><span>'+level+'</span></td>';
                tabHtml+='</tr>';
                var item = {
                    id,
                    longitude,
                    latitude,
                    time,
                    img,
                    areaName
                };
                var index = areaOffsetIndex[item.areaName];
                if(index == undefined) {
                    index = 0;
                } else if(index == offsetXY.length - 1) {
                    index = 0
                } else {
                    index = index + 1;
                }
                var lonlat = getAreaLonLat(item.areaName);
                if(lonlat.x) {
                    item.longitude = lonlat.longitude * 1 + offsetXY[index].longitude;
                }
                if(lonlat.y) {
                    item.latitude = lonlat.latitude * 1 + offsetXY[index].latitude;
                }
                areaOffsetIndex[item.areaName] = index;
                mapData.push(item);
            }
            $("#tableEle").empty().html(tabHtml);
            var layerid = "WarningSendNotLayer";
            var params = {
                "layerId": layerid,
                "opacity": 1,
                "zIndex": 22,
                "crs": "EPSG:3857",
                "style": warningStyle,
                "x": "longitude",
                "y": "latitude"
            };
            var jsonLayer = layerUtil.createPointJsonLayer(mapData, params);
            jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
            map2.addLayer(jsonLayer);
        }
        ,error:function (e) {
        }
    })
}

//测试右边
// function getWarningSendNot(warnArr){
//     var result={"state":true,
//         "data":[
//             {
//                 id:"2",//唯一标识
//                 level:"黄色",//等级
//                 longitude:121.366666,//经度
//                 latitude:28.366666,//纬度
//                 areaCode:"58664",//地区编码
//                 areaName:"温岭",//地区名称
//                 time:"2020-11-01 08:00",//发布时间
//                 img:"../early/image/11B03_02.png"//图片路径
//             }
//             ,{
//                 id:"3",//唯一标识
//                 level:"黄色",//等级
//                 longitude:121.257222,//经度
//                 latitude:28.669444,//纬度
//                 areaCode:"758201",//地区编码
//                 areaName:"黄岩局",//地区名称
//                 time:"2020-11-01 08:00",//发布时间
//                 img:"../early/image/11B03_02.png"//图片路径
//             }
//         ]};
//     var areaOffsetIndex = {};
//     let mapData = [];
//     var tabHtml = '';
//     for(let i=0;i<result.data.length;i++){
//         let id = result.data[i].id;
//         let longitude = result.data[i].longitude;
//         let latitude = result.data[i].latitude;
//         let time = result.data[i].time;
//         let img = result.data[i].img;
//         let areaName = result.data[i].areaName;
//         let areaCode = result.data[i].areaCode;
//         let level = result.data[i].level;
//         var nw = areaCode+"_"+level;
//         if(!checkWarn(warnArr,nw)){
//             continue;
//         }
//         tabHtml+='<tr>';
//         tabHtml+='<td><input type="checkbox" name="notSentCheck" onclick="checkTabBox(this,\''+areaName+'\',\'暴雨\',\''+level+'\')" id="" value="" /></td>';
//         tabHtml+='<td><span>'+areaName+'</span></td>';
//         tabHtml+='<td><span>暴雨</span></td>';
//         tabHtml+='<td><span>'+level+'</span></td>';
//         tabHtml+='</tr>';
//         var item = {
//             id,
//             longitude,
//             latitude,
//             time,
//             img,
//             areaName
//         };
//         var index = areaOffsetIndex[item.areaName];
//         if(index == undefined) {
//             index = 0;
//         } else if(index == offsetXY.length - 1) {
//             index = 0
//         } else {
//             index = index + 1;
//         }
//         var lonlat = getAreaLonLat(item.areaName);
//         if(lonlat.x) {
//             item.longitude = lonlat.longitude * 1 + offsetXY[index].longitude;
//         }
//         if(lonlat.y) {
//             item.latitude = lonlat.latitude * 1 + offsetXY[index].latitude;
//         }
//         areaOffsetIndex[item.areaName] = index;
//         mapData.push(item);
//     }
//     $("#tableEle").empty().html(tabHtml);
//     var layerid = "WarningSendNotLayer";
//     var params = {
//         "layerId": layerid,
//         "opacity": 1,
//         "zIndex": 22,
//         "crs": "EPSG:3857",
//         "style": warningStyle,
//         "x": "longitude",
//         "y": "latitude"
//     };
//     var jsonLayer = layerUtil.createPointJsonLayer(mapData, params);
//     jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
//     map2.addLayer(jsonLayer);
// }

function checkWarn(warnArr,warn){
    var f = true;
    if(warnArr!=null&&warnArr.length>0){
        for (let i = 0; i < warnArr.length; i++) {
            if(warnArr[i]==warn){
                f=false;
            }
        }
    }
    return f;
}

function  checkTabBox(obj,area,element,level) {
    var notSendMessage = $("#notSendMessage").html();
    var content = getTipContent(area,element,level);
    if(obj.checked){
        if(notSendMessage!=null&&notSendMessage!=''){
            $("#notSendMessage").html(notSendMessage.substring(0,notSendMessage.length-11)+"；"+content+"，请及时发布相应预警。");
        }else {
            $("#notSendMessage").html(content+"，请及时发布相应预警。");
        }
    }else{
        //去掉生成的内容
        var con = notSendMessage.replace(content+'；','');
        con = con.replace('；'+content,'');
        con = con.replace(content,'');
        //con = notSendMessage.replace('；'+content,'');
        if(con=="，请及时发布相应预警。"){
            con = '';
        }
        $("#notSendMessage").html(con);
    }
}
function getTipContent(area,element,level){
    var content = area+element+'预报已达到'+level+'等级';
    return content;
}
function loadBoundary() {
    $.ajax({
        url: "../suddenWeather/data/taizhou.json",
        type: 'get',
        dataType: 'json',
        success: function(res) {
            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(res, {
                    dataProjection: "EPSG:4326",
                    featureProjection: 'EPSG:3857'
                })
            });
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: boundaryStyle,
                zIndex: 10
            });

            vectorLayer.set("layerid", "boundary");
            map2.addLayer(vectorLayer);
            map1.addLayer(vectorLayer);
        },
        error: function(result) {

        }
    });

}

function boundaryStyle(f) {
    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 2,
            color: "#000",

        }),
    })
    return style;
}
function getAreaLonLat(areaCode) {
    areaCode = areaCode.substr(0, 6);
    var feature = boundaryGeo[areaCode];
    var lonLat = {};
    if (feature) {
        var lon = feature.properties.x;
        var lat = feature.properties.y;
        lonLat.x = lon;
        lonLat.y = lat;
    }

    return lonLat;

}
function warningStyle(f) {
    // var eventType = f.get("eventType")
    // var level = f.get("severity");
    // level = level.toUpperCase();
    var imgUrl = f.get("img");
    var s = new ol.style.Style({
        image: new ol.style.Icon({
            src: imgUrl,
            scale: 0.2
        })
    });
    return [s];

}
