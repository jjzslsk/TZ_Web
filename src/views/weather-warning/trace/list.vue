<template>
<div class="page-wrapper" :key="type">
    <!-- {{formItem}} -->
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">{{header}}</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" :remote="remoteOfTable" :formatPayload="formatPayloadInner">
                            <div class="actions" slot="actions">
                                <template v-if="isWarning">
                                    <span class="title">预警类型</span>
                                    <!-- <c-select v-model="query.alarmCode" options="warningType" placeholder="请选择"></c-select> -->
                                    <c-select v-model="query.alarmCode" remote="requestWeatherTypeOptions" allText="全部" placeholder="请选择"></c-select>
                                    <span class="title">起止时间</span>
                                    <el-date-picker v-model="query.publishTime" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </template>
                                <template v-else>
                                    <span class="title">预警类型</span>
                                    <!-- <c-select v-model="query.code" options="warningType" placeholder="请选择"></c-select> -->
                                    <c-select v-model="query.code" mapper="weatherWarningTypeGBName" allText="全部" placeholder="请选择"></c-select>
                                    <span class="title">等级</span>
                                    <c-select v-model="query.level" options="warningLevel" placeholder="请选择"></c-select>
                                    <span class="title">发布时间</span>
                                    <!-- <el-date-picker v-model="query.issueLetter" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
                                    </el-date-picker> -->
                                    <el-date-picker v-model="query.publishTime" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </template>
                                <c-button type="search" @click="search()">搜索</c-button>
                            </div>
                            <el-table-column prop="" label="序号" width="60px" type="index"></el-table-column>
                            <el-table-column prop label="图标" width="170px" v-if="isWarning">
                                <template slot-scope="scope">
                                    <div class="icons flex">
                                        <div class="item" v-for="(icon,index) in splitStr(scope.row.alarmCode)" :key="icon">
                                            <c-iconfont :name="icon" class="icon item"></c-iconfont>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop label="图标" width="80px" v-else>
                                <template slot-scope="scope">
                                    <div class="icon-alarm">
                                        <img-alarm class="pic" :info="scope.row|alermInfo"></img-alarm>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop label="预警类型" width="170px" v-if="isWarning">
                                <template slot-scope="scope">
                                    {{scope.row.alarmName}}
                                </template>
                            </el-table-column>
                            <template v-else>
                                <el-table-column prop label="预警类型" width="100px">
                                    <template slot-scope="scope">
                                        {{scope.row.code|frontMapper('weatherWarningTypeGBName')}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop label="级别" width="100px">
                                    <template slot-scope="scope">
                                        {{scope.row.level|frontOptionLabel('warningLevel')}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop label="发布类型" width="100px">
                                    <template slot-scope="scope">
                                        {{({'A':"首发",'Z':"解除"}[scope.row.issueLetter]||"继续发布")}}
                                    </template>
                                </el-table-column>
                            </template>
                            <el-table-column :prop="isWarning?'alarmContent':'content'" label="预警内容" class-name="text-eclipse" show-overflow-tooltip/>
                            <el-table-column prop="publishTime" label="发布时间" width="180px" />
                            <el-table-column prop="publishOrg" label="发布单位" width="350px" />
                            <el-table-column prop label="操作" width="120px">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="inputItem(scope.row)">发布结果</el-button>
                                </template>
                            </el-table-column>
                        </page-table>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
    <c-dialog :title="titleOfDialog" :visible.sync="visibleDialogFormItem" :primary-text="null" :secondary-text="'关闭'" width="80%">
        <trace-main :type="type" :data="formItem" v-if="visibleDialogFormItem"></trace-main>
    </c-dialog>
</div>
</template>

<script>
import {
    requestDictListDelItem,
    requestDictTree
} from "@/remote/";
import {
    transformAlarmsInfo
} from "@/common/tools/"
import {
    transformDate,
    transformRedHead
} from "@/common/filter"
import {
    common,
    witchCommonList
} from '../../mixins/index';
import traceMain from './components/trace-main.vue';
export default {
    mixins: [common, witchCommonList],
    components: {
        traceMain
    },
    data() {
        return {
            dataTraceMain: null
        }
    },
    computed: {
        type() {
            return this.$route.params.type
        },
        isWarning() {
            return this.type == 'warning'
        },
        header() {
            return ({
                'warning': '天气警报追溯',
                'alarm': '预警信号追溯',
            })[this.type]
        },
        titleOfDialog() {
            return ({
                'warning': '天气警报监控',
                'alarm': '预警信号监控',
            })[this.type]
        },
        remoteOfTable() {
            return `requestTrace${this.type}List`
        }
    },
    watch: {
        // formItem(val) {
        //     if (val) {
        //         requestTraceDialogDetail({
        //             publishId:val.id
        //         })
        //     }
        // }
        isWarning(val) {
            this.query = {};
        }
    },
    methods: {
        getFormItemByInputItem(item) {
            const {
                // accountName,
                isWarning
            } = this;
            return {
                ...item,
                ...transformRedHead({
                    // accountName,
                    accountName: item.publishUser,
                    ...item
                }, isWarning)
            }
        },
        splitStr(str) {
            return str && str.split(',')
        },
        formatPayloadInner(payload) {
            const {
                publishTime,
                ...p,
            } = this.formatPayload(payload)
            const [
                startTime,
                endTime
            ] = publishTime || []
            return {
                ...p,
                startTime,
                endTime
            }
        }
    },
    filters: {
        alermInfo(val) {
            console.log('val:',val)
            if (val) {
                return transformAlarmsInfo({
                    // type: val.XXXPROP_TRACE_ALARM_TYPE,
                    code: val.code,
                    level: val.level
                })
            }
        }
    }
};
</script>
<style scoped>
.icons {
    .icon.iconfont {
        color: #409EFF;
        font-size: 2em;
    }
}

.icon-alarm {
    text-align: center;

    img {
        max-width: 42px;
        /* height: 2.5em; */
    }
}
</style>
