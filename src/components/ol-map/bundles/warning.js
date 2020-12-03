import ol from 'openlayers'
import Taizhou from './taizhou'
export default class Warning extends Taizhou {
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
    getLayersForInit() {
        return [ this.getLayersOfTianditu(), this.getLayersOfBlankBaseForInit(), this.getLayersOfWarningForInit()].flat();
    }
}
