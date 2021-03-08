const tdt = new TDT(config.tdt.tk);//地图
let radarList = [];
let cloudList = [];
let radarCloudInterval;
let radarCloudCurrIndex;
let warnSignalOverlay;
let map;
let drawTextOverlay;
let drawTextLayer;
var oldWarningOverlay;
let dataPopupOverlay;
let alarmWarnOverlay;
let typhoonDataOverLay;
var time_line_SetIn;
var time_line_SetIn_cloud;
let addStack = [];//添加栈
let deleteStack = [];//删除栈
let operateOrder = [];//操作顺序
let liveData;
let boundaryGeo = {};//地区编码对应的坐标值
let mouseMoveFeature;//当前鼠标移入的feature
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
var alert24Line=[[120.7,33],[127,33],[127,28],[123.667,23],[119.00,23],[117.42,24]];
var alert48Line=[[131,31],[131,26],[127,20],[119,20],[115,22.7]];
var curArea = JSON.parse('{"areaCode": "331000000000","areaName": "台州市","area_level": 2,"orgunitCode": "33100041600000","orgunitName": "台州市气象台"}');
//页面初始化
$(function(){
	initMap();//初始化webGis图层
});
function forecast7Days() {
	let cityAreaCode = ['330200000000','330300000000','330400000000','330500000000','330600000000','330700000000','330900000000','331000000000','330800000000','331100000000','330100000000'];
	let cityNames = ['宁波','温州','嘉兴','湖州','绍兴','金华','舟山','台州','衢州','丽水','杭州'];
	let areaName;
	let index=$.inArray(curArea.areaCode.substring(0,4)+'00000000', cityAreaCode);
	if(index!=-1){
		areaName=cityNames[index];
	}else if(curArea.areaCode=='330000000000'){
		areaName='杭州';
	}
	$.ajax({
			type:"get",
			timeout:"5000",
			cache:false,
			url:"http://www.zj121.com/public/pub-srv/station/forecast7days?address="+areaName,
			dataType:config.dataType,
			hrFields:{
				withCredentials:true
			},
			success:function(obj){
				var data=obj.data;
				$(".weather").empty();
				let html="";
				if(obj.code==0){
					$.ajax({
						type: "get",
						cache: false,
						async:false,
						url: "./data/weather.json",
						dataType: "json",
						success: function (result) {
							var curDate=new Date();
                               for(let j in result){
								   if(curDate.getHours()>15){
									   if(result[j].desc==data.list[0].nightWtString){
										   html+='<img src="./images/weather/n'+result[j].id+'.png" alt="">';
										   html+='<span>'+data.list[0].minTemp+'℃~'+data.list[0].maxTemp+'℃</span>';
										   html+='<span>'+data.list[0].nightWtString+'</span>';
										   break;
									   }
								   }else{
									   if(result[j].desc==data.list[0].dayWtString){
										   html+='<img src="./images/weather/'+result[j].id+'.png" alt="">';
										   html+='<span>'+data.list[0].minTemp+'℃~'+data.list[0].maxTemp+'℃</span>';
										   html+='<span>'+data.list[0].dayWtString+'</span>';
										   break;
									   }
								   }
							   }
						}
					});
				}
				$(".weather").append(html);
		},error:function (data) {
				console.log(data);
	    }
	});
}
//初始化地图
function initMap() {
	initBaseLayer();
	initOverlay();
	loadBoundaryGeo();//加载边界
	//loadLiveData('temp','温度');
	//liveObserveDataType();
	//loadWarnInfoList();
	//loadBasicDataType();
	//loadDeptInfo();//加载部门信息
	//loadMapData();//加载天地图数据
	initArea();
	//getMMINFOData('');//加载防灾减灾数据
	//loadAlarmWarn();//加载告警
	//getCurTOEmsUser();//获取当前用户对应的ems用户
	//setInterval(function(){ getCurTOEmsUser(); }, 10000*6*25);
	//showWarnInMapNew();//加载预警是数据
	//drawTools();
	draw = new Draw(map);
	drawTextOverlay = new ol.Overlay({
		element: document.getElementById("pop_text"),
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});
	map.addOverlay(drawTextOverlay);
	typhoonDataOverLay = new ol.Overlay({
		element: document.getElementById("typhoonData"),
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	})
	map.addOverlay(typhoonDataOverLay);
	$("#typhoonData").css("display", "block");
	dataPopupOverlay = new ol.Overlay({
		element: document.getElementById("dataPopup"),
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	})
	alarmWarnOverlay = new ol.Overlay({
		element: document.getElementById("alarmWarnPopup"),
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	})
	oldWarningOverlay = new ol.Overlay({
		element: document.getElementById("oldWarningOverlay"),
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});
	$("#alarmWarnPopup").css("display", "block");
	$("#dataPopup").css("display", "block");
	drawTextLayer = new ol.layer.Vector({
		zIndex:20,
		source: new ol.source.Vector()
	});
	drawTextLayer.set("layerid","drawTextLayer");
	map.addLayer(drawTextLayer);
	map.on('pointermove', function(e){
		var feature = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
			if(layer!=null){
				if(layer.get('layerid') && layer.get('layerid').indexOf('PointDataLayer')!=-1){
					return feature;
				}
			}
		});
		if(!feature){
			typhoonDataOverLay.setPosition(undefined);
		}else{
			let id = feature.get('id');
			let name = feature.get('name');
			let level = feature.get('level');
			let windv = feature.get('windv');
			let press = feature.get('press');
			let time = feature.get('time');
			let windd = feature.get('windd');
			let longitude = feature.get('longitude');
			let latitude = feature.get('latitude');
			let layerBoxTitle = $('.layerBoxTitle').empty();
			let title = '';
			title+='<span>'+id+' '+name+'</span>';
			layerBoxTitle.html(title);
			let layerBoxContent = $('.layerBoxContent').empty();
			let html='';
			if(time){
				let month = time.substring(0,2);
				let day = time.substring(2,4);
				let hour = time.substring(4,6);
				html+='<li><span>过去时间</span><span>'+month+'月'+day+'日'+hour+'时</span></li>';
			}
			html+='<li><span>中心位置</span><span>'+longitude+','+latitude+'</span></li>';
			html+='<li><span>最大风速</span><span>'+windv+'米/秒</span></li>';
			html+='<li><span>中心气压</span><span>'+press+'百帕</span></li>';
			if(windd){
				let windWord = formatWindd(windd);
				html+='<li><span>移动方向</span><span>'+windWord+'</span></li>';
			}
			layerBoxContent.html(html);
			typhoonDataOverLay.setPosition(e.coordinate);
			resetTyphoonDataMargin();
		}
	});
}
//24小时、48小时台风警戒线
function warnLine() {
	//创建vector
	var vector = new ol.layer.Vector({
		source: new ol.source.Vector(),
		zIndex:50
	});
	//24小时警戒线
	let  line24=new ol.Feature({
		geometry: new ol.geom.LineString(transPoints(alert24Line))
	});
	line24.setStyle(new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'red',
			weight: 1.5
		}),
		text: new ol.style.Text({
			text: '24\n小\n时\n警\n戒\n线',
			fill: new ol.style.Fill({
				color: 'red'
			}),
			offsetX:30
		})
	}));
	vector.getSource().addFeature(line24);
	//48小时警戒线
	let  line48=new ol.Feature({
		geometry: new ol.geom.LineString(transPoints(alert48Line))
	});
	line48.setStyle(new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'yellow',
			weight: .8,
			lineDash:[1,2,3,4,5,6]
		}),
		text: new ol.style.Text({
			text: '48\n小\n时\n警\n戒\n线',
			fill: new ol.style.Fill({
				color: 'yellow'

			}),
			offsetX:30
		})
	}));
	vector.getSource().addFeature(line48);
	vector.set("layerid", 'typhoonWarnLine');
	map.addLayer(vector);
}
//渔场
function fishingGround() {
	//加载渔场数据
	$.ajax({
		type: "get",
		cache: false,
		async:false,
		url: "./data/yuchang.geojson",
		dataType: "json",
		success: function (result) {
			let vectorSource = new ol.source.Vector({
				features: new ol.format.GeoJSON().readFeatures(result, {
					dataProjection: "EPSG:4326",
					featureProjection: "EPSG:3857"
				})
			});
			let vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				style: fishingGroundStyle,
				zIndex:50
			});
			vectorLayer.set("layerid", 'fishingGround');
			map.addLayer(vectorLayer);
		}
	});
}
function formatWindd(str){
	let result = '';
	if(str.length>0){
		for(let i=0;i<str.length;i++){
			if(str[i]=='N') {
				result+='北';
			}else if(str[i]=='W'){
				result+='西';
			}else if(str[i]=='E'){
				result+='东';
			}else if(str[i]=='S'){
				result+='南';
			}
		}
	}
	return result;
}

