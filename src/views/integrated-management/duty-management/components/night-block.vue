<template>
<div v-if="form.type == 'statistics'">
    <div class="dialog-table-title">{{monthTime}}夜餐费补贴统计表</div>
    <table class="dialog-table-info">
        <tr>
            <td>部门：{{loginInfo.orgName}}</td>
            <td></td>
            <td></td>
        </tr>
    </table>
    <table-block ref="table" remote="requestNightStaticsList" :formatPayload="formatPayload" :hidePagination="true" :show-summary="true">
        <el-table-column type="index" label="序号" width="80px"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120px" />
        <el-table-column prop="dayNum" label="早晨天数" width="80px" />
        <el-table-column prop="dayList" label="具体日期" />
        <el-table-column prop="nightNum" label="夜间天数" width="80px" />
        <el-table-column prop="nightList" label="具体日期" />
    </table-block>
    <table class="dialog-table-info">
        <tr>
            <td>批准：</td>
            <td>审核：</td>
            <td>制表：{{loginInfo.username}}</td>
        </tr>
    </table>
</div>
<div v-else>
    <div class="dialog-table-title">夜间值班未补休补助费发放表</div>
    <table class="dialog-table-info">
        <tr>
            <td>部门：{{loginInfo.orgName}}</td>
            <td></td>
            <td>日期：{{monthTime}}</td>
        </tr>
    </table>
    <table-block ref="table" remote="requestNightDistributionList" key="requestNightDistributionList" :formatPayload="formatPayload" :hidePagination="true" :show-summary="true">
        <el-table-column prop="XXXPROP_NIGHT_DISTRIBUTION_id" label="序号" width="80px"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120px" />
        <el-table-column prop="overTimeNum" label="未补休天数" width="120px" />
        <el-table-column prop="dateList" label="具体日期" />
        <el-table-column prop="overTimePay" label="补助金额(元)" width="120px" />
        <el-table-column prop="absenceDutyNum" label="缺勤天数" width="120px" />
        <!-- <el-table-column label="签名" /> -->
    </table-block>
    <table class="dialog-table-info">
        <tr>
            <td>批准：</td>
            <td>审核：</td>
            <td>制表：{{loginInfo.username}}</td>
        </tr>
    </table>
</div>
</template>

<script>
import {
    mapActions,mapGetters
} from 'vuex'
export default {
    props: ['form','monthTime'],
    methods: {
        formatPayload() {
            // return this.form;
            return {
                orgId:this.accountOrgId,
                monthTime:this.monthTime,
                ...this.form
            }
        }
    },
    computed: {
        loginInfo(){
            const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
            return loginInfo
        },
        ...mapGetters(['accountOrgId']),
    },
}
</script>

<style scoped>
</style>
