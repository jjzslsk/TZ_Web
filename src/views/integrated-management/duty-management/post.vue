<template>
<div class="page-wrapper">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">岗位管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestPostList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <c-button type="add" @click="inputItem()">新增</c-button>
                            </div>
                            <el-table-column prop="" type="index" label="序号" width="80px"></el-table-column>
                            <el-table-column prop="orgName" label="所属机构" width="200px"/>
                            <el-table-column prop="codeJob" label="岗位编码" width="120px"/>
                            <el-table-column prop="name" label="岗位名称" width="120px"/>
                            <el-table-column label="是否值班" width="80px">
                                <template slot-scope="scope">
                                    {{scope.row.isUse == '1' ?'是':'否'}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="showOrder" label="显示顺序" width="80px"/>
                            <el-table-column prop="userName" label="值班人员" :show-overflow-tooltip="true"/>
                            <el-table-column prop="remark" label="岗位职责" :show-overflow-tooltip="true"/>
                            <el-table-column prop label="操作" width="200px">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="inputAuthOfItem(scope.row)">人员选择</el-button>
                                    <el-button type="text" size="small" @click="inputItem(scope.row)">编辑</el-button>
                                    <c-button type="del" @click="onConfirmDelete(scope.row)">
                                        <span class="text-danger">删除</span>
                                    </c-button>
                                </template>
                            </el-table-column>
                        </page-table>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
    <dialog-form title="岗位" @success="submitSuccess" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name" remote="requestDialogFormPostItemInput" v-if="formItem">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="岗位编码" label-width="120px">
                <el-input v-model="formItem.codeJob" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="岗位名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示顺序" label-width="120px">
                <el-input v-model="formItem.showOrder" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="值班人员" label-width="120px">
                <el-select v-model="formItem.userName" placeholder="请选择">
                    <el-option v-for="item in dutyUserList" :label="item.name" :value="item.name" :key="item.id"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="是否值班" label-width="120px">
                <el-select v-model="formItem.isUse" placeholder="请选择">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="岗位职责" label-width="120px">
                <el-input v-model="formItem.remark" autocomplete="off"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
    <dialog-submit @success="submitSuccess" title="人员授权" :visible.sync="visibleDialogFormAuth" :getPayload="()=>formAuth" :confirmDisabled="false" remote="requestDialogFormPostItemInput" v-if="formAuth">
        <template>
            <auth-main :form="formAuth" v-if='visibleDialogFormAuth'></auth-main>
        </template>
    </dialog-submit>
</div>
</template>

<script>
import {
    requestPostListDelItem,
    requestPostUserList
} from "@/remote/";
import {
    common,
    witchCommonList
} from '../../mixins/index';
import {
    mapActions,mapGetters
} from 'vuex'
import AuthMain from '../duty-management/components/auth-main'
export default {
    components: {
        AuthMain,
    },
    mixins: [common, witchCommonList],
    data() {
        return {
            // 人员授权
            visibleDialogFormAuth: false,
            formAuth: [],
            query: {
                'orgId':null
            },
            dutyUserList:null,
            loginInfo:null
        };
    },
    computed: {
        ...mapGetters(['accountOrgId']),
        actionOfListDelItem() {
            return requestPostListDelItem;
        }
    },
    mounted(){
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        this.query.orgId = this.loginInfo.orgId
        console.log(this.query.orgId)
        // requestPostUserList({orgId:loginInfo.orgId}).then(res=>{
        //     if(res.success){
        //         this.dutyUserList = res.data.list
        //     }
        // })
    },
    methods: {
        inputAuthOfItem(item = {}) {
            this.formAuth = {
                id:item.id,
                userId:item.userId,
                orgId:this.query.orgId
            };
            this.visibleDialogFormAuth = true;
        },
        submitSuccess(res){
            this.onConfirmUpdate()
        },
        getFormItemByInputItem(item) {
            console.log(item)
            return item ? {
                // id:'',
                // codeJob:'',
                // name:'',
                // userId:'',
                // userName:'',
                // remark:''
                // userId:this.loginInfo.id,
                id:item.id,
                orgId:item.orgId,
                codeJob:item.codeJob,
                name:item.name,
                isUse:item.isUse + "",
                showOrder:item.showOrder,
                // userId:item.userId,
                // userName:item.userName,
                remark:item.remark,
                // ...item,
            } : {
                // 'userId':this.loginInfo.id,
                'orgId':this.loginInfo.orgId,
                'showOrder':'',
                'codeJob':'',
                'name':'',
                // 'userName':'',
                'remark':''
                // ...item
            };
        },
        
        formatPayloadLeft(payload){
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
            const {query} = this
            return {
                'orgId':loginInfo.orgId,
                ...payload
            }
            },
    }
};
</script>
<style scoped>
</style>