let testFeatures;
function loadTestGeo(){
	$.ajax({
		type: "get",
		cache: false,
		async:false,
		url: "./data/zjxian.geojson",
		dataType: "json",
		success: function (result) {
			var features = result.features;
			testFeatures = features;
		}
	});
}
function loadBoundaryGeo() {
	loadBoundary();//加载geoserver边界文件
	loadTestGeo();
	$.ajax({
		type: "get",
		cache: false,
		async:false,
		url: "./data/all.geojson",
		dataType: "json",
		success: function (result) {
			var features = result.features;
			features.forEach(feature => {
				var cityCode = feature.properties.CITYCODE;
				boundaryGeo[cityCode] = feature;
			});
		}
	});
}
function changeLiveForecast(){
	let type = $('#loadTypeBtn').text();
	const showDetailHtml = $('.showDetail').empty();
	if(type.includes("预报")){//加载实况要素
		$('#loadTypeBtn').text("监测");
		$(".forecastTimeDiv").hide();//隐藏预报时间ul
		$(`<li class="">
				<span>
					<img src="./images/viewIcon1.png" alt="">
					<img src="./images/viewIcon1Active.png" alt="">
				</span>
				<span>温度</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon2.png" alt="">
					<img src="./images/viewIcon2Active.png" alt="">
				</span>
				<span>降水</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon3.png" alt="">
					<img src="./images/viewIcon3Active.png" alt="">
				</span>
				<span>相对湿度</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon4.png" alt="">
					<img src="./images/viewIcon4Active.png" alt="">
				</span>
				<span>风力风向</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon5.png" alt="">
					<img src="./images/viewIcon5Active.png" alt="">
				</span>
				<span>能见度</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon6.png" alt="">
					<img src="./images/viewIcon6Active.png" alt="">
				</span>
				<span>台风</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon7.png" alt="">
					<img src="./images/viewIcon7Active.png" alt="">
				</span>
				<span>AQI</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon8.png" alt="">
					<img src="./images/viewIcon8Active.png" alt="">
				</span>
				<span>云图</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon9.png" alt="">
					<img src="./images/viewIcon9Active.png" alt="">
				</span>
				<span>雷达图</span>
			</li>`).appendTo(showDetailHtml);
	}else{//加载预报要素
		$('#loadTypeBtn').text("预报");
		$(`<li class="">
				<span>
					<img src="./images/viewIcon1.png" alt="">
					<img src="./images/viewIcon1Active.png" alt="">
				</span>
				<span>天气现象</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon1.png" alt="">
					<img src="./images/viewIcon1Active.png" alt="">
				</span>
				<span>温度</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon2.png" alt="">
					<img src="./images/viewIcon2Active.png" alt="">
				</span>
				<span>降水</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon4.png" alt="">
					<img src="./images/viewIcon4Active.png" alt="">
				</span>
				<span>风</span>
			</li>
            <li class="">
				<span>
					<img src="./images/viewIcon4.png" alt="">
					<img src="./images/viewIcon4Active.png" alt="">
				</span>
				<span>相对湿度</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon4.png" alt="">
					<img src="./images/viewIcon4Active.png" alt="">
				</span>
				<span>能见度</span>
			</li>
			<li class="">
				<span>
					<img src="./images/viewIcon4.png" alt="">
					<img src="./images/viewIcon4Active.png" alt="">
				</span>
				<span>体感温度</span>
			</li>`).appendTo(showDetailHtml);
	}
}
function closeDataPopupOverlay(){
	dataPopupOverlay.setPosition(undefined);
	alarmWarnOverlay.setPosition(undefined);
	$.each(map.getInteractions().getArray(), function(m, item) {
		if(item.constructor == ol.interaction.Select) {
			item.getFeatures().clear();
		}
	})
}

$(document).on("click",".Accident_news_close",function(){
	let objs = document.getElementsByTagName("video");
	for(let i=0;i<objs.length;i++){
		objs[i].pause();
	}
	$('.Accident_news').hide();
});

function initOverlay(){
	warnSignalOverlay = new ol.Overlay({
		element: document.getElementById("warnSignalOverlay"),
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	})

	map.addOverlay(warnSignalOverlay);
	$("#warnSignalOverlay").css("display", "block");
}
function addZoom(){
	var thisZoom = map.getView().getZoom();
	if(thisZoom<16){
		map.getView().setZoom(thisZoom+1);
	}
}
function subZoom(){
	var thisZoom = map.getView().getZoom();
	if(thisZoom>4){
		map.getView().setZoom(thisZoom-1);
	}
}
//初始化默认图层
function initBaseLayer() {
	map = mapUtil.createMap('map', config.map.center, config.map.projection, config.map.minZoom, config.map.baseZoom,
		config.map.maxZoom);
	//经纬度刻度线
	openCloseLatAndLon();
	let layers = tdt.createLayer([LAYERTYPE.IMAGE, LAYERTYPE.IMAGETEXT]);
	if (layers) {
		if (layers instanceof Array) {
			layers.forEach((l) => {
				map.addLayer(l);
			})
		}
	}
	warnLine();//24小时、48小时台风警戒线
	fishingGround();//渔场
}
function openCloseLatAndLon(){
	let latAndLonLineLayer = ol3_layerHelper.getLayerById(map,'latAndLonLineLayer');
	if(latAndLonLineLayer){
		$(".headerR").find('span').eq(0).removeClass('spanActive1');
		map.removeLayer(latAndLonLineLayer);
	}else{
		$(".headerR").find('span').eq(0).attr('class','spanActive1');
		let latAndLonLineLayer = new ol.Graticule({
			// the style to use for the lines, optional.
			strokeStyle: new ol.style.Stroke({
				color: 'rgba(255,120,0,0.9)',
				width: 2,
				lineDash: [0.5, 4],
			}),
			showLabels: true,
			zIndex:200,
			targetSize:100,
			wrapX: false,
		})
		latAndLonLineLayer.set('layerid','latAndLonLineLayer');
		latAndLonLineLayer.set('layerId','latAndLonLineLayer');
		map.addLayer(latAndLonLineLayer);
	}
}
$(document).on("click",".mapType >li",function(){
	var type = $(this).attr('value');
	if(type){
		changeBaseLayer(type,true);
	}
});
function changeBaseLayer(type, showText) {
	let layers;
	let lts
	switch (type) {
		case 'terr':
			lts = LAYERTYPE.TERR
			if (showText) {
				lts = [LAYERTYPE.TERR, LAYERTYPE.TERRTEXT];
			}
			layers = tdt.createLayer(lts);
			break
		case 'image':
			lts = LAYERTYPE.IMAGE
			if (showText) {
				lts = [LAYERTYPE.IMAGE, LAYERTYPE.IMAGETEXT];
			}
			layers = tdt.createLayer(lts);
			break
		case 'vector':
			lts = LAYERTYPE.VECTOR
			if (showText) {
				lts = [LAYERTYPE.VECTOR, LAYERTYPE.VECTORTEXT];
			}
			layers = tdt.createLayer(lts);
			break
		case 'highway':
			let highwayLayer = ol3_layerHelper.getLayerById(map,'highwayLayer');
			if(highwayLayer){
				map.removeLayer(highwayLayer);
			}else{
				loadHighwayData();
			}
			break
		default:
			break;
	}
	if(type != 'highway'){
		let highwayLayer = ol3_layerHelper.getLayerById(map,'highwayLayer');
		let oldBaseLayer = ol3_layerHelper.getLayerById(map, "baseLayer");
		let oldBaseTextLayer = ol3_layerHelper.getLayerById(map, "baseTextLayer");
		if(highwayLayer){
			map.removeLayer(highwayLayer);
		}
		if (oldBaseLayer) {
			map.removeLayer(oldBaseLayer);
		}
		if (oldBaseTextLayer) {
			map.removeLayer(oldBaseTextLayer);
		}
		if (layers) {
			if (layers instanceof Array) {
				layers.forEach((l) => {
					map.addLayer(l)
				})
			} else {
				map.addLayer(layers)
			}
		}
	}
}
function loadHighwayData(){
	$.ajax({
		type:'get',
		url:'./data/highway.geojson',
		success:function(result){
			var vectorSource = new ol.source.Vector({
				features: new ol.format.GeoJSON().readFeatures(result,{
					dataProjection: "EPSG:4326",
					featureProjection: 'EPSG:3857'
				})
			});
			var vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				style:highwayStyle,
				zIndex:12
			});
			let layerid = 'highwayLayer';
			vectorLayer.set("layerid",layerid)
			map.addLayer(vectorLayer);
			// mapUtil.addLayerPopup(map, vectorLayer, 'click', showHeatMapPopuInfo);
		}
	})
}
//初始化边界
function loadBoundary() {
	let citycode = '331000';
	let view = map.getView();
	if (citycode === '330000') {
		let wfLayer_xian_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: config.map.geoserverUrl,
				params: {
					'FORMAT': 'image/png',
					'VERSION': '1.1.1',
					tiled: true,
					LAYERS: 'zjcounty:county'
				},
				crossOrigin:'Anonymous'
			}),
			layerid: "wms_layer",
			layeriId: "wms_layer",
			zIndex: 10,
			// maxResolution:152.874056570411
		});
		map.addLayer(wfLayer_xian_layer);

		var wfLayer_shi_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: config.map.geoserverUrl,
				params: {
					'FORMAT': 'image/png',
					'VERSION': '1.1.1',
					tiled: true,
					LAYERS: 'zjcity:zhejiangcity'
				},
				crossOrigin:'Anonymous'
			}),
			layerid: "wms_layer",
			layeriId: "wms_layer",
			zIndex:9,
		});
		map.addLayer(wfLayer_shi_layer);

		let wfLayer_sheng_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: config.map.geoserverUrl,
				params: {
					'FORMAT': 'image/png',
					'VERSION': '1.1.1',
					tiled: true,
					LAYERS: 'zjprovince:zhejiangprovince',
				},
				crossOrigin:'Anonymous'
			}),
			layerid: "wms_layer",
			layeriId: "wms_layer",
			zIndex: 8,
		});
		map.addLayer(wfLayer_sheng_layer);
		view.setZoom(8);
	} else if (citycode != '330000' && citycode.substr(4, 2) === '00') {
		let wfLayer_xian_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: config.map.geoserverUrl,
				params: {
					'FORMAT': 'image/png',
					'VERSION': '1.1.1',
					tiled: true,
					LAYERS: 'zjcounty:county',
					'CQL_FILTER': "CITYCODE like '%" + citycode.substr(0, 4) + "%'"
				},
				crossOrigin:'Anonymous'
			}),
			layerid: "wms_layer",
			layeriId: "wms_layer",
			zIndex: 3
		});
		map.addLayer(wfLayer_xian_layer);

		let wfLayer_shi_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: config.map.geoserverUrl,
				params: {
					'FORMAT': 'image/png',
					'VERSION': '1.1.1',
					tiled: true,
					LAYERS: 'zjcity:zhejiangcity',
					'CQL_FILTER': 'CITYCODE =' + citycode
				},
				crossOrigin:'Anonymous'
			}),
			layerid: "wms_layer",
			layeriId: "wms_layer",
			zIndex: 2
		});
		map.addLayer(wfLayer_shi_layer);
		view.setZoom(9)
	} else {
		let wfLayer_xian_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: config.map.geoserverUrl,
				params: {
					'FORMAT': 'image/png',
					'VERSION': '1.1.1',
					tiled: true,
					LAYERS: 'zjcounty:county',
					'CQL_FILTER': 'CITYCODE =' + citycode
				},
				crossOrigin:'Anonymous'
			}),
			layerid: "wms_layer",
			layeriId: "wms_layer",
			zIndex: 2
		});
		map.addLayer(wfLayer_xian_layer);
		view.setZoom(11);
	}
	let lon = '121.421534';
	let lat = '28.66141';
	if (lon && lat) {
		let centerCoor = [lon, lat];
		view.setCenter(ol.proj.transform(centerCoor, "EPSG:4326", "EPSG:3857"))
	}
}

