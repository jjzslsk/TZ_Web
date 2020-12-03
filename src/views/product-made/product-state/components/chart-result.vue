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
        toPoint(percent){
            var str=percent.replace("%","");
            str= str/100;
            return str;
        },
        transformData({
            key
        }) {
            const {
                infoOfStatic
            } = this;
            const info = infoOfStatic[key];
            let res = [{
                name: '发送成功',
                color: '#71c438',
                // value: this.toPoint(info.sendSuccess)
                value: info.sendSuccess
            }, {
                name: '发送失败',
                color: '#fd5634',
                value: info.sendFail
            }, {
                name: '正在推送',
                color: '#754ffa',
                value: info.pushing
            }, {
                name: '推送成功',
                color: '#2da1f8',
                value: info.pushSuccess
            }, {
                name: '推送失败',
                color: '#f99e1a',
                value: info.pushFail
            }];

            return res;
        },
        getChartOption() {
            const {
                transformData,
            } = this;

            const infos = [];
            this.data.forEach(element => {
                console.log(element)
                let param = {}
                // if(element.publishChannel == 'EMAIL'){
                //     param.label = "邮件",
                //     param.data = transformData({
                //         key: "EMAIL"
                //     })
                // infos.push(param)
                // }
                // if(element.publishChannel == 'FAX'){
                //     param.label = "传真",
                //     param.data = transformData({
                //         key: "FAX"
                //     })
                // infos.push(param)
                // }
                // if(element.publishChannel == 'FTP'){
                //     param.label = "FTP",
                //     param.data = transformData({
                //         key: "FTP"
                //     })
                // infos.push(param)
                // }
                // if(element.publishChannel == 'SMS'){
                //     param.label = "短信",
                //     param.data = transformData({
                //         key: "SMS"
                //     })
                // infos.push(param)
                // }
                param.label = element.channelName,
                param.data = transformData({
                    key: element.publishChannel
                })
                infos.push(param)
            });

            const title = infos.map((e, i) => ({
                text: e.label,
                bottom: 115,
                left: `${i * 25 + 12.5}%`,
                textAlign: 'center'
            }));

            const data = infos[0].data
            const color = data.map(e => e.color);

            const series = infos.map((e, i) => ({
                type: 'pie',
                radius: ['40%', '53%'],
                clockwise: false,
                center: ['50%', '46%'],
                data: e.data,
                animation: false,
                label: {
                    formatter: '{c}({d}%)',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
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
                    bottom: 20,
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
