import ol from 'openlayers'
import trackInfo from './trackInfo'
import Common from './common'
export default class MapForecastMaker {
    constructor({
        // 这里的vm是ol-map的vue实例
        vm,
        vm: {
            overlayMap
        },
        target
    }) {
        this.vm = vm;

        const common = new Common({
            vm
        });
        const featurePopup = new ol.Overlay({
            // 元素id
            element: document.getElementById('overlay-id-0'),
            // vue
            // element: vm.$refs['overlay-ref-0'][0],
            name: '',
            positioning: 'bottom-center',
            position: null
        });
        overlayMap['hoverInfo'] = featurePopup;
        const layers = [common.getLayersOfBaseForInit(), this.getLayersOfTracks({
            names: ["BTrack", "CTrack", "DTrack", "ETrack", "FTrack", "FTrack_W", "TrackB", "ABLine", "DELine"]
        })].flat();
        // const layers = [this.getLayersOfTracks({
        //     names: ["BTrack", "CTrack", "DTrack", "ETrack", "FTrack", "FTrack_W", "TrackB", "ABLine", "DELine"]
        // })].flat();
        const overlays = [featurePopup];
        // vm.addLayers(layers)
        // vm.addOverlays();
        // this.trackPointer();
        const options = {
            mapId: vm.value,
            layers,
            target,
            overlays,
            view: new ol.View({
                // projection: 'EPSG:4326',
                projection: 'EPSG:3857',
                center: [109, 21.8],
                // zoom: 4,

                zoom: 10,
                minZoom: 7,
                maxZoom: 15

                // center: [12138181.403712926, 2459576.798972078],
                // zoom: 7,
                // minZoom: 7,
                // maxZoom: 15
            }),
            controls: [
                // common.controlAuto({
                //     types: ['Zoom', 'FullScreen']
                // }),
                common.getControlsOfMousePosition({
                    className: 'ol-mouse-position-fm'
                })
            ].flat(),
            // controls: null,
            // interactions: common.getInteractionDefaults(),
        };
        vm.map = new ol.Map(options);
        this.trackPointer();
    }
    mapPointermove() {
        const {
            vm,
            vm: {
                map
            }
        } = this;
        map.on('pointermove', function(e) {
            vm.$emit('pointermove', e);
        })
    }
    trackPointer() {
        const {
            vm,
            vm: {
                map
            }
        } = this;
        map.on('pointermove', function(e) {
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            // map.getTargetElement().style.cursor = hit ? "pointer" : ''; // 手势改变
            if (hit) {
                map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    // debugger;
                    vm.$emit('pointer-on-feature', {
                        properties: feature.getProperties(),
                        e
                    })
                })
            } else {
                vm.$emit('pointer-off-feature')
            }
        })
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
    gotActivityInfo(info) {
        const {
            vm: {
                map
            }
        } = this;
        Object.entries(info).forEach(([name, sources]) => {
            // debugger;
            if (name.endsWith('Track')) {
                // const layers = this.getLayersOfTracks(sources);
                // layers.forEach(layer => map.addLayer(layer));
                this.setTracksInfo({
                    name,
                    sources
                })
            }
        })
    }
    setTracksInfo({
        name,
        sources
    }) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionTrack = collectionMap[`track-${name}`];
        if (collectionTrack) {
            const features = new Array();
            Object.entries(sources).forEach(function([k, v], index) {
                const dots = v;
                const dot = dots.concat();
                features[index] = new ol.Feature({ //定义点的特征（属性）
                    //要素覆盖线层
                    geometry: new ol.geom.LineString(dot),
                    name: k,
                });
            });
            collectionTrack.clear();

            collectionTrack.extend(features);
        }
    }
    getLayersOfTracks({
        names
    }) {
        if (names && names.map) {
            return names.map(name => {
                const {
                    vm: {
                        collectionMap
                    }
                } = this;

                const keyTrack = `track-${name}`;
                const collectionTrack = new ol.Collection();
                collectionMap[keyTrack] = collectionTrack;
                const sourceTrack = new ol.source.Vector({
                    features: collectionTrack
                });

                const styleLineMiddle = new ol.style.Style({ //中间线样式
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 1
                    })
                });
                const layerTrackMiddle = new ol.layer.Vector({ //中间线图层
                    source: sourceTrack,
                    type: "line",
                    key: keyTrack,
                    style: styleLineMiddle
                });
                //-------------------------
                const styleLineFill = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#F7DB13',
                        width: 5
                    })
                });
                const layerTrackFill = new ol.layer.Vector({
                    source: sourceTrack,
                    type: "line",
                    key: keyTrack,
                    style: styleLineFill
                });
                //----------------------------------
                const styleLineBorder = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#000',
                        width: 9
                    })
                });
                const layerTrackBorder = new ol.layer.Vector({
                    source: sourceTrack,
                    type: "line",
                    key: keyTrack,
                    style: styleLineBorder
                });
                return [layerTrackBorder, layerTrackFill, layerTrackMiddle]
            }).flat()
        }
    }
}
