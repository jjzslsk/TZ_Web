var filePath = "http://10.137.4.30:8888/fileservice";
layui.use([ 'layer', 'table','element','laydate','form'], function() {

    var laydate = layui.laydate;
    var table = layui.table; //表格
    var form = layui.form;
    var element = layui.element;
    var layer = layui.layer;

    //左侧天气预报
    function WeatherAlert(){
        $.ajax({
            url: main_url +'/ssd-early-alarm-publish/getOverView',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_="";
                var obj = res.data;
                if(obj != null && obj != ""){
                    //添加样式
                    $("#tqyjDiv").addClass("warningShow");
                    $('.warningShow').find('.warningList').show()
                    $('.warningShow').css({'background':'url(image/boxItem2.png) no-repeat'})
                    if($('.warningShow').length == 1){
                        $('.forecast').css('height','calc(75% - 0.23rem)')
                    }else if($('.warningShow').length == 2){
                        $('.forecast').css('height','52%')
                    }else{
                        $('.forecast').css('height','calc(98% - 0.46rem)')
                    }
                    for(var i = 0;i<obj.length;i++){
                        html_+="<div class='warningItem'>";
                        html_+="<img src='../early/image/"+obj[i].code+"_0"+obj[i].level+".png' >";
                        html_+="<div class='warningTxt'>";
                        html_+="<p>"+obj[i].title+"</p>";
                        html_+="<p>"+obj[i].publishTime+"</p>";
                        html_+="</div>";
                        html_+="</div>";

                    }
                    var total = obj.length;
                    $("#WeatherAlert").html(html_);
                    $("#WeatherAlertTotal").html("");
                }
            },
            error: function (result) {
                layer.msg("获取天气警报数据异常");
            }
        });
    };

//市县预警
    function cityCountyEarly(){
        $.ajax({
            url: main_url +'/ssd-early-warning-publish/getOverView',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_="";
                var obj = res.data;
                if(obj != null && obj != ""){
                    //添加样式
                    $("#sxyjDiv").addClass("warningShow");
                    $('.warningShow').find('.warningList').show()
                    $('.warningShow').css({'background':'url(image/boxItem2.png) no-repeat'})
                    if($('.warningShow').length == 1){
                        $('.forecast').css('height','calc(75% - 0.23rem)')
                    }else if($('.warningShow').length == 2){
                        $('.forecast').css('height','52%')
                    }else{
                        $('.forecast').css('height','calc(98% - 0.46rem)')
                    }
                    for(var i = 0;i<obj.length;i++){
                        html_+="<div class='warningItem'>";
                        html_+="<img src='../early/image/"+obj[i].code+"_0"+obj[i].level+".png' >";
                        html_+="<div class='warningTxt'>";
                        html_+="<p>"+obj[i].title+"</p>";
                        html_+="<p>"+obj[i].publishTime+"</p>";
                        html_+="</div>";
                        html_+="</div>";
                        if(i>0){
                            //只取前两条
                            break;
                        }
                    }
                    var total = obj.length;
                    $("#cityCountyEarly").html(html_);
                    if(total>2){
                        $("#cityCountyEarlyMore").html("<a href='/#/weather-warning/trace/alarm' target='_blank'>更多("+total+")</a>");
                    }else{
                        $("#cityCountyEarlyMore").html("");
                    }
                }
            },
            error: function (result) {
                layer.msg("获取市县预警数据异常");
            }
        });
    };

//短临预报
    function emporaryWarning(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getLatestPublish?productCode=dlyb',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_= "";
                if(res.code == 0){
                    var obj = res.data;
                    if(obj.content != null  && obj.content !=""){
                       // html_+=obj.content;
                        $("#emporaryWarning").val(obj.content);
                    }
                }
                //$("#emporaryWarning").html(html_);
            },
            error: function (result) {
                layer.msg("获取短临预报数据异常");
            }
        });
    }
//短期预报
    function shortWarning(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getLatestPublish?productCode=dqyb',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_= "";
                if(res.code == 0){
                    var obj = res.data;
                    if(obj.content != null && obj.content !=""){
                        //html_+=obj.content;
                        $("#shortWarning").val(obj.content);
                    }
                }
                //$("#shortWarning").html(html_);
            },
            error: function (result) {
                layer.msg("获取短期预报异常");
            }
        });
    };

