/*
 *这是通用配置js
 *author:crx
 *date:2019/09/18
*/
import { gisApi, RealTimeMonitoringApi, TheProductMadeApi, DataForecastApi } from '@/api'
import ol from "openlayers";
// 通用地图
const centerMap = (vm, mapId, layer) => {
    vm.mapArr().map(m => {
        let p = {
            vm,
            id: m.value,
            projection: 'EPSG:4326',
            center: [108.7175, 21.52525],
            zoom: 9,
            // 限制地图缩放最大级别为14，最小级别为10
            minZoom: 0,
            maxZoom: 50,
            layer
        }
        if (m.value !== 'lvgMap') {
            // p = Object.assign(p,{layer:[]});
            p.zoom = 6;
            p.center = [108.1175, 21.57525];
        }
        if (mapId === 'lvgMap_Data') { // 数值预报用到
            p.center = [108.0175, 20.82525]
        }
        vm.createMap(p);
    })
}
// 右侧副地图
const centerRightMap = vm => {
    vm.GridSource().map(m => {
        let p = {
            vm,
            id: m.value,
            projection: 'EPSG:4326',
            center: [108.1175, 21.27525],
            zoom: 7,
            minZoom: 0,
            maxZoom: 15,
            layer: []
        }
        // if(m.value !== 'lvgMap'){
        //     //p = Object.assign(p,{layer:[]});
        //     p.zoom = 6;
        //     p.center = [108.1175,21.57525];
        // }
        vm.createMap(p);
    })
}
const mainMap = (vm, layer) => {
    let p = {
        vm,
        id: 'MianMap',
        projection: 'EPSG:4326',
        center: [108.7175, 21.07525],
        zoom: 9,
        // 限制地图缩放最大级别为14，最小级别为10
        minZoom: 0,
        maxZoom: 50,
        layer: layer
    }
    vm.createMap(p);
}

// 北海附近海域
async function getBeihaiSea(vm, mapId) {
    let textAnnotation = [
        {text: '北\n海\n附\n近\n海\n域', coordinate: [109.02, 20.92]},
        {text: '钦\n州\n附\n近\n海\n域', coordinate: [108.65, 20.92]},
        {text: '防\n城\n港\n附\n近\n海\n域', coordinate: [107.75, 20.87]}
    ]
    try {
        textAnnotation.map(t => {
            vm.layers['SeaLayer'].getSource().addFeature(vm.textAnnotationFeature({
                text: t.text,
                coordinate: t.coordinate
            }));
        })
    } catch (e) {

    } finally {

    }
}

