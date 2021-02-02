/**
 * 七天趋势图
 * @param data
 */
function sevenForecast_Echarts(res){
    var myChart = echarts.init(document.getElementById("sectionItemEcahrt"));
    var hisMaxTemp = res.hisMaxTemp;
    var hisMinTemp = res.hisMinTemp;
    var max = res.max;
    var min = res.min;
    var obj = res.data;
    var maxTemp = [];
    var minTemp = [];
    var rainData = [];
    var windData = [];
    var days = [];
    var weatherIcon = [];
    for(var i = 0 ; i<res.data.length;i++){
        var obj = res.data[i];
        days.push(obj.dayDate.substring(1,2)+"日");
        windData.push(obj.wind);
        maxTemp.push(obj.maxToday);
        minTemp.push(obj.minToday);
        rainData.push(obj.rainHeight);
        weatherIcon.push(obj.skyIcon);
    }
    /*for(var i = 0; i < maxTemp.length; i++){
        weatherIcon.push(max+10);
    }*/
    ///weatherIcon=[0,1,2,3,4,5,6];
    var yMax = Math.max(rainData) * 5;

    var option = {
        grid: {
            top: '15%',
            bottom: '15%',
            left: '10%',
            right: '10%'
        },
        xAxis: [{
            type: 'category',
            data: windData,/*['东北风5级', '东北风7级', '东北风7级', '东北风5级', '东北风6级', '东北风5级', '东北风4级'],*/
            axisLine:{
                show: false
            },
            axisTick:{
                show:false
            },
            axisLabel:{
                color: '#FFFFFF'
            }
        },{
            type: 'category',
            data: days,/*['4日', '5日', '6日', '7日', '8日', '9日', '10日'],*/
            axisLine:{
                show: false
            },
            axisTick:{
                show:false
            },
            axisLabel:{
                color: '#C4E2FB'
            }
        },{
            type: 'category',
            data: ['', '', '', '', '', '', ''],
            position: 'bottom',
            axisLine:{
                show: false
            },
            axisTick:{
                show:false
            }
        }],
        yAxis: [{
            type: 'value',
            min: max,
            max: min,
            axisLine:{
                show: false
            },
            axisTick:{
                show:false
            },
            splitLine:{
                show: false
            },
            axisLabel:{
                show: false
            }
        },{
            type: 'value',
            max:yMax,
            axisLine:{
                show: false
            },
            axisTick:{
                show:false
            },
            splitLine:{
                show: false
            },
            axisLabel:{
                show: false
            }
        }],
        series: [{
            color: '#FFB400',
            yAxisIndex: 0,
            data: maxTemp,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            label:{
                normal:{
                    show: true,
                    color: '#FFB400',
                    formatter: function(val){
                        return val.value + '℃'
                    }
                }
            },
            markLine:{
                symbol: 'none',
                lineStyle:{
                    type: 'dashed',
                    width: 1,
                    curveness: 1,
                    color: '#FF6400'
                },
                label:{
                    color: '#FE962F',
                    formatter: function(){
                        return '历史最高温\n'+hisMaxTemp+'℃'
                    }
                },
                data:[
                    {name: 'aaa',yAxis: hisMaxTemp}
                ],
            }
        },{
            color: '#00FFBA',
            yAxisIndex: 0,
            data: minTemp,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            label:{
                normal:{
                    show: true,
                    color: '#00FFBA',
                    formatter: function(val){
                        return val.value + '℃'
                    }
                }
            },
            markLine:{
                symbol: 'none',
                lineStyle:{
                    type: 'dashed',
                    width: 1,
                    curveness: 1,
                    color: '#00A0E9'
                },
                label:{
                    color: '#00A0E9',
                    formatter: function(){
                        return '历史最低温\n'+hisMinTemp+'℃'
                    }
                },
                data:[
                    {name: 'aaa',yAxis: hisMinTemp}
                ],
            }
        },{
            yAxisIndex: 0,
            data: weatherIcon,
            type: 'line',
            lineStyle:{
                width: 0
            },
            smooth: true,
            symbol: function (obj) {
               return 'image:../../../images/weather/'+obj+'.png'
            },
            symbolSize: [24,23],
        },{
            color: '#053E9A',
            yAxisIndex: 1,
            xAxisIndex: 2,
            data: rainData,
            type: 'bar',
            barWidth: '40%',
            label:{
                normal:{
                    show: true,
                    color: '#053E9A',
                    position: 'top',
                    fontSize: 14,
                    formatter: function(val){
                        return val.value + 'mm'
                    }
                }
            }
        }]
    };

    myChart.setOption(option, true);
}

