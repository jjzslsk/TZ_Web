<template>
<div class="page-wrapper signal">
    <el-container>
        <el-header>
            <div class="actions">
                <span class="title">预警类型</span>
                <!-- <c-select v-model="query.type" options="warningType" placeholder="请选择"></c-select> -->
                <c-select v-model="query.code" mapper="weatherWarningTypeGBName" allText="全部" placeholder="请选择"></c-select>
                <span class="title">预警等级</span>
                <c-select v-model="query.level" options="warningLevel" placeholder="请选择"></c-select>
                <span class="title">起止时间</span>
                <el-date-picker v-model="query.timeRange" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <c-button type="search" @click="search()">搜索</c-button>
            </div>
        </el-header>
        <el-main>
            <div class="notes">
                <div class="item">
                    <div class="title should">应发预警提醒</div>
                    <div class="map">
                        <map-block mapMain="Warning" @ready="onMapReadyShould"></map-block>
                    </div>
                </div>
                <div class="item">
                    <div class="title real">实发预警提醒</div>
                    <div class="map">
                        <map-block mapMain="Warning" @ready="onMapReadyReal"></map-block>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</div>
</template>
<script>
import {
    mapFrontMapper
} from '@/common/mapper'
import {
    withCommonSearch,
    withWarning
} from '../../mixins/index';
import mapBlock from './components/map-block.vue'
export default {
    mixins: [withCommonSearch, withWarning],
    components: {
        mapBlock
    },
    data() {
        return {
            lastData: null,
            bundleShould: null,
            bundleReal: null,
            // end of data
        }
    },
    computed: {
        ...mapFrontMapper(['weatherWarningType'])
    },
    mounted() {
        window.GuidComponent = this;
        // this.fetchData();
    },
    methods: {
        onMapReadyShould({
            bundle
        }) {
            this.bundleShould = bundle;
            this.syncWarning({
                bundle,
                prop: 'monitorList'
            });
            bundle.goCenter();
        },
        onMapReadyReal({
            bundle
        }) {
            this.bundleReal = bundle;
            this.syncWarning({
                bundle,
                prop: 'publishList'
            });
            bundle.goCenter();
        },
        syncWarningData() {
            this.syncWarning({
                bundle: this.bundleShould,
                prop: 'monitorList'
            });

            this.syncWarning({
                bundle: this.bundleReal,
                prop: 'publishList'
            });
        }
    }
}
</script>
<style scoped>
.notes {
    display: flex;

    .item {
        flex: 1;
        padding-left: 20px;

        .title {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            line-height: 61px;

            &.should {
                background: rgba(103, 194, 58, 1);
            }

            &.real {
                background: rgba(64, 158, 255, 1);
            }
        }

        .map {
            height: calc(100vh - 240px);
            border: 1px solid #ddd;
            /* background: #333; */
        }
    }
}
</style>
