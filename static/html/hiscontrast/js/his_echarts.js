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
    var last_maxTemp=[];
    var last_minTemp=[];
    var last_avgTemp=[];
    var last_rain=[];
    var last_sunny=[];
    for(var key in objMap){
        var map = objMap[key];
        dateTime.push(map["timeName"]);
        maxTemp.push(map["temp_max"]);
        minTemp.push(map["temp_min"]);
        var temp_avg = map["temp_average"];
        if(temp_avg != null && temp_avg.toString().length>0 && temp_avg !="null"){
            temp_avg = temp_avg.toFixed(2);
        }
        avgTemp.push(temp_avg);
        var rain_sum = map["rain_amount"];
        if(rain_sum != null && rain_sum.toString().length>0 && rain_sum !="null"){
            rain_sum = rain_sum.toFixed(1);
        }
        rain.push(rain_sum);
        sunny.push(map["sunshine_amount"]);

        his_maxTemp.push(map["his_temp_max"]);
        his_minTemp.push(map["his_temp_min"]);
        temp_avg = map["his_temp_average"];
        if(temp_avg != null && temp_avg != "" && temp_avg !="null"){
            temp_avg = temp_avg.toFixed(2);
        }
        his_avgTemp.push(temp_avg);
        var his_rain_sum = map["his_rain_amount"];
        if(his_rain_sum != null && his_rain_sum.toString().length>0 && his_rain_sum !="null"){
            his_rain_sum = his_rain_sum.toFixed(1);
        }
        his_rain.push(his_rain_sum);
        his_sunny.push(map["his_sunshine_amount"]);

        last_maxTemp.push(map["last_temp_max"]);
        last_minTemp.push(map["last_temp_min"]);
        temp_avg = map["last_temp_average"];
        if(temp_avg != null && temp_avg != "" && temp_avg !="null"){
            temp_avg = temp_avg.toFixed(2);
        }
        last_avgTemp.push(temp_avg);
        var last_rain_sum = map["last_rain_amount"];
        if(last_rain_sum != null && last_rain_sum.toString().length>0 && last_rain_sum !="null"){
            last_rain_sum = last_rain_sum.toFixed(1);
        }
        last_rain.push(last_rain_sum);
        last_sunny.push(map["last_sunshine_amount"]);

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
        data: ['最高温','去年最高温', '历史最高温',
               '最低温','去年最低温', '历史最低温',
               '平均温','去年平均温', '历史平均温',
               '累计降水','去年累计降水', '历史累计降水',
               '累计日照','去年累计日照','历史累计日照' ]
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
            data:maxTemp

        },
        {
            name: '去年最高温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#000099'
                }
            },
            yAxisIndex: 0,
            data:last_maxTemp

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
            data:minTemp
        },
        {
            name: '去年最低温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#000099'
                }
            },
            yAxisIndex: 0,
            data:last_minTemp
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
            data:avgTemp
        },
        {
            name: '去年平均温',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FFFF00'
                }
            },
            yAxisIndex: 0,
            data:last_avgTemp
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
            name: '累计降水',
            type: 'bar',
            itemStyle: {
                normal: {
                    color:'#00CC66'
                }
            },
            yAxisIndex: 1,
            data:rain
        },
        {
            name: '去年累计降水',
            type: 'bar',
            itemStyle: {
                normal: {
                    color:'#FF9966'
                }
            },
            yAxisIndex: 1,
            data:last_rain
        },
        {
            name: '历史累计降水',
            type: 'bar',
            itemStyle: {
                normal: {
                    color:'#000099'
                }
            },
            yAxisIndex: 1,
            data:his_rain
        },
        {
            name: '累计日照',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FFFF00'
                }
            },
            yAxisIndex: 2,
            data:sunny
        },
        {
            name: '去年累计日照',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FFFF66'
                }
            },
            yAxisIndex: 2,
            data:last_sunny
        },
        {
            name: '历史累计日照',
            type: 'line',
            itemStyle: {
                normal: {
                    color:'#FF9966'
                }
            },
            yAxisIndex: 2,
            data:his_sunny
        }
    ]
};
    myChart.setOption(option);
}
