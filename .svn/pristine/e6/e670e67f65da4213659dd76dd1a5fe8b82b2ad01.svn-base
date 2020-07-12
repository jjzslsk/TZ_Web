<template>
  <div id="chart_example"></div>
</template>

<script>
import { requestWarningObj } from "@/remote/";
import echarts from "echarts";
export default {
  props: ["data"],
  data() {
    return {};
  },
  mounted() {
    requestWarningObj().then(res => {
      var rawData = res.data;
      let myChart = echarts.init(document.getElementById("chart_example"));
      var weatherIcons = {
        Showers: "../../../../static/images/weather/showers_128.png",
        Sunny: "../../../../static/images/weather/sunny_128.png",
        Cloudy: "../../../../static/images/weather/cloudy_128.png"
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

      var data = echarts.util.map(rawData.data, function(entry) {
        return [entry.time, entry.temperature, entry.R, entry.rainHeight];
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

      var dims = {
        rn: 1,
        day: 1,
        time: 0,
        temperature: 1,
        R: 2,
        rainHeight: 3,
        weatherIcon: 2,
        minTemp: 3,
        maxTemp: 4
      };
      var arrowSize = 0;
      var weatherIconSize = 30;

      //箭头控制
      function renderArrow(param, api) {
        var point = api.coord([
          api.value(dims.time),
          api.value(dims.temperature)
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
          rotation: directionMap[api.value(dims.R)],
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
                x: -110 / 2,
                y: -70 / 2,
                // x: -weatherIconSize / 2,
                // y: -weatherIconSize / 2,
                width: weatherIconSize,
                height: weatherIconSize
              },
              position: [point[0], 360]
            },
            {
              type: "text",
              style: {
                x: -80 / 2,
                y: -80 / 2,
                text: `${api.value(dims.rn)}(周${api.value(dims.day)})`,
                //   "东北风",

                //   api.value(dims.minTemp) +
                //   " - " +
                //   api.value(dims.maxTemp) +
                //   "°",
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
              "最高温度：" + params[0].value[dims.temperature],
              "风向：" + params[0].value[dims.R],
              "降水：" + params[0].value[dims.rainHeight]
            ].join("<br>");
          }
        },
        grid: {
          top: 150,
          bottom: 200
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
            // name: "风速1（节）",
            nameLocation: "middle",
            max: 20,
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
            // name: "浪高（米）",
            nameLocation: "middle",
            nameGap: 35,
            max: 6,
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
            label: {
              show: true,
              position: "top"
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
                color: "rgba(88,160,253,1)"
              }
            },
            itemStyle: {
              normal: {
                color: "#409eff"
              }
            },
            encode: {
              x: dims.time,
              y: dims.rainHeight
            },
            data: data,
            // data: [2,4,5,3,6,1,5],
            z: 2
          },

          //箭头
          {
            type: "custom",
            smooth: true,
            renderItem: renderArrow,
            encode: {
              x: dims.time,
              y: dims.temperature
            },
            // data: data,
            z: 10
          },

          //曲线
          {
            type: "line",
            symbol: "circle", //折线图中的节点
            smooth: true, //true 为平滑曲线，false为直线
            encode: {
              x: dims.time,
              y: dims.temperature
            },
            lineStyle: {
              normal: {
                color: "#FCC00B",
                type: "dotted",
                width: 3,
                type: "solid" //'dotted'虚线 'solid'实线
              }
            },
            data: data,
            // data: [2,4,5,4,6,1,6],
            z: 3,
            markLine: {
            itemStyle: {
                normal: { 
                    lineStyle: {
                        symbolSize:'10',
                        type: 'dotted',
                        // 这儿设置的颜色是公共配置，如需单独配置，请在data里配置
                        // color: '#000',
                        width:2,
                    }, 
                    label: { 
                        show: false,
                        position: 'end'
                    }
                },
            },
            data: [
                {
                    // label: {
                    //     show: true, // 是否展示文字
                    //     color: "red",
                    //     fontSize: 10,
                    //     formatter: function () {
                    //     return "想展示的话"
                    //     }
                    // },
                    yAxis: 2,
                    lineStyle: {
                        color: 'green'
                    }
                },
                {
                    yAxis: 18,
                    lineStyle: {
                        color: 'red'
                    }
                }
            ]
        },
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
            data: weatherData,
            tooltip: {
              trigger: "item",
              formatter: function(param) {
                return (
                  param.value[dims.time] +
                  ": " +
                  param.value[dims.minTemp] +
                  " - " +
                  param.value[dims.maxTemp] +
                  "°"
                );
              }
            },
            yAxisIndex: 2,
            z: 11
          }
        ]
      };
      myChart.setOption(option);
    });
  },
  methods: {
    rawDataEvl(optionData) {
      let myChart = echarts.init(document.getElementById("chart_example"));
    }
  }
};
</script>

<style lang="css" scoped>
</style>
