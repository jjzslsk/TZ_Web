import ol from 'openlayers'
import trackInfo from './trackInfo'
import Exhibition from './exhibition'

export const KEY_OF_FROM = 'station'
export default class StationsExhibition extends Exhibition {
    getLayersForInit() {
        return [this.getLayersOfBaseForInit(), [this.getLayersOfPointsForInit()]].flat();
    }
    getCollectionPointFeatures() {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionPointFeatures = collectionMap['pointFeatures'];
        return collectionPointFeatures;
    }
    gotStations(stations) {
        const collectionPointFeatures = this.getCollectionPointFeatures();
        if (stations) {
            const rms = [];
            collectionPointFeatures.forEach(feature => {
                if (!feature || feature.get('from') === KEY_OF_FROM) {
                    rms.push(feature)
                }
            })
            rms.forEach(feature => collectionPointFeatures.remove(feature))
            stations.forEach(info => {
                collectionPointFeatures.push(new ol.Feature({
                    from: KEY_OF_FROM,
                    fillColor: this.getColorOfStation(info),
                    geometry: new ol.geom.Point(this.transformFromLonLat([info.lon, info.lat])),
                    key: info.code,
                    ...info
                }))
            })
        }
    }
    setColorType(type, sub) {
        super.setColorType(type);
        const collectionPointFeatures = this.getCollectionPointFeatures();
        collectionPointFeatures.forEach(feature => {
            if (feature.get('from') === KEY_OF_FROM) {
                feature.set('fillColor', this.getColorOfStation({
                    ...feature.getProperties(),
                    sub
                }))
            }
        })
    }
    getColorOfStation(station) {
        return this.getColorOfItem(station)
    }
}
