<template>
<div class="page-wrapper product-label">
    <el-container>
        <common-left-tree title="产品标签导航" :isHeader='true' :data="treeData" @click-item="onTreeClickItem" class="left-tree">
            <common-left-tree-actions @success="submitSuccess" slot="append" :lastItemClicked="lastItemClicked" @append="onTreeAppend" @edit="onTreeEdit" @delete="onTreeDelete('requestProductLabelTreeListDelItem')"></common-left-tree-actions>
        </common-left-tree>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">产品标签管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table @success="submitSuccess" ref="table" remote="requestProductLabelList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">搜索名称：</span>
                                <el-input v-model="query.name" clearable placeholder="搜索名称"></el-input>
                                <span class="title">搜索编码：</span>
                                <el-input v-model="query.code" clearable placeholder="搜索编码"></el-input>
                                <!-- <span class="title">行政级别：</span>
                                <el-select v-model="query.XXXPROP_AREA_name" clearable placeholder="请选择">
                                    <el-option label="地级市" value="city"></el-option>
                                    <el-option label="区/县" value="county"></el-option>
                                </el-select> -->
                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem()">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="code" label="编码" />
                            <el-table-column prop="name" label="名称" />
                            <el-table-column prop="sort" label="显示顺序" />
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
     <dialog-form @success="submitSuccess" title="产品标签导航" :visible.sync="visibleDialogFormLeftTree" :getPayload="()=>formLeftTree" :confirmDisabled="!formLeftTree.name||formLeftTree.name.legend==0||formLeftTree.code===undefined" remote="requestDialogFormProductLabelTreeItemInput"
      v-if="formLeftTree">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="上级类型" label-width="120px">
                <el-select v-model="formLeftTree.pid" placeholder="请选择">
                    <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key='item.id'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类编码" label-width="120px">
                <el-input v-model="formLeftTree.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类名称" label-width="120px">
                <el-input v-model="formLeftTree.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示顺序" label-width="120px">
                <el-input v-model="formLeftTree.sort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" label-width="120px">
                <el-input v-model="formLeftTree.description" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
    <dialog-form title="产品标签" @success="submitSuccess" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.name" remote="requestDialogFormProductLabelItemInput" v-if="formItem">
        <template>
            <el-form-item label="标签分类" label-width="120px">
                <el-select v-model="formItem.labelTypeId" placeholder="请选择">
                    <el-option v-for="item in treeDataList" :label="item.label" :value="item.id" :key='item.id'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编码" label-width="120px">
                <el-input v-model="formItem.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示顺序" label-width="120px">
                <el-input v-model="formItem.sort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" label-width="120px">
                <el-input v-model="formItem.description" autocomplete="off"></el-input>
            </el-form-item>

        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestProductLabelListDelItem,
    requestProductLabelTreeList
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
import {
    mapGetters
} from 'vuex'
export default {
    mixins: [common, witchCommonList, withCommonLeftTree],
    data() {
        return {
            treeData:[],
            treeDataList:[],
            loginInfo:null,
            query: {

            }
        };
    },
    computed: {
        actionOfListDelItem() {
            return requestProductLabelListDelItem;
        }
    },
    mounted(){
        this.requestData()
    },
    methods: {
        handleNodeClick(item){
            console.log(item)
        },
        submitSuccess(){
            this.treeDataList = []
            this.onConfirmUpdate()
            this.requestData()
        },
        requestData(){
            const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
            this.loginInfo = loginInfo

            requestProductLabelTreeList().then(res =>{
                this.treeData = res.data.list
                this.treeOfList(res.data.list)
                 let collection = this.treeDataList
                this.treeDataList = collection.filter((item,index) =>{
                       return item.type == 'labelType'
                })
            })
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
            if(!item && !lastItemClicked){
                this.$message.warning("请先选择产品标签分类!");
            }else{
                const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            // return {
            //     ...item 
            // };
            return item ? item : {
                "labelTypeId":lastItemClicked.id
                };
            }
        },
        getFormItemLeftByInputItem(item) {
            const {
                lastItemClicked
            } = this;
            return item ? item : {
                label: "",
                // pid: lastItemClicked.id,
                level:'1'
                // parent: lastItemClicked
            };
        },
    }
};
</script>
<style scoped>
</style>
<style lang='postcss'>
.product-label {
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