// 各地区、海区边界
async function getGXLayer(p) {
    let {vm, mapId, l, i, zIndex, btColor} = p, Countyfeatures = [];
    vm.removeLayer({vm, mapId, layerId: `GX${l}Layer` });
    try {
        vm.SHOW_LOADING();
        let data = await gisApi.getGXGeojson({url: l});
        if (l === 'gxCounty') { // 只要北海市 防城港市 钦州市  合浦县的县级geojson
            data.features.map(item => {
                let n = item['properties']['NAME'];
                if (n === '北海市' || n === '防城港市' || n === '钦州市' || n === '合浦县' || n === '上思县' || n === '东兴市' || n === '灵山县' || n === '浦北县') { // 获取城市的的geojson
                    Countyfeatures.push(item)
                }
            })
            data = {"type": "FeatureCollection", "features": Countyfeatures};
        }
        vm.layers[`GX${l}Layer`] = vm.createLayer({
            vm,
            geojson: data,
            layerId: `GX${l}Layer`,
            layerCaption: `广西${l}边界`,
            zIndex: zIndex || 10,
            // lineDash: [1, 1],
            // strokeColor: 'rgba(0,0,0,01)',
            // fillColor: 'rgba(255,255,255,0.1)',
            // strokeWidth: 3-i,
            // NOTE: ref:code GXLayerColorStyle
            style: f => {
                let name = f.get("NAME") || '';// 地区名称
                let style = [];
                switch (l) {
                    case 'sea':
                        style = new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: l === 'sea' || !btColor ? 'rgba(255, 255, 255, 0)' : "rgba(255, 255, 255, 1)"
                            }),
                            stroke: new ol.style.Stroke({
                                color: l === 'sea' || l === 'nanhai' || l === 'seaAreaPolyline' ? '#1b69d3' : "#999",
                                width: (name === '防城港市' || name === '钦州市' || name === '北海市' || name === '合浦县' ? 3 : 1)
                                // width: (l === 'gxCounty' ?  name === '防城港市' ||  name === '钦州市' ||  name === '北海市' ||  name === '合浦县' ? 3 : 0 : 1)
                            })
                        })
                        break;
                    case 'sea-area':
                        style = new ol.style.Style({
                            text: new ol.style.Text({
                                text: name,
                                font: "bold 15px 微软雅黑",
                                scale: 1,
                                rotateWithView: true,
                                textBaseline: "top",
                                textAlign: "center",
                                fill: new ol.style.Fill({
                                    color: l === 'sea-area' || l === 'nanhai' || l === 'seaAreaPolyline' ? '#1b69d3' : "#999"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "#fff",
                                    width: 1
                                })
                            })
                        })
                        break;
                    default:
                        style = new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: l === 'sea' || !btColor ? 'rgba(255, 255, 255, 0)' : "rgba(255, 255, 255, 1)"
                            }),
                            stroke: new ol.style.Stroke({
                                color: l === 'sea' || l === 'nanhai' || l === 'seaAreaPolyline' ? '#1b69d3' : "#999",
                                width: (name === '防城港市' || name === '钦州市' || name === '北海市' || name === '合浦县' ? 3 : 1)
                                // width: (l === 'gxCounty' ?  name === '防城港市' ||  name === '钦州市' ||  name === '北海市' ||  name === '合浦县' ? 3 : 0 : 1)
                            }),
                            text: new ol.style.Text({
                                text: l === 'dny' ? f.get("COUNTRY") : name,
                                font: "bold 15px 微软雅黑",
                                scale: 1,
                                rotateWithView: true,
                                textBaseline: "top",
                                textAlign: "center",
                                fill: new ol.style.Fill({
                                    color: l === 'sea' || l === 'nanhai' || l === 'seaAreaPolyline' ? '#1b69d3' : "#999"
                                }),
                                stroke: new ol.style.Stroke({
                                    color: "#fff",
                                    width: 1
                                })
                            })
                        })
                }
                return style
            }
        })
        vm.maps[mapId].addLayer(vm.layers[`GX${l}Layer`]);
        if (vm.maps['EcMap'])vm.maps['EcMap'].addLayer(vm.layers[`GX${l}Layer`]);
        if (vm.maps['ec'])vm.maps['ec'].addLayer(vm.layers[`GX${l}Layer`]);
        if (vm.maps['gergrid'])vm.maps['gergrid'].addLayer(vm.layers[`GX${l}Layer`]);
        if (vm.maps['jpgrid'])vm.maps['jpgrid'].addLayer(vm.layers[`GX${l}Layer`]);
    } catch (e) {
        console.log(e);
    } finally {
        vm.HIDE_LOADING();
    }
}

