//天地图的地理编码工具类
var TDT = function(tk) {
	this.tk = tk;
}

const FASTTIME = 0; //时间最短
const MINDISTANCE = 1; //路线最短
const NOTFASTROAD = 2; //避开高速
const WALK = 3; //步行

const LAYERTYPE={
	IMAGE:"image",
	IMAGETEXT:"imagetext",
	TERR:"terr",
	TERRTEXT:"terrtext",
	VECTOR:"vector",
	VECTORTEXT:"vectortext"
}

//根据地址信息获取经纬度
TDT.prototype.addressToLonLat = function(address) {
	var param = {
		ds: JSON.stringify({
			"keyWord": address
		}),
		tk: this.tk
	}
	var lonlat = new Array();
	$.ajax({
		async: false,
		type: "get",
		url: 'http://api.tianditu.gov.cn/geocoder',
		dataType: 'json',
		data: param,
		cache: false,
		timeout: 30000,
		success: function(result) {
			if(result.status * 1 === 0) {
				var location = result.location;
				lonlat = [location.lon, location.lat];
			} else {
				lonlat = [0, 0]; //失败
			}
		},
		error: function(e) {
			lonlat = [0, 0];
		}
	})
	return lonlat;
}
/**
 * 根据经纬度获取地址信息
 * @param {Object} lonlat
 */
TDT.prototype.lonLatToAddress = function(lonlat) {
	//http://api.tianditu.gov.cn/geocoder?postStr={'lon':116.37304,'lat':39.92594,'ver':1}&type=geocode&tk=您的密钥
	var param = {
		postStr: JSON.stringify({
			lon: lonlat[0],
			lat: lonlat[1],
			ver: 1
		}),
		type: "geocode",
		tk: this.tk
	}
	var address = "";
	$.ajax({
		async: false,
		type: "get",
		url: 'http://api.tianditu.gov.cn/geocoder',
		dataType: 'json',
		data: param,
		cache: false,
		timeout: 30000,
		success: function(result) {
			if(result.status * 1 === 0) {
				var addInfo = result.result;
				address = addInfo.formatted_address;
			}
		},
		error: function(e) {

		}
	})
	return address;
}
//根据经纬度导航 驾车
TDT.prototype.dirveNavByLonLat = function(start, dest, style) {
	//{"orig":"116.35506,39.92277","dest":"116.39751,39.90854","style":"0"}&
	var url = "http://api.tianditu.gov.cn/drive";
	if(!style) {
		style = 0;
	}
	var param = {
		postStr: JSON.stringify({
			orig: start,
			dest: dest,
			style: style
		}),
		type: "search",
		tk: this.tk
	}

	var result ;
	$.ajax({
		async: false,
		type: "get",
		url: url,
		dataType: 'xml',
		data: param,
		cache: false,
		timeout: 30000,
		success: (data) => {
			result= this.parseNavXml(data);
		},
		error: function(e) {

		}
	})
	return result;

}
//根据经纬度导航 公共交通
TDT.prototype.pubBusNavByLonLat = function(start, dest) {

}

TDT.prototype.parseNavXml = function(xml) {
	var _xml = $(xml);
	var result = $(_xml.find("result")[0]);
	var _simple = $(result.children("simple")[0]);
	var _items = _simple.children("item");
	var lines = new Array();
	_items.each((index, item) => {
		var line = {
			desc: $(item).children("strguide").text(),
			coors: getCoors($(item).children("streetLatLon").text()),
			distance: $(item).children("streetDistance").text()
		}
		lines.push(line);
	});
	var _allDistance = result.children("distance").text(); //全长 公里
	var _duration = result.children("duration").text(); //时长 秒
	var allcoors = getCoors(result.children("routelatlon").text()); //全部路线经纬度

	var rs = {
		coors: allcoors,
		duration: _duration,
		distance: _allDistance,
		lines: lines
	}

	return rs;

}
/**
 * 天地图
 * @param layers
 */
