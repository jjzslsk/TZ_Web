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
                        :default-checked-keys='currentDataId'
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
    requestAllUserList
} from "@/remote/";

export default {
    props: ['form'],
    data() {
        return {
            query: {},
            currentDataId:[],
            currentDataName:[],
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
        const loginInfo = JSON.parse(localStorage.getItem('loginInfo',))
        this.loginInfo = loginInfo
        requestAllUserList({orgId:this.loginInfo.orgId}).then(res=>{
            this.currentDataId = []
            res.data.list.forEach(element => {
                element.label = element.name
            });
            // this.userList = [
            //     {
            //     label: '全部',
            //     children: res.data.list
            //     },
            // ]
            this.userList = res.data.list
            this.form.userId.split(",").forEach(i=>{
                    this.currentDataId.push(i)
            })
            this.form.userName.split(",").forEach(i=>{
                    this.currentDataName.push(i)
            })
        })
    },
    methods: {
      getKeys(){
        let keys = this.$refs.tree.getCheckedKeys()
        return keys
      },
      getNodes(){
        let nodes = this.$refs.tree.getCheckedNodes()
        return nodes
      },
      setKeys(data){
          this.$refs.tree.setCheckedKeys(data);
      },
        handleCheckChange(data, checked, indeterminate) {
        let userId = []
        let userName = []
        this.getNodes().forEach(i=>{
            userId.push(i.id)
            userName.push(i.name)
        })
        this.form.userId = userId.toString()
        this.form.userName = userName.toString()
      },

        formatPayload() {
            return {123:123}
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
