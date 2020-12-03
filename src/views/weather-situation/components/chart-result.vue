<template>
  <div id="chart_example" v-if="resObj.data&&type"></div>
</template>
<script>
import { requestWarningObj } from "@/remote/";
import echarts from "echarts";
export default {
  props: ["type"],
  data() {
    return {
      resObj:{
        data:null,
        forecast:null,
        title:null,
      },
      hisMaxTemp:null,
      hisMinTemp:null,
      chartsMaxTemp:null,
      chartsMinTemp:null,
      filtrateMaxTemp:null,
    };
  },
  methods: {
    //初始化数据
    async refreshData(){
     await requestWarningObj({type:this.type}).then(res=>{
        let max = []
        res.data.data.forEach(element => {
          max.push(element.maxToday)
        });
        this.filtrateMaxTemp = Math.max.apply(null,max);
        this.chartsMaxTemp = res.data.max
        this.chartsMinTemp = res.data.min
        this.hisMaxTemp = res.data.hisMaxTemp
        this.hisMinTemp = res.data.hisMinTemp
        this.resObj.data = res.data.data
        this.resObj.forecast = []
        this.resObj.title = 'HOBART'
        this.resObj.data.forEach(element => {
          element.maxToday = Number(element.maxToday)
          element.minToday = Number(element.minToday)
          element.maxWind = element.windl
          element.minWind = element.windd
          element.rainHeight = Number(element.rainHeight)
          element.skyIcon = "icon" + element.skyIcon,
          this.resObj.forecast.push({
            "localDate": element.time,
            "day":element.dayDate,
            "rn": 2,
            "minTemp": element.minToday,
            "maxTemp": element.maxToday,
            "skyIcon": "icon" + element.skyIcon,
            "weatherIcon": "MostlySunnyPartlyCloudy",
            "rangePrecipText": "0 to 1 mm"
          })
        });
      })
      this.rawDataEvl(this.resObj)
    },
    rawDataEvl(rawData){
      var rawData = rawData
      let myChart = echarts.init(document.getElementById("chart_example"));
      var weatherIcons = {
        Showers: "../../../../static/images/weather/showers_128.png",
        Sunny: "../../../../static/images/weather/sunny_128.png",
        Cloudy: "../../../../static/images/weather/cloudy_128.png",
        icon0: "../../../../static/images/weather/0.png",
        icon1: "../../../../static/images/weather/1.png",
        icon2: "../../../../static/images/weather/2.png",
        icon3: "../../../../static/images/weather/3.png",
        icon4: "../../../../static/images/weather/4.png",
        icon5: "../../../../static/images/weather/5.png",
        icon6: "../../../../static/images/weather/6.png",
        icon7: "../../../../static/images/weather/7.png",
        icon8: "../../../../static/images/weather/8.png",
        icon9: "../../../../static/images/weather/9.png",
        icon10: "../../../../static/images/weather/10.png",
        icon11: "../../../../static/images/weather/11.png",
        icon12: "../../../../static/images/weather/12.png",
        icon13: "../../../../static/images/weather/13.png",
        icon14: "../../../../static/images/weather/14.png",
        icon15: "../../../../static/images/weather/15.png",
        icon16: "../../../../static/images/weather/16.png",
        icon17: "../../../../static/images/weather/17.png",
        icon18: "../../../../static/images/weather/18.png",
        icon19: "../../../../static/images/weather/19.png",
        icon20: "../../../../static/images/weather/20.png",
        icon21: "../../../../static/images/weather/21.png",
        icon22: "../../../../static/images/weather/22.png",
        icon23: "../../../../static/images/weather/23.png",
        icon24: "../../../../static/images/weather/24.png",
        icon25: "../../../../static/images/weather/25.png",
        icon26: "../../../../static/images/weather/26.png",
        icon27: "../../../../static/images/weather/27.png",
        icon28: "../../../../static/images/weather/28.png",
        icon29: "../../../../static/images/weather/29.png",
        icon30: "../../../../static/images/weather/30.png",
        icon31: "../../../../static/images/weather/31.png",
      };

      var directionMap = {};
      echarts.util.each(
        [
          "W",
          "WSW",
          "SW",
          "SSW",
          "S",
          "SSE",
          "SE",
          "ESE",
          "E",
          "ENE",
          "NE",
          "NNE",
          "N",
          "NNW",
          "NW",
          "WNW"
        ],
        function(name, index) {
          directionMap[name] = (Math.PI / 8) * index;
        }
      );

      //柱形 数据
      var data = echarts.util.map(rawData.data, function(entry) {
        //按顺序排列
        return [
          entry.time,
          entry.maxToday,
          entry.minToday,
          entry.windd,
          entry.rainHeight,
          entry.windl,
          entry.wind,
          entry.maxWind,
          entry.minWind,
          entry.dayDate,
          weatherIcons[entry.skyIcon],
          ];
      });

      //   console.log(data)

      //天气图
      var weatherData = echarts.util.map(rawData.forecast, function(entry) {
        return [
          entry.localDate,
          entry.rn,
          weatherIcons[entry.skyIcon],
          entry.day,
          entry.minTemp,
          entry.maxTemp
        ];
      });

      var dims = { //按顺序排列
        time: 0,
        maxToday: 1,
        minToday: 2,
        windd: 3,
        rainHeight: 4,
        windl: 5,
        wind: 6,
        maxWind:7,
        minWind:8,
        dayDate:9,
        weatherIcon: 10,
        rn: 11,
        day: 12,
        minTemp: 13,
        maxTemp: 14
      };
      var arrowSize = 0;
      var weatherIconSize = 35;

      //箭头控制
      function renderArrow(param, api) {
        var point = api.coord([
          api.value(dims.time),
          api.value(dims.maxToday)
        ]);
        return {
          type: "path",
          shape: {
            pathData: "M31 16l-15-15v9h-26v12h26v9z",
            x: -arrowSize / 1,
            y: -arrowSize / 2,
            width: arrowSize,
            height: arrowSize
          },
          rotation: directionMap[api.value(dims.wind)],
          position: point,
          style: api.style({
            stroke: "#555",
            lineWidth: 1
          })
        };
      }

      //头部图文配置
      function renderWeather(param, api) {
        var point = api.coord([
          api.value(dims.time) + (3600 * 24 * 1000) / 2,
          0
        ]);
        return {
          type: "group",
          children: [
            {
              type: "image",
              style: {
                image: api.value(dims.weatherIcon),
                x: -weatherIconSize / 2 + (-param.coordSys.width / 14),
                y: -110,
                width: weatherIconSize,
                height: weatherIconSize
              },
              position: [point[0], 130]
            },
            {
              type: "text",
              style: {
                // x: -80 / 2, api.value(dims.wind).substring(0, api.value(dims.wind).length - 2 );
                // y: -80 / 2,
                x: -param.coordSys.width / 14,
                y: -130,
                text: `${api.value(dims.wind).substring(0, api.value(dims.wind).length - 2 )}
${api.value(dims.wind).substring(api.value(dims.wind).length-2)}`,
                //   "东北风",
                //   api.value(dims.minTemp) +
                //   " - " +
                //   api.value(dims.maxTemp) +
                //   "°",
                textFont: api.font({ fontSize: 14 }),
                textAlign: "center",
                textVerticalAlign: "bottom"
              },
              position: [point[0], 390]
            },
            {
              type: "text",
              style: {
                // x: -80 / 2,
                // y: 30 / 2,
                x: -param.coordSys.width / 14,
                y: -338,
                text: `${api.value(dims.dayDate)}日`,
                textFont: api.font({ fontSize: 14 }),
                textAlign: "center",
                textVerticalAlign: "bottom"
              },
              position: [point[0], 360]
            }
          ]
        };
      }

      let option = {
        // title: {
        //   text: "天气 风向 风速 海浪 预报",
        //   subtext: "示例数据源于 www.seabreeze.com.au",
        //   left: "center"
        // },

        //鼠标提示语
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            return [
              echarts.format.formatTime(
                "yyyy-MM-dd",
                // "yyyy-MM-dd",
                params[0].value[dims.time]
              ),
              // +
              // " " +
              // echarts.format.formatTime("hh:mm", params[0].value[dims.time])
              "温度：" + params[0].value[dims.maxToday] + '℃-' + params[0].value[dims.minToday] + '℃',
              "风向：" + params[0].value[dims.windd],
              // "风速：" + params[0].value[dims.maxWind] + '-' + params[0].value[dims.minWind],
              "风力：" + params[0].value[dims.windl] + "m/s",
              "降水：" + params[0].value[dims.rainHeight] + "mm"
            ].join("<br>");
          }
        },
        grid: {
          left: 0,
          right: 60,
          top: 60,
          bottom: 30,
          containLabel:true
        },
        xAxis: {
          show: false,
          type: "time",
          //   type: "value",
          maxInterval: 3600 * 1000 * 24,
          //   minInterval: 1,
          splitLine: {
            lineStyle: {
              color: "blue"
            }
          }
        },
        yAxis: [
          {
            show : false,
            name: "温度℃",
            nameLocation: "end",
            max: this.chartsMaxTemp + 4,
            min: this.chartsMinTemp - 1,
            nameGap: 35,
            axisLine: {
              lineStyle: {
                color: "#666"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#ddd"
              }
            }
          },
          {
            show : false,
            name: "降水mm",
            nameLocation: "end",
            nameGap: 35,
            max: 30,
            axisLine: {
              lineStyle: {
                color: "#015DD5"
              }
            },
            splitLine: { show: false }
          },
          {
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
          }
        ],

        //底部提示按钮
        visualMap: {
          type: "piecewise",
          show: false,
          orient: "horizontal",
          left: "center",
          bottom: 70,
          pieces: [
            {
              gte: 17,
              color: "#18BF12",
              label: "大风1（>=17节）"
            },
            {
              gte: 11,
              lt: 17,
              color: "#f4e9a3",
              label: "中风（11  ~ 17 节）"
            },
            {
              lt: 11,
              color: "#D33C3E",
              label: "微风（小于 11 节）"
            }
          ],
          seriesIndex: 1,
          dimension: 1
        },
        //底部滑动块
        // dataZoom: [
        //   {
        //     type: "inside",
        //     xAxisIndex: 0,
        //     minSpan: 5
        //   },
        //   {
        //     type: "slider",
        //     xAxisIndex: 0,
        //     minSpan: 5,
        //     height: 20,
        //     bottom: 50,
        //     handleIcon:
        //       "M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        //     handleSize: "120%"
        //   }
        // ],

        //柱形
        series: [
          //柱形基本配置
          {
            type: "bar",
            smooth: true,
            yAxisIndex: 1,
            showSymbol: false,
            hoverAnimation: false,
            symbolSize: 10,
            barWidth: 20,
            label: {
              show: true,
              position: "top",
              formatter: function(item){
                return `${item.data[4]}mm`
              },
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(88,160,253,1)"
                  },
                  {
                    offset: 0.5,
                    color: "rgba(88,160,253,0.7)"
                  },
                  {
                    offset: 1,
                    color: "rgba(88,160,253,0)"
                  }
                ]
              }
            },
            //柱颜色
            lineStyle: {
              normal: {
                color: "#AED6FE"
              }
            },
            itemStyle: {
              normal: {
                color: "#0b28fb"
              }
            },
            encode: {
              x: dims.time,
              y: dims.rainHeight
            },
            data: data,
            // data: [2,4,5,3,6,1,5],
            z: 1
          },

          //箭头
          {
            type: "custom",
            smooth: true,
            renderItem: renderArrow,
            encode: {
              x: dims.time,
              y: dims.maxToday
            },
            // data: data,
            z: 1
          },

          //曲线1 高温
          {
            type: "line",
            symbol: "circle", //折线图中的节点
            smooth: true, //true 为平滑曲线，false为直线
            encode: {
              x: dims.time,
              y: dims.maxToday
            },
            markPoint: {
             symbolSize: 18,
              label:{ 
              show: true,  
                color: 'red',//气泡中字体颜色
                formatter: function(item){
                return `${item.data.value}℃`
              },
             },
             symbolSize:[50, 28],// 容器大小
             symbolOffset:[0,-12],//位置偏移
             symbol:'image://../../../../static/images/maxSym.png',
                itemStyle:{
                  color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0, color: 'red' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'blue' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }  
                },
                    // {type: 'max', name: '最大值',symbol:'image://../../../../static/images/maxSym.png'},
                data: this.filtrateMaxTemp > this.hisMaxTemp ? [{type: 'max', name: '最大值',}]:[]
                // data: [{type: 'max', name: '最大值',}]
            },
            label: {
              show: true,
              position: "top",
              formatter: function(item){
                return `${item.data[1]}℃`
              },
            },
            lineStyle: {
              normal: {
                color: "#FCC00B",
                type: "dotted",
                width: 2,
                type: "solid" //'dotted'虚线 'solid'实线
              }
            },
            data: data,
            // data: [22,24,25,24,26,21,26],
            z: 3,
            markLine: {
              symbol:['none', 'none'],
              symbolSize:'7',
              itemStyle: {
                normal: {
                  lineStyle: {
                    symbolSize: "7",
                    type: "dotted",
                    // 这儿设置的颜色是公共配置，如需单独配置，请在data里配置
                    // color: '#000',
                    width: 1
                  },
                  label: {
                    // padding:[13,-32,26,45],
                    show: true,
                    position: "end",
                  }
                }
              },
              data: [
                //历史最高，低
                {
                  // label: {
                  //     show: true, // 是否展示文字
                  //     color: "red",
                  //     fontSize: 10,
                  //     formatter: function () {
                  //     return "想展示的话"
                  //     }
                  // },
                  yAxis: this.hisMinTemp,
                  label:{
                    formatter:`历史最
低温${this.hisMinTemp}℃`,
                  },
                  lineStyle: {
                    color: "#409EFF"
                  }
                },
                {
                  yAxis: this.hisMaxTemp,
                  label:{
                    formatter:`历史最
高温${this.hisMaxTemp}℃`,
                  },
                  lineStyle: {
                    color: "red"
                  }
                }
              ]
            }
            
          },

          //曲线2 低温
          {
            type: "line",
            symbol: "circle", //折线图中的节点
            smooth: true, //true 为平滑曲线，false为直线
            encode: {
              x: dims.time,
              y: dims.minToday
            },
            label: {
              show: true,
              position: "top",
              formatter: function(item){
                return `${item.data[2]}℃`
              },
            },
            lineStyle: {
              normal: {
                color: "#999",
                type: "dotted",
                width: 2,
                type: "solid"
              }
            },
            data: data,
            z: 2,
          },

          //                       {
          //   yAxis: 6, //这儿定义基准线的数值为多少
          //   normal: {
          //       color: "red" // 这儿设置安全基线颜色
          //     },
          //   label: {
          //     normal: {
          //       formatter: "  历史最高温", // 这儿设置安全基线
          //       color: "red" // 这儿设置安全基线颜色
          //     }
          //   }
          // },
          // {
          //   yAxis: 4, //这儿定义基准线的数值为多少
          //   label: {
          //     normal: {
          //       formatter: "  历史最高温1", // 这儿设置安全基线
          //       color: "#333" // 这儿设置安全基线颜色
          //     }
          //   }
          // }

          //头部图文鼠标提示
          {
            type: "custom",
            renderItem: renderWeather,
            data: data,
            // tooltip: {
            //   trigger: "item",
            //   formatter: function(param) {
            //     return (
            //       param.value[dims.time] +
            //       ": " +
            //       param.value[dims.minTemp] +
            //       " - " +
            //       param.value[dims.maxTemp] +
            //       "°"
            //     );
            //   }
            // },
            // yAxisIndex: 2,
            z: 11
          }
        ]
      };
      myChart.setOption(option);
    },
  },
  mounted() {
    this.refreshData()
 },
};
</script>
<style lang="css" scoped>
</style>
