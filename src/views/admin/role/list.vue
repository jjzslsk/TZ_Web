<template>
<div class="page-wrapper">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">角色管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestRoleList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">角色编码：</span>
                                <el-input v-model="query.code" placeholder=""></el-input>
                                <span class="title">角色名称：</span>
                                <el-input v-model="query.name" placeholder=""></el-input>
                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem({})">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="code" label="角色编码" width="280px" />
                            <el-table-column prop="name" label="角色名称" />
                            <el-table-column prop label="操作" width="230px">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="inputMenuOfItem(scope.row)">菜单授权</el-button>
                                    <el-button type="text" size="small" @click="inputAuthOfItem(scope.row)">人员授权</el-button>
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
    <dialog-form @success="submitSuccess" title="角色" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name" remote="requestDialogFormRoleItemInput" v-if="formItem">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="角色编码" label-width="120px">
                <el-input v-model="formItem.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="所在地区" label-width="120px">
                <el-select v-model="formItem.areaId" placeholder="请选择">
                    <el-option v-for="item in areaData" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item> -->
        </template>
    </dialog-form>
    <dialog-submit title="菜单授权" :visible.sync="visibleDialogFormMenu" :getPayload="()=>formMenu" :confirmDisabled="false" remote="requestRoleMenuInput" v-if="formMenu">
        <template>
            <menu-main :form="formMenu" v-if='visibleDialogFormMenu'></menu-main>
        </template>
    </dialog-submit>
    <dialog-submit title="人员授权" :visible.sync="visibleDialogFormAuth" :getPayload="()=>formAuth" :confirmDisabled="false" remote="requestRoleAuthInput" v-if="formAuth">
        <template>
            <auth-main :form="formAuth" v-if='visibleDialogFormAuth'></auth-main>
        </template>
    </dialog-submit>
</div>
</template>

<script>
import {
    requestRoleListDelItem,
    requestTreeChildrenOfAreaNode
} from "@/remote/";
import {
    common,
    witchCommonList
} from '../../mixins/index';
import AuthMain from './auth-main.vue'
import MenuMain from './menu-main.vue'
export default {
    mixins: [common, witchCommonList],
    components: {
        AuthMain,
        MenuMain
    },
    data() {
        return {
            areaData:'',
            query: {
                // XXXPROP_ROLE_id: "",
                // XXXPROP_ROLE_name: ""
            },
            // 人员授权
            visibleDialogFormAuth: false,
            formAuth: [],
            // 菜单授权
            visibleDialogFormMenu: false,
            // formMenu: null
            formMenu: []
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestRoleListDelItem;
        }
    },
    mounted(){
        this.requestData()
    },
    methods: {
        //初始化页面数据
        requestData(){
        //     requestTreeChildrenOfAreaNode().then(res => {
        //     let areaList = []
        //     function remoteData(list){
        //         list.map((item)=>{
        //             areaList.push(item)
        //             if(item.children){
        //                 remoteData(item.children)
        //             }
        //         })
        //         return areaList
        //     }
        //     this.areaData = remoteData(res.data)
        // })
        },
        submitSuccess(res){
            this.onConfirmUpdate()
            this.requestData()
        },
        getFormItemByInputItem(item = {}) {
            const {
                lastItemClicked
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            return {
                // "XXXPROP_ROLE_id": "",
                ...item
            };
        },
            inputMenuOfItem(item = {}) {
                this.formMenu = {
                    roleId:item.id
                    // ...item
                };
                // console.log(item)
                // console.log(this.valueChecked)
                this.visibleDialogFormMenu = true;
            },
        inputAuthOfItem(item = {}) {
            this.formAuth = {
                // ...item
                roleId:item.id
            };
            this.visibleDialogFormAuth = true;
        },
    }
};
</script>
<style scoped>
</style>
