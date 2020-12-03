<template>
<c-dialog :title="title" :visible.sync="visibleDialog" :confirmDisabled="!value.coordinateLonLat" @confirm="onPointConfirm">
    <div class="main">
        <div class="map-wrapper">
            <ol-map v-if="visibleDialog" v-model="mapPointSelector" @ready="onMapReady" @point-selected="onPointSelected" @view-changed="onViewChanged"></ol-map>
        </div>
    </div>
    <div class="footer-prepend" slot="footer-prepend">
        <span>缩放层级：{{value.zoom}}</span>
        <span>视框中心：{{value.center}}</span>
    </div>
</c-dialog>
</template>
<script>
import OlMap from '@/components/ol-map'
import CDialog from '@/components/c-dialog/index.vue'
export default {
    props: {
        'value': Object,
        'visible': Boolean,
        'title': {
            type: String,
            default: '请选择地点'
        }
    },
    data() {
        return {
            mapPointSelector: "PointSelector",
            visibleDialog: this.visible,
            setCenterTimmer: null,
            setPointTimmer: null
        }
    },
    components: {
        OlMap,
        CDialog
    },
    watch: {
        visible(val) {
            this.visibleDialog = val;
        },
        visibleDialog(val) {
            this.$emit('update:visible', val);
        },
        'value.center': function(val, old) {
            if (val && old && val[0] != old[0] && val[1] != old[1]) {
                const vm = this;
                const {
                    bundle
                } = vm;
                clearTimeout(vm.setCenterTimmer);
                vm.setCenterTimmer = setTimeout(function() {
                    bundle.setCenter(val);
                }, 400);
            }
        },
        'value.coordinateLonLat': function(val, old) {
            if (val && old && val[0] != old[0] && val[1] != old[1]) {
                const vm = this;
                const {
                    bundle
                } = vm;
                clearTimeout(vm.setPointTimmer);
                vm.setPointTimmer = setTimeout(function() {
                    bundle.setPoint({
                        coordinateLonLat: val
                    });
                }, 400);
            }
        }
    },
    methods: {
        onMapReady({
            map,
            bundle
        }) {
            // 获取map和bundle实例
            const vm = this;
            vm.map = map;
            vm.bundle = bundle;
            bundle.gotData(vm.value);
            // bundle.gotData();
            // bundle.gotData({});
        },
        onPointSelected({
            coordinateLonLat
        }) {
            const vm = this;
            vm.$emit('input', Object.assign({}, vm.value, {
                coordinateLonLat
            }));
        },
        onPointConfirm() {
            const vm = this;
            vm.visibleDialog = false;
            // console.log('vm.value', vm.value);
            vm.$emit("confirm", vm.value);
        },
        onViewChanged({
            center,
            zoom
        }) {
            // console.log('center,zoom', center, zoom);
            const vm = this;
            vm.$emit('input', Object.assign({}, vm.value, {
                center,
                zoom
            }));
        }
    }
}
</script>

<style scoped>
.point-selector {
    .map-wrapper {
        width: 100%;
        height: 500px;
    }

    .footer-prepend {
        color: #333;
        position: absolute;
        margin-top: 15px;

        span {
            margin-right: 5px;
        }
    }
}
</style>
