//区域监测
$.ajax({
    type: 'GET',
    url: main_url + '/ssd-reminder-warn/getRegionalAlert',
    data: {
        "nowTime": ''
    },
    dataType: 'json',
    success: function (data) {
        var m = data.data;
        var timeLineConHtml = '';
        var num = 0;
        for (var key in m) {
            var time = key.substring(8,10)+":"+key.substring(10,12);
            timeLineConHtml+="<li style=\"width: 48.1588px;\">"+time+"</li>";
            var valueList = m[key];
            if(valueList.length>0){
                for (let i = 0; i < valueList.length; i++) {
                    var statNum = valueList[i].stationNum;
                    var lev = getLev(valueList[i].color);
                    $("#qy" + statNum).find("span").eq(num).attr("class",lev);
                }
            }
            num++;
        }
        //$(".timeLineCon").empty().html(timeLineConHtml);
    },
    error: function () {
    }
});
var labelData=[]
var convertData = []
function getTimes(){
    var myDate = new Date();
    var hour = myDate.getHours()+":00";
    var times = [];
    times.push(myDate.getHours())
    $(".timeLineCon").append('<li>'+hour+'</li>');
    var areaCodeArr = ["331000","331002","331003","331004","331022","331023","331024","331081","331082","331083"];
    for (var i = 1 ; i<=12;i++){
        $(".timeLineCon").append('<li>'+new Date(myDate.getTime()+i * 60 * 60 * 1000).getHours()+":00"+'</li>');
        times.push(new Date(myDate.getTime()+i * 60 * 60 * 1000).getHours())
    }
    $.ajax({
        type: 'GET',
        url: main_url + '/ssd-early-alarm/getAlarmList',
        async:false,
        data: {
            "areaCode": '331000,331002,331003,331004,331022,331023,331024,331081,331082,331083'
        },
        dataType: 'json',
        success: function (data) {
            if(data!=null && data.code=='0'){
                let dad = data.data;
                for (let l = 0; l < times.length; l++) {
                    Object.keys(dad).forEach(function(key){
                        var value = dad[key];
                        for (let k = 0; k < value.length; k++) {
                            var alarmTime = value[k].dateTime;
                            var hours = alarmTime.split(" ")[1].substring(0, alarmTime.split(" ")[1].length - 3);
                            var h = times[l];
                            var areaCode = value[k].areaCode;
                            var hourStr = hours.substring(0, 2);
                            if ((hourStr.substring(0,1)==0?hourStr.substring(1,2):hourStr) == h) {
                                $("#qy" + areaCode).find("span").eq(l).addClass('Level4');
                                var longitude = value[k].longitude;
                                var latitude = value[k].latitude;
                                var areaName = value[k].areaName;
                                var mark = value[k].mark;
                                labelData.push({'name': areaName,'mark':mark,"areaCode":areaCode,"alarmTime":alarmTime});
                                var valueArr = new Array();
                                valueArr.push(longitude);
                                valueArr.push(latitude);
                                valueArr.push(150);
                                convertData.push({'name': areaName,"value":valueArr});
                            }
                        }
                    })
                }
            }
        }
    })
}
getTimes();
function getLev(type){
    if("Red"==type){
        return "Level4";
    }else if("Orange"==type){
        return "Level3";
    }else if("Yellow"==type){
        return "Level2";
    }else if("Blue"==type){
        return "Level1";
    }else{
        return "Level0";
    }
}