//十天预报
    function tenForecast(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getLatestPublish?productCode=sttq',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_= "";
                if(res.code == 0){

                    var obj = res.data;
                    if(obj.content != null && obj.content !=""){
                        /*var content = JSON.parse(obj.channel_content);
                        html_+=obj.content;*/
                        $("#tenForecast").val(obj.content);
                    }else{
                        $("#tenForecast").val("暂无数据");
                    }
                }
                //$("#tenForecast").html(html_);
            },
            error: function (result) {
                layer.msg("获取十天预报异常");
            }
        });
    };

//海洋预报
    function oceanForecast(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getLatestPublish?productCode=hyyb',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_= "";
                if(res.code == 0){
                    var obj = res.data;
                    if(obj.content != null && obj.content !=""){
                        //html_+=obj.content;
                        $("#oceanForecast").val(obj.content);
                    }
                }
                //$("#oceanForecast").html(html_);
            },
            error: function (result) {
                layer.msg("获取海洋预报异常");
            }
        });
    };




//城市预报
    function cityForecast(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getLatestPublish?productCode=csybqxw',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_= "";
                if(res.code == 0){
                    var obj = res.data;
                    if(obj.content != null && obj.content !=""){
                        //html_+=obj.content;
                        $("#cityForecast").val(obj.content);
                    }
                }
                //$("#cityForecast").html(html_);
            },
            error: function (result) {
                layer.msg("获取城市预报异常");
            }
        });
    }
//周边城市预报
    function aroundCityForecast(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getLatestPublish?productCode=zbcsyb',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_= "";
                if(res.code == 0){
                    var obj = res.data;
                    if(obj.content != null && obj.content !=""){
                        //html_+=obj.content;
                        $("#aroundCityForecast").val(obj.content);
                    }
                }
                //$("#aroundCityForecast").html(html_);
            },
            error: function (result) {
                layer.msg("获取周边城市预报异常");
            }
        });
    };

//右侧通知栏
    function noticeBar(){
        $.ajax({
            url: main_url +'/ssd-product-publish/getTyphoon',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var html_="";
                var obj = res.data;
                if(obj != null && obj != ""){
                    for(var i = 0 ;i<obj.length;i++){
                        html_+="<div class='swiper-slide' style='height:100%;'>";
                        html_+="<div class='noticeItem'>";
                        html_+="<div class='noticeItemDetail'>";
                        html_+="<i></i>";
                        html_+="<div class='noticeTxt'>";
                        html_+="<span class='name'>";
                        html_+="<i>"+obj[i].name+"：</i>";
                        html_+="<i class='detailTxt'><a target='_blank' href='"+obj[i].url+"'>"+obj[i].title+"</a></i>";
                        html_+="<i class='time'>"+obj[i].time+"</i>";
                        html_+="</span>";
                        html_+="</div>";
                        html_+="</div>";
                        html_+="</div>";
                        html_+="</div>";
                    }

                    $("#noticeBar").html(html_);
                }
            },
            error: function (result) {
                layer.msg("获取通知栏异常");
            }
        });
    };

//右侧省级决策服务材料
    function serviceMaterials(){
        $.ajax({
            url: main_url +'/realData/getProvinceServiceMaterials',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var obj = res.data;
                var html_="";
                if(obj != null && obj != ""){
                    var o = obj.list;
                    for(var i = 0; i<o.length;i++){
                        html_+="<div class='swiper-slide' style='height:100%;'>";
                        html_+="<div class='noticeItem'>";
                        html_+="<div class='noticeItemDetail'>";
                        html_+="<i></i>";
                        html_+="<div class='noticeTxt noticeTxt2'>";
                        html_+="<a target='_blank' href='"+filePath+o[i].content+"'>"+o[i].name+"</a>";
                        html_+="</div>";
                        html_+="</div>";
                        html_+="</div>";
                        html_+="</div>";
                    }

                    $("#serviceMaterials").html(html_);
                }
            },
            error: function (result) {
                layer.msg("获取省级决策服务材料异常");
            }
        });
    };

