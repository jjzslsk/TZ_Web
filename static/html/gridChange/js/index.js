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
	init();
	initBoundary();
	loadGridData();
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
function loadGridData(){
	$.ajax({
		type:'get',
		url:'./data/data.json',
		success:function(result){
			// showGridInMap(result,'qpfGridLayer','point');
			var data = result.data.data;
			var points = new Array(); //生成格点色斑图，需要的点
			let data1 = [];
			nx = result.data.nx;
			ny = result.data.ny;
			xspan = result.data.xspan;
			yspan = result.data.yspan;
			startX = result.data.startX;
			startY = result.data.startY;
			endX = result.data.endX;
			endY = result.data.endY;
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
        url:"data/tzxz.json",
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
			if(f.get('lastValue')){
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
		$.ajax({
			url:"",
			type:'post',
			data:{
				jsonStr:JSON.stringify(arr)
			},
			success:function(result){
				if(result){
					alert('处理成功');
				}else{
					alert('处理失败');
				}
			}
		})
	}
}