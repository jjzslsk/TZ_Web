<template>
<div class="page-wrapper">
    <!-- {{formItem}} -->
    <el-container>
        <common-left-tree :isHeader='true' @success="submitSuccess" title="字典类型" :data="treeData" @click-item="onTreeClickItem" class="left-tree">
            <common-left-tree-actions @success="submitSuccess" slot="append" :lastItemClicked="lastItemClicked" @append="onTreeAppend" @edit="onTreeEdit" @delete="onTreeDeleteMinor('requestDictListDelType')"></common-left-tree-actions>
        </common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">字典管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestDictList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">搜索编码：</span>
                                <el-input v-model="query.code" placeholder="请输入标识"></el-input>
                                <span class="title">搜索名称：</span>
                                <el-input v-model="query.name" placeholder="请输入名称"></el-input>
                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem()">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="dictionaryTypeName" label="所属类型" />
                            <el-table-column prop="code" label="编码" />
                            <el-table-column prop="name" label="名称" />
                            <el-table-column prop="showOrder" label="显示顺序" width="80px" />
                            <el-table-column prop="searchSign" label="查找标识" />
                            <el-table-column prop="description" label="描述" />
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
    <dialog-form @success="submitSuccess" title="字典类型" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.name||formLeftTree.name.legend==0||formLeftTree.parentId===undefined" remote="requestDialogFormDictTypeInput"
      v-if="formLeftTree">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="分类名称" label-width="120px">
                <el-input v-model="formLeftTree.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类编码" label-width="120px">
                <el-input v-model="formLeftTree.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="上级类型" label-width="120px">
                <el-select v-model="formLeftTree.parentId" placeholder="请选择">
                    <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key='item.id'></el-option>
                    <!-- <el-option label="叶子结点1" value="leaf1"></el-option>
                    <el-option label="叶子结点2" value="leaf2"></el-option>
                    <el-option labels="可展开类目1" value="zone1"></el-option>
                    <el-option label="可展开类目2" value="zone2"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item label="显示顺序" label-width="120px">
                <el-input v-model="formLeftTree.showOrder" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" label-width="120px">
                <el-input v-model="formLeftTree.description" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
    <dialog-form @success="submitSuccess" title="字典条目" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.code" remote="requestDialogFormDictItemInput" v-if="formItem">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="编码名称" label-width="120px">
                <el-input v-model="formItem.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示顺序" label-width="120px">
                <el-input v-model="formItem.showOrder" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属类型" label-width="120px">
                <el-select v-model="dictionaryType" placeholder="请选择">
                    <el-option v-for="(item,index) in treeDataList" :label="item.label" :value="item.id" :key='index'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="查找标识" label-width="120px">
                <el-input v-model="formItem.searchSign" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" label-width="120px">
                <el-input v-model="formItem.description" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestDictListDelItem,
    requestDictTree
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    data() {
        return {
            // fileObj:{
            //     file:null,
            //     fileName:'',
            //     monthTime:'',
            //     orgId:'',
            // },
            treeData:[],
            treeDataList:[],
            dictionaryType:null,
            dictionaryTypeName:null,
            query: {
                // search_sign: "",
                // XXXPROPDICT_name: ""
            }
        };
    },
    watch:{
        dictionaryType(data){
            if(data){
                this.formItem.dictionaryTypeId = data
                this.treeDataList.forEach(item =>{
                    if(item.id == this.formItem.dictionaryTypeId){
                        this.formItem.dictionaryTypeName = item.label
                    }
                })
            }
        },
    },
    computed: {
        actionOfListDelItem() {
            return requestDictListDelItem;
        }
    },
    mounted(){
        this.requestData()
    },
    methods: {
        formatPayloadLeft(payload){
            console.log(payload)
            payload.dictionaryTypeId = payload.id
            delete payload.id
            return {
                ...payload,
            }
        },
         //初始化页面数据
        requestData(){
            requestDictTree().then(res => {
            this.treeData = res.data
            this.treeOfList(res.data)
            });
        },
        handleNodeClick(item){
            console.log(item)
        },
        submitSuccess(res){
            this.treeDataList = []
            this.onConfirmUpdate()
            this.requestData()
        },
        treeOfList(tree){
        tree.map(item => {
          if(!item) return
          this.treeDataList.push(item)
          if(item.children){
            this.treeOfList(item.children)
          }
        })
      },
        getFormItemByInputItem(item) {
            const {
                lastItemClicked
            } = this;
            const lastIdItemClicked = lastItemClicked && lastItemClicked.id;
            const lastNameItemClicked = lastItemClicked && lastItemClicked.label;
            console.log("lastItemClicked::",lastItemClicked)
            console.log("item::",item)
            if(item){
                if(item.dictionaryTypeName && item.dictionaryTypeId){this.dictionaryType = item.dictionaryTypeId,this.dictionaryTypeName = item.dictionaryTypeName;}
                else{this.dictionaryType = '',this.dictionaryTypeName = ''}
            }else{this.dictionaryType = '',this.dictionaryTypeName = ''}
            // if(item){this.dictionaryType = item.dictionaryTypeId}
            // if(lastIdItemClicked){this.dictionaryType = item.dictionaryTypeId}
            return item ? {
                "id": item.id,
                "code": item.code,
                "name": item.name,
                "showOrder": item.showOrder,
                "dictionaryTypeId": item.dictionaryTypeId,
                "dictionaryTypeName": item.dictionaryTypeName,
                "searchSign": item.searchSign,
                "description": item.description,
                // ...item
            }:{
                "code": "",
                "name": "",
                "showOrder": "",
                // "dictionaryTypeId": lastIdItemClicked ? lastIdItemClicked : '',
                // "dictionaryTypeName": lastNameItemClicked ? lastNameItemClicked : '',
                "dictionaryTypeId": '',
                "dictionaryTypeName": '',
                "searchSign": "",
                "description": "",
            };
        },
        getFormItemLeftByInputItem(item) {
            const {
                lastItemClicked
            } = this;
            return item ? {
                "id": item.id,
                "code": item.code,
                "name": item.label,
                "showOrder": item.showOrder,
                "parentId": item.parentId,
                "parentName": item.parentName,
                "description": item.description,
            } : {
                // parentId: lastItemClicked.id,
            };
        },
    }
};
</script>
<style scoped>
</style>
