var util=new Util();
const limit = 3000;
let tdtPolygonLayid=[];
var sender;
var channelPersons=[];
var curChannelPerson=[];
var mainMapExistDisTypeArr=[];
var defenseExistDisTypeArr=[];
var disTypeArr=['11B01','11B17','11B16','11B02','11B19','11B32','11B03','11B20','11B33','11B04','11B21','11B34','11B05','11B22','11B35','11B06','11B23','11B08','11B07','11B24','11B27','11B24','11B25','11B08','11B10','11B26','11B12','11B11','11B28','11B18','11B13','11B29','11B30','11B14','11B31','11B15','11B99'];
var curArea=JSON.parse(sessionStorage.getItem('curArea'));
var selectEleType;
var qualityControl;
var publishStatus=false;//正向质控状态
/**预警发布 渠道 点击事件*/
$(document).on("click","#warningChannels>label",function () {
    let channel=$(this).prev().attr("id");
    let sendtype=$(this).prev().attr("sendtype");
    let channelNumId=$(this).find('span').attr("id");
    curChannelPerson=channelPersons[channel];
    layer.open({
        type: 2,
        skin: 'layer-ext-my1skin', //
        title:'渠道联系人列表',
        offset: ['8%', '65%'],
        area: ['30%', '85%'], //宽高
        content: './page/personList.html?type=channelPersons&sendtype='+sendtype,
        end : function() {
            channelPersons[channel]=curChannelPerson;
            $("#"+channelNumId).text(curChannelPerson.length+"");
        }
    });
});
/**预警发布 渠道 点击事件*/
$(document).on("click","#warningChannels_importantNotice>div>span>span",function () {
    let channel=$(this).siblings().eq(0).attr("id");
    let sendtype=$(this).siblings().eq(0).attr("sendtype");
    let channelNumId=$(this).attr("id");
    curChannelPerson=channelPersons[channel];
    layer.open({
        type: 2,
        skin: 'layer-ext-my1skin', //
        title:'渠道联系人列表',
        offset: ['8%', '65%'],
        area: ['30%', '85%'], //宽高
        content: './page/personList.html?type=channelPersons&sendtype='+sendtype,
        end : function() {
            channelPersons[channel]=curChannelPerson;
            $("#"+channelNumId).text(curChannelPerson.length+"");
        }
    });
});
function liveObserveDataType() {
    const liveObserveDataType = $("#liveObserveData").empty();
    var param = {};
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = 'M0057';
    param.tableDesc = 'M0001,M0002,M0003,M0004,M0005,M0006';
    param.areaCode = util.getCurrentUserAreaCode();
    param.isChildrens = true;
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({//M0057处理数据
        type: "post",
        cache: false,
        //async: true,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function (result) {
            if (result.returnCode * 1 === 0) {
                let data = result.data;
                let dataObj = {};
                for(let i=0;i<data.length;i++){
                    let code = data[i].code;
                    let name = data[i].name;
                    for(let j=0;j<data[i].statistics.byIndustry.length;j++){
                        let industryName = data[i].statistics.byIndustry[j].industryName;
                        let industryCode = data[i].statistics.byIndustry[j].industryCode;
                        let total = data[i].statistics.byIndustry[j].total;
                        if(total>0){
                            let thisObj = {
                                'name':name,
                                'code':code,
                                'industryName':industryName,
                                'total':total
                            }
                            if(dataObj[industryCode]){
                                dataObj[industryCode].push(thisObj);
                            }else{
                                dataObj[industryCode] = [thisObj];
                            }
                        }
                    }
                }
                let html = '';
                for(let key in dataObj){
                    let industryCode = key;
                    let industryName = dataObj[key][0].industryName;
                    html+='<li code="'+industryCode+'"><div><span>'+industryName+'</span></div><div>';
                    for(let i=0;i<dataObj[key].length;i++){
                        let dataName = dataObj[key][i].name;
                        let dataCode = dataObj[key][i].code;
                        let total = dataObj[key][i].total;
                        html+='<span code="'+dataCode+'">'+dataName+'('+total+')'+'<label class="rightCircle">&#10003;</label></span>';
                    }
                }
                html+='</div></li>';
                liveObserveDataType.html(html);
                $("#liveObserveData li div").children("span").on("click", function() {
                    const code = $(this).attr("code");//基础数据编码
                    var className = $(this).attr('class');
                    let liveDataObj = $('#liveObserveData >li');
                    let selectCode = '';
                    var layerid = config.dataLayerInfos[code].layerId;
                    let oldlayerById = ol3_layerHelper.getLayerById(map,layerid);
                    if(oldlayerById){
                        map.removeLayer(oldlayerById);
                    }
                    if(className && className.indexOf('active')>=0){
                        $(this).removeClass('active');
                    }else{
                        $(this).addClass('active');
                        // const industryCode = $(this).parent().parent().attr('code');
                    }
                    for(let j=0;j<liveDataObj.length;j++) {//循环li
                        let spanObjs = $(liveDataObj[j]).find('div').eq(1).find('span');;
                        for(let x=0;x<spanObjs.length;x++){
                            if($(spanObjs[x]).attr('code')==code){
                                if($(spanObjs[x]).attr('class') && $(spanObjs[x]).attr('class').indexOf('active')>=0){
                                    if(selectCode==''){
                                        selectCode =$(liveDataObj[j]).attr('code');
                                    }else{
                                        selectCode += ','+$(liveDataObj[j]).attr('code');
                                    }
                                }
                            }
                        }
                    }
                    if(selectCode!='' && selectCode){
                        const params = {};
                        const offset = 0;
                        params.offset = offset;
                        params.limit = limit;
                        let areaCodes =util.getCurrentUserAreaCode();
                        params.industryCode = selectCode;
                        params.tableDesc = code;
                        params.areaCode = areaCodes;
                        params.isChildrens = true;
                        loadBaseData('M0035', params);
                    }else{
                        var layerid = config.dataLayerInfos[code].layerId;
                        hideLayer(layerid);
                    }
                    selectTogether('','',true,$(this).attr('code'));
                });
            }
        }
    });
}
function loadIndustryData(code,param){
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = code;
    if (param) {
        param.isChildrens = true;
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type: "get",
        cache: false,
        // async: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function(result) {
            var nowLayer = ol3_layerHelper.getLayerById(map,'industryLayer');
            if(nowLayer){
                map.removeLayer(nowLayer);
            }
            if (result.returnCode * 1 === 0) {
                const dataArr = [];
                for(var i=0;i<result.data.length;i++){
                    const obj = result.data[i];
                    if(obj.Lon!=null && obj.Lat!=null){
                        dataArr.push(obj);
                    }
                }
                let params = {
                    "layerId": 'industryLayer',
                    "opacity": 1,
                    "zIndex": 21,
                    "crs": "EPSG:3857",
                    "style": industryStyle,
                    "x": "Lon",
                    "y": "Lat"
                };
                var newLayer = layerUtil.createPointJsonLayer(dataArr, params, {
                    code: code
                });
                newLayer.set("layerid", 'industryLayer');
                map.addLayer(newLayer);
                mapUtil.addLayerPopup(map, newLayer, '', showIndustryInfo);
            }
        }
    });
}
function loadBaseData(code, param) {
    layer.load(0, {
        shade: [0.2, '#000']
    });
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = code;
    var dataCode = param.tableDesc;
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    var value=$("#searchLike").val();
    let isSelect = false;
    if(value!=null&&value!=''&&value!=undefined){
        isSelect = true;
    }
    var descCode = $('.BtnDetailTxt .spanActive').attr('code');
    $.ajax({
        type: "get",
        cache: false,
        // async: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function(result) {
            if (result.returnCode * 1 === 0) {
                //数据查询成功
                let data = result.data[0].data;
                let total = result.total;
                let p = {"crs":"EPSG:3857", "x":"Lon", "y":"Lat"};
                dataCallback(data, p, dataCode,false,false);//isCounty当前加载的是否为县级数据
                var page = total % limit === 0 ? (total / limit) : ((total / limit) + 1);
                if (page >= 2) {
                    for (let i = 2; i <= page; i++) {
                        let offset = (i - 1) * limit;
                        param.offset = offset;
                        baseParam.params = JSON.stringify(param);
                        $.ajax({
                            type: "get",
                            cache: false,
                            // async: false,
                            data: baseParam,
                            url: config.api.baseUrl,
                            dataType: 'JSON',
                            success: function(data) {
                                if (data.returnCode * 1 == 0) {
                                    let d = data.data[0].data;
                                    let p = {
                                        "crs": "EPSG:3857",
                                        "x": "Lon",
                                        "y": "Lat"
                                    }
                                    dataCallback(d, p, dataCode,false,true);
                                }

                            },
                        });
                    }
                }
            }
            //加载县级数据
            loadCountyData(code, param);
            layer.closeAll();
        },
    })
    /**加载数据列表**/
    loadDataList(baseParam,isSelect,descCode);
}
/**
 * 加载县级数据
 */
function loadCountyData(code, param) {
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = code;
    var dataCode = param.tableDesc;
    if (param) {
        param.areaCode = util.getCurrentUserAreaCode();
        param.offset = 0;
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type: "get",
        cache: false,
        // async: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function(result) {
            if (result.returnCode * 1 === 0) {
                //数据查询成功
                let data = result.data[0].data;
                let total = result.total;
                let p = {
                    "crs": "EPSG:3857",
                    "x": "Lon",
                    "y": "Lat"
                }
                dataCallback(data, p, dataCode,false,true);
                var page = total % limit === 0 ? (total / limit) : ((total / limit) + 1)
                if (page >= 2) {
                    for (let i = 2; i <= page; i++) {
                        let offset = (i - 1) * limit;
                        param.offset = offset;
                        baseParam.params = JSON.stringify(param);
                        $.ajax({
                            type: "get",
                            cache: false,
                            // async: false,
                            data: baseParam,
                            url: config.api.baseUrl,
                            dataType: 'JSON',
                            success: function(data) {
                                if (data.returnCode * 1 == 0){
                                    let d = data.data[0].data;
                                    let p = {
                                        "crs": "EPSG:3857",
                                        "x": "Lon",
                                        "y": "Lat"
                                    }
                                    dataCallback(d, p, dataCode,false,true);
                                }
                            },
                        });
                    }
                }
            }
        },
    });
}

function dataCallback(data, param, code, isSelect, isCounty) {//isSelect  是否为筛选查询的数据   isCounty当前加载的是否为县级数据
    let layerId = config.dataLayerInfos[code].layerId;
    const styleFun = config.dataLayerInfos[code].styleFun;
    const popFun = config.dataLayerInfos[code].popFun;
    let c = commonUtil.pointToGeoJson(data, param.x, param.y, {
        code: code
    });
    let features = featureUtil.readGeojson(c, param.crs);
    let oldLayer = ol3_layerHelper.getLayerById(map, layerId);
    // map.removeLayer(oldLayer);

    if (oldLayer) {
        var vectorSource = new ol.source.Vector({
            features:features,
        });

        var clusterSource = new ol.source.Cluster({
            distance: 25,
            source: vectorSource,
        });
        oldLayer = new ol.layer.Vector({
            source: clusterSource,
            style: styleFun,
            zIndex:21
        });
        if(isSelect || !isCounty){//统一加载数据
            map.removeLayer(oldLayer);
            oldLayer.set("layerid", layerId);
            map.addLayer(oldLayer);
        }else{//分批次加载数据
            if(isCounty){
                oldLayer.setStyle(styleFun);
                oldLayer.getSource().addFeatures(features);
            }
        }
    }else{
        var vectorSource = new ol.source.Vector({
            features:features,
        });
        var clusterSource = new ol.source.Cluster({
            distance: 25,
            source: vectorSource,
        });
        oldLayer = new ol.layer.Vector({
            source: clusterSource,
            style: styleFun,
            zIndex:21
        });
        oldLayer.set("layerid", layerId);
        map.addLayer(oldLayer);
    }
    mapUtil.addLayerPopup(map, oldLayer, '', popFun);
}

function loadBasicDataType() {
    const baseDataType = $("#baseDataType").empty();
    $(
        `<li>
	     <div>
	         <span>基本信息</span>
	     </div>
	     <div id="baseDataDiv">
	         <!--基础数据、基本信息-->
	     </div>
	 </li>`
    ).appendTo(baseDataType);
    var param = {};
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = 'M0057';
    param.areaCode = curArea.areaCode;
    param.tableDesc = 'M0007,M0009,M0010,M0011,M0008,M0014,M0016,M0015,M0020,M0019,M0017,M0018,M0024,M0025,M0026';
    param.isChildrens = true;
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({//M0057处理数据
        type: "post",
        cache: false,
        async: true,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function (result) {
            if (result.returnCode * 1 === 0) {
                let data = result.data;
                const baseDataDiv=$("#baseDataDiv").empty();
                for(let i=0;i<data.length;i++){
                    let code = data[i].code;
                    let name = data[i].name;
                    let allNum = data[i].statistics.total;
                    if(code=='M0007'||code=='M0009'||code=='M0010'||
                        code=='M0011'||code=='M0008'||code=='M0014'||
                        code=='M0015'||code=='M0016'||code=='M0020'){
                        $(`<span code='${code}'>${name} (${allNum})<label class="rightCircle">&#10003;</label></span>`).appendTo(baseDataDiv);
                    }else{
                        const _li = $(`<li code='${code}'><div><span>${name}</span></div></li>`);
                        const _div = $("<div></div>")
                        for(let j=0;j<data[i].statistics.byIndustry.length;j++){
                            let industryCode = data[i].statistics.byIndustry[j].industryCode;
                            let industryName = data[i].statistics.byIndustry[j].industryName;
                            let total = data[i].statistics.byIndustry[j].total;
                            if(total>0){
                                $(`<span code='${industryCode}'>${industryName} (${total})<label class="rightCircle">&#10003;</label></span>`).appendTo(_div);
                            }
                        }
                        _div.appendTo(_li);
                        _li.appendTo(baseDataType);
                    }

                }
            }
        }
    });
    $(document).on("click","#baseDataType li>div>span", function() {
        let index=$(this).parent().parent().index();
        if(index==0){
            const code = $(this).attr("code");
            var className = $(this).attr('class');
            if(className && className.indexOf('active')>=0){
                $(this).removeClass('active');
                var layerid = config.dataLayerInfos[code].layerId;
                hideLayer(layerid);
            }else{
                $(this).addClass('active');
                const params = {};
                const offset = 0;
                params.offset = offset;
                params.limit = limit;
                let areaCode = util.getCurrentUserAreaCode();
                params.areaCode = areaCode;
                params.isChildrens = false;
                params.tableDesc = code;
                params.easy = true;
                params.isChildrens = true;
                loadBaseData('M0035', params);//查询基础信息的接口
            }
            selectTogether('','',true);
        }else{
            const code = $(this).parent().parent().attr("code");
            var className = $(this).attr('class');
            if(className && className.indexOf('active')>=0){
                $(this).removeClass('active');
            }else{
                $(this).addClass('active');
            }
            var activeObj = $(this).parent().find('.active');
            var industryCodes = "";
            if(activeObj.length>0){
                for(var i=0;i<activeObj.length;i++){
                    var industryCode = $(activeObj[i]).attr('code');
                    if(industryCodes==""){
                        industryCodes+=industryCode;
                    }else{
                        industryCodes+=','+industryCode;
                    }
                }
                const params = {};
                const offset = 0;
                params.offset = offset;
                params.limit = limit;
                params.industryCode = industryCodes;
                params.areaCode =  util.getCurrentUserAreaCode();
                params.isChildrens = true;
                params.tableDesc = code;
                params.easy = true;
                loadBaseData('M0035', params);//查询基础信息的接口
            }else{
                var layerid = config.dataLayerInfos[code].layerId;
                hideLayer(layerid);
            }
            selectTogether('','',true,code);
        }
    });
}

