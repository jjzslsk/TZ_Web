import ol from 'openlayers'
import Exhibition from './exhibition'
export default class ForecastMakerExhibition extends Exhibition {
    getLayersForInit() {
        return [this.getLayersOfBaseForInit(), this.getLayersCircleRangeForInit(), this.getLayersCircleForInit(), this.getLayersOfTrackForInit(), this.getLayersOfPointsForInit(), this.getLayersOfSpotsForInit(), this.getLayersOfWarningForInit()].flat();
    }
    setRange(val) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collectionCircleRangeFeatures = collectionMap['circleRangeFeatures'];
        collectionCircleRangeFeatures.forEach(feature => {
            feature.getGeometry().setRadius(val * 1000);
        })
    }
}
