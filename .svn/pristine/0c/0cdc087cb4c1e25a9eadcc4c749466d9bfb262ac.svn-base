<template>
<div class="menu-main">
    <el-checkbox-group class="menu-checkbox-group" v-model="valueChecked" size="mini">
    <table-block ref="table" remote="requestAuthTreeList" :formatPayload="formatPayload" :hidePagination="true" :span-method="spanMethod">
        <el-table-column prop="XXXPROP_AUTH_id" label="序号" width="80px"></el-table-column>
        <el-table-column label="一级菜单">
            <template slot-scope="{row}">
                <el-checkbox :label="row.ID_1" v-model="row.CHECKED_1" size="mini" border>{{row.NAME_1}}</el-checkbox>
            </template>
        </el-table-column>
        <el-table-column label="二级菜单">
            <template slot-scope="{row}">
                <el-checkbox v-if="row.ID_2!==undefined" :label="row.ID_2" v-model="row.CHECKED_2" size="mini" border>{{row.NAME_2}}</el-checkbox>
            </template>
        </el-table-column>
        <el-table-column label="三级菜单">
            <template slot-scope="{row}">
                <el-checkbox v-for="(item) in row.children" :label="item.value" v-model="item.checked" :key="item.value" size="mini" border>{{item.label}}</el-checkbox>
            </template>
        </el-table-column>
    </table-block>
    </el-checkbox-group>
</div>
</template>

<script>
import {
    requestAuthTreeList
} from "@/remote/";
import {
    common,
    witchCommonList,
    withCommonLeftTree
} from '../../mixins/index';
export default {
    mixins: [common, witchCommonList,withCommonLeftTree],
    props: ['form'],
    data() {
        return {
            valueChecked: [],
        }
    },
    mounted(){
        this.requestData()
    },
    watch:{
        valueChecked(data){
            console.log(data) 
            // this.formMenu = data
        },
    },
    methods: {
        //初始化页面数据
        requestData(){
            console.log(this.form)
            requestAuthTreeList({id:this.form.roleId}).then(res => {
                let allChecked = []
                res.data.list.forEach(element => {
                    if(element.CHECKED_1){
                        allChecked.push(element.ID_1)
                    }
                    if(element.CHECKED_2){
                        allChecked.push(element.ID_2)
                    }
                    if(element.children){
                        element.children.forEach(item => {
                            if(item.checked){
                                allChecked.push(item.value)
                            }
                        });
                    }
                });
                this.valueChecked = allChecked
        })
        this.formatPayloadLeft()
        },
        formatPayloadLeft(payload){
            return {
                'id':this.form.roleId,
                // ...payload
            }
        },
        spanMethod({
            row,
            column,
            rowIndex,
            columnIndex,
            rows
        }) {
            if (columnIndex == 0 || columnIndex == 1) {
                const funSpan = e => e.ID_1 == row.ID_1;
                const spanLength = rows.filter(funSpan).length;
                if (spanLength > 1) {
                    if (rows.findIndex(funSpan) == rowIndex) {
                        return {
                            rowspan: spanLength,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
            this.form.rows = rows;
            this.form.menuId = this.valueChecked
        }
    }
}
</script>

<style lang="css" scoped>
.menu-checkbox-group{
    width: 100%;
}
</style>
<style>
.menu-main .el-table__body-wrapper,.menu-main .is-scrolling-none{
    height: 540px !important;
    overflow: auto !important;
}
</style>