// 航线-样式设置、图层、数据
const setSeaStyle = f => {
    let styles = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0)"
            }),
            stroke: new ol.style.Stroke({
                color: '#026fc2', // '#026fc2',
                width: 3,
                miterLimit: 0,
                lineDash: [7, 7, 7, 7],
                lineCap: 'dotted'
            })
        })
    ]

    let coordinates = f.getGeometry().getCoordinates(); // 获取航线锚点坐标组
    // f.getGeometry().forEachSegment((s,e) => {   //航线 头尾设置样式
    //     let dx = e[0] - s[0];
    //     let dy = e[1] - s[1];
    //     let rotation = Math.atan2(dy, dx);
    //     styles.push(new ol.style.Style({
    //         geometry: new ol.geom.Point(e),
    //         image: new ol.style.Icon({
    //             src: '../../static/images/up.png',
    //             scale:0.6,
    //             rotateWithView: false,
    //             rotation: -rotation
    //         }),
    //     }))
    //     styles.push(new ol.style.Style({
    //         geometry: new ol.geom.Point(s),
    //         image: new ol.style.Circle({
    //             radius: 6,
    //             fill: new ol.style.Fill({
    //                color: 'rgb(61, 182, 66)'
    //             }),
    //             // stroke: new ol.style.Stroke({
    //             //     color : '#8a8a8a',
    //             //     width: 2
    //             // }),
    //         }),
    //     }))
    // })
    // styles.push(new ol.style.Style({   //终点添加航线名称
    //     geometry: new ol.geom.Point(coordinates[coordinates.length - 1]),
    //     text:new ol.style.Text({
    //         text: '',
    //         font: " 15px sans-serif,微软雅黑",
    //         offsetX:f.get('name').length * 7,
    //         offsetY:10,
    //         fill:new ol.style.Fill({
    //             color : '#8a8a8a'
    //         })
    //     })
    // }));
    // return styles

    coordinates.map((e, i) => {
        let color = '';
        switch (i) {
            case 0 : // 起点
                color = 'rgb(61, 182, 66)';
                break;
            case coordinates.length - 1 : // 终点
                color = 'red';
                break;
            default :
                color = 'blue';
                break;
        }

        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(e),
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color
                })
            })
        }));
    })
    return styles
}
const setSeaStylePoint = f => {
    const styles = [];

    let color
    if (f.get('first')) {
        color = 'rgb(61, 182, 66)';
    } else if (f.get('last')) {
        color = 'red';
    } else {
        color = 'blue';
    }

    styles.push(new ol.style.Style({
        // geometry: new ol.geom.Point(f),
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color
            })
        })
    }));

    const prev = f.get('prev');

    if (prev) {
        styles.push(
            new ol.style.Style({
                // geometry: new ol.geom.LineString([new ol.proj.transform(prev.geometry.coordinates, 'EPSG:4326', 'EPSG:3857'), f.getGeometry().getCoordinates()]),
                geometry: new ol.geom.LineString([prev.getGeometry().getCoordinates(), f.getGeometry().getCoordinates()]),
                fill: new ol.style.Fill({
                    color: "rgba(255, 255, 255, 0)"
                }),
                stroke: new ol.style.Stroke({
                    color: '#026fc2', // '#026fc2',
                    width: 3,
                    miterLimit: 0,
                    lineDash: [7, 7, 7, 7],
                    lineCap: 'dotted'
                })
            })
        );
    }
    console.log('setSeaStylePoint', styles);
    return styles
}
const SeaRouteScale = p => {
    let {f, flag} = p, styles = [];
    if (!f) return false;
    styles = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255, 0)"
            }),
            stroke: new ol.style.Stroke({
                color: '#026fc2', // '#026fc2',
                width: flag ? 6 : 3,
                miterLimit: 0,
                lineDash: [7, 7, 7, 7],
                lineCap: 'dotted'
            })
        })
    ]
    let coordinates = f.getGeometry().getCoordinates(); // 获取航线锚点坐标组
    coordinates.map((e, i) => {
        let color = '';
        switch (i) {
            case 0 : // 起点
                color = 'rgb(61, 182, 66)';
                break;
            case coordinates.length - 1 : // 终点
                color = 'red';
                break;
            default :
                color = 'blue';
                break;
        }

        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(e),
            image: new ol.style.Circle({
                radius: flag ? 8 : 6,
                fill: new ol.style.Fill({
                    color
                })
            })
        }));
    })
    f.setStyle(styles)
}
const getSeaRouteGather = p => {
    let {vm, mapId, SeaRoutes} = p;
    let data = SeaRoutes || [
        [
            {lon: 109.04803, lat: 21.05030}, {lon: 109.05029, lat: 21.03432}, {lon: 109.06779, lat: 21.22831}, {lon: 109.07208, lat: 21.24303}
        ],
        [
            {lon: 109.06421, lat: 21.01083}, {lon: 109.06779, lat: 21.22831}, {lon: 109.07208, lat: 21.24303},
            {lon: 109.08214, lat: 21.00667}, {lon: 109.09500, lat: 21.03000}
        ]
    ];
    try {
        vm.SHOW_LOADING();
        const layers = vm.layers
        data.map((d, i) => {
            console.log('SeaRoutes${i+1}', `SeaRoutes${i + 1}`)
            vm.removeLayer({vm, mapId, layerId: `SeaRoutes${i + 1}` });
            let geojson = vm.dataToLineGeoJson_New(d, "lon", "lat", 'hx');
            let geojsonPoint = vm.pointToGeoJson(d, "lon", "lat");
            vm.SeaRouteLId.push(`SeaRoutes${i + 1}`);

            const layer = layers[`SeaRoutes${i + 1}`] = vm.createLayer({
                vm,
                geojson,
                layerId: `SeaRoutes${i + 1}`,
                // layerCaption: `航线${i+1}`,
                layerCaption: d[0].name,
                zIndex: 14,
                style: setSeaStyle
            })
            layer.set('geojsonPoint', geojsonPoint)

            vm.maps[mapId].addLayer(layers[`SeaRoutes${i + 1}`]);
            if (vm.maps['ec'])vm.maps['ec'].addLayer(vm.layers[`SeaRoutes${i + 1}`]);
            if (vm.maps['gergrid'])vm.maps['gergrid'].addLayer(vm.layers[`SeaRoutes${i + 1}`]);
            if (vm.maps['jpgrid'])vm.maps['jpgrid'].addLayer(vm.layers[`SeaRoutes${i + 1}`]);
        })
        layers[`SeaModifyRoutes`] = vm.createLayer({
            vm,
            source: new ol.source.Vector(),
            layerId: `SeaModifyRoutes`,
            zIndex: 14,
            style: setSeaStylePoint
        })
        vm.maps[mapId].addLayer(layers[`SeaModifyRoutes`]);
        vm.$emit('gotRouteLayers', layers)
    } catch (e) {
        console.log('getSeaRoutes=>', e)
    } finally {
        vm.HIDE_LOADING();
    }
}
async function getSeaRoutes(p) {
    let {vm, mapId, roleNames} = p, SeaRoutes = [];
    try {
        // vm.SHOW_LOADING();
        const data = await TheProductMadeApi.getSeaRouteGather({roleNames: '北海,钦州'});
        if (data.success) {
            if (data.data.length) {
                data.data.map(s => {
                    s.points = s.points.map(p => {
                        p.name = s.name;
                        p.content = '';
                        vm.apsShortData.list.map(l => { // 对上短临
                            if (p.lon == l.lon && p.lat == l.lat && p.name == l.name) {
                                p.content = l.content;
                            }
                        })
                        return p
                    });
                    SeaRoutes.push(s.points);
                })
                getSeaRouteGather({vm, mapId, SeaRoutes}); console.log('SeaRoutes===>', SeaRoutes)
            } else {
                vm.$message({ type: 'warning', message: `暂无航线数据！` });
            }
        } else {
            vm.$message({ type: 'warning', message: `获取航线数据接口失败！` });
        }
    } catch (e) {
        console.log('getSeaRouteGather=>', e);
        vm.$message({ type: 'warning', message: `获取航线数据接口异常！` });
    } finally {
        // vm.HIDE_LOADING();
    }
}

