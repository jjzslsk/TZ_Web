<template>
  <div class="temperature-echarts-wrap">
    <div class="content" >
        <div class="item-wrap">
          <div class="date-option">
            <el-row>
              <span class="date-title">时间选择</span>
              <el-date-picker 
                class="form-day"
                v-model="forecastTime.dateOption"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                :clearable='false'
                placeholder="选择日期">
              </el-date-picker>
              <el-select class="form-time" v-model="forecastTime.formTime" size="mini" placeholder="请选择时段">
                <el-option label="00时" value="00"></el-option>
                <el-option label="01时" value="01"></el-option>
                <el-option label="02时" value="02"></el-option>
                <el-option label="03时" value="03"></el-option>
                <el-option label="04时" value="04"></el-option>
                <el-option label="05时" value="05"></el-option>
                <el-option label="06时" value="06"></el-option>
                <el-option label="07时" value="07"></el-option>
                <el-option label="08时" value="08"></el-option>
                <el-option label="09时" value="09"></el-option>
                <el-option label="10时" value="10"></el-option>
                <el-option label="11时" value="11"></el-option>
                <el-option label="12时" value="12"></el-option>
                <el-option label="13时" value="13"></el-option>
                <el-option label="14时" value="14"></el-option>
                <el-option label="15时" value="15"></el-option>
                <el-option label="16时" value="16"></el-option>
                <el-option label="17时" value="17"></el-option>
                <el-option label="18时" value="18"></el-option>
                <el-option label="19时" value="19"></el-option>
                <el-option label="20时" value="20"></el-option>
                <el-option label="21时" value="21"></el-option>
                <el-option label="22时" value="22"></el-option>
                <el-option label="23时" value="23"></el-option>
              </el-select>
            </el-row>
          </div>
      </div>
      <div class="echarts-box" ref="myChartRef"></div>
    </div>
  </div>
</template>
<script>
import {
    requestProductMakeWarms,
} from "@/remote/";
export default {
  name: 'Echarts',
  props: ['data','value'],
  data() {
    return {
      forecastTime:{
        dateOption: JSON.stringify(new Date()).substring(1,11),
        formTime:'00',
      },
      resData:{
        time:[],
        list:[],
      },
    };
  },
  watch:{
    forecastTime:{
      handler(val, oldVal){
                this.requestData({forecastTime:`${this.forecastTime.dateOption.split('-').join('')}${this.forecastTime.formTime}`})
            },
            deep:true
    }
  },
  methods:{
    requestData(param){
      requestProductMakeWarms(param).then((res)=>{
          this.resData = res.data
          this.resData.list.forEach((item,_index) => {
            this.resData.list[_index].winddata = this.resData.list[_index].windv.map((element,index) => {
              return {name:item.name,value:element,symbolRotate: 360 - Number(this.resData.list[_index].windd[index]),windv:this.resData.list[_index].windv[index],winddName:this.resData.list[_index].winddName[index]}
            });
          });
          this.myEcharts(this.resData);
        })
      },

	  myEcharts(resData){
        var myChart = this.$echarts.init(this.$refs.myChartRef);
        var option = {
          xAxis: {
          type: 'category',
          data: resData.time
      },
      title: {
          left: 'center',
          text: '浙江WARMS通化模式',
      },
      yAxis: {
          name: '风力',
          type: 'value',
          // max: 500
    },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: function(params){
          let res =`<div style="text-align: left;">${params[0].axisValue}时&nbsp;站点&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;风力&nbsp;&nbsp;风向<div>`;
            params.map((element,index) => {
              res += `<div style="text-align: left;display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background:${element.color};"></div>
              <span style="width:80px;display: inline-block;">${element.name}：</span>${element.value}&nbsp;&nbsp;${element.data.winddName}<br>`
          });
          return res
        }
      },
      legend: {
        y:'bottom',
          data: function(){
            return resData.list.map(element => {
              return element.name
            })
          }()
      },
      series: function (){
        return resData.list.map(element => {
            return {
              name: element.name,
              type: 'line',
              data: element.winddata,
              symbol: "image://./../../../../../../static/images/windPoint.png",
              symbolSize: '10',
              smooth: true
            }
          });
      }()
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    this.requestData({forecastTime:`${this.forecastTime.dateOption.split('-').join('')}${this.forecastTime.formTime}`})
  }
}
</script>
<style lang="postcss" scoped>
.content {
  height: calc(100% - 129px)!important;
  .item-wrap{
    overflow: auto;
    .date-option {
      .date-title{
        text-align: right;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .form-time {
        width: 4.6rem;
      }
      .form-day{
        width: 10.8em;
      }
    }
    .but-box{
    text-align: left;
    margin-bottom:15px;
    .el-tag{
      margin: 4px;
    }
    .active-tag {
      background: red;
      color: black;
    }
  }
  .tab-wrap{
    display: inline-block;
    width: 600px;
  }
  }
}
.echarts-box {
  width: 100%;
  height: 300px;
  
}
</style>