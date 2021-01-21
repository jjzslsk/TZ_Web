<template>
<div class="page-wrapper">
    <el-container>
        <el-main>
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="primary">用户管理</span>
                </div>
                <div class="text">
                    <div class="list">
                        <page-table ref="table" remote="requestUserList" :formatPayload="formatPayload">
                            <div class="actions" slot="actions">
                                <span class="title">账号：</span>
                                <el-input v-model="query.uid" placeholder=""></el-input>
                                <span class="title">姓名：</span>
                                <el-input v-model="query.name" placeholder=""></el-input>
                                <span class="title">用户编号：</span>
                                <el-input v-model="query.forecaster" placeholder=""></el-input>
                                <span class="title">角色名称：</span>
                                <el-input v-model="query.roleName" placeholder=""></el-input>
                                <span class="title">机构名称：</span>
                                <el-select v-model="query.orgId" clearable placeholder="请选择">
                                    <el-option v-for="item in organList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                </el-select>
                                <!-- <el-input v-model="query.orgId" placeholder=""></el-input> -->
                                <c-button type="search" @click="search()">搜索</c-button>
                                <c-button type="add" @click="inputItem({})">添加</c-button>
                            </div>
                            <el-table-column prop="" label="序列" width="80px" type="index"></el-table-column>
                            <el-table-column prop="uid" label="账号" width="180px" />
                            <el-table-column prop="name" label="姓名" width="180px" />
                            <el-table-column prop="sex" label="性别" width="80px" />
                            <el-table-column prop="forecaster" label="用户编号" width="160px" />
                            <el-table-column prop="orgName" label="所属机构" />
                            <el-table-column prop="areaName" label="所属地区" />
                            <!-- <el-table-column label="所属机构" width="180px" >
                                <template slot-scope="{row}">
                                    {{({'TZ':'台州市气象局','HY':'黄岩区气象局'})[row.XXXPROP_USER_4]}}
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="roleNames" label="所属角色" />
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
    <dialog-form title="用户" :visible.sync="visibleDialogFormItem" :getPayload="()=>formVerify()" :confirmDisabled="!formItem.uid || !formItem.name || !formItem.password" remote="requestDialogFormUserItemInput"
         v-if="formItem" @success="submitSuccess">
        <!-- <template v-slot:default="{ form }"> -->
        <template>
            <el-form-item label="姓名" label-width="120px">
                <el-input v-model="formItem.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="账号" label-width="120px">
                <el-input v-model="formItem.uid" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="120px" prop="password">
                <el-input type="password" v-model="formItem.password" autocomplete="off" placeholder="必须长度为 6~16位,包含数字,小写字母,大写字母,特殊字符"></el-input>
            </el-form-item>
            <el-form-item label="性别" label-width="120px">
                <el-select v-model="formItem.sex" placeholder="请选择">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="头像地址" label-width="120px">
                <el-input v-model="formItem.headPortrait" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item> -->
            <el-form-item label="预报员编号" label-width="120px">
                <el-input v-model="formItem.forecaster" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属地区" label-width="120px">
                <el-select v-model="formItem.areaId" placeholder="请选择">
                    <el-option v-for="item in areaData" :label="item.label" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属机构" label-width="120px">
                <el-select v-model="formItem.orgId" placeholder="请选择">
                    <el-option v-for="item in organList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属角色" label-width="120px">
                <el-select v-model="formItem.roleId" placeholder="请选择">
                    <el-option v-for="item in roleList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="手机" label-width="120px">
                <el-input v-model="formItem.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="120px">
                <el-input v-model="formItem.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮编" label-width="120px">
                <el-input v-model="formItem.postCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" label-width="120px">
                <el-input v-model="formItem.address" autocomplete="off" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
            </el-form-item>
        </template>
    </dialog-form>
</div>
</template>

<script>
import {
    requestUserListDelItem,
    requestOrganList,
    requestRoleListItem, 
    requestTreeChildrenOfAreaNode
} from "@/remote/";
import {
    common,
    witchCommonList
} from '../../mixins/index';

export default {
    mixins: [common, witchCommonList],
    data() {
        let validPassword=(rule,value,callback)=>{
      let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
      if(!reg.test(value)){callback(new Error('密码必须是由4-20位字母+数字组合'))
      }else{
          callback()
      }
  };
        return {
            rules: {
          password: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { validator: validPassword, trigger: 'blur' }
          ]
        },
            query: {
                // XXXPROP_USER_id: "",
                // XXXPROP_USER_name: ""
            },
            organList:'',
            areaData:'',
            roleList:[],
        };
    },
    mounted(){
        requestOrganList({
            }).then(res => {
                if(res.success){
                 this.organList = res.data.list
                }
            });
        requestTreeChildrenOfAreaNode().then(res => {
        this.areaData = []
        this.treeOfList(res.data)
        console.log(this.areaData)
        })
        // requestRoleListItem({
        //     }).then(res => {
        //         if(res.success){
        //             this.roleList = res.data.list
        //         }
        //     });
    },
    computed: {
        actionOfListDelItem() {
            return requestUserListDelItem;
        }
    },
    methods: {
        formVerify(){
            var verify = /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,})(?=.*[!@#$%^&*?.\(\)]).*$/;  //校验密码6-18位
            if (!verify.test(this.formItem.password)) {
                this.$message.error('必须长度为 6~16位,包含数字,小写字母,大写字母,特殊字符。');
            }else{
                return this.formItem
            }
        },
        treeOfList(tree){
        tree.map(item => {
          this.areaData.push(item)
          if(item.children){
            this.treeOfList(item.children)
          }
        })
      },
        submitSuccess(res){
            this.onConfirmUpdate()
            requestOrganList({
            }).then(res => {
                if(res.success){
                 this.organList = res.data.list
                }
            });
            requestTreeChildrenOfAreaNode().then(res => {
            this.areaData = []
            this.treeOfList(res.data)
            console.log(this.areaData)
            })
            // this.$refs.table.fetchData();
        },
        getFormItemByInputItem(item = {}) {
            const {
                lastItemClicked
            } = this;
            const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
            console.log('item:',item)
            console.log('lastItemClicked:',lastItemClicked)
            return {
                // "XXXPROP_USER_id": "",
                "id": item.id,
                "uid": item.uid,
                "name": item.name,
                "password": item.password,
                "sex": item.sex,
                "phone": item.phone,
                "email": item.email,
                "postCode": item.postCode,
                "address": item.address,
                "areaId":item.areaId,
                "orgId": item.orgId,
                // "headPortrait": item.headPortrait,
                "forecaster": item.forecaster,
                // "XXXPROP_USER_4": lastKeyItemClicked,
                // ...item
            };
        },
    }
};
</script>
<style scoped>
</style>
