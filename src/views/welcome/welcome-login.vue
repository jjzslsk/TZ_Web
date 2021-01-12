<template>
  <div class="welcome-main main">
    <div class="top">
      <div class="logo">
        <div class="img">
          <img src="../../assets/img/logo1.png" alt="" srcset="" />
        </div>
        <div class="title">台州市气象业务一体化平台</div>
      </div>
      <div class="abstract">
        <div class="title">简介</div>
        <div class="content">
          <p>
            本平台包含天气概览、数值预报、综合观测、产品制作、综合管理等十大模块，
          </p>
          <p>为台州市县业务人员日常使用的智能化、集约化操作平台。</p>
        </div>
      </div>
      <!-- <div class="copyright">
        <div class="title"></div>
        <div class="content"></div>
      </div> -->
      <el-form class="form" ref="form" :model="form">
        <el-form-item class="user-box">
          <el-input
            class="input-login"
            prefix-icon="iconfont iconxiugaimima"
            v-model="form.uid"
            placeholder="请输入用户名"
            ref="oldPass-input"
            @keyup.native.enter="$refs.password.focus()"
          >
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="user-box">
          <el-input
            class="input-login"
            ref="password"
            prefix-icon="iconfont iconmima"
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            @keyup.native.enter="onSubmit"
          >
            <i slot="prefix" class="el-input__icon el-icon-key"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="signIn" type="" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottm">
      <div class="vistor">
        <div class="headline-wrap">
          <i class="el-icon-d-arrow-right"></i>
          <span class="text">聚焦功能</span>
        </div>
        <div class="headline-box">
          <!-- <div class="headline-l"><i class="el-icon-arrow-left"></i></div> -->
          <div class="headline-content">
            <div
              class="item"
              @click="
                linkUrl({ index: '/situation-page', path: '/situation-page' })
              "
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/天气概览-a.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl({ index: '/forecast', path: '/html-page' })"
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/数值预报.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl({ index: '/TZ_3D', path: '/html-page' })"
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/综合观测.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl({ index: '/TZ_typhoon', path: '/html-page' })"
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/台风服务.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl({ index: '/reminder', path: '/html-page' })"
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/信息监控.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl({ index: '/QJT', path: '/html-page' })"
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/气候平台.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl({ index: '/suddenWeather', path: '/html-page' })"
            >
              <div class="item-box">
                <img
                  src="../../assets/img/welcome/智能提醒.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl()"
            >
              <div class="item-box">
                <div class="standard">
                  <span class="word">登录</span>
                </div>
                <img
                  src="../../assets/img/welcome/天气警报.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="item"
              @click="linkUrl()"
            >
              <div class="item-box">
                <div class="standard">
                  <span class="word">登录</span>
                </div>
                <img
                  src="../../assets/img/welcome/产品制作.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div class="item" @click="linkUrl()">
              <div class="item-box">
                <div class="standard">
                  <span class="word">登录</span>
                </div>
                <img
                  src="../../assets/img/welcome/综合管理.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
          </div>
          <!-- <div class="headline-r"><i class="el-icon-arrow-right"></i></div> -->
        </div>
      </div>
    </div>
    <select-jobs v-if="isSelectJobs" @closeDrawer="closeDrawer"></select-jobs>
  </div>
