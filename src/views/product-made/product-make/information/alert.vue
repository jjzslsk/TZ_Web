<template>
  <div class="content">
    <div class="but">
      <el-button type="primary" size="mini" @click="onAlert('onAlert')">编辑</el-button>
    </div>
    <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="form.textarea"></el-input>
  </div>
</template>
<script>
import {
    requestProductMakeAlertList,
} from "@/remote/";
import {
  common,
  witchCommonList,
  withCommonLeftTree
} from "../../../mixins/index";
export default {
  mixins: [common, witchCommonList, withCommonLeftTree],
  data() {
    return {
      form: {
        textarea: null
      }
    };
  },
  methods: {
    onAlert(data) {
      this.$emit("dialogEmit", data);
    }
  },
    //   visibleDialogAlert(val){
    //   if(!val){}
    // },
  mounted(){
    requestProductMakeAlertList().then(res=>{
      this.form.textarea = res.data.content
    })
  },
};
</script>
<style lang='postcss' scoped>
.content {
  height: calc(100% - 129px)!important;
  .but {
    text-align: right;
    padding-bottom:10px;
  }
}
</style>