<template>
  <!-- <el-header class="main-header" height="90px" :style="{'background': 'rgba(0, 87, 156, 1)'}"> -->
    <!-- <div class="logo">1系统管理3</div> -->
    <!-- <img :src="menuInfo.logo" class="logo" alt=""> -->
    <!-- <img :src="menuInfo.after" alt=""> -->
    <!-- <el-menu class="menu top" mode="horizontal" :default-active="activeIndex" router>
      <template v-for="(item,index) in menuInfo.menu">
        <el-menu-item class="item" :key="index" :index="item.index" style="padding-left: 0px;">
          <template class="item" slot="title">
            <i :class="item.icon" v-if="item.icon"></i>
            {{item.title}}
          </template>
        </el-menu-item>
      </template>
    </el-menu>
    <c-clock class="clock"></c-clock>
    <account-actions></account-actions> -->
  <!-- </el-header> -->

 <el-menu background-color="#0050a2" router
  text-color="#CCE1FE"
  active-text-color="#fff" v-if="ssdMenuDemo" class="el-menu-demo el-menu-tz menu-main-box" mode="horizontal" @select="handleSelect">
    <div class="logo" @click="clickLogo">
      <img src="../../assets/img/logo.png">
      <div class="title">
        <div class="major">台州市县综合气象业务一体化平台</div>
        <div class="explain">Taizhou Meteorological Service Integration Platform</div>
      </div>
      </div>
    <template v-for="item in menuInfo">
      <el-menu-item :key="item.id" @click="menuItemClick(item)" v-if='!item.children' :index="item.path">{{item.name}}</el-menu-item>
      <el-submenu v-if='item.children && sysMenu' :index="item.id" :key="item.id">
        <template slot="title">{{item.name}}</template>
          <el-menu-item @click="menuTitleClick(itemChildren)" :key="itemChildren.id" :index="itemChildren.path" v-for="itemChildren in item.children">{{itemChildren.name}}</el-menu-item>
      </el-submenu>
    </template>

      <!-- <el-menu-item index="1">处理中心</el-menu-item>

      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu> -->

      <!-- <account-actions></account-actions> -->
      <!-- <div> -->
        <c-clock class="clock"></c-clock>
        <!-- <div class="but-icon"> -->
          <!-- <i class="el-icon-user-solid"></i>
          <i class="el-icon-right" @click="logout"></i> -->
          <account-actions v-if="sysMenu" @fatherMethod="fatherMethod"></account-actions>
        <!-- </div> -->
      <!-- </div> -->

        <div class="transfer-box" v-if="transfer && tabsList">
          <c-transfer class="c-transfer" @checkList="checkList" :leftData="leftData" :rightData="rightData" :titles="['未拥有', '已拥有']" @transfer="handleTransfer" @handleSort="handleSort">
          </c-transfer>
          <el-switch
            v-model="selected"
            active-text="默认配置"
            inactive-text="">
          </el-switch>
        </div>

    </el-menu>

</template>
<script>
import {
  requestProductReference,
  requestProductReferenceTabsList,
  requestProductReferenceUpdate
} from "@/remote/";
import { mapActions, mapGetters } from "vuex";
import eventHub from "@/common/event-hub/";
import CTransfer from '@/components/c-transfer/index.vue'

