$(function(){
	setEchart('xunEchart',option1Fn())
	setEchart('dayDataQueryEchart',option2Fn())
	setEchart('mapEchart',option3Fn())
	setEchart('monthEchart',option4Fn())

    $("#tftq").click(function(){
        //点击跳转突发天气
        window.location.href="/static/html/suddenWeather/index.html";

    });

    $("#ycsj").click(function(){
        //异常事件
        window.location.href="/static/html/suddenWeather/index.html";


    });
	
	function setEchart(dom, option) {
		var myChart = echarts.init(document.getElementById(dom));
		myChart.setOption(option, true);
	}
	
	function addImage(url, params, api, realData){
	    return  {
	        type: 'image',
	        style: {
	            image: url,
	            x: api.coord([
	                realData[params.dataIndex].lng, realData[params.dataIndex]
	                    .lat
	            ])[0],
	            y: api.coord([
	                realData[params.dataIndex].lng, realData[params.dataIndex].lat
	            ])[1],
	            width: 20,
	            height: 19,
	        }
	    }
	}
	
	function option1Fn(){
		var option = {
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
				data: ['10月上旬', '10月中旬', '10月下旬', '11月上旬', '11月中旬', '11月下旬', '12月上旬', '12月中旬', '12月下旬', '1月上旬', '1月中旬', '1月下旬'],
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
				data: ['10月上旬', '10月中旬', '10月下旬', '11月上旬', '11月中旬', '11月下旬', '12月上旬', '12月中旬', '12月下旬', '1月上旬', '1月中旬', '1月下旬'],
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
				data: [-5.1, -5, -5, -5.6, -3, 0, -4, -3, -2, -1, -3, 0.7],
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
						position: 'start',
						formatter: function(){
							return '历史最低温\n-5.3℃'
						}
					},
					data:[
						{name: 'a',xAxis: -5.3}
					],
				}
			},{
				color: '#9FD046',
				data: [11.6, 10.6, 12.9, 10.6, 10.6, 10.3, 11.3, 11.3, 11.3, 10.3, 10.8, 11.3],
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
							return '历史平均温\n12.6℃'
						}
					},
					data:[
						{name: 'a',xAxis: 12.6}
					],
				}
			},{
				color: '#FFB400',
				data: [16.6, 16.6, 16.9, 15.6, 19.6, 18.3, 19.3, 18.3, 19.3, 19.3, 18.8, 20.7],
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
							return '历史最高温\n20℃'
						}
					},
					data:[
						{name: 'a',xAxis: 20}
					],
				}
			}]
		};
		return option;
	}
	
	function option2Fn(){
		var maxTemp = [15, 16, 15, 13, 14, 15, 12, 15, 16, 15, 13, 14, 15, 12], maxTempNum = Math.max(...maxTemp),
			minTemp = [-1, -2, 2, -2, 0, 2, 3, -1, -2, 2, -2, 0, 2, 3], minTempNum = Math.min(...minTemp),
			storyMax = 20.8, storyMin = -5.3,
			weatherIcon = [], runData = [0.1, 0.2, 0.2, 0.2, 0, 0.2, 0.3, 0.1, 0.2, 0.2, 0.2, 0, 0.2, 0.3];
		if(maxTempNum > storyMax){
			storyMax = maxTempNum
		}
		if(minTempNum < storyMin){
			storyMin = minTempNum
		}
		for(var i = 0; i < maxTemp.length; i++){
			weatherIcon.push(storyMax+10)
		}
		var yMax = Math.max(...runData) * 5;
		var option = {
			grid: {
				top: '15%',
				bottom: '15%',
				left: '5%',
				right: '10%'
			},
		    xAxis: [{
		        type: 'category',
		        data: ['15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日'],
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
							return '历史最高温\n20.8℃'
						}
					},
					data:[
						{name: 'aaa',yAxis: 20.8}
					],
				}
		    },{
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
							return '历史最低温\n5.3℃'
						}
					},
					data:[
						{name: 'aaa',yAxis: 5.3}
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
							return '历史平均降水\n2.2mm'
						}
					},
					data:[
						{name: 'aaa',yAxis: 0.2}
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
		var option = {
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
		        data: ['2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '2021年1月'],
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
		        data: ['2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '2021年1月'],
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
		            data: [7, 9, 4, 0, 7, 6, 5, 4, 0, 4, 6, 5],
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
								return '历史平均降水\n5.3mm'
							}
						},
						data:[
							{name: 'a',xAxis: 5.3}
						],
					}
		        }
		    ]
		};
		return option;
	}
	
	$('.menuBox').find('li').on('click',function(){
		$(this).addClass('liAc').siblings().removeClass('liAc')
	})
	$('.btn1').find('span').on('click',function(){
		$(this).addClass('spanAc').siblings().removeClass('spanAc')
	})
	$('.btn2').find('span').on('click',function(){
		$(this).addClass('spanAc').siblings().removeClass('spanAc')
	})
	$('.menuBox2').find('.menu2Item').on('click',function(){
		$(this).addClass('menu2ItemAc').siblings().removeClass('menu2ItemAc')
	})
})
