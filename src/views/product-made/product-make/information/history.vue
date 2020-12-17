<template>
  <div class="content history-page" ref="getwidth">
    <div class="input">
      <el-form ref="form" label-width="80px">
        <el-form-item label="时间选择">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="small"
            v-model="time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改记录">
          <el-select class="record-form" size="small" v-model="options" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in historyList"
              :key="index"
              :label="item.saveTime+'-'+item.creator"
              :value="item.content"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态">
          <el-select class="" size="small" v-model="state" clearable placeholder="请选择">
            <el-option label="保存记录" value="0">保存记录</el-option>
            <el-option label="发布记录" value="1">发布记录</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="options"></el-input>
  </div>
</template>
<script>
import {
  requestProductMakeHistoryList
} from "@/remote/";
export default {
  props:['viewData','productTabProductInfoId'],
  data() {
    return {
      state:"0",
      time:null,
      historyList:null,
      options: null,
      getWidth:null,
    };
  },
  watch: {
    productTabProductInfoId(){
      if(this.viewData.children){
      this.viewData = this.viewData.children.find(element => {
          return element.id == this.productTabProductInfoId
        });
      }
      requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
        this.historyList = res.data
        this.options = this.historyList[0].content
      })
    },
    state(){
      if(!this.viewData) {
        this.$message({message: '请选择产品',type: 'warning'});
        return
      }
      requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
        this.historyList = res.data
        this.options = this.historyList[0].content
      })
    },
    time(){
      if(!this.viewData) {
        this.$message({message: '请选择产品',type: 'warning'});
        return
      }
      requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
        this.historyList = res.data
        this.options = this.historyList[0].content
      })
    },
  },
  mounted() {
    if(this.viewData.children){
      this.viewData = this.viewData.children.find(element => {
         return element.id == this.productTabProductInfoId
      });
    }

    this.getWidth = this.$refs.getwidth.offsetWidth
    requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
      this.historyList = res.data
      this.options = this.historyList[0].content
    })
    
  }
};
</script>
<style lang='postcss' scoped>
.content {
  flex: 1 !important;
  .input {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-form {
      width: 100%;
      .el-form-item {
        text-align: center;
        margin:5px;
        width: 300px;
        display: inline-block;
        .el-form-item__content {
          .el-select {
            width: 200px;
          }
          .el-date-editor {
            width: 200px;
          }
        }
      }
    }
  }
}
</style>
<style lang="postcss">
.history-page {
  .el-textarea {
      flex: 1;
      height: 100%;
      display: flex !important;
    }
}
</style>