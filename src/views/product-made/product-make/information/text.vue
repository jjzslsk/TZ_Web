<template>
  <div class="content text-page">
    <div class="but">
        <el-radio  v-model="radio" size="mini" v-for="item in radioList" :label="item.name" :key="item.code"></el-radio>
    </div>
    <el-divider></el-divider>
    <div class="txt">
      <template v-for="i in radioList" >
        <div v-html="textarea" :key="i.code" v-if="radio == i.name"></div>
      </template>
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
      radioList:null,
      radio:null,
      textarea:null,
    };
  },
  watch:{
    radio(val){
      this.radioList.forEach(element => {
        if(val == element.name){
          this.textarea = element.content
        }
      });
    }
  },
  mounted(){
    requestProductMakeTextList().then(res=>{
      this.radioList = res.data
      this.radio = this.radioList[0].name
      this.textarea = this.radioList[0].content
    })
  },
};
</script>
<style lang='postcss' scoped>
.content {
  .but {
    text-align: left;
    .el-radio{
      margin-right: 8px;
      margin-bottom:6px;
      .el-radio__input{
        display: none;
      }
    }
  }
}
</style>
<style lang="postcss">
.text-page {
  position: relative;
  .but {
    .el-radio{
      .el-radio__input{
        display: none;
      }
    }
  }
    .el-divider--horizontal {
        margin: 6px 0;
    }
  .txt{
    /* flex: 1; */
    /* background:#eee; */
    position:absolute;
    width: calc(100% - 40px);
    top: 60px;
    left: 0;
    bottom:5px;
    display: flex;
    padding: 0 20px 0 20px;
    div{
      overflow: auto;
      width: 100%;
    }
  }
}
</style>
