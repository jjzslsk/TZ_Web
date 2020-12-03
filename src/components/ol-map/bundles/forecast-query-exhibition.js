import ol from 'openlayers'
import trackInfo from './trackInfo'
import Exhibition from './exhibition'
export default class ForecastQueryExhibition extends Exhibition {
    getLayersForInit() {
        return [this.getLayersOfBaseForInit(), [this.getLayersCircleForInit(), this.getLayersOfPointsForInit()]].flat();
    }
}
