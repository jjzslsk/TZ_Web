<template>
  <div class="content history-page" ref="getwidth">
    <div class="input">
      <el-form ref="form" label-width="80px">
        <el-form-item label="时间选择">
          <el-date-picker
            @click.native="selectClick()"
            @blur='blurSelect()'
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="small"
            v-model="time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改记录">
          <el-select class="record-form" size="small" @click.native="selectClick()" @blur='blurSelect()' v-model="selectOptionsItem" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in historyList"
              :key="item"
              :label="item.saveTime+'-'+item.creator"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态">
          <el-select class="" size="small" v-model="state" @click.native="selectClick()" @blur='blurSelect()' clearable placeholder="请选择">
            <el-option label="保存记录" value="0">保存记录</el-option>
            <el-option label="发布记录" value="1">发布记录</el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-input v-if="!docPath" type="textarea" :rows="10" placeholder="请输入内容" v-model="options"></el-input>
    <page-office v-else :class="!linkIframePosition? 'link-iframe-position':'page-office'" :url="docPath" ref="iframe" id="products"></page-office>
  </div>
</template>
<script>
import PageOffice from "@/components/page-office/";
import {
  requestProductMakeHistoryList
} from "@/remote/";
export default {
  props:['viewData','productTabProductInfoId'],
  components: {
    PageOffice,
  },
  data() {
    return {
      linkIframePosition:true,
      docPath:null,
      state:"0",
      time:null,
      historyList:null,
      options: null,
      selectOptionsItem:null,
      getWidth:null,
    };
  },
  methods:{
    selectClick(){
      this.linkIframePosition = false
    },
    blurSelect(){
      this.linkIframePosition = true
    },
  },
  watch: {
    selectOptionsItem(code){
      this.options = this.historyList[code].content
      if(this.historyList[code].file_type == 'word' || this.historyList[code].file_type == 'excel'){
        this.docPath = `http://10.137.4.30:8089/PageOfficeService/main/openFileByPath.action?filePath=/${this.historyList[code].file_path}`
      }else{
        this.docPath = null
      }
    },
    productTabProductInfoId(){
      if(this.viewData.children){
      this.viewData = this.viewData.children.find(element => {
          return element.id == this.productTabProductInfoId
        });
      }
      requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
        if(res.data.length > 0){
            this.historyList = res.data
            this.historyList.forEach((element,index) => {
              element.code = index          
            });
            this.options = this.historyList[0].content
            this.selectOptionsItem = 0
            if(this.historyList[0].file_type == 'word' || this.historyList[0].file_type == 'excel'){
              this.docPath = `http://10.137.4.30:8089/PageOfficeService/main/openFileByPath.action?filePath=/${this.historyList[0].file_path}`
            }else{
              this.docPath = null
            }
          }else{
            this.historyList = []
            this.docPath = null
            this.selectOptionsItem = null
          }

      })
    },
    state(){
      if(!this.viewData) {
        this.$message({message: '请选择产品',type: 'warning'});
        return
      }
      requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
        if(res.data.length > 0){
            this.historyList = res.data
            this.historyList.forEach((element,index) => {
              element.code = index          
            });
            this.options = this.historyList[0].content
            this.selectOptionsItem = 0
            if(this.historyList[0].file_type == 'word' || this.historyList[0].file_type == 'excel'){
              this.docPath = `http://10.137.4.30:8089/PageOfficeService/main/openFileByPath.action?filePath=/${this.historyList[0].file_path}`
            }else{
              this.docPath = null
            }
          }else{
            this.historyList = []
            this.docPath = null
            this.selectOptionsItem = null
          }

      })
    },
    time(){
      if(!this.viewData) {
        this.$message({message: '请选择产品',type: 'warning'});
        return
      }
      requestProductMakeHistoryList({productInfoId:this.viewData.id,type:this.state,time:this.time}).then(res=>{
        if(res.data.length > 0){
            this.historyList = res.data
            this.historyList.forEach((element,index) => {
              element.code = index          
            });
            this.options = this.historyList[0].content
            this.selectOptionsItem = 0
            if(this.historyList[0].file_type == 'word' || this.historyList[0].file_type == 'excel'){
              this.docPath = `http://10.137.4.30:8089/PageOfficeService/main/openFileByPath.action?filePath=/${this.historyList[0].file_path}`
            }else{
              this.docPath = null
            }
          }else{
            this.historyList = []
            this.docPath = null
            this.selectOptionsItem = null
          }

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
      this.historyList.forEach((element,index) => {
        element.code = index        
      });
      this.options = this.historyList[0].content
      this.selectOptionsItem = 0
      if(this.historyList[0].file_type == 'word' || this.historyList[0].file_type == 'excel'){
        this.docPath = `http://10.137.4.30:8089/PageOfficeService/main/openFileByPath.action?filePath=/${this.historyList[0].file_path}`
      }else{
        this.docPath = null
      }
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
    .page-office{
      width: 100%;
      height: 100%;
    }
    .iframe{
      position: relative !important;
    }
    .link-iframe-position{
      position: fixed !important;
      right: 30rem !important;
      bottom: 30rem !important;
      width: 0 !important;
      height: 0 !important;
    }
}
</style>