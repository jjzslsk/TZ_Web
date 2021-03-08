<template>
<div class="page-wrapper page-wrapper-state">
    <el-container>
        <common-left-tree title="产品导航" :isHeader='true' :data="treeData" :searchText='searchText' @click-item="onTreeClickItem" class="left-tree">
            <div slot="head-search" class="head-search">
                <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText"></el-input>
            </div>
        </common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">监控状态</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestPublishList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">产品名称：</span>
                                <el-input v-model="query.productInfoName" clearable placeholder="请输入产品名称"></el-input>
                                <span class="title">制作人：</span>
                                <el-input v-model="query.createUser" clearable placeholder="请输入制作人"></el-input>
                                <span class="title">发布时间：</span>

                                <el-date-picker v-model="query.time" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>

                                <span class="title">内容：</span>
                                <el-input v-model="query.content" clearable placeholder="请输入名称"></el-input>
                                <c-button type="search" @click="search()">搜索</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="60px" type="index"></el-table-column>
                            <el-table-column prop="productInfoName" label="产品名称" width="200px"/>
                            <el-table-column prop="createUser" label="制作人" width="120px"/>
                            <el-table-column prop="createTime" label="制作时间"/>
                            <el-table-column prop="publishUser" label="发布人" width="120px"/>
                            <el-table-column prop="publishTime" label="发布时间"/>
                            <el-table-column prop label="发布监控" width="100px">
                                <template slot-scope="scope">
                                    <el-button size="mini"  type="primary" plain @click="clickItem(scope.row)">
                                        <span class="">监控</span>
                                    </el-button> 
                                </template>
                            </el-table-column>
                            <el-table-column prop label="内容查看" width="300px">
                                <template slot-scope="scope">
                                    <!-- <el-button size="mini"  type="primary" plain>
                                        <span class="">PDF</span>
                                    </el-button> 
                                    <el-button size="mini"  type="primary" plain>
                                        <span class="">WORD</span>
                                    </el-button>  -->
                                    <el-button size="mini" v-if="scope.row.fileType == 'txt'"  @click="clickItemTxt(scope.row)" type="primary" plain>
                                        <span class="">TXT</span>
                                    </el-button> 
                                </template>
                            </el-table-column>
                            <el-table-column prop label="操作" width="200px">
                                <template slot-scope="scope">
                                    <!-- <el-link target="_blank" :href="" :underline="false" style="margin-left:15px">
                                        <el-button size="mini" type="warning">下载</el-button>
                                    </el-link> -->
                                    <span class="down" @click="clickDownload(scope.row)">下载</span>
                                    <c-button type="del">
                                        <span class="text-danger">失败重发</span>
                                    </c-button>
                                    <c-button type="del">
                                        <span class="text-danger">全部重发</span>
                                    </c-button>
                                    <!-- <el-button size="mini" type="text" size="small" @click="inputItem(scope.row)">编辑</el-button>
                                    <c-button type="del" @click="onConfirmDelete(scope.row)">
                                        <span class="text-danger">删除</span>
                                    </c-button> -->
                                </template>
                            </el-table-column>
                        </page-table>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
    <c-dialog class="txt" title="内容查看" :visible.sync="visibleDialogFormItemTxt" :primary-text="null" :secondary-text="'关闭'" width="600px">
        <div class="content">
            <el-input
                type="textarea"
                :rows="20"
                v-model="contentTxt"
                :disabled="true"
                >
            </el-input>
        </div>
    </c-dialog>
     <dialog-form title="产品标签导航" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.label||formLeftTree.label.legend==0||formLeftTree.parentId===undefined" remote="requestDialogFormDictTypeInput1"
      v-if="formLeftTree">

    </dialog-form>

    <c-dialog title="状态监控" :visible.sync="visibleDialogFormItem" :primary-text="null" :secondary-text="'关闭'" width="80%">
        <div class="monitoring-box">
            <trace-main :data="formItem" v-if="visibleDialogFormItem"></trace-main>
        </div>
    </c-dialog>
</div>
</template>

<script>
import {
    requestDictListDelItem,
    requestProductInfoTpyeTreeList,
    requesProductMadeDown
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
import traceMain from './components/trace-main';
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    components: {
        traceMain
    },
    data() {
        return {
            visibleDialogFormItemTxt:false,
            contentTxt:null,
            searchText:null,
            treeData:[],
            query: {

                publishUser:null
            }
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestDictListDelItem;
        }
    },
    mounted(){
        this.requestData()
    },
    watch:{
            query:{
            handler(val, oldVal){
                if(val.time){
                    this.query.beforeTime = val.time[0],
                    this.query.afterTime = val.time[1]
                }else{
                    this.query.beforeTime = null,
                    this.query.afterTime = null
                }
            },
            deep:true
        }
    },
    methods: {
    clickItemTxt(data){
        this.visibleDialogFormItemTxt = true
        this.contentTxt = data.content
    },
    clickDownload(data){
        let param = {
            fileName:data.fileName,
            filePath:data.filePath
        }
        requesProductMadeDown(param).then(res=>{
            this.$message.success("下载完成");
        })
    },
    clickItem(data){
        if(data.publish == 0){
            this.$message.warning("产品未发布！");
            return
        }
        this.inputItem(data)
    },
    handleNodeClick(){},
      //初始化页面数据
      requestData(){
        requestProductInfoTpyeTreeList().then(res => {
          this.treeData = res.data.list
        });
      },
        getFormItemByInputItem(item = {}) {
            const {
                lastItemClicked
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            return {
                "productInfoName": "",
                "createTime": "",
                "publishTime": "",
                "publishUser": '',
                "XXXPROP_AREA_6": "",
                lastItemClicked,
                ...item
            };
        },
        getFormItemLeftByInputItem() {
            const {
                lastItemClicked
            } = this;

            return {111:123}
        },
    }
};
</script>
<style lang='postcss'>
.page-wrapper-state{
    .el-date-editor--daterange{
        .el-input__inner{
            width: 252px;
        }
    }
    .txt{
        .content{
            min-height: 400px;
            min-width: 400px;
            .el-input {
                height: 400px;
                width: 400px;
            }
            .el-textarea.is-disabled {
                .el-textarea__inner{
                    background: #fff;
                    color:#606266;
                    cursor: text;
                }
            }
        }
    }
    .monitoring-box {
        height: 670px;
        overflow: auto;
    }
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
                        height: calc(100% - 120px);
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
    .el-main {
        .el-card{
            height: calc(100% - 2px);
            position: relative;
            .el-card__header {
                height: 55px;
            }
            .el-card__body {
                height: calc(100% - 55px);
                .text{
                    height: 100%;
                    .list{
                        height: 100%;
                        .list-table{
                            height: 100%;
                            .actions{
                                height: 56px;
                                }
                            .el-table{
                                overflow: auto;
                                height: calc(100% - 162px);
                                .down{
                                    cursor:pointer;
                                }
                            }
                        }
                    }
                    
                }
            }
        }
}
}
</style>