function rainMonitorEcharts(rainData){
    var myChart = echarts.init(document.getElementById("rainEcharts"));
    var placeHolderStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            color: "rgba(102,135,215,0.5)",
            borderWidth: 0
        }
    };

    var option = {
        series: [
            //第1个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['15%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,//rainData.rainStationNum,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'
                        }
                    },

                }, {
                    value: 0,//rainData.countStationNum - rainData.rainStationNum,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['15%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value:rainData.countStationNum - rainData.rainStationNum,//rainData.rainStationNum,
                    itemStyle: placeHolderStyle,
                }, {
                    value: rainData.rainStationNum,
                    itemStyle: {
                        normal: {
                            color: '#24d071',
                            // #e6a23c    #ff4949
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+rainData.rainStationNum+'}\n站点数量\n'+rainData.countStationNum,
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#24d071',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                }
                ]
            },

            //第2个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['38%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['38%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#24d071'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+rainData.hourRain+'mm}\n日小时最大雨强\n'+rainData.hourStationName,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#24d071',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },

                ]
            },
            //第3个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['60%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['60%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#24d071'
                        }
                    },
                    label: {
                        normal: {
                            /*formatter: '日最大降雨量\n{styA|暂无数据}',*/
                            formatter: '{styA|'+rainData.dayCount+'mm}\n日最大降雨量\n'+rainData.dayStationName,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#24d071',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },

                ]
            },
            //第4个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['83%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['83%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#24d071'
                        }
                    },
                    label: {
                        normal: {
                            /*formatter: '突破历史同期\n{styA|暂无数据}',*/
                            formatter: '\n突破历史同期\n暂无数据',

                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#24d071',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },
                ]
            },
        ]
    };
    myChart.setOption(option, true);
}

function windVMonitorEcharts(windVData){
    var myChart = echarts.init(document.getElementById("windVEcharts"));
    var placeHolderStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            color: "rgba(102,135,215,0.5)",
            borderWidth: 0
        }
    };

    var option = {
        series: [
            //第1个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['15%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['15%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value:windVData.countStationNum11 - windVData.windStationNum11,
                    itemStyle: placeHolderStyle,
                }, {
                    value: windVData.windStationNum11,
                    itemStyle: {
                        normal: {
                            color: '#e6a23c',
                            // #e6a23c    #ff4949
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+windVData.windStationNum11+'}\n11级级大风\n'+windVData.countStationNum11,
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#e6a23c',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                }
                ]
            },

            //第2个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['38%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['38%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: windVData.countStationNum9 - windVData.windStationNum9,
                    itemStyle: placeHolderStyle,
                }, {
                    value: windVData.windStationNum9,
                    itemStyle: {
                        normal: {
                            color: '#e6a23c'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+windVData.windStationNum9+'}\n9极级大风\n'+windVData.countStationNum9,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#e6a23c',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },

                ]
            },
            //第3个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['60%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['60%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#e6a23c'
                        }
                    },
                    label: {
                        normal: {
                            /*formatter: '日最大降雨量\n{styA|暂无数据}',*/
                            formatter: '{styA|'+windVData.hourWindv+'/s}\n今日小时最大雨强\n'+windVData.hourStationName,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#e6a23c',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },

                ]
            },
            //第4个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['83%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['83%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#e6a23c'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+windVData.dayWindv+'/s}\n今日小时最大雨强\n'+windVData.dayStationName,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#e6a23c',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },
                ]
            },
        ]
    };
    myChart.setOption(option, true);
}

