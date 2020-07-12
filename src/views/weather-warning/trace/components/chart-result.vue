<template>
<c-chart class="chartDialogResult" @mounted="onChartMounted"></c-chart>
</template>

<script>
export default {
    props: ['data'],
    computed: {
        infoOfStatic() {
            const {
                data
            } = this;

            const info = data.reduce((p, c) => {
                p[c.publishChannel] = c
                return p
            }, {});
            return info
        }
    },
    methods: {
        transformData({
            key
        }) {
            const {
                infoOfStatic
            } = this;
            const info = infoOfStatic[key];

            let res = [{
                name: '发送成功',
                color: 'rgba(64, 158, 255, 1)',
                value: info.sendSuccess
            }, {
                name: '发送失败',
                color: 'rgba(245, 108, 108, 1)',
                value: info.sendFail
            }, {
                name: '正在推送',
                color: 'rgba(98, 218, 172, 1)',
                value: info.pushing
            }, {
                name: '推送成功',
                color: 'rgba(100, 119, 152, 1)',
                value: info.pushSuccess
            }, {
                name: '推送失败',
                color: 'rgba(247, 191, 34, 1)',
                value: info.pushFail
            }];

            return res;
        },
        getChartOption() {
            const {
                transformData
            } = this;

            const infos = [{
                label: "邮件",
                data: transformData({
                    key: "EMAIL"
                })
            }, {
                label: "传真",
                data: transformData({
                    key: "FAX"
                })
            }, {
                label: "FTP",
                data: transformData({
                    key: "FTP"
                })
            }, {
                label: "LED显示屏",
                data: transformData({
                    key: "EMAIL"
                })
            }];

            const title = infos.map((e, i) => ({
                text: e.label,
                bottom: 55,
                left: `${i * 25 + 12.5}%`,
                textAlign: 'center'
            }));

            const data = infos[0].data
            const color = data.map(e => e.color);

            const series = infos.map((e, i) => ({
                type: 'pie',
                clockwise: false,
                radius: '50%',
                center: ['50%', '40%'],
                data: e.data,
                animation: false,
                label: {
                    formatter: '{c}'
                },
                left: `${i * 25}%`,
                right: `${100 - (i + 1) * 25}%`,
                top: 0,
                bottom: 0
            }));

            const option = {
                color,
                title,
                legend: {
                    // orient: 'vertical',
                    // top: 'middle',
                    bottom: 10,
                    left: 'center',
                    data: data.map(e => e.name)
                },
                series
            };
            console.log('option', option);
            return option
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
