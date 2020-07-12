import Ol from 'openlayers'
const ol = Ol;
import hash from 'object-hash'
import {
    saveAs
} from 'file-saver';
import './ssd.min';
const fnCached = {};
window.fnCached = fnCached;
let fnCachedCheckTimmer;
const fnCachedCheck = time => fnCachedCheckTimmer = setTimeout(() => {
    const keys = Object.keys(fnCached);
    const keyLength = keys.length;
    // console.log(keyLength)
    if (keyLength > 1600) {
        // Object.keys(fnCached).splice(0, 800).forEach((e) => delete fnCached[e])
        Object.keys(fnCached).forEach((e) => delete fnCached[e])
    }
    fnCachedCheck(time)
}, time)
fnCachedCheck(3000);
export default class Common {
    constructor({
        // 这里的vm是ol-map的vue实例
        vm,
        target
    }) {
        this.vm = vm
        const layers = this.getLayersForInit();
        const overlays = this.getOverlaysForInit();
        const controls = this.getControlsForInit();
        const interactions = this.getInteractionsForInit();
        const options = {
            mapId: this.getMapId(),
            target,
            layers,
            overlays,
            controls,
            interactions
            // controls: null,
        };
        vm.map = new ol.Map(options);
        this.initEvents();
    }
    getOverlaysForInit() {
        return []
    }
    getControlsForInit() {
        return []
    }
    getInteractionsForInit() {

    }
    getMapId() {
        return this.vm.value;
    }
    initEvents() {

    }
    getLayersOfTianditu(refData) {
        return [new Ol.layer.Tile({
            layerId: 'tainditu_traffic',
            refData,
            source: new Ol.source.XYZ({
                url: 'http://t2.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
            })
        }), new Ol.layer.Tile({
            layerId: 'tainditu_traffic_info',
            refData,
            source: new Ol.source.XYZ({
                url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef' // 天地图_地名
            })
        })]
    }
    // 方法自动缓存生成器
    generateCachedFunctionProxy(fn) {
        const keyFn = hash(fn.toString());
        return (...args) => {
            const keyArgs = args.join(',')
            const keyCached = hash(`${keyFn}-${keyArgs}`);
            if (fnCached.hasOwnProperty(keyCached)) {
                return fnCached[keyCached]
            } else {
                const res = fn(...args);
                fnCached[keyCached] = res;
                return res;
            }
        }
    }
    getLayersOfBaseForInit(refData) {
        const {
            baseLayersInfoSources,
            baseLayersInfoIndex
        } = window.gloable;
        const baseLayersInfo = baseLayersInfoSources[baseLayersInfoIndex]
        if (baseLayersInfo) {
            return baseLayersInfo.map(({
                layerId,
                type,
                visible,
                url
            }) => {
                if (type == 'xyz') {
                    return new Ol.layer.Tile({
                        layerId,
                        refData,
                        visible,
                        source: new Ol.source.XYZ({
                            url
                        })
                    })
                } else if (type == 'geojson') {
                    const styleBorder = this.generateCachedFunctionProxy(() => new ol.style.Style({
                        fill: new ol.style.Fill({ // 矢量图层填充颜色，以及透明度
                            color: 'rgba(255, 255, 255, 0)'
                        }),
                        stroke: new ol.style.Stroke({ // 边界样式
                            color: '#ffa09a',
                            width: 3
                        })
                    }))();
                    return this.getLayerVectorForInit({
                        layerId,
                        refData,
                        source: new ol.source.Vector({
                            projection: this.getSourceCode(),
                            url,
                            format: new ol.format.GeoJSON()
                        }),
                        visible,
                        style(f) {
                            // console.log('f.getProperties()', f.getProperties());
                            return styleBorder
                        }
                    })
                }
            })
            // })), ...this.getLayersOfgxborderForInit()]
        } else {
            return []
        }
    }
    makeCollection({
        key
    }) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const bundle = this;
        const collectionFeatures = new ol.Collection();
        collectionMap[key] = collectionFeatures;
        return collectionFeatures;
    }
    getCollection({
        key
    }) {
        const {
            vm: {
                collectionMap
            }
        } = this;
        const collection = collectionMap[key];
        if (collection) {
            return collection;
        } else {
            console.error(`collection key:${key} not found`);
        }
    }
    extendCollection({
        key,
        data
    }) {
        const collection = this.getCollection({
            key
        });
        if (collection) {
            collection.extend(data);
        }
    }
    setCollection({
        key,
        data
    }) {
        const collection = this.getCollection({
            key
        });
        if (collection) {
            collection.clear();
            collection.extend(data);
        }
    }
    forEachFeatureAtPixelOfCollection({
        key,
        cb
    }) {
        const collection = this.getCollection({
            key
        });
        if (collection) {
            collection.getArray().forEach(cb);
        }
    }
    getLayersOfgxborderForInit() {
        const styleBorder = this.generateCachedFunctionProxy(() => new ol.style.Style({
            fill: new ol.style.Fill({ // 矢量图层填充颜色，以及透明度
                color: 'rgba(255, 255, 255, 0)'
            }),
            stroke: new ol.style.Stroke({ // 边界样式
                color: '#ffa09a',
                width: 3
            })
        }))();
        return [this.getLayerVectorForInit({
            layerId: "gxborder",
            source: {
                name: "gxborder"
            },
            visible: false,
            style(f) {
                // console.log('f.getProperties()', f.getProperties());
                return styleBorder
            }
        })]
    }
    getLayersOfMap() {
        const {
            vm: {
                map
            }
        } = this;
        return map.getLayers().getArray();
    }
    getLayersByIds(ids) {
        return this.getLayersOfMap().filter((item) => ids.includes(item.get("layerId")))
    }
    getSourceOfVector(sourceInfo) {
        const vm = this.vm;
        const {
            sourceMap,
            collectionMap
        } = vm;
        let source;
        if (typeof (sourceInfo) === "string") {
            source = sourceMap[sourceInfo];
        } else if (sourceInfo.name) {
            const sourceId = sourceInfo.name;
            if (!sourceMap[sourceId]) {
                const collectionId = sourceInfo.collection || sourceId;
                if (!collectionMap[collectionId]) {
                    collectionMap[collectionId] = new ol.Collection();
                }
                const features = collectionMap[collectionId];
                // console.log('features', features);
                const thisSource = new Ol.source.Vector({
                    features
                })
                sourceMap[sourceId] = thisSource;
            }
            source = sourceMap[sourceId];
        } else {
            source = sourceInfo
        }
        return source;
    }
    getLayerVectorForInit(layerInfo) {
        const vm = this.vm;
        const {
            collectionMap
        } = vm;
        let thisLayer;
        const sourceInfo = layerInfo.source;
        if (!sourceInfo.collection) {
            sourceInfo.collection = layerInfo.collection
        }
        let source = this.getSourceOfVector(sourceInfo);
        thisLayer = new Ol.layer.Vector({
            source,
            layerId: layerInfo.layerId,
            refData: layerInfo,
            visible: layerInfo.visible !== false,
            style: layerInfo.style
        });
        // thisLayer.set('layerId', )
        // thisLayer.set('refData', layerInfo)
        // thisLayer.set('visible', )
        return thisLayer;
    }
    getLayerImageForInit(layerInfo) {
        return new ol.layer.Image({
            source: layerInfo.source,
            layerId: layerInfo.layerId,
            refData: layerInfo,
            visible: layerInfo.visible !== false
        })
    }
    setSourceOfLayers({
        ids,
        source
    } = {}) {
        return this.getLayersByIds(ids).forEach(e => e.setSource(source));
    }
    setImageStaticOfLayers({
        ids,
        info
    } = {}) {
        return this.setSourceOfLayers({
            ids,
            source: info == null ? null : new ol.source.ImageStatic({
                projection: this.getSourceCode(),
                ...info
            })
        });
    }
    controlDefaults(controlInfo) {
        if (controlInfo.extend && controlInfo.extend.map) {
            const arrExtend = controlInfo.extend.map(extend => {
                if (typeof (extend) === "string") {
                    switch (extend) {
                        case "FullScreen":
                            return new Ol.control.FullScreen()
                            break;
                        default:
                            return null
                    }
                }
            })
            return Ol.control.defaults().extend(arrExtend).getArray();
        } else {
            return Ol.control.defaults().getArray();
        }
    }
    controlAuto({
        types
    }) {
        if (types && types.map) {
            return types.map(item => {
                let info
                if (typeof (item) === 'string') {
                    info = {
                        type: item
                    }
                } else {
                    info = {
                        ...item
                    }
                }
                const {
                    type
                } = info;
                delete info.type;
                const factory = ol.control[type];
                if (factory) {
                    return new factory(info)
                }
            })
        }
    }
    getControlsOfMousePosition({
        undefinedHTML,
        className,
        coordinateFormatString
    }) {
        return new Ol.control.MousePosition({
            undefinedHTML: undefinedHTML || '不在范围内',
            projection: this.getSourceCode(),
            // projection: 'EPSG:3857',
            className,
            coordinateFormat: function(coordinate) {
                return Ol.coordinate.format(coordinate, coordinateFormatString || '{x}&nbsp,&nbsp{y}', 4);
            }
        })
    }
    getInteractionDefaults(interactionInfo) {
        return Ol.interaction.defaults().getArray();
    }
    interactionSelect({
        features
    }) {
        const vm = this.vm;
        let select = new Ol.interaction.Select();
        if (typeof (features) === "string") {
            let selectedFeatures = select.getFeatures();
            vm.featureMap[features] = selectedFeatures;
        }
        return select;
    }
    interactionDragBox({
        handles
    }) {
        const vm = this.vm;
        let dragBox = new Ol.interaction.DragBox({
            condition: Ol.events.condition.platformModifierKeyOnly
        });
        if (handles && handles.map) {
            handles
                .map(vm.mapBundleFuncionByBundlePathInfo)
                .filter(item => item)
                .forEach(bundle => {
                    bundle({
                        dragBox
                    })
                });
        }
        return dragBox;
    }
    // 获取地图的投影代码
    getProjectionCode() {
        return this.vm.map.getView().getProjection().getCode() || "EPSG:3857";
    }
    getSourceCode() {
        return "EPSG:4326";
    }
    transformToLonLat([lon, lat], projection) {
        return ol.proj.transform([lon - 0, lat - 0], this.getProjectionCode(), projection || this.getSourceCode());
    }
    transformFromLonLat([lon, lat], projection) {
        return ol.proj.transform([lon - 0, lat - 0], projection || this.getSourceCode(), this.getProjectionCode());
    }
    // 解析geojson数据
    readFeaturesGeojson(geojson) {
        return (new ol.format.GeoJSON()).readFeatures(geojson, {
            featureProjection: this.getProjectionCode()
        })
    }
    writeFeaturesGeojson(features) {
        return (new ol.format.GeoJSON()).writeFeatures(typeof (features.getArray) === 'function' ? features.getArray() : features, {
            featureProjection: this.getProjectionCode()
        })
    }
    transformViewInfo(info) {
        const {
            projection = this.getSourceCode(),
            lon,
            lat
        } = info;
        return {
            ...info,
            projection: "EPSG:3857",
            center: this.transformFromLonLat([lon, lat], projection)
        }
    }
    transformToPointFeatrue(e) {
        return new ol.Feature({
            geometry: new ol.geom.Point(this.transformFromLonLat([e.lon, e.lat])),
            from: "spot",
            ...e
        });
    }
    transformListToPointFeatrues(list) {
        return list.map(this.transformToPointFeatrue, this);
    }
    setView(info) {
        const {
            vm: {
                map
            }
        } = this;
        map.setView(new ol.View(this.transformViewInfo(info)));
    }
    updateView(info) {
        const {
            vm: {
                map
            }
        } = this;
        const view = map.getView();
        if (view) {
            view.animate({
                zoom: Math.min(view.getZoom(), info.zoom || view.getZoom()) - 1
            }, this.transformViewInfo(info));
        } else {
            this.setView(info);
        }
    }
    trackMapClick() {
        const {
            vm,
            vm: {
                map
            }
        } = this;
        map.on('click', (e) => {
            console.log('e.coordinate', e.coordinate, this.transformToLonLat(e.coordinate));
            let pixel = map.getEventPixel(e.originalEvent);
            let hit = map.hasFeatureAtPixel(pixel);
            if (hit) {
                const features = [];
                map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    features.push({
                        feature,
                        layer,
                        properties: feature.getProperties()
                    })
                });
                vm.$emit('click-on-features', {
                    features,
                    e
                });
            }
        });
    }
    trackPointer() {
        const {
            vm,
            vm: {
                map
            }
        } = this;
        map.on('pointermove', function(e) {
            let pixel = map.getEventPixel(e.originalEvent);
            let hit = map.hasFeatureAtPixel(pixel);
            if (hit) {
                const features = [];
                map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    features.push({
                        feature,
                        layer,
                        properties: feature.getProperties()
                    })
                });
                vm.$emit('pointer-on-features', {
                    features,
                    e
                });
            } else {
                vm.$emit('pointer-off-feature')
            }
        })
    }
    saveAs(title = 'map.png') {
        const {
            vm,
            vm: {
                map
            }
        } = this;
        map.once('postcompose', function(event) {
            let canvas = event.context.canvas;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), title);
            } else {
                canvas.toBlob(function(blob) {
                    saveAs(blob, title);
                });
            }
        });
        map.renderSync();
    }
}
