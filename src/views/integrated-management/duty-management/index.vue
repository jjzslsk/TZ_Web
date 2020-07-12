<template>
<div class="management-duty-page">
    <div class="left-menu-box">
        <el-menu class="menu" :default-active="$route.path" router>
            <template v-for="(item,index) in leftData">
                <el-menu-item class="item" :key="index" :index="item.pathFull">
                    <template class="item" slot="title"><i :class="item.meta.icon" v-if="item.meta.icon"></i>{{item.meta.title}}</template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
    <div class="right-wrap-box">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
import {
    requesMenuList,
    requestRouterList
} from "@/remote/";
export default {
    data() {
        return {
            leftData:[]
    }},
    computed: {
        menuLeft() {
            const topNav = this.$router.options.routes.find(e => e.name == "integrated-management");
            const leftNav = topNav.children.find(e => e.name == "duty-management");
            return leftNav.children.map(e => ({
                ...e,
                pathFull: `${topNav.path}/${leftNav.path}/${e.path}`
            }))
        }
    },
    mounted(){
        this.requestData()

    },
    methods:{
    requestData(){
        if(this.$route.fullPath == '/integrated-management/duty-management/post'
        || this.$route.fullPath == '/integrated-management/duty-management/scheduling'
        || this.$route.fullPath == '/integrated-management/duty-management/history'
        || this.$route.fullPath == '/integrated-management/duty-management/attendance'
        || this.$route.fullPath == '/integrated-management/duty-management/overtime'
        ){
            requestRouterList().then(res=>{
                res.data.list.forEach(element => {
                    if(element.children){
                        element.children.forEach(i => {
                            if(i.children && i.menuUrl == '/integrated-management/duty-management'){
                                i.children.forEach(item => {
                                    this.leftData.push(item)
                                });
                            }
                        });
                    }
                });
            this.leftData.map(item=>{
                var index=item.menuUrl.lastIndexOf("\/");
                 item.path = item.menuUrl.substring(index+1,item.menuUrl.length);
                 item.meta = {
                     icon:'iconfont pageManage',
                     title:item.name
                 }
                 delete item.name
                 item.name = item.menuUrl.substring(index+1,item.menuUrl.length);
                 item.pathFull = item.menuUrl
            })
            })
        }
        },
    }
}
</script>

<style scoped>
.management-duty-page {
    display: flex;
    justify-content: space-between;
    background: #F6F6F6;
    height: 100%;

    .left-menu-box {
        width: 200px;
        height: 100%;
        background: #fff;
        display: inline-block;
        

        .menu-icon {
            font-size: 14px;
            margin-right: 10px;
        }
    }

    .right-wrap-box {
        flex: 1;
        /* margin: 20px; */
        margin: 20px 20px 0 20px;
        background: #fff;
        display: inline-block;
        width: calc(100% - 300px);
        .page-wrapper {
            padding: 0;
        }
    }
}

.item {
    line-height: 70px;
    height: 70px;
    border-left: 5px solid rgba(0, 0, 0, 0);

    &.is-active {
        border-left-color: #409EFF;
    }

    & i {
        margin-right: 12px;
    }
}
</style>