// 港口
const getPortGather = p => {
    let {vm, mapId, data} = p;
    vm.removeLayer({vm, mapId, layerId: 'PortLayer' });
    vm.layers['PortLayer'] = vm.createLayer({
        vm,
        geojson: vm.pointToGeoJson(data, "lon", "lat"),
        layerId: 'PortLayer',
        layerCaption: '港口',
        zIndex: 21,
        style: f => {
            // return vm.styleCircleNew({
            //     radius: 5.5,
            //     FillColor:'#026fc2',
            //     offsetX:0,
            //     offsetY:18,
            //     TextFillColor:'#333',
            //     text : f.get('name'),
            // })
            return vm.styleStyle({
                src: '../../static/images/houtai.png',
                scale: 0.8,
                offset: [0, 0],
                offsetX: 0,
                offsetY: 25,
                text: f.get('name')
            })
        }
    })
    vm.maps[mapId].addLayer(vm.layers['PortLayer']);
    if (vm.maps['ec'])vm.maps['ec'].addLayer(vm.layers[`PortLayer`]);
    if (vm.maps['gergrid'])vm.maps['gergrid'].addLayer(vm.layers[`PortLayer`]);
    if (vm.maps['jpgrid'])vm.maps['jpgrid'].addLayer(vm.layers[`PortLayer`]);
}
async function getPort(p) {
    let {vm, mapId, roleNames} = p;
    try {
        vm.SHOW_LOADING();
        const data = await TheProductMadeApi.getPortGather({roleNames: '北海,钦州'});
        if (data.success) {
            if (data.data.length) {
                data.data = data.data.map(d => { // 对上短临数据
                    d.content = '';
                    vm.apsShortData.list.map(l => {
                        if (d.lon == l.lon && d.lat == l.lat) {
                            d.content = l.content;
                        }
                    })
                    return d;
                })
                getPortGather({vm, mapId: 'lvgMap', data: data.data});
            } else {
                vm.$message({ type: 'warning', message: `暂无港口数据！` });
            }
        } else {
            vm.$message({ type: 'warning', message: `获取港口数据接口失败！` });
        }
    } catch (e) {
        console.log('getSeaRouteGather=>', e);
        vm.$message({ type: 'warning', message: `获取港口数据接口异常！` });
    } finally {
        vm.HIDE_LOADING();
    }
}

