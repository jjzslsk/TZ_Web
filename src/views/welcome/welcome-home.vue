<template>
  <el-container>
    <el-menu
      :default-active="defaultActive.index"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
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
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
        defaultActive:{
          path:null,
          index:null,
        },
    };
  },
  methods: {
    handleSelect(key, keyPath,path) {
        // this.$router.push({path:path.$attrs.path,query:{key:key}})
        this.linkUrl({path:path.$attrs.path,query:key})
    },
    linkUrl(param = {}){
        this.$router.push({path:param.path,query:{key:param.query}})
        this.defaultActive.index = param.query
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
<style scoped>
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
</style>
