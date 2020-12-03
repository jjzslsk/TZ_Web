<template>
<c-chart class="chartDialogResult" @mounted="onChartMounted"></c-chart>
</template>

<script>
export default {
    props: ['data'],
    methods: {
        getChartOption() {
            let optionObj = {
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar'
                    }]
            }
            return optionObj
        },
        onChartMounted(chart) {
            chart.initOption({
                option: this.getChartOption()
            });
        },
    }
}
</script>

<style lang="css" scoped>
</style>