//echart图
function getForecast(stationNum){
    if(stationNum==''){
        stationNum = "58665";
    }
    $.ajax({
        type: 'GET',
        url: main_url + '/ssd-forecast-model/getIgNowForecastData',
        data: {
            'stationNum':stationNum
        },
        dataType: 'json',
        success: function (data) {
            //处理时间
            if(data.success){
                // var timeList = [];
                // for (let i = 0; i < data.time.length; i++) {
                //     var t = data.time[i];
                //     timeList.push(t.substring(4,6)+"-"+t.substring(6,8)+" " +t.substring(8,10));
                // }
                var t0 = data.forecastTime;
                $(".showTime").html(t0.substring(0,4)+"-"+t0.substring(4,6)+"-"+t0.substring(6,8)+" " +t0.substring(8,10));
                //处理天气现象
                var weatherList = [];
                var maxTemp = data.maxTempValue;
                for (let i = 0; i < data.weather.length; i++) {
                    var w = data.weather[i];
                    w = maxTemp+(w/1000);
                    weatherList.push(w);
                }
                //得到风速和风向  winddata
                var data_Wind = data.maxWindv;
                var data_WindFX = data.maxWindd;
                var winddata = echarts.util.map(data_Wind, function (item, index) {
                    return {
                        value: data_Wind[index],
                        symbolRotate:360-data_WindFX[index]
                    };
                });
                option = {
                    title: {
                        text: '',
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    color: ['#FF0052', '#F99717', '#1CA7FF', '#58F0E3', '#D23CFD'],
                    // tooltip: {
                    //     show: true,
                    //     trigger: 'axis',
                    //     axisPointer: {
                    //         type: 'cross',
                    //         crossStyle: {
                    //             color: '#999'
                    //         },
                    //         label: {
                    //             show: true,
                    //             color: "#fff",
                    //             backgroundColor: "black"
                    //         }
                    //     }
                    // },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter: function(params){
                            let tip = '<p>'+data.time[params[0].dataIndex]+'</p>';
                            for(let i=0;i<params.length;i++) {
                                if(params[i].seriesName == '天气现象'){
                                    var weatherValue = params[i].data;
                                    var wea = weatherValue*1000-maxTemp*1000;
                                    tip+='<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background: '+params[i].color+';"></div>'+ params[i].seriesName+'：'+getWeather(wea+'') +'<br>';
                                }else if(params[i].seriesName == '极大风'){
                                    tip+='<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background: '+params[i].color+';"></div>'+ params[i].seriesName+'：'+params[i].data.value +'<br>';
                                    tip+='<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background: '+params[i].color+';"></div>极大风风向：'+getWindd(data_WindFX[params[0].dataIndex]) +'<br>';
                                }else{
                                    tip+='<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background: '+params[i].color+';"></div>'+ params[i].seriesName+'：'+params[i].data +'<br>';
                                }
                            }
                            return tip;
                        }
                    },
                    legend: {
                        data: ['平均气温', '雨量', '极大风','天气现象'],
                        left: '8%',
                        textStyle: {
                            color: '#fff',
                        },
                        selectedMode: false,
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        top: '20%',
                        bottom: '20%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        xAxisIndex: 0,
                        data: ['', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', ''],
                        axisLine: {
                            lineStyle: {
                                color: '#94b3b3',
                                width: 3
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        textStyle: {
                            color: '#fff',
                        }
                        ,axisLabel: {
                            interval: 0
                        }
                    }
                        ,{
                            type: 'category',
                            position: 'bottom',
                            xAxisIndex: 1,
                            offset: 30,
                            boundaryGap: true,
                            data: data.time,
                            // axisLabel: {
                            //     interval: 5,
                            //     inside: true,
                            // },
                            axisLabel: {
                                interval: 0
                            },
                            axisLine: {
                                onZero: false,
                                lineStyle: {
                                    color: '#A9C4EF',
                                    width: 2
                                }
                            },
                            axisTick: {
                                inside: true,
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [{
                        type: 'value',
                        name: '℃',
                        min:data.minTempValue,
                        max:data.maxTempValue,
                        nameTextStyle: {
                            color: '#ffffff'
                        },
                        position: 'left',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#fff',
                            },
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#223B66'
                            }
                        }
                    },
                        {
                            type: 'value',
                            name: 'm/s',
                            nameTextStyle: {
                                color: '#ffffff'
                            },
                            position: 'right',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#fff',
                                },
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '平均气温',
                            type: 'line',
                            yAxisIndex: 0,
                            data: data.temp,
                            smooth: true
                        },
                        {
                            name: '极大风',
                            type: 'line',
                            yAxisIndex: 1,
                            data: winddata,
                            symbol: "image://image/windPoint.png",
                            symbolSize: '20',
                            smooth: true
                        },
                        {
                            name: '天气现象',
                            type: 'line',
                            yAxisIndex: 0,
                            data: weatherList,
                            symbol: function(data) {
                                var wea = data*1000-maxTemp*1000;
                                return 'image://image/'+wea+'.png';
                            },
                            lineStyle: {
                                width: 0
                            },
                            symbolSize: '20'
                        },
                        {
                            name: '雨量',
                            type: 'bar',
                            xAxisIndex: 1,
                            barWidth: 6,
                            data: data.rain,
                            smooth: true
                        }
                    ]
                };
                mycharts = echarts.init(document.getElementById('placeEchart'));
                mycharts.setOption(option);
            }
        },
        error: function () {
            layer.msg("查询异常");
        }
    });
}
getForecast("");

