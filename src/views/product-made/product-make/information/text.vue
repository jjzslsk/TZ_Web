<template>
  <div class="content">
    <div class="but">
      <el-radio-group v-model="radio">
        <el-radio-button v-for="item in radioList" :label="item.name" :key="item.code"></el-radio-button>
      </el-radio-group>
    </div>
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
    text-align: center;
    margin-bottom: 20px;
  }
  .txt{
    padding: 0 20px 0 20px;
  }
}
</style>