TDT.prototype.createLayer=function(layers){
	if( typeof (layers) ==='string'){
		return this.switchLayer(layers);
	}else if(layers instanceof Array){
		let lts = new Array()
		layers.forEach( (item) =>{
			let layer = this.switchLayer(item);
			if(layer){
				lts.push(layer)
			}
        });
		return lts;
	}else{
		throw '参数错误'
	}




}
TDT.prototype.switchLayer=function (type){
	switch (type) {
		case LAYERTYPE.IMAGE:
			return this.createImageLayer();
			break
		case LAYERTYPE.IMAGETEXT:
			return this.createImageTextLayer();
			break
		case  LAYERTYPE.TERR:
			return this.createTerrLayer();
			break
		case LAYERTYPE.TERRTEXT:
			return this.createTerrTextLayer();
			break
		case LAYERTYPE.VECTOR:
			return this.createVectorLayer();
			break
		case LAYERTYPE.VECTORTEXT:
			return this.createVectorTextLaye();
			break
		default:
			return null;
			break;
    }
}
TDT.prototype.createImageLayer =function(){
	let tk = this.tk ;
    let url=`http://t1.tianditu.com/DataServer?tk=${tk}&T=img_w&x={x}&y={y}&l={z}`;
    let layer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:url
        }),

    });
    layer.set("layerid","baseTextLayer")
    return layer;
}
TDT.prototype.createImageTextLayer = function(){
    let tk = this.tk ;
    let url=`http://t1.tianditu.com/DataServer?tk=${tk}&T=cia_w&x={x}&y={y}&l={z}`;
    let layer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:url
        }),

    });
    layer.set("layerid","baseTextLayer")
    return layer;
}
TDT.prototype.createTerrLayer = function () {
    let tk = this.tk ;
    let url=`http://t1.tianditu.com/DataServer?tk=${tk}&T=ter_w&x={x}&y={y}&l={z}`;
    let layer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:url
        }),

    });
    layer.set("layerid","baseLayer")
    return layer;

}
TDT.prototype.createTerrTextLayer= function () {
    let tk = this.tk ;
    let url=`http://t1.tianditu.com/DataServer?tk=${tk}&T=cta_w&x={x}&y={y}&l={z}`;
    let layer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:url
        }),

    });
    layer.set("layerid","baseTextLayer")
    return layer;

}
TDT.prototype.createVectorLayer= function(){
    let tk = this.tk ;
    let url=`http://t1.tianditu.com/DataServer?tk=${tk}&T=vec_w&x={x}&y={y}&l={z}`;
    let layer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:url
        }),

    });
    layer.set("layerid","baseLayer")
    return layer;

}
TDT.prototype.createVectorTextLaye= function () {
    let tk = this.tk ;
    let url=`http://t1.tianditu.com/DataServer?tk=${tk}&T=cva_w&x={x}&y={y}&l={z}`;
    let layer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:url
        }),

    });
    layer.set("layerid","baseTextLayer")
    return layer;

}
var getCoors = function(coors) {
	var crs = new Array();
	if(coors) {
		var cs = coors.split(";");
		for(var i = 0; i < cs.length; i++) {
			var coor = cs[i];
			var c= coor.split(',');
			if(c.length<2){
				continue;
			}
			crs.push(ol.proj.transform([parseFloat(c[0]),parseFloat(c[1])],"EPSG:4326","EPSG:3857"));
		}
	}
	return crs;
}
var loadXML = function(xmlString) {
	var xmlDoc = null;
	// 判断浏览器的类型
	// 支持IE浏览器
	if(!window.DOMParser && window.ActiveXObject) { // window.DOMParser 判断是否是非ie浏览器
		var xmlDomVersions = [' MSXML.2.DOMDocument.6.0 ', ' MSXML.2.DOMDocument.3.0 ', ' Microsoft.XMLDOM '];
		for(var i = 0; i < xmlDomVersions.length; i++) {
			try {
				xmlDoc = new ActiveXObject(xmlDomVersions[i]);
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString); // loadXML方法载入xml字符串
				break;
			} catch(e) {}
		}
	}
	// 支持Mozilla浏览器
	else if(window.DOMParser && document.implementation && document.implementation.createDocument) {
		try {
			/*  DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
			 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
			 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
			 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
			 */
			domParser = new DOMParser();
			xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
		} catch(e) {}
	} else {
		return null;
	}

	return xmlDoc;
}


