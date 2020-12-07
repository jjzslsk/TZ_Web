<template>
<div class="page-wrapper">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">产品预约管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestProductAppoint" :formatPayload="formatPayload">
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="productInfoName" label="名称" />
                            <el-table-column prop="make_time" label="产品时次" />
                            <el-table-column prop="tiMing" label="预约时间" />
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
    <dialog-form title="时间修改" class="dialog-box-wrapper" @success="submitSuccess" :visible.sync="visibleDialogFormItem" :getPayload="()=>formItem" :confirmDisabled="!formItem.createTime" remote="requestDialogFormProductAppointInput" v-if="formItem">
        <template>
            <el-form-item label="修改预约时间" label-width="120px">
                    <el-date-picker
                        v-model="formItem.tiMing"
                        :popper-class="'currentDatePickerClass'"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="选择日期时间">
                    </el-date-picker>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestProductAppointDelItem,
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
            query: {
            }
        };
    },
    mounted(){
        this.requestData()
    },
    
    computed: {
        actionOfListDelItem() {
            return requestProductAppointDelItem;
        }
    },
    methods: {
        //初始化页面数据
        requestData(){

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
                ...item,
            };
        },
    }
};
</script>
<style lang="postcss" scoped>
</style>
<style lang="postcss">
.dialog-box-wrapper{
    .el-dialog{
        width: 700px !important;
    }
}
</style>
