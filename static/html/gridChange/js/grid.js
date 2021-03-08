var globalFlag = {
    currentType: 't639_999',
    currentFType: '999',
    showGridValue: true,
    showGrid: true,
    showBaseArea: true,
    currentDate: '2017/01/01',
    currentLimit: '024',
    releaseTime: '08'
};
function showGridInMap(result,layerId,type){
    let rawData = result.data.data;
    var w = result.data.xspan;
    var h = result.data.yspan;
    let data = [];
    let data1 = [];
    $.each(rawData, function(m, point) {
        //生成格点的点集合
        data_point = {};
        data_point.longitude = point[0];
        data_point.latitude = point[1];
        data_point.value = point[2].toFixed(2);
        data.push(data_point);
    });
    // for(let i=0;i<rawData.length;i++){
    //     i++;
    //     let data_point = {};
    //     data_point.longitude = rawData[i][0];
    //     data_point.latitude = rawData[i][1];
    //     data_point.value = rawData[i][2].toFixed(2);
    //     data1.push(data_point);
    // }
	let style;
	var polygons = pointToPolygonGeoJSON(data, 'longitude', 'latitude', w, h);
	if(type=='line'){
	    style = getGridtext;
	}else if(type=='polygon'){
	    style = getGridPolygon;
	}else if(type=='point'){
		style = getGridPoint;
		polygons = data;
	}
    var features = (new ol.format.GeoJSON()).readFeatures(polygons, {
        dataProjection: config.dataProjection,
        featureProjection: config.mapProjection
    });
    var vectorSource = new ol.source.Vector({
        features: features
    });
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: style,
    });
    vectorLayer.set("layerid", layerId);
    vectorLayer.setZIndex(20);
    var oldLayer=ol3_layerHelper.getLayerById(map,layerId);
    if(oldLayer){
        map.removeLayer(oldLayer);
    }
    map.addLayer(vectorLayer);
}
/**
 * 点json转换为多边形格子
 * @param {Object} raw
 * @param {Object} lon
 * @param {Object} lat
 * @param {Object} w
 * @param {Object} h
 */
