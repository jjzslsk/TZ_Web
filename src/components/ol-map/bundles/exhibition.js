import ol from 'openlayers'
import Common from './common'
import trackInfo from './trackInfo'

import {
    getInfoOfKeyVal
} from '@/common/legend'
import {
    codeToWeatherIcon
} from '@/common/filter'
export default class Exhibition extends Common {
    getOverlaysForInit() {
        const {
            vm: {
                overlayMap
            }
        } = this;
        const featurePopup = new ol.Overlay({
            element: document.getElementById('overlay-hover-info'),
            offset: [0, -3],
            positioning: 'bottom-center',
            position: null,
            autoPan: true
        });
        overlayMap['hoverInfo'] = featurePopup;
        return [featurePopup];
    }
    getLayersCircleRangeForInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionCircleRangeFeatures = new ol.Collection();
        collectionMap['circleRangeFeatures'] = collectionCircleRangeFeatures;
        const layerCircleRange = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: collectionCircleRangeFeatures
            })
        })
        return layerCircleRange;
    }
    getLayersCircleForInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionCircleFeatures = new ol.Collection();
        collectionMap['circleFeatures'] = collectionCircleFeatures;
        const layerCircle = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: collectionCircleFeatures
            })
        })
        return layerCircle;
    }
    getLayersOfPointsForInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionPointFeatures = new ol.Collection();
        collectionMap['pointFeatures'] = collectionPointFeatures;
        // 画实心点
        const stylePointFeature = new ol.style.Style({
            text: new ol.style.Text({
                offsetY: 17,
                font: 'bold 16px MicrosoftYaHei',
                fill: new ol.style.Fill({
                    color: "#0141AC"
                }),
                stroke: new ol.style.Stroke({
                    color: "#333",
                    width: 0.1
                }),
            })
        });
        const layerPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: collectionPointFeatures
            }),
            style: function(feature) {
                // 画地点（展点、景区）及其图片
                const styles = [];
                let text;
                if (feature.get('from') != 'station') {
                    text = feature.get('name');
                }
                stylePointFeature.getText().setText(text);
                stylePointFeature.setImage(new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: feature.get('fillColor') || '#fff'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#333',
                        width: 1
                    })
                }))
                styles.push(stylePointFeature);
                const imageSrc = feature.get('imageSrc');
                if (imageSrc) {
                    const stylePointPic = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 1],
                            offset: [0, 10],
                            src: imageSrc
                        })
                    });
                    styles.push(stylePointPic);
                }
                return styles;
            }
        })
        return layerPoints;
    }
    getLayersOfSpotsForInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const bundle = this;
        const collectionSpotFeatures = new ol.Collection();
        collectionMap['spotFeatures'] = collectionSpotFeatures;
        // 画实心点（带文字）
        const stylePointFeature = new ol.style.Style({
            text: new ol.style.Text({
                offsetY: 17,
                font: 'bold 16px MicrosoftYaHei',
                fill: new ol.style.Fill({
                    color: "#0141AC"
                }),
                stroke: new ol.style.Stroke({
                    color: "#333",
                    width: 0.1
                }),
            })
        });
        // 无文字样式
        const stylePointNoTextFeature = new ol.style.Style({})
        const layerPoints = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: collectionSpotFeatures
            }),
            style: function(feature) {
                // 画色斑
                const styles = [];
                let text;
                if (feature.get('from') == 'station') {
                    text = ""
                } else {
                    text = feature.get('name') || null;
                }
                stylePointFeature.getText().setText(text);
                const fillColor = feature.get('fillColor');
                const legendType = feature.get('legendType');
                let color;
                if (legendType == 'code') {
                    const code = feature.get('code');
                    if (code) {
                        stylePointNoTextFeature.setImage(new ol.style.Icon({
                            src: codeToWeatherIcon(code),
                            scale: 0.5,
                        }))
                        styles.push(stylePointNoTextFeature);
                    }
                } else {

                }
                if (fillColor) {
                    color = fillColor
                } else if (legendType != 'code') {
                    color = bundle.getLegendColorOfFeature(feature) || '#fff';
                }
                if (color) {
                    stylePointFeature.setImage(new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#333',
                            width: 1
                        })
                    }))
                    styles.push(stylePointFeature);
                }
                return styles;
            }
        })
        return layerPoints;
    }
    removeSpots({
        type
    }) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionSpotFeatures = collectionMap['spotFeatures'];
        if (collectionSpotFeatures) {
            const rms = [];
            collectionSpotFeatures.forEach(feature => {
                if (!feature || type === feature.get('type')) {
                    rms.push(feature)
                }
            })
            rms.forEach(feature => collectionSpotFeatures.remove(feature))
        }
    }
    clearSpots() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionSpotFeatures = collectionMap['spotFeatures'];
        if (collectionSpotFeatures) {
            collectionSpotFeatures.clear();
        }
    }
    addSpots(features) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionSpotFeatures = collectionMap['spotFeatures'];
        if (collectionSpotFeatures) {
            collectionSpotFeatures.extend(features.map(e => new ol.Feature({
                geometry: new ol.geom.Point(this.transformFromLonLat([e.lon, e.lat])),
                from: "spot",
                ...e
            })));
        }
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
                let imageType = feature.get("imageType"); //级别
                let imageColor = feature.get("imageColor"); //类型
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

    getLayersOfTrackForInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const bundle = this;
        const collectionFeatures = new ol.Collection();
        collectionMap['trackFeatures'] = collectionFeatures;

        // name = shaidao[name].trackName;
        var lineStyle_Middle = new ol.style.Style({ //中间线样式
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        });
        var Track_Source_Middle = new ol.source.Vector({
            features: collectionFeatures
        })
        var Track_Layer_Middle = new ol.layer.Vector({ //中间线图层
            source: Track_Source_Middle,
            name: "line",
            // zIndex: 0,
            style: lineStyle_Middle
        });
        //-------------------------
        var lineStyle_Fill = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#F8DA14',
                width: 5
            })
        });
        var Track_Source_Fill = new ol.source.Vector({
            features: collectionFeatures
        })
        var Track_Layer_Fill = new ol.layer.Vector({
            source: Track_Source_Fill,
            name: "line",
            // zIndex: 0,
            style: lineStyle_Fill
        });
        //----------------------------------
        var lineStyle_Bor = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 9
            })
        });
        var Track_Source_Bor = new ol.source.Vector({
            features: collectionFeatures
        })
        var Track_Layer_Bor = new ol.layer.Vector({
            source: Track_Source_Bor,
            name: "line",
            // zIndex: 0,
            style: lineStyle_Bor
        });
        return [Track_Layer_Bor, Track_Layer_Fill, Track_Layer_Middle]
    }
    addTrackData(Source) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const bundle = this;
        const collectionFeatures = collectionMap['trackFeatures'];
        if (collectionFeatures) {
            // var Source = trackInfo['BTrack'];
            var features = [];
            var index = 0
            Object.entries(Source).forEach(function([k, v]) {
                var dots = v;
                var dot = dots.map(([lon, lat]) => bundle.transformFromLonLat([lon, lat])).concat();
                features[index] = new ol.Feature({ //定义点的特征（属性）
                    //要素覆盖线层
                    geometry: new ol.geom.LineString(dot),
                    name: k,
                });
                index++
            })
            collectionFeatures.extend(features)
        }
    }
    clearTrack() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionFeatures = collectionMap['warningFeatures'];
        if (collectionFeatures) {
            collectionFeatures.clear();
        }
    }

    addWarning(infos) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionFeatures = collectionMap['warningFeatures'];
        if (collectionFeatures) {
            collectionFeatures.extend(infos.map(e => new ol.Feature({
                geometry: new ol.geom.Point(this.transformFromLonLat([e.lon, e.lat])),
                from: "warning",
                ...e
            })));
        }
    }
    clearWarning() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionFeatures = collectionMap['warningFeatures'];
        if (collectionFeatures) {
            collectionFeatures.clear();
        }
    }
    getControlsForInit() {
        return [
            // this.getControlsOfMousePosition({
            //     className: 'ol-mouse-position-fm'
            // })
        ].flat()
    }
    initEvents() {
        this.trackPointer();
        this.trackMapClick();
    }
    gotActivityInfo(info) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionCircleFeatures = collectionMap['circleFeatures'];
        const collectionCircleRangeFeatures = collectionMap['circleRangeFeatures'];
        const collectionPointFeatures = collectionMap['pointFeatures'];
        const {
            cards
        } = info;
        cards.forEach(card => {
            if (card.type == "circle") {
                Object.entries(card.info || {}).forEach(([key, info]) => {
                    // 处理并放入地点

                    let isMain = false;
                    if (info.circle) {
                        // 地点带圈的情况
                        isMain = true;
                        const positionMain = this.transformFromLonLat([info.lon, info.lat]);

                        if (collectionCircleRangeFeatures) {
                            // 画可变化警报圈（实线半透明实心）
                            const featureMainRange = new ol.Feature({
                                // 3857 单位为米
                                position: positionMain,
                                geometry: new ol.geom.Circle(positionMain, 0)
                            });
                            featureMainRange.setStyle(new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: 'rgba(255,0,0,0.2)'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#ff0000',
                                    width: 2
                                })
                            }));
                            collectionCircleRangeFeatures.push(featureMainRange);
                        }

                        if (collectionCircleFeatures) {
                            // 画配置警报圈（虚线空心）
                            info.circle.ranges.forEach((range, index) => {
                                const featureMain = new ol.Feature({
                                    // 3857 单位为米
                                    geometry: new ol.geom.Circle(positionMain, range)
                                });
                                const colors = ['#FF0000', '#FF8F43', '#FFF100', '#00A0E9'];
                                const color = colors[index];
                                featureMain.setStyle(new ol.style.Style({
                                    // fill: new ol.style.Fill({
                                    //     color: 'rgba(0, 128, 255, 0.2)'
                                    // }),
                                    stroke: new ol.style.Stroke({
                                        color,
                                        width: 3,
                                        lineDash: [8, 5]
                                    })
                                }));
                                collectionCircleFeatures.push(featureMain);
                            })
                        }
                    }

                    collectionPointFeatures.push(new ol.Feature({
                        from: 'card',
                        geometry: new ol.geom.Point(this.transformFromLonLat([info.lon, info.lat])),
                        key,
                        cardId: card.id,
                        isMain,
                        ...info
                    }))
                })
            } else {
                var source = trackInfo['TrackB'];
                this.addTrackData(source);
            }
        });
    }
    updataOverlayer({
        key,
        position
    }) {
        const {
            vm: {
                overlayMap
            }
        } = this;
        const overlay = overlayMap[key];
        if (overlay) {
            overlay.setProperties({
                position
            });
        } else {
            console.warn(`overlay ${key} not found`);
        }
    }
    setColorType(type) {
        this.typeColor = type;
    }
    getLegendInfoOfInfo({
        typeColor,
        sub,
        item
    }) {
        const prop = typeColor === 'wind' ? 'windSpeed' : typeColor;
        return getInfoOfKeyVal(typeColor + (sub || ""))(item[prop]);
    }
    getColorOfInfo(payload) {
        return this.getLegendInfoOfInfo(payload).color;
    }
    getColorOfItem(item) {
        // const vm = this;
        // const prop = this.typeColor === 'wind' ? 'windSpeed' : this.typeColor;
        // return typeof(this.typeColor) !== "undefined" ? getInfoOfKeyVal(this.typeColor)(item[prop]).color : "#fff";
        return typeof(this.typeColor) !== "undefined" ? this.getColorOfInfo({
            typeColor: this.typeColor,
            sub: item.sub,
            item
        }) : "#fff";
    }
    getLegendInfoOfFeature(featrue) {
        const legendType = featrue.get("legendType")
        if (legendType == 'code') {
            return {
                src: ""
            }
        } else {
            return this.getLegendInfoOfInfo({
                typeColor: legendType,
                sub: featrue.get("legendSub"),
                item: featrue.getProperties()
            })
        }
    }
    getLegendColorOfFeature(featrue) {
        return this.getColorOfInfo({
            typeColor: featrue.get("legendType"),
            sub: featrue.get("legendSub"),
            item: featrue.getProperties()
        })
    }
    getLayersOfBase() {
        return this.getLayersOfMap().filter((item) => ["tainditu_traffic", "tainditu_traffic_info", "base_offline", "gxborder"].includes(item.get("layerId")))
    }
    mapSwitch() {
        this.getLayersOfBase().forEach(e => {
            e.set("visible", !e.get("visible"));
        })
    }
    gotGeojsonOfgxborder(geojson) {
        this.setCollection({
            key: 'gxborder',
            data: this.readFeaturesGeojson(geojson)
        })
    }
}
