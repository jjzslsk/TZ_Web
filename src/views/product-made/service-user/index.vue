<template>
<div class="page-wrapper service-user">
    <el-container>
        <common-left-tree title="服务用户导航" :isHeader='true' :data="treeData" @click-item="onTreeClickItem" class="left-tree">
            <common-left-tree-actions slot="append" :lastItemClicked="lastItemClicked" @append="onTreeAppend" @edit="onTreeEdit" @delete="onTreeDelete('requestServiceUserTreeListDelItem')"></common-left-tree-actions>
        </common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">服务用户管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestServiceUserList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">搜索名称：</span>
                                <el-input v-model="query.name" clearable placeholder="请输入标识"></el-input>
                                <span class="title">搜索地址：</span>
                                <el-input v-model="query.address" clearable placeholder="请输入名称"></el-input>
                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem()">添加</c-button>
                            </div>
                            <el-table-column type="index" label="序列" width="80px"></el-table-column>
                            <el-table-column prop="name" label="名称" />
                            <el-table-column prop="address" label="地址" />
                            <el-table-column prop label="操作" width="200px">
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
     <dialog-form title="服务用户分类" @success="submitSuccess" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.name||formLeftTree.serviceUserTypeIds.length == 0" remote="requestDialogFormServiceUserInput"
      v-if="formLeftTree">
        <template>
            <el-form-item label="上级类型" label-width="120px">
                <el-cascader
                v-model="formLeftTree.serviceUserTypeIds"
                :options="popupTreeData"
                :props="{ checkStrictly: true }"
                clearable></el-cascader>
                <!-- <el-select v-model="formLeftTree.pid" placeholder="请选择">
                    <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key="item.id"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="渠道" label-width="120px">
                <el-input v-model="formLeftTree.channel" :disabled="showChannel" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类名称" label-width="120px">
                <el-input v-model="formLeftTree.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序" label-width="120px">
                <el-input v-model="formLeftTree.sort" autocomplete="off"></el-input>
            </el-form-item>
        </template>
    </dialog-form>

    <dialog-form @success="submitSuccess" title="服务用户" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name || formItem.serviceUserTypeIds.length == 0" remote="requestDialogFormServiceUserItemInput" v-if="formItem">
        <template>
            <el-form-item label="所属分类" label-width="120px">
                <el-cascader
                v-model="formItem.serviceUserTypeIds"
                :options="treeData"
                :props="{ checkStrictly: true }"
                clearable></el-cascader>
                <!-- <el-select v-model="formItem.serviceUserTypeId" placeholder="请选择">
                    <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key="item.id"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" label-width="120px">
                <el-input v-model="formItem.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所在省/直辖市" label-width="120px">
                <el-input v-model="formItem.province" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="市" label-width="120px">
                <el-input v-model="formItem.city" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="区/县" label-width="120px">
                <el-input v-model="formItem.country" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="乡/镇" label-width="120px">
                <el-input v-model="formItem.town" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="村/街道" label-width="120px">
                <el-input v-model="formItem.village" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系人" label-width="120px">
                <el-input v-model="formItem.linkMan" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" label-width="120px">
                <el-input v-model="formItem.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="附件名称" label-width="120px">
                <el-input v-model="formItem.sendName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" label-width="120px">
                <el-input v-model="formItem.remarks" autocomplete="off"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestServiceUserList,
    requestServiceUserListDelItem,
    requestServiceUserTreeList
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree,
} from '../../mixins/index';
import {
    mapActions,mapGetters
} from 'vuex'
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    data() {
        return {
            treeDataList:[],
            treeData:[],
            popupTreeData:[],
            loginInfo:null,
            showChannel:true,
            collection:[],
            collection1:[],
            query: {},
            // formItem:{
            //     serviceUserTypeIds:null,
            // }
        };
    },
    computed: {
        ...mapGetters(['accountOrgId']),
        actionOfListDelItem() {
            return requestServiceUserListDelItem;
        }
    },
    watch:{
        // 'formLeftTree.pid':{
        //     handler: function(val, oldVal) {
        //         this.collection.forEach(i=>{
        //             if(val != 'null' && i.id == val){
        //                 this.showChannel = true
        //                 this.formLeftTree.channel = i.channel
        //             }
        //         })
        //         if(val == 'null'){this.showChannel = false}
        //  },
        // },
        'formLeftTree.serviceUserTypeIds':{
            handler: function(val, oldVal) {
                this.formLeftTree.pid = val[val.length-1]
                this.collection.forEach(i=>{
                    if(val[val.length-1] != 'null' && i.id == val[val.length-1]){
                        this.showChannel = true
                        this.formLeftTree.channel = i.channel
                    }
                })
                if(val[val.length-1] == 'null'){this.showChannel = false}
         },
        },
        
    },
    methods: {
        submitSuccess(res){
            this.onConfirmUpdate()
            this.requestData()
        },
        requestData(){
            requestServiceUserTreeList().then(res => {
                this.popupTreeData = []
                this.treeData = res.data.list;
                res.data.list.forEach(element => {
                    this.popupTreeData.push(element)
                });;
                this.popupTreeData.unshift({id:'null',label:'一级分类'})
                this.treeOfList(this.popupTreeData);

                //树形 
                // this.collection1 = this.treeData
                // this.treeData = this.collection1.filter((item,index) =>{
                //     item.pid = item.parentId
                //     delete item.parentId
                //     return item.type == 'userType'
                // })
                // this.treeData.unshift({id:'null',label:'一级分类'})

                //平级
                this.treeDataList = [];
                this.treeOfList(res.data.list);
                this.collection = this.treeDataList
                this.treeDataList = this.collection.filter((item,index) =>{
                    item.pid = item.parentId
                    delete item.parentId
                    return item.type == 'userType'
                })
                this.treeDataList.unshift({id:'null',label:'一级分类'})
            });
        },
        handleNodeClick(item){
            console.log(item)
        },
    // formatPayload(payload) {
    //     this.loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
    //   return {
    //     orgId:this.loginInfo.orgId,
    //     pageIndex: 1,
    //     pageSize: 5,
    //     ...payload
    //   };
    // },
        treeOfList(tree) {
        tree.map(item => {
            this.treeDataList.push(item);
            if (item.children) {
            this.treeOfList(item.children);
            }
            if (item.children == [] || item.children == null || item.children == undefined || item.children.length == 0) {//删除多余的children
                delete item.children
            }
            item.value = item.id
        });
        },
        getFormItemByInputItem(item) {
            const {
                treeDataList,
                lastItemClicked,
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            if(item){
                    // item.serviceUserTypeIds = item.serviceUserTypeIds? [item.id]:item.serviceUserTypeIds
            }else{
                item = {}
                if(lastItemClicked){
                    item.serviceUserTypeIds = lastItemClicked.pid? [lastItemClicked.pid,lastItemClicked.id]:[lastItemClicked.id]
                }else{
                    item = {}
                    item.serviceUserTypeIds = [ "null" ] 
                }
                item.orgId = this.accountOrgId
            }
            return item
        },
        getFormItemLeftByInputItem(item) {
            this.formLeftTree = {}
            const {
                lastItemClicked,
            } = this;
            if(item){
                item = {
                id:item.id,
                name:item.label,
                pid:item.pid,
                channel:item.channel,
                sort:item.sort,
                orgId:this.accountOrgId,
                serviceUserTypeIds:lastItemClicked.pid? [lastItemClicked.pid,lastItemClicked.id]:[lastItemClicked.id]
            }
            }else{
                item = {}
                if(lastItemClicked){
                    item.serviceUserTypeIds = lastItemClicked.pid? [lastItemClicked.pid,lastItemClicked.id]:[lastItemClicked.id]
                }else{
                    item = {}
                    item.serviceUserTypeIds = [ "null" ] 
                }
                item.orgId = this.accountOrgId
            }
            return item
        },
    },
    mounted () {
        this.requestData()
    },
};
</script>
<style lang='postcss' scoped>

</style>
<style lang='postcss'>
.service-user {
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
                        height: calc(100% - 180px);
                    }
                }
            }
        }
    }
    .el-cascader input {
        width: 400px;
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