// 获取航线 港口 海区短临数据
async function getShortImminentData(p) {
    let {vm, roleNames} = p;
    try {
        vm.SHOW_LOADING();
        const data = await DataForecastApi.getShortImminentData({roleNames});
        if (!vm.customPrompt({data, vm, msg: '短临数据'})) return false;
        vm.apsShortData.list = data.data;
    } catch (e) {
        console.log('getShortImminentData=>', e)
    } finally {
        vm.HIDE_LOADING()
    }
}

// 景点
async function getScenic(p) {
    let {vm, mapId, roleNames} = p;
    try {
        vm.SHOW_LOADING();
        const data = await TheProductMadeApi.getScenic({roleNames});
        if (!vm.customPrompt({data, vm, msg: '景点'})) return false;
        vm.layers['AttractionsLayers'] = vm.createLayer({
            vm,
            geojson: vm.pointToGeoJson(data.data, "longitude", "latitude"),
            layerId: 'AttractionsLayers',
            layerCaption: `所有景点图层`,
            zIndex: 15,
            style: f => {
                return vm.styleStyle({
                    src: '../../static/images/jingdian.png',
                    scale: 0.7,
                    offset: [0, 0],
                    offsetX: 0,
                    offsetY: 25,
                    text: f.get('scenicName')
                })
            }
        })
        vm.maps[mapId].addLayer(vm.layers['AttractionsLayers']);
    } catch (e) {
        console.log('getScenic=>', e)
    } finally {
        vm.HIDE_LOADING();
    }
}

