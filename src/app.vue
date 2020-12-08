<template>
<div id="app">
    <router-view v-if="isRouterAlive"></router-view>
</div>
</template>
<script>
export default {
    name: 'App',
    provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
            return {
                reload: this.reload,
            }
        },
        data() {
            return{
                isRouterAlive: true //控制视图是否显示的变量
            }
        },
        methods: {
            reload () {
                this.isRouterAlive = false; //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true; //再打开
                }) 
            },
        },
        mounted() {
            
        },
}
</script>
<style lang="postcss">
#app {
    height: 100%;
}
.page-wrapper .left-tree .el-card__body .tree{
    height: 620px;
    overflow: auto;
}
.product-made-home .left-tree .el-card__body .tree{
    height: 520px;
    overflow: auto;
}

/* 穿梭框 */
.c-transfer{
    /* 侧面滚动条 */
    .el-scrollbar__wrap {
    overflow-x: hidden;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
    border-radius: 10px;
    background-color: #f5f5f5;
    }
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
    }
}

</style>
