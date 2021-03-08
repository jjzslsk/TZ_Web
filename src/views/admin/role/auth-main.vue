<template>
<div class="auth-main-wrapper">
    <el-container>
        <el-aside width="300px">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>人员列表</span>
                </div>
                <div>
                    <el-tree
                        :data="userList"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :props="defaultProps"
                        :default-checked-keys='currentData'
                        @check-change="handleCheckChange"
                        ref="tree">
                    </el-tree>
                </div>
            </el-card>
        </el-aside>

    </el-container>
</div>
</template>

<script>
import {
    requestRoleAuthInput,
    requestRoleAuthList
} from "@/remote/";

export default {
    props: ['form'],
    data() {
        return {
            query: {},
            currentData:[],
            userList: [{
                id: 1,
                checked:true,
                label: '一级 1',
                children: [{
                    id: 4,
                    checked:true,
                    label: '二级 1-1',
                    children: [{
                    id: 9,
                    checked:true,
                    label: '三级 1-1-1',
                    }, {
                    id: 10,
                    checked:true,
                    label: '三级 1-1-2'
                    }]
                }]
                }],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    mounted(){
        requestRoleAuthList({id:this.form.roleId}).then(res=>{
            this.currentData = []
            res.data.list.forEach(element => {
                element.checked? this.currentData.push(element.id): element.checked = element.checked
            });

            this.userList = res.data.list
        })
    },
    methods: {
        handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        if(checked){
            this.currentData.push(data.id)
        }else if(!checked){
           let arr = this.currentData.filter((item) => item !== data.id);
           this.currentData = arr
        }
        this.form.userId = this.currentData
      },
        getCheckedKeys() {
            requestRoleAuthInput({roleId:this.form.roleId,userId:this.currentData}).then(res=>{
            })
        },
        formatPayload() {
            return this.query
        },
        search() {
            this.$refs.table.fetchData()
        },
        onTreeClickItemAuth(item) {
            console.log('click-tree-item', item);
            this.lastItemClicked = item;
        },
    }
}
</script>

<style lang="css" scoped>
.el-container{
    display: flex;
    justify-content: center;
}
</style>