function loadLiveData(type,element){
	function compare(arg) {
		return function(a, b) {
			return b[arg] - a[arg];
		}
	}
	selectEleType = type;
	//加载实况数据
	var dateTime=$("#baseDataListTime").val();
	if(dateTime==''){
		dateTime=timeStamp2String(new Date());
	}
	//dateStr = '202007101200';
	dateStr=dateTime.replace("年","").replace("月","").replace("日","").replace(" ","").replace("时","")+"00";
	let areaCode = curArea.areaCode;
	let param = config.api.baseDataParam;
	let p = {
		'datatime': dateStr,
		'areaCode': areaCode,
		'isChildrens': true,
		"stationtype": "1,2",
		"datatype": "1,2"
	};
	param.params = JSON.stringify(p);
	param.interfaceCode = 'O0001';
	$.ajax({
		type: "post",
		cache: false,
		data: param,
		url: config.api.baseUrl,
		dataType: 'JSON',
		success: function (result) {
			let code = result.returnCode;
			if (code !== '0') {
				return;
			}
			liveData = result.data;
		}
	})
}
function loadAlarmWarn(){
	let param = config.api.baseDataParam;
	var orgunitCode = curArea.orgunitCode;
	let p = {
		'unitCode':orgunitCode
	};
	param.params = JSON.stringify(p);
	param.interfaceCode = 'E0001';
	$.ajax({
		type: "post",
		cache: false,
		// async: false,
		data: param,
		url: config.api.baseUrl,
		dataType: 'JSON',
		success: function (result) {
			let code = result.returnCode;
			if (code !== '0') {
				return;
			}
			let tableHtml = $('.alarmTableInfo >tbody').empty();
			let html = "";
			for(let i=0;i<result.data.length;i++){
				let keyId = result.data[i].keyId;
				let disasterName = result.data[i].disasterName;//事件类型
				let warnLevelName = result.data[i].warnLevelName;//等级
				let warnTime = new Date(result.data[i].warnTime).Format('yyyy-MM-dd hh:mm:ss');//时间
				if(i==0){
					html+='<tr value="'+keyId+'" ><td>'+disasterName+'</td>';
				}else{
					html+='<tr value="'+keyId+'" ><td>'+disasterName+'</td>';
				}
				html+='<td>'+warnLevelName+'</td>';
				html+='<td>'+warnTime+'</td></tr>';
				// let keyId = result.data[i].keyId;
				// loadAlarmInfo(keyId);
			}
			tableHtml.html(html);
			let firstWarnTime = new Date(result.data[0].warnTime).getTime();//时间
			let firstKeyId = result.data[0].keyId;
			let dayHourTime = 24*60*60*1000;
			if((new Date().getTime()-firstWarnTime)<=dayHourTime){//24小时内的预警展示
				$('.alarmTableInfo >tbody').find('tr').eq(0).addClass('alarmActive');
				loadAlarmInfo(firstKeyId);
			}
			$('.alarmTableInfo >tbody >tr').on('click',function(){
				let className = $(this).attr('class');
				if(className&&className.indexOf('alarmActive')>=0){
					$(this).removeClass('alarmActive');
				}else{
					$('.alarmActive').removeClass('alarmActive');
					$(this).addClass('alarmActive');
				}
				var alarmWarnLayer = ol3_layerHelper.getLayerById(map,'alarmWarnLayer');
				let selectClass = $(this).attr('class');
				if(selectClass && selectClass.indexOf('alarmActive')>=0){
					let keyId = $(this).attr('value');
					loadAlarmInfo(keyId);
				}else{
					if(alarmWarnLayer){
						map.removeLayer(alarmWarnLayer);
					}
				}
			})
		}
	});
}

