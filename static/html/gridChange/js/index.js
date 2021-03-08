const tdt = new TDT(config.tdt.tk);//地图
let map;
let changeFeatures = [];
let xspan;
let yspan;
let startX;
let endX;
let startY;
let endY;
let nx;
let ny;
$(function(){
    $("#range").val("CHN")
    $("#year").val(getDay());
    init();
    initBoundary();
    lodingpattern();
    // map.addLayer(measure.vector);
    // drawTools();
    var pop_draw = new ol.Overlay({
        id: "pop_draw",
        element: document.getElementById('pop_draw'),
        offset: [12, -14]
    });
    map.addOverlay(pop_draw);
    drawPolygenAnalysis.click();
})
function getDay() {
    var today = new Date();
    var tYear = today.getFullYear();
    var tMonth = today.getMonth() + 1;
    var tDate = today.getDate();
    if (tMonth < 10) {
        tMonth = 0 + "" + tMonth
    }
    if (tDate < 10) {
        tDate = 0 + "" + tDate
    }
    return tYear + "-" + tMonth + "-" + tDate;
}
function init(){
    map = mapUtil.createMap('map', config.map.center, config.map.projection, config.map.minZoom, config.map.baseZoom,
        config.map.maxZoom);
    let layers = tdt.createLayer([LAYERTYPE.VECTOR, LAYERTYPE.VECTORTEXT]);
    if (layers) {
        if (layers instanceof Array) {
            layers.forEach((l) => {
                map.addLayer(l);
            })
        }
    }
    var helpTooltip = new ol.Overlay({
        id: "helpTooltip",
        element: $("#pop_navi")[0],
        offset: [0, 0],
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(helpTooltip);
}
//加载数据
function loadGridData(path){
    layuiLoading('')
    $.ajax({
        type:'get',
        url: main_url +'/ssd-forecast-element/getMiTypeDataS',
        data:{path:path},
        success:function(result){
            // showGridInMap(result,'qpfGridLayer','point');
            layuiRemoveLoading();
            var data = result.data.data.data;
            var points = new Array(); //生成格点色斑图，需要的点
            let data1 = [];
            nx = result.data.data.nx;
            ny = result.data.data.ny;
            xspan = result.data.data.xspan;
            yspan = result.data.data.yspan;
            startX = result.data.data.startX;
            startY = result.data.data.startY;
            endX = result.data.data.endX;
            endY = result.data.data.endY;
            $.each(data, function(m, point) {
                //生成格点的点集合
                data_point = {};
                data_point.longitude = point[0];
                data_point.latitude = point[1];
                data_point.value = point[2].toFixed(0)==-0?0:point[2].toFixed(0);
                data1.push(data_point);
            })
            var params = {
                "layerId": 'qpfGridLayer',
                "opacity": 1,
                "zIndex": 21,
                "crs": "EPSG:3857",
                "style": getGridPoint,
                "x": "longitude",
                "y": "latitude"
            };
            var jsonLayer = layerUtil.createPointJsonLayer(data1, params);
            jsonLayer.set("layerid", 'qpfGridLayer') //设置矢量图层的layerid，用于查找该图层
            map.addLayer(jsonLayer);
        }
    })
}
function initBoundary(){
    $.ajax({
        type:"get",
        url:"data/tz.geojson",
        async:true,
        dataType: "json",
        timeout:1200000,
        success:function(data){
            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(data, {
                    dataProjection: "EPSG:4326",
                    featureProjection: 'EPSG:3857'
                })
            });
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: createBoundaryStyle,
                zIndex:10
            });
            vectorLayer.set("layerid",'boundarylayer');
            map.addLayer(vectorLayer);
        }
    });
}

function createBoundaryStyle (f){
    var name = f.get("name");
    if(name || name=="" || name==null){
        name = f.get('NAME');
    }
    // var citycode = f.get("areacode");
    var color = "#000000"//"#d200ff";
    var width = 2;
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: width,
            color: color
        }),
        // text: new ol.style.Text({
        //     text: name,
        //     font: "300 13px 宋体",
        //     fill: new ol.style.Fill({
        //         color: '#64ccff'
        //     }),

        // }),
    });
}

function chuTu(){
    let arr = [];
    let layer = ol3_layerHelper.getLayerById(map,'qpfGridLayer');
    if(layer){
        let features = layer.getSource().getFeatures();
        $.each(features, function (i, f) {
            if(!isNaN(parseInt(f.get('lastValue'))) && f.get('lastValue')!=undefined){
                let changeLongitude = f.get('longitude');
                let changeLatitude = f.get('latitude');
                let x = ((changeLongitude-startX)/parseFloat(xspan)+1).toFixed(0);
                let y = ((startY-changeLatitude)/parseFloat(xspan)+1).toFixed(0);
                let v = f.get('value');
                arr.push({x:x,y:y,v:v});
            }
        });
    }
    if(arr.length>0){
        layuiLoading('');
        var path=$("#path").val()
        $.ajax({
            url: main_url +'/ssd-forecast-element/dealGridFile',
            type:'get',
            data:{
                jsonStr:JSON.stringify(arr)
                ,path:path
            },
            success:function(result){
                layuiRemoveLoading();
                if(result){
                    alert('处理成功');
                }else{
                    alert('处理失败');
                }
            }
        })
    }
}


