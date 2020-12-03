import TileLayer from 'ol/layer/Tile'
import GroupLayer from 'ol/layer/Group'
import ImageLayer from 'ol/layer/Image'
import VectorLayer from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import ImageStatic from "ol/source/ImageStatic";
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point'
import {fromLonLat,Projection,transform} from 'ol/proj';
import {Style,Stroke,Text,Fill,Icon} from "ol/style"
import GeoJSON from "ol/format/geoJson";
import TileArcGISRest from 'ol/source/TileArcGISRest'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'

//0表示部署的离线瓦片地图，1表示OSM,2表示使用Arcgis在线午夜蓝地图服务
let streetmap=function(layerType,cloudFigure){
    let mapLayers = []
    let styleVector = new Style({
        fill: new Fill({ //矢量图层填充颜色，以及透明度
          color: 'rgba(255, 255, 255, 0)'
        }),
        stroke: new Stroke({ //边界样式
          color: '',
          width: 2
        }),
        text: new Text({ //文本样式
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: '#000'
          }),
    
          stroke: new Stroke({
            color: '#fff',
            width: 3
          })
        })
      });
    switch(layerType){
        case '0':
            mapLayers[0]=new TileLayer({
                source: new OSM()
            })
        break
        case 'radar':
            mapLayers[0]=new TileLayer({
                source: new XYZ({
                    url:'http://192.168.7.146:6007/offlineMap/tdtSate_%E7%93%A6%E7%89%87%EF%BC%9A%E8%B0%B7%E6%AD%8C/tiles/{z}/{x}/{y}.png'
                })
            })
            // mapLayers[1]=new VectorLayer({
            //     title: "区域线图层",
            //     source: new SourceVector({
            //       url: '../../../../static/data/geojson/taizhou.json',
            //       format: new GeoJSON()
            //     }),
            //     // style: styleVector
            // })

            // var center = transform([121.427506, 28.662316], 'EPSG:4326', 'EPSG:3857');
            // var extent = [
            //     center[0] - 550 * 1000 / 2,
            //     center[1] - 344 * 1000 / 2,
            //     center[0] + 550 * 1000 / 2,
            //     center[1] + 344 * 1000 / 2
            // ];
            // mapLayers[1]=new ImageLayer({
            //     source: new ImageStatic({
            //       url: cloudFigure, // 静态地图
            //       imageExtent: extent          //映射到地图的范围
            //   })
            // })

        break
        case 'cloud':
            mapLayers[0]=new TileLayer({
                // source:new TileArcGISRest({
                //     url:'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
                // })
                source: new XYZ({
                    // url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d0cf74b31931aab68af181d23fa23d8d"
                    // url:  "http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d0cf74b31931aab68af181d23fa23d8d"
                    // url: "http://t4.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=d0cf74b31931aab68af181d23fa23d8d"
                       url: 'http://t2.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'

                })
                // source: new OSM()
            })
            mapLayers[1]=new VectorLayer({
                title: "区域线图层",
                source: new SourceVector({
                  url: '../../../../static/data/geojson/taizhou.json',
                  format: new GeoJSON()
                }),
                style: styleVector
            })
            mapLayers[2]=new VectorLayer({
                title: "省边界",
                source: new SourceVector({
                  url: '../../../../static/data/geojson/taizhou/sheng.geojson',
                  format: new GeoJSON()
                }),
            })

            // 新建图层，用于标记中心点
            // let center_point = fromLonLat([121.427506, 28.662316], 'EPSG:4326', 'EPSG:3857');
            // let locationLayer = new VectorLayer();
            // let locationVector = new SourceVector();
            // locationLayer.setSource(locationVector);
            // // openlayers点对象
            // let locationPoint = new Point(center_point);
            // let locationFeature = new Feature();
            // // 设置几何图形
            // locationFeature.setGeometry(locationPoint);
            // // 设置图层属性
            // locationVector.addFeature(locationFeature);
            // // style样式的使用，icon图标
            // let centerPointStyle = new Style({
            //     image: new Icon({
            //         src: cloudFigure,
            //         scale: 0.3,
            //         anchor: [0.5, 1],
            //         zoom: 8.5,
            //     }),
            // });
            // locationLayer.setStyle(centerPointStyle);
            // mapLayers[3]= locationLayer

            var center = transform([121.427506,28.662316], 'EPSG:4326', 'EPSG:3857');
            var extent = [
                center[0] - 550 * 1000 / 2,
                center[1] - 344 * 1000 / 2,
                center[0] + 550 * 1000 / 2,
                center[1] + 344 * 1000 / 2
            ];
            console.log(extent)
            // var extent = [100, 100, 418, 600];
            //       var projection = new Projection({
            //         code: 'xkcd-image',
            //         units: 'pixels',
            //         extent: extent
            //       });
            //加载静态图层
              mapLayers[3]= new ImageLayer({
                  source: new ImageStatic({
                      url: cloudFigure, // 静态地图
                      imageExtent: extent,          //映射到地图的范围
                      projection: projection,
                  })
              })



        break
    }
    return mapLayers
}

let mapConfig = {
    x: 121.427506,     
    y: 28.662316,
    zoom: 8.5,          
    streetmap: streetmap
}

export default mapConfig