<template>
<div class="page-wrapper">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">产品数据源管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestProductSourceList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">搜索名称：</span>
                                <el-input v-model="query.name" clearable placeholder="请输入名称"></el-input>
                                <span class="title">搜索编码：</span>
                                <el-input v-model="query.type" clearable placeholder="请输入编码"></el-input>
                                <!-- <span class="title">行政级别：</span>
                                <el-select v-model="query.XXXPROP_AREA_name" clearable placeholder="请选择">
                                    <el-option label="地级市" value="city"></el-option>
                                    <el-option label="区/县" value="county"></el-option>
                                </el-select> -->
                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem({})">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="type" label="标签分类编码" />
                            <el-table-column prop="name" label="数据源名称" />
                            <el-table-column prop="source" label="数据来源" />
                            <el-table-column prop="rules" label="解析读取规则" show-overflow-tooltip/>
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
    <dialog-form title="数据源" @success="submitSuccess" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.type" remote="requestDialogFormProductSourceInput" v-if="formItem">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="数据源名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="标签分类编码" label-width="120px">
                <el-select v-model="formItem.type" placeholder="请选择">
                    <el-option v-for="item in treeDataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据来源" label-width="120px">
                <el-input v-model="formItem.source" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="解析规则" label-width="120px">
                <el-input v-model="formItem.rules" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestProductSourceListDelItem,
    requestProductLabelTreeList
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
            treeDataList:[],
            query: {
                // XXXPROP_AREA_id: "",
                // XXXPROP_AREA_name: ""
            }
        };
    },
    mounted(){
        this.requestData()
    },
    
    computed: {
        actionOfListDelItem() {
            return requestProductSourceListDelItem;
        }
    },
    methods: {
        //初始化页面数据
        requestData(){
            requestProductLabelTreeList().then(res =>{
                 let collection = this.treeDataList
                this.treeDataList = res.data.list.filter((item,index) =>{
                       return item.type == 'labelType'
                })
                console.log(this.treeDataList)
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
            return {
                // "XXXPROP_AREA_id": "",
                // "type": "",
                // "name": "",
                // "source": "",
                // "rules": lastKeyItemClicked,
                // "XXXPROP_AREA_5": "",
                // "XXXPROP_AREA_6": "",
                // lastItemClicked,
                ...item,
                type:item.tId
            };
        },
    }
};
</script>
<style scoped>
</style>