</template>
<script>
// import echarts from "echarts";
import { mapActions, mapGetters } from "vuex";
import { requestLogin, requestMyUserJob,requestMyUserUpdateDutyJob } from "@/remote/";
import selectJobs from './../components/common-jobs'
export default {
  components:{
    selectJobs
  },
  data() {
    return {
      isSelectJobs:false,
      form: {
        uid: "",
        password: "",
      },
      loginData:null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      //自动获取焦点 element组件autofocus失效
      this.$refs["oldPass-input"].$refs.input.focus();
    });
  },
  methods: {
    closeDrawer(state){
      this.isSelectJobs = false
      if(state == 'submit'){
        requestMyUserJob({ loginUserId: this.loginData.userId }).then((res) => {
            localStorage.setItem("userJob", JSON.stringify(res.data));
            this.$router.push({name: "weather-situation"});
          });
        }else if(state == 'cancel'){
            this.$router.push({name: "weather-situation"});
        }else if(state == 'close'){

        }
    },
    linkUrl(info) {
      if (!info) {
        this.$message({
          message: "请先登录 ☺",
          type: "",
        });
        return;
      }
      this.$router.push({ path: "/welcome-home", query: info });
    },
    // onSubmit() {
    //     // debugger;
    //     const vm = this;
    //     // console.log('vm.form', vm.form);
    //     requestLogin(vm.form).then(res => {
    //         // res.data
    //         return this.gotAccountInfo({name:res.data[0].userName});
    //     }).then(res => {
    //         const rf = vm.$route.query.rf;
    //         if (rf) {
    //             vm.$router.push({
    //                 'path': decodeURIComponent(rf)
    //             });
    //         } else {
    //             vm.$router.push({
    //                 'name': 'welcome'
    //             });
    //         }
    //     })
    // },

    async onSubmit() {
      const vm = this;


      let resLogin = await requestLogin(vm.form).then((res) => {
		    localStorage.setItem("lastTime10",new Date().getTime())
		    localStorage.setItem("lastTime04",new Date().getTime())

        if (res.success && res.data) {

          localStorage.setItem("loginData", JSON.stringify(res.data));
          this.loginData = JSON.parse(localStorage.getItem("loginData"));
        }
        // const rf = vm.$route.query.rf;
        // console.log('rf::',rf)

        // if (rf) {
        //     vm.$router.push({
        //         'path': decodeURIComponent(rf)
        //     });
        // } else {
        //     vm.$router.push({
        //         'name': 'welcome'
        //     });
        // }
        return res
      });

       //获取岗位信息
      await requestMyUserJob({ loginUserId: this.loginData.userId }).then((res) => {
          localStorage.setItem("userJob", JSON.stringify(res.data));
        });

        //获取用户和菜单信息
       await this.gotAccountInfo(resLogin.data).then((res) => {
          this.getAccountInfo().then((res) => {
            this.getMenuInfo().then((back) => {
              if (back.success && back.data) {
                this.isSelectJobs = true
              }
            });
          });
        });

    },
    ...mapActions(["gotAccountInfo", "getAccountInfo", "getMenuInfo"]),
  },
};
</script>
<style scoped lang="postcss">
@media screen and (min-width: 1600px) and (max-width: 6000px) {
  .main {
    .headline-content {
      width: 100% !important;
      .item {
        width: 10% !important;
      }
    }
    .bottm {
      height: 22rem !important;
      .item-box {
        background: url(../../assets/img/welcome/item-bg1.png) no-repeat !important;
        .standard {
          border-radius: 0 !important;
        }
      }
    }
    .top {
      height: calc(100% - 22rem) !important;
    }
  }
}
@media screen and (min-width: 10px) and (max-width: 1024px) {
  .main {
    .logo {
      padding-left: 2rem!important;
      padding-top: 4rem !important;
      display: flex;
      .img {
        height: 5rem !important;
        weight: 5rem !important;
      }
      .title {
        font-size: 2rem !important;
      }
    }
    .abstract {
      padding-left: 2rem!important;
      padding-top: 2rem;
      font-size: 15px;
      .title {
        font-weight: bold;
        font-size: 16px!important;
        border-left: 3px solid #19b7fe;
        padding-left: 12px;
      }
      .content {
        font-weight: bold;
        p {
        }
      }
    }
      .form {
      width: 622px;
      height: 103px;
      border-radius: 9px;
      position: absolute;
      top: 0!important;
      right: -400px!important;
      transform: translateX(-50%);
      display: flex;
      padding: 27px 43px;
      .user-box {
        width: 170px!important;
        margin-right: 10px;
      }
    }
    .headline-content {
      width: 100% !important;
      .item {
        width: 20% !important;
        height: auto !important;
        padding-top: 10px !important;
      }
    }
    .bottm {
      height: 307px !important;
      .item-box {
        width: 100px !important;
        height: 100px !important;
      }
    }
    .top {
      height: calc(100% - 307px) !important;
    }
  }
}
.main {
  height: 100%;
  .top {
    position: relative;
    height: calc(100% - 430px);
    background: url(../../assets/img/login-bg_new1.jpg) no-repeat;
    background-size: 100% 100%;
    color: #0a4c9f;
    .logo {
      padding-left: 4rem;
      padding-top: 7rem;
      display: flex;
      .img {
        height: 7rem;
        weight: 7rem;
        img {
          height: 100%;
          weight: 100%;
        }
      }
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 10px;
        font-size: 3.5rem;
        font-weight: bold;
      }
    }
    .abstract {
      padding-left: 4rem;
      padding-top: 2rem;
      .title {
        font-weight: bold;
        font-size: 22px;
        border-left: 3px solid #19b7fe;
        padding-left: 12px;
      }
      .content {
        font-weight: bold;
        p {
        }
      }
    }
    .form {
      /* width: 347px;
        padding-top: 100px;
        margin: auto; */
      width: 622px;
      height: 103px;
      /* background:rgba(0,0,0,0.4); */
      background: rgba(0, 0, 0, 0);
      border-radius: 9px;
      position: absolute;
      top: 10px;
      right: -300px;
      transform: translateX(-50%);
      display: flex;
      padding: 27px 43px;
      box-sizing: border-box;
      .signIn {
        display: block;
        width: 100%;
        height: 40px;
        /* margin-top: 23px; */
        margin-left: 10px;
        font-size: 18px;
        font-family: MicrosoftYaHei-Bold;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        background: #fa9901;
        border: 0;
        border-radius: 4px;
        letter-spacing: 5px;
      }
      .user-box {
        width: 280px;
        height: 38px;
        line-height: 38px;
        /* background:rgba(255,255,255,1); */
        border-radius: 4px;
        display: flex;
        margin-right: 10px;
        color: #606266;
        .el-input__inner {
          height: 38px;
        }
        .el-input__icon {
          color: #fff;
        }
      }
    }
  }
  .bottm {
    height: 430px;
    .vistor {
      padding: 30px;
      .headline-wrap {
        font-size: 1.5rem;
        color: #1e9fff;
        .text {
          color: #000;
        }
      }
      .headline-box {
        display: flex;
        justify-content: center;
        .headline-content {
          width: 1200px;
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          justify-content: center;
          .item {
            height: 143px;
            width: 220px;
            display: flex;
            justify-content: center;
            cursor: pointer;
            padding: 1.5rem 0 0 0;
            .item-box {
              position: relative;
              width: 143px;
              height: 143px;
              background: url(../../assets/img/welcome/item-bg.png) no-repeat;
              background-size: 100% 100%;
              img {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
              }
              .standard {
                display: flex;
                /* flex布局 ,适用一维布局，即行或者列*/
                flex-direction: row;
                /* 主轴方向为水平方向，起点在左端 */
                justify-content: center;
                /* 主轴排列方式 */
                color: #fff;
                /* 字体颜色 */
                font-size: 12px;
                /* 字体大小 */
                width: 50px;
                /* 容器的宽度 */
                height: 50px;
                /* 容器的高度度 */
                background-image: linear-gradient(
                  to bottom right,
                  #49bcf5 50%,
                  rgba(242, 242, 242, 0) 50%
                );
                /* 从原点到右下角渐变 */
                border-radius: 5px 0 5px 0;
                /* 圆角 */
              }
              .word {
                padding-top: 6px;
                transform: rotate(-45deg);
                /* 文字旋转 */
              }
            }
          }
          /* .:nth-child(1) {
            background: url(../../assets/img/welcome/item-bg.png) no-repeat;
            background-size: 100% 100%;
          }*/
        }
        .headline-l,
        .headline-r {
          width: 100px;
          height: 280px;
          font-size: 36px;
          color: #1e9fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
<style lang="postcss">
.welcome-main {
  .el-input__inner {
    height: 38px !important;
    background: rgb(0 160 233 / 0.5) !important;
    border: 1px solid #eee !important;
    color: #fff !important;
    padding-left: 52px!important;
  }
  input::-webkit-input-placeholder {
    color: rgb(218, 218, 218) !important;
  }
  input::-moz-input-placeholder {
    color: rgb(218, 218, 218) !important;
  }
  input::-ms-input-placeholder {
    color: rgb(218, 218, 218) !important;
  }
}
</style>>