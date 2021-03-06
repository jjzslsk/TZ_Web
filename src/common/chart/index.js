import echarts from 'echarts'
export const initChart = ({
    target,
    data: {
        title,
        times,
        precipitationArr,
        temperatureArr,
        rehumArr,
        visibilityArr
    } = {}
}) => {
    console.log('option:',option)
    let myChart = echarts.init(target);
    // 指定图表的配置项和数据
    let option = {
        title: {
            text: title,
            left: '50%',
            textAlign: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        grid: {
            width: 800,
            height: 220,
            top: 100,
            left: 60
        },
        toolbox: {
            feature: {
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: {
                    show: true,
                    type: ['line', 'bar']
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        legend: {
            // left: 200,
            top: 60,
            data: [{
                name: '降水(mm)',
                textStyle: {
                    color: '#428BCA'
                }
            }, {
                name: '温度(℃)',
                textStyle: {
                    color: '#FD6002'
                }
            }, {
                name: '湿度(%)',
                textStyle: {
                    color: '#05BA7E'
                }
            }, {
                name: '能见度(m)',
                textStyle: {
                    color: '#661aa0'
                }
            }]
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
                rotate: -45
            },
            data: times,
            axisPointer: {
                type: 'shadow'
            }
        }],
        yAxis: [{
            type: 'value',
            name: '降水(mm)',
            // min: 0, max: 250, interval: 50,
            axisLine: {
                lineStyle: {
                    color: "#0F77E9"
                }
            },
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        }, {
            type: 'value',
            name: '温度(℃)',
            // min: 0, max: 45, interval: 5,
            axisLine: {
                lineStyle: {
                    color: "#FD6002"
                }
            },
            axisLabel: {
                color: '#FD6002',
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        }, {
            type: 'value',
            name: '湿度(%)',
            // min: 0, max: 100, interval: 5,
            axisLine: {
                lineStyle: {
                    color: "#05BA7E"
                }
            },
            axisLabel: {
                color: '#05BA7E',
                formatter: '{value}'
            },
            splitLine: {
                show: false
            },
            offset: 50
        }, {
            type: 'value',
            name: '能见度(m)',
            // min: 0, max: 25, interval: 5,
            axisLine: {
                lineStyle: {
                    color: "#661aa0"
                }
            },
            axisLabel: {
                color: "#661aa0",
                formatter: '{value}'
            },
            splitLine: {
                show: false
            },
            offset: 110
        }],
        series: [{
            color: '#0F77E9',
            name: '降水(mm)',
            type: 'bar',
            yAxisIndex: 0,
            data: precipitationArr
        }, {
            color: '#FD6002',
            name: '温度(℃)',
            type: 'line',
            yAxisIndex: 1,
            data: temperatureArr
        }, {
            color: '#05BA7E',
            name: '湿度(%)',
            type: 'line',
            yAxisIndex: 2,
            data: rehumArr
        }, {
            color: "#661aa0",
            name: '能见度(m)',
            type: 'line',
            yAxisIndex: 3,
            data: visibilityArr
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

export const initChartWithOption = ({
    target,
    option
}) => {
    console.log('option:',option)
    let myChart = echarts.init(target);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