// 修改省边界的颜色以及区名{color:边界颜色，isShowMapPlaceName:是否显示区名，}
const editGXLayerColor = p => {
    // NOTE: ref:code GXLayerColorStyle
    let {vm, l, color, isShowMapPlaceName} = p;
    if (vm.layers[`GX${l}Layer`]) {
        if (vm.layers[`GX${l}Layer`].getSource().getState() === 'ready') { // 判定是否加载完成
            vm.layers[`GX${l}Layer`].setStyle(f => {
                let name = f.get("NAME") || '';// 地区名称
                return new ol.style.Style({
                    fill: window.hasColor ? null : new ol.style.Fill({
                        color: l === 'sea' || l === 'sea-area' || (color == '#1b69d3' || color == '#fcbe02') ? 'rgba(255, 255, 255, 0)' : "rgba(255, 255, 255, 1)"
                    }),
                    stroke: l === 'sea-area' ? null : new ol.style.Stroke({
                        color: l === 'sea' || l === 'sea-area' || l === 'nanhai' || l === 'seaAreaPolyline' ? (color == '#fcbe02' ? '#fcbe02' : '#1b69d3') : color || 'rgba(0, 0, 0, 1)',
                        width: name === '防城港市' || name === '钦州市' || name === '北海市' || name === '合浦县' ? 3 : 1
                    }),
                    text: l === 'sea' ? null : new ol.style.Text({
                        text: isShowMapPlaceName ? l === 'dny' ? f.get("COUNTRY") : name : '',
                        font: "bold 16px 微软雅黑",
                        scale: 1,
                        rotateWithView: true,
                        textBaseline: "center",
                        textAlign: "center",
                        fill: new ol.style.Fill({
                            color: l === 'sea' || l === 'sea-area' || l === 'nanhai' || l === 'seaAreaPolyline' ? (color == '#fcbe02' ? '#fcbe02' : '#1b69d3') : color || 'rgba(0, 0, 0, 1)'
                        })

                    })
                })
            })
        }
    }
}
// 获取某些layerId的图层
const getLayersByIds = ({vm, ids}) => {
    return vm.maps.lvgMap.getLayers().getArray().filter((layer) => ids.includes(layer.get('layerId')));
}
// 根据是否有色斑图修改省边界的填充 ,hasColor 是否有色斑图
const editGXLayerWithHasColor = ({vm, hasColor}) => {
    window.hasColor = hasColor;
    // ["TianDiTraffic", "TianDiTrafficInfo", "GXdnyLayer"].forEach(e => {
    //     const layer = vm.layers[e];
    //     if (layer) {
    //         layer.setVisible(!hasColor)
    //     }
    // });
    // vm.maps.lvgMap.getLayers().getArray().forEach(layer => {
    //     if (["TianDiTraffic", "TianDiTrafficInfo", "GXdnyLayer"].includes(layer.get('layerId'))) {
    //         layer.setVisible(!hasColor)
    //     }
    // })
    getLayersByIds({vm, ids: ["TianDiTraffic", "TianDiTrafficInfo"]}).forEach(layer => {
        layer.setVisible(!hasColor)
    })
    const view = vm.maps.lvgMap.getView()

    const center = view.getCenter();
    view.setCenter([center[0], center[1] + 10]);
}

// 雷达图层
const RadarLayer = P => {
    let {vm, path} = P, vmm = vm.$parent;
    vm.selectLegendColor = vm.getMapLegend('RadarReal'); // 选中色带
    vm.layers['radar'] = vm.createImageLayer({
        vm,
        url: path,
        projection: 'EPSG:4326',
        imageExtent: [102.0, 19.0, 114.0, 28.0],
        zIndex: 10,
        layerId: 'radar'
    });
    // vm.InteractionDraw({vm, imageExtent: [102.0, 19.0, 114.0, 28.0]}); // 雷达绘制直线
}

// 海雾图层
const FogLayer = P => {
    let {vm, path} = P, vmm = vm.$parent;
    vm.selectLegendColor = vm.getMapLegend('FogReal'); // 选中色带
    vm.layers['fog'] = vm.createImageLayer({
        vm,
        url: path,
        projection: 'EPSG:4326',
        imageExtent: [100.0, 18.0, 117.0, 27.0],
        zIndex: 10,
        layerId: 'fog'
    });
}

