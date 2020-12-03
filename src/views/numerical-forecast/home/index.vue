<template>
  <div v-if="pathUrl" style="height:100%;" class="page-wrap-3d">
    <template class="for-item" style="height:100%;" v-for="(item,index) in pathUrl" >
        <div class="item-box" v-if="item.code == 'Forecast'" :key="index">
          <iframe
            v-if="item.code == 'Forecast'"
            src="../../../../static/html/forecast/index.html"
            style="width:100%;height:100%;"
            name="demo"
            ref="iframe" id="bdIframe"
            class="iframe-item"
            frameborder="0"
          ></iframe>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ["pathUrl"],
  data() {
    return {};
  }
};
</script>
<style lang="postcss" scoped>
.iframe-item {
  background: rgb(255, 255, 255);
}
</style>
<style lang="postcss">
  .page-wrap-3d {
    .item-box {
      height: 100%;
      .iframe-item {
      }
    }
  }
</style>