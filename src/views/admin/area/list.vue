<template>
<div class="page-wrapper area">
    <el-container>
        <common-left-tree class="left-tree" :isHeader='true' @success="submitSuccess" title="地区信息" :data="areaData" @click-item="onTreeClickItem"></common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">地区管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestAreaList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">搜索编码：</span>
                                <el-input v-model="query.code" placeholder="请输入名称"></el-input>
                                <span class="title">搜索名称：</span>
                                <el-input v-model="query.name" placeholder="请输入标识"></el-input>

                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem({})">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <!-- <el-table-column prop="" label="序列" width="80px" :type="typeIndex"></el-table-column> -->
                            <el-table-column prop="code" label="编码" />
                            <el-table-column prop="name" label="名称" />
                            <el-table-column prop="parentName" label="上级地区" />

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
    <dialog-form @success="submitSuccess" title="地区" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name" remote="requestDialogFormAreaItemInput" v-if="formItem">
        <!-- <template v-slot:default="{ form }"> -->
        <template>

            <el-form-item label="上级地区" label-width="120px">
                <el-select v-model="formItem.parentId" placeholder="请选择">
                    <el-option :label="item.label" v-for="item in areaList" :key="item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地区编码" label-width="120px">
                <el-input v-model="formItem.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地区名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="描述" label-width="120px">
                <el-input v-model="formItem.remark" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestAreaListDelItem,
    requestTreeChildrenOfAreaNode
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
            areaData:[],
            areaList:[],
            query: {

            }
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestAreaListDelItem;
        }
    },
    mounted(){
        this.requestData()

    },
    methods: {
        //初始化页面数据
        requestData(){
            requestTreeChildrenOfAreaNode().then(res => {
                this.areaData = res.data
                let areaList = []
                function remoteData(list){
                    // console.log(list)
                    list.map((item)=>{
                        areaList.push(item)
                        if(item.children){
                            remoteData(item.children)
                        }
                    })
                    return areaList
                }
                this.areaList = remoteData(res.data)
                this.areaList.unshift({id:'0',label:'一级地区'})
            })
        },
        handleNodeClick(item){
            console.log(item)
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
            console.log(item)
            console.log(lastItemClicked)
            return item ? { 
                "bodyCode": item.bodyCode,
                "id": item.id,
                "code": item.code,
                "name": item.name,
                "parentId": item.parentId,
                "remark": item.remark
            }:{"bodyCode": '',"code": '',"name": '',"parentId": '',"remark": ''}
        },
    }
};
</script>
<style lang='postcss'>
.area {
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
                        height: calc(100% - 95px);
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