// 云图图层
const SatelliteImgLayer = (vm, path, gxCoordinates) => {
    console.log('云图', path)
    vm.checkCloudLive = true;
    vm.checkFogLive = true;
    vm.layers['cloud'] = vm.createImageLayer({
        vm,
        url: path,
        projection: 'EPSG:4326',
        // imageExtent: [72.0, 17.0, 136.0, 54.0],
        imageExtent: window.globalConfig.imageExtentOfCloud,
        zIndex: 9,
        layerId: 'cloud'
    });
    vm.layers['cloudFog'] = vm.createImageLayer({
        vm,
        url: path,
        projection: 'EPSG:4326',
        imageExtent: [72.0, 17.0, 136.0, 54.0],
        zIndex: 9,
        layerId: 'cloudFog'
    });
    // vm.layers['cloud'].getSource().addFeature(vm.gxbj({
    //     vm,
    //     coordinate:gxCoordinates
    // }))
    // vm.gxbj({  //广西边界
    //     vm,
    //     coordinate:gxCoordinates
    // })
}

// 预警Overlay
const WarningRangeOverlay = P => {
    let {vm, data, target} = P, points = [], scopes = [];
    data.map(item => {
        points.push(
            [parseFloat(item.longitud), parseFloat(item.latitude)]
        )
        scopes.push([item.red_circle_range * 1150, item.yellow_circle_range * 1150, item.blue_circle_range * 1150]);
    })
    console.log(scopes)
    let p = {
        vm,
        mapId: 'lvgMap',
        overlayPosition: points,
        target,
        type: 'single'
    };
    vm.overlays[target] = vm.addOverlay(p);
}

// 预警范围Feature
const WarningRangeeFeature = P => {
    let {vm, data} = P, points = [], scopes = [];
    data.map(item => {
        points.push(
            [parseFloat(item.longitud), parseFloat(item.latitude)]
        )
        scopes.push([item.red_circle_range * 1110, item.yellow_circle_range * 1110, item.blue_circle_range * 1110]);
    })
    let f = vm.addCircleFeatureLayer({
        vm,
        center: points, // 中心坐标
        scopes, // 范围
        strokeColor: ['red', 'yellow', 'blue'],
        fillColor: 'rgba(0,0,255,0.1)'
    });
    return f;
}

// Popup相关对象 主要用于站点指针移动事件
const Popup_Obj = () => ({
    showPopup: false, // Popup弹窗标记
    PopupPixel: {left: 0, top: 0}, // Popup列表位置left top
    showPopup2: false, // Popup弹窗标记
    PopupPixel2: {left: 0, top: 0}, // Popup列表位置left top
    showPopup3: false,
    PopupData: [], // 实况列表数据
    WarningSignsData: [], // 预警信号数据
    InitShortImminentData: [], // 短临页面初始化数据
    ShortImminentData: [], // 短临气象类型数据
    ShortForecastData: [], // 短临预报信息
    rainListFlag: [], // 单站点单要素时序图标记
    moreListFlag: [], // 单站点多要素时序图标记
    GtThresholdSiteData: []// 实况告警数据
})
// vm.Popup_Object = {WarningSignsData:[],ShortImminentData:[],InitShortImminentData:[],ShortForecastData:[],rainListFlag:[],moreListFlag:[1],GtThresholdSiteData:[]};
// 自定义数据查询提示
const customPrompt = p => {
    let {vm, data, msg} = p;
    if (!data) {
        vm.$message({ type: 'warning', message: `获取${msg}接口失败！` })
        return false;
    }
    if (!data.success) {
        vm.$message({ type: 'warning', message: `获取${msg}数据失败！` })
        return false;
    }
    if (!data.data.length) {
        vm.$message({ type: 'warning', message: `暂无${msg}数据！` })
        return false;
    }
    return true;
}

export {
    centerMap,
    mainMap,
    getBeihaiSea,
    RadarLayer,
    FogLayer,
    SatelliteImgLayer,
    WarningRangeOverlay,
    WarningRangeeFeature,
    Popup_Obj,
    customPrompt,
    getGXLayer,
    editGXLayerColor,
    editGXLayerWithHasColor,
    getLayersByIds,
    centerRightMap,
    getSeaRoutes,
    SeaRouteScale,
    getPort,
    getShortImminentData,
    getScenic
}
