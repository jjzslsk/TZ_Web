<template lang="html">
  <div class="ol-map-wrapper" ref="map-wrapper">
      <div ref="map-mount-point" class="ol-map-mount-point"></div>
  </div>
</template>

<script>
import Ol from 'openlayers'
import Bundles from './bundles'
import eventHub from '@/common/event-hub/'
export default {
    name: 'OlMap',
    props: {
        value: String
    },
    data() {
        return {
            map: null,
            mapMountedPoint: null,
            mapId: null,
            bundle: null,
            overlayMap: {},
            sourceMap: {},
            collectionMap: {},
            featureMap: {},
            bundleMap: {}
        }
    },
    mounted() {
        const vm = this;
        vm.mapMountedPoint = vm.$refs['map-mount-point'];
    },
    created: function() {
        eventHub.$on('resize', this.onResize)
    },
    beforeDestroy: function() {
        eventHub.$off('resize', this.onResize)
    },
    watch: {
        value: {
            handler: 'updateMapInstace',
            immediate: true
        },
        mapMountedPoint: 'updateMapInstace'
    },
    methods: {
        updateMapInstace() {
            const vm = this;
            if (vm.value) {
                if (!vm.map && vm.$refs['map-mount-point']) {
                    const target = vm.$refs['map-mount-point'];
                    const bundle = new Bundles[vm.value]({
                        vm,
                        target
                    });
                    vm.bundle = bundle;
                    vm.$emit('ready', vm);
                    vm.mapId = vm.value;
                }
            } else {
                if (vm.map) {
                    vm.map = null;
                    vm.$emit('destroy', vm);
                }
                return null;
            }
            if (!window.$_ol_map_maps) {
                window.$_ol_map_maps = {}
            }
            if (vm.mapId) {
                window.$_ol_map_maps[vm.mapId] = vm.map;
            }
        },
        onResize() {
            const vm = this;
            vm.$nextTick(() => {
                if (vm.map) {
                    vm.map.updateSize();
                }
            })
        }
    }
}
</script>

<style lang="postcss" scoped>
.ol-map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .ol-map-mount-point {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 1;
    }
}
</style>