function getCurTOEmsUser() {
	let user=JSON.parse(sessionStorage.getItem("user"));
	$.ajax({
		type: "post",
		cache: false,
		data: {
			token:user.accessToken,
			systemID:'397626948697718784'
		},
		url: otherbaseUrl+'/webPortal/user/getOtherSystemUser',
		dataType: 'JSON',
		success:function(result){
			if(result.code==0){
				user.sonEmpName=result.systemList[0].sonEmpName;
				sessionStorage.setItem("user",JSON.stringify(user));
			}else{
				console.log("获取对应多部门联动账号失败!");
			}
		},error:function (data) {
			console.log("获取对应多部门联动账号失败!");
		}
	})
}
function loadAlarmInfo(keyId){
	let param = config.api.baseDataParam;
	let p = {
		'keyId':keyId
	};
	param.params = JSON.stringify(p);
	param.interfaceCode = 'E0002';
	$.ajax({
		type: "post",
		cache: false,
		// async: false,
		data: param,
		url: config.api.baseUrl,
		dataType: 'JSON',
		success:function(result){
			var alarmWarnLayer = ol3_layerHelper.getLayerById(map,'alarmWarnLayer');
			if(alarmWarnLayer){
				map.removeLayer(alarmWarnLayer);
			}
			let code = result.returnCode;
			if (code !== '0') {
				return;
			}
			let data = result.data;
			for(let i=0;i<data.length;i++){
				let thisData = data[i];
				thisData.longitude = parseFloat(thisData.longitude);
				thisData.latitude = parseFloat(thisData.latitude);
				let showLevel = thisData.showLevel;
				let color = getLevelColor(showLevel);
				thisData.color = color;
			}
			var params = {
				"layerId": 'alarmWarnLayer',
				"layerCaption": "实况告警",
				"opacity": 0,
				"zIndex": 100,
				"crs": "EPSG:3857",
				"style": alarmWarnLayerStyle,
				"x": "longitude",
				"y": "latitude"
			};
			var liveLayer= layerUtil.createPointJsonLayer(data,params);//.createPointJsonLayer(data,params);
			liveLayer.set('layerid','alarmWarnLayer');
			map.addLayer(liveLayer);
			mapUtil.addLayerPopup(map, liveLayer, '', showAlarmData);
			liveLayer.on("postrender",animateWarn);
		}
	})
}
var duration = 3000;
var start = new Date().getTime();
function animateWarn(e){
	var frameState = e.frameState;
	var elapsed = frameState.time - start;
	while(elapsed > 3000) {
		elapsed = elapsed - 3000
	}
	var radius = Math.round(elapsed / 300);
	ol3_layerHelper.getLayerById(map,"alarmWarnLayer").setStyle(function(f){
		var warnColor =f.get("color");
		let rbgColor;
		let opacity = 0.5;
		if(warnColor=='red'){
			rbgColor = 'rgba(255,0,0,'+opacity+')';
		}else if(warnColor=='orange'){
			rbgColor = 'rgba(255,154,0,'+opacity+')';
		}else if(warnColor=='yellow'){
			rbgColor = 'rgba(255,255,0,'+opacity+')';
		}else if(warnColor=='blue'){
			rbgColor = 'rgba(0,0,255,'+opacity+')';
		}else{
			rbgColor = 'rgba(98,183,0,'+opacity+')';
		}
		let style1 = new ol.style.Style({
			image: new ol.style.Circle({
				radius: radius,
				fill:new ol.style.Fill({
					color:rbgColor,
				})
			})
		});
		let style2 = new ol.style.Style({
			image: new ol.style.Circle({
				radius:4,
				fill: new ol.style.Fill({
					color: warnColor
				}),

			}),
			fill: new ol.style.Fill({
				color: warnColor
			}),
		});
		return [style1, style2];

	})
	map.render();
}
function getLevelColor(num){
	if(num==4){
		return 'blue';
	}else if(num==3){
		return 'yellow';
	}else if(num==2){
		return 'orange';
	}else if(num==1){
		return 'red';
	}else{
		return '#62b700';
	}
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
function fileExists(url) {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status!=404;
}
function hideLayer(layerid) {
	$.each(map.getInteractions().getArray(), function (m, item) {
		if (item.constructor == ol.interaction.Select) {
			if (item.get('selectId') == 'select_click') {
				if (item.getFeatures().array_[0]) {
					if (item.getFeatures().array_[0].get("layerid") == layerid || item.getFeatures().array_[0].getGeometry().get("layerid") == layerid) {
						item.getFeatures().clear();
					};
				}
			}
		}
	});
	if(dataPopupOverlay){
		dataPopupOverlay.setPosition(undefined);
	}
	var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
	if (oldLayer) {
		oldLayer.setVisible(false);
	}
}
function showWarnInMapNew(){
	let loginAreaCode = curArea.areaCode;
	let params = {
		'areaCode': loginAreaCode,
		'isChildrens': true,
		"alarmType":2
	};
	config.api.baseDataParam.params = JSON.stringify(params);
	config.api.baseDataParam.interfaceCode = 'A0001';
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
			if(result && result.returnCode == 0) { //返回成功
				const data = result.data;
				if(data && data.length > 0) {
					const warnings = data.map(item=>{
						const alert = item.alert;
						return {
							identifier:alert.identifier,
							message:alert.code.method[0].message,
							senderCode:alert.senderCode,
							sendTime:alert.sendTime.split('+')[0],
							sender:alert.sender,
							severity:alert.info.severity,
							affectareas:alert.info.area.geocode,
							headline:alert.info.headline,
							eventType:alert.info.eventType,
							sendAreaCode:alert.senderCode.substr(0, 6) + "000000"
						};
					});
					warningCallBack(warnings);
				}
			}
		}
	});
}
function loadWarnInfoList(){
	var params = {};
	params.level = curArea.area_level;
	params.areaCode = curArea.areaCode;
	config.api.baseDataParam.params = JSON.stringify(params);
	config.api.baseDataParam.interfaceCode = 'A0007';
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
			if (result.returnCode != '0') {
				return;
			}
			let warnHtml = $('.currentWarningDetailBtn').empty();
			var data = result.data;
			var html = '';
			let firstCode;
			for(let i=0;i<data.length;i++){
				let areaName = data[i].areaName;
				let earlyTotal = data[i].earlyTotal;
				let showEarlyName = data[i].showEarlyName;
				let areaCode = data[i].areaCode;
				firstCode = areaCode;
				if(i==0){
					html+='<div class="divAc" code="'+areaCode+'" onclick="loadWarnInfos(this)">';
					html+='<p>'+showEarlyName+'</p>';
					html+='<p>'+areaName+'<i>（'+earlyTotal+'）</i></p></div>';
				}else{
					html+='<div code="'+areaCode+'" onclick="loadWarnInfos(this)">';
					html+='<p>'+showEarlyName+'</p>';
					html+='<p>'+areaName+'<i>（'+earlyTotal+'）</i></p></div>';
				}
			}
			warnHtml.html(html);
			loadWarnInfos($('.currentWarningDetailBtn .divAc'));
		}
	});
}
function loadWarnInfos(obj){
	let areaCode = $(obj).attr('code');
	let loginAreaCode = curArea.areaCode;
	var params = {};
	if(loginAreaCode==areaCode){//查询本级
		params = {
			'areaCode': areaCode,
			'isChildrens': false,
			"alarmType":2
		};
	}else{//查询子级
		params = {
			'areaCode': areaCode,
			'isChildrens': true,
			"alarmType":2
		};
	}
	config.api.baseDataParam.params = JSON.stringify(params);
	config.api.baseDataParam.interfaceCode = 'A0001';
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
			let code = result.returnCode;
			if (code !== '0') {
				return;
			}
			let warnInfo = $('.currentWarningDetailList .currentWarningDetailItem').empty();
			let data = result.data;
			//新代码
			for(let i=0;i<data.length;i++){
				let description = data[i].alert.info.description;//描述
				let disasterName = data[i].alert.info.disaName;//灾害名称
				let eventType = data[i].alert.info.eventType;//灾害类型
				let headLine = data[i].alert.info.headline;//标题
				let severity = data[i].alert.info.severity;//等级
				let sendTime = data[i].alert.sendTime.substring(0,19);//发布时间 2020-01-01 11:11:11
				let identifier = data[i].alert.identifier;//唯一标识
				let img = "./images/featureImage/warnImg/"+eventType+'_'+severity.toUpperCase()+".jpg";
				let errorImg = './images/featureImage/warnImg/common_'+severity.toUpperCase()+".jpg";
				if(severity=='Unknown'){
					img = './images/featureImage/warnImg/common_UNKNOWN.jpg';
					errorImg = './images/featureImage/warnImg/common_UNKNOWN.jpg';
				}
			}
			const warnings = data.map(item=>{
				const alert = item.alert;
				let eventType = item.alert.info.eventType;//灾害类型
				let severity = item.alert.info.severity;//等级
				let img = "./images/featureImage/warnImg/"+eventType+'_'+severity.toUpperCase()+".jpg";
				let errorImg = './images/featureImage/warnImg/common_'+severity.toUpperCase()+".jpg";
				if(severity=='Unknown'){
					img = './images/featureImage/warnImg/common_UNKNOWN.jpg';
					errorImg = './images/featureImage/warnImg/common_UNKNOWN.jpg';
				}
				let description = item.alert.info.description;//描述
				return {
					identifier:alert.identifier,
					message:alert.code.method[0].message,
					senderCode:alert.senderCode,
					sendTime:alert.sendTime.split('+')[0],
					sender:alert.sender,
					severity:alert.info.severity,
					affectareas:alert.info.area.geocode,
					headline:alert.info.headline,
					eventType:alert.info.eventType,
					sendAreaCode:alert.senderCode.substr(0, 6) + "000000",
					img:img,
					errorImg:errorImg,
					description:description
				};
			});
			warnings.forEach(warn => {
				let thisWarn=JSON.stringify(warn);

				var item =$(`
					<div class="currentWarningDetailItemCon">
						<p>${warn.headline}<a style="color:#de92ac;cursor:pointer;" onclick="yjya('${warn.severity}','${warn.identifier}','${warn.eventType}',false)">应急预案</a></p>
						<p>发布时间:${warn.sendTime}</p>
						<img src="${warn.img}" errorImg="${warn.errorImg}" onerror="imgError(event);">
						<p>${warn.description}</p>
					</div>
				`)
				item.data("warn",warn)
				item.appendTo(warnInfo)
			})
			$('.currentWarningDetailItem div').on('click',function(){
				let className = $(this).attr('class');
				if(className && className.indexOf('selectActiveDiv')>=0){
					$('.selectActiveDiv').removeClass('selectActiveDiv');
					hideLayer('clickEffectiveWarningLayer');
					hideLayer('clickWarningColorLayer');
					var oldLayer = ol3_layerHelper.getLayerById(map, 'clickEffectiveWarningLayer');
					if (oldLayer) {
						map.removeLayer(oldLayer);
					}
					var lid = "clickWarningColorLayer";
					oldLayer = ol3_layerHelper.getLayerById(map, 'clickWarningColorLayer');
					if (oldLayer) {
						map.removeLayer(oldLayer);
					}
					//隐藏预警图标图层
					hiddenOrShowLayer('effectiveWarningLayer', true);
					//隐藏涂色图层
					hiddenOrShowLayer("warningColorLayer", true);
					warnSignalOverlay.setPosition(undefined);
				}else{
					$('.selectActiveDiv').removeClass('selectActiveDiv');
					$(this).addClass('selectActiveDiv');
					let warn = $(this).data('warn');
					warningClickCallBack(warn);
				}
			})
		}
	})
}
function imgError(event){
	var img=event.srcElement ? event.srcElement : event.target;
	img.src=event.target.getAttribute('errorImg');
	img.onerror=null;
}
//点击预警call back
function warningClickCallBack(item) {
	//获取发布地区的经纬度
	var sendAreaCode = item.sendAreaCode;
	let identifier = item.identifier;
	var eventType = item.eventType;
	var severity= item.severity;
	var lonlat = getAreaLonLat(item.sendAreaCode);
	let img = "./images/featureImage/warnImg/"+eventType+'_'+severity.toUpperCase()+".jpg";
	let errorImg = './images/featureImage/warnImg/common_'+severity.toUpperCase()+".jpg";
	if(severity=='Unknown'){
		img = './images/featureImage/warnImg/common_UNKNOWN.jpg';
		errorImg = './images/featureImage/warnImg/common_UNKNOWN.jpg';
	}
	if (lonlat) {
		var x = lonlat.x;
		var y = lonlat.y;
		item.x = x;
		item.y = y;
		var affectareas = item.affectareas;
		var affectAreaCodes = affectareas.split(",");
		if (affectAreaCodes.length > 1) {
			//移除发送地区的编码
			var index = $.inArray(sendAreaCode, affectAreaCodes);
			if (index >= 0) {
				affectAreaCodes.splice(index, 1);
			}
		}
		//
		var subWarnings = new Array();

		//var features = new Array();
		var geojson = {
			"type": "FeatureCollection",
			"crs": {
				"type": "name",
				"properties": {
					"name": "EPSG:4326"
				}
			},
			"features": []
		};
		affectAreaCodes.forEach(code => {
			var XY = getAreaLonLat(item.sendAreaCode);
			var warning = {
				identifier:identifier,
				message: item.message,
				sender: item.sender,
				eventType: item.eventType,
				headline: item.headline,
				sendTime: item.sendTime,
				severity: item.severity,
				areaCode: code,
				x: XY.x,
				y: XY.y
			}
			subWarnings.push(warning);
			var codeSub = code.substr(0, 6);

			var feature = boundaryGeo[codeSub];
			if (feature) {
				feature.properties.color = item.severity;
				geojson.features.push(feature);
			}
		});
		//隐藏有效预警图层
		//隐藏预警图标图层
		hiddenOrShowLayer('effectiveWarningLayer', false);
		//隐藏涂色图层
		hiddenOrShowLayer("warningColorLayer", false);
		var oldLayer = ol3_layerHelper.getLayerById(map, 'clickEffectiveWarningLayer');
		if (oldLayer) {
			map.removeLayer(oldLayer);
		}
		//地区叠加
		var layerid = "clickEffectiveWarningLayer";
		var params = {
			"layerId": layerid,
			"opacity": 1,
			"zIndex": 22,
			"crs": "EPSG:3857",
			"style": warningStyle,
			"x": "x",
			"y": "y"
		};
		var jsonLayer = layerUtil.createPointJsonLayer(subWarnings, params);
		jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
		map.addLayer(jsonLayer);
		mapUtil.addLayerPopup(map, jsonLayer, '', clickWarningInfoPopup);
		var source = new ol.source.Vector({
			features: (new ol.format.GeoJSON({
				featureProjection: 'EPSG:3857'
			})).readFeatures(geojson),
		})
		//	var colorStyle=getWarningColorStyle();
		var lid = "clickWarningColorLayer";
		oldLayer = ol3_layerHelper.getLayerById(map, 'clickWarningColorLayer');
		if (oldLayer) {
			map.removeLayer(oldLayer);
		}
		var colorLayer = new ol.layer.Vector({
			source: source,
			zIndex: 21,
			layerId: lid,

			opacity: 0.7
		});
		colorLayer.set("layerid", lid);
		colorLayer.setStyle(getWarningColorStyle)
		map.addLayer(colorLayer);
	}

}

