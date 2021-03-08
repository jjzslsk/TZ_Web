var apibaseUrl='http://223.4.68.6:8011';//'http://223.4.68.6:8011';//api项目ip与端口号
//var apibaseUrl='http://192.168.9.88:8080';//api项目ip与端口号
var otherbaseUrl='http://192.168.0.127:9527';//除api以外的其他项目的ip与端口号
//var otherbaseUrl='http://59.202.50.2:8088';//除api以外的其他项目的ip与端口号
//配置的相关信息
const config = {
	//天地图的相关配置
	tdt: {
		tk: "026607b33d2b8c6a3ead80f3c8a1c786",
	},
	base:{
		baseUrl:otherbaseUrl
	},
	//地图相关配置
	map: {
		//投影坐标系
		projection: "EPSG:3857",
		//中心点坐标
		center: [120.081, 29.1686],
		//默认放大级别
		baseZoom: 7,
		//最大放大级别
		maxZoom: 16,
		//最小缩小级别
		minZoom: 4,
		geoserverUrl: otherbaseUrl+'/geoserver/wms',
	},
	//extent信息
	extent: {
		//雷达图extent
		radarExtent: [73.0, 12.2, 135, 54.2],
		//卫星云图extent
		cloudExtent: [53.8, -10, 159.8, 60]
	},
	//api接口相关配置
	api: {
		baseDataParam: {
			userCode: 'zjemsweb',
			//password:'123',
			password: "S30keOI/lgbtfsZruP0WZr/MZt2/QMTDM4gtLcZDbp+e+vOMfO0gdH5xnFl/VAV3G+hKAJ2bGAa/br+2V4a3htcAXA7lTsLtcaoJY7IZJEJ+duip/ZaH9YqSk5djKCw6ctUv3oic/MZHdZKxFvPnZCZkhFWwXQjQp+MLmVNvSyo=",
			token: '1212232323',
			identifier: 'iden11323232',
			dataformat: 'JSON',
		},
		//api接口统一访问地址
		baseUrl:apibaseUrl+"/api/share",
	},
	login:{
		/**
		 * 登录接口
		 */
		loginRSA: apibaseUrl+"/api/tokens/getRSA",//api
		/**
		 * 登录接口
		 */
		loginUrl: otherbaseUrl+"/ems/login/loginByInter",//ems
		/**
		 * 用户退出接口
		 */
		logoutUrl: apibaseUrl+"/api/tokens/logout"
	},
	radarcloud: {
		/*radarUrl: apibaseUrl+'/api/forward/forward?forwardurl='+otherbaseUrl+"/collection/queryFile/getLdFile.do",
		cloudUrl: apibaseUrl+'/api/forward/forward?forwardurl='+otherbaseUrl+"/collection/queryFile/getYtFile.do"*/
		radarUrl: otherbaseUrl+"/collection/queryFile/getLdFile.do",
		cloudUrl: otherbaseUrl+"/collection/queryFile/getYtFile.do"
	},
	/**
	 * 雷达拼图坐标
	 */
	radarextent: [73.0, 12.2, 135,54.2],
	/**
	 * 实况图坐标 weather_10min
	 **/
	weatherextent:[116, 25.43, 124, 32.42],
	/**
	 * 实况图坐标 其他
	 **/
	otherweatherextent:[117.585572, 26.266101, 123.970447, 31.280891],
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
	data: {
		industryUrl: "data/industry.json"
	},
	dataType:"json",
	dataLayerInfos: {
		M0001: {
			layerId: "biInfoLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/middlestreambasin.png",
			popFun:getDataInfo,
			name:"BasinName",
			selectWord:""
		},
		M0002: {
			layerId: "mfrInfoLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/mountaintorrentditch.png",
			popFun:getDataInfo,
			name:"MFRName",
			selectWord:""
		},
		M0003: {
			layerId: "geologicHazardLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/geologicHazard.png",
			popFun:getDataInfo,
			name:"GeoName",
			selectWord:""
		},
		M0004: {
			layerId: "waterBlackSpotLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/waterBlackSpot.png",
			popFun:getDataInfo,
			name:"VulnerFloodName",
			selectWord:""
		},
		M0005: {
			layerId: "forestFireDangerSpotLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/forestFireDangerSpot.png",
			popFun:getDataInfo,
			name:"AccAddress",
			selectWord:""
		},
		M0006: {
			layerId: "hiddenTroubleInConstructionLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/hiddenTroubleInConstruction.png",
			popFun:getDataInfo,
			name:"ProjectengineeringName",
			selectWord:""
		},
		M0007: {
			layerId: "populationLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/populationAndSocialEconomy.png",
			popFun:getDataInfo,
			name:"AreaName"
		},
		M0008: {
			layerId: "touristSpotLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/touristSpot.png",
			popFun:getDataInfo,
			name:"TourName"
		},
		M0009: {
			layerId: "hospitalLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/hospital.png",
			popFun:getDataInfo,
			name:"HospitalName"
		},
		M0010: {
			layerId: "schoolLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/school.png",
			popFun:getDataInfo,
			name:"SchoolName"
		},
		M0011: {
			layerId: "reservoirLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/reservoir.png",
			popFun:getDataInfo,
			name:"ReservoirName"
		},
		M0014: {
			layerId: "feInfoLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/explosiveplace.png",
			popFun:getDataInfo,
			name:"FlaExpPlaceName"
		},
		M0015: {
			layerId: "meteorologicalLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/meteorologicalServiceStation.png",
			popFun:getDataInfo,
			name:"InfoName"
		},
		M0016: {
			layerId: "dangerPointLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/dangerPoint.png",
			popFun:getDataInfo,
			name:"ProjectEngineeringName"
		},
		M0017: {
			layerId: "rescueForceLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/rescueForce.png",
			popFun:getDataInfo,
			name:"Name",
			selectWord:""
		},
		M0018: {
			layerId: "expertLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/emergencyRescueExpert.png",
			popFun:getDataInfo,
			name:"Name",
			selectWord:""
		},
		M0019: {
			layerId: "meterialLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/emergencyReliefMaterials.png",
			popFun:getDataInfo,
			name:"MaterialName",
			selectWord:""
		},
		M0020: {
			layerId: "dsinfoLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/other16-01.png",
			popFun:getDataInfo,
			name:"ClientID",
			selectWord:""
		},
		M0025: {
			layerId: "gridPerInfoLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/gridmanager.png",
			popFun:getDataInfo,
			name:"PerName",
			selectWord:""
		},
		M0024:{
			layerId: "RPINFOLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/weatherdisaster.png",
			popFun:getDataInfo,
			name:"PerName",
			selectWord:""
		},
		M0026:{
			layerId: "MIINFOLayer",
			styleFun: dataStyle,
			icon: "images/featureImage/weathermessenger.png",
			popFun:getDataInfo,
			name:"PerName",
			selectWord:""
		},
		basedata:{
			selectWord:""
		}

	},
	loadMsgType:otherbaseUrl+'/publish/joint/queryMsgType',
	initImpNoticeType:otherbaseUrl+'/publish/joint/queryImpNoticeType',
	loadChannelType:otherbaseUrl+'/publish/channel/channelInfo',
	getTempRender:otherbaseUrl+"/bas/common/colorInfo",
	getAreaTree:otherbaseUrl+"/bas/common/queryAreaTree",
	isosureface:otherbaseUrl+"/ssdgis/contourPoygon",
	geoServerFenXi:otherbaseUrl+"/geoServer",
	render:{
		'temp':[{"color":["min",14,"rgba(0,0,255,0.7)"],"caption":"","value":14},{"color":[14,15,"rgba(0,0,255,0.7)"],"caption":"14-15","value":15},{"color":[15,16,"rgba(31,31,255,0.7)"],"caption":"15-16","value":16},{"color":[16,17,"rgba(62,62,255,0.7)"],"caption":"16-17","value":17},{"color":[17,18,"rgba(93,93,255,0.7)"],"caption":"17-18","value":18},{"color":[18,19,"rgba(124,124,255,0.7)"],"caption":"18-19","value":19},{"color":[19,20,"rgba(155,155,255,0.7)"],"caption":"19-20","value":20},{"color":[20,21,"rgba(186,186,255,0.7)"],"caption":"20-21","value":21},{"color":[21,22,"rgba(217,217,255,0.7)"],"caption":"21-22","value":22},{"color":[22,23,"rgba(255,255,0,0.7)"],"caption":"22-23","value":23},{"color":[23,24,"rgba(255,224,0,0.7)"],"caption":"23-24","value":24},{"color":[24,25,"rgba(255,196,0,0.7)"],"caption":"24-25","value":25},{"color":[25,26,"rgba(255,168,0,0.7)"],"caption":"25-26","value":26},{"color":[26,27,"rgba(255,140,0,0.7)"],"caption":"26-27","value":27},{"color":[27,28,"rgba(255,112,0,0.7)"],"caption":"27-28","value":28},{"color":[28,29,"rgba(255,84,0,0.7)"],"caption":"28-29","value":29},{"color":[29,30,"rgba(255,56,0,0.7)"],"caption":"29-30","value":30},{"color":[30,31,"rgba(255,28,0,0.7)"],"caption":"30-31","value":31},{"color":[31,"max","rgba(255,0,0,0.7)"],"caption":"","value":31}],
		'rain':[{"caption":"0","color":["min",0.1,"rgba(255,255,255,0)"],"value":0},{"caption":"0-2","color":[0.1,2,"rgb(155,255,253)"],"value":0.1},{"caption":"2-5","color":[2,5,"rgb(0,205,252)"],"value":2},{"caption":"5-10","color":[5,10,"rgb(0,153,255)"],"value":5},{"caption":"10-15","color":[10,15,"rgb(0,103,255)"],"value":10},{"caption":"15-20","color":[15,20,"rgb(47,154,0)"],"value":15},{"caption":"20-25","color":[20,25,"rgb(38,255,0)"],"value":20},{"caption":"25-30","color":[25,30,"rgb(255,253,0)"],"value":25},{"caption":"30-40","color":[30,40,"rgb(255,203,3)"],"value":30},{"caption":"40-50","color":[40,50,"rgb(255,154,0)"],"value":40},{"caption":"50-60","color":[50,60,"rgb(255,0,0)"],"value":50},{"caption":"60-70","color":[60,70,"rgb(198,2,4)"],"value":60},{"caption":"70-80","color":[70,80,"rgb(157,0,0)"],"value":70},{"caption":"80-90","color":[80,90,"rgb(160,0,160)"],"value":80},{"caption":"90-100","color":[90,100,"rgb(213,0,217)"],"value":90},{"caption":">=100","color":[100,"max","rgb(239,0,255)"],"value":100}],
		'relhum':[{"caption":"<0.01","color":["min",0,"rgba(213,6,55)"],"value":0},{"caption":"0.01~10","color":[0.01,10,"rgba(231,0,0)"],"value":10},{"caption":"10~20","color":[10,20,"rgba(252,38,3)"],"value":20},{"caption":"20~30","color":[20,30,"rgba(247,79,20)"],"value":30},{"caption":"30~40","color":[30,40,"rgba(249,250,213)"],"value":40},{"caption":"40~50","color":[40,50,"rgba(238,253,202)"],"value":50},{"caption":"50~60","color":[50,60,"rgba(67,73,201)"],"value":60},{"caption":"60~70","color":[60,70,"rgba(84,64,182)"],"value":70},{"caption":"70~80","color":[70,80,"rgba(70,33,146)"],"value":80},{"caption":"80~90","color":[80,90,"rgba(51,13,128)"],"value":90},{"caption":">90","color":[90,"max","rgba(51,13,128)"],"value":90}],
		'windv':[{"caption":"<1","color":["min",1,"#024dfd"],"value":1},{"caption":"1~2","color":[1,2,"#0575ff"],"value":2},{"caption":"2~3","color":[2,3,"#06a7ff"],"value":3},{"caption":"3~4","color":[3,4,"#03cffe"],"value":4},{"caption":"4~5.5","color":[4,5.5,"#05ffb5"],"value":5.5},{"caption":"5.5~7","color":[5.5,7,"#86ff01"],"value":7},{"caption":"7~8.5","color":[7,8.5,"#d7ff02"],"value":8.5},{"caption":"8.5~10","color":[8.5,10,"#fdd200"],"value":10},{"caption":"10~12","color":[10,12,"#ffaf02"],"value":12},{"caption":"12~14","color":[12,14,"#fd9c01"],"value":14},{"caption":"14~16","color":[14,16,"#fa8301"],"value":16},{"caption":"16~18","color":[16,18,"#fe5301"],"value":18},{"caption":">18","color":[18,"max","#fe5301"],"value":18}],
		'visib':[{"caption":"0~0.05","color":[0,50,"rgba(249,10,13)"],"value":50},{"caption":"0.05~0.1","color":[50,100,"rgba(240,55,1)"],"value":100},{"caption":"0.1~0.2","color":[100,200,"rgba(253,86,7)"],"value":200},{"caption":"0.2~0.25","color":[200,250,"rgba(253,122,16)"],"value":250},{"caption":"0.25~0.5","color":[250,500,"rgba(251,160,7)"],"value":500},{"caption":"0.5~0.8","color":[500,800,"rgba(251,193,0)"],"value":800},{"caption":"0.8~1","color":[800,1000,"rgba(248,233,8)"],"value":1000},{"caption":"1~1.2","color":[1000,1200,"rgba(201,253,3)"],"value":1200},{"caption":"1.2~1.5","color":[1200,1500,"rgba(196,255,5)"],"value":1500},{"caption":"1.5~2","color":[1500,2000,"rgba(160,254,8)"],"value":2000},{"caption":"2~4","color":[2000,4000,"rgba(137,251,8)"],"value":4000},{"caption":"4~6","color":[4000,6000,"rgba(97,252,11)"],"value":6000},{"caption":"6~8","color":[6000,8000,"rgba(56,251,0)"],"value":8000},{"caption":"8~10","color":[8000,10000,"rgba(19,250,10)"],"value":10000},{"caption":"10~12","color":[10000,12000,"rgba(8,249,22)"],"value":12000},{"caption":"12~15","color":[12000,15000,"rgba(6,253,60)"],"value":15000},{"caption":"15~90","color":[15000,90000,"rgba(6,253,60)"],"value":90000}],
		'dzzh':[{"caption":"4","color":["equal",4,"rgba(36,58,253,0.65)"],"value":4},{"caption":"3","color":["equal",3,"rgba(253,232,15,0.65)"],"value":3},{"caption":"2","color":["equal",2,"rgba(240,187,50,0.65)"],"value":2},{"caption":"1","color":["equal",1,"rgba(249,10,13,0.65)"],"value":1}],
		'forcastVi':[{"caption":"<50","color":["min",50,"rgb(249,10,13)"],"value":0},{"caption":"50","color":[50,100,"rgb(249,10,13)"],"value":50},{"caption":"100","color":[100,200,"rgb(240,55,1)"],"value":100},{"caption":"200","color":[200,250,"rgb(253,86,7)"],"value":200},{"caption":"250","color":[250,500,"rgb(253,122,16)"],"value":250},{"caption":"500","color":[500,800,"rgb(251,160,7)"],"value":500},{"caption":"800","color":[800,1000,"rgb(251,193,0)"],"value":800},{"caption":"1000","color":[1000,1200,"rgb(248,233,8)"],"value":1000},{"caption":"1200","color":[1200,1500,"rgb(201,253,3)"],"value":1200},{"caption":"1500","color":[1500,2000,"rgb(196,255,5)"],"value":1500},{"caption":"2000","color":[2000,4000,"rgb(160,254,8)"],"value":2000},{"caption":"4000","color":[4000,6000,"rgb(137,251,8)"],"value":4000},{"caption":"6000","color":[6000,8000,"rgb(97,252,11)"],"value":6000},{"caption":"8000","color":[8000,10000,"rgb(56,251,0)"],"value":8000},{"caption":"10000","color":[10000,12000,"rgb(19,250,10)"],"value":10000},{"caption":"12000","color":[12000,15000,"rgb(8,249,22)"],"value":12000},{"caption":"15000","color":[15000,90000,"rgb(6,253,60)"],"value":15000},{"caption":"≥90000","color":[90000,"max","rgb(6,253,60)"],"value":90000}],
		'forcastRain':[{"caption":"0","color":["min",0.1,"rgba(255,255,255,0)"],"value":0},{"caption":"0-2","color":[0.1,2,"rgb(155,255,253)"],"value":0.1},{"caption":"2-5","color":[2,5,"rgb(0,205,252)"],"value":2},{"caption":"5-10","color":[5,10,"rgb(0,153,255)"],"value":5},{"caption":"10-15","color":[10,15,"rgb(0,103,255)"],"value":10},{"caption":"15-20","color":[15,20,"rgb(47,154,0)"],"value":15},{"caption":"20-25","color":[20,25,"rgb(38,255,0)"],"value":20},{"caption":"25-30","color":[25,30,"rgb(255,253,0)"],"value":25},{"caption":"30-40","color":[30,40,"rgb(255,203,3)"],"value":30},{"caption":"40-50","color":[40,50,"rgb(255,154,0)"],"value":40},{"caption":"50-60","color":[50,60,"rgb(255,0,0)"],"value":50},{"caption":"60-70","color":[60,70,"rgb(198,2,4)"],"value":60},{"caption":"70-80","color":[70,80,"rgb(157,0,0)"],"value":70},{"caption":"80-90","color":[80,90,"rgb(160,0,160)"],"value":80},{"caption":"90-100","color":[90,100,"rgb(213,0,217)"],"value":90},{"caption":">=100","color":[100,"max","rgb(239,0,255)"],"value":100}],
		'forcastWeather':[{"color":["min",0,"rgba(255,255,255,0)"],"caption":"未知","value":-999},{"color":[0,1,"rgba(255,255,255,0)"],"caption":"晴","value":0},{"color":[1,2,"rgba(210,210,210,1)"],"caption":"多云","value":1},{"color":[2,3,"rgba(150,150,150,1)"],"caption":"阴天","value":2},{"color":[3,4,"rgba(206,249,193,1)"],"caption":"阵雨","value":3},{"color":[4,5,"rgba(187,247,170,1)"],"caption":"雷阵雨","value":4},{"color":[5,6,"rgba(129,0,24,1)"],"caption":"雷阵雨并伴有冰雹","value":5},{"color":[6,7,"rgba(255,147,159,1)"],"caption":"雨夹雪","value":6},{"color":[7,8,"rgba(166,242,143,1)"],"caption":"小雨","value":7},{"color":[8,9,"rgba(61,186,61,1)"],"caption":"中雨","value":8},{"color":[9,10,"rgba(97,184,255,1)"],"caption":"大雨","value":9},{"color":[10,11,"rgba(243,5,238,1)"],"caption":"暴雨","value":10},{"color":[11,12,"rgba(170,45,45,1)"],"caption":"大暴雨","value":11},{"color":[12,13,"rgba(170,45,45,1)"],"caption":"特大暴雨","value":12},{"color":[13,14,"rgba(140,71,224,1)"],"caption":"阵雪","value":13},{"color":[14,15,"rgba(140,71,224,1)"],"caption":"小雪","value":14},{"color":[15,16,"rgba(87,28,159,1)"],"caption":"中雪","value":15},{"color":[16,17,"rgba(0,0,0,1)"],"caption":"大雪","value":16},{"color":[17,18,"rgba(0,0,0,1)"],"caption":"暴雪","value":17},{"color":[18,19,"rgba(255,128,64,1)"],"caption":"雾","value":18},{"color":[19,20,"rgba(0,0,190,1)"],"caption":"冻雨","value":19},{"color":[20,21,"rgba(218,154,48,1)"],"caption":"沙尘暴","value":20},{"color":[21,22,"rgba(166,242,143,1)"],"caption":"小雨到中雨","value":21},{"color":[22,23,"rgba(61,186,61,1)"],"caption":"中雨到大雨","value":22},{"color":[23,24,"rgba(97,184,255,1)"],"caption":"大雨到暴雨","value":23},{"color":[24,26,"rgba(170,45,45,1)"],"caption":"暴雨到特大暴雨","value":24},{"color":[26,28,"rgba(140,71,224,1)"],"caption":"小雪到中雪","value":26},{"color":[28,29,"rgba(0,0,0,1)"],"caption":"大雪到暴雪","value":28},{"color":[29,31,"rgba(245,215,117,1)"],"caption":"浮尘或扬沙","value":29},{"color":[31,53,"rgba(158,98,38,1)"],"caption":"强沙尘暴","value":31},{"color":[53,54,"rgba(128,64,0,1)"],"caption":"霾","value":53},{"color":[54,"max","rgba(255,255,255,1)"],"caption":"未知","value":999}],
		'forcastRh':[{"color":["min",0,"rgba(213,6,55,0.5)"],"caption":"0","value":0},{"color":[0,10,"rgba(213,0,0,0.5)"],"caption":"10","value":10},{"color":[10,20,"rgba(252,38,3,0.5)"],"caption":"20","value":20},{"color":[20,30,"rgba(247,79,20,0.5)"],"caption":"30","value":30},{"color":[30,40,"rgba(249,250,213,0.5)"],"caption":"40","value":40},{"color":[40,50,"rgba(84,64,182,0.5)"],"caption":"50","value":50},{"color":[50,60,"rgba(67,73,201,0.5)"],"caption":"60","value":60},{"color":[60,70,"rgba(84,64,182,0.5)"],"caption":"70","value":70},{"color":[70,80,"rgba(70,33,146,0.5)"],"caption":"80","value":80},{"color":[80,90,"rgba(51,13,328,0.5)"],"caption":"90","value":90}],
		'forcastWind':[{"caption":"≦2级","color":["min",3.4,"rgba(255,255,255,0)"],"value":0},{"caption":"3级","color":[3.4,5.5,"rgba(0,103,255,0.5)"],"value":3.4},{"caption":"4级","color":[5.5,8.0,"rgba(47,154,0,0.5)"],"value":5.5},{"caption":"5级","color":[8.0,10.8,"rgba(38,255,0,0.5)"],"value":8.0},{"caption":"6级","color":[10.8,13.9,"rgba(210,254,9,0.5)"],"value":10.8},{"caption":"7级","color":[13.9,17.2,"rgba(252,254,0,0.5)"],"value":13.9},{"caption":"8级","color":[17.2,20.8,"rgba(243,212,47,0.5)"],"value":17.2},{"caption":"9级","color":[20.8,24.5,"rgba(251,155,3,0.5)"],"value":20.8},{"caption":"10级","color":[24.5,28.5,"rgba(222,196,195,0.5)"],"value":24.5},{"caption":"11级","color":[28.5,32.7,"rgba(204,149,145,0.5)"],"value":28.5},{"caption":"12级","color":[32.7,37.0,"rgba(144,75,69,0.5)"],"value":32.7},{"caption":"13级","color":[37.0,41.5,"rgba(255,51,51,0.5)"],"value":37.0},{"caption":"14级","color":[41.5,46.2,"rgba(210,57,58,0.5)"],"value":41.5},{"caption":"15级","color":[46.2,51.0,"rgba(178,55,55,0.5)"],"value":46.2},{"caption":"16级","color":[51.0,56.1,"rgba(178,51,178,0.5)"],"value":51.0},{"caption":"17级","color":[56.1,61.3,"rgba(222,55,225,0.5)"],"value":56.1},{"caption":">17级","color":[61.3,"max","rgba(255,210,255,0.5)"],"value":61.3}]
	},
	getDisasterInfo:otherbaseUrl+"/zjemw/disasterAudit/disasterListAPP",
	contourUrl:otherbaseUrl+'/geoserver/cwms',
	getAreaTree:otherbaseUrl+"/bas/common/queryAreaTree",
	getMonitorVideoList:otherbaseUrl+"/mdls/monitorVideo/queryMonitorVideo",
}
var warningConfig={
	loginUrl:otherbaseUrl+"/publish/user/login",//登录地址
	strategyUrl:otherbaseUrl+"/publish/interCommon/getStrategy",//查询策略接口
	channelUrl:otherbaseUrl+"/publish/channel/channelInfo",//获取发布渠道接口
	strategyUser:otherbaseUrl+"/publish/channel/findUsersToGis",//发布用户
	sendWarning:otherbaseUrl+"/publish/joint/earlyHandler",//发预警
	sendGeneral:otherbaseUrl+"/publish/joint/generalHandler",//发一般信息
	sendImpNotice:otherbaseUrl+"/publish/joint/impNoticeHandler",//发重要通知
	getLoginUser:otherbaseUrl+"/publish/interCommon/getEmployeeByOrgCode",
	getEarlyChannelInfo:otherbaseUrl+"/publish/early/queryEarlyChannelInfo",
	getAreaByAreaCode:apibaseUrl+'/api/common/queryAreaByAreaCode'
}