//页面加载完成后  需要计算宽度
var liW;
(function() {
    var boxW = 0;
    liW = ($('.timeLine').outerWidth(true) / 12)
    $('.timeLineCon>li').css('width', liW)
    for (var i = 0; i < $('.timeLineCon>li').length; i++) {
        boxW += $('.timeLineCon>li').eq(i).outerWidth(true);
    }
    $('.timeLineCon').css('width', boxW);
})()

//区域预警监测   点击效果
var animateL = 0,
    manyPrev = true,
    manyNext = true
$('.warningMonitorConNext>img').on('click', function() {
    if (manyPrev) {
        manyPrev = false;
        animateL++;
        $('.timeLineCon').animate({
            'left': -animateL * liW
        });
        $('.warningMonitorTypeCon').animate({
            'left': -animateL * liW
        });
        if (animateL * liW > $('.timeLineCon').outerWidth(true) - $('.timeLine').outerWidth(true)) {
            animateL--;
            $('.timeLineCon').animate({
                'left': -($('.timeLineCon').outerWidth(true) - $('.timeLine').outerWidth(true))
            });
            $('.warningMonitorTypeCon').animate({
                'left': -($('.timeLineCon').outerWidth(true) - $('.timeLine').outerWidth(true))
            });
        }
        setTimeout(function() {
            manyPrev = true;
        }, 600)
    }
})
$('.warningMonitorConPrev>img').on('click', function() {
    if (manyNext) {
        manyNext = false;
        animateL--;
        $('.timeLineCon').animate({
            'left': -animateL * liW
        });
        $('.warningMonitorTypeCon').animate({
            'left': -animateL * liW
        });
        if (-animateL * liW > 0) {
            animateL++;
            $('.timeLineCon').animate({
                'left': 0
            });
            $('.warningMonitorTypeCon').animate({
                'left': 0
            });
        }
        setTimeout(function() {
            manyNext = true;
        }, 600)
    }
})
//区域预警监测   点击效果结束

//头部菜单点击
$('.menuBox').on('click', 'li', function() {
    $(this).addClass('liChecked').siblings().removeClass('liChecked')
})

