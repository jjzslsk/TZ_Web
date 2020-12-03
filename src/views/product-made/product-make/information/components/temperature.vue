<template>
  <div class="temperature-echarts-wrap">
    <div class="echarts-box" ref="myChartRef"></div>
  </div>
</template>
<script>
export default {
  name: 'Echarts',
  props: ['data','value'],
  data() {
    return {
        chartsTitle:[],
    };
  },
  methods:{
	  myEcharts(){
		  var myChart = this.$echarts.init(this.$refs.myChartRef);
		  var option = {
              grid:{
                // x:40,
                y:90,
                // x2:40,
                // y2:40,
              },
                    title: {
                        text: '模式温度预报',
                        subtext: '',
                        textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                            fontSize: 12,
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        // formatter: '{a}:{c} °C <br/> {b}:{d} °C1',
                    },
                    legend: {
                        y:"15px",
                        data: this.chartsTitle
                    },
                    // toolbox: {
                    //     show: true,
                    //     feature: {
                    //         dataZoom: {
                    //             yAxisIndex: 'none'
                    //         },
                    //         dataView: {readOnly: false},
                    //         magicType: {type: ['line', 'bar']},
                    //         restore: {},
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.data.date
                    },
                    yAxis: {
                        type: 'value',
                        max: this.value.maxTemp,
                        min:this.value.minTemp,
                        name: '温度°C',
                        axisLabel: {
                            // formatter: '{value}°C'
                            formatter: '{value}'
                        }
                    },
                    series: this.data.list,
                };
          myChart.setOption(option);
		  }
  },
  mounted() {
      this.data.list.forEach(element => {
          element.type = 'line'
          this.chartsTitle.push(element.name)
      });
      this.myEcharts();
  }
}
</script>
<style lang="postcss" scoped>
.temperature-echarts-wrap{
    .echarts-box{
        height:260px;
        padding-top: 0rem;
    }
}
</style>