//加载天地图图层数据
function loadMapData(){
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = 'M0058';
    let param = {};
    param.areaCode = curArea.areaCode;
    param.level = curArea.area_level;
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type:'get',
        async:true,
        data:baseParam,
        url:config.api.baseUrl,
        success:function(result){
            if (result.returnCode * 1 === 0) {
                var data = result.data;
                const baseMapData = $("#baseMapData").empty();
                for(var key in data){
                    const _li = $(`<li > 
					<div>
						<span>`+key+`</span>
					</div>
					</li>`);
                    const _div = $("<div></div>");
                    data[key].forEach((r) => {
                        if(r.show==true){
                            $(`<span code='${r.codeCh}'  show='${r.show}'>${r.name} (${r.num})<label class="rightCircle">&#10003;</label></span>`).appendTo(_div);
                        }else{
                            $(`<span code='${r.codeCh}'  show='${r.show}' style='color:#5c6163fa;cursor:not-allowed;'>${r.name}<label class="rightCircle">&#10003;</label></span>`).appendTo(_div);
                        }
                    });
                    _div.appendTo(_li);
                    _li.appendTo(baseMapData);
                }
            }
        }
    });
    $(document).on("click","#baseMapData li div span",function(){
        let show = $(this).attr("show");
        if(show!='true'){
            return
        }
        var className = $(this).attr('class');
        if(className && className.indexOf('active')>=0){
            $(this).removeClass('active');
            const code = $(this).attr("code");
            hideLayer(code+'mapBaseLayer');
            clearTdtMapPolygon(code);
        }else{
            $(this).addClass('active');
            const code = $(this).attr("code");
            const params = {};
            let areaCode = util.getCurrentUserAreaCode();
            params.typeCode = code;
            params.areaCode = areaCode;
            params.level = curArea.area_level;
            loadMapBaseData('M0041', params);
        }
    })
}
//加载部门信息
function loadDeptInfo() {
    const deptInfoType = $("#deptInfoType").empty();
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode ='T0006';
    let param={};
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type: "get",
        cache: false,
        async: true,
        url: config.api.baseUrl,
        data:baseParam,
        dataType: 'JSON',
        success: function(result) {
            if(result.returnCode=='0'){
                let data=result.data;
                const _li=$("<li></li>");
                const _div=$("<div></div>");

                data.forEach((item) => {
                    $(`<span code ='${item.industryCode}'>${item.industryName}<label class="rightCircle">&#10003;</label></span>`).appendTo(_div);
                })

                _div.appendTo(_li);
                _li.appendTo(deptInfoType)

                $("#deptInfoType li div span").on("click",function(){
                    var className = $(this).attr('class');
                    if(className && className.indexOf('active')>=0){
                        $(this).removeClass('active');
                    }else{
                        $(this).addClass('active');
                    }
                    var selectObj = $('#deptInfoType .active');
                    if(selectObj.length>0){
                        var selectCode = "";
                        for(let i=0;i<selectObj.length;i++){
                            var thisCode = $(selectObj[i]).attr('code');
                            if(selectCode==''){
                                selectCode = thisCode;
                            }else{
                                selectCode+=','+thisCode;
                            }
                        }
                        const params = {};
                        params.industryCode = selectCode;
                        params.areaCode = JSON.parse(sessionStorage.getItem('curArea')).areaCode;
                        loadIndustryData('T0005',params);
                    }else{
                        hideLayer('industryLayer');
                    }
                })
            }

        },
    });
}

function loadElementData(){
    // var element = obj.find('span').eq(1).text();
    var element = $('.observationIsShow .liActive').find('span').eq(1).text();
    $('#timeline_cloud_box').removeClass('active');
    $('#timeline_box').removeClass('active');
    var cloudLayer = ol3_layerHelper.getLayerById(map, 'cloudLayer');
    if(cloudLayer) {
        map.removeLayer(cloudLayer);
    }
    var radarLayer = ol3_layerHelper.getLayerById(map, 'radarLayer');
    if(radarLayer) {
        map.removeLayer(radarLayer);
    }
    var liveDataLayer = ol3_layerHelper.getLayerById(map, 'liveDataLayer');
    if(liveDataLayer) {
        map.removeLayer(liveDataLayer);
    }
    removeTyphoonLayer();//删除台风的图层
    var tableHtml = $('.informationDetailBox .informationDetailTable').empty();
    var isBaseData = true;
    var type;
    if(element.indexOf('温度')>=0){
        type = 'temp';
        isBaseData = true;
    }else if(element.indexOf('降水')>=0){
        type = 'rain';
        isBaseData = true;
    }else if(element.indexOf('相对湿度')>=0){
        type = 'relhum';
        isBaseData = true;
    }else if(element.indexOf('风力风向')>=0){
        type = 'windv';
        isBaseData = true;
    }else if(element.indexOf('能见度')>=0){
        type = 'visib';
        isBaseData = true;
    }else if(element.indexOf('AQI')>=0){
        type = 'Aqi';
        isBaseData = false;
    }else if(element.indexOf('云图')>=0){
        type = 'cloud';
        isBaseData = false;
    }else if(element.indexOf('雷达图')>=0){
        type = 'radar';
        isBaseData = false;
    }else if(element.indexOf('台风')>=0){
        type = 'typhoon';
        isBaseData = false;
    }
    selectEleType = type;
    function compare(arg) {
        return function(a, b) {
            return b[arg] - a[arg];
        }
    }
    $('.typhoonBox').hide();
    if(isBaseData){//是否为基础数据
        if(liveData){
            var sortData = liveData.resultdata.sort(compare(type));
            var tableHtml = $('.informationDetailBox .informationDetailTable').empty();
            let filterData = [];
            var html = '';
            html+='<table><thead><tr><td style="width: 30%">排名</td><td style="width: 30%">站点</td><td style="width: 40%">'+element+'</td></tr></thead><tbody>';
            for(var i=0;i<sortData.length;i++){
                var stationName = sortData[i].stationname;
                var value = sortData[i][type];
                if(value!=undefined){
                    if('temp'==type){
                        if(value!=''){
                            filterData.push(value);
                            html+='<tr><td>'+(i+1)+'</td><td>'+stationName+'</td><td>'+value+'</td></tr>';
                        }
                    }else{
                        if(value!=''){
                            filterData.push(value);
                            html+='<tr><td>'+(i+1)+'</td><td>'+stationName+'</td><td>'+value+'</td></tr>';
                        }
                    }
                }
            }
            let maxTemp;
            let minTemp;
            if(filterData.length>0){
                if(type=='temp'){
                    maxTemp = filterData[0];
                    minTemp = filterData[filterData.length-1];
                    loadTempRender(Math.ceil(maxTemp),Math.floor(minTemp));
                }else{
                    maxTemp = filterData[0];
                    minTemp = filterData[filterData.length-1];
                    loadElementRender(maxTemp,minTemp,type);
                }
                html+='</tbody></table>';
                tableHtml.html(html);
                let c = commonUtil.pointToGeoJson(sortData,  'longitude','latitude', {});
                let features = featureUtil.readGeojson(c, 'EPSG:3857');
                var vectorSource = new ol.source.Vector({
                    features:features,
                });
                var clusterSource = new ol.source.Cluster({
                    distance: 25,
                    source: vectorSource,
                });
                let jsonLayer = new ol.layer.Vector({
                    source: clusterSource,
                    style: liveDataStyle,
                    zIndex:21
                });
                jsonLayer.set("layerid", 'liveDataLayer')
                map.addLayer(jsonLayer);
                createIsoSurface('liveDataLayer');
            }
        }
    }else{//AQI、云图、雷达图、台风展示
        if(type=='Aqi'){
            //加载AQI数据
            //dateStr = '2019082001';
            var dateTime=$("#baseDataListTime1").val();
            var dateStr=dateTime.replace("年","").replace("月","").replace("日","").replace(" ","").replace("时","");
            let areaCode = util.getCurrentUserAreaCode();
            let param = config.api.baseDataParam;
            let p = {
                'observtime': dateStr,
                'areacodeFilter':0
            };
            param.params = JSON.stringify(p);
            param.interfaceCode = 'M0036';
            $.ajax({
                type: "post",
                cache: false,
                async: false,
                data: param,
                url: config.api.baseUrl,
                dataType: 'JSON',
                success: function (result) {
                    let code = result.returnCode;
                    if (code !== '0') {
                        return;
                    }
                    AqiData = result.data;
                    var sortData = AqiData.sort(compare(type));
                    //组装table 页面的数据
                    var html = '';
                    html+='<table><thead><tr><td style="width: 30%">排名</td><td style="width: 30%">站点</td><td style="width: 40%">'+element+'</td></tr></thead><tbody>';
                    for(var i=0;i<sortData.length;i++){
                        var stationName = sortData[i].StationName;
                        var value = sortData[i][type];
                        if(value==undefined){
                            value = '';
                        }
                        html+='<tr><td>'+(i+1)+'</td><td>'+stationName+'</td><td>'+value+'</td></tr>';
                    }
                    html+='</tbody></table>';
                    tableHtml.html(html);
                    //地图数据展示
                    let params = {
                        "layerId": 'liveDataLayer',
                        "opacity": 1,
                        "zIndex": 21,
                        "crs": "EPSG:3857",
                        "style":apiStyle,
                        "x": "longitude",
                        "y": "latitude"
                    };
                    // var newLayer = layerUtil.createPointJsonLayer(sortData, params, {
                    //
                    // });
                    let c = commonUtil.pointToGeoJson(sortData,  'longitude','latitude', {});
                    let features = featureUtil.readGeojson(c, 'EPSG:3857');
                    var vectorSource = new ol.source.Vector({
                        features:features,
                    });
                    var clusterSource = new ol.source.Cluster({
                        distance: 25,
                        source: vectorSource,
                    });
                    let newLayer = new ol.layer.Vector({
                        source: clusterSource,
                        style: apiStyle,
                        zIndex:21
                    });
                    newLayer.set("layerid", 'liveDataLayer');
                    map.addLayer(newLayer);
                    // mapUtil.addLayerPopup(map, newLayer, '', showIndustryInfo);
                }
            })
        }else if(type=='radar'){
            loadRadar1();
            $('.radarLegend').show();
            $(".informationDetailBox").css('display','none');
            $('.informationDetail').css('display','none');
        }else if(type=='cloud'){
            loadCloud1();
            $(".informationDetailBox").css('display','none');
            $('.informationDetail').css('display','none');
        }else if(type=='typhoon'){
            $(".informationDetailBox").css('display','none');
            loadTyphoon();
            $('.informationDetail').css('display','none');
            $('.typhoonBox').show();
        }
    }
    layer.closeAll();
}
function loadTempRender(maxTemp,minTemp){
    $.ajax({
        type:'get',
        async:false,
        url:config.base.baseUrl+'/bas/common/colorInfo?min='+minTemp+'&max='+maxTemp+'&opacity=0.7',
        dataType:'json',
        success:function(result){
            if(result){
                config.render.tempUse = result;
                //console.log("色标"+JSON.stringify(result));
            }
        },error:function (obj) {
            console.log(obj);
        }
    });
}
function loadElementRender(maxValue,minValue,type){
    let render = config.render[type];
    let newRender = [];
    for(let i=0;i<render.length;i++){
        let maxV = render[i].color[1];
        let minV = render[i].color[0];
        if(minV=='min'){
            if(minValue<maxV){
                //当前图例从最小值开始
                newRender.push(render[i]);
            }
        }else if(maxV=='max'){
            if(maxValue>minV){
                newRender.push(render[i]);
            }
        }else{
            if(minValue>=minV && minValue<maxV){
                newRender.push(render[i]);
            }else if(maxValue>=minV && maxValue<maxV){
                newRender.push(render[i]);
            }else if(maxValue>=minV && minValue<minV){
                newRender.push(render[i]);
            }
        }
    }
    type = type+'Use';
    config.render[type] = newRender;
}
/**
 * 基础数据时间框前进或者后退一小时
 * @param {Object} option
 */
function chanageTime(option){
    var thisTime=$("#baseDataListTime").val();
    var d=thisTime.replace("年","-").replace("月","-").replace("日","").replace("时","");
    var sdtime1 = new Date(d+":00:00");
    if(option=='nextHour'){
        if(timeStamp2String(sdtime1)==timeStamp2String(new Date())){
            alert("选择时间大于当前时间，暂无实况！，请重新选择！");
            return;
        }
        var sdtime2 = sdtime1.setHours(sdtime1.getHours() +1)//小时

    }else if(option=='pastHour'){
        var sdtime2 = sdtime1.setHours(sdtime1.getHours() -1)//小时
    }
    $("#baseDataListTime").val(timeStamp2String(sdtime2));
    $("#baseDataListTime1").val(timeStamp2String(sdtime2));
    //重新请求接口
    loadLiveData();
    //重新渲染表格
    loadElementData();
}



/**
 * 格式化时间
 * @param {Object} fmt
 */
function timeStamp2String(time){
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
    return year + "年" + month + "月" + date+"日 "+hour+"时";
}
/**
 * 观测时间框点击事件
 */
