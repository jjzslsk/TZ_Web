<!-- 自定义公共组件: transfer
    author -- liulinfen
    @leftData 左侧数据
    @rightData 右侧数据
    @titles 数组数据,可以不设置，左右穿梭框的标题
    @sortType 上下排序的类型，可选值为： left、right、both三选一，可以不选，默认右侧可进行上下排序
 -->
<template>
  <div class="packaged_transfer">
    <div class="left_panel">
      <div class="header">
        <div class="title-text" v-if="titles && titles.length">{{titles[0]}}</div>
        <div @click="cancel('left')" class="cancelChoose">取消</div>
      </div>
      <el-scrollbar style="height: 280px;">
        <div class="content-box">
          <el-radio-group v-model="left" class="packaged_transfer_checkbox">
            <el-radio v-for="(item, index) in leftData" :label="index" :key="item.id">{{item.titleName}}</el-radio>
          </el-radio-group>
        </div>
      </el-scrollbar>
    </div>
    <div class="option-container">
      <div class="option_item" v-if="left || left === 0"  @click="transferData('left')"><i class="el-icon-arrow-right"></i></div>
      <div class="option_item disabled" v-else><i class="el-icon-arrow-right"></i></div>
      <div class="option_item" v-if="right || right === 0" @click="transferData('right')"><i class="el-icon-arrow-left"></i></div>
      <div class="option_item disabled" v-else><i class="el-icon-arrow-left"></i></div>
      <div class="option_item" v-if="upActive" @click="handleSort('up')"><i class="el-icon-arrow-up"></i></div>
      <div class="option_item disabled" v-else><i class="el-icon-arrow-up"></i></div>
      <div class="option_item" v-if="downActive" @click="handleSort('down')">
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="option_item disabled" v-else><i class="el-icon-arrow-down"></i></div>
    </div>
    <div class="right_panel">
      <div class="header">
        <div class="title-text" v-if="titles && titles.length && titles.length == 2">{{titles[1]}}</div>
        <div @click="cancel('right')" class="cancelChoose">取消</div>
      </div>
      <el-scrollbar style="height: 280px;">
        <div class="content-box">
          <el-radio-group v-model="right" class="packaged_transfer_checkbox">
            <el-radio v-for="(item, index) in rightData" :label="index" :key="item.id">{{item.titleName}}</el-radio>
          </el-radio-group>
        </div>
      </el-scrollbar>
    </div>
      <div class="right_panel_text" v-if="isTextBox">
      <div class="header">
        <div class="title-text">文字资料配置</div>
        <!-- <div @click="cancel('right')" class="cancelChoose">取消</div> -->
      </div>
        <el-checkbox-group class="checkbox-group-warp" v-model="checkList">
          <el-checkbox :label="item.name" v-for="(item,index) in textList" :key='index'></el-checkbox>
          <!-- <el-checkbox label="复选框 A"></el-checkbox> -->
        </el-checkbox-group>
    </div>

  </div>  
</template>
<script>
import {
    requestProductMakeTextList,
} from "@/remote/";
export default {
  data() {
    return {
      left: '',
      right: '',
      textList:null,
      isTextBox:false,
      checkList: ['全省短期预报','短期预报']
    }
  },
  computed: {
    upActive() {
      return !this.sortType || this.sortType == 'right' ? this.right : (this.sortType == 'left' ? this.left : this.left || this.right);
    },
    downActive() {
      let con = false;
      if (!this.sortType || this.sortType == 'right') {
        con = (this.right || this.right === 0) && (this.right !== this.rightData.length - 1)
      } else if (this.sortType == 'left') {
        con = (this.left || this.left === 0) && (this.left !== this.leftData.length - 1)
      } else {
        con = (this.right || this.right === 0) && (this.right !== this.rightData.length - 1) || (this.left || this.left === 0) && (this.left !== this.leftData.length - 1)
      }
      return con;
    },
  },
  props: ['leftData', 'rightData', 'titles', 'sortType'],
  mounted() {
    requestProductMakeTextList().then(res=>{
      this.textList = res.data
    })
  },
  watch:{
    right(val){
      this.rightData[val].name == '文字资料' ? this.isTextBox=true:this.isTextBox=false
    },
  },
  methods: {
    // 穿梭的回调
    transferData(type) {
      this.$emit('transfer', type, this[type], this.callback)
    },
    // 选中的索引置空
    callback(type) {
      this.cancel(type)
    },
    cancel(type) {
      if (type == 'both') {
        this.left = '';
        this.right = '';
      } else {
        this[type] = '';
      }
    },
    // 排序的回调
    handleSort(type) {
      let data = [this.left, this.right];
      this.$emit('handleSort', type, this.sortType, data, this.handleNewSort);
    },
    handleNewSort(sortType, array) {
      if (!sortType || sortType == 'right') {
        this.right = array[1]
      } else if (sortType == 'left') {
        this.left = array[0];
      } else if (sortType == 'both') {
        this.left = array[0];
        this.right = array[1];
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
  .packaged_transfer{
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 100%;
  word-break: break-all; 
  box-sizing: border-box;
  height: 330px;
  &:after{
    content: "";
    display: table;
    clear: both;
  }
  .header{
    padding: 0 15px;
    background: #f5f7fa;
    height: 30px;
    line-height: 30px;
    color: #333;
    font-weight: 400;
    display: flex;
    &:after{
      content: '';
      clear: both;
      display: block;
    }
    .title-text{
      font-size: 15px;
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
      text-align: left;
    }
    .cancelChoose{
      color: #B0B0B0; 
      cursor: pointer;
      text-align: right;
      font-size: 12px;
      &:hover{
        color: #1890FF;
      }
    }
  }
  .option-container{
    width: 10%;
    height: 300px;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .option_item{
      display: block;
      border-radius: 50%;
      color: #fff;
      background-color: #409eff;
      width: 36px;
      height: 36px; 
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      margin-bottom: 10px;
      i{
        font-size: 14px;
      }
    }
    .option_item.disabled{
      cursor: not-allowed;
      border: 1px solid #dcdfe6;
      background-color: #f5f7fa;
      color: #c0c4cc;
    }
  }
  .left_panel, .right_panel{
    border-radius: 4px;
    width: 25%;
    float: left;
    border: 1px solid #DCDFE6;
    .content-box{
      padding: 0 15px;
      text-align: left;
    }
  }
  .right_panel_text {
    border-radius: 4px;
    width: 25%;
    height: 310px;
    float: left;
    margin-left: 5%;
    border: 1px solid #DCDFE6;
    .content-box{
      padding: 0 15px;
      text-align: left;
      
    }
  }
  .packaged_transfer_checkbox{
    .el-radio{
      display: block;
      margin-right: 0;
      margin-bottom: 10px;
      &:first-child{
        margin-top: 10px;
      }
    }
    .el-radio.id-checked{
      color: #409EFF;
    }
  }
}
</style>
<style lang="postcss">
.packaged_transfer{
  .checkbox-group-warp{
    padding: 0 15px !important;
    display:block;
    .el-checkbox{
      padding: 4px 0;
    }
  }
}
</style>
