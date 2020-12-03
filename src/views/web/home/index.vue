<template>
  <div v-if="pathUrl" style="height:100%;" class="page-wrap-web">
    <template class="for-item" style="height:100%;">
        <div class="item-box">
          <iframe
            :src="extUrl"
            style="width:100%;height:100%;"
            name = "iframeName"
            id="iframeMapViewComponent"
            ref="iframe"
            class="iframe-item"
            frameborder="0"
          ></iframe>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ["pathUrl","extUrl"],
  data() {
    return {};
  },
      created() {
      //html，触发vue方法
      window['vueDefinedMyProp'] = (receiveParams) => {
        this.receiveParamsFromHtml(receiveParams)
      }
    },
    methods: {
      receiveParamsFromHtml(res) {
        this.$emit('fatherMethod',res);
      },
      mounted() {
        //vue，触发html方法
        // window.frames['iframeName'].lodaHtmlFn()
      },
  }
};
</script>
<style lang="postcss" scoped>
.iframe-item {
  background: rgb(255, 255, 255);
}
</style>
<style lang="postcss">
  .page-wrap-web {
    .item-box {
      height: 100%;
      .iframe-item {
      }
    }
  }
</style>