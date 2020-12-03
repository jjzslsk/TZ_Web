import ol from 'openlayers'
import trackInfo from './trackInfo'
import Common from './common'
export default class PointSelectior extends Common {
    getLayersForInit() {
        return [this.getLayersOfBaseForInit(), this.getLayersToInit()].flat();
    }
    getControlsForInit() {
        return [
            this.getControlsOfMousePosition({
                className: 'ol-mouse-position-fm'
            })
        ].flat();
    }
    getLayersToInit() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionPointFeatures = new ol.Collection();
        collectionMap['pointFeatures'] = collectionPointFeatures;
        const stylePointFeature = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                // fill: new ol.style.Fill({
                //     color: '#f00'
                // }),
                stroke: new ol.style.Stroke({
                    color: '#08f',
                    width: 1
                })
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.6)'
            }),
            stroke: new ol.style.Stroke({
                color: '#319FD3',
                width: 1
            }),
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
                const styles = [];
                stylePointFeature.getText().setText(feature.get('text'));
                styles.push(stylePointFeature);
                const image = feature.get('image');
                styles.push(new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Icon({
                        anchor: [23, 0],
                        src: 'static/vender/img/ED3F2B.png',
                        scale: 0.5,
                        size: [46, 70],
                        anchorXUnits: "pixels",
                        anchorYUnits: "pixels",
                        anchorOrigin: "bottom-left"
                    })
                }));
                return styles;
            }
        })
        return [layerPoints];
    }
    gotData(info) {
        const [lon, lat] = info.coordinateLonLat || [];
        const center = info.center && info.center[0] && info.center[1] ? info.center : [
            108.37034225463864,
            22.84728820385773
        ];
        const zoom = info.zoom || 7;
        const {
            vm,
            vm: {
                map
            }
        } = this;

        const view = new ol.View({
            "projection": "EPSG:3857",
            "center": this.transformFromLonLat(center),
            "zoom": zoom,
            "minZoom": 7,
            "maxZoom": 18
        });
        map.setView(view);
        vm.$emit('view-changed', {
            center,
            zoom: view.getZoom()
        });
        if (lon && lat) {
            this.setPoint({
                coordinate: this.transformFromLonLat([parseFloat(lon), parseFloat(lat)])
            });
        }
    }
    initEvents() {
        this.trackMapClick();
        this.trackMapViewChange();
    }
    trackMapClick() {
        const {
            vm: {
                map
            }
        } = this;
        map.on('click', ({
            coordinate
        }) => {
            this.setPoint({
                coordinate
            });
        });
    }
    setPoint({
        coordinate,
        coordinateLonLat
    }) {
        const {
            vm,
            vm: {
                map,
                collectionMap
            }
        } = this;
        if (coordinateLonLat) {
            coordinate = this.transformFromLonLat(coordinateLonLat);
        } else {
            coordinateLonLat = this.transformToLonLat(coordinate);
        }
        const collectionPointFeatures = collectionMap['pointFeatures'];
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
            name: 'My Polygon'
        });
        // feature.setStyle();
        feature.set('text', JSON.stringify(coordinateLonLat));
        collectionPointFeatures.clear();
        collectionPointFeatures.push(feature);
        vm.$emit('point-selected', {
            coordinateLonLat,
            feature
        });
    }
    trackMapViewChange() {
        const {
            vm,
            vm: {
                map
            }
        } = this;
        map.on('change:view', () => {
            const view = map.getView();
            view.on('change:center', (e) => {
                const center = view.getCenter();
                const zoom = view.getZoom();
                vm.$emit('view-changed', {
                    center: this.transformToLonLat(center),
                    zoom: Math.round(zoom)
                })
            });
        })
    }
    setCenter(center) {
        const {
            vm: {
                map
            }
        } = this;
        const view = map.getView();
        view.setCenter(this.transformFromLonLat(center));
    }
}
