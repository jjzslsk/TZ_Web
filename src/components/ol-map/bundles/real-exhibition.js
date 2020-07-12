import ol from 'openlayers'
import trackInfo from './trackInfo'
import Exhibition from './exhibition'
export default class RealExhibition extends Exhibition {
    getLayersForInit() {
        return [this.getLayersOfBaseForInit(), [this.getLayersOfPointsForInit(), this.getLayersOfSpotsForInit()]].flat();
    }
}
