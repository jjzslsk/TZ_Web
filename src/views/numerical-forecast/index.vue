<template>
  <el-container v-if="menuInfo">
    <page-header :menuInfo='menuInfo' v-on:childByValue="childByValue"></page-header>
    <el-main>
      <router-view :pathUrl='menuInfo'></router-view>
    </el-main>
     <popup-music></popup-music>
  </el-container>
</template>

<script>
import pageHeader from '../components/common-header';
import popupMusic from '../components/popup-music';
import fullPath from "@/router/full-path.js";
import { requestRouterList } from "@/remote/";
export default {
  name: "Admin",
  data() {
    return {
      menuInfo:null
    }
  },
  components: {pageHeader,popupMusic},
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
  },
  methods:{
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
      console.log('childByValue::',key, keyPath)
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
</style>
