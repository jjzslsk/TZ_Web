<template>
  <div>
    <!-- <video id="video" controls="controls" hidden="hidden" autoplay="autoplay" loop="loop"></video> -->
    <!-- <video id="video" v-if="state" src="./../../../static/music/alert.wav" controls="controls" hidden="hidden" autoplay="autoplay" loop="loop"></video> -->
    <!-- <button @click="notice(true)">true</button>
    <button @click="notice(false)">false</button> -->
  </div>
</template>
<script>
import * as remote from "@/remote/";
import { requestProductAllTaskList } from "@/remote/";
export default {
  props: {
    // 'height':String,
  },
  data() {
    return {
      state: false,
      loginInfo: null,
      videoDom:null,
    };
  },
  watch: {
    "$route.query": {
      handler: function () {},
      // immediate: true
    },
  },
  computed: {},
  methods: {
    notifyFn(data) {
      let paramObj = JSON.parse(data.id)
      if (window.location.href.indexOf("product-make") != -1) {
        this.$emit('childByValue', {data:{ productInfoId: paramObj.infoId },optionsTypeValue:{ id: paramObj.jobId }})
      } else {
        this.$router.push({
          path: "/product-made/product-make/product-make-images",
          query: {
            data: { productInfoId: paramObj.infoId },
            optionsTypeValue: { id: paramObj.jobId },
          },
        });
      }
    },
    //播放-暂停 
    startPlay(state) {
      if (state) {
        this.videoDom.autoplay = true;
        this.videoDom.play();
      } else {
        this.videoDom.pause();
      }
    },
    //循环提示
    cycleFn() {
      if (!this.state) return;
      // 发布信息列表
      requestProductAllTaskList({ userId: this.loginInfo.id }).then((res) => {
        let edit = false;
        res.data.length == 0 ? (edit = false) : (edit = true);
        if (edit) {
          // this.startPlay(true);
          let vm = this;
          const notify = this.$notify({
            // title: '注意',
            dangerouslyUseHTMLString: true,
            message: (function () {
              let setDom = ``;
              res.data.forEach((element) => {
                setDom += `<li style="list-style: none;color:#909399;cursor:pointer;font-size:12px;font-weight:400;" id=${JSON.stringify({infoId:element.infoId,jobId:element.jobId})} jobId=${element.jobId}>
                ${element.title}
                <span style="font-size:12px;font-weight:400;color:#909399;">${element.startTime}-${element.endTime}</span>
                <span style="color:#0066ff;cursor:pointer;font-size:12px;font-weight:400;">查看详情</span>
                </li>`;
              });
              setDom = `<strong>
                            您有 <span style="color:red;">${res.data.length}</span>个产品要发布
                            <ul style="padding:0;margin:0">
                                ${setDom}
                            </ul>
                        </strong>`;
              return setDom;
            })(),
            position: "bottom-right",
            // type: 'warning',
            onClose: function () {
              // vm.startPlay(false);
            },
            duration: 10000,
          });

          let docEl = notify.$el.getElementsByTagName("li");
          let _this = this;
          docEl.forEach((element) => {
          // console.log(element)
            element.onclick = function () {
              _this.notifyFn(element);
            };
          });
          notify.$el.querySelector("ul").onclick = () => {
            // 点击后关闭notify 不需要的话可删掉
            notify.close();
          };
        }
        setTimeout(() => {
          this.cycleFn();
        }, 120000);
      });
    },
    //循环查询制作通知开关 true 开， false 关
    notice(state) {
      this.state = state;
      // this.videoDom = document.getElementById("video");
      // this.videoDom.pause();
      if (this.state) {
        this.cycleFn();
      } else {

      }
    },
    // if(window.location.href.indexOf("welcome-login") != -1)
  },
  mounted() {
    this.loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    setTimeout(() => {
      if (window.location.href.indexOf("welcome-login") != -1) {
        this.notice(false);
      } else {
        this.notice(true);
      }
    },120000);
  },
};
</script>

<style lang="css" scoped>
</style>