//三天降水图
    function threeRainDays(){
        $.ajax({
            url: main_url +'/ssd-forecast-element/getDayRainImg',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                var obj = res.data;
                if(obj != null && obj != "" ){

                    $("#rainDaysOne").html(" <img  src='"+obj.day1+"' >");
                    $("#rainDaysTwo").html(" <img  src='"+obj.day2+"' >");
                    $("#rainDaysThree").html(" <img  src='"+obj.day3+"' >");
                }
            },
            error: function (result) {
                layer.msg("获取三天降水图异常");
            }
        });


    };

    /**
     * 七天趋势预报
     */
    function sevenForecast(type){
        $.ajax({
            url: main_url +'/DataStatistics/getSevenDayForecast?type='+type,
            type:'GET',
            dataType: 'json',
            success: function (res) {
                if(res.data != null && res.data != ""){
                    //刷新echarts图
                    sevenForecast_Echarts(res.data);
                }
            },
            error: function (result) {
                layer.msg("获取七天预报趋势图异常");
            }
        });
    };

    //降水，站点数，小时最大雨量，日最大雨量
    function rainMonitor(){
        $.ajax({
            url: main_url +'/realData/getRainMonitor',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                if(res.data != null && res.data != ""){
                    var obj = res.data;
                    rainMonitorEcharts(obj);
                }
            },
            error: function (result) {
            }
        });

    }

    //11,9级大风，小时极大风，日极大风
    function windMonitor(){
        $.ajax({
            url: main_url +'/realData/getWindMonitor',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                if(res.data != null && res.data != ""){
                    var obj = res.data;
                    windVMonitorEcharts(obj);
                }
            }
        });
    }

    //200,500米能见度，日最低能见度，近6h最低能见度
    function visMonitor(){
        $.ajax({
            url: main_url +'/realData/getVisMonitor',
            type:'GET',
            dataType: 'json',
            success: function (res) {
                if(res.data != null && res.data != ""){
                    var obj = res.data;
                    visMonitorEcharts(obj);
                }
            }
        });
    }


    //点击事件监听
    $('.menuBox').find('li').on('click',function(){
        $(this).addClass('liAc').siblings().removeClass('liAc')
    });
    //左边，短临，短期预报切换
    $('.warningTxtBoxTitle1').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc')
        $('.leftTwo').find('.warningTxtDetailItem').eq($(this).index()).show().siblings().hide();
    });
    //左边，十天，城市，周边预报切换
    $('.warningTxtBoxTitle2').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc')
        $('.leftThree').find('.warningTxtDetailItem').eq($(this).index()).show().siblings().hide();
    });

    $('.monitorBtn').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc');
        $('.monitorList').find('.monitorItem').eq($(this).index()).show().siblings().hide();
        var id = $(this)[0].id;
        if(id == "sevenForecast"){
            sevenForecast("day");
        }else if(id == "rainMonitor"){
            rainMonitor();
        }else if(id == "windVMonitor"){
            windMonitor();
        }else if(id == "visMonitor"){
            visMonitor();
        }
    })
    $('.sectionBox').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc')
    })
    $('.runPicBtn').find('span').on('click',function(){
        $(this).addClass('spanAc').siblings().removeClass('spanAc');
        $('.runPicDetail').eq($(this).index()).show().siblings().hide();
    });

    $("#sevenForecastDiv").find('span').on('click',function () {
        var id = $(this)[0].id;
        var type = "day";
        if(id == "sevenDay"){
            type = "day";
        }else if(id == "sevenXun"){
            type = "xun";
        }else if(id == "sevenMonth"){
            type = "month";
        }
        sevenForecast(type);
    });



    $('.itemTitleOtherClick').on('click',function(){
        if($(this).parent().attr('class').split('warningShow').length == 1){
            $(this).parent().addClass('warningShow')
            $(this).parent().css({'height':'23%','background':'url(image/boxItem2.png) no-repeat'})
            $(this).siblings('.warningList').show()
        }else{
            $(this).parent().removeClass('warningShow')
            $(this).parent().css({'height':'0.23rem','background':'url(image/boxItem1.png) no-repeat'})
            $(this).siblings('.warningList').hide()
        }

        if($('.warningShow').length == 1){
            $('.forecast').css('height','calc(75% - 0.23rem)')
        }else if($('.warningShow').length == 2){
            $('.forecast').css('height','52%')
        }else{
            $('.forecast').css('height','calc(98% - 0.46rem)')
        }
    })


    //加载
    WeatherAlert();
    cityCountyEarly();
    emporaryWarning();
    shortWarning();
    tenForecast();
    oceanForecast();
    cityForecast();
    aroundCityForecast();
    noticeBar();
    serviceMaterials();
    threeRainDays();
    sevenForecast("day");
    //monitorEcharts();

});
//各模块数据加载
/*$(function(){
    //左侧数据加载
    WeatherAlert();
    cityCountyEarly();
    emporaryWarning();
    shortWarning();
    tenForecast();
    cityForecast();
    aroundCityForecast();
    noticeBar();
    serviceMaterials();
    threeRainDays();
    sevenForecast("day");
});*/




