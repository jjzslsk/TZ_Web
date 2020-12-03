<template lang="html" class='situation-page'>
    <div class="map-wrapper">
        <div class='widget-wrap'>
            <div class='title'>{{layerType == 'radar'? '卫星云图':'雷达图'}}</div>
            <div class='tools' v-if="layerType == 'radar'">
                <el-checkbox-group v-model="cloudOption">
                    <el-checkbox class="checkbox-item" label="light">可见光</el-checkbox>
                    <el-checkbox class="checkbox-item" label="infrared">红外</el-checkbox>
                    <el-checkbox class="checkbox-item" label="height500p">500hpa高度</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class='tools' v-else>
                <el-checkbox-group v-model="radarOption">
                    <el-checkbox class="checkbox-item" label="radarAssemble">雷达拼图</el-checkbox>
                    <el-checkbox class="checkbox-item" label="rain1h">1小时降水</el-checkbox>
                    <el-checkbox class="checkbox-item" label="rain3h">3小时降水</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class='map-wrap' ref='rootmap'></div>
    </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import ImageStatic from "ol/source/ImageStatic";
import SourceVector from "ol/source/Vector";
import GeoJSON from "ol/format/geoJson";
import ImageLayer from "ol/layer/Image";
import { defaults as defaultControls } from "ol/control";
import ZoomSlider from "ol/control/ZoomSlider";
import OlSourceVector from "ol/source/Vector";
import OlHeatmapLayer from "ol/layer/Heatmap";
import mapConfig from "./mapConfig";
import { requestWarningCloudFigure } from "@/remote/";
import GroupLayer from "ol/layer/Group";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, Projection, transform } from "ol/proj";
import { Style, Stroke, Text, Fill, Icon } from "ol/style";
import TileArcGISRest from "ol/source/TileArcGISRest";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
export default {
  props: ["layerType"],
  data() {
    return {
      center: null,
      cloudFigure: null,
      cloudOption: ["light"],
      radarOption: ["rain1h"],
      map: null,
    };
  },
  watch:{
    cloudOption(val,oldVal){
      console.log(val)
      console.log(oldVal)
    },
    radarOption(val,oldVal){
      console.log(val)
      console.log(oldVal)
    }
  },
  mounted() {
    requestWarningCloudFigure().then((res) => {
      this.cloudFigure = res.data;
      this.initMap();
    });
  },
  methods: {
    initMap() {
      var mapContainer = this.$refs.rootmap;
      this.center = transform(
        [121.427506, 28.662316],
        "EPSG:4326",
        "EPSG:3857"
      );
      this.map = new Map({
        target: mapContainer,
        layers: this.streetmap(this.layerType, this.cloudFigure),
        view: new View({
          minZoom: 5,
          maxZoom: 12,
          center: this.center, //台州
          zoom: 8,
        }),
      });
    },

    streetmap(layerType, cloudFigure) {
      let mapLayers = [];
      let styleVector = new Style({
        fill: new Fill({
          //矢量图层填充颜色，以及透明度
          color: "rgba(255, 255, 255, 0)",
        }),
        
        stroke: new Stroke({
          //边界样式
          color: "",
          width: 2,
        }),
        text: new Text({
          //文本样式
          font: "12px Calibri,sans-serif",
          fill: new Fill({
            color: "#000",
          }),

          stroke: new Stroke({
            color: "#fff",
            width: 3,
          }),
        }),
      });
      switch (layerType) {
        case "0":
          mapLayers[0] = new TileLayer({
            source: new OSM(),
          });
          break;
        case "radar":
          mapLayers[0] = new TileLayer({
            source: new XYZ({
              url:
                "http://192.168.7.146:6007/offlineMap/tdtSate_%E7%93%A6%E7%89%87%EF%BC%9A%E8%B0%B7%E6%AD%8C/tiles/{z}/{x}/{y}.png",
            }),
          });
          mapLayers[1] = new VectorLayer({
            title: "区域线图层",
            source: new SourceVector({
              url: "../../../../static/data/geojson/taizhou.json",
              format: new GeoJSON(),
            }),
            // style: styleVector
          });
          break;
        case "cloud":
          mapLayers[0] = new TileLayer({
            // source:new TileArcGISRest({
            //     url:'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
            // })
            source: new XYZ({
              url:
                // "http://t2.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef",
                "http://192.168.7.146:6007/offlineMap/tdtRoad_%e7%93%a6%e7%89%87%ef%bc%9a%e8%b0%b7%e6%ad%8c/tiles/{z}/{x}/{y}.png",
            }),
            // source: new OSM()
          });
          mapLayers[1] = new VectorLayer({
            title: "区域线图层",
            source: new SourceVector({
              url: "../../../../static/data/geojson/taizhou.json",
              format: new GeoJSON(),
            }),
            style: styleVector,
          });
          mapLayers[2] = new VectorLayer({
            title: "省边界",
            source: new SourceVector({
              url: "../../../../static/data/geojson/taizhou/sheng.geojson",
              format: new GeoJSON(),
            }),
          });

          //计算静态地图映射到地图上的范围，图片像素为550*344，保持比例的情况下，把分辨率放大一些
          // var extent = [
          //   this.center[0] - (250 * 1000) / 2,
          //   this.center[1] - (144 * 1000) / 2,
          //   this.center[0] + (250 * 1000) / 2,
          //   this.center[1] + (144 * 1000) / 2,
          // ];
          // mapLayers[3] = new ImageLayer({
          //   source: new ImageStatic({
          //     url: this.cloudFigure.url, // 静态地图
          //     imageExtent: extent, //映射到地图的范围
          //   }),
          // });

          // 新建图层，用于标记中心点 icon图标单个
          // let locationLayer = new VectorLayer();
          // let locationVector = new SourceVector();
          // locationLayer.setSource(locationVector);
          // // openlayers点对象
          // let locationPoint = new Point(this.center);
          // let locationFeature = new Feature();
          // // 设置几何图形
          // locationFeature.setGeometry(locationPoint);
          // // 设置图层属性
          // locationVector.addFeature(locationFeature);
          // // style样式的使用，icon图标
          // let centerPointStyle = new Style({
          //     image: new Icon({
          //         src: '/static/images/weather/cloudy_128.png',
          //         scale: 0.3,
          //         anchor: [0.5, 1],
          //         zoom: 8.5,
          //     }),
          // });
          // locationLayer.setStyle(centerPointStyle);
          // mapLayers[3]= locationLayer

          break;
      }
      return mapLayers;
    },
  },
};
</script>
<style lang='postcss' scoped>
.map-wrap {
  height: 100%;
}
/*隐藏ol的一些自带元素*/
.map-wrapper {
  position: relative;
  .widget-wrap {
    position: absolute;
    display: flex;
    height: 40px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    .title {
      margin: 0 10px;
      font-size: 18px;
      font-weight: 550;
      -webkit-text-stroke: .1px #fff;
    }
    .tools {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: rgba(119, 119, 119, 0.15) 1px solid;
      min-width: 200px;
      height: 30px;
      margin: 0 10px;
      border-radius: 50px;
      padding: 0 10px;
      .checkbox-item{
        margin-right:10px;
      }
    }
  }
}
</style>
<style>
.ol-attribution,
.ol-zoom {
  display: none;
}
</style>