let windowWidth=()=>$(window).width()
let pageWidth = windowWidth() == 1280? "30%":"20%"

// $(function() {
	var mySwiper = new Swiper('.swiper-container', {
		navigation: {
			nextEl: '.swiper-button-next', //左右按钮
			prevEl: '.swiper-button-prev',
		},
		simulateTouch: false, //禁止鼠标模拟  手机可以滑动
		allowTouchMove: false, //手机也不能滑动

		// loop : true,

		observer: true, //修改swiper自己或子元素时，自动初始化swiper

		observeParents: true, //修改swiper的父元素时，自动初始化swiper
	});

	//layui 初始化
	layui.use(['element', 'layer'], function() {
		var element = layui.element;
		layer = layui.layer;
		const http = new EasyHttp;

		/**
		 * 近小时实况数据查询
		 * @param param
		 */
		function getNHours(param) {
			http.get(main_url + '/ssd-reminder-live-data/getNHours', param,
				function(res) {
					if (res.code == 0) {
						var obj = res.data.data;
						var dataX = [];
						var data_MaxTmp = [];
						var data_MinTmp = [];
						var data_Rain = [];
						var data_Wind = [];
						var data_WindFX = [];
						$.each(obj, function(index, o) {
							dataX.push(o.tTime.split(' ')[1]);
							data_MaxTmp.push(o.Tx);
							data_MinTmp.push(o.Tn);
							data_Rain.push(o.RR);
							data_Wind.push(o.fFy);
							data_WindFX.push(o.dFy)
						});
						zxt_echarts("liveData", dataX, data_MaxTmp, data_MinTmp, data_Rain, data_Wind, data_WindFX,res.data.min,res.data.max);
					}
				},
				function(err) {
					console.log(err)
				}
			)
		}

		/**
		 *1小时内降水信息查询
		 * @param param
		 */
		function getHourRain(param) {
			http.get(main_url + '/ssd-reminder-live-data/getHourRain', param,
				function(res) {
					if (res.code == 0) {
						var obj = res.data;
						var sdata = [];
						//短时强降雨
						var json_stationCounts = {};
						var json_sHeavy = {};
						var json_lRain = {};
						var json_mRain = {};
						var json_hRain = {};
						var json_rainstorm = {};
						json_stationCounts = {
							'value': obj.stationCounts,
							name: '站点数'
						};
						json_sHeavy = {
							'value': obj.sHeavy,
							name: '短时强降雨数'
						};
						json_lRain = {
							'value': obj.lRain,
							name: '小雨'
						};
						json_mRain = {
							'value': obj.mRain,
							name: '中雨'
						};
						json_hRain = {
							'value': obj.hRain,
							name: '大雨'
						};
						json_rainstorm = {
							'value': obj.rainstorm,
							name: '暴雨'
						};
						//短时强降雨
						sdata.push(json_sHeavy);
						sdata.push(json_stationCounts);
						bzt_echarts("hourRain_sHeavy", "短时强降雨", sdata, obj.stationCounts, obj.sHeavy);
						sdata = [];
						//小雨
						sdata.push(json_lRain);
						sdata.push(json_stationCounts);
						bzt_echarts("hourRain_lRain", "小雨", sdata, obj.stationCounts, obj.lRain);
						sdata = [];
						//中雨
						sdata.push(json_mRain);
						sdata.push(json_stationCounts);
						bzt_echarts("hourRain_mRain", "中雨", sdata, obj.stationCounts, obj.mRain);
						sdata = [];
						//大雨
						sdata.push(json_hRain);
						sdata.push(json_stationCounts);
						bzt_echarts("hourRain_hRain", "大雨", sdata, obj.stationCounts, obj.hRain);
						sdata = [];
						//暴雨
						sdata.push(json_rainstorm);
						sdata.push(json_stationCounts);
						bzt_echarts("hourRain_rainstorm", "暴雨", sdata, obj.stationCounts, obj.rainstorm);
						sdata = [];
					}
					console.log(res)
				},
				function(err) {
					console.log(err)
				}
			)
		}

		/**
		 *短时间强降雨地区查询
		 * @param param
		 */
		function getAreaHeavyRain(param) {
			http.get(main_url + '/ssd-reminder-live-data/getAreaHeavyRain', param,
				function(res) {
					if (res.code == 0) {
					    if(res.data.length > 0){
                            var obj = res.data;
                            var dataX = [];
                            var dataY = [];
                            $.each(obj, function(index, o) {
                                dataX.push(o.country);
                                dataY.push(o.stationNum);
                            });
                            zzt_echarts("heavyRain", "降水信息", dataX, dataY);
                        }else{
                            var dataX = ["温岭市","玉环市","临海市","三门县","仙居县","天台县","椒江区","玉环县","路桥区","黄岩区"];
                            var dataY = [0,0,0,0,0,0,0,0,0,0];
                            zzt_echarts("heavyRain", "降水信息", dataX, dataY);
                        }
					}else{
                        var dataX = ["温岭市","玉环市","临海市","三门县","仙居县","天台县","椒江区","玉环县","路桥区","黄岩区"];
                        var dataY = [0,0,0,0,0,0,0,0,0,0];
                        zzt_echarts("heavyRain", "降水信息", dataX, dataY);
                    }
				},
				function(err) {
					console.log(err)
				}
			)
		}

		/**
		 * 地区雨量和风力等级统计
		 * @param param
		 */
		function getAreaRainAndWind(param) {
			http.get(main_url + '/ssd-reminder-live-data/getAreaRainAndWind', param,
				function(res) {
					if (res.code == 0) {
						var obj = res.data;
						var sdata = [];
						var color = [];
						var title1 = "";
						var title2 = "";
						//短时强降雨
						var json_stationCounts = {};
						var json_rain0 = {};
						var json_rain20 = {};
						var json_wind9 = {};
						var json_wind11 = {};
						json_stationCounts = {
							'value': obj.stationCounts,
							name: '站点数'
						};
						json_rain0 = {
							'value': obj.rain0,
							name: '雨量大于0'
						};
						json_rain20 = {
							'value': obj.rain20,
							name: '雨量大于20'
						};
						json_wind9 = {
							'value': obj.wind9,
							name: '风力大于9级'
						};
						json_wind11 = {
							'value': obj.wind11,
							name: '风力大于11级'
						};
						//雨量大于0
						sdata.push(json_rain0);
						sdata.push(json_stationCounts);
						title1 = "0mm";
						title2 = obj.rain0 + "/" + obj.stationCounts;
						if(isPage){
							color = ['#72CE5F', 'rgba(8,224,161,0.18)'];
						}else{
							color = ['#08E0A1', 'rgba(8,224,161,0.5)'];
						}
						bzt_echarts2("area_rain0", "雨量大于0", sdata, title1, title2, color);
						sdata = [];
						//雨量大于20
						sdata.push(json_rain20);
						sdata.push(json_stationCounts);
						title1 = "20mm";
						title2 = obj.rain20 + "/" + obj.stationCounts;
						if(isPage){
							color = ['#019BFF', 'rgba(8,224,161,0.18)'];
						}else{
							color = ['#08E0A1', 'rgba(8,224,161,0.5)'];
						}
						bzt_echarts2("area_rain20", "雨量大于20", sdata, title1, title2, color);
						sdata = [];
						//风力大于9级
						sdata.push(json_wind9);
						sdata.push(json_stationCounts);
						title1 = "9级";
						title2 = obj.wind9 + "/" + obj.stationCounts;
						if(isPage){
							color = ['#FFCD04', 'rgba(8,224,161,0.18)'];
						}else{
							color = ['#FEF73D', 'rgba(254,247,61,0.5)'];
						}
						bzt_echarts2("area_wind9", "风力大于9级", sdata, title1, title2, color);
						sdata = [];
						//风力大于11级
						sdata.push(json_wind11);
						sdata.push(json_stationCounts);
						title1 = "11级";
						title2 = obj.wind11 + "/" + obj.stationCounts;
						if(isPage){
							color = ['#275DFE', 'rgba(8,224,161,0.18)'];
						}else{
							color = ['#3189FE', 'rgba(49,137,254,0.5)'];
						}
						bzt_echarts2("area_wind11", "风力大于11级", sdata, title1, title2, color);
						sdata = [];
					}
				},
				function(err) {
					console.log(err)
				}
			)

		}

		/**
		 * 站点小时极值查询
		 * @param param
		 */
		function getExtremum(param) {
            http.get(main_url + '/ssd-reminder-live-data/getAllStationElementExtremum', param,
                function(res) {
                    if (res.code == 0) {
                        var obj = res.data;
                        if(obj != null){
                            var html ="";
                            $.each(obj, function(index, o) {
                                html="";
                                switch (o.element) {
                                    case "rain":
                                        html="<span style='color: #019BFF;font-weight:bold;font-size: 24px;'>"+o.val+"</span>mm "+o.StationName;
                                        $("#maxRain").html(html);
                                        break;
                                    case "fFy":
                                        html="<span style='color: #B846FA;font-weight:bold;font-size: 24px;' >"+o.val+"</span> m/s "+o.StationName;
                                        $("#maxWind").html(html);
                                        break;
                                    case "Tx":
                                        html="<span style='color: #FFCD04;font-weight:bold;font-size: 24px;' >"+o.val+"</span>°C "+o.StationName;
                                        $("#MaxTemp").html(html);
                                        break;
                                    case "Tn":
                                        html="<span style='color: #275DFE;font-weight:bold;font-size: 24px;' >"+o.val+"</span>°C "+o.StationName;
                                        $("#MinTemp").html(html);
                                        break;
                                }
                            });
                        }else {

                        }
                    }
                },
                function(err) {
                    console.log(err)
                }
            )
			/*http.get(main_url + '/ssd-reminder-live-data/getExtremum', param,
				function(res) {
					if (res.code == 0) {
						var obj = res.data;
						$("#maxRain").html(obj.RR);
						$("#maxWind").html(obj.fFy);
						$("#MaxTemp").html(obj.Tx);
						$("#MinTemp").html(obj.Tn);
					}
				},
				function(err) {
					console.log(err)
				}
			)*/

		}
		/**
		 *获取实况数据最新时间
		 */
		function getNewLiveDate(param) {
			http.get(main_url + '/ssd-reminder-live-data/getNewLiveDate', param,
				function(res) {
					if (res.code == 0) {
						var obj = res.data;
						var tTime =  obj.tTime;//"2020-05-21 17";
						var title = obj.title;
						$("#dateTime").val(tTime);
						$("#liveDate").html(title);
						getHourRain('?tTime=' + tTime);
						getAreaHeavyRain('?tTime=' + tTime);
						getNHours("?stationType=1&stationNum=58665&tTime=" + tTime);
						getAreaRainAndWind('?tTime=' + tTime);
						getExtremum('?tTime=' + tTime);
					}
					console.log(res)
				},
				function(err) {
					console.log(err)
				},true
			)
		}

        Date.prototype.Format = function (fmt){
            var o = {
                "M+": this.getMonth() + 1,  //月份
                "d+": this.getDate() ,  //日
                "h+": this.getHours() ,  //24小时制
                "m+": this.getMinutes(),  //分
                "s+": this.getSeconds(),  //秒
                "q+": Math.floor((this.getMonth()+3)/3),  //季度
                "S": this.getMilliseconds()  //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+k+")").test(fmt))
                    fmt = fmt.replace(RegExp.$1,(RegExp.$1.length ==1) ? (o[k]):(("00"+o[k]).substr((""+o[k]).length)));
            return fmt;

        };
		// http://192.168.0.125:6001/integration/ssd-reminder-live-data/getHistoricalData?stationNum=58762&element=Tx&dateType=day
		function liveDataFn(param){
			// stationNum 站点编号 element 要素（降雨：rain,最大气温：Tx,最小气温Tn，平均气温Ta）
			http.get(main_url + '/ssd-reminder-live-data/getHistoricalData', param,
				function(res) {
					if (res.code == 0) {
						console.log(res)
						var nowData = res.data.nowData  //实时
						var maxData = res.data.maxData	//历史最大
						var minData = res.data.minData	//历史最小
						var avgData = res.data.avgData	//历史平均
						var xData = res.data.xData	//x轴日期

						liveEchartFn(nowData,maxData,minData,avgData,xData)
					}
				},
				function(err) {
					console.log(err)
				}
			)
		}

        function getNearStationExtremum(type){
            // stationNum 站点编号 element 要素（降雨：rain,最大气温：Tx,最小气温Tn，平均气温Ta）
            var params = "?type="+type;
            var liveDtae = $('#liveDate').text();
            var formatTime = liveDtae.substring(0,4)+'-'+liveDtae.substring(5,7)+'-'+liveDtae.substring(8,10);
            formatTime = new Date(new Date(formatTime).getTime()-24*60*60*1000).Format('yyyy-MM-dd');
            if(type!='0'){
                params+='&time="'+formatTime+'"';
            }
            http.get(main_url + '/ssd-reminder-live-data/getNearStationExtremum', params,
                function(res) {
                    if (res.code == 0) {
                        var day = res.data.day  //今日
                        var day10 = res.data.day10	//近10天
                        var day30 = res.data.day30	//近30天
                        var day_li = "<li style='height: 3%;width: 1px;'></li><li><p class='extremumLiveTitle'>本日</p>";
                        var day10_li = "<li><p class='extremumLiveTitle'>近10天</p>";
                        var day30_li = "<li><p class='extremumLiveTitle'>近30天</p>";
                        var objArrys = [day,day10,day30];
                        var objstrArrys=[day_li,day10_li,day30_li];
                        var objeleArrys=["Extremum0","Extremum10","Extremum30"];
                        for (var i = 0 ; i<objArrys.length;i++){
                            var obj = objArrys[i];
                            if(obj != null){
                                var temp_max_html = "";
                                var temp_min_html = "";
                                var rain_amount_html = "";
                                var rain_max_html = "";
                                var wind_max_html = "";
                                $.each(obj, function(index, objday) {
                                    var element = objday.element;
                                    switch (element) {
                                        case "rain_amount":
                                            rain_amount_html+="<div class='extremumLiveItemCon'>";
                                            if(objday.ranking != null && objday.ranking != ''){
                                                if(parseInt(objday.ranking) >0){
                                                    rain_amount_html += "<span class='up'>";
                                                }else{
                                                    rain_amount_html += "<span class='down'>";
                                                }
                                                rain_amount_html += "<i>"+objday.ranking+"</i>";
                                                rain_amount_html += "<i></i>";
                                                rain_amount_html += "</span>";
                                            }
                                            rain_amount_html+="<p><span>"+objday.val+"</span> mm</p>";
                                            rain_amount_html+="<p>最大累计降水</p>";
                                            rain_amount_html+="<p>"+objday.Country+"</p>";
                                            rain_amount_html+="</div>";
                                            break;
                                        case "rain_max":
                                            rain_max_html+="<div class='extremumLiveItemCon'>";
                                            if(objday.ranking != null && objday.ranking != ''){
                                                if(parseInt(objday.ranking) >0){
                                                    rain_max_html += "<span class='up'>";
                                                }else{
                                                    rain_max_html += "<span class='down'>";
                                                }
                                                rain_max_html += "<i>"+objday.ranking+"</i>";
                                                rain_max_html += "<i></i>";
                                                rain_max_html += "</span>";
                                            }
                                            rain_max_html+="<p><span>"+objday.val+"</span> mm</p>";
                                            rain_max_html+="<p>最大降水</p>";
                                            rain_max_html+="<p>"+objday.Country+"</p>";
                                            if(objday.time != null){
                                                rain_max_html+="<p>"+objday.time+"</p>";
                                            }else{
                                                rain_max_html+="<p></p>";
                                            }

                                            rain_max_html+="</div>";

                                            break;
                                        case "wind_max":
                                            wind_max_html+="<div class='extremumLiveItemCon'>";
                                            if(objday.ranking != null && objday.ranking != ''){
                                                if(parseInt(objday.ranking) >0){
                                                    wind_max_html += "<span class='up'>";
                                                }else{
                                                    wind_max_html += "<span class='down'>";
                                                }
                                                wind_max_html += "<i>"+objday.ranking+"</i>";
                                                wind_max_html += "<i></i>";
                                                wind_max_html += "</span>";
                                            }
                                            wind_max_html+="<p><span>"+objday.val+"</span> m/s</p>";
                                            wind_max_html+="<p>最大极大风</p>";
                                            wind_max_html+="<p>"+objday.Country+"</p>";
                                            if(objday.time  != null){
                                                wind_max_html+="<p>"+objday.time+"</p>";
                                            }else{
                                                wind_max_html+="<p></p>";
                                            }
                                            wind_max_html+="</div>";
                                            break;
                                        case "temp_max":
                                            temp_max_html+="<div class='extremumLiveItemCon'>";
                                            if(objday.ranking != null && objday.ranking != ''){
                                                if(parseInt(objday.ranking) >0){
                                                    temp_max_html += "<span class='up'>";
                                                }else{
                                                    temp_max_html += "<span class='down'>";
                                                }
                                                temp_max_html += "<i>"+objday.ranking+"</i>";
                                                temp_max_html += "<i></i>";
                                                temp_max_html += "</span>";
                                            }
                                            temp_max_html+="<p><span>"+objday.val+"</span> ℃</p>";
                                            temp_max_html+="<p>最高气温</p>";
                                            temp_max_html+="<p>"+objday.Country+"</p>";
                                            if(objday.time  != null){
                                                temp_max_html+="<p>"+objday.time+"</p>";
                                            }else{
                                                temp_max_html+="<p></p>";
                                            }
                                            temp_max_html+="</div>";
                                            break;
                                        case "temp_min":
                                            temp_min_html+="<div class='extremumLiveItemCon'>";
                                            if(objday.ranking != null && objday.ranking != ''){
                                                if(parseInt(objday.ranking) >0){
                                                    temp_min_html += "<span class='up'>";
                                                }else{
                                                    temp_min_html += "<span class='down'>";
                                                }
                                                temp_min_html += "<i>"+objday.ranking+"</i>";
                                                temp_min_html += "<i></i>";
                                                temp_min_html += "</span>";
                                            }
                                            temp_min_html+="<p><span>"+objday.val+"</span> ℃</p>";
                                            temp_min_html+="<p>最低气温</p>";
                                            temp_min_html+="<p>"+objday.Country+"</p>";
                                            if(objday.time  != null){
                                                temp_min_html+="<p>"+objday.time+"</p>";
                                            }else{
                                                temp_min_html+="<p></p>";
                                            }
                                            temp_min_html+="</div>";
                                            break;
                                    }
                                });
                                //要插入的要素对象
                                var ele = objeleArrys[i];
                                var str = objstrArrys[i];
                                $("#"+ele).html(str+rain_amount_html+rain_max_html+wind_max_html+temp_max_html+temp_min_html);
                            }
                        }
                    }
                },
                function(err) {
                    console.log(err)
                }
            )
        }

        var elements = ['rain','tempMax','tempMin','pressMax','pressMin','windx','windy','relhum'];
        var eleName = ['累计降雨','最高温度','最低温度','最高气压','最低气压','最大风速','极大风速','相对湿度'];
        var eleUnit = ["mm","℃","℃","Pa","Pa","m/s","m/s","%"];
        var interval;

        //加载地图
        function getEchartMaps(){

            var dateTime =$("#dateTime").val();  //$("#dateTime").val();
            var hours = "2";
            var param = "?tTime="+dateTime+"&hours="+hours;
            http.get(main_url + '/ssd-reminder-live-data/gisNHoursStation', param,
                function(res) {
                    if (res.code == 0) {
                        stationData = [];
                        var parms = {};
                        //存储到客户端缓存
                        var data = res.stations;
                        sessionStorage.setItem("stations",JSON.stringify(data));
                        var stations = sessionStorage["stations"];
                        //
                        var ele = elements[0];
                        var eleunit = eleUnit[0];
                        $(data).each(function (i, o) {
                            parms = setStationJson(ele, o,eleunit);
                            stationData.push(parms);
                        });
                        mapEchart(stationData);
                        $("#mapName").html(eleName[0]+" 单位:"+eleUnit[0]);
                        sessionStorage.setItem("counter",1);
                        interval=setInterval(rotationMap ,5000);
                    }
                },
                function(err) {
                    console.log(err)
                }
            )

        }
        //轮播地图
        function rotationMap(){
            var stations = sessionStorage["stations"];
            if(stations != null){
                var json=JSON.parse(stations);
                var counter = sessionStorage["counter"]; //计数器
                if (counter == null || counter==elements.length){
                    counter = 0;
                }else{
                    counter = parseInt(counter);
                }
                stationData = [];
                var parms = {};
                var ele = elements[counter];
                var eleunit = eleUnit[counter];
                $(json).each(function (i, o) {
                    parms = setStationJson(ele, o,eleunit);
                    stationData.push(parms);
                });
                mapEchart(stationData);
                $("#mapName").html(eleName[counter]+" 单位:"+eleUnit[counter]);
                sessionStorage.setItem("counter",counter+1);
            }
        }

        var setStationJson = function (type, o,eleunit) {
            var lon = o.Longitude;
            var lat = o.Latitude;
            var data;
            $.ajax({
                url:'../../data/geojson/taizhou-country.json',
                type:'get',
                async: false,
                success: function(res){
                    data = res
                }
            });
            $.each(data,function (i,obj) {
                    var name = obj.name;
                    if(o.country == name){
                        //如果县级相同
                        lon = obj.lon;
                        lat = obj.lat;
                    }
            });
            var json = {};
            json = {
                name:o.country+" "+o[type]+eleunit,
                value: [lon,lat],
            };
                    /*json = {
                        name: o.stationName, coord: [o.Longitude, o.Latitude],
                        key: o.stationNum,
                        symbol: 'image://../reminder/img/marker.png', symbolSize: '27',
                        label: {show: true, position: [0, 28], color: '#fffb1f'}, value: o[type]+eleunit
                    };*/
            return json;
        };




        $('.selectShow>div').on('click',function(){
            // $(this).addClass('iAcBox').siblings().removeClass('iAcBox');
        })
        $('.liveType').find('li').on('click',function(){
            $(this).addClass('liAc').siblings().removeClass('liAc');
            var index = $(this).index();
            var element = 'rain';
            if(index == 0){
                element = 'rain';
            }else if(index == 1){
                element = 'Ta';
            }else if(index == 2){
                element = 'Tx';
            }else if(index == 3){
                element = 'Tn';
            }
            liveDataFn("?stationNum=58443&element="+element+"&dateType=day");
        });


        //获取实况数据最新时间
        getNewLiveDate("");
		liveDataFn('?stationNum=58443&element=rain&dateType=day');
		//近10日，30日数据
        getNearStationExtremum("10,30");
        //本日
        getNearStationExtremum("0");
        //加载地图信息
        getEchartMaps();


	});

    $('.maximize').on('click',function(){
        window.parent['vueDefinedMyProp']({name: 'hideHead', type: ''});
    })
    
// })