function yjya(severity,identifier,eventType,hisWarn) {
	let obj=new Object();
	obj.severity=severity;
	obj.identifier=identifier;
	obj.eventType=eventType;
	obj.hisWarn=hisWarn;
	/*代码联动 应急预案页面的逻辑*/
	sessionStorage.setItem('curAlert',JSON.stringify(obj));
	$("#yjyasj").css('display','block');
	let he=$("#yjyasj").css("height");
	let liHe=$("#yjyasj").contents().find('.Level>li').css("height");
	if(he!='146px'&&liHe!='30px'){
		document.getElementById('yjyasj').contentWindow.queryIsStartPlan();
	}else{
		document.getElementById('yjyasj').contentWindow.queryIsStartPlan();
		$("#yjyasj").contents().find('.Level>li').eq(0).children("div")[0].click();
	}
}
//点击预警call back
function hisWarningClickCallBack(item) {
	//获取发布地区的经纬度
	var sendAreaCode = item.sendAreaCode;
	let identifier = item.identifier;
	var eventType = item.eventType;
	var severity = item.severity;
	var lonlat = getAreaLonLat(item.sendAreaCode);
	let img = "./images/featureImage/warnImg/" + eventType + '_' + severity.toUpperCase() + ".jpg";
	let errorImg = './images/featureImage/warnImg/common_' + severity.toUpperCase() + ".jpg";
	if (severity == 'Unknown') {
		img = './images/featureImage/warnImg/common_UNKNOWN.jpg';
		errorImg = './images/featureImage/warnImg/common_UNKNOWN.jpg';
	}
	if (lonlat) {
		var x = lonlat.x;
		var y = lonlat.y;
		item.x = x;
		item.y = y;
		var affectareas = item.affectareas;
		var affectAreaCodes = affectareas.split(",");
		if (affectAreaCodes.length > 1) {
			//移除发送地区的编码
			var index = $.inArray(sendAreaCode, affectAreaCodes);
			if (index >= 0) {
				affectAreaCodes.splice(index, 1);
			}
		}
		var subWarnings = new Array();

		var geojson = {
			"type": "FeatureCollection",
			"crs": {
				"type": "name",
				"properties": {
					"name": "EPSG:4326"
				}
			},
			"features": []
		};
		affectAreaCodes.forEach(code => {
			var XY = getAreaLonLat(item.sendAreaCode);
			var warning = {
				identifier: item.identifier,
				message: item.message,
				sender: item.sender,
				eventType: item.eventType,
				headline: item.headline,
				sendTime: item.sendTime,
				severity: item.severity,
				areaCode: code,
				x: XY.x,
				y: XY.y
			}
			subWarnings.push(warning);
			var codeSub = code.substr(0, 6);

			var feature = boundaryGeo[codeSub];
			if (feature) {
				feature.properties.color = item.severity;
				geojson.features.push(feature);
			}
		});
		//隐藏有效预警图层
		//隐藏预警图标图层
		hiddenOrShowLayer('hisEffectiveWarningLayer', false);
		//隐藏涂色图层
		hiddenOrShowLayer("hisWarningColorLayer", false);
		var oldLayer = ol3_layerHelper.getLayerById(map, 'hisClickEffectiveWarningLayer');
		if (oldLayer) {
			map.removeLayer(oldLayer);
		}
		//地区叠加
		var layerid = "hisClickEffectiveWarningLayer";
		var params = {
			"layerId": layerid,
			"opacity": 1,
			"zIndex": 22,
			"crs": "EPSG:3857",
			"style": warningStyle,
			"x": "x",
			"y": "y"
		};
		var jsonLayer = layerUtil.createPointJsonLayer(subWarnings, params);
		jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
		map.addLayer(jsonLayer);
		var source = new ol.source.Vector({
			features: (new ol.format.GeoJSON({
				featureProjection: 'EPSG:3857'
			})).readFeatures(geojson),
		})
		mapUtil.addLayerPopup(map, jsonLayer, '', hisWarningInfoPopup);
		var lid = "hisClickWarningColorLayer";
		oldLayer = ol3_layerHelper.getLayerById(map, 'hisClickWarningColorLayer');
		if (oldLayer) {
			map.removeLayer(oldLayer);
		}
		var colorLayer = new ol.layer.Vector({
			source: source,
			zIndex: 21,
			layerId: lid,

			opacity: 0.7
		});
		colorLayer.set("layerid", lid);
		colorLayer.setStyle(getWarningColorStyle);
		map.addLayer(colorLayer);
	}
}
function getAreaCodeLevel(areaCode) {
	areaCode = areaCode.substr(0, 6);
	if (areaCode.endsWith("0000")) {
		return 1;
	} else if (areaCode.endsWith("00")) {
		return 2;
	} else {
		return 3;
	}
}