function visMonitorEcharts(visData){
    var myChart = echarts.init(document.getElementById("visEcharts"));
    var placeHolderStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            color: "rgba(102,135,215,0.5)",
            borderWidth: 0
        }
    };

    var option = {
        series: [
            //第1个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['15%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['15%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value:visData.countStationNum2 - visData.visibStationNum2,
                    itemStyle: placeHolderStyle,
                }, {
                    value: visData.windStationNum2,
                    itemStyle: {
                        normal: {
                            color: '#ff4949',
                            // #e6a23c    #ff4949
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+visData.visibStationNum2+'}\n200m站点数量\n'+visData.countStationNum2,
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#ff4949',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                }
                ]
            },

            //第2个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['38%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['38%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: visData.countStationNum5 - visData.visibStationNum5,
                    itemStyle: placeHolderStyle,
                }, {
                    value: visData.windStationNum9,
                    itemStyle: {
                        normal: {
                            color: '#ff4949'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+visData.visibStationNum5+'}\n500m站点数量\n'+visData.countStationNum5,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#ff4949',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },

                ]
            },
            //第3个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['60%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['60%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#ff4949'
                        }
                    },
                    label: {
                        normal: {
                            /*formatter: '日最大降雨量\n{styA|暂无数据}',*/
                            formatter: '{styA|'+visData.dayVisib+'/s}\n日最低能见度\n'+visData.dayStationName,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#ff4949',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },

                ]
            },
            //第4个图表
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['83%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#E1E8EE'


                        }
                    },

                }, {
                    value: 0,
                    itemStyle: placeHolderStyle,
                },

                ]
            },
            //上层环形配置
            {
                type: 'pie',
                hoverAnimation: false,
                radius: ['40%', '50%'],
                center: ['83%', '50%'],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    itemStyle: placeHolderStyle,
                }, {
                    value: 100,
                    itemStyle: {
                        normal: {
                            color: '#ff4949'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{styA|'+visData.hourVisib+'/s}\n近6h最低能见度\n'+visData.hourStationName,/*'今日小时最大雨强\n{styA|暂无数据}',*/
                            position: 'center',
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                rich:{
                                    styA: {
                                        color: '#ff4949',
                                        fontSize: '20'
                                    }
                                }
                            },
                        }
                    }
                },
                ]
            },
        ]
    };
    myChart.setOption(option, true);
}
/*$(function(){

    setEchart('sectionItemEcahrt',option1Fn())

    function setEchart(dom, option) {
        var myChart = echarts.init(document.getElementById(dom));
        myChart.setOption(option, true);
    }

    function option1Fn(){
        var maxTemp = [15, 16, 15, 13, 14, 15, 12], maxTempNum = Math.max(maxTemp),
        minTemp = [-1, -2, 2, -2, 0, 2, 3], minTempNum = Math.min(minTemp),
        storyMax = 20.8, storyMin = -5.3,
            weatherIcon = [], runData = [0.1, 0.2, 0.2, 0.2, 0, 0.2, 0.3];
        if(maxTempNum > storyMax){
            storyMax = maxTempNum
        }
        if(minTempNum < storyMin){
            storyMin = minTempNum
        }
        for(var i = 0; i < maxTemp.length; i++){
            weatherIcon.push(storyMax+10)
        }
        var yMax = Math.max(runData) * 5;
        var option = {
            grid: {
                top: '15%',
                bottom: '15%',
                left: '10%',
                right: '10%'
            },
            xAxis: [{
                type: 'category',
                data: ['东北风5级', '东北风7级', '东北风7级', '东北风5级', '东北风6级', '东北风5级', '东北风4级'],
                axisLine:{
                    show: false
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color: '#FFFFFF'
                }
            },{
                type: 'category',
                data: ['4日', '5日', '6日', '7日', '8日', '9日', '10日'],
                axisLine:{
                    show: false
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color: '#C4E2FB'
                }
            },{
                type: 'category',
                data: ['', '', '', '', '', '', ''],
                position: 'bottom',
                axisLine:{
                    show: false
                },
                axisTick:{
                    show:false
                }
            }],
            yAxis: [{
                type: 'value',
                min: storyMin - 5,
                max: storyMax + 10,
                axisLine:{
                    show: false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show: false
                },
                axisLabel:{
                    show: false
                }
            },{
                type: 'value',
                max:yMax,
                axisLine:{
                    show: false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show: false
                },
                axisLabel:{
                    show: false
                }
            }],
            series: [{
                color: '#FFB400',
                yAxisIndex: 0,
                data: maxTemp,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                label:{
                    normal:{
                        show: true,
                        color: '#FFB400',
                        formatter: function(val){
                            return val.value + '℃'
                        }
                    }
                },
                markLine:{
                    symbol: 'none',
                    lineStyle:{
                        type: 'dashed',
                        width: 1,
                        curveness: 1,
                        color: '#FF6400'
                    },
                    label:{
                        color: '#FE962F',
                        formatter: function(){
                            return '历史最高温\n20.8℃'
                        }
                    },
                    data:[
                        {name: 'aaa',yAxis: 20.8}
                    ],
                }
            },{
                color: '#00FFBA',
                yAxisIndex: 0,
                data: minTemp,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                label:{
                    normal:{
                        show: true,
                        color: '#00FFBA',
                        formatter: function(val){
                            return val.value + '℃'
                        }
                    }
                },
                markLine:{
                    symbol: 'none',
                    lineStyle:{
                        type: 'dashed',
                        width: 1,
                        curveness: 1,
                        color: '#00A0E9'
                    },
                    label:{
                        color: '#00A0E9',
                        formatter: function(){
                            return '历史最低温\n-5.3℃'
                        }
                    },
                    data:[
                        {name: 'aaa',yAxis: -5.3}
                    ],
                }
            },{
                yAxisIndex: 0,
                data: weatherIcon,
                type: 'line',
                lineStyle:{
                    width: 0
                },
                smooth: true,
                symbol: 'image://image/weatherIcon.png',
                symbolSize: [24,23],
            },{
                color: '#053E9A',
                yAxisIndex: 1,
                xAxisIndex: 2,
                data: runData,
                type: 'bar',
                barWidth: '40%',
                label:{
                    normal:{
                        show: true,
                        color: '#053E9A',
                        position: 'top',
                        fontSize: 14,
                        formatter: function(val){
                            return val.value + 'mm'
                        }
                    }
                }
            }]
        };
        return option;
    }


})*/