const widthAsideNomal = "230px";
import {
    requestLogout,
    localStorageToken
} from '@/remote/'
export default {
  components:{
    CTransfer,
  },
  inject:['reload'],   //强制刷新当前页面，可选择移除
    name: 'pageHeader',
    props: {
        'menuInfo': Object,
        'sysMenu': {
            type: Boolean,
            default: true
        }
    },
    created() {
    this.ensureAccountInfo();
    let path = this.$route.path
    let pathStrArr = path.split('/')
    this.activeIndex = `/${pathStrArr[1]}/${pathStrArr[2]}`
  },
  data() {
    return {
      selected:true,
      transfer:false,
      leftData:[],
      rightData:[],
      visibleDialogEditTab:false,
      tabsList: [], //已拥有的菜单
      editoAllMenu:[],//编辑菜单里的所有菜单
      notMenu:false,// false未配置菜单，turn已配置
      ssdMenuDemo:true,
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      widthAside: widthAsideNomal,
      activeIndex:"",
      checkboxData:null,
    };
  },
  watch: {
    activityId: {
      handler: function(id) {
        this.getMenuInfo({
            id
        });
      },
      immediate: true
    },
    $route () {
      let path = this.$route.path
      let pathStrArr = path.split('/')
      this.activeIndex = `/${pathStrArr[1]}/${pathStrArr[2]}`
    }
  },
  watch: {
    transfer(val){
      if(val){
         this.requestData().then(()=>{
            this.rightData = [] //已拥有
            this.leftData = [] //未拥有
            this.tabsList.forEach(element => {//过滤拥有的
              this.rightData.push({name:element.title,id:element.id,content:element.content,title:element.title})
            });

            //过滤未拥有的
            this.leftData = this.editoAllMenu
            this.rightData.forEach((element,_index) => {
              this.editoAllMenu.forEach((i,index) => {
                if(element.id == i.id){
                  this.leftData.splice(index, 1);
                }
              });
            });

            //标题名称属性
            this.leftData.forEach(item => {
              item.titleName = item.title
            });
            //标题名称属性
            this.rightData.forEach(item => {
              item.titleName = item.title
            });

            return {name:'123'}
          })
          if(!this.notMenu){
            this.rightData = this.editoAllMenu
          }
      }
    }
  },
  methods: {
    checkList(data){
      this.checkboxData = data
      console.log(this.checkboxData)
    },
    clickLogo(){
      this.$emit('clickLogo', 'clickLogo')
    },
    fatherMethod(data){
      if(data.name == 'saveForm'){//参考菜单配置
        this.transfer = false;//穿梭框
        this.$confirm('菜单保存，页面数据会被刷新, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.allocation()
          requestProductReferenceUpdate(this.allocation()).then(()=>{
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.reload(); //强制刷新当前页面，可选择移除
          })
          this.transfer = true;
        }).catch(() => {
          this.transfer = true;
        });
      }

      else if(data.type == '参考菜单配置'){
        this.transfer = true;
      }else{
        this.transfer = false;
      }
    },

    //初始化页面数据
    async requestData() {
      //获取所有TAB菜单
      await requestProductReferenceTabsList().then(res => {
        this.tabsList = res.data.list;
        
        //默认所有菜单编辑
        this.editoAllMenu = res.data.list
        this.editoAllMenu.forEach(element => {
          element.titleName = element.title
        });
      });

      //获取该用户TAB菜单
      await requestProductReference().then(res=>{
        //过滤拥有的菜单
        if(res.success){
          this.notMenu = true
          let menu = []
            if(res.data){
              res.data.split(",").forEach(item => {
              this.tabsList.forEach(element => {
                if(item == element.content){
                  menu.push(element)
                }
              });
            });
            this.selected = res.selected == 0? true:false
          }
          this.tabsList = menu
        }else{
          this.notMenu = false
        }
      })

    },

        //穿梭框
    allocation(){
      let menu = []
      this.rightData.forEach(element => {
        menu.push(element.content)
      });
      // return {reference:menu.toString(),selected:this.selected? 0:1,txtData:this.checkboxData.toString()}
      console.log(this.checkboxData.toString())
      return {reference:menu.toString(),selected:this.selected? 0:1,txtData:`${this.checkboxData.toString()}`}
    },
    editTab(){
      this.visibleDialogEditTab = true
    },
        handleTransfer(type, data, callback) {
      if (type == 'left') {
        this.rightData = this.rightData.concat(this.leftData[data]);
      } else {
        this.leftData = this.leftData.concat(this.rightData[data])
      }
      this[type + 'Data'].splice(data, 1);
      callback(type);
    },
    handleSort(type, sortType, data, callback) {
      if (!sortType || sortType == 'right') {
        if (type == 'up') {
          this.rightData = this.swapItems(this.rightData, data[1], data[1] - 1)
          callback(sortType, [data[0], data[1] - 1]);
        } else {
          this.rightData = this.swapItems(this.rightData, data[1], data[1] + 1)
          callback(sortType, [data[0], data[1] + 1])
        }
      } else if (sortType == 'left') {
        if (type == 'up') {
          this.leftData = this.swapItems(this.leftData, data[0], data[0] - 1)
          callback(sortType, [data[0] - 1, data[1]]);
        } else {
          this.leftData = this.swapItems(this.leftData, data[0], data[0] + 1)
          callback(sortType, [data[0] + 1, data[1]])
        }
      } else if (sortType == 'both') {
        if (type == 'up') {
          data[0] == 0 ? '' : this.leftData = this.swapItems(this.leftData, data[0], data[0] - 1)
          data[1] == 0 ? '' : this.rightData = this.swapItems(this.rightData, data[1], data[1] - 1)
          callback(sortType, [data[0] == 0 ? data[0] : (data[0] - 1), data[1] == 0 ?  data[1] : (data[1] - 1)]);
        } else {
          data[0] == (this.leftData.length - 1) ? '' : this.leftData = this.swapItems(this.leftData, data[0], data[0] + 1)
          data[1] == (this.rightData.length - 1) ? '' : this.rightData = this.swapItems(this.rightData, data[1], data[1] + 1)
          callback(sortType, [data[0] == (this.leftData.length - 1) ? data[0] : (data[0] + 1), data[1] == (this.rightData.length - 1) ? data[1] : (data[1] + 1)])
        }
      }
    },
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    addText(myValue){
      function insertAtCursor(myField, myValue) {
 
        //IE 浏览器
        if (document.selection) {
          myField.focus();
          sel = document.selection.createRange();
          sel.text = myValue;
          sel.select();
        }
      
        //FireFox、Chrome等
        else if (myField.selectionStart || myField.selectionStart == '0') {
          var startPos = myField.selectionStart;
          var endPos = myField.selectionEnd;
      
          // 保存滚动条
          var restoreTop = myField.scrollTop;
          myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
          
          if (restoreTop > 0) {
            myField.scrollTop = restoreTop;
          }
          
          myField.focus();
          myField.selectionStart = startPos + myValue.length;
          myField.selectionEnd = startPos + myValue.length;
        } else {
          myField.value += myValue;
          myField.focus();
        }
      }
    },
    //   //穿梭框 end

    htmlFun(){
      this.ssdMenuDemo = false
    },
    //只有一级菜单时，被点击 如天气概览、3D监测
    menuItemClick(itemValue){
      if(itemValue.extUrl && itemValue.path =='/web'){
        localStorage.setItem('extUrl', JSON.stringify(itemValue.extUrl))
        const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
        // console.log('loginData:000',locaExtUrl)
      }
        this.$emit('itemValue', itemValue.extUrl)
    },
    menuTitleClick(val){
      if(val.extUrl && val.path =='/web'){
        if(val.extUrl.substring(0,7) == '/static'){
          localStorage.setItem('extUrl', JSON.stringify('../../../..' + val.extUrl))
          const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
          this.$emit('itemPath', val)
        }else{
          localStorage.setItem('extUrl', JSON.stringify(val.extUrl))
          const locaExtUrl = JSON.parse(localStorage.getItem('extUrl'))
          this.$emit('itemPath', val)
        }
        // console.log('loginData:000',locaExtUrl)
      }
    },
    handleSelect(key, keyPath) {
        console.log("key1:",key, keyPath);
        if(!key){
          this.$message.warning("正在开发中");
        }
        this.$emit('childByValue', keyPath)
    },

    ...mapActions(["ensureAccountInfo", "getMenuInfo"]),
    setWidthAsider(width) {
      this.widthAside = width;
      eventHub.$emit("resize");
    },
    closeAside() {
      this.setWidthAsider("0");
    },
    openAside() {
      this.setWidthAsider(widthAsideNomal);
    },
    logout() {
        const vm = this;
        vm.$confirm('是否确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        const loginData = JSON.parse(localStorage.getItem('loginData'))
        if(loginData !== null){
                    if(loginData.jwt !== null){
                        if(loginData.jwt.access_token !== null){
                            var tokenInfo = loginData.jwt.access_token
                            // console.log(loginData.jwt.access_token) loginInfo
                            requestLogout({token:loginData.jwt.access_token}).then(res => {
                            if(res.success){
                              localStorage.removeItem('loginInfo')
                              localStorage.removeItem('loginData')
                              localStorage.clear();
                              vm.$router.push({
                                // 'name': 'login'
                                'name': 'welcome-login'
                              });
                            }
                        })
                        }
                    }
                }else {
                    console.log(loginData)

                }

        }).catch(() => {
          // vm.$message({
          //   type: 'info',
          //   message: '取消'
          // });
        });
      },
      ...mapActions(['ensureAccountInfo'])
  },
  computed: {
    // menuList() {
      // console.log('headerMenu::',JSON.parse(localStorage.getItem('headerMenu')))
      // return  JSON.parse(localStorage.getItem('headerMenu'))
    // },
    activityId() {
      return this.$route.params.activityId;
    },
    ...mapGetters(["menus"])
  },
  mounted() {
      window.htmlFun = this.htmlFun;
      this.ensureAccountInfo();
  }
};
</script>

