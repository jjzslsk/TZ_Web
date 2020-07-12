<template>
<div class="common-chart-wrapper">
    <div ref="mount-point" class="common-chart-mount-point chartDialogReal"></div>
</div>
</template>

<script>
import {
    initChart,
    initChartWithOption
} from '@/common/chart'
export default {
    mounted() {
        this.$emit("mounted", this)
    },
    methods: {
        gotData({
            option
        }) {
            const target = this.$refs["mount-point"];
            // 基于准备好的dom，初始化echarts实例
            initChart({
                target,
                data
            })
        },
        initOption({
            option
        }) {
            const target = this.$refs["mount-point"];
            // 基于准备好的dom，初始化echarts实例
            initChartWithOption({
                target,
                option
            })
        }
    }
}
</script>

<style scoped>
.common-chart-wrapper,
.common-chart-mount-point {
    height: 100%;
}
</style>
