<template>
  <div class="content product-warms">
    <warms-chart></warms-chart>
  </div>
</template>
<script>
import {
    // requestProductMakeWarms,
} from "@/remote/";

import warmsChart from "./components/warms-chart";
export default {
components:{
warmsChart
},
  data() {
    return {
    };
  },
  mounted(){
    // requestProductMakeWarms().then(res=>{
    //   this.contentImg = res.data.content
    // })
  },
};
</script>
<style lang='postcss' scoped>
.content {
    height: calc(100% - 129px)!important;
    text-align: center;
}
</style>