function warningCallBack(warnings) {
	if (warnings && warnings.length > 0) {
		//预警拆分过滤 同类型同级别以最小发布地区为准
		///用于存储key是否存在 地区编码_灾害类型_灾害级别
		var warningMap = new Map();
		var areaOffsetIndex = {};
		warnings.forEach(warning => {
			var identifier = warning.identifier;
			var message = warning.message;
			var senderCode = warning.senderCode;
			var sendTime = warning.sendTime;
			var sender = warning.sender;
			var severity = warning.severity;
			var affectareas = warning.affectareas;
			var headline = warning.headline;
			var eventType = warning.eventType;
			var sendAreaCode = warning.sendAreaCode;
			var affectCodes = affectareas.split(",");
			/*	var defalutCode = "330000000000";
                var codeIndex = $.inArray(defalutCode, affectCodes);
                if (codeIndex != -1) {
                    affectCodes.splice(codeIndex, 1);
                }*/
			if (affectCodes.length > 0) {
				var sac = sendAreaCode.substr(0, 6);
				if (sac.endsWith("0000")) { //省级预警
					if (affectCodes.length == 1) {
						var item = {
							identifier,
							message,
							senderCode,
							sendTime,
							sender,
							severity,
							headline,
							eventType,
							sendAreaCode
						}
						var k = affectCodes[0] + "_" + eventType + "_" + severity;
						if (affectCodes[0] == sendAreaCode) { //影响地区和发布地区相同，则直接添加
							item.areaCode = sendAreaCode
							var index = areaOffsetIndex[item.areaCode];
							if (index == undefined) {
								index = 0;
							} else if (index == offsetXY.length - 1) {
								index = 0
							} else {
								index = index + 1;
							}
							var lonlat = getAreaLonLat(item.areaCode);
							if (lonlat.x) {
								item.x = lonlat.x * 1 + offsetXY[index].x;
							}
							if (lonlat.y) {
								item.y = lonlat.y * 1 + offsetXY[index].y;
							}
							areaOffsetIndex[item.areaCode] = index;
							warningMap[k] = item;
						} else {
							var oldWarning = warningMap[k];
							if (oldWarning) { //存在的话，判断发布地区级别 以最小发布地区级别为准
								var oldCode = oldWarning.areaCode;
								var currentCode = affectCodes[0];
								var oldLevel = getAreaCodeLevel(oldCode);
								var currLevel = getAreaCodeLevel(currentCode);
								if (currLevel > oldLevel) { //当前地区级别比之前的地区级别小
									item.areaCode = currentCode;
									item.x = oldWarning.x;
									item.y = oldWarning.y;
									warningMap[k] = item;
								}
							} else {
								item.areaCode = affectCodes[0];

								var index = areaOffsetIndex[item.areaCode];
								if (index == undefined) {
									index = 0;
								} else if (index == offsetXY.length - 1) {
									index = 0
								} else {
									index = index + 1;
								}
								var lonlat = getAreaLonLat(item.areaCode);
								if (lonlat.x) {
									item.x = lonlat.x * 1 + offsetXY[index].x;
								}
								if (lonlat.y) {
									item.y = lonlat.y * 1 + offsetXY[index].y;
								}
								areaOffsetIndex[item.areaCode] = index;
								item.color = true;
								warningMap[k] = item;
							}
						}
					} else {
						for (var i = 0; i < affectCodes.length; i++) {
							var item = {
								identifier,
								message,
								senderCode,
								sendTime,
								sender,
								severity,
								headline,
								eventType,
								sendAreaCode
							};
							var currentCode = affectCodes[i];
							if (currentCode == sendAreaCode) {
								continue;
							}
							var k = currentCode + "_" + eventType + "_" + severity;
							var oldWarning = warningMap[k];
							if (oldWarning) {
								var oldCode = oldWarning.areaCode;
								var oldLevel = getAreaCodeLevel(oldCode);
								var currLevel = getAreaCodeLevel(currentCode);
								if (currLevel > oldLevel) { //当前地区级别比之前的地区级别小
									item.areaCode = currentCode;
									warningMap[k] = item;
								}
							} else {
								item.areaCode = currentCode
								var index = areaOffsetIndex[item.areaCode];
								if (index == undefined) {
									index = 0;
								} else if (index == offsetXY.length - 1) {
									index = 0
								} else {
									index = index + 1;
								}
								var lonlat = getAreaLonLat(item.areaCode);
								if (lonlat.x) {
									item.x = lonlat.x * 1 + offsetXY[index].x;
								}
								if (lonlat.y) {
									item.y = lonlat.y * 1 + offsetXY[index].y;
								}
								areaOffsetIndex[item.areaCode] = index;
								warningMap[k] = item;
							}
						}

					}
				} else if (sac.endsWith("00")) { //市级预警
					if (affectCodes.length > 1) { //移除发送地区的影响区域
						var index = $.inArray(sendAreaCode, affectCodes);
						affectCodes.splice(index, 1);
					}
					for (var i = 0; i < affectCodes.length; i++) {
						var item = {
							identifier,
							message,
							senderCode,
							sendTime,
							sender,
							severity,
							headline,
							eventType,
							sendAreaCode
						};
						var currentCode = affectCodes[i];
						var k = currentCode + "_" + eventType + "_" + severity;
						var oldWarning = warningMap[k];
						if (oldWarning) {
							var oldCode = oldWarning.areaCode;
							var oldLevel = getAreaCodeLevel(oldCode);
							var currLevel = getAreaCodeLevel(currentCode);
							if (currLevel > oldLevel) { //当前地区级别比之前的地区级别小
								item.areaCode = currentCode;
								item.x = oldWarning.x;
								item.y = oldWarning.y;
								warningMap[k] = item;
							}
						} else {
							item.areaCode = currentCode
							var index = areaOffsetIndex[item.areaCode];
							if (index == undefined) {
								index = 0;
							} else if (index == offsetXY.length - 1) {
								index = 0
							} else {
								index = index + 1;
							}
							var lonlat = getAreaLonLat(item.areaCode);
							if (lonlat.x) {
								item.x = lonlat.x * 1 + offsetXY[index].x;
							}
							if (lonlat.y) {
								item.y = lonlat.y * 1 + offsetXY[index].y;
							}
							areaOffsetIndex[item.areaCode] = index;
							item.color = true;
							warningMap[k] = item;
						}
					}
				} else {
					//县级预警
					for (var i = 0; i < affectCodes.length; i++) {
						var item = {
							identifier,
							message,
							senderCode,
							sendTime,
							sender,
							severity,
							headline,
							eventType,
							sendAreaCode
						};
						var currentCode = sendAreaCode;
						var k = currentCode + "_" + eventType + "_" + severity;
						var oldWarning = warningMap[k];
						if (oldWarning) {
							var oldCode = oldWarning.areaCode;
							var oldLevel = getAreaCodeLevel(oldCode);
							var currLevel = getAreaCodeLevel(currentCode);
							if (currLevel > oldLevel) { //当前地区级别比之前的地区级别小
								item.areaCode = currentCode;
								item.x = oldWarning.x;
								item.y = oldWarning.y;
								warningMap[k] = item;
							}
						} else {
							item.areaCode = currentCode
							var index = areaOffsetIndex[item.areaCode];
							if (index == undefined) {
								index = 0;
							} else if (index == offsetXY.length - 1) {
								index = 0
							} else {
								index = index + 1;
							}
							var lonlat = getAreaLonLat(item.areaCode);
							if (lonlat.x) {
								item.x = lonlat.x * 1 + offsetXY[index].x;
							}
							if (lonlat.y) {
								item.y = lonlat.y * 1 + offsetXY[index].y;
							}
							areaOffsetIndex[item.areaCode] = index;
							item.color = true;
							warningMap[k] = item;
						}
					}
				}
			}
		})
		var areaCodes = new Array();
		var warningValues = new Array();
		for (let k in warningMap) {
			warningValues.push(warningMap[k]);
			if (warningMap[k].color) {
				areaCodes.push(warningMap[k].areaCode);
			}
		}

		//设置每个地区涂色 同以地区以最高级别涂色
		var layerid = "effectiveWarningLayer";
		var params = {
			"layerId": layerid,
			"opacity": 1,
			"zIndex": 22,
			"crs": "EPSG:3857",
			"style": warningStyle,
			"x": "x",
			"y": "y"
		};
		var jsonLayer = layerUtil.createPointJsonLayer(warningValues, params);
		jsonLayer.set("layerid", layerid) //设置矢量图层的layerid，用于查找该图层
		map.addLayer(jsonLayer);
		mapUtil.addLayerPopup(map, jsonLayer, '', warningInfoPopup);
		//叠加地图上
		var featureColor = new Map();
		warningValues.forEach(w => {
			var areaCode = w.areaCode;
			var severity = w.severity;
			var color = getTopColor(featureColor[areaCode], severity);
			featureColor[areaCode] = color;
		});
		var geojson = {
			"type": "FeatureCollection",
			"crs": {
				"type": "name",
				"properties": {
					"name": "EPSG:4326"
				}
			},
			"features": []
		}
		areaCodes.forEach(code => {
			code = code.substr(0, 6);

			var feature = boundaryGeo[code];
			if (feature) {
				feature.properties.color = featureColor[code + "000000"];
				geojson.features.push(feature);
			}
		})
		//创建涂色图层
		var source = new ol.source.Vector({
			features: (new ol.format.GeoJSON({
				featureProjection: 'EPSG:3857'
			})).readFeatures(geojson),
		})
		var lid = "warningColorLayer";
		var colorLayer = new ol.layer.Vector({
			source: source,
			zIndex: 21,
			layerId: lid,

			opacity: 0.7
		});
		colorLayer.set("layerid", lid);
		colorLayer.setStyle(getWarningColorStyle);
		map.addLayer(colorLayer);

	}
}

function hiddenOrShowLayer(layerid, isShow) {
	var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
	if (oldLayer) {
		oldLayer.setVisible(isShow);
	}
}

function getTopColor(oldColor, newColor) {
	var oldNum = levelColorToNum(oldColor);
	if (!oldColor) {
		return newColor;
	}
	var newNum = levelColorToNum(newColor);
	if (newNum >= oldNum) {
		return newColor;
	} else {
		return oldColor;
	}
}

function levelColorToNum(color) {
	var colorNum = 0;
	switch (color) {
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

function getWarningColorStyle(f) {
	var color = f.get("color");
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			width: 2,
			color: color
		}),
		fill: new ol.style.Fill({
			color: color
		})
	});
}

