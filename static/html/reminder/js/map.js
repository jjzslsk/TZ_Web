//创建地图
let map;
let stationData;
const elements = ["tempMax","rain",  "tempMin", "pressMax", "pressMin","windx","windy","relhum"];
const elementsConfig={
    rain:{
        "desc":"降雨",
         "unit":"mm"
    },
    tempMax:{
        "desc":"最高温",
         "unit":"℃"
    },
    tempMin:{
        "desc":"最低温",
         "unit":"℃"
    },
    pressMax:{
        "desc":"最大气压",
         "unit":"帕"
    },
    pressMin:{
        "desc":"最小气压",
        "unit":"帕"
    },
    windx:{
        "desc":"最大风速",
        "unit":"m/s"
    },
    windy:{
        "desc":"极大风速",
        "unit":"m/s"
    },
    relhum:{
        "desc":"相对湿度",
        "unit":"%"
    }
}
let elemetIndex = 0;
// $(function(){
//     createMap();
// })
function init() {
    createMap();
    loadBoundaryOut();
    loadBoundary();
    loadData();
}

function createMap() {
    map = new ol.Map({
        target: 'map2',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://t2.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
                }),
                isGroup: true,
                name: '天地图文字标注'
            })
        ],
        controls: [],
        view: new ol.View({
            projection: "EPSG:3857",
            center: ol.proj.transform(config.map.center, "EPSG:4326", "EPSG:3857"),
            zoom: config.map.baseZoom,
            minZoom: config.map.minZoom,
            maxZoom: config.map.maxZoom
        })

    })

}

function loadBoundaryOut() {
    $.ajax({
        url: "../../data/geojson/taizhou.geojson",
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
                style: boundaryOutStyle,
                zIndex: 1000
            });

            vectorLayer.set("layerid", "boundaryOut");
            map.addLayer(vectorLayer);

           vectorLayer.on('prerender', evt => {
           	evt.context.shadowBlur = 20;
           	evt.context.shadowColor = '#08e0a1';
           });
           vectorLayer.on('postrender', evt => {
           	evt.context.shadowBlur = 0;
           	evt.context.shadowColor = '#08e0a1';
           });

        },
        error: function(result) {

        }
    });

}
function boundaryOutStyle(f) {
    const name = f.get("NAME");
    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 3,
            color: "#08e0a1",

        }),
    })
    return style;
}
//加载边界数据
function loadBoundary() {
    $.ajax({
        url: "../../data/geojson/taizhou.json",
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
                zIndex: 1000
            });

            vectorLayer.set("layerid", "boundary");
            map.addLayer(vectorLayer);

           // vectorLayer.on('prerender', evt => {
           // 	evt.context.shadowBlur = 25;
           // 	evt.context.shadowColor = '#01d8e2';
           // });
           // vectorLayer.on('postrender', evt => {
           // 	evt.context.shadowBlur = 0;
           // 	evt.context.shadowColor = '#01d8e2';
           // });

        },
        error: function(result) {

        }
    });

}

function boundaryStyle(f) {
    const name = f.get("NAME");
    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 1,
            color: "#08e0a1",

        }),
    })
    return style;
}

//加载站点数据
function loadData() {
    //var dateTime =$("#dateTime").val();  //$("#dateTime").val();
    //var hours = "2";
    //var param = "?tTime="+dateTime+"&hours="+hours;
    $.ajax({
        url: config.ulr.stationDataUrl,
        //url:main_url + '/ssd-reminder-live-data/gisNHoursStation'+param,
        type: 'get',
        dataType: 'json',
        success: function(res) {
            debugger;
            if (res) {
                stationData = res;
                if (res.stations && res.stations.length > 0) {
                    const param = {
                        x: "Longitude",
                        y: "Latitude"
                    }
                    const pointGeo = pointToGeoJson(res.stations, param);
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(pointGeo, {
                            dataProjection: "EPSG:4326",
                            featureProjection: 'EPSG:3857'
                        })
                    });
                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource,
                        style: stationStyle,
                        zIndex: 1001
                    });
                    vectorLayer.set("layerid", "stationLayer");
                    map.addLayer(vectorLayer);
                  //  addImageLayer();
                    setInterval(()=>{
                        if(elemetIndex<elements.length-1){
                            elemetIndex++;
                        }else{
                            elemetIndex=0;
                        }
                        const oldLayer =getLayerById("stationLayer");
                        if(oldLayer){
                            oldLayer.setStyle(stationStyle);
                        }
                       // addImageLayer();

                    },5000)
                }
            }
        },
    });

}

//
function pointToGeoJson(points, param) {
    const featureCollection = {
        type: "FeatureCollection",
        features: []
    }
    points.forEach(point => {
        const lat = parseFloat(point[param.y]);
        const lng = parseFloat(point[param.x]);
        if (!isNaN(lat) && !isNaN(lng)) {
            const feature = {
                type: "Feature",
                properties: point,
                geometry: {
                    type: "Point",
                    "coordinates": [lng, lat]
                }
            }
            featureCollection.features.push(feature)
        }

    })
    return featureCollection;

}

function stationStyle(f) {
    const element = elements[elemetIndex];
    const value = f.get(element) +" "+ elementsConfig[element].unit;
    const stationName = f.get("stationName")
    const style = new ol.style.Style({
        image: new ol.style.Circle({
        	radius: 3,
        	fill: new ol.style.Fill({
        		color: 'rgba(0,0,255,1)'
        	}),
        }),
        text: new ol.style.Text({
            text:stationName+" "+value,
            font: '12px sans-serif',
            offsetX: 0,
            offsetY: -15,
            placement: 'point',
            backgroundStroke: new ol.style.Stroke({
                color: '#87CEEB',
                width: 1
            }),
            backgroundFill: new ol.style.Fill({
                color: 'rgba(10,69,52,0.8)'
            }),
            fill: new ol.style.Fill({
                color:'rgba(255,255,255,1)',

            })
        })

    });

    return style

}

function addImageLayer() {
    let layerId = "imageLayer";
    const oldLayer = getLayerById(layerId);
    const element = elements[elemetIndex]
    const url = stationData.imgs[element];
    if (oldLayer) {
        oldLayer.setSource(
            new ol.source.ImageStatic({
                crossOrigin: 'anonymous',
                url: url,
                projection: 'EPSG:4326',
                imageExtent: config.extent.elementExtent
            })
        );
    } else {
        let imageLayer = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                crossOrigin: 'anonymous',
                url: url,
                projection: 'EPSG:4326',
                imageExtent: config.extent.elementExtent
            }),
            opacity: 0.8,
            layerid: layerid
        })
        map.addLayer(imageLayer);
    }


}

function getLayerById(layerId) {
    var layerv;
    $.each(map.getLayers().getArray(), function(m, item) {
        if (item.get('layerid') == layerId) {
            layerv = item;
        }
    });
    return layerv;
}
