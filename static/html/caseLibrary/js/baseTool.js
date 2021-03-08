let cityArr=[];
let countyArr=[];
let cityNameArr=[];
let countyNameArr=[];
let moudleType;
var zhPersonArr=[];
var wgPersonArr=[];
var qxPersonArr=[];
var yuAnPersonArr=[];
var asyncPolygons;
/**
 * 验证区、县、乡镇个数
 * curfeatures:面 geojson数据
 * circleParam:圆 两点坐标
 * relationshipType:筛选类型 相交/包含
 * */
function issuePolygon(curfeatures,circleParam,relationshipType) {
    let param="";
    var geojson=new Object();
    if(curfeatures!=null||circleParam!=null){
        geojson = {
            "type": "FeatureCollection",
            "features": curfeatures
        };
        if(circleParam!=null){
            param+='centerLonlats='+circleParam.centerArr+'&otherLonlats='+circleParam.otherArr;
        }
        if(moudleType=='fx'){//分析

        }else if(moudleType=='yj'){//靶向预警
            merge(geojson,param);
            loadPersonMessage(geojson,param);
        }else if(moudleType=='tb'){//同步
            loadPersonMessage(geojson,param);
        }
        $.ajax({
            type: "post", //使用post方法访问后台
            data: JSON.stringify(geojson),
            //async:false,
            contentType: "application/json; charset=utf-8",
            url: config.geoServerFenXi+'/getAreaAndTotal?relationshipType='+relationshipType+'&'+param,
            dataType: "json",
            success: function (obj) {
                countyArr=obj.data.countyList;
                cityArr=obj.data.cityList;

                countyNameArr=obj.data.countyNameList;
                cityNameArr=obj.data.cityNameList;

                if(moudleType=='fx'){
                    //分析
                    $("#countyNum").text(obj.total + "个");
                }else if(moudleType=='yj'){
                    //靶向预警
                    $("#includeCountyNum").text(obj.total+ "个");
                    let areaList=obj.data.townList;
                    let type=$("#circleUlbar").find('.circleBarActive').find('i').text();
                    let affectAreas;
                    if(type=='靶向预警'){
                        affectAreas =$(".bxDrawAreaInfos").empty();
                    }else if(type=='重要通知'){
                        affectAreas =$(".yjDrawAreaInfos").empty();
                    }
                    for(var i in areaList){
                        $('<li name="'+areaList[i].areaname+'" code="'+areaList[i].areacode+'">'+areaList[i].areaname+' <span class="circleStreet">✖</span></li>').appendTo(affectAreas);
                    }
                }else if(moudleType=='tb'){
                    //同步
                    $("#includeCountyNum").text(obj.total+ "个");
                }
                loadJJrk();
            },
            error: function (result) {
                console.log(result);
            }
        });
    }else{

    }



}

/**
 * 计算Vector的面积
 * @param polygon
 * @returns {number}
 */
function getVectorArea(polygon){
    let wgs84Sphere =  window.ol.sphere;
    let value=wgs84Sphere.getArea(polygon);
    return value;
}


/**
 * 经济人口*查询GDP以及人口数量
 */
