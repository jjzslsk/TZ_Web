<template>
<div class="page-card-wrapper">
    <el-tabs v-model="activeTabName">
        <!-- <el-tab-pane label="岗位流程配置" name="duty-process-post"></el-tab-pane>
        <el-tab-pane label="值班流程配置" name="duty-process-scheduling"></el-tab-pane> -->
        <el-tab-pane :label="item.meta.title" :name="item.name" v-for="(item,index) in this.$router.options.routes.find(e=>e.name=='integrated-management').children.find(e=>e.name=='duty-process').children" :key="index"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
</div>
</template>

<script>
export default {
    computed: {
        activeTabName: {
            get() {
                return this.$route.name
            },
            set(val) {
                this.$router.replace({
                    name: val
                })
            }
        }
    }
}
</script>

<style lang='postcss' scoped>
.page-card-wrapper{
    height: calc(100% - 60px);
    .el-tabs{
        height: 54px;
    }
    .duty-process-wrap {
        height: calc(100%-54px);
    }
}
</style>