layui.use(['layer', 'table', 'element', 'laydate', 'form'], function () {
    var laydate = layui.laydate;
    //加载时间插件
    laydate.render({
        elem: '#year'
        , done: function (value, date) {//时间框发生改变触发
            lodingData();
        }
    });
    //所有单选框点击从新加载数据
    $('input[type="radio"]').on('click', function () {
        lodingData();
    });


});

//请求文件名称
function lodingData() {
    var pattern =document.getElementsByName("pattern");//模式
    for (var i = 0; i < pattern.length; i++) {
        if (pattern[i].checked) {
            pattern = pattern[i].value
        }
    }
    var range = $("#range").val();//范围
    var dataHour = document.getElementsByName("dataHour");
    for (var i = 0; i < dataHour.length; i++) {
        if (dataHour[i].checked) {
            dataHour = dataHour[i].value
        }
    }

    var time = $("#year").val();//时间
    var ele = document.getElementsByName("ele");
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            ele = ele[i].value
        }
    }
    if(time!='' && typeof(time)!='undefined'){
        appendHtml(pattern,range,ele,time,dataHour)
        /*  loadGridData(pattern,range,ele,time,dataHour)*/
    }
}
//循环拼接文件名称
function appendHtml(pattern,range,ele,time,dataHour){
    var revision = document.getElementsByName("revision");
    for (var i = 0; i < revision.length; i++) {
        if (revision[i].checked) {
            revision = revision[i].value
        }
    }
    if(revision=='0'){
        revision=''
    }
    $.ajax({
        type:'get',
        url: main_url +'/ssd-forecast-element/getMiTypeData',
        data:{pattern:pattern,range:range,ele:ele,time:time,dataHour:dataHour,revision:revision},
        success:function(result){
            let datas=result.data
            $("#fileName").empty();
            if(datas!=null && datas!=''){
                var html='';
                for (var i =0;i<datas.length;i++){
                    var name=datas[i].name
                    var path=datas[i].path
                    html+='<li id="d'+i+'" onclick="clickpath(\''+path +'\','+i+')">'+name+'</li>'
                }
                $("#fileName").append(html);
            }
        }
    })
}

function clickpath(path,i){
    var ids="d"+i;
    $("#fileName").find("li").each(function () {
        var object = $(this);
        var id=object[0].id
        if(id==ids){
            document.getElementById(ids).style.background="#2485e4"
        }else{
            document.getElementById(id).style.background="#f2f0f0"
        }
    })

    $("#path").val(path);
    loadGridData(path)
}
//加载预报类型
function lodingpattern() {
    $.ajax({
        type: 'get',
        url: main_url + '/ssd-forecast-element/getPatternData',
        success: function (result) {
            let datas = result.data
            $(".radioBox2").empty();
            if (datas != null && datas != '') {
                var html = '';
                for (var i = 0; i < datas.length; i++) {
                    var name = datas[i].img_path
                    var path = datas[i].filePath
                    var ele_name = datas[i].ele_name
                    if (i == 0) {
                        html += '<div class="radio" style="width: 46%"> <input type="radio" name="pattern" value="' + name + '_' + path + '_'+ele_name+'" checked> <span>' + ele_name + '</span></div>'
                    } else {
                        html += '<div class="radio" style="width: 46%"> <input type="radio" name="pattern" value="' + name + '_' + path + '_'+ele_name+'"> <span>' + ele_name + '</span></div>'
                    }
                }
                $(".radioBox2").append(html);
            }
            lodingele();
        }
    })
}
//加载要素
function lodingele(){
    layuiLoading()
    var pattern =document.getElementsByName("pattern");//模式
    for (var i = 0; i < pattern.length; i++) {
        if (pattern[i].checked) {
            pattern = pattern[i].value
        }
    }
    var patternname=pattern.split("_");//拆分成数组
    $.ajax({
        type: 'get',
        url: main_url + '/ssd-forecast-element/getEleMentData',
        data:{pattern:patternname[2]},
        success: function (result) {
            let datas = result.data
            $(".radioBox4").empty();
            if (datas != null && datas != '') {
                var html = '';
                for (var i = 0; i < datas.length; i++) {
                    var element = datas[i].element
                    var elementName = datas[i].elementName
                    var pressure = datas[i].pressure
                    if(pressure!=null && pressure!=''){
                        element=element+"_"+pressure
                    }
                    if (i == 0) {
                        html += '<div class="radio" style="width: 46%"> <input  onclick="lodingData()" type="radio" name="ele" value="' + element +'" checked> <span>' + elementName + '</span></div>'
                    } else {
                        html += '<div class="radio" style="width: 46%"> <input type="radio" onclick="lodingData()"  name="ele" value="' + element +'"> <span>' + elementName + '</span></div>'
                    }
                }
                $(".radioBox4").append(html);
            }
            layuiRemoveLoading();
            lodingData();
        }
    })
}

$('.btnBoxs').find('span').on('click',function(){
    var a=$(this)
    var as=a[0].innerText
    var datas="CHN";
    if(as=='华东'){
        datas="ECHN"
    }else if(as=='浙江'){
        datas="ZJ"
    } else if(as=='台州'){
        datas="TZ"
    }
    $("#range").val(datas)
})
var index;
function layuiLoading(msg) {
    layui.use(['layer', 'form'], function () {
        index = layer.load(0, {shade: [0.15, '#ccc']});
    });
}


function layuiRemoveLoading() {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer
        layer.close(index);
        //调用close方法,关闭全局变量index对应的加载效果
    });
}
