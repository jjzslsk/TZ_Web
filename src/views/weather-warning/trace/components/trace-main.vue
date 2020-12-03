<template>
<div class="main">
    <el-container>
        <el-aside width="620px">
            <!-- <red-head :data="dataReadHead" v-bind="$attrs"></red-head> -->
            <red-head v-bind="$attrs"></red-head>
        </el-aside>
        <el-main>
            <!-- <send-info :data="data" v-bind="$attrs"></send-info> -->
            <send-info v-bind="$attrs"></send-info>
        </el-main>
    </el-container>
</div>
</template>
<script>
import redHead from '../../../components/red-head.vue'
import sendInfo from './send-info.vue'
export default {
    components: {
        redHead,
        sendInfo
    },
    // props: ['data'],
    // computed: {
    //     dataReadHead() {
    //         const {
    //             data
    //         } = this;
    //         if (data) {
    //             const {
    //                 isWarning
    //             } = this;
    //             debugger
    //             return transformRedHead({
    //                 ...data,
    //                 ...alarmMain
    //             }, isWarning)
    //         }
    //     }
    // }
}
</script>
<style scoped>
.main .el-container {
    background: rgba(255, 255, 255, 1);
}
</style>
