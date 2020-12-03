<template>
<div class="management-duty-page">
    <div class="left-menu-box">
        <el-menu class="menu" :default-active="itemUrl">
            <template v-for="(item,index) in leftData">
                <el-menu-item @click="changeMenu(item)" class="item" :key="index" :index="item.pathFull">
                    <template class="item" slot="title"><i :class="item.meta.icon" v-if="item.meta.icon"></i>{{item.meta.title}}</template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
    <div class="right-wrap-box">
        <iframe :src="itemUrl" frameborder="0" style="height:100%;width:100%"></iframe>
    </div>
</div>
</template>

<script>
import {
    requesMenuList,
    requestMenu
} from "@/remote/";
export default {
    data() {
        return {
            leftData:[],
            itemUrl:null,
    }},
    mounted(){
        this.requestData()
    },
    methods:{
    changeMenu(item){
        this.itemUrl = item.extUrl
    },
    requestData(){ 
        if(this.$route.fullPath == '/network-monitor/voice-monitor'
        ){
            requestMenu().then(res=>{
                res.data.list.forEach(element => {
                    if(element.menuUrl == '/network-monitor'){
                       if(element.children){
                        element.children.forEach(i => {
                            if(i.children){
                                i.children.forEach(item => {
                                  this.leftData.push(item)
                                })
                            }
                        });
                    }
                    }
                });
            this.leftData.map(item=>{
                 item.meta = {
                     icon:'iconfont pageManage',
                     title:item.name
                 }
                 item.pathFull = item.extUrl
            })
            this.itemUrl = this.leftData[0].extUrl
            })
        }
        },
    }
}
</script>

<style lang='postcss' scoped>
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

