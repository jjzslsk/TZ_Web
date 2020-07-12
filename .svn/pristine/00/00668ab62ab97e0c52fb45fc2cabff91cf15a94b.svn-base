// in src\components\ol-map\bundles\map-one.js
import ol from 'openlayers'
import trackInfo from './trackInfo'
export default class MapOne {
    constructor({
        // 这里的vm是ol-map的vue实例
        vm
    }) {
        this.vm = vm
    }
    boxend({
        dragBox
    }) {
        // 依赖从vm中传入，方便拆分和状态管理
        const {
            vm,
            vm: {
                sourceMap,
                featureMap,
            }
        } = this;
        dragBox.on('boxend', function() {
            const info = [];
            const extent = dragBox.getGeometry().getExtent();
            const vectorSourceCountries = sourceMap['vectorSourceCountries'];
            const selectedFeatures = featureMap['selectedFeatures'];
            vectorSourceCountries.forEachFeatureIntersectingExtent(extent, function(feature) {
                selectedFeatures.push(feature);
                info.push(feature.get('name'));
            });
            // 从子组件发射到父组件
            vm.$emit('select-features', info);
        })
    }
    boxstart({
        dragBox
    }) {
        const {
            vm: {
                featureMap
            }
        } = this;
        dragBox.on('boxstart', function() {
            const selectedFeatures = featureMap['selectedFeatures'];
            selectedFeatures.clear();
        })
    }
    mapClick({
        map
    }) {
        const {
            vm: {
                featureMap
            }
        } = this;
        map.on('click', function() {
            const selectedFeatures = featureMap['selectedFeatures'];
            selectedFeatures.clear();
        })
    }
    mapPointermove({
        map
    }) {
        const {
            vm
        } = this;
        map.on('pointermove', function(e) {
            vm.$emit('pointermove', e);
        })
    }
    setPointToCollection({
        point,
        collection
    }) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const thisCollection = collectionMap[collection];
        if (thisCollection) {
            thisCollection.clear();
            // const style = new ol.style.Style({
            //     image: new ol.style.Circle({
            //         radius: 30,
            //         stroke: new ol.style.Stroke({
            //             color: '#fff'
            //         }),
            //         fill: new ol.style.Fill({
            //             color: '#3399CC'
            //         })
            //     }),
            //     text: new ol.style.Text({
            //         text: JSON.stringify(point),
            //         fill: new ol.style.Fill({
            //             color: '#fff'
            //         })
            //     })
            // });
            const style = new ol.style.Style({
                geometry: new ol.geom.Point(point),
                image: new ol.style.Icon({
                    src: 'https://openlayers.org/en/v3.20.1/examples/data/arrow.png',
                    anchor: [
                        0.75, 0.5
                    ],
                    rotateWithView: true,
                    rotation: 0
                })
            });
            // point = [109.4212074889997, 24.328741753238262];
            const tf = new ol.Feature(new ol.geom.Point(point));
            tf.setStyle(function(feature) {
                console.log('feature', feature);
            });
            // thisCollection.extend([tf]);
            // thisCollection.push(tf);
            thisCollection.push(point);
            return true;
        } else {
            return false;
        }
    }
    qingning() {
        var Source = trackInfo['BTrack'];
        var features = [];
        var index = 0
        Object.entries(Source).forEach(function([k, v]) {
            var dots = v;
            var dot = dots.concat();
            features[index] = new ol.Feature({ //定义点的特征（属性）
                //要素覆盖线层
                geometry: new ol.geom.LineString(dot),
                name: k,
            });
            index++
        })

        // name = shaidao[name].trackName;
        var lineStyle_Middle = new ol.style.Style({ //中间线样式
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        });
        var Track_Source_Middle = new ol.source.Vector({
            features: features
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
            features: features
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
            features: features
        })
        var Track_Layer_Bor = new ol.layer.Vector({
            source: Track_Source_Bor,
            name: "line",
            // zIndex: 0,
            style: lineStyle_Bor
        });
        // mapGIS.addLayer(Track_Layer_Bor);
        // mapGIS.addLayer(Track_Layer_Fill);
        // mapGIS.addLayer(Track_Layer_Middle);
        return [Track_Layer_Bor, Track_Layer_Fill, Track_Layer_Middle]
    }
}