<style lang="postcss" scoped>
.main-header {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    clear: both;
  }

  .logo {
    padding-left: 1em;
    line-height: 90px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }

  > img {
    float: left;
  }

  .clock {
    position: absolute;
    top: 15px;
    /* right: 150px; */
    right: 140px;
    display: inline-block;
  }
}

.aside {
  font-size: 15px;
  font-weight: 400;
  position: relative;
  overflow: visible;
  padding-top: 10px;

  .nav-title {
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    cursor: default;
    position: relative;
    height: 70px;
    line-height: 68px;
    padding-left: 30px;

    .icon-nav-right {
      font-size: 12px;
      line-height: 12px;
      position: absolute;
      right: 15px;
      top: 28px;
      cursor: pointer;
    }
  }
}
.clock {
    outline: 0;
    position: absolute;
    top: 0;
    right: 108px;
    display: inline-block;
  }
  /* .but-icon {
    height: 60px;
    line-height: 60px;
    position: absolute;
    top: 0;
    right: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #fff;
    width: 77px;
    font-size: 24px;
  } */
  .el-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 200px;
  }
.logo {
    outline: 0;
    padding-left: 1em;
    /* line-height: 90px; */
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
  .title{
    .major{

    }
    .explain{
      font-size: 12px;
      font-weight: 400;
    }
  }
  }

  /* 菜单选中样式 */
  .menu-main-box {
      .is-active{ 
              color: rgb(204, 225, 254)!important;
              border-bottom-color: rgba(255, 255, 255, 0)!important;
              /* background-color: rgba(255, 255, 255, 0)!important; */
      }
  }
  .transfer-box {
    position: fixed;
    top: 10rem;
    left: calc(50% - 400px);
    z-index: 9999;
    width: 800px;
    .el-switch{
      position: absolute;
      top:355px;
      left: 220px;
    }
  }
</style>
<style lang="postcss">
@media screen and (min-width:900px) and (max-width:1440px){
  .el-menu-tz{
  .el-menu-item,.el-submenu__title{
    padding: 0 6px;
  }
  .logo{
    /* display:none; */
    font-size:16px;
    img{
      height: 26px;
    }
  }
}
}
@media screen and (min-width:10px) and (max-width:1024px){
  .el-menu-tz{
    padding-right: 110px !important;
  .el-menu-item,.el-submenu__title{
    padding: 0 6px;
  }
  .logo{
    display:none;
  }
  .clock {
    display: none;
  }
  .el-submenu__icon-arrow {
    /* display:none; */
  }
}
}
</style>
