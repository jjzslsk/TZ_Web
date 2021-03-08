<template>
<div class="page-wrapper organ">
    <el-container>
        <common-left-tree title="机构信息" :isHeader='true' :data="organData" @click-item="onTreeClickItem" class="left-tree"></common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">机构管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestOrganList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">搜索名称：</span>
                                <el-input v-model="query.name" placeholder="请输入标识"></el-input>

                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem({})">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="code" label="编号" />
                            <el-table-column prop="name" label="名称" />

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
    <dialog-form @success="submitSuccess" title="机构" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name" remote="requestDialogFormOrganItemInput" v-if="formItem">
        <template>
            <el-form-item label="上级机构" label-width="120px">
                <el-select v-model="formItem.parentId" placeholder="请选择">
                    <el-option v-for="item in organList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编号" label-width="120px">
                <el-input v-model="formItem.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="所属地区" label-width="120px">
                <el-select v-model="formItem.areaId" placeholder="请选择">
                    <el-option :label="item.label" v-for="item in areaList" :key="item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestOrganListDelItem,
    requestTreeChildrenOfOrganNode,
    requestTreeChildrenOfAreaNode,
    requestOrganList
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
            organData:[],
            areaList:null,
            organList:null,
            query: { 
                // XXXPROP_ORGAN_name: "",
                // queryCode: ""
            }
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestOrganListDelItem;
        }
    },
    mounted(){
        this.requestData()
    },
    methods: {
        handleNodeClick(item){
            console.log(item)
        },
        //初始化页面数据
        requestData(){
            requestOrganList().then(res =>{
                this.organList = res.data.list
                this.organList.unshift({
                    name:'顶级',
                    id:'0'
                })
            })
            requestTreeChildrenOfOrganNode().then(res => {
            this.organData = res.data
            })
            requestTreeChildrenOfAreaNode().then(res => {
                let areaList = []
                function remoteData(list){
                    list.map((item)=>{
                        areaList.push(item)
                        if(item.children){
                            remoteData(item.children)
                        }
                    })
                    return areaList
                }
                this.areaList = remoteData(res.data)
                // this.areaList.unshift({id:'0',label:'一级地区'})
            })
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
            return item? {
                "id":item.id,
                "code": item.code,
                "name": item.name,
                "parentId": item.parentId,
                "areaId": item.areaId,
                "areaName": item.areaName,
                "remark": item.remark, 
            } : {
                "code": "",
                "name": "",
                "parentId": "",
                "areaId": "",
                "areaName": "",
                // "queryCode": "",
                "remark": "",

            }
                
        },
    }
};
</script>
<style lang='postcss'>
.organ {
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
