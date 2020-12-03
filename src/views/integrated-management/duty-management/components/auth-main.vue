<template>
<div class="auth-main-wrapper">
    <el-container>
        <el-aside width="300px">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>人员列表</span>
                </div>
                <div>
                    <!-- {{currentDataId}} -->
                    <!-- <c-tree remote="requestTreeChildrenOfAreaNode1" :show-checkbox="true" :default-checked-keys="['leaf3']" @click-item="onTreeClickItemAuth"></c-tree> -->
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
        <!-- <el-main>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>已授权人员</span>
                </div>
                <div>
                    <table-block ref="table" remote="requestUserList" :formatPayload="formatPayload">
                        <div class="actions" slot="actions">
                            <span class="title">用户名称：</span>
                            <el-input v-model="query.XXXPROP_USER_name" placeholder=""></el-input>
                            <span class="title">机构名称：</span>
                            <el-select v-model="query.XXXPROP_USER_4" clearable placeholder="请选择">
                                <el-option label="台州市气象局" value="TZ"></el-option>
                                <el-option label="黄岩区气象局" value="HY"></el-option>
                            </el-select>
                            <c-button type="search" @click="search()">搜索</c-button>
                        </div>
                        <el-table-column prop="XXXPROP_USER_id" label="序号" width="80px"></el-table-column>
                        <el-table-column prop="XXXPROP_USER_1" label="用户名称" width="180px" />
                        <el-table-column label="机构名称" width="180px">
                            <template slot-scope="{row}">
                                {{({'TZ':'台州市气象局','HY':'黄岩区气象局'})[row.XXXPROP_USER_4]}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="XXXPROP_USER_3" label="性别" width="80px" />
                        <el-table-column prop="XXXPROP_USER_7" label="电话" />
                    </table-block>
                </div>
            </el-card>
        </el-main> -->
        <!-- <button @click="getCheckedKeys">提交</button> -->
    </el-container>
</div>
</template>

<script>
import {
    requestRoleAuthInput,
    requestAllUserList
} from "@/remote/";
// import {
//     common,
//     witchCommonList,
//     withCommonLeftTree
// } from '../../mixins/index';
export default {
    // mixins: [common, witchCommonList,withCommonLeftTree],
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
        // console.log(data, checked, indeterminate);
        // if(checked){
        //     this.currentDataId.push(data.id)
        //     this.currentDataName.push(data.name)
        // }else if(!checked){
        //    let arrId = this.currentDataId.filter((item) => item !== data.id);
        //    this.currentDataId = arrId
        //    let arrName = this.currentDataName.filter((item) => item !== data.name);
        //    this.currentDataName = arrName
        // }
        // this.form.userId = this.currentDataId.toString()
        // this.form.userName = this.currentDataName.toString()


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

            // return this.query
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