function addImage(url, params, api, realData){
    return  {
        type: 'image',
        style: {
            image: url,
            x: api.coord([
                realData[params.dataIndex].lng, realData[params.dataIndex].lat
            ])[0],
            y: api.coord([
                realData[params.dataIndex].lng, realData[params.dataIndex].lat
            ])[1],
            width: 20,
            height: 19,
        }
    }
}
var mycharts ;
function mapEchart() {
    var chinaMap
    $.ajax({
        url: 'data/taizhou.json',
        type: 'get',
        async: false,
        success: function(res) {
            chinaMap = res
        }
    })
    mycharts = echarts.init(document.getElementById('map'));
    var mapIcons = {
        'sign': 'image/mapBtmBg1.png',
        'bg': 'image/mapLayerRed.png'
    };
    var mapIcons2 = {
        'sign': 'image/mapBtmBg2.png',
        'bg': 'image/mapLayerOrange.png'
    };
    var data = [{
        'name': "椒江区",
        'code':'331002',
        'value': [121.531049, 28.47615],
    }, {
        'name': "黄岩区",
        'code':'331003',
        'value': [121.062138, 28.34488],
    }, {
        'name': "路桥区",
        'code':'331004',
        'value': [121.57292, 28.301799],
    }, {
        'name': "三门县",
        'code':'331022',
        'value': [121.56429, 28.918955],
    }, {
        'name': "天台县",
        'code':'331023',
        'value': [121.031227, 29.101126],
    }, {
        'name': "仙居县",
        'code':'331024',
        'value': [120.535074, 28.549213],
    }, {
        'name': "温岭市",
        'code':'331081',
        'value': [121.543611, 28.068781],
    }, {
        'name': "临海市",
        'code':'331082',
        'value': [121.031229, 28.645441],
    }, {
        'name': "玉环市",
        'code':'331083',
        'value': [121.332337, 27.82842],
    }]
    var dataIcon = [{
        lng: '121.531045',
        lat: '28.47610',
        num: '20',
    },{
        lng: '121.001239',
        lat: '28.625441',
        num: '130',
    },{
        lng: '121.212334',
        lat: '27.82802',
        num: '240',
    }]

    echarts.registerMap('chinaMap', chinaMap);
    echarts.registerMap('chinaMapOutline', chinaMap);
    option = {
        tooltip: {
            trigger: 'item',
            show:false
        },
        geo: {
            silent: true,
            map: 'chinaMapOutline',
            show: false,
            zoom: 0.8,
            top: '0%',
            label: {
                normal: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                },
                emphasis: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: {
                        type: 'linear-gradient',
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(45,68,121,0.15)' // 0% 处的颜色
                        },
                            {
                                offset: 1,
                                color: 'rgba(45,68,121,0.18)' // 100% 处的颜色
                            }
                        ],
                        global: true // 缺省为 false
                    },
                    borderColor: '#83BAFF',
                    borderWidth: 1,
                    shadowColor: 'rgba(56,164,255,.26)',
                    opacity: 0.5,
                    shadowOffsetX: 5,
                    shadowOffsetY: 5,
                    shadowBlur: 5,
                    show: true, // 是否显示对应地名
                    textStyle: {
                        //字体颜色
                        color: '#797979'
                    }
                },
                emphasis: {
                    color: 'transparent', //悬浮背景
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        },
        visualMap: {
            seriesIndex: 4,
            type: 'piecewise',
            show: false,
            textStyle: {
                color: '#FFFF'
            },
            splitList:[{
                gt: 160,
                color: '#FF0052'
            },{
                lte: 155,
                color: '#FFA300'
            }]
        },
        series: [
            {
                map: 'chinaMap',
                type: 'map',
                zoom: 1.25,
                label: {
                    show: false,
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                tooltip: {
                    show: false
                },
                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: '#0f3963',
                        borderColor: 'rgba(0,255,255,1)',
                        borderWidth: 1,
                    },
                    emphasis: {
                        areaColor: '#0f3963',
                        label: {
                            show: false
                        }
                    }
                }
            },
            {
                name: '散点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: data,
                symbol: function(data,other){
                    return 'rect'
                },
                tooltip: {
                    show: false
                },
                symbolSize: function(val) {
                    return 1;
                },
                itemStyle: {
                    normal: {
                        color: 'transparent'
                    },
                    emphasis: {
                        show: false
                    }
                },
                label: {
                    show: true,
                    position: 'center',
                    formatter: '{b}',
                    color: '#ffffff',
                    align: 'top',
                    emphasis: {
                        show: false
                    }
                },
                z: 1001,

            },
            {
                name: '地图',
                type: 'custom',
                coordinateSystem: 'geo',
                renderItem: function (params,api) {//具体实现自定义图标的方法
                    if (dataIcon[params.dataIndex].num > 0  &&  dataIcon[params.dataIndex].num <= 50) {
                        return addImage("image/runBlue.png", params, api, dataIcon);
                    } else if (dataIcon[params.dataIndex].num > 50  &&  dataIcon[params.dataIndex].num <= 100) {
                        return addImage("image/runBlue.png", params, api, dataIcon)
                    } else if (dataIcon[params.dataIndex].num > 100  &&  dataIcon[params.dataIndex].num <= 150) {
                        return addImage("image/runOrange.png", params, api, dataIcon)
                    } else if (dataIcon[params.dataIndex].num > 150  &&  dataIcon[params.dataIndex].num <= 200) {
                        return addImage("image/runOrange.png", params, api, dataIcon)
                    } else if (dataIcon[params.dataIndex].num > 200  &&  dataIcon[params.dataIndex].num <= 250) {
                        return addImage("image/runRed.png", params, api, dataIcon)
                    } else {
                        return addImage("image/runRed.png", params, api, dataIcon)
                    }
                },
                data: dataIcon,
                z: 999
            },
            {
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData,
                symbolSize: function (val) {
                    return val[2]/10;
                },
                encode: {
                    value: 2
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        "show": false,
                        formatter: function(params) {
                            for (var i = 0; i < labelData.length; i++) {
                                if (params.name == labelData[i].name) {
                                    var ymd = labelData[i].alarmTime.substring(0,10);
                                    var hour = labelData[i].alarmTime.replace(ymd,'').substring(0,labelData[i].alarmTime.replace(ymd,'').lastIndexOf(":00"));
                                    if(params.name=='天台县'){
                                        return "{div|" + params.name + ymd+" }\n{fontVal|"+hour+labelData[i].mark+"}"
                                    }else{
                                        return "{div|" + params.name + ymd+" }\n{fontVal|"+hour+labelData[i].mark+"}\n\n\n{sign|}"
                                    }

                                }
                            }
                            return '';
                        },
                        /*backgroundColor: {
                            image: './static/img/bg.png'
                        },*/
                        color: '#FFFFFF',
                        verticalAlign: "bottom",
                        align: 'center',
                        rich: {
                            value: {
                                fontsize: 20
                            },
                            fontName: {
                                shadowOffsetX: -1,
                                color: '#57F7FE',
                                fontSize: 10
                            },
                            fontVal: {
                                height: 10,
                                color: '#ffffff',
                                fontSize: 10,
                                fontWeight: 900,
                                padding: [10, 3, 0, 0],
                            },
                            spanColor:{
                                fontSize: 10,
                                color: "#FF0052",
                                height: 10,
                                padding: [10, 3, 0, 0],
                            },
                            div: {
                                height: 80,
                                fontSize: 12,
                                lineHeight: 8,
                                //疑似 下 右 上 左
                                padding: [15, 3, 3, 0],
                                color: "#FFFFFF",
                                backgroundColor: {
                                    image: mapIcons.bg
                                }
                            },
                            sign: {
                                position: "absolute",
                                height: 80,
                                color: "#ffffff",
                                padding: [0, 3, 3, 0],
                                backgroundColor: {
                                    image: mapIcons.sign
                                }
                            },
                            divTwo: {
                                height: 40,
                                fontSize: 14,
                                lineHeight: 8,
                                fontWeight: 900,
                                //疑似 下 右 上 左
                                padding: [15, 3, 3, 0],
                                color: "#FFA300",
                                backgroundColor: {
                                    image: mapIcons2.bg
                                }
                            },
                            signTwo: {
                                position: "absolute",
                                height: 50,
                                color: "#ffffff",
                                padding: [0, 3, 3, 0],
                                backgroundColor: {
                                    image: mapIcons2.sign
                                }
                            }
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    color: 'red',
                    shadowBlur: 10,
                    shadowColor: '#333'
                },
                zlevel: 1,
                z: 1000
            }


        ]
    }
    mycharts.setOption(option);
}
mapEchart()
echarts.init(document.getElementById('map')).on('click',function(params){
    var name = params.name;
    if(name.indexOf("临海")>-1){
        mycharts.clear();
        getForecast('58660');
        $("#stationName").text("临海");
    }else if(name.indexOf("仙居")>-1){
        mycharts.clear();
        getForecast('58652');
        $("#stationName").text("仙居");
    }else if(name.indexOf("三门")>-1){
        mycharts.clear();
        getForecast('58568');
        $("#stationName").text("三门");
    }else if(name.indexOf("温岭")>-1){
        mycharts.clear();
        getForecast('58664');
        $("#stationName").text("温岭");
    }else if(name.indexOf("黄岩")>-1){
        mycharts.clear();
        getForecast('K8505');
        $("#stationName").text("黄岩");
    }else if(name.indexOf("天台")>-1){
        mycharts.clear();
        getForecast('');
        $("#stationName").text("天台");
    }else if(name.indexOf("路桥")>-1){
        mycharts.clear();
        getForecast('758301');
        $("#stationName").text("路桥");
    }else if(name.indexOf("玉环")>-1){
        mycharts.clear();
        getForecast('58667');
        $("#stationName").text("玉环");
    }else if(name.indexOf("椒江")>-1 ){
        mycharts.clear();
        getForecast('58665');
        $("#stationName").text("椒江");
    }
})
//跳转 天气警报制作页面
$("#startEvent").on("click",function(){
    window.parent['vueDefinedMyProp']({name: 'weather-warnin', path: 'weather-warning-made'});
})
let windowWidth=()=>$(window).width()
let pageWidth = windowWidth() == 1280? "30%":"20%"

