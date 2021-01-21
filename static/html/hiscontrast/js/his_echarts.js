function set_echarts(objMap){
    var myChart = echarts.init(document.getElementById('hisEcharts'));
    var colors = ['#5793f3', '#d14a61', '#675bba','#FFFF00','#9900FF'];
    var dateTime = []; //x轴
    var maxTemp=[];
    var minTemp=[];
    var avgTemp=[];
    var rain=[];
    var sunny=[];
    var his_maxTemp=[];
    var his_minTemp=[];
    var his_avgTemp=[];
    var his_rain=[];
    var his_sunny=[];
    for(var key in objMap){
        var map = objMap[key];
        dateTime.push(map["timeName"]);
        maxTemp.push(map["temp_max"]);
        minTemp.push(map["temp_min"]);
        avgTemp.push(map["temp_average"]);
        rain.push(map["rain_amount"]);
        sunny.push(map["sunshine_amount"]);
        his_maxTemp.push(map["his_temp_max"]);
        his_minTemp.push(map["his_temp_min"]);
        his_avgTemp.push(map["his_temp_average"]);
        his_rain.push(map["his_rain_amount"]);
        his_sunny.push(map["his_sunshine_amount"]);
    }

option = {
    color: colors,

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    grid: {
        right: '20%'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data: ['最高温', '历史最高温', '最低温', '历史最低温','平均温','历史平均温','降水', '历史降水','日照','历史日照', ]
    },

    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 30
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 30
        }
    ],

    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            //data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            data:dateTime
        }
    ],
    /*yAxis: [
        {
            type: 'value',
            name: '最高温',
            min: -20,
            max: 40,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[0]
                }
            },
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        {
            type: 'value',
            name: '最低温',
            min: -20,
            max: 40,
            position: 'right',
            offset: 60,
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        {
            type: 'value',
            name: '平均温',
            min: -20,
            max: 40,
            position: 'right',
            offset: 120,
            axisLine: {
                lineStyle: {
                    color: colors[2]
                }
            },
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        {
            type: 'value',
            name: '日照',
            min: 0,
            max: 24,
            position: 'right',
            offset: 180,
            axisLine: {
                lineStyle: {
                    color: colors[3]
                }
            },
            axisLabel: {
                formatter: '{value} h'
            }
        },
        {
            type: 'value',
            name: '降水',
            min: 0,
            max: 100,
            position: 'left',
            axisLine: {
                lineStyle: {
                    color: colors[4]
                }
            },
            axisLabel: {
                formatter: '{value} ml'
            }
        }
    ],*/
    yAxis: [
        {
            type: 'value',
            name: '高温',
            min: -20,
            max: 40,
            position: 'left',
            axisLine: {
                lineStyle: {
                    color: colors[0]
                }
            },
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        {
            type: 'value',
            name: '降水',
            min: 0,
            max: 200,
            position: 'right',
            offset:80,
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} ml'
            }
        },
        {
            type: 'value',
            name: '日照',
            min: 0,
            max: 100,
            position: 'right',
            //offset: ,
            axisLine: {
                lineStyle: {
                    color: colors[2]
                }
            },
            axisLabel: {
                formatter: '{value} h'
            }
        }
    ],
    series: [
        {
            name: '最高温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FF0000'
                    }
            },
            yAxisIndex: 0,
            //data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            data:maxTemp

        },
        {
            name: '历史最高温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FF9900'
                }
            },
            yAxisIndex: 0,
            //data: [10.2, 10.2, 15.2, 30.5, 45.9, 96.9, 95.9, 62.9, 12.9, 40.9, 46.9, 43.9]
            data:his_maxTemp
        },
        {
            name: '最低温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#3300FF'
                }
            },
            yAxisIndex: 0,
            //data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            data:minTemp
        },
        {
            name: '历史最低温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#33CCFF'
                }
            },
            yAxisIndex: 0,
            //data: [2.5, 5.8, 8.9, 26.2, 28.2, 70.2, 175.2, 182.2, 48.2, 18.2, 6.2, 2.2]
            data:his_minTemp
        },
        {
            name: '平均温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FFFF66'
                }
            },
            yAxisIndex: 0,
            //data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            data:avgTemp
        },
        {
            name: '历史平均温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FF9999'
                }
            },
            yAxisIndex: 0,
            //data: [2.5, 5.8, 8.9, 26.2, 28.2, 70.2, 175.2, 182.2, 48.2, 18.2, 6.2, 2.2]
            data:his_avgTemp
        },
        {
            name: '降水',
            type: 'bar',
            itemStyle: {
                normal: {
                    color:'#00CC66'
                }
            },
            yAxisIndex: 1,
            //data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            data:rain
        },
        {
            name: '历史降水',
            type: 'bar',
            itemStyle: {
                normal: {
                    color:'#000099'
                }
            },
            yAxisIndex: 1,
            //data: [1.0, 1.2, 2.3, 3.5, 5.3, 8.2, 19.3, 18.4, 12.0, 12.5, 11.0, 3.2]
            data:his_rain
        },
        {
            name: '日照',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FFFF00'
                }
            },
            yAxisIndex: 2,
            //data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            data:sunny
        },
        {
            name: '历史日照',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FF9966'
                }
            },
            yAxisIndex: 2,
            //data: [2.5, 5.8, 8.9, 26.2, 28.2, 70.2, 175.2, 182.2, 48.2, 18.2, 6.2, 2.2]
            data:his_sunny
        }
    ]
};
    myChart.setOption(option);
}
