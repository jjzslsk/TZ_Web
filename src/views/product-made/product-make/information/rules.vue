<template>
  <div class="rules-page">
    <el-container>
      <el-main>
        <el-card class="box-card" shadow="never">
          <div class="text">
            <div class="list">
              <page-table ref="table" remote="requestrulesList" :formatPayload="formatPayload">
                <div class="actions" slot="actions">
                  <span class="title">类型</span>
                  <el-select size="mini" v-model="query.type" placeholder="请选择">
                    <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <span class="title">名称</span>
                  <el-input size="mini" v-model="query.name" clearable placeholder></el-input>
                  <span class="title">内容</span>
                  <el-input size="mini" v-model="query.content" clearable placeholder></el-input>
                  <el-button type="primary" size="mini" @click="search()">搜索</el-button>
                  <el-button type="success" size="mini" @click="inputItem({})">添加</el-button>
                </div>
                <el-table-column label="序号" width="48px" type="index"></el-table-column>
                <el-table-column prop="type" label="类型" width="80px" />
                <el-table-column prop="name" label="名称" width="80px" />
                <el-table-column prop="content" label="内容"/>
                <el-table-column prop label="操作" width="80x">
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
    <dialog-form
      title="业务规范"
      :visible.sync="visibleDialogFormItem"
      :getPayload="()=>formItemParam()"
      :confirmDisabled="!formItem.name || !formItem.type || !formItem.content"
      remote="requestrulesListAdd"
      v-if="formItem"
      @success="submitSuccess"
    >
      <!-- <template v-slot:default="{ form }"> -->
      <template>
        <el-form-item label="类型" label-width="120px">
          <el-select v-model="formItem.type" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="formItem.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="120px">
          <el-input
            v-model="formItem.content"
            autocomplete="off"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
          ></el-input>
        </el-form-item>
      </template>
    </dialog-form>
  </div>
</template>

<script>
import {
  requestUserListDelItem,
  requestProductMakerulesType,
  requestrulesListDel
} from "@/remote/";
import { common,
    witchCommonList,
    withCommonLeftTree } from "../../../mixins/index";
export default {
  mixins: [common,
    witchCommonList,
    withCommonLeftTree],
  data() {
    return {
      query: {
        // XXXPROP_USER_id: "",
        // XXXPROP_USER_name: ""
      },
      typeList:null,
      loginInfo:null,
    };
  },
  mounted() {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    this.loginInfo = loginInfo;
    this.requestData()
  },
  computed: {
    actionOfListDelItem() {
      return requestrulesListDel;
    }
  },
  methods: {
    requestData(){
      requestProductMakerulesType().then(res=>{
        this.typeList = res.data
      })
    },
    formItemParam(){
      return {
        ...this.formItem,
        updateUser:this.loginInfo.username
      }
    },

    submitSuccess(res) {
      this.onConfirmUpdate()
      this.requestData()
      // this.$refs.table.fetchData();
    },
    getFormItemByInputItem(item = {}) {
      const { lastItemClicked } = this;
      const lastKeyItemClicked = lastItemClicked && lastItemClicked.id;
      console.log("item:", item);
      console.log("lastItemClicked:", lastItemClicked);
      return {
        // "XXXPROP_USER_id": "",
        // id: item.id,
        // uid: item.uid,
        // name: item.name,
        // content: item.content,
        // areaId: item.areaId,
        // orgId: item.orgId,
        // "XXXPROP_USER_4": lastKeyItemClicked,
        ...item
      };
    }
  }
};
</script>
<style scoped>

</style>
<style lang="postcss">
.rules-page {
    padding-bottom: 0;
    .actions {
      padding-bottom: 5px;
      .el-input {
        margin-bottom:5px;
      }
    }

  .el-card__body {
    padding-bottom: 0;

  }
}
@media only screen and (max-width: 2000px) {
  .el-card__body {
        /* background-color:lightblue; */
  }
    .rules-page {
        /* background-color:lightblue; */
    }
}
</style>