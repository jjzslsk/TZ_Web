<template>
<div class="page-wrapper admin-menu">
    <el-container>
        <common-left-tree :isHeader='true' title="菜单模块" :data="menuData" @click-item="onTreeClickItem" class="left-tree">
            <common-left-tree-actions slot="append" :lastItemClicked="lastItemClicked" @append="onTreeAppend" :actions="['append']"></common-left-tree-actions>
        </common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">菜单管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestMenuList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <!-- <c-button type="add" @click="inputItem({})">添加</c-button> -->
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="code" label="编码" />
                            <el-table-column prop="name" label="名称" />
                            <el-table-column prop="showOrder" label="显示顺序" width="80px"></el-table-column>
                            <el-table-column prop="menuUrl" label="内部路径" />
                            <el-table-column prop="extUrl" label="外部路径" />
                            <el-table-column label="菜单级别">
                                <template slot-scope="{row}">
                                    {{({'0':'根级','1':'第一级','2':'第二级','3':'第三级'})[row.menuLevel]}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="parentName" label="上级菜单名称" width="140px"/>
                            <el-table-column prop="enabled" label="是否显示" >
                                 <template slot-scope="scope">
                                    {{scope.row.enabled == '1' ? '是':'否'}}
                                </template>
                            </el-table-column>
                            <el-table-column prop label="操作" width="140px">
                                <template slot-scope="scope">
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
    <dialog-form title="添加菜单" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.name" remote="requestDialogFormMenuItemInputAdd"
      v-if="formLeftTree" @success="submitSuccess">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <form-items :form="formLeftTree" :data='menuList'></form-items>
        </template>
    </dialog-form>
    <dialog-form title="编辑菜单" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name" remote="requestDialogFormMenuItemInputUpdate"
        v-if="formItem" @success="submitSuccess">
        <template>
            <form-items :form="formItem" :data='menuList'></form-items>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestMenuListDelItem,
    requestMenu,
    requestTreeChildrenOfMenuNode,
    requestMenuList
} from "@/remote/";
import {
    mapActions,mapGetters
} from 'vuex'
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
import formItems from './form-items.vue'
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    components: {
        formItems
    },
    inject:['reload'],   
    data() {
        return {
            menuData:[],
            menuList:null,
            query: {
                id: "",
                // XXXPROP_MENU_4: ""
            },
            // menuTree:null
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestMenuListDelItem;
        },
    },
    mounted(){
        this.requestData()
    },
    //     mounted(){
    //     // let vm =this
    //     // vm.remoteData(vm.remote.data.list)
    // },
    // created(){
    //     // this.remoteData(this.remote.data.list)
    // },
    watch:{
        // menuTree(list){
        //     this.remoteData(list)
        // }
    },
    methods: {
        handleNodeClick(item){
            console.log(item)
        },
        //初始化页面数据
        requestData(){
            requestMenuList().then(res=>{
                this.menuList = [],
                this.menuList = res.data.list
            })
            // this.getMenuInfo().then(res=>{
            //     this.menuTree = res.data.list
            // })
            requestTreeChildrenOfMenuNode().then(res => {
                this.menuData = res.data
            })
        },

        submitSuccess(res){
            this.onConfirmUpdate()
            this.requestData()
            this.reload();
        },
        getFormItemByInputItem(item = {}) {
            const {
                lastItemClicked
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            return {
                // "XXXPROP_MENU_id": "",
                "id": item.id,
                "name": item.name,
                "parentId": item.parentId,
                "parentName": item.parentName,
                "menuLevel": item.menuLevel,
                // "XXXPROP_MENU_4": lastKeyItemClicked,extUrl
                "enabled": item.enabled,
                "showOrder": item.showOrder,
                "code": item.code,
                "menuUrl": item.menuUrl,
                "imageUrl": item.imageUrl,
                "extUrl": item.extUrl,

                // ...item
            };
        },
        getFormItemLeftByInputItem(item) {
            const {
                lastItemClicked
            } = this;
            console.log ('item:1',item)
            console.log ('lastItemClicked:1',lastItemClicked)
            return item ? item : {
                // "name": '',
                // "parentId": lastItemClicked.id,
                // "parentName": lastItemClicked.label,
                // "menuLevel": '',
                // "enabled": '',
                // "showOrder": '',
                // "code": '',
                // "menuUrl": '',
                // "imageUrl": '',
                type:1
            };
        },
        ...mapActions(['getMenuInfo']),

    }
    
};
</script>
<style lang='postcss'>
.admin-menu {
    height: calc(100% - 20px);
    .left-tree {
        .el-card{
            height: calc(100% - 2px);
            .el-card__body {
                height: 100%;
                .text {
                    height: 100%;
                    position: relative;
                    .tree {
                        height: calc(100% - 175px);
                    }
                }
            }
        }
    }
    .common-left-tree-actions {
        position: absolute;
        bottom: 90px;
        left: 0;
        width: 100%;
        padding:30px 0 !important;
        height: 30px;
    }
}
</style>