function getWindd(windd){
    if(windd>11.25&&windd<=33.75){
        return "北到东北";
    }else if(windd>33.75&&windd<=56.25){
        return "东北";
    }else if(windd>56.25&&windd<=78.75){
        return "东到东北";
    }else if(windd>78.75&&windd<=101.25){
        return "偏东";
    }else if(windd>101.25&&windd<=123.75){
        return "东到东南";
    }else if(windd>123.75&&windd<=146.25){
        return "东南";
    }else if(windd>146.25&&windd<=168.75){
        return "南到东南";
    }else if(windd>168.75&&windd<=191.25){
        return "偏南";
    }else if(windd>191.25&&windd<=213.75){
        return "南到西南";
    }else if(windd>213.75&&windd<=236.25){
        return "西南";
    }else if(windd>236.25&&windd<=258.75){
        return "西到西南";
    }else if(windd>258.75&&windd<=281.25){
        return "偏西";
    }else if(windd>281.25&&windd<=303.75){
        return "西到西北";
    }else if(windd>303.75&&windd<=326.25){
        return "西北";
    }else if(windd>326.25&&windd<=348.75){
        return "北到西北";
    }else{
        return "偏北";
    }
}
function getWeather(type){
    var weatherName = '';
    switch (type) {
        case '0':
            weatherName = "晴";
            break;
        case '1':
            weatherName = "多云";
            break;
        case '2':
            weatherName = "阴";
            break;
        case '3':
            weatherName = "阵雨";
            break;
        case '4':
            weatherName = "雷阵雨";
            break;
        case '5':
            weatherName = "雷阵雨并伴有冰雹";
            break;
        case '6':
            weatherName = "雨夹雪";
            break;
        case '7':
            weatherName = "小雨";
            break;
        case '8':
            weatherName = "中雨";
            break;
        case '9':
            weatherName = "大雨";
            break;
        case '10':
            weatherName = "暴雨";
            break;
        case '11':
            weatherName = "大暴雨";
            break;
        case '12':
            weatherName = "特大暴雨";
            break;
        case '13':
            weatherName = "阵雪";
            break;
        case '14':
            weatherName = "小雪";
            break;
        case '15':
            weatherName = "中雪";
            break;
        case '16':
            weatherName = "大雪";
            break;
        case '17':
            weatherName = "暴雪";
            break;
        case '18':
            weatherName = "雾";
            break;
        case '19':
            weatherName = "冻雨";
            break;
        case '20':
            weatherName = "沙尘暴";
            break;
        case '21':
            weatherName = "小到中雨";
            break;
        case '22':
            weatherName = "中到大雨";
            break;
        case '23':
            weatherName = "大到暴雨";
            break;
        case '24':
            weatherName = "暴雨到大暴雨";
            break;
        case '25':
            weatherName = "大暴雨到特大暴雨";
            break;
        case '26':
            weatherName = "小到中雪";
            break;
        case '27':
            weatherName = "中到大雪";
            break;
        case '28':
            weatherName = "大到暴雪";
            break;
        case '29' :
            weatherName= "浮尘";
            break;
        case '30' :
            weatherName= "扬沙";
            break;
        case '31' :
            weatherName= "强沙尘暴";
            break;
        case '32' :
            weatherName= "浓雾";
            break;
        case '49' :
            weatherName= "强浓雾";
            break;
        case '53' :
            weatherName= "霾";
            break;
        case '54' :
            weatherName= "中度霾";
            break;
        case '55' :
            weatherName= "重度霾";
            break;
        case '56' :
            weatherName= "严重霾";
            break;
        case '57' :
            weatherName= "大雾";
            break;
        case '58' :
            weatherName= "特强浓雾";
            break;
        default:
            weatherName = "";
            break;
    }
    return weatherName;
}
