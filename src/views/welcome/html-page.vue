<template>
  <div style="height: 100%" class="page-wrap-web">
    <template class="for-item" style="height: 100%">
      <div class="item-box">
        <iframe
          :src="extUrl"
          style="width: 100%; height: 100%"
          name="iframeName"
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
  props: ["pathUrl", "extUrl"],
  data() {
    return {
      srcArr: [
        { name: "/suddenWeather", url: "../../../../static/html/suddenWeather/index.html"},
        { name: "/QJT", url: "../../../../static/html/dataStatistics/dataStatistics.html"},
        { name: "/3d", url: "http://www.baidu.com" },
        {
          name: "/TZ_3D",
          url: "http://10.137.4.37:6007/TZ_3D/index.html",
        },
        {
          name: "/TZ_typhoon",
          url: "http://10.137.4.37:6007/TZ_typhoon/index.html",
        },
        {
          name: "/forecast",
          url: "../../../../static/html/forecast/index.html",
        },
        {
          name: "/reminder",
          url: "../../../../static/html/reminder/live.html",
        },
        {
          name: "/remindergis",
          url: "../../../../static/html/reminder/livegis.html",
        },
      ],
    };
  },
  watch: {
    extUrl() {
      this.srcArr.forEach((element) => {
        if (this.$route.query.key == element.name) {
          this.extUrl = element.url;
        }
      });
    },
  },
  mounted() {
    this.srcArr.forEach((element) => {
      if (this.$route.query.key == element.name) {
        this.extUrl = element.url;
      }
    });
  },
  created() {
    window["vueDefinedMyProp"] = (receiveParams) => {
      this.receiveParamsFromHtml(receiveParams);
    };
  },
  methods: {
    receiveParamsFromHtml(res) {
      this.$emit("fatherMethod");
    },
  },
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