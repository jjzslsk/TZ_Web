let _windowWidth=()=>$(window).width()
// $(function() {
	/**
	 * 柱状图(简)
	 * @param elementid
	 * @param titile
	 * @param dataX
	 * @param dataY
	 */
	function zzt_echarts(elementid,titile,dataX,dataY) {
		if(isPage){
			// var color1 = '#019BFF'
			var color1 = 'rgb(242,135,3)'
			// var color2 = 'rgba(33,152,255,1)'
			// var color3 = 'rgba(33,152,255,0.1)'
			var color2 = 'rgb(242,135,3)'
			var color3 = 'rgb(242,135,3)'
		}else{
			var color1 = '#08E0A1'
			var color2 = 'rgba(8,224,161,1)'
			var color3 = 'rgba(8,224,161,0.1)'
		}
	    var mycharts = echarts.init(document.getElementById(elementid));
	    option = {
			title: {
				text:titile ,
				textStyle: {
					color:'#ffffff',
					fontSize: _windowWidth() <= '1024'? "15":"20"
				},
				left: 'center',
				top: '15'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					color:'#FFFFF',
					data: dataX,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						lineStyle:{
							color: color1
						}
					},
					axisLabel:{
						color: '#ffffff',
						formatter:function(params) {
							var newParamsName = "";
							var paramsNameNumber = params.length;
							var provideNumber = 1;  //一行显示几个字
							var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
							if (paramsNameNumber > provideNumber) {
								for (var p = 0; p < rowNumber; p++) {
									var tempStr = "";
									var start = p * provideNumber;
									var end = start + provideNumber;
									if (p == rowNumber - 1) {
										tempStr = params.substring(start, paramsNameNumber);
									} else {
										tempStr = params.substring(start, end) + "\n";
									}
									newParamsName += tempStr;
								}

							} else {
								newParamsName = params;
							}
							return newParamsName
						}
					}
				}
			],
			yAxis: [
				{
					show: false,
					type: 'value'
				}
			],
			series: [
				{
					name: '站点数',
					type: 'bar',
					barWidth: '20%',
					label: {
						formatter: "{c}",
						show: true,
						position: "top",
						textStyle: {
							fontSize: "12",
							color: color1
						}
					},
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1,
								[
									{ offset: 0, color: color2 },                   //柱图渐变色
									{ offset: 1, color: color3 },                   //柱图渐变色
								]
							)
						}
					},
					data: dataY,//[10, 52, 200, 334, 390, 330, 220]
				}
			]
		};
	    mycharts.setOption(option);
	}
	
	/**
	 * 饼状图(环形)
	 */
	function bzt_echarts(elementid,title,sdata,title1,title2){
		if(isPage){
			if(title == '短时强降雨'){
				var color1 = [ '#019BFF','#000000']
			}else if(title == '小雨'){
				var color1 = [ '#14ffc5','#000000']
			}else if(title == '中雨'){
				var color1 = [ '#5aff13','#000000']
			}else if(title == '大雨'){
				var color1 = [ '#ff8b17','#000000']
			}else if(title == '暴雨'){
				var color1 = [ '#ff5429','#000000']
			}
		}else{
			var color1 = [ '#08E0A1','rgba(8,224,161,0.4)']
		}
	    var mycharts = echarts.init(document.getElementById(elementid));
	    option = {
	        tooltip: {
	            trigger: 'item',
	            formatter: '{a} <br/>{b}: {c} ({d}%)'
	        },
	        color : color1,
	        title:[{
	            text:title,
	            left:"center",
	            top:"82%",
	            textStyle:{
	                color:"#FFFFFF",
	                fontSize:_windowWidth() <= '1024' ? "10":"18",
	                fontWeight:100,
	                align:"center"
	            }
	        },{
	            text:title1,
	            left:"center",
	            top:_windowWidth() <= '1024' ? "45%":"48%",
	            textStyle:{
	                color:"#FFFFFF",
	                fontSize:_windowWidth() <= '1024' ? "12":"16",
	                fontWeight:100,
	                align:"center"
	            }
	        },{
	            text:title2,
	            left:"center",
	            top:"32%",
	            textStyle:{
	                color:color1[0],
	                fontSize:_windowWidth() <= '1024' ? "10":"16",
	                fontWeight:300,
	                align:"center"
	            }
	        }],
	        /*graphic:{
	            type:"text",
	            left:"center",
	            top:"45%",
	            style:{
	                text:title2,
	                textAlign:"center",
	                fill:"#019BFF",
	                fontSize:16,
	                fontWeight:300
	            }
	        },*/
	        series: [
	            {
	                name: '数量',
	                type: 'pie',
	                radius: ['60%', '70%'],
	                label: {
	                    normal: {
	                        show: false,
	                        position: 'center'
	                    },
	                    avoidLabelOverlap: false,
	                    startAngle:90,
	                    /*label: {
	                        show: true,
	                        position: 'center'
	                    },
	                    emphasis: {
	                        label: {
	                            show: true,
	                            fontSize: '10',
	                            fontWeight: 'bold'
	                        }
	                    },
	                    labelLine: {
	                        show: false
	                    },*/
	                },
	                data: sdata/*[
	                    {value: 335, name: '直接访问'},
	                    {value: 310, name: '邮件营销'},
	                    {value: 234, name: '联盟广告'},
	                    {value: 135, name: '视频广告'},
	                    {value: 1548, name: '搜索引擎'}
	                ]*/
	                }
	        ]
	    };
	
	    mycharts.setOption(option);
	
	}
	
	
	function bzt_echarts2(elementid,title,sdata,title1,title2,color){
	    var mycharts = echarts.init(document.getElementById(elementid));
	    option = {
	        tooltip: {
	            trigger: 'item',
	            formatter: '{a} <br/>{b}: {c} ({d}%)'
	        },
	        color : color,
	        title:[{
	            text:title2,
	            left:"center",
	            top:"50%",
	            textStyle:{
	                color:"#FFFFFF",
	                fontSize:14,
	                fontWeight:50,
	                align:"center"
	            }
	        },{
	            text:title1,
	            left:"center",
	            top:"35%",
	            textStyle:{
	                color:color[0],
	                fontSize:16,
	                fontWeight:300,
	                align:"center"
	            }
	        }],
	
	        series: [
	            {
	                name: '数量',
	                type: 'pie',
	                radius: ['80%', '100%'],
	                label: {
	                    normal: {
	                        show: false,
	                        position: 'center'
	                    },
	                    avoidLabelOverlap: false,
	                    startAngle:90,
	                },
	                data: sdata/*[
	                    {value: 335, name: '直接访问'},
	                    {value: 310, name: '邮件营销'},
	                    {value: 234, name: '联盟广告'},
	                    {value: 135, name: '视频广告'},
	                    {value: 1548, name: '搜索引擎'}
	                ]*/
	            }
	        ]
	    };
	
	    mycharts.setOption(option);
	
	}
	
	function zxt_echarts(elementid,dataX,data_MaxTmp,data_MinTmp,data_Rain,data_Wind,data_WindFX,dayMinTmp,dayMaxTmp) {
	    var mycharts = echarts.init(document.getElementById(elementid));
		if(isPage){
			 var legendcolors = ['#FFCD04','#275DFE', '#019BFF','#B846FA']
		}else{
			 var legendcolors = ['#FEF73D','#3189FE', '#08E0A1','#B846FA']
		}
	   var winddata = echarts.util.map(data_Wind, function (item, index) {
			return {
				value: data_Wind[index],
				symbolRotate:data_WindFX[index]
			};
	   });
	    var option = {
	        title:{
	            text:'',
	            textStyle:{
	                color: '#fff',
	            }
	        },
	        color: legendcolors,
	        tooltip: {
	            formatter: '{b}时<br />' +
	                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff9a00;"></span>{a0}: {c0}<br />' +
	                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#16ceaf;"></span>{a1}: {c1}<br />' +
	                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ffff74;"></span>{a2}: {c2}<br />' +
	                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#16ceaf;"></span>{a3}: {c3}',
	            show:true,
	            trigger: 'axis',
	            axisPointer: {
	                type: 'cross',
	                crossStyle: {
	                    color: '#999'
	                },
	                label:{
	                    show:true,
	                    color:"#fff",
	                    backgroundColor:"black"
	                }
	            }
	
	        },
	        legend: {
	            data:['最高温','最低温','雨量','极大风'],
	            align: 'left',
	            textStyle:{
	                color: '#fff',
	            },
	            selectedMode:false,
	        },
	        grid: {
	            left: '5%',
	            right: '5%',
				bottom: '10%',
	            containLabel: true
	        },
	        xAxis: [
	            {
	                type: 'category',
	                //data: ['11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'],
	                //data:get24hourslist(dtStr.substring(8,10)),
	                data:dataX,
	                axisLine: {
	                    lineStyle: {
	                        color: '#019BFF',
	                        width: 1
	                    }
	                },
	                textStyle:{
	                    color: '#fff',
	                },
	                axisPointer: {
	                    type: 'shadow',
	                    axisLabel: {
	                        formatter: '{value}时'
	                    }
	                }
	            }
	        ],
	        yAxis: [
	            {
	                type: 'value',
					name: '',
					max:dayMaxTmp + 1,
					min:dayMinTmp - 1,
	                position: 'left',
	                axisLine: {
	                    lineStyle: {
	                        color: '#019BFF',
	                        width: 1
	                    }
	                },
	                axisLabel: {
	                    formatter: '{value}',
						textStyle:{
						    color: '#fff',
						},
	                },
	                splitLine:{
	                    show:false
	                }
	            },
	            {
	                type: 'value',
	                name: '',
	                position: 'right',
	                axisLine: {
	                    lineStyle: {
	                        color: '#019BFF',
	                        width: 1.5
	                    }
	                },
	                axisLabel: {
	                    formatter: '{value}',
						textStyle:{
						    color: '#fff',
						},
	                },
	                splitLine:{
	                    show:false
	                }
	            }
	        ],
	        series: [
	            {
	                name:'最高温',
					type:'line',
	                yAxisIndex: 0,
	                label: {
	                    show: true,
	                    position: 'top'
	                },
	                // data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
					data:data_MaxTmp,
					smooth: true
	            },
	            {
	                name:'最低温',
	                type:'line',
	                yAxisIndex: 0,
	                label: {
	                    show: true,
	                    position: 'top'
	                },
	                // data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
					data:data_MinTmp,
					smooth: true
	            },
	            {
	                name:'雨量',
	                type:'bar',
	                yAxisIndex: 1,
	                barWidth : 6,
	                label: {
	                    show: true,
	                    formatter:function(params){
	                        str =  params.data;
	                        if(str == 0){
	                            return "";
	                        }else{
	                            return str;
	                        }
	
	                    },
	                    position: 'top'
	
	                },
	                 // data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
					data:data_Rain,
					smooth: true
	            },
	            {
	                name:'极大风',
	                type:'line',
					yAxisIndex: 1,
	                 // data:[2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
	                data: winddata,
	                label: {
	                    show: true,
	                    position: 'insideBottom'
	                },
	                //symbol:'triangle',
	                symbol:"image://img/S.png",
					symbolSize:'25',
					smooth: true
	            }
	        ]
	    };
	    mycharts.setOption(option);
	}
	
	function liveEchartFn(nowData,maxData,minData,avgData,xData){
		var legendTxt = ''
		for(var i = 0; i < $('.liveType').find('li').length; i++){
			if($('.liveType').find('li').eq(i).attr('class') == 'liAc'){
				if(i == 0){
					legendTxt = '降水'
				}else if(i == 1){
					legendTxt = '平均气温'
				}else if(i == 2){
					legendTxt = '最高气温'
				}else if(i == 3){
					legendTxt = '最低气温'
				}
			}
		}
		var mycharts = echarts.init(document.getElementById('liveEchart'));
		var color = ['#ff6022', '#ffcd04', '#08e0a1', '#3189fe']
		option = {
			color: color,
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				right:"6%",
				left:"14%",
				bottom: '12%'
			},
			legend: {
				textStyle: {
					color: '#fff'
				},
				icon: 'rect',
				itemHeight :9,
				data: ['历史最大', '平均值', '历史最小','实时'+legendTxt+'趋势'],
			},
			xAxis: [{
				type: 'category',
				// data: ['10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31', '10 20 31'],
				data: xData,
				axisLabel: {
					show: true,
					color: '#fff',
					fontSize: 7
				},
				axisLine: {
					lineStyle:{
						color: '#fff'
					}
				}
			}],
			yAxis: [{
					type: 'value',
					name: '',
					nameTextStyle: {
						color: '#fff'
					},
					axisLine: {show:false},
					axisTick: {show:false},
					splitLine:{show:false},
					axisLabel: {
						formatter: '{value}',
						color: '#fff',
					}
				},
				{
					type: 'value',
					name: '',
					nameTextStyle: {
						color: '#fff'
					},
					axisLine: {show:false},
					axisTick: {show:false},
					axisLabel: {
						formatter: '{value}',
						color: '#fff',
					}
				}
			],
			series: [
				{
					name: '历史最大',
					type: 'line',
					yAxisIndex: 0,
					lineStyle: {
						color: color[0]
					},
					smooth: true,
					symbol: 'none',
					data: maxData
				},
				{
					name: '平均值',
					type: 'line',
					yAxisIndex: 0,
					lineStyle: {
						color: color[1]
					},
					smooth: true,
					symbol: 'none',
					data: avgData
				},
				{
					name: '历史最小',
					type: 'line',
					yAxisIndex: 0,
					lineStyle: {
						color: color[2]
					},
					smooth: true,
					symbol: 'none',
					data: minData
				},
				{
					name: '实时'+legendTxt+'趋势',
					type: 'line',
					yAxisIndex: 0,
					lineStyle: {
						color: color[3]
					},
					smooth: true,
					symbol: 'none',
					data: nowData
				}
			]
		};
		
		mycharts.setOption(option);
	}
	
	function mapEchart(stationData){
		var chinaMap
		$.ajax({
			url:'../../data/geojson/taizhou.json',
			type:'get',
			async: false,
			success: function(res){
				chinaMap = res
			}
		})
		var mycharts = echarts.init(document.getElementById('map'));
		/*var data = [
			{
				'name':"椒江区",
				'value': [121.531049, 28.47615],
			},{
				'name':"黄岩区",
				'value': [121.062138, 28.34488],
			},{
				'name':"路桥区",
				'value': [121.57292, 28.301799],
			},{
				'name':"三门县",
				'value': [121.56429, 28.918955],
			},{
				'name':"天台县",
				'value': [121.031227, 29.041126],
			},{
				'name':"仙居县",
				'value': [120.535074, 28.549213],
			},{
				'name':"温岭市",
				'value': [121.543611, 28.068781],
			},{
				'name':"临海市",
				'value': [121.131229, 28.645441],
			},{
				'name':"玉环市",
				'value': [121.332337, 27.82842],
			}
		]*/
		echarts.registerMap('chinaMap', chinaMap);
		echarts.registerMap('chinaMapOutline', chinaMap);
		option = {
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
		    series: [
		        {
		            map: 'chinaMapOutline',
		            silent: true,
					type: 'map',
					top: '8%',
		            zoom: 1.2,
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
		                    areaColor: 'rgba(0,255,255,.02)',
		                    borderColor: '#00ffff',
		                    borderWidth: 1.5,
		                    shadowColor: '#00ffff',
		                    shadowOffsetX: 0,
		                    shadowOffsetY: 4,
		                    shadowBlur: 10,
		                },
		                emphasis: {
		                    areaColor: 'transparent', //悬浮背景
		                    textStyle: {
		                        color: '#fff'
		                    }
		                }
		            }
		        },
		        {
		            map: 'chinaMap',
					type: 'map',
					top: '8%',
		            zoom: 1.2,
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
		            tooltip:{
		                show:false
		            },
		            roam: false,
		            itemStyle: {
		                normal: {
		                    areaColor:'#0f3963',
		                    borderColor: 'rgba(0,255,255,.1)',
		                    borderWidth: 1,
		                },
		                emphasis: {
		                    areaColor:'rgba(0,255,255,.1)',
		                    textStyle: {
		                        color: 'red'
		                    }
		                }
		            }
		        },
				{
					name: '散点',
					type: 'scatter',
					coordinateSystem: 'geo',
					data: stationData,
					symbol: 'rect',
					symbolSize: function(val) {
						return 5;
					},
					itemStyle: {
						normal: {
							color: '#3FEAFE'
						}
					},
					label: {
						show: true,
						position: 'top',
						formatter: '{b}',
						color: 'black',
						align: 'center',
						backgroundColor: 'rgba(255,255,255,.9)',
						width: 64,
						padding: 4
					},
                    /*markPoint:{
                        data: stationData,
                        dataType:1
                    }*/
				},
			]
		}
		mycharts.setOption(option);
	}
// })
