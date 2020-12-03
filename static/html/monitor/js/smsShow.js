layui.use(['element', 'form', 'layer', 'laydate'], function() {
	var element = layui.element;
	layer = layui.layer;
	laydate = layui.laydate;
	
	
	//执行一个laydate实例
	laydate.render({
		elem: '#dataTime',
		range: '至' //或 range: '~' 来自定义分割字符
	});
	
	//执行一个laydate实例
	laydate.render({
		elem: '#monthTime',
		type: 'month',
		range: '至' //或 range: '~' 来自定义分割字符
	});
	
	//执行一个laydate实例
	laydate.render({
		elem: '#monthTime',
		range: '至' //或 range: '~' 来自定义分割字符
	});
	
	
	$(document).on('click', '.site-demo-active', function() {
		var dataId = $(this).attr("lay-id");
		
		if(dataId == 'daySms'){
			
		}else if(dataId == 'monthSms'){
			
		}else if(dataId == 'operators'){
			
		}else{
			//如果为空则清空所有数据
			$(".layui-tab-content").empty();
		}
		
		
	})


	// echarts 图形
	var myChart = echarts.init(document.getElementById('tuxing'));

	$(function() {
		$("#zhuzhuang").click();
	})

	$(document).on('click', '#bingzhuang', function() {
		option = {
			title: {
				text: '日挂机短信发布量统计图',
				left: 'center',
				subtext: '2020年03月01日到2020年03月24日 共20890条',
				textStyle: {
					fontSize: 18
				},
				subtextStyle: {
					fontSize: 12
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				orient: 'vertical',
				bottom: 'bottom',
				data: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日']
			},
			series: [{
				name: '计数量',
				type: 'pie',
				radius: '60%',
				center: ['50%', '50%'],
				data: [{
						value: 335,
						name: '1日'
					},
					{
						value: 310,
						name: '2日'
					},
					{
						value: 234,
						name: '3日'
					},
					{
						value: 135,
						name: '4日'
					},
					{
						value: 1548,
						name: '5日'
					},
					{
						value: 135,
						name: '6日'
					},
					{
						value: 1548,
						name: '7日'
					}
				],
				// 鼠标悬停高亮配置
				emphasis: {
					itemStyle: {
						shadowBlur: 30,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		myChart.clear();
		myChart.setOption(option);
	})

	$(document).on('click', '#zhexian', function() {
		option = {
			title: {
				text: '日挂机短信发布量统计图',
				left: 'center',
				subtext: '2020年03月01日到2020年03月24日 共20890条',
				textStyle: {
					fontSize: 18
				},
				subtextStyle: {
					fontSize: 12
				}
			},
			xAxis: {
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line',
				color: "#409EFF",
				itemStyle: {
					normal: {
						label: {
							show: true,
							position: 'top'
						}
					}
				}
			}]
		};
		myChart.clear();
		myChart.setOption(option);

	})

	$(document).on('click', '#zhuzhuang', function() {
		option = {
			title: {
				text: '日挂机短信发布量统计图',
				left: 'center',
				subtext: '2020年03月01日到2020年03月24日 共20890条',
				textStyle: {
					fontSize: 18
				},
				subtextStyle: {
					fontSize: 12
				}
			},
			xAxis: {
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			},
			yAxis: {
				type: 'value',
				name: "计费量(次)",
				nameLocation: "center",
				nameTextStyle: {
					padding: [0, 0, 40, 0],
					fontSize: 18
				}
			},
			series: [{
				data: [120, 200, 150, 80, 70, 110, 130],
				type: 'bar',
				color: "#409EFF",
				itemStyle: {
					normal: {
						label: {
							show: true,
							position: 'top'
						}
					}
				}
			}]
		};
		myChart.clear();
		myChart.setOption(option);
	})

	$(document).on('click', '#biaoge', function() {
		$("#tuxing").empty();
		var tableHtml = '<table border="1">';
		tableHtml += '<tr><td>111</td><td>2222</td><td>3333</td></tr>'
		tableHtml += '<tr><td>aaa</td><td>bbbb</td><td>cccc</td></tr>'
		tableHtml += '</table>'
		
		$("#tuxing").html(tableHtml);
	})

})
