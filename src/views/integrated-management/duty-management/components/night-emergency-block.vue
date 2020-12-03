<template>
<div v-if="form.type == 'lead'">
    <div class="dialog-table-title">{{monthTime}}台州市本级机关工作人员夜餐费报销审批单</div>
    <table class="dialog-table-main">
        <tr>
            <td>合计： {{levelObj1.countPay}}</td>
            <td>大写：{{levelObj1.countPayUp}}</td>
        </tr>
        <tr>
            <td>单位：{{levelObj1.orgName}}</td>
            <td>处事(部门)：气象台</td>
        </tr>
        <tr>
            <td colspan="2">
                <dl>
                    <dd>加班时间：</dd>
                    <dt>{{levelObj1.overTime}}</dt>
                </dl>
            </td>
        </tr>
        <tr>
            <td colspan="2">加班人员： {{levelObj1.users}}</td>
        </tr>
        <tr>
            <td colspan="2"> 加班事由：应急响应加班</td>
        </tr>
        <tr>
            <td colspan="2">申请金额：{{levelObj1.userPay}}</td>
        </tr>
        <tr>
            <td colspan="2">
                备注：
                <dl>
                    <dd>1、</dd>
                    <dt>
                        工作日晚上连续加班4小时及以上的，每人每次可开支夜餐费补助40元。
                        休息日（含国家法定节假日）加班的，连续加班满4小时不到8小时的，可参照夜餐费补助标准开支1次
                        伙食补助；连续加班满8小时及以上的，可参照夜餐费补助标准开支2次伙食补助。
                    </dt>
                </dl>
                <dl>
                    <dd>2、</dd>
                    <dt>
                        该表单一式两份，一份用于报销审批，一份存档装订备查。
                    </dt>
                </dl>
            </td>
        </tr>
    </table>
</div>
<div v-else>
    <div class="dialog-table-title">{{monthTime}}台州市本级机关工作人员夜餐费报销审批单</div>
    <table class="dialog-table-main">
        <tr>
            <td>合计： {{levelObj2.countPay}}</td>
            <td>大写：{{levelObj2.countPayUp}}</td>
        </tr>
        <tr>
            <td>单位：{{levelObj2.orgName}}</td>
            <td>处事(部门)：气象台</td>
        </tr>
        <tr>
            <td colspan="2">
                <dl>
                    <dd>加班时间：</dd>
                    <dt>{{levelObj2.overTime}}</dt>
                </dl>
            </td>
        </tr>
        <tr>
            <td colspan="2">加班人员： {{levelObj2.users}}</td>
        </tr>
        <tr>
            <td colspan="2"> 加班事由：应急响应加班</td>
        </tr>
        <tr>
            <td colspan="2">申请金额：{{levelObj2.userPay}}</td>
        </tr>
        <tr>
            <td colspan="2">
                备注：
                <dl>
                    <dd>1、</dd>
                    <dt>
                        工作日晚上连续加班4小时及以上的，每人每次可开支夜餐费补助40元。
                        休息日（含国家法定节假日）加班的，连续加班满4小时不到8小时的，可参照夜餐费补助标准开支1次
                        伙食补助；连续加班满8小时及以上的，可参照夜餐费补助标准开支2次伙食补助。
                    </dt>
                </dl>
                <dl>
                    <dd>2、</dd>
                    <dt>
                        该表单一式两份，一份用于报销审批，一份存档装订备查。
                    </dt>
                </dl>
            </td>
        </tr>
    </table>
</div>
</template>

<script>
import {
    requestEmergencyResponse
} from "@/remote/";
export default {
    props: ['form','monthTime'],
    data(){
        return {
            levelObj1:null,
            levelObj2:null,
        }
    },
    methods: {
        formatPayload() {
            return this.form;
        }
    },
    computed: {
        loginInfo(){
            const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
            return loginInfo
        },
    },
    mounted(){
        const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
        requestEmergencyResponse({monthTime:this.monthTime,orgId:loginInfo.orgId,level:'1'}).then(res=>{
            this.levelObj1 = res.data
        })
        requestEmergencyResponse({monthTime:this.monthTime,orgId:loginInfo.orgId,level:'2'}).then(res=>{
            this.levelObj2 = res.data
        })
    },
}
</script>

<style scoped>
.dialog-table-main {
    border: 1px solid #ddd;
    border-collapse: collapse;

    td {
        border: 1px solid #ddd;
        line-height: 28px;
        padding: 15px 0;
        padding-left: 20px;
    }

    dt {
        flex: 1;
    }

    dd {
        margin: 0;
    }

    dl {
        display: flex;
    }
}
</style>