function loadTyphoon() {
	let year = $('.selectYear').text();
	var params = {
		'year': year,
		'forecastor': 'BABJ'
	};
	config.api.baseDataParam.params = JSON.stringify(params);
	config.api.baseDataParam.interfaceCode = 'M0059';
	$.ajax({
		type: 'post',
		url: config.api.baseUrl,
		dataType: 'json',
		data: config.api.baseDataParam,
		success: function (result) {
			var tableHtml = $('.informationDetailBox .informationDetailTable').empty();
			let html = '';
			let liHtml = $('.typhoon_list').empty();
			let listHtml = '';
			if (result.returnCode * 1 === 0) {
				let typhooneGifData = [];
				for (let i = 0; i < result.data.length; i++) {
					listHtml += '<li><input type="checkbox" name="typhoonName" id="' + result.data[i].bianhao + '" value="" /><label for="' + result.data[i].bianhao + '">' + result.data[i].bianhao + ' ' + result.data[i].shikuang[0].zhongwenbianhao + '</label></li>';
					let nowData = result.data[i];
					let typhoonId = result.data[i].bianhao;
					let shikuang = result.data[i].shikuang;
					const liveData = [];//当前台风的实况信息
					const lineData = [];//生成路线的数据
					const forecastData = [];//当前台风的预报信息
					const forecastLineData = [];//生成预报路线的数据
					//加载实况台风数据
					for (let j = 0; j < shikuang.length; j++) {
						let longitude = parseFloat(shikuang[j].jingdu);
						let latitude = parseFloat(shikuang[j].weidu);
						let id = shikuang[j].bianhao;
						let level = shikuang[j].taifengjibie;
						let windv = shikuang[j].xianzaifengli;
						let press = shikuang[j].xianzaiqiya;
						let time = shikuang[j].xianzaishijian;
						let windd = shikuang[j].yidongfangxiang;
						let name = shikuang[j].zhongwenbianhao;
						const obj = {
							longitude,
							latitude,
							id,
							level,
							windv,
							windd,
							press,
							time,
							name
						}
						liveData.push(obj);
						lineData.push(ol.proj.transform([longitude, latitude], config.dataProjection, config.mapProjection));
						if (j == shikuang.length - 1) {
							forecastLineData.push(ol.proj.transform([longitude, latitude], config.dataProjection, config.mapProjection));
						}
					}
					let geomData = new ol.geom.LineString(lineData);
					let thisFeature = new ol.Feature({
						geometry: geomData
					});
					let typhoonRouteLayer = new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [thisFeature]
						}),
						style: lineStyle,
						zIndex: 200
					})
					if (ol3_layerHelper.getLayerById(map, 'typhoonLineDataLayer' + typhoonId)) {
						map.removeLayer(ol3_layerHelper.getLayerById(map, 'typhoonLineDataLayer' + typhoonId));
					}
					typhoonRouteLayer.set("layerid", 'typhoonLineDataLayer' + typhoonId);
					map.addLayer(typhoonRouteLayer);//加载台风路线
					typhoonRouteLayer.setVisible(false);//----------------------实况路线
					let params = {
						"layerId": 'typhoonPointDataLayer' + typhoonId,
						"opacity": 1,
						"zIndex": 21,
						"crs": "EPSG:3857",
						"style": typhoonPointDataStyle,
						"x": "longitude",
						"y": "latitude"
					};
					var newLayer = layerUtil.createPointJsonLayer(liveData, params, {});
					newLayer.set("layerid", 'typhoonPointDataLayer' + typhoonId)
					if (ol3_layerHelper.getLayerById(map, 'typhoonPointDataLayer' + typhoonId)) {
						map.removeLayer(ol3_layerHelper.getLayerById(map, 'typhoonPointDataLayer' + typhoonId));
					}
					map.addLayer(newLayer);//加载台风点
					newLayer.setVisible(false);//----------------------实况台风点
					//加载预报台风数据
					let yubao = result.data[i].yubao;
					if (yubao.length > 0) {
						for (let j = 0; j < yubao.length; j++) {
							let longitude = parseFloat(yubao[j].jingdu);
							let latitude = parseFloat(yubao[j].weidu);
							let id = yubao[j].bianhao;
							let windv = yubao[j].yubaofengli;
							let press = yubao[j].yubaoqiya;
							let name = yubao[j].zhongwenbianhao;
							const obj = {
								longitude,
								latitude,
								id,
								windv,
								press,
								name
							}
							forecastData.push(obj);
							forecastLineData.push(ol.proj.transform([longitude, latitude], config.dataProjection, config.mapProjection));
						}
					}
					let geomForecastData = new ol.geom.LineString(forecastLineData);
					let forecastFeature = new ol.Feature({
						geometry: geomForecastData
					});
					let typhoonForecastRouteLayer = new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [forecastFeature]
						}),
						style: forecastLineStyle,
						zIndex: 200
					})
					if (ol3_layerHelper.getLayerById(map, 'typhoonForecastLineDataLayer' + typhoonId)) {
						map.removeLayer(ol3_layerHelper.getLayerById(map, 'typhoonForecastLineDataLayer' + typhoonId));
					}
					typhoonForecastRouteLayer.set("layerid", 'typhoonForecastLineDataLayer' + typhoonId);
					map.addLayer(typhoonForecastRouteLayer);//加载台风路线
					typhoonForecastRouteLayer.setVisible(false);//----------------------预报台风路线
					let params1 = {
						"layerId": 'typhoonForecastLineDataLayer' + typhoonId,
						"opacity": 1,
						"zIndex": 21,
						"crs": "EPSG:3857",
						"style": typhoonPointDataStyle,
						"x": "longitude",
						"y": "latitude"
					};
					var newLayer1 = layerUtil.createPointJsonLayer(forecastData, params1, {});
					if (newLayer1.getSource().getFeatures().length > 0) {
						// newLayer1.getSource().getFeatures()[0].on('mousein',function (event) {
						// 	console.log(1);
						// })
					}
					if (ol3_layerHelper.getLayerById(map, 'typhoonForecastPointDataLayer' + typhoonId)) {
						map.removeLayer(ol3_layerHelper.getLayerById(map, 'typhoonForecastPointDataLayer' + typhoonId));
					}
					newLayer1.set("layerid", 'typhoonForecastPointDataLayer' + typhoonId)
					map.addLayer(newLayer1);//加载预报台风点
					newLayer1.setVisible(false);//----------------------预报台风点
					//加载动态台风图标数据
					if (shikuang.length > 0) {
						let longitude = shikuang[shikuang.length - 1].jingdu;
						let latitude = shikuang[shikuang.length - 1].weidu;
						let obj = {
							longitude,
							latitude
						}
						// typhooneGifData.push(obj);
						let params2 = {
							"layerId": 'typhoonGifDataLayer' + typhoonId,
							"opacity": 1,
							"zIndex": 21,
							"crs": "EPSG:3857",
							"style": typhoonPointDataStyle,
							"x": "longitude",
							"y": "latitude"
						};
						if (ol3_layerHelper.getLayerById(map, 'typhoonGifDataLayer' + typhoonId)) {
							map.removeLayer(ol3_layerHelper.getLayerById(map, 'typhoonGifDataLayer' + typhoonId));
						}
						var newLayer2 = layerUtil.createPointJsonLayer([obj], params2, {});
						newLayer2.set("layerid", 'typhoonGifDataLayer' + typhoonId);
						map.addLayer(newLayer2);
						newLayer2.setVisible(false);//----------------------台风图标
						var routestart = new Date().getTime();
						newLayer2.set('routestart', routestart);
						newLayer2.on('postrender', animiate);
					}
				}
			}
			liHtml.html(listHtml);
			$('.typhoon_list >li').on('click', function () {
				hideTyphoonLayer();
				$('input:checkbox[name=typhoonName]:checked').each(function (i) {
					let typhoonId = $(this).attr('id');
					let typhoonPointDataLayer = ol3_layerHelper.getLayerById(map, 'typhoonPointDataLayer' + typhoonId);
					let typhoonLineDataLayer = ol3_layerHelper.getLayerById(map, 'typhoonLineDataLayer' + typhoonId);
					let typhoonForecastLineDataLayer = ol3_layerHelper.getLayerById(map, 'typhoonForecastLineDataLayer' + typhoonId);
					let typhoonForecastPointDataLayer = ol3_layerHelper.getLayerById(map, 'typhoonForecastPointDataLayer' + typhoonId);
					let typhoonGifDataLayer = ol3_layerHelper.getLayerById(map, 'typhoonGifDataLayer' + typhoonId);
					if (typhoonPointDataLayer) {
						typhoonPointDataLayer.setVisible(true);
					}
					if (typhoonLineDataLayer) {
						typhoonLineDataLayer.setVisible(true);
					}
					if (typhoonForecastLineDataLayer) {
						typhoonForecastLineDataLayer.setVisible(true);
					}
					if (typhoonForecastPointDataLayer) {
						typhoonForecastPointDataLayer.setVisible(true);
					}
					if (typhoonGifDataLayer) {
						typhoonGifDataLayer.setVisible(true);
					}
				});
			})
		}
	})
}

function hideTyphoonLayer() {
	let layerArr = [];
	let layers = map.getLayers();
	for (let i = 0; i < layers.array_.length; i++) {
		let layerid = layers.array_[i].get('layerid');
		if (layerid != undefined) {
			if (layerid.indexOf('typhoonPointDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonLineDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonForecastLineDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonForecastPointDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonGifDataLayer') != -1) {
				layerArr.push(layerid)
			}
		}
	}
	for (let i = 0; i < layerArr.length; i++) {
		// map.removeLayer(ol3_layerHelper.getLayerById(map,layerArr[i]));
		ol3_layerHelper.getLayerById(map, layerArr[i]).setVisible(false);
	}
}

function removeTyphoonLayer() {
	let layerArr = [];
	let layers = map.getLayers();
	for (let i = 0; i < layers.array_.length; i++) {
		let layerid = layers.array_[i].get('layerid');
		if (layerid != undefined) {
			if (layerid.indexOf('typhoonPointDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonLineDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonForecastLineDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonForecastPointDataLayer') != -1) {
				layerArr.push(layerid)
			}
			if (layerid.indexOf('typhoonGifDataLayer') != -1) {
				layerArr.push(layerid)
			}
		}
	}
	for (let i = 0; i < layerArr.length; i++) {
		// map.removeLayer(ol3_layerHelper.getLayerById(map,layerArr[i]));
		// ol3_layerHelper.getLayerById(map,layerArr[i]).setVisible(false);
		map.removeLayer(ol3_layerHelper.getLayerById(map, layerArr[i]));
	}
}

function animiate(event) {
	let features = event.target.getSource().getFeatures();
	for (let i = 0; i < features.length; i++) {
		let picF = features[i];
		var img = './images/typhon.png';
		var routestart = event.target.get('routestart');
		if (event) {
			var frameState = event.frameState;
			elapsed = (frameState.time - routestart) / 8;
		}
		let rotation = '';
		rotation = Math.PI / 180 * elapsed;
		picF.setStyle(
			new ol.style.Style({
				image: new ol.style.Icon(({
					rotation: rotation,
					src: img,
					scale: 0.5
				}))
			})
		)
	}
}

