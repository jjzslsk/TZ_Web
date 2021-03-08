//配置的相关信息
const config = {
	//天地图的相关配置
	tdt: {
		tk: "026607b33d2b8c6a3ead80f3c8a1c786",
	},
	//地图相关配置
	map: {
		//投影坐标系
		projection: "EPSG:3857",
		//中心点坐标
		center: [121.0144,28.7066],
		//默认放大级别
		baseZoom: 10,
		//最大放大级别
		maxZoom: 16,
		//最小缩小级别
		minZoom: 4,
	},
	//extent信息
	extent: {
		//雷达图extent
		radarExtent: [73.0, 12.2, 135, 54.2],
		//卫星云图extent
		cloudExtent: [53.8, -10, 159.8, 60]
	},
	/**
	 * 雷达拼图坐标
	 */
	radarextent: [73.0, 12.2, 135,54.2],
	/**
	 * 数据投影
	 */
	dataProjection: 'EPSG:4326',
	/**
	 * 要素投影
	 */
	mapProjection: 'EPSG:3857',
	/**
	 * 卫星云图坐标
	 */
	sateextent: [90, 0, 140, 40],
	sateextent_3D: [53.8, -10, 159.8, 60],
	render:{
		'rain':[{"caption":"<0.001","color":["min",0,"#ffffff"],"value":0.001},{"caption":"0-1.5","color":[0,1.5,"#a8f48f"],"value":1.5},{"caption":"1.5-7","color":[1.5,7,"#3bb93a"],"value":7},{"caption":"7-15","color":[7,15,"#65bbff"],"value":15},{"caption":"15-40","color":[15,40,"#0100e6"],"value":40},{"caption":"40-50","color":[40,50,"#fa02fe"],"value":50},{"caption":"50-100","color":[50,100,"#800043"],"value":100},{"caption":">100","color":[100,"max","#800043"],"value":100}],
		"temp":[{"caption":"<-4","color":["min",-4,"#0120fa"],"value":-4},{"caption":"-4--2","color":[-4,-2,"#0450fe"],"value":-2},{"caption":"-2-0","color":[-2,0,"#0680fd"],"value":0},{"caption":"0-2","color":[0,2,"#01b0fe"],"value":2},{"caption":"2-4","color":[2,4,"#06dcfe"],"value":4},{"caption":"4-6","color":[4,6,"#04ffec"],"value":6},{"caption":"6-8","color":[6,8,"#07fcb9"],"value":8},{"caption":"6-8","color":[8,10,"#07fcb9"],"value":10},{"caption":"10-12","color":[10,12,"#05fe90"],"value":12},{"caption":"12-14","color":[12,14,"#04fe5d"],"value":14},{"caption":"14-16","color":[14,16,"#06fe2f"],"value":16},{"caption":"14-16","color":[16,18,"#06fe2f"],"value":18},{"caption":"18-20","color":[18,20,"#03fc02"],"value":20},{"caption":"20-22","color":[20,22,"#38ff00"],"value":22},{"caption":"22-24","color":[22,24,"#65ff02"],"value":24},{"caption":"24-26","color":[24,26,"#92fe02"],"value":26},{"caption":"26-28","color":[26,28,"#c3ff04"],"value":28},{"caption":"28-30","color":[28,30,"#efff02"],"value":30},{"caption":"30-32","color":[30,32,"#fedf03"],"value":32},{"caption":"32-34","color":[32,34,"#fbae03"],"value":34},{"caption":"34-36","color":[34,36,"#fb7e00"],"value":36},{"caption":"36-38","color":[36,38,"#fb4d02"],"value":38},{"caption":"38-40","color":[38,40,"#fa2501"],"value":40},{"caption":">40","color":[40,"max","#fa2501"],"value":40}],
		'windv':[{"caption":"<1","color":["min",1,"#024dfd"],"value":1},{"caption":"1-2","color":[1,2,"#0575ff"],"value":2},{"caption":"2-3","color":[2,3,"#06a7ff"],"value":3},{"caption":"3-4","color":[3,4,"#03cffe"],"value":4},{"caption":"4-5.5","color":[4,5.5,"#05ffb5"],"value":5.5},{"caption":"5.5-7","color":[5.5,7,"#86ff01"],"value":7},{"caption":"7-8.5","color":[7,8.5,"#d7ff02"],"value":8.5},{"caption":"8.5-10","color":[8.5,10,"#fdd200"],"value":10},{"caption":"10-12","color":[10,12,"#ffaf02"],"value":12},{"caption":"12-14","color":[12,14,"#fd9c01"],"value":14},{"caption":"14-16","color":[14,16,"#fa8301"],"value":16},{"caption":"16-18","color":[16,18,"#fe5301"],"value":18},{"caption":">18","color":[18,"max","#fe5301"],"value":18}],
	}
}