function onChangeTime(){
    //重新请求接口
    loadLiveData();
    //重新渲染表格
    loadElementData();
}
function loadIndustryToBasicData(){
    var code = $('.BtnDetailTxt .spanActive').attr('code');
    var paramCode = '';
    if(code=='basedata'){
        var types = $($('#baseDataType').find('li').eq(0).find('div').eq(1)[0]).find('span');
        for(var i=0;i<types.length;i++){
            var typeCode = $(types[i]).attr('code');
            if(paramCode==''){
                paramCode = typeCode;
            }else{
                paramCode+=','+typeCode;
            }
        }
    }else{
        var allObj = $('.levelOneContent .itemConTxt >ul');
        for(var i=0;i<allObj.length;i++) {
            if ($(allObj[i]).css('display') == 'block') {
                if($(allObj[i]).attr('id')=='liveObserveData'){
                    let industryList = $('#liveObserveData .active');

                    for(let i=0;i<industryList.length;i++){
                        let eleCode = $(industryList[i]).attr('code');
                        if(eleCode==code){
                            let industryCode = $(industryList[i]).parent().parent().attr('code');
                            if(paramCode.indexOf(industryCode)<0){
                                if(paramCode==''){
                                    paramCode=industryCode;
                                }else{
                                    paramCode+=','+industryCode;
                                }
                            }
                        }
                    }
                }else if($(allObj[i]).attr('id')=='baseDataType'){
                    let liObj = $('#baseDataType li');
                    for(let j=0;j<liObj.length;j++){
                        if($(liObj[j]).attr('code')==code){
                            let spanObjs = $($(liObj[j]).find('div').eq(1)[0]).find('span');
                            for(let x=0;x<spanObjs.length;x++){
                                if($(spanObjs[x]).attr('class') && $(spanObjs[x]).attr('class').indexOf('active')>=0){
                                    if(paramCode==''){
                                        paramCode=$(spanObjs[x]).attr('code');
                                    }else{
                                        paramCode+=','+$(spanObjs[x]).attr('code');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var selectWord = config.dataLayerInfos[code].selectWord;
    if(selectWord==''){
        $('#searchLike').val('');
        $('.basicInformationTable >table').empty();
    }else if(selectWord && selectWord!=''){
        $('#searchLike').val(selectWord);
        const params = {};
        params.isChildrens = true;
        loadIndustryBasicData('M0035',params,true);
    }
    createTableDiv(code,paramCode);
}
function createTableDiv(type,paramCode){
    var param = {};
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = 'M0057';
    let areaCode = util.getCurrentUserAreaCode();
    param.areaCode = areaCode;
    param.isChildrens = true;
    var code = $('.BtnDetailTxt .spanActive').attr('code');
    if(code=='basedata'){
        param.tableDesc = paramCode;
    }else{
        param.tableDesc = type;
    }
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type: "post",
        cache: false,
        async: true,
        data:baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function (result) {
            if(type=='basedata'){//按照基础类型区分数据
                var spans = $('#baseDataType').find('li').eq(0).find('div').eq(1).find('span');
                var liHtml = $('.informationType').empty();
                var html = "";
                let selectCodes = '';
                for(var i=0;i<spans.length;i++){
                    var code = $(spans[i]).attr('code');
                    var name = $(spans[i]).html();
                    for(let j=0;j<result.data.length;j++){
                        if(code==result.data[j].code){
                            let thisNum = result.data[j].statistics.total;
                            if($(spans[i]).attr('class') && $(spans[i]).attr('class')!=''){
                                html+='<li class="active" code="'+code+'">'+name+'</li>';
                                if(selectCodes==''){
                                    selectCodes = code;
                                }else{
                                    selectCodes+=','+code;
                                }
                            }else{
                                html+='<li code="'+code+'">'+name+'</li>';
                            }
                            break;
                        }
                    }
                }
                liHtml.html(html);
                const params = {};
                params.tableDesc = selectCodes;
                var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
                var selectWord = config.dataLayerInfos[selectCode].selectWord;
                if(selectWord==''){
                    loadIndustryBasicData('M0035',params,false);
                }else if(selectWord && selectWord!=''){
                    loadIndustryBasicData('M0035',params,true);
                }
                $('.informationType >li').on('click',function(){
                    const params = {};
                    var className = $(this).attr('class');
                    var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
                    if(className&&className.indexOf('active')>=0){
                        $(this).removeClass('active');
                        var typeCode = $(this).attr('code');
                        if(selectCode=='basedata'){
                            let layerid = config.dataLayerInfos[typeCode].layerId;
                            let thisOldLayer = ol3_layerHelper.getLayerById(map,layerid);
                            if(thisOldLayer){
                                map.removeLayer(thisOldLayer);
                            }
                            hideLayer(layerid)
                        }
                    }else{
                        $(this).addClass('active');
                    }
                    params.tableDesc = $(this).attr('code');
                    params.easy = true;
                    var selectWord = config.dataLayerInfos[selectCode].selectWord;
                    if(selectWord==''){
                        loadIndustryBasicData('M0035',params,false);
                    }else if(selectWord && selectWord!=''){
                        loadIndustryBasicData('M0035',params,true);
                    }
                    selectTogether('',type,'');

                })
            }else{//按照行业区分数据
                var liHtml = $('.informationType').empty();
                var html = "";
                let data = result.data[0];
                for(let i=0;i<data.statistics.byIndustry.length;i++){
                    if(paramCode && paramCode!='' && paramCode.indexOf(data.statistics.byIndustry[i].industryCode)>=0){
                        html+='<li class="active" code="'+data.statistics.byIndustry[i].industryCode+'">'+data.statistics.byIndustry[i].industryName+'<label class="rightCircle">&#10003;</label>(<i>'+data.statistics.byIndustry[i].total+'</i>)</li>';
                    }else{
                        if(data.statistics.byIndustry[i].total>0){
                            html+='<li code="'+data.statistics.byIndustry[i].industryCode+'">'+data.statistics.byIndustry[i].industryName+'<label class="rightCircle">&#10003;</label>(<i>'+data.statistics.byIndustry[i].total+'</i>)</li>';
                        }
                    }
                }
                liHtml.html(html);
                const params = {};
                var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
                var selectWord = config.dataLayerInfos[selectCode].selectWord;
                if(selectWord==''){
                    loadIndustryBasicData('M0035',params,false);
                }else if(selectWord && selectWord!=''){
                    loadIndustryBasicData('M0035',params,true);
                }
                $('.informationType >li').on('click',function(){
                    const params = {};
                    var className = $(this).attr('class');
                    var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
                    if(className&&className.indexOf('active')>=0){
                        $(this).removeClass('active');
                        if(selectCode!='basedata'){
                            let layerid = config.dataLayerInfos[selectCode].layerId;
                            let oldLayer = ol3_layerHelper.getLayerById(map,layerid);
                            if(oldLayer){
                                map.removeLayer(oldLayer);
                            }
                            hideLayer(layerid);
                        }
                    }else{
                        $(this).addClass('active');
                    }
                    // selectTogether(className,$(this).attr('code'),'',$(this).attr('code'));
                    var selectWord = config.dataLayerInfos[selectCode].selectWord;
                    params.easy = true;
                    if(selectWord==''){
                        loadIndustryBasicData('M0035',params,false);
                    }else if(selectWord && selectWord!=''){
                        loadIndustryBasicData('M0035',params,true);
                    }
                    selectTogether(className,$(this).attr('code'),'',$(this).attr('code'));

                })
            }
        }
    })
}

/**
 *
 * @param code
 * @param param
 * @param isSelect
 */
function loadIndustryBasicData(code,param,isSelect){//isSelect是否为数据筛选查询
    layer.load(0, {
        shade: [0.2, '#000']
    });
    param.isChildrens = true;
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = code;
    var value=$("#searchLike").val();
    if(value!=null&&value!=''&&value!=undefined){
        param.likeOption = value;
        isSelect = true;
    }
    var descCode = $('.BtnDetailTxt .spanActive').attr('code');
    var isDefault = false;
    if(descCode!='basedata'){
        param.tableDesc = descCode;
        var activeObj = $(".informationType .active");
        var industryCodes = "";
        if(activeObj.length>0){
            for(var i=0;i<activeObj.length;i++){
                var industryCode = $(activeObj[i]).attr('code');
                if(industryCodes==""){
                    industryCodes+=industryCode;
                }else{
                    industryCodes+=','+industryCode;
                }
            }
            param.industryCode = industryCodes;
        }else{
            isDefault = true;
        }
    }else{
        var activeObj = $(".informationType .active");
        var baseDataCodes = "";
        if(activeObj.length>0){
            for(var i=0;i<activeObj.length;i++){
                var dataCode = $(activeObj[i]).attr('code');
                if(baseDataCodes==""){
                    baseDataCodes+=dataCode;
                }else{
                    baseDataCodes+=','+dataCode;
                }
            }
            if(isSelect){
                param.tableDesc = "M0007,M0008,M0009,M0010,M0011,M0014,M0015,M0016,M0020";
            }else{
                param.tableDesc = baseDataCodes;
            }
        }
        else{
            param.tableDesc = "M0007,M0008,M0009,M0010,M0011,M0014,M0015,M0016,M0020";
            isDefault = true;
        }
    }
    const offset = 0;
    param.offset = offset;
    param.limit = 1000000;
    param.areaCode = util.getCurrentUserAreaCode();
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type: "get",
        cache: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function(result) {
            if (result.returnCode * 1 === 0) {
                var selectCodes = '';
                var selectObj = $('.informationType .active');
                for(let i=0;i<selectObj.length;i++){
                    if(selectCodes==''){
                        selectCodes = $(selectObj[i]).attr('code');
                    }else{
                        selectCodes+=','+$(selectObj[i]).attr('code');
                    }
                }
                var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
                //添加地图图层数据
                if(!isDefault){//当时是默认查询的时候不加载地图数据
                    var layerData = result.data;
                    if(layerData.length<1){//当前未选中任何要素的时候，清空所有加载的数据图层
                        if(selectCode=='basedata'){
                            for(let i=0;i<selectCodes.split(',').length;i++){
                                let layerid = config.dataLayerInfos[selectCodes.split(',')[i]].layerId;
                                var oldLayer = ol3_layerHelper.getLayerById(map,layerid);
                                if(oldLayer){
                                    map.removeLayer(oldLayer);
                                }
                            }
                        }else{
                            let layerid = config.dataLayerInfos[selectCodes].layerId;
                            var oldLayer = ol3_layerHelper.getLayerById(map,layerid);
                            if(oldLayer){
                                map.removeLayer(oldLayer);
                            }
                        }
                    }
                    for(let i=0;i<layerData.length;i++){
                        let layerid = config.dataLayerInfos[layerData[i].tableDesc].layerId;
                        var oldLayer = ol3_layerHelper.getLayerById(map,layerid);
                        if(oldLayer){
                            map.removeLayer(oldLayer);
                        }
                        if(layerData[i].data.length>0){
                            var tableDesc = layerData[i].tableDesc;
                            if(descCode=='basedata'){
                                if(selectCodes.indexOf(tableDesc)>=0){
                                    let p = {
                                        "crs": "EPSG:3857",
                                        "x": "Lon",
                                        "y": "Lat"
                                    }
                                    dataCallback(layerData[i].data, p, tableDesc,true);
                                }
                            }else{
                                let p = {
                                    "crs": "EPSG:3857",
                                    "x": "Lon",
                                    "y": "Lat"
                                }
                                dataCallback(layerData[i].data, p, tableDesc,true);
                            }
                        }
                    }
                }
            }
                layer.closeAll();
        }
    });
    /**加载数据列表**/
    loadDataList(baseParam,isSelect,descCode);
}
var fenyeTableCount=0;//总条数
var fenyeTablePage=0;//总页数
var fenyeCurPage=1;//当前页
var fenyeCount = 1;//序号
var fenyeOffset = 0;//从第几条开始
var fenyeBaseParam;
function loadDataList(baseParam,isSelect,descCode) {
    fenyeTableCount=0;
    fenyeTablePage=0;
    fenyeCurPage=1;
    fenyeCount = 1;
    fenyeOffset = 0;
    let param=JSON.parse(baseParam.params);
    param.offset = fenyeOffset;
    if(descCode=='basedata'){
        let codeArr=param.tableDesc.split(",");
            if(codeArr.length==1){
                param.limit =9;
            }else if(codeArr.length==2){
                param.limit =4;
            }else if(codeArr.length==3){
                param.limit =3;
            }else if(codeArr.length==4||codeArr.length==5||codeArr.length==6){
                param.limit =2;
            }else if(codeArr.length==7||codeArr.length==8||codeArr.length==9){
                param.limit =1;
            }
    }else{
        param.limit = 9;
    }
    param.easy=false;
    baseParam.params = JSON.stringify(param);
    fenyeBaseParam=baseParam;
    var loadHtml = '';
    loadHtml+='<div class="loading" id="tableDataListLoading">' +
        '<img src="./images/loading.png" alt="">'+
        '<p>加载中 <i>。</i><i>。</i><i>。</i></p>' +
        '</div>' +
        '<table></table>';
    $('.basicInformationTable').empty().append(loadHtml);
    $.ajax({
        type: "get",
        cache: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function(result) {
            if (result.returnCode * 1 === 0) {
                if(fenyeCurPage==1){
                    fenyeTableCount=result.total;
                    fenyeTablePage=Math.ceil(fenyeTableCount/9);
                }
                var selectCodes = '';
                var selectObj = $('.informationType .active');
                for(let i=0;i<selectObj.length;i++){
                    if(selectCodes==''){
                        selectCodes = $(selectObj[i]).attr('code');
                    }else{
                        selectCodes+=','+$(selectObj[i]).attr('code');
                    }
                }
                var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
                //修改table页面元素的数据数量
                if(isSelect){//如果是筛选查询就重新修改数据数量
                    var activeObj = $(".informationType >li");
                    if(activeObj.length>0){
                        var codeDataObj = {};
                        if(selectCode=='basedata'){
                            for(let j=0;j<result.data.length;j++){
                                codeDataObj[result.data[j].tableDesc] = result.data[j].data.length;
                            }
                        }else{
                            for(let j=0;j<result.data[0].data.length;j++){
                                var industryNum = codeDataObj[result.data[0].data[j].industryCode];
                                if(industryNum==undefined || industryNum=='' || industryNum==null){
                                    if(result.data[0].data[j].industryCode){
                                        codeDataObj[result.data[0].data[j].industryCode] = 1;
                                    }
                                }else{
                                    codeDataObj[result.data[0].data[j].industryCode] = codeDataObj[result.data[0].data[j].industryCode]+1;
                                }
                            }
                        }
                        for(let i=0;i<activeObj.length;i++){
                            var dataCode = $(activeObj[i]).attr('code');
                            var num = codeDataObj[dataCode];
                            if(num){
                                $($(activeObj[i]).find('i')).text(num);
                            }else{
                                $($(activeObj[i]).find('i')).text(0);
                            }
                        }
                    }
                }

                $('.basicInformationTable>table').empty();
                var infoHtml = $('.basicInformationTable>table');
                var html = '';
                html+='<table style="word-wrap: break-word; word-break: break-all;"><thead><tr><td ><span style="width: 55px;display: inline-block">序号</span></td><td ><span style="width: 150px;display: inline-block">名称</span></td><td ><span style="width: 100px;display: inline-block">地址</span></td></tr></thead><tbody id="tableTbody">';
                for(var i=0;i<result.data.length;i++){
                    let data = result.data[i].data;
                    if(data.length>0){
                        for(var j=0;j<data.length;j++){
                            if(descCode=='basedata'){
                                if(selectCodes==''){
                                    let stationName = data[j][config.dataLayerInfos[result.data[i].tableDesc].name];
                                    let address = data[j].dataSourceArea;
                                    if(address==undefined){
                                        address = '';
                                    }
                                    if(stationName==undefined){
                                        stationName = '';
                                    }
                                    html+='<tr><td ><span style="width: 55px;display: inline-block">'+fenyeCount+'</span></td><td ><span style="width: 150px;display: inline-block">'+stationName+'</span></td><td ><span style="width: 100px;display: inline-block">'+address+'</span></td></tr>';
                                    fenyeCount++;
                                }else if(selectCodes.indexOf(result.data[i].tableDesc)>=0){
                                    let stationName = data[j][config.dataLayerInfos[result.data[i].tableDesc].name];
                                    let address = data[j].dataSourceArea;
                                    if(address==undefined){
                                        address = '';
                                    }
                                    if(stationName==undefined){
                                        stationName = '';
                                    }
                                    html+='<tr><td>'+fenyeCount+'</td><td>'+stationName+'</td><td>'+address+'</td></tr>';
                                    fenyeCount++;
                                }
                            }else{
                                let stationName = data[j][config.dataLayerInfos[result.data[i].tableDesc].name];
                                let address = data[j].dataSourceArea;
                                if(address==undefined){
                                    address = '';
                                }
                                if(stationName==undefined){
                                    stationName = '';
                                }
                                html+='<tr><td>'+fenyeCount+'</td><td>'+stationName+'</td><td>'+address+'</td></tr>';
                                fenyeCount++;
                            }
                        }
                    }
                }
                html+='</tbody></table><span style="color: white;margin-left: 45%;" id="tableLoadMore">加载更多</span>';
                infoHtml.append(html);
                $("#tableDataListLoading").hide();//加载结束
            }
            layer.closeAll();
        }
    });
}
/**基础数据 -->'加载更多' 点击事件**/
$(document).on("click","#tableLoadMore",function () {
    if(fenyeCurPage<fenyeTablePage){
        fenyeOffset=9*fenyeCurPage;
        fenyeCurPage++;
        let params=JSON.parse(fenyeBaseParam.params);
        params.offset = fenyeOffset;
        fenyeBaseParam.params=JSON.stringify(params);
        $.ajax({
            type: "get",
            cache: false,
            data: fenyeBaseParam,
            url: config.api.baseUrl,
            dataType: 'JSON',
            success: function(result) {
                if (result.returnCode * 1 === 0) {
                    var html = '';
                    for(var i=0;i<result.data.length;i++){
                        let data = result.data[i].data;
                        if(data.length>0){
                            for(var j=0;j<data.length;j++){
                                let stationName = data[j][config.dataLayerInfos[result.data[i].tableDesc].name];
                                let address = data[j].dataSourceArea;
                                if(address==undefined){
                                    address = '';
                                }
                                if(stationName==undefined){
                                    stationName = '';
                                }
                                html+='<tr><td>'+fenyeCount+'</td><td>'+stationName+'</td><td>'+address+'</td></tr>';
                                fenyeCount++;
                            }
                        }
                    }
                    $(html).appendTo($("#tableTbody"));
                }
            }
        });
    }else{
        $("#tableLoadMore").hide();
    }
});
function selectTogether(className,type,direction,clickCode){
    if(direction){//正向联动选择
        var selectCode = '';
        var allObj = $('.levelOneContent .itemConTxt >ul');
        var nowTypeCode = $('.BtnDetailTxt .spanActive').attr('code');
        for(var i=0;i<allObj.length;i++){
            if($(allObj[i]).css('display')=='block'){
                var liObj = $(allObj[i]).find('li');
                if(nowTypeCode=='basedata'){//基础数据选择的code
                    var spanObj = $(liObj[0]).find('div').eq(1).find('span');
                    for(var x=0;x<spanObj.length;x++){
                        if($(spanObj[x]).attr('class') && $(spanObj[x]).attr('class').indexOf('active')>=0){
                            if(selectCode==''){
                                selectCode = $(spanObj[x]).attr('code');
                            }else{
                                selectCode += ','+$(spanObj[x]).attr('code');
                            }
                        }
                    }
                    var objs = $('.informationType >li');
                    for(var x=0;x<objs.length;x++){
                        if(selectCode!='' && selectCode.indexOf($(objs[x]).attr('code'))>=0){
                            $(objs[x]).addClass('active');
                        }else{
                            $(objs[x]).removeClass('active');
                        }
                    }
                }else{
                    let liTableObj = $('.informationType li');
                    if(nowTypeCode && nowTypeCode.indexOf(clickCode)>=0){
                        let selectCode = "";
                        if($(allObj[i]).css('display')=='block' && $(allObj[i]).attr('id').indexOf('baseDataType')>=0){
                            for(let j=0;j<$('#baseDataType li').length;j++){
                                if($($('#baseDataType li')[j]).attr('code')==nowTypeCode){
                                    let spanObj = $($('#baseDataType li')[j]).find('div').eq(1).find('span');
                                    for(let x= 0;x<spanObj.length;x++){
                                        if($(spanObj[x]).attr('class') && $(spanObj[x]).attr('class').indexOf('active')>=0){
                                            if(selectCode==''){
                                                selectCode = $(spanObj[x]).attr('code');
                                            }else{
                                                selectCode += ','+$(spanObj[x]).attr('code');
                                            }
                                        }
                                    }
                                }
                            }
                        }else if($(allObj[i]).css('display')=='block' && $(allObj[i]).attr('id').indexOf('liveObserveData')>=0){
                            let liveDataObj = $('#liveObserveData >li');
                            for(let j=0;j<liveDataObj.length;j++) {//循环li
                                let spanObjs = $(liveDataObj[j]).find('div').eq(1).find('span');;
                                for(let x=0;x<spanObjs.length;x++){
                                    if($(spanObjs[x]).attr('code')==nowTypeCode){
                                        if($(spanObjs[x]).attr('class') && $(spanObjs[x]).attr('class').indexOf('active')>=0){
                                            if(selectCode==''){
                                                selectCode =$(liveDataObj[j]).attr('code');
                                            }else{
                                                selectCode += ','+$(liveDataObj[j]).attr('code');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        for(var j=0;j<liTableObj.length;j++){
                            if(selectCode && selectCode.indexOf($($(liTableObj)[j]).attr('code'))>=0){
                                if($($(liTableObj)[j]).attr('class') && $($(liTableObj)[j]).attr('class').indexOf('active')>=0){

                                }else{
                                    $($(liTableObj)[j]).addClass('active')
                                }
                            }else{
                                $($(liTableObj)[j]).removeClass('active')
                            }
                        }
                    }
                }
            }
        }
    }else{//反向联动选择
        var activeObj = $(".informationType .active");
        var codes = "";
        if(activeObj.length>0){
            for(var i=0;i<activeObj.length;i++){
                var dataCode = $(activeObj[i]).attr('code');
                if(codes==''){
                    codes = dataCode;
                }else{
                    codes+=','+dataCode;
                }
            }
        }else{
            codes = type;
        }
        if(type == 'basedata'){
            var allObj = $('#baseDataType').find('li').eq(0).find('div').eq(1).find('span');
            for(var j=0;j<allObj.length;j++){
                if(codes.indexOf($(allObj[j]).attr('code'))>=0){
                    $(allObj[j]).addClass('active');
                }else{
                    $(allObj[j]).removeClass('active');
                }
            }
        }else{
            var nowTypeCode = $('.BtnDetailTxt .spanActive').attr('code');//底部选中的code
            var allObj = $('.levelOneContent .itemConTxt >ul');
            for(var i=0;i<allObj.length;i++){//循环出当前选中的li
                if($(allObj[i]).css('display')=='block' && $(allObj[i]).attr('id').indexOf('liveObserveData')>=0){
                    let liveDataObj = $('#liveObserveData >li');
                    for(let j=0;j<liveDataObj.length;j++){//循环li
                        if(clickCode && clickCode.indexOf($(liveDataObj[j]).attr('code'))>=0){
                            let spanDataObj = $(liveDataObj[j]).find('div').eq(1).find('span');
                            for(let x=0;x<spanDataObj.length;x++){
                                if(nowTypeCode && nowTypeCode.indexOf($(spanDataObj[x]).attr('code'))>=0){
                                    if($(spanDataObj[x]).attr('class') && $(spanDataObj[x]).attr('class').indexOf('active')>=0){
                                        $(spanDataObj[x]).removeClass('active');
                                    }else{
                                        $(spanDataObj[x]).addClass('active');
                                    }
                                }
                            }

                        }
                    }
                }else if($(allObj[i]).css('display')=='block' && $(allObj[i]).attr('id').indexOf('baseDataType')>=0){
                    let baseDataObj = $('#baseDataType >li');
                    for(let j=0;j<baseDataObj.length;j++) {//循环li
                        if(nowTypeCode && nowTypeCode.indexOf($(baseDataObj[j]).attr('code'))>=0){
                            let spanDataObj = $(baseDataObj[j]).find('div').eq(1).find('span');
                            for(let x=0;x<spanDataObj.length;x++){
                                if(clickCode && clickCode.indexOf($(spanDataObj[x]).attr('code'))>=0){
                                    if($(spanDataObj[x]).attr('class') && $(spanDataObj[x]).attr('class').indexOf('active')>=0){
                                        $(spanDataObj[x]).removeClass('active');
                                    }else{
                                        $(spanDataObj[x]).addClass('active');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
/**
 * 基础信息模糊查询点击按钮
 */
function searchBtn(){
    var params={};
    var selectCode = $('.BtnDetailTxt .spanActive').attr('code');
    var value=$("#searchLike").val();
    if(value!=null&&value!=''&&value!=undefined){
        config.dataLayerInfos[selectCode].selectWord = value;
    }else{
        config.dataLayerInfos[selectCode].selectWord = "";
    }
    loadIndustryBasicData('M0035',params,true);//是否进行数据筛选
}
function resetData(){//重置数据
    var params={};
    loadIndustryBasicData('M0035',params,true);
}
function clearTdtMapPolygon(layerCode) {
    //清除面
    for(var i in tdtPolygonLayid) {
        let curLayerid = tdtPolygonLayid[i];
        var curLayer = ol3_layerHelper.getLayerById(map, curLayerid);
        if(curLayerid!=undefined){
            if(curLayerid.startsWith(layerCode)){
                map.removeLayer(curLayer);
            }else{

            }
        }
    }
    tdtPolygonLayid=[];
}
function loadMapBaseData(code,param){
    layer.load(0, {
        shade: [0.2, '#000']
    });
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = code;
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    var layerCode = param.typeCode;
    $.ajax({
        type: "get",
        cache: false,
        // async: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function(result) {
            if (result.returnCode * 1 === 0) {
                var layerid = layerCode+'mapBaseLayer';
                clearTdtMapPolygon(layerCode);
                //判断数据类型
                /**点开始**/
                const pointArr = [];
                for(var i=0;i<result.data.length;i++){
                    const obj = result.data[i];
                    if(obj.Lon!=null && obj.Lat!=null){
                        pointArr.push(obj);
                    }
                }
                /**点结束**/
                /**单面开始**/
                let polygon = false;
                for(var i=0;i<result.data.length;i++) {
                    const obj = result.data[i];
                    if (obj.GeoBoundary!=undefined&&obj.GeoBoundary.startsWith("POLYGON")) {
                        polygon=true;
                        break;
                    }
                }
                /**单面结束**/
                /**多面开始**/
                let multiPolygon = false;
                for(var i=0;i<result.data.length;i++) {
                    const obj = result.data[i];
                    if (obj.GeoBoundary!=undefined&&obj.GeoBoundary.startsWith("MULTIPOLYGON")) {
                        multiPolygon=true;
                        break;
                    }
                }
                /**多面结束**/
                /**单线开始**/
                let line = false;
                for(var i=0;i<result.data.length;i++) {
                    const obj = result.data[i];
                    if (obj.GeoBoundary!=undefined&&obj.GeoBoundary.startsWith("LINESTRING")) {
                        line=true;
                        break;
                    }
                }
                /**单线结束**/
                /**多线开始**/
                let multiLine = false;
                for(var i=0;i<result.data.length;i++) {
                    const obj = result.data[i];
                    if (obj.GeoBoundary!=undefined&&obj.GeoBoundary.startsWith("MULTILINESTRING")) {
                        multiLine=true;
                        break;
                    }
                }
                /**多线结束**/
                if(pointArr.length>0){
                    //清除点
                    var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
                    if(oldLayer) {
                        map.removeLayer(oldLayer);
                    }
                    let params = {
                        "layerId": layerid,
                        "opacity": 1,
                        "zIndex": 21,
                        "crs": "EPSG:3857",
                        "style": industryStyle,
                        "x": "Lon",
                        "y": "Lat"
                    };
                    var newLayer = layerUtil.createPointJsonLayer(pointArr, params, {
                        code: code
                    });
                    newLayer.set("layerid", layerid);

                    tdtPolygonLayid.push(layerid);
                    map.addLayer(newLayer);
                    mapUtil.addLayerPopup(map, newLayer, '', showMapBaseInfo);
                }
                if(line){
                    for(var i=0;i<result.data.length;i++) {
                        const obj = result.data[i];
                        if (obj.GeoBoundary.startsWith("LINESTRING")) {
                            let lineArr = [];
                            let curGEO;
                            curGEO = obj.GeoBoundary.replace("LINESTRING(", "");
                            curGEO = curGEO.replace(")", "");
                            let geoArr = curGEO.split(",");
                            for (var j in geoArr) {
                                let arr = geoArr[j].split(" ");
                                let overArr=[];
                                overArr.push(arr[0]);
                                overArr.push(arr[1]);
                                lineArr.push(overArr);
                            }
                            var features = [];
                            var LineFeature = new ol.Feature({
                                geometry: (new ol.geom.LineString(
                                    lineArr
                                )).transform("EPSG:4326", "EPSG:3857"),
                                properties: {
                                    "name": obj.name
                                }
                            });
                            features.push(LineFeature);
                            var source = new ol.source.Vector({
                                features: features
                            });
                            var polygonLayer = new ol.layer.Vector({
                                source: source,
                                zIndex: 21,
                                style: tdtLineStyle
                            });
                            polygonLayer.set("layerid", layerid + "_LINE" + i + "_layer");
                            tdtPolygonLayid.push(layerid + "_LINE" + i + "_layer");
                            map.addLayer(polygonLayer);
                        }
                    }
                }
                if(multiLine){
                    for(var i=0;i<result.data.length;i++) {
                        const obj = result.data[i];
                        if (obj.GeoBoundary.startsWith("MULTILINESTRING")) {
                            let lineArr = [];
                            let curGEO;
                            curGEO = obj.GeoBoundary.replace("MULTILINESTRING(", "");
                            curGEO = curGEO.replace("))", ")");
                            let reg1 = new RegExp("\\(","g");//g,表示全部替换。
                            let reg2 = new RegExp("\\),","g");//g,表示全部替换。
                            curGEO=curGEO.replace(reg1,"\"");
                            curGEO=curGEO.replace(reg2,"\"\|");
                            curGEO =curGEO.replace(")", "");

                            let geoArr = curGEO.split("|");
                            for (var j in geoArr) {
                                let str=geoArr[j];
                                let arr =str.substring(1,str.length).split(",");
                                for(let h in arr){
                                    let a=arr[h].split(" ");
                                    let overArr=[];
                                    overArr.push(a[0]);
                                    overArr.push(a[1]);
                                    lineArr.push(overArr);
                                }
                            }
                            var features = [];
                            var LineFeature = new ol.Feature({
                                geometry: (new ol.geom.MultiLineString(
                                    lineArr
                                )).transform("EPSG:4326", "EPSG:3857"),
                                properties: {
                                    "name": obj.name
                                }
                            });
                            features.push(LineFeature);
                            var source = new ol.source.Vector({
                                features: features
                            });
                            var polygonLayer = new ol.layer.Vector({
                                source: source,
                                zIndex: 21,
                                style: tdtLineStyle
                            });
                            polygonLayer.set("layerid", layerid + "_LINE" + i + "_layer");
                            tdtPolygonLayid.push(layerid + "_LINE" + i + "_layer");
                            map.addLayer(polygonLayer);
                        }
                    }
                }
                if(polygon){
                    for(var i=0;i<result.data.length;i++) {
                        const obj = result.data[i];
                        if (obj.GeoBoundary.startsWith("POLYGON")) {
                            let polygonArr = [];
                            let curGEO;
                            curGEO = obj.GeoBoundary.replace("POLYGON((", "");
                            curGEO = curGEO.replace("))", "");
                            let geoArr = curGEO.split(",");
                            for (var j in geoArr) {
                                let arr = geoArr[j].split(" ");
                                let overArr=[];
                                overArr.push(arr[0]);
                                overArr.push(arr[1]);
                                polygonArr.push(overArr);
                            }

                            var features = [];
                            var polygonFeature = new ol.Feature({
                                geometry: (new ol.geom.Polygon(
                                    [polygonArr]
                                )).transform("EPSG:4326", "EPSG:3857"),
                                properties: {
                                    "name": obj.name
                                }
                            });
                            features.push(polygonFeature);
                            var source = new ol.source.Vector({
                                features: features
                            });
                            var polygonLayer = new ol.layer.Vector({
                                source: source,
                                zIndex: 21,
                                style: tdtPolygonStyle,
                                opacity: 0.7
                            });
                            polygonLayer.set("layerid", layerid + "_ONE" + i + "_layer");
                            tdtPolygonLayid.push(layerid + "_ONE" + i + "_layer");
                            map.addLayer(polygonLayer);
                        }
                    }
                }
                if(multiPolygon==true){
                    for(var q=0;q<result.data.length;q++) {
                        const obj = result.data[q];
                        if (obj.GeoBoundary!=undefined&&obj.GeoBoundary.startsWith("MULTIPOLYGON")) {
                            let curGEO;
                            curGEO = obj.GeoBoundary.replace("MULTIPOLYGON","");
                            curGEO = curGEO.substring(1,curGEO.length+1);
                            curGEO = curGEO.substring(0,curGEO.length-1);
                            let reg1 = new RegExp("\\(\\(","g");//g,表示全部替换。
                            let reg2 = new RegExp("\\)\\)","g");//g,表示全部替换。
                            curGEO=curGEO.replace(reg1,"[[\"");
                            curGEO=curGEO.replace(reg2,"\"]]");
                            let multiPolygonArr=JSON.parse('{"data": ['+curGEO+']}');
                            let overArr=[];
                            for(let k in multiPolygonArr.data){
                                let objData=multiPolygonArr.data[k][0][0];
                                let mArr=objData.split(",");
                                let overMoreArr=[];
                                for(let f in mArr){
                                    let oneArr=mArr[f].split(" ");
                                    overMoreArr.push(oneArr);
                                }
                                overArr.push(overMoreArr);
                            }
                            let features = [];
                            let polygonFeature = new ol.Feature({
                                geometry: (new ol.geom.MultiPolygon(
                                    [overArr]
                                )).transform("EPSG:4326", "EPSG:3857"),
                                properties: {
                                    "name":obj.name
                                }
                            });
                            features.push(polygonFeature);
                            let source = new ol.source.Vector({
                                features: features
                            });
                            let polygonLayer = new ol.layer.Vector({
                                source: source,
                                zIndex: 21,
                                style: tdtPolygonStyle,
                                opacity: 0.7
                            });
                            polygonLayer.set("layerid", layerid+"_MORE"+q+"_layer");
                            tdtPolygonLayid.push(layerid+"_MORE"+q+"_layer");
                            map.addLayer(polygonLayer);
                        }
                    }
                }

            }else if(result.returnCode * 1 === -2){
                alert('当前地区无数据');
            }
            layer.closeAll();
        },error:function (data) {
            layer.closeAll();
        }
    });
}

function changMMINFOShow(){
    var dis_arr = $("#fjzj .active");
    var lastSelectAreaCode = $("#disProvince").val();
    if($("#disCity").val() !=''){
        lastSelectAreaCode = $("#disCity").val();
    }
    if($("#disCounty").val() !=''){
        lastSelectAreaCode =$("#disCounty").val()
    }
    getMMINFOData(lastSelectAreaCode);
    var layers = map.getLayers().getArray();
    layers.forEach((layer)=>{
        var layerid = layer.get("layerid");
        if(layerid  && layerid.indexOf('_MMINFO_')>=0){
            layer.setVisible(false)
        }
    })
    $.each(dis_arr, function(i, f) {
        var disType =$(f).attr("data-code");
        var layerid = lastSelectAreaCode+"_MMINFO_" + disType + "_layer";
        var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
        if(oldLayer){
            oldLayer.setVisible(true);
        }
    });
}

/**
 * 防灾减灾地图主图
 */
function getMMINFOData(areaCode) {
    if(areaCode==''){
        areaCode = curArea.areaCode;
    }
    var params = {
        'areaCode': areaCode,
        'isChildrens': false
    };
    config.api.baseDataParam.params = JSON.stringify(params);
    config.api.baseDataParam.interfaceCode = 'M0027';

    $.ajax({
        type: "post",
        cache: false,
        data: config.api.baseDataParam,
        url: config.api.baseUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function (result) {
            if(result.returnCode=='0'){
                var data = result.data;
                let mainMapDisTypeArr=[];
                for(var i in data){
                    if($.inArray(data[i].DisasterType, mainMapDisTypeArr)==-1){
                        mainMapDisTypeArr.push(data[i].DisasterType);
                    }
                }
                var layerid = "MMINFOLayer";
                var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
                if (oldLayer) {
                    map.removeLayer(oldLayer);
                }

                for (var k = 0; k < data.length; k++) {
                    var KeyRegionCoors = data[k].KeyRegion;
                    var features = [];
                    var DisasterRegionCoors = data[k].DisasterRegion;
                    var AreaCode = data[k].AreaCode;

                    try {
                        KeyRegionCoors = eval("(" + KeyRegionCoors + ")");
                        DisasterRegionCoors = eval("(" + DisasterRegionCoors + ")");
                    } catch (e) {
                        continue;
                    }

                    var kIndex = new Array();
                    $.each(KeyRegionCoors, function (i, f) {
                        try{
                            if (f.length == 2) {
                                if (f[1] > 90) {
                                    var lat = f[0];
                                    f[0] = f[1];
                                    f[1] = lat;
                                }
                            } else {
                                kIndex.push(i);
                            }
                        }catch (e) {
                            // console.log(f)
                            kIndex.push(i);
                        }


                    })
                    for (var i = 0; i < kIndex.length; i++) {
                        KeyRegionCoors.splice(kIndex[i], 1);
                    }

                    var dIndex = new Array();
                    $.each(DisasterRegionCoors, function (i, f) {
                        try{
                            if (f.length == 2) {
                                if (f[1] > 90) {
                                    var lat = f[0];
                                    f[0] = f[1];
                                    f[1] = lat;
                                }
                            } else {

                                dIndex.push(i);
                            }
                        }catch (e) {
                            dIndex.push(i);
                        }


                    })
                    for (var i = 0; i < dIndex.length; i++) {
                        DisasterRegionCoors.splice(kIndex[i], 1);
                    }

                    var DisasterType = data[k].DisasterType;
                    if (DisasterRegionCoors.length >= 4) {
                        try{
                            var DisasterRegion = new ol.Feature({
                                geometry: (new ol.geom.MultiPolygon([
                                    [DisasterRegionCoors]
                                ])).transform("EPSG:4326", "EPSG:3857"),
                                properties: {
                                    "name": "气象灾害分布",
                                    "DisasterType": DisasterType,
                                    "AreaCode": AreaCode

                                }
                            }); //气象灾害分布
                            features.push(DisasterRegion);
                        }catch (e) {
                            // console.log(e)
                        }

                    }
                    if (KeyRegionCoors.length >= 4) {
                        try{
                            var KeyRegion = new ol.Feature({
                                geometry: (new ol.geom.MultiPolygon([
                                    [KeyRegionCoors]
                                ])).transform("EPSG:4326", "EPSG:3857"),
                                properties: {
                                    "name": "气象防灾减灾重点区域",
                                    "DisasterType": DisasterType,
                                    "AreaCode": AreaCode
                                }
                            }); //气象防灾减灾重点区域
                            features.push(KeyRegion);
                        }catch (e) {
                            console.log(KeyRegionCoors)
                        }

                    }
                    var oLayer = ol3_layerHelper.getLayerById(map, AreaCode + "_MMINFO_" + DisasterType + "_layer");
                    if (oLayer) {
                        map.removeLayer(oLayer);
                    }
                    var source = new ol.source.Vector({})
                    var layer = new ol.layer.Vector({
                        source: source,
                        zIndex: 51,
                        style: MMINFOStyle,
                        opacity: 0.7
                    });
                    map.addLayer(layer);
                    layer.set("layerid", AreaCode + "_MMINFO_" + DisasterType + "_layer");
                    // console.log(AreaCode + "_MMINFO_" + DisasterType + "_layer")
                    source.addFeatures(features);
                    layer.setVisible(false);
                }
                for(let i in disTypeArr){
                    if($.inArray(disTypeArr[i],mainMapDisTypeArr)!=-1){
                        mainMapExistDisTypeArr.push(disTypeArr[i]);
                    }
                }
            }
            getHPIINFOData(areaCode);//加载分级防御数据
            issueIsShowDisType(mainMapExistDisTypeArr);//加载防灾减灾地图主图灾情类别
            //默认选中防灾减灾复选框
            let thisclass=$('.warningEventLayer').find('div').eq(0).find("input").attr("class");
            if(thisclass.indexOf('chat-button-location-radio-inputActive')==-1){
                //默认选中防灾减灾地图主图
                $('.warningEventLayer').find('label').eq(0).click();
            }
        }
    });
}
/**
 * 防灾减灾灾害分级防御
 */
function getHPIINFOData(areaCode) {
    if(areaCode==''){
        areaCode = curArea.areaCode;
    }
    var areaCodes = areaCode;
    var params = {
        'areaCode': areaCodes,
        'isChildrens': false
    };
    config.api.baseDataParam.params = JSON.stringify(params);
    config.api.baseDataParam.interfaceCode = 'M0028';
    $.ajax({
        type: "post",
        cache: false,
        data: config.api.baseDataParam,
        url: config.api.baseUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function (result) {
            if(result.returnCode=='0'){
                var data = result.data;
                let defenseDisTypeArr=[];
                for(var i in data){
                    if($.inArray(data[i].DisasterType,defenseDisTypeArr)==-1){
                        defenseDisTypeArr.push(data[i].DisasterType);
                    }
                }
                var layerid = "HPIINFOLayer";
                var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
                if (oldLayer) {
                    map.removeLayer(oldLayer);
                }
                for (var k = 0; k < data.length; k++) {
                    var features = [];
                    var EarlyWarningZoneCoors = data[k].EarlyWarningZone;
                    var CriticalZoneCoors = data[k].CriticalZone;
                    var ResponsibleZoneCoors = data[k].ResponsibleZone;
                    var AreaCode = data[k].AreaCode;
                    try {
                        EarlyWarningZoneCoors = eval("(" + EarlyWarningZoneCoors + ")");
                        CriticalZoneCoors = eval("(" + CriticalZoneCoors + ")")
                        ResponsibleZoneCoors = eval("(" + ResponsibleZoneCoors + ")")
                    } catch (e) {
                        continue;
                    }
                    var eIndex = new Array();
                    $.each(EarlyWarningZoneCoors, function (i, f) {
                        if (f.length == 2) {
                            if (f[1] > 90) {
                                var lat = f[0];
                                f[0] = f[1];
                                f[1] = lat;
                            }
                        } else {
                            eIndex.push(i);
                        }
                    })
                    for (var i = 0; i < eIndex.length; i++) {
                        EarlyWarningZoneCoors.splice(eIndex[i], 1);
                    }
                    var cIndex = new Array();
                    $.each(CriticalZoneCoors, function (i, f) {
                        if (f.length == 2) {
                            if (f[1] > 90) {
                                var lat = f[0];
                                f[0] = f[1];
                                f[1] = lat;
                            }
                        } else {
                            cIndex.push(i);
                        }
                    })
                    for (var i = 0; i < cIndex.length; i++) {
                        CriticalZoneCoors.splice(cIndex[i], 1);
                    }
                    var rIndex = new Array();
                    $.each(ResponsibleZoneCoors, function (i, f) {
                        if (f!=null&&f.length == 2) {
                            if (f[1] > 90) {
                                var lat = f[0];
                                f[0] = f[1];
                                f[1] = lat;
                            }
                        } else {
                            rIndex.push(i);
                        }
                    })
                    for (var i = 0; i < rIndex.length; i++) {
                        ResponsibleZoneCoors.splice(rIndex[i], 1);
                    }
                    var DisasterType = data[k].DisasterType;
                    if (EarlyWarningZoneCoors.length >= 3) {
                        var EarlyWarningZone = new ol.Feature({
                            geometry: (new ol.geom.MultiPolygon([
                                [EarlyWarningZoneCoors]
                            ])).transform("EPSG:4326", "EPSG:3857"),
                            properties: {
                                "name": "早期监视区",
                                "DisasterType": DisasterType,
                                "AreaCode": AreaCode
                            }
                        }); //早期监视区
                        features.push(EarlyWarningZone);
                    }
                    if (CriticalZoneCoors.length >= 3) {
                        var CriticalZone = new ol.Feature({
                            geometry: (new ol.geom.MultiPolygon([
                                [CriticalZoneCoors]
                            ])).transform("EPSG:4326", "EPSG:3857"),
                            properties: {
                                "name": "临界警戒区",
                                "DisasterType": DisasterType,
                                "AreaCode": AreaCode
                            }
                        }); //临界警戒区
                        features.push(CriticalZone);
                    }
                    if (ResponsibleZoneCoors.length >= 3) {
                        var ResponsibleZone = new ol.Feature({
                            geometry: (new ol.geom.MultiPolygon([
                                [ResponsibleZoneCoors]
                            ])).transform("EPSG:4326", "EPSG:3857"),
                            properties: {
                                "name": "重点责任区",
                                "DisasterType": DisasterType,
                                "AreaCode": AreaCode
                            }
                        }); //重点责任区
                        features.push(ResponsibleZone);
                    }
                    var source = new ol.source.Vector({
                        features: features
                    })
                    var layer = new ol.layer.Vector({
                        source: source,
                        zIndex: 21,
                        style: HPIINFOStyle,
                        layerId: layerid,
                        layerid: layerid,
                        opacity: 0.7
                    });
                    layer.set("layerid", AreaCode + "_HPIINFO_" + DisasterType + "_layer");
                    map.addLayer(layer);
                    layer.setVisible(false);
                }
                for(let i in disTypeArr){
                    if($.inArray(disTypeArr[i],defenseDisTypeArr)!=-1){
                        defenseExistDisTypeArr.push(disTypeArr[i]);
                    }
                }
            }
        }
    })
}

$(document).on('click',"#circleGrade span",function() {
    if($("#disasterCode1").val() != null  && ""!=$("#disasterCode1").val()) {
        $('#circleGrade span').removeClass('nthTdactive');
        $(this).addClass('nthTdactive');
        //加载策略
        loadWarningConfig(loadWarningStragy);
    }else{
        alert("请选择灾种");
    }
});
let nowSysToken;
//该方法主要登录认证 将token 传给回调函数
function loadWarningConfig(callback, p) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    let loginUser = user.employeeId;
    let loginPwd = user.password;
    $.ajax({
        type: "post",
        cache: false,
        data: {
            username: loginUser,
            password: loginPwd
        },
        url: warningConfig.loginUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                var token = result.data.token;
                nowSysToken = token;
                if(p) {
                    callback(token, p);
                } else {
                    callback(token);
                }
            } else {
                console.log(result.returnMessage);
            }
        }
    });

}

//获取策略
function loadWarningStragy(token) {
    var disCode = $("#disasterCode").val();
    var disLevel = $("#circleGrade .nthTdactive").attr("data-key");
    var param = {
        token: token,
        disasterCode: disCode,
        alarmLevel: disLevel
    }

    $.ajax({
        type: "post",
        cache: false,
        data: param,
        url: warningConfig.strategyUrl,
        dataType: config.dataType,

        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                var data = result.data;
                warningStrategy = data;
                sender=data.orgName;
                qualityControl=data.qualityControl;
                $("#duration").val(warningStrategy.duration);
                var releaseChannel = warningStrategy.releaseChannel;
                var templatecontent = warningStrategy.templatecontent;
                let org = warningStrategy.orgName;
                templatecontent=templatecontent.replace(new RegExp("\\{org\\}","g"), org);
                let datetime = $('#sendTime').val();
                if(templatecontent.indexOf('datetime1')>=0){
                    datetime = new Date($('#sendTime').val()).Format('yyyy年M月d日h时m分');
                    templatecontent=templatecontent.replace(new RegExp("\\{datetime1\\}","g"), datetime);
                }else{
                    datetime = new Date($('#sendTime').val()).Format('yyyy年MM月dd日hh时mm分');
                    templatecontent=templatecontent.replace(new RegExp("\\{datetime\\}","g"), datetime);
                }
                let area = JSON.parse(sessionStorage.getItem('curArea')).areaName;
                templatecontent=templatecontent.replace(new RegExp("\\{area\\}","g"), area);
                let allAreas = '';
                templatecontent=templatecontent.replace(new RegExp("\\{allAreas\\}","g"), allAreas);
                $('#warningContent').html(templatecontent);
                if(releaseChannel && "" != releaseChannel) {
                    var channels = releaseChannel.split(",");
                    if(channels && channels.length > 0) {
                        channels.forEach(c => {
                            $("#channel_" + c).prop("checked", true);
                            //调用加载用户
                            loadWarningConfig(loadSendUser, c);
                        })
                    }
                }
            } else {
                alert("加载策略失败");
            }
        }
    });
}
//获取发布渠道
function loadSendChannel(token) {
    var param = {
        token: token,
        msgType: 1
    };
    $.ajax({
        type: "post",
        cache: false,
        data: param,
        url: warningConfig.channelUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                warningChannel = result.data;
                var warningChannels = $("#warningChannels").empty();
                warningChannel.forEach(channel => {
                    var methods = channel.methods;
                    var methodsCode = "";
                    var methodTaskId = "";
                    var sendType = channel.sendType;
                    if(methods && methods.length > 0) {
                        methods.forEach(m => {
                            if(m.isDefault * 1 === 1) { //默认的
                                methodsCode = m.methodCode;
                                var methodTasks = m.methodTasks;
                                if(methodTasks && methodTasks.length > 0) {
                                    methodTasks.forEach(t => {
                                        if(t.isDefault * 1 === 1) {
                                            methodTaskId = t.methodTaskKeyid;
                                        }
                                    })
                                }
                            }
                        })
                    }
                    var cEle = $('<input style="visibility: initial;" type="checkbox" id="channel_' + channel.channelType + '" code="' + methodsCode + '" methodTaskId="' + methodTaskId + '" value="' + channel.channelType + '" sendType="' + sendType + '" /><label for="channel_1" style="cursor: pointer;" for=channelType_"' + channel.channelType + '">' + channel.channelName + '（<span id="channel_user_' + channel.channelType + '">0</span>）</label>')
                    cEle.appendTo(warningChannels);
                });
                $("#warningChannels input[type='checkbox']").bind("click", function() {
                    var channelType = $(this).val();
                    loadWarningConfig(loadSendUser, channelType)
                });
            } else {
                alert("加载策略失败");
            }
        }
    });
}

//获取渠道用户接口
function loadSendUser(token, channelType) {
    var checked = $("#channel_" + channelType).prop("checked");
    if(!checked) {
        $("#channel_user_" + channelType).text("0");
        return;
    }
    var sendType = $("#channel_" + channelType).attr("sendType");
    let affectAreaCode=[];
    //获取圈选的地区信息
    affectAreaCode.push(curArea.areaCode);
    if(curArea.area_level==1){
        affectAreaCode=affectAreaCode.concat(cityArr,countyArr);
    }else if(curArea.area_level==3){
        affectAreaCode=affectAreaCode.concat(countyArr);
    }
    if(affectAreaCode.length <= 0) {
        alert("请选择影响区域");
        return;
    }
    var disCode = $("#disasterCode1").val();
    var disLevel = $("#circleGrade .nthTdactive").attr("data-key");
    getYuAnPerson(disCode,disLevel,affectAreaCode.toString());//获取预案责任人
    var param = {
        token: token,
        channelType: channelType,
        disasterCode: disCode,
        colorLevel: disLevel,
        areaCodes: affectAreaCode.join(",")
    };
    $.ajax({
        type: "post",
        cache: false,
        data: param,
        url: warningConfig.strategyUser,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                var data = result.data;
                var users = new Array();
                if(sendType * 1 === 1) { //按受众发
                    for(var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var keyId = d.keyId;
                        users.push(keyId);
                    }
                } else if(sendType * 1 === 2) { //按群组发
                    for(var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var methodContent = d.methodContent;
                        users.push(methodContent);
                    }
                }
                channelPersons['channel_' + channelType]=data;
                $("#channel_user_" + channelType).text(users.length + "");
            } else {
                alert("加载策略失败");
            }
        }
    });
}
//获取渠道用户接口
function loadImportantNoticeSendUser(token, channelType) {
    var checked = $("#importantNotice_channel_" + channelType).prop("checked");
    if(!checked) {
        $("#importantNotice_channel_user_" + channelType).text("0");
        return;
    }
    var sendType = $("#importantNotice_channel_" + channelType).attr("sendType");
    let affectAreaCode=[];
    //获取圈选的地区信息
    affectAreaCode.push(curArea.areaCode);
    if(curArea.area_level==1){
        affectAreaCode=affectAreaCode.concat(cityArr,countyArr);
    }else if(curArea.area_level==3){
        affectAreaCode=affectAreaCode.concat(countyArr);
    }
    if(affectAreaCode.length <= 0) {
        alert("请选择影响区域");
        return;
    }
    var msgOption = $("#msgId_importantNotice option:checked").val();
    var param = {
        token: token,
        channelType: channelType,
        msgOption:msgOption,
        areaCodes: affectAreaCode.join(",")
    };
    $.ajax({
        type: "post",
        cache: false,
        data: param,
        url: warningConfig.strategyUser,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                var data = result.data;
                var users = new Array();
                if(sendType * 1 === 1) { //按受众发
                    for(var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var keyId = d.keyId;
                        users.push(keyId);
                    }
                }else if(sendType * 1 === 2) { //按群组发
                    for(var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var methodContent = d.methodContent;
                        users.push(methodContent);
                    }
                }
                channelPersons['importantNotice_channel_' + channelType]=data;
                $("#importantNotice_channel_user_" + channelType).text(users.length + "");
            } else {
                console.log(JSON.stringify(result));
            }
        }
    });
}
//重置选中的预警
function restSendWarningInfo() {
    $("#disasterName1").val("");
    $("#disasterCode1").val("");
    $("#circleGrade .nthTdactive").removeClass("nthTdactive");
    $("#duration").val("");
    $("#warningChannels").empty();
    $("#sendTime").val("");
    $("#warningContent").val("");
    $(".drawAreaInfos").empty();
    //清空圈选图层
  /*  var selectDiv = $(".toolPop .e-items ul li div")
    if(selectDiv && selectDiv.length > 0) {
        for(var i = 0; i < selectDiv.length; i++) {
            var s = $(selectDiv[i]);
            if(s.hasClass("selectedDiv")) {
                s.click();
            }
        }
    }*/
    drawPolygenAnalysis.clearAllFeatures();
    /**联动关闭靶向工具框 ---start**/
    map.un('pointermove', drawPolygenAnalysis.pointerMoveHandler);
    $(".bxIcon").each(function () {
        if($(this).attr('class')=='bxIcon cssHand spanActive'){
            $(this).click();
        }
    })
    /**联动关闭靶向工具框 ---end**/

    selectSMSUserNumber="";
    channelPersons=[];//渠道用户清空
    loadWarningConfig(loadSendChannel);//加载发布渠道
    publishStatus=false//重置正向质控状态
    loadDisasterTree();//初始化加载灾种树ztre
}
function getSender(token) {
    $.ajax({
        type: "get",
        cache: false,
        async: false,
        url: otherbaseUrl+"/publish/joint/findNickName?token="+token,
        dataType: 'JSON',
        success: function(result) {
            if(result.returnCode=='0'){
                sender=result.data.sender;
            }
        },error:function (result) {
            console.log(result);
        }
    });
}
function createSendXml() {
    let sendCode = curArea.orgunitCode;
    var date = new Date().Format("yyyyMMddhhmmss");
    var sendTime = $("#sendTime").val()+':00'; //new Date().Format("yyyy-MM-dd hh:mm:ss")
    if(sendTime == null || sendTime == '') {
        alert("请选择发布时间");
        return;
    }
    var identifier = sendCode + "_" + date;
    //获取预警类型
    var warningType = $("input[name='warningType']:checked").val();
    var warningXml = '<?xml version="1.0" encoding="utf-8"?>';
    warningXml += "<alert>";
    warningXml += "<identifier>" + identifier + "</identifier>";
    warningXml += " <sender>" + sender + "</sender>";
    warningXml += "<sendTime>" + sendTime + "+08:00</sendTime>";
    warningXml += "<status>" + warningType + "</status>";
    warningXml += "<msgType>Alert</msgType>";
    warningXml += "<scope>Public</scope>";
    warningXml += " <code>";
    //发布内容
    var warningContent = $("#warningContent").val();
    if(warningContent == null || warningContent == '') {
        alert("请填写预警内容");
        return;
    }
    let resultMessage=reverseDirection(warningContent);//发布内容正向质控
    if(qualityControl=="1"){
        if(resultMessage!=""){
            alert(resultMessage);
            return;
        }
    }else{
        //非强制、不校验
    }

    //获取选中的渠道
    var selectChannels = $("#warningChannels input:checked");

    if(selectChannels && selectChannels.length > 0) {
        for(var i = 0; i < selectChannels.length; i++) {
            var channel = selectChannels[i];
            var methodCode = $(channel).attr("code");
            var methodTaskKeyid = $(channel).attr("methodTaskId");
            var channelType = $(channel).val();
            var userArr=channelPersons['channel_' + channelType];
            var userids=[];
            var listIds=[];
            for(var p in userArr){
                if($.inArray(userArr[p].keyId,userids)<0){
                    userids.push(userArr[p].keyId);
                }
                if($.inArray(userArr[p].listId,listIds)<0){
                    listIds.push(userArr[p].listId);
                }
            }
            warningXml += " <method> ";
            warningXml += "<methodName>" + methodCode + "</methodName>";
            warningXml += "<methodTaskKeyid>" + methodTaskKeyid + "</methodTaskKeyid>";
            warningXml += " <message>" + warningContent + "</message>  "
            let sendType = $(channel).attr("sendType");
            jointPhone();
            if(sendType * 1 === 2) {
                if(channelType=='01'){//短信
                    warningXml += "<audienceGrp>"+listIds.toString()+"</audienceGrp> ";
                    warningXml += "<audenceprt>"+selectSMSUserNumber+"</audenceprt>";
                }else{
                    warningXml += "<audienceGrp>"+listIds.toString()+"</audienceGrp> ";
                    warningXml += "<audenceprt></audenceprt>";
                }
            } else if(sendType * 1 === 1) {
                if(channelType=='01'){//短信
                    warningXml += "<audienceGrp>"+userids.toString()+"</audienceGrp> ";
                    warningXml += "<audenceprt>"+selectSMSUserNumber+"</audenceprt>";
                }else{
                    warningXml += "<audienceGrp>"+userids.toString()+"</audienceGrp> ";
                    warningXml += "<audenceprt></audenceprt>";
                }
            }
            warningXml += " <attachments> ";
            warningXml += "<attachment/> "
            warningXml += "</attachments> "
            warningXml += "</method> ";
        }
    } else {
        alert("请选择发布渠道");
        return;
    }
    warningXml += "</code>  ";
    warningXml += "<secClassification>None</secClassification> ";
    warningXml += "<note/>";
    warningXml += "<references/>  ";
    warningXml += "<info> "
    warningXml += "<language>zh-CN</language>  ";
    var disasterCode = $("#disasterCode1").val();
    if(disasterCode == null || disasterCode == '') {
        alert("请选择灾种");
        return;
    }
    warningXml += "<eventType>" + disasterCode + "</eventType>";
    warningXml += "<urgency>Unknown</urgency>  ";
    var level = $("#circleGrade .nthTdactive").attr("data-key");
    var levelCode = "";
    var levelName = ""
    var levelDesc = ""
    var disName = $("#disasterName1").val();
    if(level * 1 === 1) {
        levelCode = 'Red';
        levelName = "红色";
        levelDesc = "Ⅰ级/特别严重";
    } else if(level * 1 === 2) {
        levelCode = "Orange";
        levelName = "橙色";
        levelDesc = "Ⅱ级/严重"
    } else if(level * 1 === 3) {
        levelCode = "Yellow";
        levelName = "黄色";
        levelDesc = "Ⅲ级/较重"
    } else if(level * 1 === 4) {
        levelCode = "Blue";
        levelName = "蓝色";
        levelDesc = "Ⅳ级/一般"
    } else if(level * 1 ===9){
        levelCode = "Unknown";
        levelName = "绿色";
        levelDesc = "提示"
    }
    if(levelCode == '') {
        alert("请选择预警级别");
        return;
    }
    let resultMess=forwardDirection(disasterCode,level,sendTime,warningContent);
    if(resultMess.length>0){
        sessionStorage.setItem("forwardDirectionData",JSON.stringify(resultMess));
      /*  if(qualityControl=="1"){
            layer.open({
                type: 2 //此处以iframe举例
                ,title: '警告：预警内容包含词库以外的字词'
                ,area: ['50%', '50%']
                ,shade: 0.5
                ,content:'./page/warnForwardDirection.html'
                ,btn: ['中止'] //只是为了演示
                ,yes: function(){
                    layer.closeAll();
                    return "";
                }
            });
            return "";
        }else if(qualityControl=="2"){*/
      if(!publishStatus){
          layer.open({
              type: 2 //此处以iframe举例
              ,title: '警告：预警内容包含词库以外的字词,是否继续'
              ,area: ['50%', '50%']
              ,shade: 0.5
              ,content:'./page/warnForwardDirection.html'
              ,btn: ['继续','取消'] //只是为了演示
              ,yes: function(){
                  publishStatus=true;
                  //继续
                  createSendXml();
              }
              ,btn2: function(){
                  return "";
              }
          });
          return;
      }

        //获取圈选的地区信息
        let affectAreaCode = [];
        let affectAreaName =  [];
        if(curArea.area_level==1){
            affectAreaCode=affectAreaCode.concat(cityArr,countyArr);
            affectAreaName=affectAreaName.concat(cityNameArr,countyNameArr);
        }else if(curArea.area_level==3){
            affectAreaCode=affectAreaCode.concat(countyArr);
            affectAreaName=affectAreaName.concat(countyNameArr);
        }
        //加入选中乡镇集合
        $('.yjDrawAreaInfos').find('li').each(function(index) {
            let code=$(this).attr("code");
            let name=$(this).attr("name");
            affectAreaCode.push(code);
            affectAreaName.push(name);
        });
        //加入当前登录地区
        affectAreaCode.push(curArea.areaCode);
        affectAreaName.push(curArea.areaName);
        if(affectAreaCode.length == 0) {
            alert("请圈选影响地区");
            return;
        }
        getYuAnPerson(disasterCode,levelCode,affectAreaCode.toString());
        warningXml += "<severity>" + levelCode + "</severity>  ";
        warningXml += "<certainty>Unknown</certainty>  "
        warningXml += "<effective>" + sendTime + "</effective>"
        warningXml += "<onset/>  ";
        var expDate = new Date(new Date(sendTime).getTime() + $("#duration").val() * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        warningXml += "<expires>" + expDate + "</expires> ";
        warningXml += "<senderName>" + sender + "</senderName>";
        warningXml += "<headline>" + (sender + '发布' + disName + levelName + "预警[" + levelDesc + "]") + "</headline>  ";
        warningXml += " <description>" + warningContent + "</description>  ";
        warningXml += "<instruction/>  ";
        warningXml += "<web/>  ";
        warningXml += "<area> ";
        warningXml += " <areaDesc>" + affectAreaName.join(",") + "</areaDesc>  "
        warningXml += " <polygon/>  "
        warningXml += "<circle/> ";
        warningXml += "<geocode>" + affectAreaCode.join(",") + "</geocode>";
        warningXml += "</area> ";
        warningXml += "</info>";
        warningXml += "<pidentifier/> "
        warningXml += "</alert>";
        console.log(warningXml);
        return warningXml;
        //}
    }else{
        //获取圈选的地区信息
        let affectAreaCode = [];
        let affectAreaName =  [];
        if(curArea.area_level==1){
            affectAreaCode=affectAreaCode.concat(cityArr,countyArr);
            affectAreaName=affectAreaName.concat(cityNameArr,countyNameArr);
        }else if(curArea.area_level==3){
            affectAreaCode=affectAreaCode.concat(countyArr);
            affectAreaName=affectAreaName.concat(countyNameArr);
        }
        //加入选中乡镇集合
        $('.yjDrawAreaInfos').find('li').each(function(index) {
            let code=$(this).attr("code");
            let name=$(this).attr("name");
            affectAreaCode.push(code);
            affectAreaName.push(name);
        });
        //加入当前登录地区
        affectAreaCode.push(curArea.areaCode);
        affectAreaName.push(curArea.areaName);
        if(affectAreaCode.length == 0) {
            alert("请圈选影响地区");
            return;
        }
        getYuAnPerson(disasterCode,levelCode,affectAreaCode.toString());
        warningXml += "<severity>" + levelCode + "</severity>  ";
        warningXml += "<certainty>Unknown</certainty>  "
        warningXml += "<effective>" + sendTime + "</effective>"
        warningXml += "<onset/>  ";
        var expDate = new Date(new Date(sendTime).getTime() + $("#duration").val() * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        warningXml += "<expires>" + expDate + "</expires> ";
        warningXml += "<senderName>" + sender + "</senderName>";
        warningXml += "<headline>" + (sender + '发布' + disName + levelName + "预警[" + levelDesc + "]") + "</headline>  ";
        warningXml += " <description>" + warningContent + "</description>  ";
        warningXml += "<instruction/>  ";
        warningXml += "<web/>  ";
        warningXml += "<area> ";
        warningXml += " <areaDesc>" + affectAreaName.join(",") + "</areaDesc>  "
        warningXml += " <polygon/>  "
        warningXml += "<circle/> ";
        warningXml += "<geocode>" + affectAreaCode.join(",") + "</geocode>";
        warningXml += "</area> ";
        warningXml += "</info>";
        warningXml += "<pidentifier/> "
        warningXml += "</alert>";
        console.log(warningXml);
        return warningXml;
    }
}
function sendWarningMessage() {
    loadWarningConfig(getSender);
    loadWarningConfig(send);
}

function send(token) {
    var xml = createSendXml();
    if(!xml || xml==""){
        return;
    }
    var url = warningConfig.sendWarning + "?token=" + token+"&taskSource=10";
    $.ajax({
        type: "post",
        cache: false,
        contentType: "application/xml; charset=utf-8",
        data: xml,
        url: url,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                let nextProcess=result.data.nextProcess;
                if(nextProcess!='0'){
                    alert(result.data.nextProcessName);
                    restSendWarningInfo();
                }else{
                    alert("发送成功");
                    restSendWarningInfo();
                }
            }else if(result.returnCode=='2006'){
                console.log(result.returnMessage);
            }else{
                alert(result.returnMessage);
            }
            console.log(JSON.stringify(result));
        }
    });

}
//加载一般信息的发布类型
function initMsgType(){
    $.ajax({
        type:'get',
        url:config.loadMsgType+"?token="+nowSysToken,
        success:function(json){
            if(json.returnCode == 0){
                sessionStorage.setItem("msgType",JSON.stringify(json.data));
                if(json.data){
                    var html = "";
                    var msgType = json.data;
                    for (let i = 0; i < msgType.length; i++) {
                        html += '<option value="' + msgType[i].typecode + '">' + msgType[i].typename + '</option>';
                    }
                    $("#msgId").empty().append(html);
                }
            }
        }
    });
}
//加载重要通知的发布类型
function initImpNoticeType(){
    $.ajax({
        type:'get',
        url:config.initImpNoticeType+"?token="+nowSysToken,
        success:function(json){
            if(json.returnCode == 0){
                sessionStorage.setItem("impNoticeType",JSON.stringify(json.data));
                if(json.data){
                    var html = "";
                    var msgType = json.data;
                    for (let i = 0; i < msgType.length; i++) {
                        html += '<option value="'+ msgType[i].keyId + '">'+msgType[i].messageName +'</option>';
                    }
                    $("#msgId_importantNotice").empty().append(html);
                }
            }
        }
    });
}
var channelUserMethodData;//渠道对应的发布手段
function getAllGeneralChannel(token){
    var param = {
        token: token,
        msgType: 3
    };
    $.ajax({
        type: "post",
        cache: false,
        data: param,
        url: warningConfig.channelUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result){
                var code = result.returnCode;
                if(code!='0'){
                    alert(result.returnMessage);
                }else{
                    var generalChannels = $('#warningChannels_general').empty();
                    var html='';
                    var datas = result.data;
                    channelUserMethodData = datas;
                    html+='<div style="display: inline-block;">';
                    for(var i=0;i<datas.length;i++){
                        var data = datas[i].methods;
                        if(datas[i].channelType=='01'){
                            let methodTaskKeyid;
                            for(var j in datas[i].methods){
                                if(datas[i].methods[j].isDefault=='1'){
                                    methodTaskKeyid=datas[i].methods[j].methodTasks[0].methodTaskKeyid;
                                }
                            }
                            html+='<span style="display: inline-block;"><input channelName="'+datas[i].channelName+'" channelType="'+datas[i].channelType+'" channelCode="'+datas[i].channelCode+'" type="checkbox" id="general_channel_' + datas[i].channelCode + '" name="generalUser"  value="' + datas[i].channelName + '" methodtaskid="'+methodTaskKeyid+'" style="visibility: inherit;">';
                            html+='<label for="general_channel_' + datas[i].channelCode + '" style="cursor: pointer;" >' + datas[i].channelName + '</span>';
                        }
                    }
                    html+='</div>';
                    generalChannels.html(html);
                    $("#warningChannels_general >div input[type='checkbox']").bind("click", function() {
                        //loadGeneralUser();
                    });
                }
            }
        }
    });
}
function loadImportantNotice(token){
    var param = {
        token: token,
        msgType: 2
    };
    $.ajax({
        type: "post",
        cache: false,
        data: param,
        url: warningConfig.channelUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            // console.log(result)
            if(result){
                var code = result.returnCode;
                if(code!='0'){
                    alert(result.returnMessage);
                }else{
                    var channels = $('#warningChannels_importantNotice').empty();
                    var html='';
                    var datas = result.data;
                    channelUserMethodData = datas;
                    html+='<div style="display: inline-block;">';
                    for(var i=0;i<datas.length;i++){
                        var data = datas[i].methods;
                        //if(datas[i].channelType=='01'){
                            let methodTaskKeyid;
                            for(var j in datas[i].methods){
                                if(datas[i].methods[j].isDefault=='1'){
                                    methodTaskKeyid=datas[i].methods[j].methodTasks[0].methodTaskKeyid;
                                }
                            }
                            html+='<span style="display: inline-block;"><input channelName="'+datas[i].channelName+'" sendType="'+datas[i].sendType+'" channelType="'+datas[i].channelType+'" channelCode="'+datas[i].channelCode+'" type="checkbox" id="importantNotice_channel_' + datas[i].channelType + '" name="importantNoticeUser"  value="'+datas[i].channelType+'" methodtaskid="'+methodTaskKeyid+'" style="visibility: inherit;">';
                            html+='<label for="importantNotice_channel_' + datas[i].channelType + '" style="cursor: pointer;" >' + datas[i].channelName + '</label>（<span id="importantNotice_channel_user_' + datas[i].channelType + '">0</span>）</span>';
                       // }
                    }
                    html+='</div>';
                    channels.append(html);

                    $("#warningChannels_importantNotice input[type='checkbox']").bind("click", function() {

                            let channelType = $(this).val();
                            loadWarningConfig(loadImportantNoticeSendUser, channelType);//重要通知

                    });
                }
            }
        }
    });
}
function loadGeneralUser(){
    var arr = "";
    var haveEms = false;
    $("input:checkbox[name='generalUser']:checked").each(function(i){
        let channelType = $(this).attr('channelType');
        for(let i=0;i<channelUserMethodData.length;i++){
            if(channelUserMethodData[i].channelType==channelType){
                var data = channelUserMethodData[i].methods;
                if(data && data.length>0){
                    for(var j=0;j<data.length;j++){
                        var methodTasks = data[j].methodTasks;
                        for(var a = 0;a<methodTasks.length;a++){
                            if(methodTasks && methodTasks.length>0){
                                var methodTask = methodTasks[a];
                                if(arr==""){
                                    arr+=methodTask.methodTaskKeyid;
                                }else{
                                    arr+=','+methodTask.methodTaskKeyid;
                                }
                            }
                        }
                    }
                }
            }
        }
        if($(this).attr('channelType')=="01"){
            haveEms = true;
        }
    });
    if(haveEms){
        $('#linshi').show();
    }else{
        $('#temporary_number').val("");
        $('#linshi').hide();
    }
    if(arr==""){
        if(ol3_layerHelper.getLayerById(map,'generalUserLayer')){
            map.removeLayer(ol3_layerHelper.getLayerById(map,'generalUserLayer'));
        }
    }else{
        let areaCodes =curArea.areaCode;
        var params = {
            'areaCode': areaCodes,
            'isChildrens': true
        };
        var total = 0;
        var offset = 0;
        params.offset = offset;
        params.limit = 10000;
        var dataParam = config.api.baseDataParam;
        dataParam.params = JSON.stringify(params);
        dataParam.interfaceCode = 'M0024';
        $.ajax({
            type: "post",
            cache: false,
            data: dataParam,
            url: config.api.baseUrl,
            dataType: config.dataType,
            hrFields: {
                withCredentials: true
            },
            success: function (result) {
                //console.log(result);
                var code = result.returnCode;
                if(code!=0){
                    alert(result.message);
                }else{
                    if(ol3_layerHelper.getLayerById(map,'generalUserLayer')){
                        map.removeLayer(ol3_layerHelper.getLayerById(map,'generalUserLayer'));
                    }
                    var data = result.data;
                    for(let i=0;i<data.length;i++){
                        data[i].methodTaskKeyid = data[i];
                    }
                    var params = {
                        "layerId": 'generalUserLayer',
                        "opacity": 1,
                        "zIndex": 21,
                        "crs": "EPSG:3857",
                        "style": generalUserStyle,
                        "x": "Lon",
                        "y": "Lat"
                    };
                    var jsonLayer = layerUtil.createPointJsonLayer(data, params);
                    jsonLayer.set("layerid", 'generalUserLayer') //设置矢量图层的layerid，用于查找该图层
                    map.addLayer(jsonLayer);
                }
            }
        });
    }
}
function sendGeneralMessage() {
    loadWarningConfig(getSender);
    loadWarningConfig(sendGeneral);
}
function sendGeneral() {
    var xml = createGeneralSendXml();
    var url = warningConfig.sendGeneral + '?token='+nowSysToken+'&taskSource=10';
    $.ajax({
        type: "post",
        cache: false,
        contentType: "application/xml; charset=utf-8",
        data: xml,
        url: url,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                alert("发送成功");
                resetSendGeneralInfo();
            }else{
                alert(result.returnMessage)
            }
        }
    });
}
function createGeneralSendXml() {
    var sendCode = curArea.orgunitCode;//33052311041600
    var date = new Date().Format("yyyyMMddhhmmss");
    var sendTime = $("#sendTime").val() + ':00'; //new Date().Format("yyyy-MM-dd hh:mm:ss")
    if (sendTime == null || sendTime == '') {
        alert("请选择发布时间");
        return;
    }
    var identifier = 'GENERAL_' + sendCode + "_" + date;
    //获取预警类型
    var warningType = $("input[name='warningType']:checked").val();
    var allGeneralUserType = [];//组装数据
    $("input:checkbox[name='generalUser']:checked").each(function (i) {
        var param = {};
        param.methodTaskKeyId = $(this).attr('methodtaskid');
        param.channelCode = $(this).attr('channelCode');
        param.user = [];
        allGeneralUserType.push(param);
    });
    if (allGeneralUserType.length == 0) {
        alert("请选择发布渠道");
        return;
    }

    for (var i = 0; i < allGeneralUserType.length; i++) {
        var methodTaskKeyId = allGeneralUserType[i].methodTaskKeyId;
        if (allGeneralUserType.length > 0) {
            for (var j = 0; j < allGeneralUserType.length; j++) {
                var nowUser = allGeneralUserType[j];
                if (methodTaskKeyId == nowUser.methodTaskKeyId) {
                    allGeneralUserType[j].user.push({
                        name: allGeneralUserType[i].name,
                        methodContent: allGeneralUserType[i].methodContent
                    });
                }
            }
        }
    }
    //发布内容
    var generalContent = $('#generalContent').val();
    if (generalContent == null || generalContent == '') {
        alert("请填写信息内容")
        return;
    }
    let resultMessage = sensitiveWord(generalContent);//敏感词校验
    if (resultMessage != "") {
        alert(resultMessage);
        return;
    }
    //发布标题
    var generalTitle = $('#generalTitle').val();
    if (generalTitle == null || generalTitle == '') {
        alert("请填写标题")
        return;
    }
    //发布类型
    var eventType = $("#msgId option:checked").val();
    if (eventType == null || eventType == '') {
        alert("请选择发布类型");
        return;
    }
    var warningXml = '<?xml version="1.0" encoding="utf-8"?>';
    warningXml += "<alert>";
    warningXml += "<identifier>" + identifier + "</identifier>";
    warningXml += " <sender>" + sender + "</sender>";
    warningXml += "<sendTime>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "+08:00</sendTime>";
    warningXml += "<status>" + warningType + "</status>";
    warningXml += "<msgType>GENERAL</msgType>";
    warningXml += "<scope>Public</scope>";
    warningXml += " <code>";
    for (var j = 0; j < allGeneralUserType.length; j++) {
        warningXml += " <method> ";
        warningXml += "<methodName>" + allGeneralUserType[j].channelCode + "</methodName>";
        warningXml += "<methodTaskKeyid>" + allGeneralUserType[j].methodTaskKeyId + "</methodTaskKeyid>";
        warningXml += " <message>" + generalContent + "</message>  ";
        if(allGeneralUserType[j].channelCode == 'SMS') {
                jointPhone();
                allGeneralUserType[j].phoneNumber = selectSMSUserNumber;
                let numbers = allGeneralUserType[j].phoneNumber;
                if ($('#temporary_number').val() && $('#temporary_number').val() != '') {
                    numbers += ',' + $('#temporary_number').val();
                }
                warningXml += "<audienceGrp/> ";
                warningXml += "<audenceprt>" + numbers + "</audenceprt>  ";
        }else{
              /* for (var a = 0; a < allGeneralUserType[j].user.length; a++) {
                   if (methodContents == "") {
                       methodContents += allGeneralUserType[j].user[a].methodContent;
                   } else {
                       methodContents += "," + allGeneralUserType[j].user[a].methodContent;
                   }
               }
            if (methodContents != 'undefined') {
                warningXml += "<audienceGrp>" + methodContents + "</audienceGrp> ";
            } else {
                warningXml += "<audienceGrp/> ";
            }
            warningXml += "<audenceprt/>";*/
        }
        warningXml += " <attachments> ";
        warningXml += "<attachment/>"
        warningXml += "</attachments>"
        warningXml += "</method> ";
    }

        warningXml += "</code>  ";
        warningXml += "<secClassification>None</secClassification> ";
        warningXml += "<note/>";
        warningXml += "<references/>  ";
        warningXml += "<info> "
        warningXml += "<language>zh-CN</language>  ";

        warningXml += "<eventType>" + eventType + "</eventType>";
        warningXml += "<urgency>Unknown</urgency>  ";
        warningXml += "<severity>Unknown</severity>  ";
        warningXml += "<certainty>Unknown</certainty>  "
        warningXml += "<effective>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "+08:00</effective>"
        warningXml += "<onset/>  ";

        var expDate = new Date(new Date(sendTime).getTime() + $("#duration").val() * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        warningXml += "<expires>" + expDate + "</expires> ";
        warningXml += "<senderName>" + sender + "</senderName>";
        warningXml += "<headline>" + generalTitle + "</headline>  ";
        warningXml += " <description></description>  ";
        warningXml += "<instruction/>  ";
        warningXml += "<web/>  ";
        warningXml += "<area> ";
        warningXml += " <areaDesc></areaDesc>  ";
        warningXml += " <polygon/>  ";
        warningXml += "<circle/> ";
        warningXml += "<geocode>" + curArea.areaCode + "</geocode>";
        warningXml += "</area> ";
        warningXml += "</info>";
        warningXml += "</alert>";
        console.log(warningXml);
        return warningXml;
}

function sendImportantNotice() {
    loadWarningConfig(getSender);
    loadWarningConfig(sendImportantNoticeMessage);
}
function sendImportantNoticeMessage() {
    var xml = createImportantNoticeSendXml();
    var url = warningConfig.sendImpNotice + '?token='+nowSysToken+'&taskSource=99';
    $.ajax({
        type: "post",
        cache: false,
        contentType: "application/xml; charset=utf-8",
        data: xml,
        url: url,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function(result) {
            if(result.returnCode * 1 === 0) {
                alert("发送成功");
                resetSendImportantNotice();
            }else if(result.returnCode=='2006'){
                console.log(result.returnMessage);
            }else{
                alert(result.returnMessage);
            }
        }
    });
}

function createImportantNoticeSendXml() {
    var sendCode = curArea.orgunitCode;//33052311041600
    var date = new Date().Format("yyyyMMddhhmmss");
    var sendTime = $("#sendTime").val() + ':00'; //new Date().Format("yyyy-MM-dd hh:mm:ss")
    if (sendTime == null || sendTime == '') {
        alert("请选择发布时间");
        return;
    }
    var identifier = 'NOTICE_' + sendCode + "_" + date;
    //获取预警类型
    var warningType = $("input[name='warningType']:checked").val();
    var allGeneralUserType = [];//组装数据
    $("input:checkbox[name='importantNoticeUser']:checked").each(function (i) {
        var param = {};
        param.methodTaskKeyId = $(this).attr('methodtaskid');
        param.channelCode = $(this).attr('channelCode');
        param.channeltype = $(this).attr('channeltype');

        param.user = [];
        allGeneralUserType.push(param);
    });
    if (allGeneralUserType.length == 0) {
        alert("请选择发布渠道");
        return;
    }
    //发布标题
    var importantNoticeTitle = $('#importantNoticeTitle').val();
    if (importantNoticeTitle == null || importantNoticeTitle == '') {
        alert("请填写标题");
        return;
    }
    //发布内容
    var importantNoticeContent = $('#importantNoticeContent').val();
    if (importantNoticeContent == null || importantNoticeContent == '') {
        alert("请填写信息内容");
        return;
    }
    let resultMessage = sensitiveWord(importantNoticeContent);//敏感词校验
    if (resultMessage != "") {
        layer.open({
            type: 1,
            skin: 'layer-ext-my1skin',
            title:'敏感词警告',
            area: ['50%', '50%'], //宽高
            btn:['中止'],
            content: resultMessage
        });
        return;
    }
    //发布类型
    var eventType = $("#msgId_importantNotice option:checked").val();
    if (eventType == null || eventType == '') {
        alert("请选择发布类型");
        return;
    }
    var warningXml = '<?xml version="1.0" encoding="utf-8"?>';
    warningXml += "<alert>";
    warningXml += "<identifier>" + identifier + "</identifier>";
    warningXml += " <sender>" + sender + "</sender>";
    warningXml += "<sendTime>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "+08:00</sendTime>";
    warningXml += "<status>" + warningType + "</status>";
    warningXml += "<msgType>NOTICE</msgType>";
    warningXml += "<scope>Public</scope>";
    warningXml += " <code>";
    for (var j = 0; j < allGeneralUserType.length; j++) {
        warningXml += " <method> ";
        warningXml += "<methodName>" + allGeneralUserType[j].channelCode + "</methodName>";
        warningXml += "<methodTaskKeyid>" + allGeneralUserType[j].methodTaskKeyId + "</methodTaskKeyid>";
        warningXml += " <message>" + importantNoticeContent + "</message>  ";

        var userArr=channelPersons['importantNotice_channel_' + allGeneralUserType[j].channeltype];
        var userids=[];
        var listIds=[];
        for(var p in userArr){
            if($.inArray(userArr[p].keyId,userids)<0){
                userids.push(userArr[p].keyId);
            }
            if($.inArray(userArr[p].listId,listIds)<0){
                listIds.push(userArr[p].listId);
            }
        }

        var audienceGrpContent = "";
        if(userids.length>0){
            audienceGrpContent+=userids.toString();
        }
        if(listIds.length>0){
            if(audienceGrpContent!=""){
                audienceGrpContent+=","+listIds.toString()
            }else{
                audienceGrpContent+=listIds.toString()
            }
        }
        if(audienceGrpContent!=''){
            warningXml += "<audienceGrp>" + audienceGrpContent + "</audienceGrp> ";
        }else{
            warningXml += "<audienceGrp/> ";
        }
        if (allGeneralUserType[j].channelCode == 'SMS') {
            jointPhone();
            allGeneralUserType[j].phoneNumber = selectSMSUserNumber;
            let numbers = allGeneralUserType[j].phoneNumber;
            if ($('#temporary_number_').val() && $('#temporary_number_').val() != '') {
                if(numbers!=""){
                    numbers += ',' + $('#temporary_number_').val();
                }else{
                    numbers += $('#temporary_number_').val();
                }
            }
            warningXml += "<audenceprt>" + numbers + "</audenceprt>  ";
        }else{
            warningXml += "<audenceprt/>  ";
        }
        warningXml += " <attachments> ";
        warningXml += "<attachment/>"
        warningXml += "</attachments>"
        warningXml += "</method> ";
      }
        warningXml += "</code>  ";
        warningXml += "<secClassification>None</secClassification> ";
        warningXml += "<note/>";
        warningXml += "<references/>  ";
        warningXml += "<info> "
        warningXml += "<language>zh-CN</language>  ";
        warningXml += "<eventType>" + eventType + "</eventType>";
        warningXml += "<urgency>Unknown</urgency>  ";
        warningXml += "<severity>Unknown</severity>  ";
        warningXml += "<certainty>Unknown</certainty>  "
        warningXml += "<effective>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "+08:00</effective>"
        warningXml += "<onset/>  ";
        var expDate = new Date(new Date(sendTime).getTime() + $("#duration").val() * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        warningXml += "<expires>" + expDate + "</expires> ";
        warningXml += "<senderName>" + sender + "</senderName>";
        warningXml += "<headline>" + importantNoticeTitle + "</headline>  ";
        warningXml += " <description></description>  ";
        warningXml += "<instruction/>  ";
        warningXml += "<web/>  ";
        warningXml += "<area> ";
        warningXml += " <areaDesc></areaDesc>  ";
        warningXml += " <polygon/>  ";
        warningXml += "<circle/> ";
        warningXml += "<geocode>" + curArea.areaCode + "</geocode>";
        warningXml += "</area> ";
        warningXml += "</info>";
        warningXml += "</alert>";
        return warningXml;
}

//拼接手机号
function jointPhone() {
        for (var i in zhPersonArr) {
            if (selectSMSUserNumber == '') {
                selectSMSUserNumber += zhPersonArr[i].MobilePhone;
            } else {
                selectSMSUserNumber += ',' + zhPersonArr[i].MobilePhone;
            }
        }
        for (var i in wgPersonArr) {
            if (selectSMSUserNumber == '') {
                selectSMSUserNumber += wgPersonArr[i].MobilePhone;
            } else {
                selectSMSUserNumber += ',' + wgPersonArr[i].MobilePhone;
            }
        }
        for (var i in qxPersonArr) {
            if (selectSMSUserNumber == '') {
                selectSMSUserNumber += qxPersonArr[i].MobilePhone;
            } else {
                selectSMSUserNumber += ',' + qxPersonArr[i].MobilePhone;
            }
        }
        for (var i in yuAnPersonArr) {
            if (selectSMSUserNumber == '') {
                selectSMSUserNumber += yuAnPersonArr[i].responsiblePhone;
            } else {
                selectSMSUserNumber += ',' + yuAnPersonArr[i].responsiblePhone;
            }
        }
    }

//重置选中的一般信息的内容
    function resetSendGeneralInfo() {
        $("#generalTitle").val("");
        $("#generalContent").val("");
        $("#groupId").val("");
        $("#groupName").val("");
        $("#temporary_number").val("");
        selectGeneralUser = [];
        selectSMSUserNumber = '';//手机号码字符串
        if (ol3_layerHelper.getLayerById(map, 'generalUserLayer')) {
            map.removeLayer(ol3_layerHelper.getLayerById(map, 'generalUserLayer'));
        }
        $("input:checkbox[name='generalUser']:checked").each(function (i) {
            $(this).removeAttr('checked');
            $('#linshi').val('');
        });
        drawPolygenAnalysis.clearAllFeatures();
        channelPersons=[];//渠道用户清空
        loadWarningConfig(getAllGeneralChannel);//加载一般信息渠道
    }

//重置选中的重要通知的内容
    function resetSendImportantNotice() {
        $("#importantNoticeTitle").val("");
        $("#importantNoticeContent").val("");
        $("#groupId_").val("");
        $("#groupName_").val("");
        $("#temporary_number_").val("");
        $(".yjDrawAreaInfos").empty();
        drawPolygenAnalysis.clearAllFeatures();
        selectGeneralUser = [];
        selectSMSUserNumber = "";//手机号码字符符
        if (ol3_layerHelper.getLayerById(map, 'generalUserLayer')) {
            map.removeLayer(ol3_layerHelper.getLayerById(map, 'generalUserLayer'));
        }
        $("input:checkbox[name='importantNoticeUser']:checked").each(function (i) {
            $(this).removeAttr('checked');
            $('#linshi_importantNotice').val('');
        });
        channelPersons=[];//渠道用户清空
        loadWarningConfig(loadImportantNotice);//加载重要通知渠道
    }

    /**预警正向质控**/
    function forwardDirection(eventType, severity, relieaseTime, content) {
        let resultMesage = [];
        let param = {
            "eventType": eventType,
            "severity": severity,
            "relieaseTime": relieaseTime,
            "data": [
                {
                    "eleKey": "channel_01",
                    "eleName": "短信",
                    "content": content
                }
            ]
        };
        $.ajax({
            type: "POST",
            url: otherbaseUrl + '/ems/analyzer/check',
            async: false,
            contentType: "application/json",
            dataType: "JSON",
            data: JSON.stringify(param),
            success: function (result) {
                if (result.returnCode == '0') {
                    let data = result.data;
                    if (data.length > 0) {
                        //有问题
                        resultMesage = data;
                    }
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        return resultMesage;
    }

    /**预警反向质控**/
    function reverseDirection(warningContent) {
        let resultMessage = "";
        let disName = $("#disasterName1").val();//灾种名称
        let level = $("#circleGrade .nthTdactive").attr("data-key");//灾种级别
        let levelName = "";//级别名称
        let orgunitCode = curArea.orgunitCode;//机构编码
        let sendTime = $("#sendTime").val() + ':00'; //发布时间
        let thisDate = new Date(sendTime);
        let timeFoemat1 = thisDate.Format('yyyy年MM月dd日hh时mm分');
        let timeFoemat2 = thisDate.getFullYear() + "年" + (thisDate.getMonth() + 1) + "月" + thisDate.getDate() + "日" + thisDate.getHours() + "时" + thisDate.getMinutes() + "分";
        if (level * 1 === 1) {
            levelName = "红色";
        } else if (level * 1 === 2) {
            levelName = "橙色";
        } else if (level * 1 === 3) {
            levelName = "黄色";
        } else if (level * 1 === 4) {
            levelName = "蓝色";
        }
        if (!warningContent.includes("发布")) {
            if(resultMessage==""){
                resultMessage += "发布内容中";
            }
            resultMessage += ','+'缺少"发布"关键字';
        }
        if (!warningContent.includes(sender)) {
            if(resultMessage==""){
                resultMessage += "发布内容中";
            }
            resultMessage += ','+'未包含机构或台站名称';
        }
        if (!warningContent.includes(disName)) {
            if(resultMessage==""){
                resultMessage += "发布内容中";
            }
            resultMessage += ','+'未包含灾种名称';
        }
        if (!warningContent.includes(levelName)) {
            if(resultMessage==""){
                resultMessage += "发布内容中";
            }
            resultMessage += ','+'未包含灾种级别';
        }
        if (!warningContent.includes(timeFoemat1) && !warningContent.includes(timeFoemat2)) {
            if(resultMessage==""){
                resultMessage += "发布内容中";
            }
            resultMessage += ','+'未包发布时间或发布时间与发布内容中发布时间不一致';
        }
        if (orgunitCode.substring(6, 9).includes("416")) {
            if (!warningContent.includes('预警信号')) {
                if(resultMessage==""){
                    resultMessage += "发布内容中";
                }
                resultMessage += ','+'未包"预警信号"关键字';
            }
        }
        return resultMessage;
    }

    /**敏感词比对**/
    function sensitiveWord(content) {
        let resultMessage = "";
        $.ajax({
            type: "post",
            async: false,
            url: otherbaseUrl + '/ems/sensitive/findSensitiveAll?orgCode=' + curArea.orgunitCode + '&myAndShare=1',
            dataType: 'json',
            cache: false,
            success: function (result) {
                for (var i in result) {
                    if (content.includes(result[i])) {
                        resultMessage = '内容中包含敏感词<span style="color: red">"' + result[i] + '"</span>';
                        break;
                    }
                }
            }
        })
        return resultMessage;
    }


