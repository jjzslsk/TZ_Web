<template>
  <el-container class="welcome-home">
    <el-menu
      :default-active="defaultActive.index"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#55799a"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
    <div class="logo" @click="clickLogo">
      <img src="../../assets/img/logo.png">
      <span>台州市县综合气象业务一体化平台</span></div>
      <el-menu-item index="/login" path="/welcome-login">
        <i class="el-icon-s-home"></i>
        <span slot="title"></span>
      </el-menu-item>
      <el-menu-item index="/QJT" path="/html-page">气候平台</el-menu-item>
      <el-menu-item index="/suddenWeather" path="/html-page">智能提醒</el-menu-item>
      <el-menu-item index="/remindergis" path="/html-page">实况监控(地图)</el-menu-item>
      <el-menu-item index="/reminder" path="/html-page">实况监控</el-menu-item>
      <el-menu-item index="/TZ_typhoon" path="/html-page">台风服务</el-menu-item>
      <el-menu-item index="/TZ_3D" path="/html-page">3D监测</el-menu-item>
      <el-menu-item index="/forecast" path="/html-page">数值预报</el-menu-item>
      <el-menu-item index="/situation-page" path="/situation-page">天气概览</el-menu-item>
    </el-menu>
    <el-main>
      <div v-if="nightMode" class="night-wrap">
        <iframe class="night-iframe" src="http://10.137.4.30/static/html/main/index.html" frameborder="0"></iframe>
        <div class="link" :style="nightMode? 'background-color: #0050a2':'background-color: #409eff;'">
          <a class="title" >常用链接</a>
          <a class="item" v-for="(i,index) in linkData" :key="index" :href='i.href' :target='i.target'  :style="skin? 'color: #409eff':'color: #fff;'">{{i.name}}</a>
        </div>
      </div>
      <router-view v-else></router-view>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      linkData:[
          {name:'中央台天气业务内网',href:'http://10.1.64.146/npt',target:'_blank'},
          {name:'省局综合业务网',href:'http://172.21.129.77/index8.html',target:'_blank'},
        ],
        nightMode:false,
        defaultActive:{
          path:null,
          index:null,
        },
    };
  },
  methods: {
    clickLogo(){
      if(this.defaultActive.index !== '/situation-page') return
      this.nightMode = !this.nightMode
      // this.$emit('clickLogo', 'clickLogo')
    },
    handleSelect(key, keyPath,path) {
        // this.$router.push({path:path.$attrs.path,query:{key:key}})
        
        this.linkUrl({path:path.$attrs.path,query:key})
    },
    linkUrl(param = {}){
        this.$router.push({path:param.path,query:{key:param.query}})
        this.defaultActive.index = param.query
        if(this.defaultActive.index !== '/situation-page') {
          this.nightMode = false
        }
    },
  },
    mounted(){
      console.log(this.$route.query)
      this.$nextTick(function(){
        this.linkUrl({path:this.$route.query.path,query:this.$route.query.index})
      })
    },
};
</script>
<style scoped lang="postcss">
.el-container {
    display: block;
}
.el-main {
    height: calc(100vh - 61px);
}

    /* height: calc(100vh - 61px); */
    .el-menu--horizontal>.el-menu-item{
      float: right;
      /* background:rgb(0, 80, 162) !important; */
    }
    .el-menu{
      /* background:rgb(0, 80, 162) !important; */
    }
    .el-icon-s-home{
      color: #fff;
    }
    .el-menu-item :first-child{ 
      padding: 0 80px 0 80px  !important;
    }
    .logo {
    outline: 0;
    padding-left: 1em;
    line-height: 61px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    position: absolute;
    left: 0px;
    display: flex;
    align-items: center;
    cursor:pointer;
    > img {
    float: left;
    height: 44px;
    cursor:pointer;
  }
    }
    .night-wrap{
      width: 100%;
      height: 100%;
    }
    .night-iframe{
      width: 100%;
      height: calc(100% - 15px);
    }
    .link{
    position: fixed;
    bottom: 0;
    left: 0;
    height: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #409eff;
    color: #fff;
    font-size:12px;
    a {
      margin: 0 10px;
    }
    .item{
      cursor:pointer;
    }
  }
</style>