function loadActiveDisaster(ids) {
	let param = {};
	if (ids) {//点击选中查询
		param.disasterId = ids;
	} else {//查询当前有效的灾情
		param.isEffect = true;
	}
	param.disasterStatus = 3;
	let params = {
		serialNumber: new Date().getTime(),
		param: param
	}
	let disasterInfoLayer = ol3_layerHelper.getLayerById(map, 'disasterPLayer');
	if (disasterInfoLayer) {
		map.removeLayer(disasterInfoLayer);
	}
	$.ajax({
		type: 'post',
		url: config.getDisasterInfo,
		dataType: config.dataType,
		data: JSON.stringify(params),
		success: function (result) {
			let returnCode = result.returnCode;
			if (returnCode === 0) {
				let disasterInfo = result.disasterInfo;
				for (let i = 0; i < disasterInfo.length; i++) {
					disasterInfo[i].lon = parseFloat(disasterInfo[i].lon);
					disasterInfo[i].lat = parseFloat(disasterInfo[i].lat)
				}
				var params = {
					"layerId": 'disasterInfoLayer',
					"layerCaption": "灾情信息",
					"opacity": 0,
					"zIndex": 50,
					"crs": "EPSG:3857",
					"style": disasterStyle,
					"x": "lon",
					"y": "lat"
				};
				var newLayer = layerUtil.createPointJsonLayer(disasterInfo, params, {});
				newLayer.set('layerid', 'disasterPLayer');
				map.addLayer(newLayer);
			}
		}
	})
}

var arrMonitorVideoData = [];

function loadMonitorVideoList() {
	$.ajax({
		type: 'post',
		url: config.getMonitorVideoList,
		dataType: config.dataType,
		data: {},
		success: function (result) {
			let returnCode = result.code;
			if (returnCode === 0) {
				let itemContentHtml = $('.itemContent').eq(1).empty();
				let data = result.data;
				for (let i = 0; i < data.length; i++) {
					let id = data[i].id;
					let videoName = data[i].videoName;
					let videoType = data[i].videoType;
					let videoSrc = data[i].videoSrc;
					$(`<div class="dataItem monitorVideo" style="width:95%;height: 35%;margin:5px 0">
						<p title="${videoName}" style="width: 100%;text-align: center;margin:0 0 10px;">${videoName}</p>
						<video id="video_${id}" class="video-js vjs-default-skin vjs-big-play-centered" muted>
							<source src="${videoSrc}" type="${videoType}"/>
						</video>
					</div>`).appendTo(itemContentHtml);

					let width = $("#video_" + id).parent().outerWidth(true) - 30;
					let height = $("#video_" + id).parent().outerHeight() - 60;

					var myPlayer = videojs('video_' + id, {
						"width": width,
						"height": height,
						"controls": true,
						"autoplay": true,
					}, function onPlayerReady() {
						this.play();
					});
					myPlayer.play();
					data[i].video = myPlayer;
					arrMonitorVideoData.push(data[i]);
				}
			}
		}
	})
}

function monitorVideoClose() {
	if (arrMonitorVideoData.length > 0) {
		arrMonitorVideoData.forEach(function (item, index, arr) {
			item.video.reset();
		});
	}
}

function monitorVideoPlay() {
	$('.levelOneBtn').find('li').each(function (item, index, arr) {
		let curText=$(this).find("p").text();
		if ($(this).hasClass("liActive")) {
			if (curText == '视频监控') {
				if (arrMonitorVideoData.length == 0) {
					loadMonitorVideoList();
				} else {
					if (arrMonitorVideoData.length > 0) {
						arrMonitorVideoData.forEach(function (item, index, arr) {
							item.video.src({
								type: item.videoType,
								src: item.videoSrc,
							});
							item.video.load(item.videoSrc);
							item.video.play();
							$("#video_" + item.id).siblings("p").text(item.videoName).prop("title", item.videoName);
						});
					}
				}
			}
		}
	});
}
//转换坐标点（多）
function transPoints(points) {
	var _points = [];
	for (var i in points) {
		let item = [parseFloat(points[i][0]), parseFloat(points[i][1])]
		let point = ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857');
		_points.push(point);
	}
	return _points;
}

function loadDisasterList(){
	let params = {
		serialNumber: new Date().getTime(),
		param: {
			isEffect: true,
			disasterStatus: 3
		}
	}
	$.ajax({
		type: 'post',
		url: config.getDisasterInfo,
		dataType: config.dataType,
		data: JSON.stringify(params),
		success: function (result) {
			let returnCode = result.returnCode;
			if (returnCode * 1 === 0) {
				let disasterInfo = result.disasterInfo;
				let itemContentHtml = $('.itemContent').eq(3).empty();
				for (let i = 0; i < disasterInfo.length; i++) {
					let disasterTitle = disasterInfo[i].disasterTitle;
					let reportTime = disasterInfo[i].returnReportTime;
					let publishPerson = disasterInfo[i].reportPersonName;
					let address = disasterInfo[i].disasterAddress;
					let content = disasterInfo[i].disasterContent;
					let disasterAnnex = disasterInfo[i].disasterAnnex;
					let disasterId = disasterInfo[i].disasterId;
					let type = disasterInfo[i].disasterAnnex != undefined ? disasterInfo[i].disasterAnnex[0].fileType : "";
					let curEffect = disasterInfo[i].curEffect;
					let classNames = 'dataItem ';
					if (curEffect) {
						classNames += 'dataItemAc';
					}
					if (type != '' && (type.indexOf(".jpg") != -1 || type.indexOf(".png") != -1 ||
						type.indexOf(".gif") != -1 || type.indexOf(".tif") != -1 ||
						type.indexOf(".bmp") != -1 || type.indexOf("image/jpeg") != -1 ||
						type.indexOf(".img") != -1)) {
						let url = disasterInfo[i].disasterAnnex[0].fileUrl;
						$(`<div class="${classNames}" id="${disasterId}">
						<img src="${url}" style="width: 120px;height: 90px">
						<div class="titleTime">
							<p title="${disasterTitle}">${disasterTitle}</p>
							<p>${reportTime}</p>
						</div>
						<p>${content}</p>
					</div>`).appendTo(itemContentHtml);
					} else {//视频
						$(`<div class="${classNames}" id="${disasterId}">
						<img src="./images/demage.png"  style="width: 120px;height: 90px">
						<div class="titleTime">
							<p title="${disasterTitle}">${disasterTitle}</p>
							<p>${reportTime}</p>
						</div>
						<p>${content}</p>
					</div>`).appendTo(itemContentHtml);
					}
				}
			} else {
				$('.itemContent').eq(3).empty();
			}
		}
	})
}

function initArea() {
	var adminLevel = curArea.area_level;
	if (adminLevel == 1) {
		//加载市级
		loadAreaChildren('disProvince', 'disCity')
	} else if (adminLevel == 3) {
		loadAreaByPId('330000000000', cityLevel)
	} else if (adminLevel == 4) {
		//先加载市
		loadAreaByPId('330000000000', countyAreaCallBack);
	}
}

function loadAreaByPId(pId, callback) {
	var params = {
		pId: pId
	};
	var dataParam = config.api.baseDataParam
	dataParam.params = JSON.stringify(params);
	dataParam.interfaceCode = 'T0002';
	$.ajax({
		type: "post",
		//async:false,
		url: config.api.baseUrl,
		data: dataParam,
		dataType: 'json',
		cache: false,
		success: function (result) {
			if (result.returnCode * 1 === 0) {
				var data = result.data;
				if (callback) {
					callback(data);
				}
			}
		},
	})
}

function loadAreaChildren(pSelectId, currSelectId) {
	var pId = $("#" + pSelectId).val();
	var currSelect = $("#" + currSelectId).empty();
	$("<option value =''>请选择</option>").appendTo(currSelect);
	if (pId == '') {
		return;
	}
	var params = {
		pId: pId
	};
	var dataParam = config.api.baseDataParam
	dataParam.params = JSON.stringify(params);
	dataParam.interfaceCode = 'T0002';
	$.ajax({
		type: "post",
		//async:false,
		url: config.api.baseUrl,
		data: dataParam,
		dataType: 'json',
		cache: false,
		success: function (result) {
			if (result.returnCode * 1 === 0) {
				var data = result.data;
				if (data && data.length > 0) {
					data.forEach(function (item) {
						var code = item.id;
						var name = item.name;
						$(`<option value ='${code}'>${name}</option>`).appendTo(currSelect);
					})
				}
			}

		},
	})
}

function countyAreaCallBack(data) {
	var disCity = $('#disCity').empty();
	var user = JSON.parse(sessionStorage.getItem("curArea"));
	var currentAreaCode = user.areaCode;
	var cityAreaCode = currentAreaCode.substr(0, 4) + "00000000";
	data.forEach(function (item) {
		if (item.id === cityAreaCode) {
			$(`<option value ='${cityAreaCode}'>${item.name}</option>`).appendTo(disCity);
		}
	});
	loadAreaByPId(cityAreaCode, countyCurrentCallBack);
}

function cityLevel(data) {
	var disCity = $('#disCity').empty();
	var currentAreaCode = curArea.areaCode;
	data.forEach(function (item) {
		if (item.id === currentAreaCode) {
			$(`<option value ='${currentAreaCode}'>${item.name}</option>`).appendTo(disCity)
		}
	});
	loadAreaChildren('disCity', 'disCounty')
}

function countyCurrentCallBack(data) {
	var disCounty = $('#disCounty').empty();
	var currentAreaCode = curArea.areaCode;
	data.forEach(function (item) {
		if (item.id === currentAreaCode) {
			$(`<option value ='${currentAreaCode}'>${item.name}</option>`).appendTo(disCounty)
		}
	});
}

