<template>
  <div class="temperature-echarts-wrap">
    <div class="echarts-box" ref="myChartRef"></div>
  </div>
</template>
<script>
export default {
  name: 'Echarts',
  props: ['data'],
  data() {
    return {
        chartsTitle:[],
    };
  },
  methods:{
	  myEcharts(){
		  var myChart = this.$echarts.init(this.$refs.myChartRef);
		  var option = {
              color: [ '#0b28fb'],
              title: {
                        text: '降水预报',
                        subtext: '',
                        textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                            fontSize: 12,
                        },
                    },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,//最左边开始
                    data: this.data.date
                },
                yAxis: {
                    type: 'value',
                    name: '降水mm',
                    axisLabel: {
                            // formatter: '{value}mm'
                            formatter: '{value}'
                        }
                },
                tooltip: {
                    trigger: 'axis',
                    // formatter: '{a}:{c}mm',
                },
                legend: {
                    y:"15px",
                    data: this.chartsTitle
                },
                series: this.data.list
            };
          myChart.setOption(option);
		  }
  },
  mounted() {
      this.data.list.forEach(element => {
          element.type = 'bar'
          element.smooth = true
          this.chartsTitle.push(element.name)
      });
    //   let arrRain = []
    //   this.data.list[0].data.map(function (item) {
    //     arrRain.push(item + 'mm')
    //   })
    //   this.data.list[0].data = arrRain
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