<template>
  <div class="sudoku">
    <div class="main">
      <div class="button-box">
        <router-link to="/login" tag="div">登录</router-link>
        </div>
      <div class="logo-box">
        <img src="../../assets/img/logo.png" class="logo" />
        <span class="title-text">台州市县综合气象业务一体化平台</span>
      </div>
      <div class="content-box">
        <div
          class="item-3"
          v-for="(item,index) in list"
          :key="index"
          :style="{'background':item.color}"
        >
          <i class="iconfont" :class="item.icon"></i>
          <div class="sys-name">{{item.text}}</div>
        </div>
        <div class="item-3 item-top-bottom">
          <div class="top-box">
            <i class="iconfont zhibanliuchengpeizhi"></i>
            <span class="sys-name">综合管理系统</span>
          </div>
          <div class="bottom-box">
            <i class="iconfont zhibanliuchengpeizhi"></i>
            <span class="sys-name">可视气象信息监控平台</span>
          </div>
        </div>
         <div class="item-3 item-height">
            <i class="iconfont zhibanliuchengpeizhi"></i>
            <span class="sys-name">台风系统</span>
        </div>
         <div class="item-3 item-height item-70">
            <i class="iconfont zhibanliuchengpeizhi"></i>
            <span class="sys-name">精细化暴雨和地质灾害气象预警系统</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          icon: "zhongdahuodong",
          color: "#FC7C26",
          text: "天气概览"
        },
        {
          icon: "zhongdahuodong",
          color: "#1FCC75",
          text: "3D可视综合观测系统"
        },
        {
          icon: "zhongdahuodong",
          color: "#26B7FF",
          text: "数值预报分析显示系统"
        },
        {
          icon: "liuchengtixinghejiankong",
          color: "#FFB726",
          text: "天气警报（预警信号）制作"
        },
        {
          icon: "liuchengtixinghejiankong",
          color: "#26B7FF",
          text: "天气概览"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style scoped>
.sudoku {
  background-image: url("../../assets/img/jgg-bj.png");
  background-color: rgb(0, 87, 156);
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left bottom;
  .content-box {
    margin: auto;
    margin-top: 70px;
    width: 70%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item-3 {
      width: 31%;
      height: 183px;
      /* overflow-y: hidden; */
      margin-bottom: 18px;
      text-align: center;
      padding-top: 30px;
      padding-bottom: 25px;
      box-sizing: border-box;
      .iconfont {
        color: #fff;
        font-size: 60px;
        vertical-align: middle;
      }
      .sys-name {
        margin-top: 30px;
        font-size: 22px;
        font-family: Microsoft YaHei;
        color: rgba(255, 255, 255, 1);
        vertical-align: middle;
      }
      .top-box,.bottom-box {
        padding-left: 20px;
        margin-bottom: 18px;
        background: #ffb726;
        text-align: left;
        height: 82px;
        line-height: 82px;
        box-sizing: border-box;
      }
      .bottom-box {
        background: #a352f5;
        margin-bottom: 0;
      }
    }
    .item-top-bottom{
      padding: 0;
      .iconfont {
        font-size: 40px;
      }
    }
    .item-height{
      height: 130px;
      line-height: 130px;
      padding: 0px!important;
      background: #a352f5;
      .iconfont {
        font-size: 40px;
      }
    }
    .item-70{
      width: 65.5%;
      background: #1FCC75;
    }
  }
}
.logo-box {
  text-align: center;
  margin-bottom: 55px;
  .logo {
    width: 60px;
    height: 53px;
    color: rgba(255, 255, 255, 1);
    vertical-align: middle;
    margin-right: 10px;
  }
  .title-text {
    font-size: 42px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    vertical-align: middle;
  }
}
.button-box{
  width:80px;
  height:37px;
  background:rgba(255,255,255,0);
  border:1px solid rgba(255, 255, 255, 1);
  border-radius:25px;
  position: absolute;
  right: 30px;
  top:-40px;
  text-align: center;
  line-height: 37px;
  cursor: pointer;
  color: #fff;
}
.main {
  position: relative;
  top: 105px;
}
</style>
