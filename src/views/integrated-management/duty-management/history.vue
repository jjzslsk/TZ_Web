<template>
<div class="page-wrapper">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">历史交接班记录</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestHistoryList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">类型</span>
                                <el-select v-model="query.title" clearable placeholder="请选择">
                                    <el-option v-for="item in typeList" :label="item.title" :value="item.title" :key="item.title"></el-option>
                                </el-select>
                                <span class="title">姓名</span>
                                <el-input v-model="query.userName" clearable placeholder="请输入名称"></el-input>
                                <span class="title">起止范围</span>
                                <el-date-picker v-model="query.time" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                                <span class="title">关键字</span>
                                <el-input v-model="query.keyword" clearable placeholder="请输入内容"></el-input>
                                <c-button type="search" @click="search()">搜索</c-button>
                            </div>
                            <el-table-column prop="" type="index" label="序号" width="50px"></el-table-column>
                            <el-table-column prop="time" label="交班时间" width="180px"/>
                            <el-table-column prop="createUser" label="交班人" width="120px"/>
                            <el-table-column prop="title" label="类型" width="180px"/>
                            <el-table-column prop="content" label="任务" />
                        </page-table>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
</div>
</template>


<script>
import {
requestHistoryGetType
} from "@/remote/";
import {
    common,
    witchCommonList
} from '../../mixins/index';
import {
    mapActions,mapGetters
} from 'vuex'
export default {
    mixins: [common, witchCommonList],
    data() {
        return {
            typeList:[],
            query: {},
        };

    },
    watch:{
            query:{
            handler(val, oldVal){
                if(val.time){
                    this.query.startTime = val.time[0],
                    this.query.endTime = val.time[1]
                }else{
                    this.query.startTime = null,
                    this.query.endTime = null
                }
            },
            deep:true
        }
    },
    mounted() {
        requestHistoryGetType().then(res=>{
            this.typeList = res.data
            // this.typeList.unshift({id:'0',title:''})
        })
    },
    computed: {
        ...mapGetters(['accountOrgId']),
    },
    methods:{
        formatPayloadLeft(payload){
            return {
                'orgId':this.accountOrgId,
                ...payload
            }
        },
    }
};
</script>
<style scoped>
</style>