function pointToPolygonGeoJSON(raw, lon, lat, w, h) {
    if(!w) {
        var w = 1;
    }
    if(!h) {
        var h = 1;
    }
    var geoObj = {
        "type": "FeatureCollection",
        "features": []
    };
    for(var i = 0; i < raw.length; i++) {
        var f = {
            "type": "Feature",
            "properties": {},
            "geometry": {}
        };
        var g = {
            "type": "Polygon",
            "coordinates": [
                [
                    [raw[i][lon] - w / 2, raw[i][lat] + h / 2],
                    [raw[i][lon] - w / 2, raw[i][lat] - h / 2],
                    [raw[i][lon] + w / 2, raw[i][lat] - h / 2],
                    [raw[i][lon] + w / 2, raw[i][lat] + h / 2],
                    [raw[i][lon] - w / 2, raw[i][lat] + h / 2]
                ]
            ]

        };
        f.geometry = g;
        for(var key in raw[i]) {
            f.properties[key] = raw[i][key];
        }
        var l = raw[i][lon] - w / 2;
        var r = raw[i][lon] + w / 2;
        var t = raw[i][lat] + h / 2;
        var b = raw[i][lat] - h / 2;
        if(l > -180 && r > -180 && l < 180 && r < 180 && t > -90 && b > -90 && t < 90 && b < 90) {
            geoObj.features.push(f);
        }

    }
    return geoObj;
}
function getGridPolygon(f){
    var v = f.get('value');
    var style;
    // let color = getFeatureColor(parseFloat(v));
    let color;
    let colorLegend = config.render['temp'];
    for(var i=0;i<colorLegend.length;i++){
        var cp= colorLegend[i];
        var colors = cp.color;
        //-30,-28,"#071E78"
        var cs = colors;
        if("min"==cs[0] &&   parseFloat(v)<=parseFloat(cp.value)) {
            color=cs[2];
            break;
        }else if("max"==cs[1] &&parseFloat(v) >=parseFloat(cp.value) ){
            color=cs[2];
            break
        } else if(parseFloat(v)>=parseFloat(cs[0]) && parseFloat(v)<parseFloat(cs[1])){
            color= cs[2];
            break;
        }
    }
    let colorRgba = colorRgb(color,'0.6');
    if(map.getView().getZoom()>=10){
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width:1,
                color:'rgba(255,255,255,0.3)',

            }),
            fill: new ol.style.Fill({
                color: colorRgba
            }),
            // text: getTextStyle()
        })
    }else{
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width:1,
                color:'rgba(255,255,255,0.3)'
            }),
            fill: new ol.style.Fill({
                color: colorRgba
            })
        })
    }
    function getTextStyle() {
        //if(!globalFlag.showGridValue || map.getView().getZoom() < 8) {
        if(!globalFlag.showGridValue) {
            return false;
        } else {
            return new ol.style.Text({
                text: v.toString(),
                fill: new ol.style.Fill({
                    color: '#bbb'
                })
            })
        }
    }

    return style;
}
function getGridtext(f){
    var v = f.get('value');
    var style;
    let color = getFeatureColor(parseFloat(v));
    if(map.getView().getZoom()>=10){
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width:1,
                color:'rgba(255,255,255,0.3)',

            }),
            // fill: new ol.style.Fill({
            //     color: color
            // }),
            text: getTextStyle()
        })
    }else{
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                width:1,
                color:'rgba(255,255,255,0.3)'
            }),
            // fill: new ol.style.Fill({
            //     color: color
            // })
        })
    }
    function getTextStyle() {
        //if(!globalFlag.showGridValue || map.getView().getZoom() < 8) {
        if(!globalFlag.showGridValue) {
            return false;
        } else {
            return new ol.style.Text({
                text: v.toString(),
                fill: new ol.style.Fill({
                    color: '#bbb'
                })
            })
        }
    }

    return style;
}
function getGridPoint(f){
	var v = f.get('value');
	var style;
	let color = getFeatureColor(parseFloat(v));
	if(map.getView().getZoom()>=10){
	    style = new ol.style.Style({
	        stroke: new ol.style.Stroke({
	            width:1,
	            color:'rgba(255,255,255,1)',
	
	        }),
	        // fill: new ol.style.Fill({
	        //     color: color
	        // }),
	        text: getTextStyle()
	    })
	}else{
	    style = new ol.style.Style({
	        stroke: new ol.style.Stroke({
	            width:1,
	            color:'rgba(255,255,255,1)'
	        }),
	        // fill: new ol.style.Fill({
	        //     color: color
	        // })
			text: getTextStyle()
	    })
	}
	function getTextStyle() {
	    //if(!globalFlag.showGridValue || map.getView().getZoom() < 8) {
	    if(!globalFlag.showGridValue) {
	        return false;
	    } else {
	        return new ol.style.Text({
	            text: v.toString(),
	            fill: new ol.style.Fill({
	                color: '#000'
	            }),
				font: 'normal 300 13px sans-serif '
	        })
	    }
	}
	
	return style;
}
/*根据值获取要素颜色*/
function getFeatureColor(val) {
    var rendercolor = config.render['rain'];
    var color = '#000';
    //val = accMul(Math.floor(accMul(val, 100)), 0.01);
    $.each(rendercolor, function(index, data) {
        if(data["color"][0] == 'min' && val < data["color"][1] || data["color"][1] == 'max' && val >= data["color"][0] || val < data["color"][1] && val >= data["color"][0]) {
            color = data["color"][2];
        }
    });
    return color;
}
function colorRgb(str,opacity){
    var sColor = str.toLowerCase();
    if(sColor){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "rgba(" + sColorChange.join(",")+","+opacity + ")";
    }else{
        return sColor;
    }
};