import ol from 'openlayers'
import Common from './common'
import trackInfo from './trackInfo'

import {
    getInfoOfKeyVal,
    getInfoOfKeySync
} from '@/common/legend'
import {
    codeToWeatherIcon
} from '@/common/filter'
import {
    getColorOfArr
} from '@/util/'
export default class Taizhou extends Common {
    citycode = '331000';
    // 省市县图层key
    getBaseGeoArr() {
        return ['sheng', 'shi_all', 'shi', 'xian', 'xiangzhen']
    }
    // 省市县图层
    getLayersOfBlankBaseForInit() {
        const bundle = this;
        return this.getBaseGeoArr().map(e => {
            const colorStroke = ({
                'sheng': '#bbb',
                'shi_all': '#bbb'
            })[e] || '#333';
            // const widthStroke = ({
            //     'xian': 1,
            //     'xiangzhen': 1
            // })[e] || 3;
            const styleMain = this.generateCachedFunctionProxy((colorStroke,
                widthStroke, e, NAME_2) => {
                const textWithName2 = this.generateCachedFunctionProxy((NAME_2) => new ol.style.Text({
                    text: NAME_2,
                    fill: new ol.style.Fill({
                        color: "#333"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#ffffff",
                        width: 1
                    }),
                    font: 'bold 22px "Open Sans", "Arial Unicode MS", "sans-serif"'
                }))(NAME_2);
                return new ol.style.Style({
                    fill: new ol.style.Fill({ // 矢量图层填充颜色，以及透明度
                        color: 'rgba(255, 255, 255, 0)'
                    }),
                    stroke: new ol.style.Stroke({ // 边界样式
                        color: colorStroke,
                        width: widthStroke
                    }),
                    text: ({
                        'shi_all': textWithName2,
                        'shi': textWithName2,
                        'xian': textWithName2,
                        'xiangzhen': textWithName2
                    })[e]
                });
            });
            return this.getLayerVectorForInit({
                layerId: e,
                source: {
                    name: e
                },
                // visible: false,
                style(f, r) {
                    // console.log('f.getProperties()', f.getProperties());
                    // console.log('r', r);
                    const from = f.get("from");
                    const citycode = f.get("CITYCODE");
                    const isEqCode = bundle.citycode == citycode;
                    // 根据条件隐藏乡镇
                    if (r > 40 && from == "xiangzhen" && !isEqCode) {
                        return null;
                    }
                    const widthStroke = from == "xian" && isEqCode ? 3 : 1;
                    return styleMain(colorStroke, widthStroke, e, f.get("NAME_2"));
                }
            });
        })
    }
    // 网格、格点图层
    getLayersOfGridDataForInit() {
        const styleMain = this.generateCachedFunctionProxy((showValue, value, edited, showGrid) => {
            const style = {};
            let text;
            if (showValue) {
                const v = value
                style.text = new ol.style.Text({
                    text: v + '',
                    font: '12px 微软雅黑',
                    fill: new ol.style.Fill({
                        color: edited ? '#f00' : '#333'
                    }),
                    scale: edited ? 1.2 : 0.9,
                    rotateWithView: true,
                    textBaseline: 'center',
                    textAlign: 'center'
                })
            }
            if (showGrid) {
                style.fill = new ol.style.Fill({
                    color: 'rgba(0 ,0 , 0, 0)'
                });
                style.stroke = new ol.style.Stroke({
                    color: 'rgba(0 ,0 , 0, 0.4)',
                    lineDash: [0],
                    width: 1
                });
            }
            return new ol.style.Style(style)
        });
        return this.getLayerVectorForInit({
            layerId: 'grid',
            source: {
                name: 'grid'
            },
            style: (f) => {
                return styleMain(f.get('showValue'), f.get('value'), f.get('edited'), f.get('showGrid'))
            }
        })
    }
    // 自动站图层
    getLayersOfStationsForInit() {
        // 画实心点
        const styleCircle = new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                // color: fillColor || '#fff'
                color: '#fff'
            }),
            stroke: new ol.style.Stroke({
                color: '#333',
                width: 1
            }),
            points: 3
        });
        const styleMain = this.generateCachedFunctionProxy((text, fillColor) => {
            const stylePointFeature = new ol.style.Style({
                text: new ol.style.Text({
                    offsetY: 17,
                    text,
                    font: 'bold 16px MicrosoftYaHei',
                    fill: new ol.style.Fill({
                        color: "#0141AC"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#333",
                        width: 0.1
                    })
                })
            });
            styleCircle.getFill().setColor(fillColor || "#fff")
            stylePointFeature.setImage(styleCircle);
            return stylePointFeature;
        });
        return this.getLayerVectorForInit({
            layerId: 'station',
            source: {
                name: 'station'
            },
            style: (f) => {
                if (f.get('visible') === false) {
                    return;
                }
                return styleMain(f.get('name'), f.get('fillColor'))
            }
        })
    }
    // 色斑区域图层
    getLayersOfColoredAreaForInit() {
        const bundle = this;

        const getStyleOfColor = color => {
            return color ? new ol.style.Style({
                fill: new ol.style.Fill({
                    color
                }),
                stroke: new ol.style.Stroke({
                    width: 1,
                    color
                })
            }) : undefined;
        }
        const styleMain = this.generateCachedFunctionProxy((color, isVisibleColor, isShowLevel, isShowFallArea) => {
            let styles = [];

            const styleColor = getStyleOfColor(color);
            if (color && (isVisibleColor || isShowFallArea)) {
                styles.push(styleColor);
            }
            if (isShowLevel) {
                styles.push(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: 2,
                        color: "#aaa"
                    })
                }));
            }
            return styles;
        });

        return this.getLayerVectorForInit({
            layerId: 'coloredArea',
            source: {
                name: 'coloredArea'
            },
            style(f) {
                const color = f.get("color");
                const isVisibleColor = f.get("visibleColor") == null ? bundle.visibleColor : f.get("visibleColor");
                const isShowLevel = f.get("visibleLevel") == null ? bundle.visibleColoredArea : f.get("visibleLevel");
                let isShowFallArea = false;
                if (f.get("visibleFallArea") !== false) {
                    const level = f.get("levelFall");
                    if (level != null) {
                        if (f.get("hvalue") >= level) {
                            if (!isVisibleColor) {
                                isShowFallArea = true;
                            }
                        }
                    }
                }
                return styleMain(color, isVisibleColor, isShowLevel, isShowFallArea);
            }
        })
    }
    // 落区图层
    getLayersOfPointsFallForInit() {
        const stylePointFeature = new ol.style.Style({
            text: new ol.style.Text({
                offsetX: 5,
                offsetY: -15,
                font: 'bold 16px MicrosoftYaHei',
                fill: new ol.style.Fill({
                    color: "#333"
                }),
                stroke: new ol.style.Stroke({
                    color: "#333",
                    width: 0.1
                })
            })
        });

        const styleMain = this.generateCachedFunctionProxy((text, src) => {
            let styles = [];
            stylePointFeature.getText().setText(text);
            styles.push(stylePointFeature);
            if (src) {
                const stylePointPic = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        offset: [0, 0],
                        src
                    })
                });
                styles.push(stylePointPic);
            }
            return styles;
        });
        return this.getLayerVectorForInit({
            layerId: 'pointsFall',
            source: {
                name: 'pointsFall'
            },
            style(f) {
                if (f.get("visibleFallArea") === false) {
                    return;
                }
                const text = f.get("text");
                const src = f.get("src");
                return styleMain(text, src);
            }
        })
    }
    // 控制器
    getControlsForInit() {
        let titleControl = new ol.control.CanvasTitle();
        let legendControl = new ol.control.CanvasLegend();

        this.titleControl = titleControl;
        this.legendControl = legendControl;
        titleControl.setVisible(false);
        legendControl.setVisible(false);
        return [titleControl, legendControl]
    }
    // getControlsForInit() {
    //     return [
    //         this.getControlsOfMousePosition({
    //             className: 'ol-mouse-position-fm'
    //         })
    //     ].flat()
    // }
    // 初始化事件
    initEvents() {
        this.trackPointer();
        this.trackMapClick();
    }
    getLayersOfBase() {
        return this.getLayersOfMap().filter((item) => ["tainditu_traffic", "tainditu_traffic_info", "base_offline", "sheng"].includes(item.get("layerId")))
    }
    mapSwitch() {
        this.getLayersOfBase().forEach(e => {
            e.set("visible", !e.get("visible"));
        })
    }
    gotGeojsonOfCollection({
        key,
        geojson
    }) {
        this.setCollection({
            key,
            data: this.readFeaturesGeojson(geojson).map(e => {
                e.set("from", key);
                return e;
            })
        })
    }
    transformGridPayloadToGeojson(payload) {
        const geojson = {
            type: 'FeatureCollection',
            features: []
        }
        let type = payload.type
        let zoom = payload.zoom
        let lt = payload.lt
        let rb = payload.rb
        // let offset = 0.05 // 五公里网格 单位公里
        let offset = payload.interval
        this.intervalGrid = offset
        let precision = 1 // 精度，隔多少个格点取一个

        // 400 240 求公因数
        // 2 2 2 2 4 因数分解
        // 5 3 分解余项
        if (zoom <= 6) {
            precision = 40
            offset = precision * offset
        } else if (zoom <= 7) {
            precision = 16
            offset = precision * offset
        } else if (zoom <= 8) {
            precision = 8
            offset = precision * offset
        } else if (zoom <= 9) {
            precision = 2
            offset = precision * offset
        } else {
            precision = 1
            offset = precision * offset
        }
        // 以网格左上角数据渲染网格
        let len = offset
        let features = []
        let x = 0 // 同经度异纬度
        let y = 0 // 同纬度异经度
        let prevLat = payload.list[0].lat // 前一个纬度
        let startDate = new Date()
        payload.list.map((v, idx) => {
            let lon = v.lon
            let lat = v.lat
            let curLat = (v.lat * 1).toFixed(2)
            if (curLat !== (prevLat * 1).toFixed(2)) {
                prevLat = curLat
                x = 0
                y++
            }
            if (x % precision === 0 && y % precision === 0 && lon >= lt[0] && lat >= lt[1] && lon <= rb[0] && lat <= rb[1]) { // 只渲染视窗里的要素
                // 以网格左上角数据渲染网格
                const plonRight = v.lon - 0 + len;
                const platBottom = v.lat - len;
                const beFiex = 0.05; // 服务端图片多出
                if (plonRight <= rb[0] + beFiex && platBottom >= lt[1]) {
                    // 网格仅在图片内
                    const f = {
                        type: 'Feature',
                        properties: {
                            ...v
                        },
                        geometry: {
                            type: type && type === 'Point' ? 'Point' : 'Polygon',
                            coordinates: type && type === 'Point' ? [v.lon - 0, v.lat - 0] : [
                                [
                                    [v.lon - 0, v.lat - 0],
                                    [v.lon - 0, (v.lat - len).toFixed(3) - 0],
                                    [v.lon - 0 + len, (v.lat - len).toFixed(3) - 0],
                                    [v.lon - 0 + len, v.lat - 0],
                                    [v.lon - 0, v.lat - 0]
                                ]
                            ]
                        }
                    }
                    features.push(f)
                }
            }
            x++
        })
        let endDate = new Date()
        console.log('endData-startDate=', endDate - startDate)
        geojson.features = features
        return geojson
    }
    gotGridDataPaload({
        payload,
        activeShowGrid,
        activeShowGridValue
    }) {
        this.gotGridDataFeatrues({
            featrues: this.readFeaturesGeojson(this.transformGridPayloadToGeojson({
                lt: [118, 27],
                rb: [123, 32],
                ...payload
            })),
            activeShowGrid,
            activeShowGridValue
        })
    }
    gotGridDataFeatrues({
        featrues,
        activeShowGrid,
        activeShowGridValue
    }) {
        this.setCollection({
            key: "grid",
            data: featrues.map(f => {
                f.set('showValue', activeShowGridValue);
                f.set('showGrid', activeShowGrid);
                return f;
            })
        })
    }
    // 获取格点数据
    getGridValueProperties() {
        const collectionGrid = this.getCollection({
            key: 'grid'
        });
        return collectionGrid.getArray().map(e => e.getProperties());
    }
    setSelectedGridValue(newGridValue) {
        const collectionGrid = this.getCollection({
            key: 'grid'
        });
        collectionGrid.getArray().forEach(f => {
            if (f.get("selected")) {
                f.set("value", newGridValue);
                f.set("selected", false);
                f.set("edited", true);
            }
        })
    }
    setShowGrid(active) {
        const collection = this.getCollection({
            key: "grid"
        });
        if (collection) {
            collection.getArray().forEach(f => f.set("showGrid", active));
        }
    }
    setShowGridValue(active) {
        const collection = this.getCollection({
            key: "grid"
        });
        if (collection) {
            collection.getArray().forEach(f => f.set("showValue", active));
        }
    }
    // 获取站点数据
    getStationValueProperties() {
        const collection = this.getCollection({
            key: 'station'
        });
        return collection.getArray().map(e => e.getProperties());
    }
    goCenter() {
        this.updateView({
            lon: 121.24511718749997,
            lat: 28.70745188935186,
            zoom: 9
        });
    }
    setTitle(mapShow) {
        const {
            titleControl
        } = this;
        titleControl.setVisible(true);
        titleControl.setStyle({
            text: [mapShow.title, mapShow.subTitle]
        })
    }
    // 设置图例类型
    setLegendType(type) {
        const {
            legendControl
        } = this;
        const info = getInfoOfKeySync(type);
        if (info) {
            const renderColor = info.list.map(e => {
                const {
                    min,
                    minEq,
                    max,
                    title,
                    color
                } = e;
                return {
                    title: title != null ? title : minEq == null ? ' < ' + max : (max ? minEq + ' ~ ' + max : ' >= ' + minEq),
                    color
                };
            }).map(e => {
                const {
                    title,
                    color
                } = e;
                return [e.title, getColorOfArr(e.color)];
            }).reverse();
            legendControl.setStyle({
                renderColor,
                titleText: info.title
            });
            // legendControl.setVisible(true);
            this.getColorLegendOfValue = value => getInfoOfKeyVal(type)(value).color
            const collection = this.getCollection({
                key: "coloredArea"
            });
            if (collection) {
                this.updateCollectionArrayOfColoredArea(collection.getArray())
            }
        }
    }
    setLegendVisible(active) {
        this.legendControl.setVisible(active);
    }
    // 更新地图特征集合数据
    updateCollectionArrayOfColoredArea(collectionArray) {
        // if (this.visibleFallArea == null) {
        //     this.visibleFallArea = false;
        // }
        collectionArray.forEach(this.setFeatureData, this);
    }
    // 更新地图特征数据
    setFeatureData(f) {
        if (this.getColorLegendOfValue) {
            let hvalue = f.get("hvalue");
            let color = this.getColorLegendOfValue(hvalue);
            f.set("color", color);
        }
        f.set("levelFall", this.levelFall);
        f.set("visibleFallArea", this.visibleFallArea);
        f.set("visibleColor", this.visibleColor);
        return f;
    }
    // 解析色斑负载
    gotValuedAreaPaload(payload) {
        if (payload) {
            let features;
            if (payload.length) {
                features = JSON.parse(payload)
            } else {
                features = JSON.stringify(payload)
            }
            const data = this.readFeaturesGeojson(features);
            this.updateCollectionArrayOfColoredArea(data);
            this.setCollection({
                key: "coloredArea",
                data
            })
        }
    }
    forEachColoredArea(cb) {
        this.forEachFeatureAtPixelOfCollection({
            key: "coloredArea",
            cb
        })
    }
    setVisibleOfColoredArea(visible) {
        this.visibleColor = visible;
        this.forEachColoredArea(f => f.set("visibleColor", visible))
    }
    setVisibleOfColoredAreaLevel(visible) {
        this.visibleColoredArea = visible;
        this.forEachColoredArea(f => f.set("visibleLevel", visible))
    }
    setVisibleOfFallArea(visible) {
        this.visibleFallArea = visible;
        this.forEachColoredArea(f => f.set("visibleFallArea", visible))
        this.forEachFeatureAtPixelOfCollection({
            key: "pointsFall",
            cb: f => f.set("visibleFallArea", visible)
        })
    }
    setFallLevel(level) {
        this.levelFall = level;
        // console.log('level', level);
        this.forEachColoredArea(f => f.set("levelFall", level))
    }
    setVisibleOfStations(visible) {
        this.forEachFeatureAtPixelOfCollection({
            key: "station",
            cb: f => f.set("visible", visible)
        });
    }
    setFallPoints(points) {
        const collection = this.setCollection({
            key: "pointsFall",
            data: points.map(e => new ol.Feature({
                geometry: new ol.geom.Point(this.transformFromLonLat(e.coordinates)),
                from: "pointsFall",
                ...e
            }))
        });
    }
    gotEndGridData({
        data,
        activeShowGrid,
        activeShowGridValue
    }) {
        // this.gotGridDataFeatrues({
        //     featrues: this.transformListToPointFeatrues(data.list),
        //     activeShowGrid,
        //     activeShowGridValue
        // });
        this.gotGridDataPaload({
            payload: data,
            activeShowGrid,
            activeShowGridValue
        })
    }
    // 解析自动站数据
    gotStations(stations) {
        this.setCollection({
            key: "station",
            data: this.transformListToPointFeatrues(stations.map(e => { e.from = "station"; return e; }))
        })
    }
    // 活动色斑数据
    gotColorPicInfo({pngUrl, range}) {
        this.setPicInfo({
            url: pngUrl,
            imageExtent: range
        });
    }
    // 图片层相关操作
    getLayersForImageForInit(refInfo = {
        layerId: "image"
    }) {
        return this.getLayerImageForInit(refInfo);
    }
    setImage(info) {
        return this.setImageStaticOfLayers({
            ids: ["image"],
            info
        })
    }
    removeImage() {
        this.setImage(null);
    }
    setPicInfo(info) {
        this.setImage(info);
    }
    removePic() {
        this.removeImage();
    }

    getLayersOfWarningForInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const bundle = this;
        const collectionFeatures = new ol.Collection();
        collectionMap['warningFeatures'] = collectionFeatures;
        const layerFeatures = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: collectionFeatures
            }),
            style: function(feature) {
                const styles = [];
                // 画图标
                let imageType = feature.get("imageType"); // 级别
                let imageColor = feature.get("imageColor"); // 类型
                const src = `../static/images/alarm_icons/${imageType}-${imageColor}ico.png`
                styles.push(new ol.style.Style({
                    image: new ol.style.Icon({
                        src,
                        scale: 0.4
                    })
                }));
                return styles;
            }
        })
        return layerFeatures;
    }
}
