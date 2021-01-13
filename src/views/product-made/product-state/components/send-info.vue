<template>
<div class="send-info">
    <!-- <div class="flex total">
        <div class="item" v-for="(info,index) in infoTotal">
            <div class="inner">
                <div class="num" :class="info.type">{{info.num}}</div>
                <div class="desc">{{info.desc}}</div>
            </div>
        </div>
    </div> -->
    <div class="text-right">
        <!-- <div class="refresher">
            <c-iconfont name="shuaxin"></c-iconfont> 11秒后刷新
        </div> -->
        <!-- <div class="refresher" v-if="!channelsOptions2.lenght > 0">
            暂无统计数据！
        </div> -->
        <div class="refresher">
        </div>
    </div>
    <div class="pie-wrapper">
        <chart-result :data="infoStatistics" v-if="infoStatistics"></chart-result>
        <!-- <chart-doughnut :data="infoStatistics" v-if="infoStatistics"></chart-doughnut> -->
    </div>
    <div class="list-wrapper" v-if="query.publishChannel">
        <el-tabs v-model="query.publishChannel" type="card">
            <!-- <el-tab-pane :key="item.value" v-for="(item, index) in channelsOptions" :label="item.label" :name="item.value"></el-tab-pane> -->
            <el-tab-pane :key="item.value" v-for="item in channelsOptions2" :label="item.label" :name="item.value">
                <div class="table-wrapper">
                        <template>
                            <el-table
                            height="360"
                            :data="tableList[item.value]"
                            style="width: 100%">
                            <el-table-column prop="" label="序号" width="60px" type="index"></el-table-column>
                        <el-table-column prop="serviceUserName" label="接收人" width="180px" />
                        <el-table-column prop="serviceUserAddress" label="邮件"/>
                        <el-table-column prop="publishTime" label="时间" width="180px"/>
                        <el-table-column prop="result" label="发送结果" width="180px"/>
                        <el-table-column prop="message" label="描述"/>
                            </el-table>
                        </template>
                    <!-- <table-block ref="table" :data='tableList[item.value]' :formatPayload="formatPayloadInner" @current-change="onCurrentChange">
                        <el-table-column prop="" label="序号" width="60px" type="index"></el-table-column>
                        <el-table-column prop="serviceUserName" label="接收人" width="180px" />
                        <el-table-column prop="serviceUserAddress" label="邮件" />

                        <el-table-column label="状态" width="180px" >
                            <template slot-scope="{row}">
                                {{({'0':'发送成功','1':'发送失败','2':'正在推送','3':'推送失败','4':'推送成功'})[row.result]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="publishTime" label="时间" />
                    </table-block> -->
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</div>
</template>

<script>
import {
    mapFrontOptions
} from '@/common/options'
import * as remote from '@/remote/'
import {requestProductTaskList,requestChannelList,requestProductTaskList1} from '@/remote/'
import chartResult from './chart-result.vue'
import chartDoughnut from './chart-doughnut.vue'
export default {
    components: {
        chartResult,
        chartDoughnut
    },
    props: ['data'],
    data() {
        return {
            tableList:null,
            // infoTotal: [],
            channelsOptions2:[],
            infoStatistics: null,
            query: {
                publishChannel: "",
                pageSize: '5',
                pageIndex: '1'
            },
            // end of data
        }
    },
    computed: {
        // isWarning() {
        //     return this.type == 'warning'
        // },
        payloadOfList() {
            const {
                query,
                data
            } = this;
            return query.publishChannel && {
                ...query,
                publishId: data.id
            }
        },
        payloadOfStatistics() {
            const {
                data
            } = this;
            return {
                publishId: data.id
            }
        },
        // remoteOfTable() {
        //     return this.isWarning ? 'requestTraceDialogList' : 'requestTraceDialogListAlarm'
        // },
        ...mapFrontOptions(['areas', 'channels'])
    },
    mounted(){
        console.log('console:',this.data)
        requestProductTaskList1({publishId:this.data.id}).then(res=>{
            this.tableList = res.data.list
            console.log(res)
        })
    },
    watch: {
        "$refs.table": function(val) {
            if (val) {
                this.tableResolve(val);
            }
        },
        "payloadOfList": {
            handler: function(val) {
                if (val) {
                    this.fetchData();
                }
            },
            deep: true,
            immediate: true
        },
        payloadOfStatistics: {
            handler: function(val) {
                if (val) {
                    this.fetchDataStatistics();
                }
            },
            deep: true,
            immediate: true
        },
        channelsOptions2: {
            handler(val) {
                if (val) {
                    if(val.length > 0){
                        this.$nextTick(() => {
                        this.query.publishChannel = val[0].value
                    })
                    }
                }
            },
            deep: true,
            immediate: true
        },
    },
    methods: {
        onCurrentChange(page) {
            this.query.pageIndex = page
        },
        formatPayloadInner(data) {
            return this.payloadOfList;
        },
        getComponentTable() {
            const {
                proTable
            } = this;
            if (this.$refs.table) {
                return Promise.resolve(this.$refs.table);
            } else {
                if (!proTable) {
                    this.proTable = new Promise((resolve, reject) => {
                        this.tableResolve = resolve;
                    })
                }
                return this.proTable
            }
        },
        fetchData() {
            this.getComponentTable().then(table => {
                table.fetchData();
            })
        },
        fetchDataStatistics() {
            remote[`requestTraceDialogProductTask`](this.payloadOfStatistics).then(res => {
                const {
                    // totals,
                    resultList
                } = res.data || {};
                // this.infoTotal = [{
                //     type: "success",
                //     num: totals.sendSuccess,
                //     desc: "发送成功"
                // }, {
                //     type: "success",
                //     num: totals.successRate,
                //     desc: "发送成功率"
                // }, {
                //     type: "fail",
                //     num: totals.sendFail,
                //     desc: "发送失败"
                // }, {
                //     type: "pushing",
                //     num: totals.pushing,
                //     desc: "正在推送"
                // }, {
                //     type: "push-success",
                //     num: totals.pushSuccess,
                //     desc: "推送成功"
                // }, {
                //     type: "push-fail",
                //     num: totals.pushFail,
                //     desc: "推送失败"
                // }];

                this.infoStatistics = resultList; //拥有的渠道
                requestChannelList().then(res=>{ //获取TAB /获取所有渠道信息
                    this.channelsOptions2 = []
                    this.infoStatistics.forEach(element => {
                        // console.log('element:',element)
                        res.data.forEach(i=>{
                            // console.log('ii:',i)
                            if(element.publishChannel == i.code){
                                let param = {}
                                param.label = i.name
                                param.value = i.code
                                param.selected = false
                                this.channelsOptions2.push(param)
                            }
                        })
                    });
                })
            })
        }
    }
}
</script>

<style lang='postcss' scoped>
.send-info {
    background: rgba(255, 255, 255, 1);
    border-left: 1px solid #ddd;
    padding: 10px 10px 0px 10px;

    .total {
        border: 1px solid rgba(235, 238, 245, 1);

        .item {
            text-align: center;
            padding: 15px 0;

            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 1.5;

            .inner {
                border-right: 1px solid rgba(235, 238, 245, 1);

                .num {
                    font-size: 22px;

                    &.success {
                        color: rgba(64, 158, 255, 1);
                    }

                    &.fail {
                        color: rgba(245, 108, 108, 1);
                    }

                    &.pushing {
                        color: rgba(98, 218, 172, 1);
                    }

                    &.push-success {
                        color: rgba(100, 119, 152, 1);
                    }

                    &.push-fail {
                        color: rgba(247, 191, 34, 1);
                    }
                }

                .desc {
                    font-size: 14px;
                    color: rgba(144, 147, 153, 1);
                }
            }

            &:last-child .inner {
                border: 0;
            }

        }
    }

    .refresher {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(144, 147, 153, 1);
        line-height: 53px;
    }

    .pie-wrapper {
        height: 240px;
    }
    .table-wrapper {
        min-height: 250px;

        .state {
            &.success {
                color: rgba(64, 158, 255, 1);
            }

            &.fail {
                color: rgba(245, 108, 108, 1);
            }

            &.pushing {
                color: rgba(98, 218, 172, 1);
            }

            &.push-success {
                color: rgba(100, 119, 152, 1);
            }

            &.push-fail {
                color: rgba(247, 191, 34, 1);
            }
        }
    }
}
</style>
<style lang="postcss">
.send-info {
    .list-wrapper {
        .el-tabs__header {
            margin-bottom: 0px;
        }
    }
}

</style>
