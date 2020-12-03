<template>
  <div class="content">
      <div class="img-wrap">
          <img :src="contentImg" alt="" srcset="">
      </div>
  </div>
</template>
<script>
import {
    requestProductMakeMessageList,
} from "@/remote/";
export default {
  data() {
    return {
      contentImg:null,
    };
  },
  mounted(){
    requestProductMakeMessageList().then(res=>{
      this.contentImg = res.data.content
    })
  },
};
</script>
<style lang='postcss' scoped>
.content {
    height: calc(100% - 129px)!important;
    text-align: center;
  .img-wrap {
    height: 700px;
    overflow: auto;
    img{
      width: 100%;
    }
  }
}
</style>
