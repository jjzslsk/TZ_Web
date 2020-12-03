<template>
  <el-container v-if="menuInfo">
    <page-header v-if="isPageHeader" :menuInfo='menuInfo' v-on:childByValue="childByValue" v-on:itemValue="itemValue" v-on:itemPath="itemPath"></page-header>
    <el-main :class="mainShow? 'main-show':'main-hide'">
      <router-view :pathUrl='menuInfo' :extUrl='extUrl' @fatherMethod="fatherMethod"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import pageHeader from '../components/common-header';
import fullPath from "@/router/full-path.js";
import { requestRouterList } from "@/remote/";
export default {
  name: "Admin",
  data() {
    return {
      mainShow:true,
      isPageHeader:true,
      menuInfo:null,
      extUrl:null,
    }
  },
  components: {pageHeader},
  computed: {
    // menuInfo() {
    //   // return this.menus[this.activityId] || {};
    //   const admin = fullPath.filter(item => item.name == "admin")[0];
    //   const menu = admin.children.map(e => ({
    //     // icon: `${e.meta&&e.meta.icon}`,
    //     // title: `${e.meta&&e.meta.title}`
    //     index: `/admin/${e.path}`,
    //     ...(e.meta || {})
    //   }));
    //   return {
    //     menu
    //   };
    // },
  },
    mounted() {
      requestRouterList({
      }).then(res => {
        let vm = this
        if(res.success&&res.data.list.length>0){
          vm.init(res.data.list)
        }else{
          this.$message.success("请登录");
          this.$router.push({'name':'welcome-login'})
        }
      }).catch(error =>{
          this.$message.success("请登录");
          this.$router.push({'name':'welcome-login'})
      });
      const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
      this.extUrl = locaExtUrl
  },
  methods:{
    fatherMethod(data) {
      if(data.name == 'hideHead'){
        this.isPageHeader == true ? this.isPageHeader = false:this.isPageHeader = true
        this.mainShow == true ? this.mainShow = false:this.mainShow = true
      }
      if(data.name == 'weather-warnin'){ //html跳转 天气警报制作页面
        this.$router.push({'name':data.path})
      }
     },
    init(_list){
      let vm = this
      function menuForma(_list){
        _list.map((item) => {
              item.path = item.menuUrl;
              item.icon = item.imageUrl;
              delete item.menuUrl
              delete item.imageUrl
              if(item.children){
                menuForma(item.children)
              }
        });
      }
      menuForma(_list)
      vm.menuInfo = _list
    },
    childByValue(key, keyPath){
      const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
      this.extUrl = locaExtUrl
    },
    itemValue(val){
      const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
      this.extUrl = locaExtUrl
    },
    itemPath(val){
      const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
      this.extUrl = locaExtUrl
    },
  },
};
</script>
<style scoped>
.el-container {
    display: block;
}
.el-main {
    position: relative;
    height: calc(100vh - 61px);
}
.main-show {
      height: calc(100vh - 61px);
}
.main-hide {
      height: 100vh;
}
</style>
