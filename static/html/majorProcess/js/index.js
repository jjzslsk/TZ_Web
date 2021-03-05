$(function(){
    var stationNum = '58665';
    var ele = 'temp';
    var monthEle = 'temp';
    var stationNum1='58665';
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test1'
            ,format: 'yyyy-MM-dd'
        });
        $(".placeName").find("span").click(function(obj,index){
            stationNum1 = $(this).attr("station")
            var option = option5Fn();
            var myChart = echarts.init(document.getElementById("runTemp"));
            //myChart.clear();
            if(option!=undefined){
                myChart.setOption(option, true);
            }
        })
        Date.prototype.getDayYear = function(){
            const year = this.getFullYear();
            const month = this.getMonth();
            const date = this.getDate();

            //当前年第一天0时0分0秒的时间戳
            const firstTimestamp = new Date(`${year}-1-1 00:00:00`);
            // 当前天的时间戳，
            const currentTimestamp = new Date(`${year}-${month}-${date} 23:59:59`).getTime();
            // 时间差 = 当前天时间戳 - 当前年第一天时间戳
            const hasTimestamp =  currentTimestamp - firstTimestamp;
            // 一天的时间戳
            const time = 24 * 60 * 60 * 1000;
            // 计算有多少天
            const hasDays = Math.ceil(hasTimestamp/time);
            return hasDays;
        }
        window.option5Fn = function (){
            var option;
            $.ajax({
                type: "get",
                url: main_url + "/realTime/getHistoryDay",
                async: false,
                data: {"stationNum": stationNum1},
                dataType: "json",
                success: function (obj) {
                    var timeData = obj.time;
                    var cnRain1 = obj.cnRain;
                    var dnRain1 = obj.dnRain;
                    var snMeiYu = obj.snMeiYu;
                    var MYSTime = snMeiYu.startTime;
                    var MYETime = snMeiYu.endTime;
                    var cnRain = [];
                    var dnRain = [];
                    for(var i=0;i<timeData.length;i++){
                        cnRain[i] = '';
                        dnRain[i] = '-';
                    }
                    for(var i=0;i<timeData.length;i++){
                        var times = timeData[i];
                        for(var k=0;k<cnRain1.length;k++){
                            var t = cnRain1[k];
                            for(var key in t){
                                if(times==key){
                                    cnRain[i] = t[key];
                                }
                            }
                        }
                        for(var k=0;k<dnRain1.length;k++){
                            var t = dnRain1[k];
                            for(var key in t){
                                if(times==key){
                                    dnRain[i] = t[key];
                                }
                            }
                        }
                    }
                    var day = Math.ceil(( new Date() - new Date(new Date().getFullYear().toString()))/(24*60*60*1000))+1;
                    var cnTemp = obj.cnTemp;
                    var cnMaxTemp = obj.cnMaxTemp;
                    var cnMinTemp = obj.cnMinTemp;
                    var dnTemp = obj.dnTemp;
                    var dnMaxTemp = obj.dnMaxTemp;
                    var dnMinTemp = obj.dnMinTemp;
                    option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                animation: false
                            },
                            formatter: function(parmas){
                                var tipTxt = '';
                                for(var i = 0; i < parmas.length; i++){
                                    if(i == 0){
                                        tipTxt += parmas[i].axisValueLabel + '<br>'
                                    }
                                    if(parmas[i].data!='-'){
                                        if(parmas[i].seriesName.indexOf("降雨量")>-1){
                                            tipTxt += '<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background: '+parmas[i].color+';"></div>'+ parmas[i].seriesName+'：'+parmas[i].data +'mm<br>';
                                        }else{
                                            tipTxt += '<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;vertical-align: middle;margin-right: 5px;background: '+parmas[i].color+';"></div>'+ parmas[i].seriesName+'：'+parmas[i].data +'℃<br>';
                                        }
                                    }
                                }
                                return tipTxt
                            }
                        },
                        dataZoom: [
                            {
                                show: true,
                                realtime: true,
                                startValue: day-12,
                                endValue: day+7,
                                xAxisIndex: [0, 1],
                                zoomOnMouseWheel: false
                            },
                            {
                                type: 'inside',
                                realtime: true,
                                startValue: 80,
                                endValue: 100,
                                xAxisIndex: [0, 1],
                                zoomOnMouseWheel: false
                            }
                        ],
                        grid: [{
                            left: 50,
                            right: 50,
                            top: '15%',
                            height: '27%'
                        }, {
                            left: 50,
                            right: 50,
                            top: '55%',
                            height: '27%'
                        }],
                        xAxis: [
                            {
                                type: 'category',
                                axisLine: {onZero: true},
                                data: timeData,
                                axisLine:{
                                    show: true,
                                    lineStyle:{
                                        color: '#7ECEF4',
                                        width: 1
                                    }
                                },
                                axisLabel:{
                                    color: '#ffffff'
                                }
                            },
                            {
                                gridIndex: 1,
                                type: 'category',
                                axisLine: {onZero: true},
                                data: timeData,
                                axisLine:{
                                    show: true,
                                    lineStyle:{
                                        color: '#7ECEF4',
                                        width: 1
                                    }
                                },
                                axisLabel:{
                                    color: '#ffffff'
                                }
                            }
                        ],
                        yAxis: [
                            {
                                name: '',
                                type: 'value',
                                axisLine:{
                                    show: true,
                                    lineStyle:{
                                        color: '#7ECEF4',
                                        width: 1
                                    }
                                },
                                axisLabel:{
                                    color: '#ffffff'
                                },
                                splitLine:{
                                    show: false
                                }
                            },
                            {
                                gridIndex: 1,
                                name: '',
                                type: 'value',
                                axisLine:{
                                    show: true,
                                    lineStyle:{
                                        color: '#7ECEF4',
                                        width: 1
                                    }
                                },
                                axisLabel:{
                                    color: '#ffffff'
                                },
                                splitLine:{
                                    show: false
                                }
                            }
                        ],
                        series: [
                            {
                                name: '常年降雨量',
                                type: 'bar',
                                hoverAnimation: false,
                                barWidth: '20%',
                                itemStyle:{
                                    color: '#3399FF'
                                },
                                label:{
                                    show: true,
                                    position: 'top',
                                    formatter: function(val){
                                        return val.value + 'mm'
                                    }
                                },
                                data: cnRain,
                                markArea:{
                                    data:[
                                        [
                                            {
                                                name: '历史常年梅期',
                                                xAxis: '06月10日',
                                                label:{
                                                    color: 'rgba(255,153,51,1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(255,153,51,2)'
                                                }
                                            },
                                            {name: '', xAxis: '07月04日'},
                                        ],
                                        [
                                            {
                                                name: '上一年梅期',
                                                xAxis: MYSTime,
                                                label:{
                                                    color: 'rgba(17,130,9, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(17,130,9,0.2)'
                                                }
                                            },
                                            {name: '', xAxis: MYETime},
                                        ]
                                    ]
                                }
                            },
                            {
                                name: '本年降雨量',
                                type: 'bar',
                                hoverAnimation: false,
                                barWidth: '20%',
                                itemStyle:{
                                    color: '#00C8FF'
                                },
                                label:{
                                    show: true,
                                    position: 'top',
                                    formatter: function(val){
                                        return val.value + 'mm'
                                    }
                                },
                                data: dnRain,
                                markArea:{
                                    data:[
                                        [
                                            {
                                                name: '历史常年梅期',
                                                xAxis: '1月2日',
                                                label:{
                                                    color: 'rgba(6, 107, 92, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(6, 107, 92, 0.2)'
                                                }
                                            },
                                            {name: '', xAxis: '1月6日'},
                                        ],
                                        [
                                            {
                                                name: '上一年梅期',
                                                xAxis: '1月4日',
                                                label:{
                                                    color: 'rgba(17,130,9, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(17,130,9,0.2)'
                                                }
                                            },
                                            {name: '', xAxis: '1月8日'},
                                        ]
                                    ]
                                }
                            },
                            {
                                name: '常年最高温',
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                symbol: 'circle',
                                symbolSize: 6,
                                hoverAnimation: false,
                                lineStyle:{
                                    color: '#FF9900'
                                },
                                itemStyle:{
                                    color: '#FF9900'
                                },
                                data: cnMaxTemp,
                                markArea:{
                                    data:[
                                        [
                                            {
                                                name: '低温警报',
                                                xAxis: '1月2日',
                                                label:{
                                                    color: 'rgba(235, 47, 74, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(235, 47, 74, 0.2)'
                                                }
                                            },
                                            {name: '', xAxis: '1月4日'},
                                        ],
                                        [
                                            {
                                                name: '倒春寒',
                                                xAxis: '1月8日',
                                                label:{
                                                    color: 'rgba(17,130,9, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(46, 38, 211, 0.3)'
                                                }
                                            },
                                            {name: '', xAxis: '1月12日'},
                                        ]
                                    ]
                                }
                            },{
                                name: '常年最低温',
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                symbol: 'circle',
                                symbolSize: 6,
                                hoverAnimation: false,
                                lineStyle:{
                                    color: '#3366FF'
                                },
                                itemStyle:{
                                    color: '#3366FF'
                                },
                                data: cnMinTemp
                            },{
                                name: '常年平均气温',
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                symbol: 'circle',
                                symbolSize: 6,
                                hoverAnimation: false,
                                lineStyle:{
                                    color: '#33FF66'
                                },
                                itemStyle:{
                                    color: '#33FF66'
                                },
                                data: cnTemp
                            },
                            {
                                name: '本年最高温',
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                symbol: 'circle',
                                symbolSize: 6,
                                hoverAnimation: false,
                                lineStyle:{
                                    color: '#FFCC33'
                                },
                                itemStyle:{
                                    color: '#FFCC33'
                                },
                                data: dnMaxTemp,
                                markArea:{
                                    data:[
                                        [
                                            {
                                                name: '低温警报',
                                                xAxis: '1月2日',
                                                label:{
                                                    color: 'rgba(235, 47, 74, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(235, 47, 74, 0.2)'
                                                }
                                            },
                                            {name: '', xAxis: '1月4日'},
                                        ],
                                        [
                                            {
                                                name: '倒春寒',
                                                xAxis: '1月8日',
                                                label:{
                                                    color: 'rgba(17,130,9, 1)'
                                                },
                                                itemStyle:{
                                                    color: 'rgba(46, 38, 211, 0.3)'
                                                }
                                            },
                                            {name: '', xAxis: '1月12日'},
                                        ]
                                    ]
                                }
                            },
                            {
                                name: '本年最低温',
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                symbol: 'circle',
                                symbolSize: 6,
                                hoverAnimation: false,
                                lineStyle:{
                                    color: '#8EC2F2'
                                },
                                itemStyle:{
                                    color: '#8EC2F2'
                                },
                                data: dnMinTemp
                            },
                            {
                                name: '本年平均气温',
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                symbol: 'circle',
                                symbolSize: 6,
                                hoverAnimation: false,
                                lineStyle:{
                                    color: '#99FF66'
                                },
                                itemStyle:{
                                    color: '#99FF66'
                                },
                                data: dnTemp
                            }
                        ]
                    };
                }
            })

            return option;
        }
    });
	setEchart('xunEchart',option1Fn())
	setEchart('dayDataQueryEchart',option2Fn())
	setEchart('mapEchart',option3Fn())
	setEchart('monthEchart',option4Fn())
	setEchart('runTemp',option5Fn())
    document.getElementById("station").onchange =function(){
        stationNum = this.options[this.selectedIndex].value;
        setEchart('xunEchart',option1Fn())
        setEchart('dayDataQueryEchart',option2Fn())
        setEchart('monthEchart',option4Fn())
    }
	function setEchart(dom, option) {
		var myChart = echarts.init(document.getElementById(dom));
		//myChart.clear();
		if(option!=undefined){
            myChart.setOption(option, true);
		}
	}
	function aniEchart(dom) {
		var myChart = echarts.init(document.getElementById(dom));
		myChart.resize()
	}

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
    $(".btn1").click(function(obj){
        ele = $(".btn1 .spanAc").attr("dataEle");
        setEchart('xunEchart',option1Fn())
    })
    $(".btn2").click(function(obj){
        monthEle = $(".btn2 .spanAc").attr("dataEle");
        setEchart('monthEchart',option4Fn())
    })
	function option1Fn(){
        var option
        $.ajax({
            type: "get",
            url: main_url + "/ssd-forecast-element/getForecastXunData",
            async:false,
            data: {"stationNum":stationNum,"ele":ele},
            dataType: "json",
            success: function (obj) {
                var timeArr = obj.timeArr;
                if(ele=='temp'){
                    var max = obj.max;
                    var min = obj.min;
                    var avg = obj.avg;
                    var maxAvg = obj.maxAvg;
                    var minAvg = obj.minAvg;
                    var avgAvg = obj.avgAvg;
                    option = {
                        grid:{
                            left: '18%'
                        },
                        xAxis: [{
                            type: 'value',
                            axisLine:{
                                show: false
                            },
                            axisLabel:{
                                show: false
                            },
                            axisTick:{
                                show:false
                            },
                            splitLine:{
                                show: false
                            }
                        },{
                            type: 'category',
                            data: ['日期','最低气温(℃)', '平均气温(℃)', '最高气温(℃)'],
                            boundaryGap: false,
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
                                textStyle:{
                                    color: '#AFE4FE'
                                }
                            }
                        }],
                        yAxis: [{
                            type: 'category',
                            data: timeArr,
                            axisLine:{
                                show: false
                            },
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                show: false
                            }
                        },{
                            type: 'category',
                            position: 'left',
                            data: timeArr,
                            axisLine:{
                                lineStyle:{
                                    color: '#0068B7'
                                }
                            },
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                textStyle:{
                                    color: '#ffffff'
                                }
                            }
                        }],
                        series: [{
                            color: '#8EC2F2',
                            data: min,
                            type: 'line',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            label:{
                                normal:{
                                    show: true,
                                    color: '#8EC2F2',
                                    formatter: function(val){
                                        return val.value + '℃'
                                    }
                                }
                            },
                            markLine:{
                                symbol: 'none',
                                data:[
                                    {
                                        name: 'a',
                                        xAxis: minAvg,
                                        lineStyle:{
                                            type: 'dashed',
                                            width: 1,
                                            curveness: 1,
                                            color: '#8EC2F2'
                                        },
                                        label:{
                                            color: '#8EC2F2',
                                            position: 'start',
                                            formatter: function(){
                                                return '历史最低温\n'+minAvg+'℃'
                                            }
                                        }
                                    },
                                    {
                                        name: 'b',
                                        yAxis: timeArr[11],
                                        lineStyle:{
                                            type: 'solid',
                                            width: 30,
                                            curveness: 1,
                                            color: 'rgba(8, 36, 102, 0.4)'
                                        },
                                        label:{
                                            formatter: function(){
                                                return ''
                                            }
                                        }
                                    }
                                ]
                            },
                        },{
                            color: '#9FD046',
                            data: avg,
                            type: 'line',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            label:{
                                normal:{
                                    show: true,
                                    color: '#9FD046',
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
                                    color: '#9FD046'
                                },
                                label:{
                                    color: '#9FD046',
                                    position: 'start',
                                    formatter: function(){
                                        return '历史平均温\n'+avgAvg+'℃'
                                    }
                                },
                                data:[
                                    {name: 'a',xAxis: avgAvg}
                                ],
                            }
                        },{
                            color: '#FFB400',
                            data: max,
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
                                    color: '#FE962F'
                                },
                                label:{
                                    color: '#FE962F',
                                    position: 'start',
                                    formatter: function(){
                                        return '历史最高温\n'+maxAvg+'℃'
                                    }
                                },
                                data:[
                                    {name: 'a',xAxis: maxAvg}
                                ],
                            }
                        }]
                    };
                }
                if(ele=='rain'){
                    var sumRain = obj.sumRain;
                    var rainAvg = obj.rainAvg;
                    option = {
                        title:{
                            text: '日期           降水(mm)',
                            textStyle:{
                                color: '#AFE4FE',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            left: '5%'
                        },
                        grid: {
                            left: '13%',
                            right: '4%',
                            top: '5%',
                            bottom: '8%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'value',
                            axisLine:{
                                show: false
                            },
                            axisLabel:{
                                show: false
                            },
                            splitLine:{
                                show: false
                            },
                            axisTick:{
                                show: false
                            },
                        }],
                        yAxis: [{
                            type: 'category',
                            position: 'left',
                            offset: 0,
                            data: timeArr,
                            axisTick:{
                                show: false
                            },
                            axisLabel:{
                                show: false
                            },
                            axisLine:{
                                show: false
                            }
                        },{
                            type: 'category',
                            position: 'left',
                            offset: 30,
                            data: timeArr,
                            axisTick:{
                                show: false
                            },
                            axisLabel:{
                                textStyle:{
                                    color: '#ffffff'
                                }
                            },
                            axisLine:{
                                lineStyle:{
                                    color: '#0068B7'
                                }
                            }
                        }],
                        series: [
                            {
                                name: '2011年',
                                type: 'bar',
                                yAxisIndex: 0,
                                barWidth: '20%',
                                data: sumRain,
                                itemStyle:{
                                    color: '#00C8FF'
                                },
                                label:{
                                    show: true,
                                    position: 'right',
                                    textStyle:{
                                        color: '#00C8FF'
                                    }
                                },
                                markLine:{
                                    symbol: 'none',

                                    data:[
                                        {
                                            name: 'a',
                                            xAxis: rainAvg,
                                            lineStyle:{
                                                type: 'dashed',
                                                width: 1,
                                                curveness: 1,
                                                color: '#00FFFF'
                                            },
                                            label:{
                                                color: '#00FFFF',
                                                position: 'start',
                                                formatter: function(){
                                                    return '历史平均降水\n'+rainAvg+'mm'
                                                }
                                            },
                                        },
                                        {
                                            name: 'b',
                                            yAxis: timeArr[11],
                                            lineStyle:{
                                                type: 'solid',
                                                width: 30,
                                                curveness: 1,
                                                color: 'rgba(8, 36, 102, 0.4)'
                                            },
                                            label:{
                                                formatter: function(){
                                                    return ''
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    };
                }
            }
        })
        return option;
	}

	function option2Fn(){
        var option;
        $.ajax({
            type: "get",
            url: main_url + "/ssd-forecast-element/getForecastDayData",
            async: false,
            data: {"stationNum": stationNum},
            dataType: "json",
            success: function (obj) {
                var timeArr = obj.timeArr;
                var maxTemp = obj.max;
                var minTemp = obj.min;
                var rain = obj.rain;
                var maxTempNum = obj.maxTemp;
                var minTempNum = obj.minTemp;
                var rainAvg = obj.rainAvg;
                var storyMax = maxTempNum, storyMin = minTempNum,
                weatherIcon = [],
                runData = rain;
                var rainMax = obj.rainMax;
                var dataTime = timeArr;
                if(maxTempNum > storyMax){
                    storyMax = maxTempNum
                }
                if(minTempNum < storyMin){
                    storyMin = minTempNum
                }
                for(var i = 0; i < maxTemp.length; i++){
                    weatherIcon.push(storyMax+10)
                }
                // var yMax = Math.max(...runData) * 5;
                var yMax = rainMax;
                option = {
                    grid: {
                        top: '15%',
                        bottom: '15%',
                        left: '5%',
                        right: '10%'
                    },
                    xAxis: [{
                        type: 'category',
                        data: dataTime,
                        boundaryGap: true,
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
                        data: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                        boundaryGap: true,
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
                                    return '历史最高温\n'+maxTempNum+'℃'
                                }
                            },
                            data:[
                                {name: 'aaa',yAxis: maxTempNum}
                            ],
                        }
                    }/*,{
                        yAxisIndex: 0,
                        data: weatherIcon,
                        type: 'line',
                        lineStyle:{
                            width: 0
                        },
                        smooth: true,
                        symbol: 'image://image/weatherIcon.png',
                        symbolSize: [24,23],
                        markArea:{
                            itemStyle:{
                                color: 'rgba(63,63,0,0.45)'
                            },
                            label:{
                                color: '#FFFF00',
                                position: 'top',
                                formatter: function(){
                                    return '低温警报'
                                }
                            },
                            data:[
                                [
                                    {name: '', xAxis: 7},
                                    {name: '', xAxis: 9},
                                ]
                            ]
                        }
                    }*/,{
                        color: '#8EC2F2',
                        yAxisIndex: 0,
                        data: minTemp,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 6,
                        label:{
                            normal:{
                                show: true,
                                color: '#8EC2F2',
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
                                color: '#8EC2F2'
                            },
                            label:{
                                color: '#8EC2F2',
                                formatter: function(){
                                    return '历史最低温\n'+minTempNum+'℃'
                                }
                            },
                            data:[
                                {name: 'aaa',yAxis: minTempNum}
                            ],
                        }
                    },{
                        color: '#053E9A',
                        yAxisIndex: 1,
                        xAxisIndex: 1,
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
                        },
                        markLine:{
                            symbol: 'none',
                            lineStyle:{
                                type: 'dashed',
                                width: 1,
                                curveness: 1,
                                color: '#00C8FF'
                            },
                            label:{
                                color: '#00C8FF',
                                formatter: function(){
                                    return '历史平均降水\n'+rainAvg+'mm'
                                }
                            },
                            data:[
                                {name: 'aaa',yAxis:rainAvg}
                            ],
                        },
                        markArea:{
                            itemStyle:{
                                color: 'rgba(10, 28, 81, 0.45)'
                            },
                            data:[
                                [
                                    {name: '', xAxis: 0},
                                    {name: '', xAxis: 5},
                                ]
                            ]
                        }
                    }]
                };
            }
        })

		return option;
	}

	function option3Fn(){
		var chinaMap;
		$.ajax({
			url: 'data/taizhou.json',
			type: 'get',
			async: false,
			success: function(res) {
				chinaMap = res;
			}
		});
		var data = [{
			'name': "椒江区",
			'value': [121.531049, 28.47615],
		}, {
			'name': "黄岩区",
			'value': [121.062138, 28.34488],
		}, {
			'name': "路桥区",
			'value': [121.57292, 28.301799],
		}, {
			'name': "三门县",
			'value': [121.56429, 28.918955],
		}, {
			'name': "天台县",
			'value': [121.031227, 29.041126],
		}, {
			'name': "仙居县",
			'value': [120.535074, 28.549213],
		}, {
			'name': "温岭市",
			'value': [121.543611, 28.068781],
		}, {
			'name': "临海市",
			'value': [121.031229, 28.645441],
		}, {
			'name': "玉环市",
			'value': [121.332337, 27.82842],
		}];
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
		}];

		var convertData = [{
			name: '临海市',
			value: [121.031229,28.645441,150]
		},{
			name: '玉环市',
			value: [121.332337,27.82842,170]
		}]

		echarts.registerMap('chinaMap', chinaMap);
		echarts.registerMap('chinaMapOutline', chinaMap);
		var option = {
			tooltip: {
				trigger: 'item'
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
						// areaColor: 'transparent',
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
					zoom: 1,
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
							areaColor: '#072C7A',
							borderColor: '#00B7EE',
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
					itemStyle: {
						color: 'rgba(0,0,0,0)'
					},
					z: 9999,
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
				},
				{
					name: '地图',
					type: 'custom',
					coordinateSystem: 'geo',
					renderItem: function (params,api) {//具体实现自定义图标的方法
						return addImage("image/warning_icon/大雾_03.png", params, api, dataIcon)
					},
					data: dataIcon,
					z: 999
				}
			]
		}
		return option;
	}

	function option4Fn(){
        var option
        $.ajax({
            type: "get",
            url: main_url + "/ssd-forecast-element/getForecastMonthData",
            async: false,
            data: {"stationNum": stationNum, "ele": monthEle},
            dataType: "json",
            success: function (obj) {
                var timeArr = obj.timeArr;
                if(monthEle=='temp'){

                    var max = obj.max;
                    var min = obj.min;
                    var avg = obj.avg;
                    var maxAvg = obj.maxAvg;
                    var minAvg = obj.minAvg;
                    var avgAvg = obj.avgAvg;
                    option = {
                        grid:{
                            left: '18%'
                        },
                        xAxis: [{
                            type: 'value',
                            axisLine:{
                                show: false
                            },
                            axisLabel:{
                                show: false
                            },
                            axisTick:{
                                show:false
                            },
                            splitLine:{
                                show: false
                            }
                        },{
                            type: 'category',
                            data: ['日期','最低气温(℃)', '平均气温(℃)', '最高气温(℃)'],
                            boundaryGap: false,
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
                                textStyle:{
                                    color: '#AFE4FE'
                                }
                            }
                        }],
                        yAxis: [{
                            type: 'category',
                            data: timeArr,
                            axisLine:{
                                show: false
                            },
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                show: false
                            }
                        },{
                            type: 'category',
                            position: 'left',
                            data: timeArr,
                            axisLine:{
                                lineStyle:{
                                    color: '#0068B7'
                                }
                            },
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                textStyle:{
                                    color: '#ffffff'
                                }
                            }
                        }],
                        series: [{
                            color: '#8EC2F2',
                            data: min,
                            type: 'line',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            label:{
                                normal:{
                                    show: true,
                                    color: '#8EC2F2',
                                    formatter: function(val){
                                        return val.value + '℃'
                                    }
                                }
                            },
                            markLine:{
                                symbol: 'none',
                                data:[
                                    {
                                        name: 'a',
                                        xAxis: minAvg,
                                        lineStyle:{
                                            type: 'dashed',
                                            width: 1,
                                            curveness: 1,
                                            color: '#8EC2F2'
                                        },
                                        label:{
                                            color: '#8EC2F2',
                                            position: 'start',
                                            formatter: function(){
                                                return '历史最低温\n'+minAvg+'℃'
                                            }
                                        }
                                    },
                                    {
                                        name: 'b',
                                        yAxis: timeArr[11],
                                        lineStyle:{
                                            type: 'solid',
                                            width: 30,
                                            curveness: 1,
                                            color: 'rgba(8, 36, 102, 0.4)'
                                        },
                                        label:{
                                            formatter: function(){
                                                return ''
                                            }
                                        }
                                    }
                                ]
                            },
                        },{
                            color: '#9FD046',
                            data: avg,
                            type: 'line',
                            smooth: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            label:{
                                normal:{
                                    show: true,
                                    color: '#9FD046',
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
                                    color: '#9FD046'
                                },
                                label:{
                                    color: '#9FD046',
                                    position: 'start',
                                    formatter: function(){
                                        return '历史平均温\n'+avgAvg+'℃'
                                    }
                                },
                                data:[
                                    {name: 'a',xAxis: avgAvg}
                                ],
                            }
                        },{
                            color: '#FFB400',
                            data: max,
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
                                    color: '#FE962F'
                                },
                                label:{
                                    color: '#FE962F',
                                    position: 'start',
                                    formatter: function(){
                                        return '历史最高温\n'+maxAvg+'℃'
                                    }
                                },
                                data:[
                                    {name: 'a',xAxis: maxAvg}
                                ],
                            }
                        }]
                    };

                }
                if(monthEle=='rain'){
                    var sumRain = obj.sumRain;
                    var rainAvg = obj.rainAvg;
                    option = {
                        title:{
                            text: '日期           降水(mm)',
                            textStyle:{
                                color: '#AFE4FE',
                                fontSize: 14,
                                fontWeight: 'normal'
                            },
                            left: '5%'
                        },
                        grid: {
                            left: '13%',
                            right: '4%',
                            top: '5%',
                            bottom: '8%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'value',
                            axisLine:{
                                show: false
                            },
                            axisLabel:{
                                show: false
                            },
                            splitLine:{
                                show: false
                            },
                            axisTick:{
                                show: false
                            },
                        }],
                        yAxis: [{
                            type: 'category',
                            position: 'left',
                            offset: 0,
                            data: timeArr,
                            axisTick:{
                                show: false
                            },
                            axisLabel:{
                                show: false
                            },
                            axisLine:{
                                show: false
                            }
                        },{
                            type: 'category',
                            position: 'left',
                            offset: 30,
                            data: timeArr,
                            axisTick:{
                                show: false
                            },
                            axisLabel:{
                                textStyle:{
                                    color: '#ffffff'
                                }
                            },
                            axisLine:{
                                lineStyle:{
                                    color: '#0068B7'
                                }
                            }
                        }],
                        series: [
                            {
                                name: '2011年',
                                type: 'bar',
                                yAxisIndex: 0,
                                barWidth: '20%',
                                data: sumRain,
                                itemStyle:{
                                    color: '#00C8FF'
                                },
                                label:{
                                    show: true,
                                    position: 'right',
                                    textStyle:{
                                        color: '#00C8FF'
                                    }
                                },
                                markLine:{
                                    symbol: 'none',

                                    data:[
                                        {
                                            name: 'a',
                                            xAxis: rainAvg,
                                            lineStyle:{
                                                type: 'dashed',
                                                width: 1,
                                                curveness: 1,
                                                color: '#00FFFF'
                                            },
                                            label:{
                                                color: '#00FFFF',
                                                position: 'start',
                                                formatter: function(){
                                                    return '历史平均降水\n'+rainAvg+'mm'
                                                }
                                            },
                                        },
                                        {
                                            name: 'b',
                                            yAxis: timeArr[11],
                                            lineStyle:{
                                                type: 'solid',
                                                width: 30,
                                                curveness: 1,
                                                color: 'rgba(8, 36, 102, 0.4)'
                                            },
                                            label:{
                                                formatter: function(){
                                                    return ''
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    };
                }
            }
        })
		return option;
	}


    $('.btn1').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc')
    })
    $('.btn2').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc')
    })
	$('.menuBox').find('li').on('click',function(){
		$(this).addClass('liAc').siblings().removeClass('liAc')
	})
	$('.menuBox2').find('.menu2Item').on('click',function(){
		$(this).addClass('menu2ItemAc').siblings().removeClass('menu2ItemAc')
		$('.pageDetailItem').eq($(this).index()).show().siblings().hide()
		if($(this).index() == 1){
			aniEchart('xunEchart')
			aniEchart('dayDataQueryEchart')
			aniEchart('mapEchart')
			aniEchart('monthEchart')
			$('.selectBox1').find('span').show()
			$('.selectBox1').find('select').show()
		}else if($(this).index() == 2){
			aniEchart('runTemp')
			$('.selectBox1').find('span').hide()
			$('.selectBox1').find('select').hide()
		}
	})
})
