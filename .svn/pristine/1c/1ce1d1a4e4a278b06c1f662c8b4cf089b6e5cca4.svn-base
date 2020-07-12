<template>
  <div class="content">
    <div class="input">
      <el-form ref="form" label-width="80px">
        <el-form-item label="修改记录">
          <el-select v-model="options" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in historyList"
              :key="index"
              :label="item.saveTime+'-'+item.creator"
              :value="item.content"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-input type="textarea" :rows="30" placeholder="请输入内容" v-model="options"></el-input>
  </div>
</template>
<script>
import {
  requestProductMakeHistoryList
} from "@/remote/";
export default {
  props:['viewData'],
  data() {
    return {
      historyList:null,
      options: null
    };
  },
  mounted() {
    requestProductMakeHistoryList({productInfoId:this.viewData.id}).then(res=>{
      this.historyList = res.data
      this.options = this.historyList[0].content
    })
  }
};
</script>
<style lang='postcss' scoped>
.content {
  .input {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-form {
      .el-form-item {
        text-align: center;
        .el-form-item__content {
          .el-select {
            width: 300px;
          }
        }
      }
    }
  }
}
</style>