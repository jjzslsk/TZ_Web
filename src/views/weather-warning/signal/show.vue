<template>
<div class="signal-show">
    <el-container>
        <el-main>
            <div class="show">
                <div class="map">
                    <map-block mapMain="Warning" @ready="onMapReady"></map-block>
                </div>
                <div class="query">
                    <div class="head">预警查询</div>
                    <div class="actions">
                        <el-row class="mb1em">
                            <el-col :span="4">
                                <span class="title">预警类型</span>
                            </el-col>
                            <el-col :span="8" class="pr1em">
                                <!-- <c-select v-model="query.type" options="warningType" placeholder="请选择"></c-select> -->
                                <c-select v-model="query.code" mapper="weatherWarningTypeGBName" allText="全部" placeholder="请选择"></c-select>
                            </el-col>
                            <el-col :span="4">
                                <span class="title">预警等级</span>
                            </el-col>
                            <el-col :span="7">
                                <c-select v-model="query.level" options="warningLevel" placeholder="请选择"></c-select>
                            </el-col>
                        </el-row>

                        <el-row class="mb1em">
                            <el-col :span="4">
                                <span class="title">起止时间</span>
                            </el-col>
                            <el-col :span="20">
                                <el-date-picker v-model="query.timeRange" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                            </el-col>
                        </el-row>
                        <c-button type="search" @click="search()" class="float-right">搜索</c-button>
                        <div class="clearfix"></div>
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
            // end of data
        }
    },
    computed: {
        ...mapFrontMapper(['weatherWarningType'])
    },
    methods: {
        onMapReady({
            bundle
        }) {
            // this.addWarning({
            //     bundle,
            //     list: [{
            //         lon: 121,
            //         lat: 29,
            //         imageColor: "4",
            //         imageType: "0002"
            //     }, {
            //         lon: 120.83,
            //         lat: 28.82,
            //         imageColor: "1",
            //         imageType: "0009"
            //     }]
            // });
            this.bundle = bundle;
            this.syncWarning({
                bundle,
                prop: 'monitorList'
            });
            bundle.goCenter();
        },
        syncWarningData() {
            this.syncWarning({
                bundle: this.bundle,
                prop: 'publishList'
            });
        }
    }
}
</script>
<style scoped>
.signal-show {
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .show {
        height: 100%;

        .map {
            height: 100%;
        }

        .query {
            position: absolute;
            z-index: 1;
            top: 20px;
            right: 20px;
            width: 457px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 2px 5px 0px rgba(6, 0, 1, 0.15);
            border-radius: 2px;
            padding: 30px;

            .head {
                font-size: 18px;
                font-weight: bold;
                color: rgba(48, 49, 51, 1);
                line-height: 53px;
            }

            .title {
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                line-height: 2.5em;
            }

        }
    }
}
</style>
<style media="screen">
.signal-show {
    .query {
        .el-date-editor--datetimerange.el-input__inner {
            width: 363px;
        }
    }
}
</style>