function loadJJrk() {
        $.ajax({
            type:'get',
            async:true,
            url:'./data/county.json',
            success:function(result){
                for(var i in result.areaCode){
                    result.areaCode[i]=result.areaCode[i]+"000000";
                }
                if(countyArr.length==0){
                    countyArr=result.areaCode;
                }
                const baseParam = config.api.baseDataParam;
                baseParam.interfaceCode = 'M0007';
                let param = {};
                param.oneselfAreaCode = countyArr.toString();
                if (param) {
                    baseParam.params = JSON.stringify(param);
                }

                $.ajax({
                    type:'get',
                    async:false,
                    data:baseParam,
                    url:config.api.baseUrl,
                    success:function(result){
                        if(result.returnCode=='0'){
                            let data=result.data;
                            let Gdp=0;
                            let TotalPopulation=0;
                            for(let i in data){
                                Gdp+=Number(data[i].Gdp);
                                TotalPopulation+=Number(data[i].TotalPopulation);
                            }
                            if(moudleType=='fx'){
                                //分析
                                $("#gdp").text((Gdp/10000000).toFixed(2)+"万亿");
                                $("#totalPopulation").text(TotalPopulation+"人");
                            }else{
                                //靶向预警
                                $("#countGdp").text((Gdp/10000000).toFixed(2)+"万亿");
                                $("#includePersons").text(TotalPopulation+"人");
                            }
                        }
                    }
                });
            }
        });
}
function loadPersonMessage(geojson,param) {
    $.ajax({
        type: "post", //使用post方法访问后台
        data: JSON.stringify(geojson),
        async:true,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        url: config.geoServerFenXi+'/multiPolygonHandler?'+param,
        dataType: "json",
        success: function (result) {
            if(result.returnCode=='0') {
                    var data=result.data;
                    if(data!=undefined&&data!=null&&JSON.stringify(data) != "{}"){
                        $("#zhPerson").text(data.rpInfo.total + "人");
                        zhPersonArr = data.rpInfo.dataList;

                        $("#wgPerson").text(data.gridperInfo.total + "人");
                        wgPersonArr =data.gridperInfo.dataList;

                        $("#qxPerson").text(data.miInfo.total + "人");
                        qxPersonArr = data.miInfo.dataList;
                    }
                layer.closeAll();
            }
        },
        error: function(result) {
            console.log(result);
        }
    });
}

/**面去重*/
function  merge(geojson,param) {
    $.ajax({
        type: "post", //使用post方法访问后台
        data: JSON.stringify(geojson),
        async:true,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        url: config.geoServerFenXi+'/featureUnion?'+param,
        dataType: "json",
        success: function (polygons) {
            //console.log("1"+JSON.stringify(polygons));
            drawPolygenAnalysis.clearAllFeatures('merge');
            var features = (new ol.format.GeoJSON()).readFeatures(polygons, {
                dataProjection: config.dataProjection,
                featureProjection: config.mapProjection
            });
            ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer").setZIndex(20);//视图级别为20
            ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer").getSource().addFeatures(features);
        }
    });
}

/**获取乡镇编码获取乡镇边界(相邻自动合并)*/
function  townsBound(areaCodes) {
    layer.load(0, {
        shade: [0.2, '#000']
    });
    $.ajax({
        type: "post", //使用post方法访问后台
        async:true,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        url: config.geoServerFenXi+'/townsBound?areaCodes='+areaCodes,
        dataType: "json",
        success: function (resultPolygons) {
            asyncPolygons=resultPolygons;
            drawPolygenAnalysis.clearAllFeatures('merge');
            let features = (new ol.format.GeoJSON()).readFeatures(resultPolygons, {
                dataProjection: config.dataProjection,
                featureProjection: config.mapProjection
            });
            ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer").setZIndex(20);//视图级别为20
            ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer").getSource().addFeatures(features);
            moudleType='tb';
            let thisF=[];
            thisF.push({
                "type": "Feature",
                "geometry": asyncPolygons
            });
            issuePolygon(thisF,null,'contains');
        }
    });
}

/** 获取 预案责任人*/
function getYuAnPerson(disasterCode,disasterLevel,areaCodes) {
    layer.load(0, {
        shade: [0.2, '#000']
    });
    $.ajax({
        type: "get", //使用post方法访问后台
        async:false,
        crossDomain: true,
        url: config.base.baseUrl+'/mdls/planManageProcess/queryResponsibleInfo?disasterCode='+disasterCode+'&disasterLevel='+disasterLevel+'&areaCodes='+areaCodes,
        dataType: "json",
        success: function (result) {
            if(result.code==0){
                yuAnPersonArr=result.data;
                $("#yuanPerson").text(yuAnPersonArr.length+"人");
            }
            layer.closeAll();
        },error:function () {
            layer.closeAll();
        }
    });
}
