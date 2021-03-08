var common=new common();

/**
 * 案例库列表点击事件
**/
$('.itemContent').eq(0).on('click','.dataItem',function() {
    let className = $(this).attr('class');
    if(className.indexOf('dataItemAc')!=-1){//隐藏
        $(this).removeClass('dataItemAc');
        $("#caseLibrary").fadeOut();
    }else{//加载
        $(this).siblings().removeClass('dataItemAc');
        $(this).addClass('dataItemAc');
        /**实况图片添加起止时间===start**/
        let startTime=$(this).attr("startTime");
        let endTime=$(this).attr("endTime");
        let dateArr=getBetweenDateStr(startTime.substring(0,10),endTime.substring(0,10));
        /**初始化时间轴===end**/
        let caselibno=$(this).attr("id");
        let content=$(this).attr("caselibno");
        document.getElementById("caseLibrary").contentWindow.queryCaselibOtherItem(caselibno,content,dateArr);
        $("#caseLibrary").fadeIn();
    }
});
/**
 * 案例库详细信息 点击事件
 */
$(document).on("click",'#queryOneCase',function(){
    let caselibno=$(this).attr("value");
    document.getElementById("caseLibrary").contentWindow.queryOneCaseInfo(caselibno,1);
});
$('.changeZ').on('click',function(){
    $('.changeZ').css('z-index',1);
    $(this).css('z-index',99);
});
// 菜单点击
var isShow1 = true;
$('.headMenu').on('click',function(){
    if(isShow1){
        $('.menuDetail').show()
        isShow1 = false
        $($('.itemConBtn').find('li')[0]).click();
        document.getElementById("caseLibrary").contentWindow.queryCaseLibrary();
    }else{
        // $('#typeInfos').empty();
        $('.menuDetail').hide()
        isShow1 = true;
        monitorVideoClose();
    }
})
// let cityList;
// function loadCityList(){
//     $.ajax({
//         type:'get',
//         async:false,
//         url:config.base.baseUrl+'/bas/common/queryAreaTree?areaCode='+JSON.parse(sessionStorage.getItem('curArea')).areaCode,
//         dataType:'json',
//         success:function(result){
//             if(result.code=='0'){
//                 let list = result.data;
//                 cityList = list;
//                 //展示城市
//                 var str=""
//                 $(list).each(function(index,item){
//                     str+="<li areacode="+item.areacode+">"+item.areaname+"</li>"
//                 })
//                 $('.cityNav_left').html(str);
//                 $('.cityNav_left li').eq(0).addClass("active");
//                 $('.place .city').attr('areaCode',list[0].code);
//                 $('.place .city').text(list[0].areaname);
//                 showDistrict(list.areacode);
//             }
//         }
//     });
// }
// loadCityList();
//
// function showDistrict(code){
//     var str="";
//     $(cityList).each(function(index,item){
//         if(code==item.areacode){
//             str="<li areacode="+item.areacode+">"+item.areaname+"</li>"
//             if(code.substr(2,4)!="0000"){
//                 $(item.children).each(function(key,value){
//                     str+="<li areacode="+value.areacode+">"+value.areaname+"</li>"
//                 })
//             }
//         }
//     });
//     $('.cityNav_right').html(str);
// }

$(".city").on("click",function(){
    $(".cityChoise").toggleClass("active");
    $('.changeZ').css('z-index',1);
    $('.cityChoise').css('z-index',99);
})
$(".cityDetail").on("click",".cityNav_left>li",function(){
    $(this).addClass("active").siblings().removeClass("active");
    var code=$(this).attr("areacode")
    showDistrict(code);
});
/**切换地区*/
$(".cityDetail").on("click",".cityNav_right>li",function(){
    $(".cityChoise").toggleClass("active");
    var area=$(this).text();
    var curArea=$('.city').text();
    let length=$(this).attr("areacode").split('').reverse().join('');
    let area_level;
    if(Number(length)<=100){
        area_level=1;
    }else if(Number(length)<=10000){
        area_level=3;
    }else{
        area_level=4;
    }
    if(area==curArea){
        alert("当前已经在"+curArea+"!");
    }else{
        if(confirm("即将切换到"+area+"!")) {
            $('.city').attr('areacode',$(this).attr('areacode'));
            $('.city').text(area);
            var areacode=$('.city').attr("areacode");
            var obj=util.getAreaNameByCode(areacode);
            obj.orgunitCode=obj.id.substring(1,6)+'41600000';
            obj.areaCode=obj.id;
            delete obj['id'];
            delete obj['pId'];
            obj.areaName=obj.name;
            delete obj['name'];
            obj.area_level=area_level;
            //存储切换地区
            sessionStorage.setItem("curArea",JSON.stringify(obj));
            //去首页,刷新页面
            window.location.href="index.html";
        }
    }
});
$('.cityChoise>.title>b').click(function(){
    $(".cityChoise").toggleClass("active");
});
var mySwiper = new Swiper('.swiper-container', {
    // simulateTouch : false,//禁止鼠标模拟  手机可以滑动
    // allowTouchMove: false,//手机也不能滑动
    slidesPerView: 3,     //一页显示多少swiper_slide
    slidesPerGroup: 1,      //一次滚动几个swiper_slide

    // loop : true,

    observer: true,//修改swiper自己或子元素时，自动初始化swiper

    observeParents: true,//修改swiper的父元素时，自动初始化swiper
});
/**灾害风险分析swiper*/
$('.disaster_swiperBox').find('.disaster_pic').on('click',function(){
    var className = $(this).attr('class');
    if(className.indexOf('disaster_pic_active')<0){
        $('.disaster_pic_active').removeClass('disaster_pic_active');
        $(this).addClass('disaster_pic_active');
        //加载要素的预报（格点或者落区）
        changeElement(lastSelect);
    }
});
/**
 * 灾害风险分析
 * 切换要素
 */
function changeElement(){
    let html = "";
    //组装强降水格点展示、(组装温度的最高温度、最低温度、温度)
    let selectName = $('.disaster_pic_active >span').text();
    let elementDiv = $('#elementDiv').empty();
    $('.curDataForecastSpan').hide();
    $('.forecastSpan').hide();
    cancelGrid();
    cancelStationPoint();
   if(selectName=='温度'){
        html+='<div class="disaster_radioBox"  style="color: white;">';
        html+='<i id="disaster_redio1" class="" value="MX2T3"></i>';
        html+='<label for="disaster_redio1">最高温度(落区)</label></div>';
        html+='<div class="disaster_radioBox"  style="color: white;">';
        html+='<i id="disaster_redio2" class="" value="MN2T3"></i>';
        html+='<label for="disaster_redio2">最低温度(落区)</label></div>';
    }else if(selectName=='降水'){
        html+='<div class="disaster_radioBox"  style="color: white;">';
        html+='<i id="disaster_redio3" class="" value="TP"></i>';
        html+='<label for="disaster_redio3">降水(落区)</label></div>';
    }else if(selectName=='地质灾害(格点)'){
        html+='<div class="disaster_radioBox" style="color: white;">';
        html+='<i id="disaster_redio4" class="" value="dzzh"></i>';
        html+='<label for="disaster_redio4">地质灾害(落区)</label></div>';
    }else if(selectName=='地质灾害(站点)'){
       html+='<div class="disaster_radioBox" style="color: white;">';
       html+='<i id="disaster_redio5" class="" value="dzzhStation"></i>';
       html+='<label for="disaster_redio5">地质灾害(站点)</label></div>';
   }else if(selectName=='山洪灾害'){
       html+='<div class="disaster_radioBox" style="color: white;">';
       html+='<i id="disaster_redio6" class="" value="shzh"></i>';
       html+='<label for="disaster_redio6">山洪灾害</label></div>';
   }else if(selectName=='中小河流洪水'){
       html+='<div class="disaster_radioBox" style="color: white;">';
       html+='<i id="disaster_redio7" class="" value="zxhlhs"></i>';
       html+='<label for="disaster_redio7">中小河流洪水</label></div>';
   }
    elementDiv.html(html);
}

// // 菜单1,2级tab切换
// // $('.levelOneBtn').find('li').on('click',function(){
// //     $('.levelOneContent').find('.itemContent').eq($(this).index()).show().siblings().hide();
// //     $(this).addClass('liActive').siblings().removeClass('liActive');
// //     let thisText=$(this).find("p").text();
// //     if(thisText=='案例库'){alert(thisText);
// //         document.getElementById("caseLibrary").contentWindow.queryCaseLibrary();
// //     }
// // });

$('.informationClose').on('click',function(){
    $('.informationDetailBox').hide();
    $('.informationDetail').show();
});
const typeInfos = $("#typeInfos").empty();
        $(`<li>
            <span>监测数据</span>
            <div class="BtnDetailTxt">
               <span code="M0001">中小河流</span>
               <span code="M0002">山洪沟</span>
               <span code="M0003">地灾隐患点</span>
               <span code="M0004">城镇易涝点</span>
               <span code="M0005">森林火险隐患点</span>
               <span code="M0006">建筑工地隐患点</span>
            </div>
        </li>`).appendTo(typeInfos)
        $(`<li>
            <span>基础数据</span>
            <div class="BtnDetailTxt">
               <span code="basedata" id="basedata">基本信息</span>
               <span code="M0019">救援物资</span>
               <span code="M0017">救援力量</span>
               <span code="M0018">救援专家</span>
               <span code="M0024">气象灾害责任人</span>
               <span code="M0026">气象信息员</span>
               <span code="M0025">网格责任人</span>
            </div>
        </li>`).appendTo(typeInfos);
$('.BtnDetailTxt span').on("click",function(){
    //弹出信息框
    //获取上面是否选中
    $('.spanActive').removeClass('spanActive');
    $(this).addClass('spanActive').siblings().removeClass('spanActive');
    $('.basicInformation').show();
    loadIndustryToBasicData();
    return false;
});
//菜单2,3级tab切换
$('.itemConBtn').find('li').on('click',function(){
    $(this).addClass('liAvtive').siblings().removeClass('liAvtive');
    $(this).parent().siblings().find('ul').eq($(this).index()).show().siblings().hide();
});
//防灾减灾 灾害类型li 点击事件
$(document).on('click','.warningIcon>li',function () {
    //防灾减灾
    var status = $('#color-input-red').is(':checked');
    var flag = $(this).hasClass("selectActive");
    if(flag) {
        $(this).removeClass("selectActive");
    } else {
        $(this).addClass("selectActive");
    }
    if(status){
        var disType = $(this).attr("data-code");
        var lastSelectAreaCode = $("#disProvince").val();
        if($("#disCity").val() !=''){
            lastSelectAreaCode = $("#disCity").val();
        }
        if($("#disCounty").val() !=''){
            lastSelectAreaCode =$("#disCounty").val()
        }
        var layerid = lastSelectAreaCode+"_MMINFO_" + disType + "_layer";
        var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
        if(oldLayer) {
            //oldLayer.setStyle(HPIINFOStyle);
            if($(this).hasClass("selectActive")) {
                oldLayer.setVisible(true);
            } else {
                oldLayer.setVisible(false);
            }

        }
    }
    //分级防御  color-input-red2
    var status1 = $('#color-input-red2').is(':checked');
    if(status1){
        var disType = $(this).attr("data-code");
        var lastSelectAreaCode = $("#disProvince").val();
        if($("#disCity").val() !=''){
            lastSelectAreaCode = $("#disCity").val();
        }
        if($("#disCounty").val() !=''){
            lastSelectAreaCode =$("#disCounty").val()
        }
        var layerid = lastSelectAreaCode+"_HPIINFO_" + disType + "_layer";
        var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
        if(oldLayer) {
            //oldLayer.setStyle(HPIINFOStyle);
            if($(this).hasClass("selectActive")) {
                oldLayer.setVisible(true);
            } else {
                oldLayer.setVisible(false);
            }
        }
    }
});
// 点击关闭按钮
$('.boxClose').on('click',function(){
    $(this).parent().parent().hide();
    $('.BtnDetailTxt .spanActive').removeClass('spanActive');
});
var isShow2 = true;
$('.liveClose').on('click',function(){
    $("#baseDataListTime").val(timeStamp2String(new Date()));
    $("#baseDataListTime1").val(timeStamp2String(new Date()));
    if(isShow2){
        $(this).attr('src','./images/boxClose.png');
        $('.showDetail').show();
        //$('.informationDetail').show();
        isShow2 = false;
    }else{
        $(this).attr('src','./images/expand.png');
        $('.showDetail').hide();
        $('.informationDetail').hide();
        //关闭子菜单
        let thisSelect=$('.showDetail').find('.liActive');
        if(thisSelect!=undefined){
            $('.showDetail').find('.liActive').find('span').eq(1).click();
        }
        //清空实况图层

        isShow2 = true;
    }
})
$('.alarmClose').on('click',function(){
    $('.alarmTable').show();
})
$('.alarmOpen').on('click',function(){
    let alarmWarnLayer = ol3_layerHelper.getLayerById(map,'alarmWarnLayer');
    if(alarmWarnLayer){
        map.removeLayer(alarmWarnLayer);
    }
    $('.alarmActive').removeClass('alarmActive');
    $('.alarmTable').hide();
})
// 点击工具栏
$('.mapTool').find('.boxClose').on('click',function(){
    $('.headerR>span').eq(3).attr('class','');
})

// 点击herder右部份按钮
$('.headerR>span').on('click',function(){
    if($(this).attr('class') == '' || $(this).attr('class') == undefined){
        initMsgType();
        initImpNoticeType();
        if($(this).index()>0){
            $(this).attr('class','spanActive');
        }
        switch ($(this).index()){
            case 5:
                //存储登录用户实例
               let data= JSON.parse(sessionStorage.getItem("user"));
               let obj={};
                obj.area_level=data.area_level;
                obj.areaCode=data.areaCode;
                obj.areaName=data.areaName;
                obj.latitude=data.latitude;
                obj.longitude=data.longitude;
                obj.orgunitCode=data.orgunitCode;
                //存储切换地区
                sessionStorage.setItem("curArea",JSON.stringify(obj));
                window.location.href="index.html";
                break;
            case 3:
                $('.mapTool').show();
                $('.changeZ').css('z-index',1);
                $('.mapTool').css('z-index',99);
                /**样式控制-----start**/
                $('.mapToolIcon>li>span').removeClass("notSpanActive");
                $('.mapToolIcon>li>span').removeClass("disabled");
                $('.mapToolIcon>li>span').addClass("cssHand");
                $('.size-c').eq(0).addClass("spanActive");
                /**样式控制-----end**/
                break;
            case 1:
                let now = new Date();
                $("#sendTime").val(now.Format("yyyy-MM-dd hh:mm"));
                $('#circle').show();
                // $('.mapTool').show();
                $('.changeZ').css('z-index',1);
                // $('.mapTool').css('z-index',99);
                $('.circle').css('z-index',99);
                /**样式控制-----start**/
                // $('.mapToolIcon>li>span').removeClass("cssHand");
                // $('.mapToolIcon>li>span').addClass("notSpanActive");
                // $('.mapToolIcon>li>span').addClass("disabled");
                $(".bxIcon").removeClass("disabled");
                $(".bxIcon").removeClass("notSpanActive");
                $(".bxIcon").addClass("cssHand");
                // $('.size-c').removeClass("spanActive");
                /**样式控制-----end**/
        }
    }else{
        if($(this).index()>0){
            $(this).attr('class','');
        }
        switch ($(this).index()){
            case 3:
                $('.mapTool').hide();
                drawLayer.clearFeatures();
                $('.mapToolIcon .spanAcative').removeClass('spanAcative');
                break;
            case 1:
                //清除靶向预警
                $('#circle').hide();
                $('.toolPop').hide();
                $('.mapTool').hide();
                drawPolygenAnalysis.clearAllFeatures();
                restSendWarningInfo();
                map.un('pointermove', drawPolygenAnalysis.pointerMoveHandler);
                map.un('click', drawPolygenAnalysis.addStartEvent);
                //清除一般信息
                resetSendGeneralInfo();
                //处理分析联动
                let color=$(".typeBtn").find("li").eq(0).find("span").attr("style");
                if(color.indexOf("rgb(255, 255, 255)")==-1){
                    $(".typeBtn").find("li").eq(0).find("span").attr("style","color:rgb(255, 255, 255)");
                }else{
                    clearGridLayers();
                }
        }
    }
})

//当前预警  展开关闭事件
$('.boxClose2').on('click',function(){
    var src = $(this).attr('src');
    if(src && src.indexOf('Close')>=0){
        $(this).attr('src','./images/expand.png');
        $(this).parents('.warningEventTitle').siblings().hide();
        $(this).parents('.warningEvent').css('width','200px');
    }else{
        $(this).attr('src','./images/boxClose.png');
        $(this).parents('.warningEventTitle').siblings().show();
        $(this).parents('.warningEvent').css('width','');
    }
    animatePosi();
});
//灾情风险分析 展开关闭事件
$('.expandOrClose').on('click',function(){
    var src = $(this).attr('src');
    if(src && src.indexOf('Close')>=0){
        $('.disInfo').css('width','200px')
        $(this).attr('src','./images/expand.png');
        $(".disaster_box").hide();
        $(".layerLegendBox").hide();
        $('.legendContent').hide();
        $('.gridLegend').hide();
        clearGridLayers();
        $('.warningHis').css('top',$('.warningInfo').offset().top + $('.disInfo').outerHeight(true))
    }else{
        $(this).attr('src','./images/boxClose.png');
        $('.disInfo').css('width','403px');
        $(".disaster_box").show();
        $('.warningHis').css('top',$('.warningInfo').offset().top + $('.disInfo').outerHeight(true))
        //加载要素的预报（格点或者落区）
        changeElement();
    }
});

//预警信息点击
$('.warnInfoOpen').on('click',function(){
    $('.currentWarning').show();
})
$('.warnInfoClose').on('click',function(){
    $('.currentWarning').hide();
})
//历史预警信息点击
$('.warnHisOpen').on('click',function(){
    $('.hisWarning').show();
    initWarnHis();
    loadHisWarn();
})
$('.warnHisClose').on('click',function(){
    $('.hisWarning').hide();
})
$('#disasterName3').on('click',function(){
    showDisTree3();
})
$(".ct4").on("click", function () {
    $("#divHisWarnAreaTree").hide();
});
$('#circleGrade2 span').on('click',function(){
    if($("#hisWarnDisLevel").val().indexOf($(this).data("key")) >= 0){
        $(this).removeClass('nthTdactive');
        $("#hisWarnDisLevel").val($("#hisWarnDisLevel").val().replace($(this).data("key") + ",", ""));
    } else {
        $(this).addClass('nthTdactive');
        $("#hisWarnDisLevel").val($("#hisWarnDisLevel").val() + $(this).data("key") + ",");
    }
})
$('#hisWarnAreaName').on('click',function(){
    $("#divHisWarnAreaTree").show();
})
$('#hisWarnQuery').on('click',function(){
    $("#hisWarnList").html("");
    hisWarnQueryPage = 1;
    hisWarnQueryTotal = 0;
    hisWarnQueryTotalPage = 1;
    $("#loadMoreHisWarn").hide();
    $("#noDataHisWarn").hide();
    loadHisWarn();
})
$('#hisWarnReset').on('click',function(){
    resetWarnHis();
    $("input[name='hisWarnType'][value='2']").prop("selected", "selected");
    $.fn.zTree.getZTreeObj("disasterTree3").checkAllNodes(false);
    $.fn.zTree.getZTreeObj("hisWarnAreaTree").checkAllNodes(false);
})
$('#loadMoreHisWarn').on('click',function(){
    loadHisWarn();
})

// 点击右下角按钮
var clickIndex = null
$('.operationMap>.operationMapItem').on('click',function(){
    if(clickIndex == $(this).index()){
        $('.mapType').hide();
        $('.informationDetail').hide();
        clickIndex = null
        return
    }
    switch ($(this).index()){
        case 0:
            $('.mapType').show();
            $('.changeZ').css('z-index',1);
            $('.mapType').css('z-index',99);
            $('.informationDetail').hide();
            break;
        case 1:
            $('.mapType').hide();
            $('.informationDetail').show();
            $('.changeZ').css('z-index',1);
            $('.informationDetail').css('z-index',99);
            break;
    }
    clickIndex = $(this).index();
})

//点击显示站点实况
$('.informationDetail').find('.showInformation').eq(0).on('click',function(){
    $('.informationDetailBox').show();
    $('.informationDetail').hide();
})

//防灾减灾 多选状态
$('.warningEventLayer').find('label').on('click',function(){
    if($(this).parent().find('.chat-button-location-radio-input').attr('class') == 'chat-button-location-radio-input'){
        $(this).parent().find('.chat-button-location-radio-input').addClass('chat-button-location-radio-inputActive')
    }else{
        $(this).parent().find('.chat-button-location-radio-input').removeClass('chat-button-location-radio-inputActive')
    }
    var mainMapStatus=false;
    var defenseStatus=false;
    //防灾减灾主图
    let mainMapclass=$('.warningEventLayer').find('div').eq(0).find("input").attr("class");
    if(mainMapclass.indexOf('chat-button-location-radio-inputActive')!=-1){
        mainMapStatus=true;
    }
    //分级防御
    let defenseclass=$('.warningEventLayer').find('div').eq(1).find("input").attr("class");
    if(defenseclass.indexOf('chat-button-location-radio-inputActive')!=-1){
        defenseStatus=true;
    }
    if(mainMapStatus&&defenseStatus){
        let allArr=[];
        let overArr=[];
        let arr=allArr.concat(mainMapExistDisTypeArr,defenseExistDisTypeArr);
        for(var i in arr){
            if($.inArray(arr[i],overArr)==-1){
                overArr.push(arr[i]);
            }
        }
        issueIsShowDisType(overArr);
    }else if(mainMapStatus&&!defenseStatus){
        issueIsShowDisType(mainMapExistDisTypeArr);
    }else if(!mainMapStatus&&defenseStatus){
        issueIsShowDisType(defenseExistDisTypeArr);
    }else if(!mainMapStatus&&!defenseStatus){
        issueIsShowDisType([]);
    }
    var selectObj = $(".warningIcon .selectActive");
    for(let i=0;i<selectObj.length;i++){
        let disType = $(selectObj[i]).attr('data-code');
        var lastSelectAreaCode = $("#disProvince").val();
        if($("#disCity").val() !=''){
            lastSelectAreaCode = $("#disCity").val();
        }
        if($("#disCounty").val() !=''){
            lastSelectAreaCode =$("#disCounty").val()
        }
        var layerid = lastSelectAreaCode+"_MMINFO_" + disType + "_layer";
        var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
        if(oldLayer) {
            //oldLayer.setStyle(HPIINFOStyle);
            if($(selectObj[i]).hasClass("selectActive") && mainMapStatus) {
                oldLayer.setVisible(true);
            }else{
                oldLayer.setVisible(false);
            }
        }
        var layerid1 = lastSelectAreaCode+"_HPIINFO_" + disType + "_layer";
        var oldLayer1 = ol3_layerHelper.getLayerById(map, layerid1);
        if(oldLayer1) {
            if($(selectObj[i]).hasClass("selectActive") && defenseStatus) {
                oldLayer1.setVisible(true);
            } else {
                oldLayer1.setVisible(false);
            }

        }
    }
});

$(document).on("click",'.showDetail>li',function(){
    let thisClass=$(this).attr('class');//获取选中状态
    let type=$("#loadTypeBtn").text();//获取类型 预报/监测
    let element = $(this).find('span').eq(1).text();
    if(!thisClass.includes('liActive')){
        $(this).addClass('liActive').siblings().removeClass('liActive');
        if(type.includes("预报")){
            $(".forecastTime").show();
            if(element.includes('天气现象')){
                getForcastTime('W00027');
            }else if(element.includes('温度')){
                getForcastTime('W00028');
            }else if(element.includes('降水')){
                getForcastTime('W00029');
            }else if(element.includes('风')){
                getForcastTime('W00032');
            }else if(element.includes('相对湿度')){
                getForcastTime('W00035');
            }else if(element.includes('能见度')){
                getForcastTime('W00036');
            }else if(element.includes('体感温度')){
                getForcastTime('W00037');
            }
        }else if(type.includes("监测")){
            if(element.includes('温度')||element.includes('降水')||element.includes('风力风向')||element.includes('能见度')) {
                ShowDetailTypeHtml(element);
            }else{
                $(".showDetailType>li").each(function (i) {
                   let curClass=$(this).attr("class");
                   if(curClass.includes("liActive")){
                       $(this).click();
                   }
                });
                $(".showDetailType").hide();
            }
                //下角标是7、8对应雷达图、云图
                var index=$(this).index();
                if(index!=7&&index!=8&&index!=0&&index!=1&&index!=3&&index!=4){
                    if($('.informationDetailBox').css('display')=='none' && $('.informationDetail').css('display')=='none'){
                        $('.informationDetail').css('display','block');
                    }
                    layer.load(0, {
                        shade: [0.2, '#000']
                    });
                    setTimeout( () => {
                        loadElementData();
                    },500);
                }
        }
    }else{
        $(this).removeClass('liActive');
        if(type.includes("预报")){
            $(".forecastTimeDiv").hide();
            $('#stationLegend').hide();//隐藏图例
            clearForcastGridLayer();
        }else if(type.includes("监测")){
            var contorPolygon= ol3_layerHelper.getLayerById(map,"contorPolygon");
            if(contorPolygon){
                map.removeLayer(contorPolygon);
            }
            $('#stationLegend').hide();
            $('.radarLegend').hide();
            $(".showDetailType").hide();
            $('.informationDetail').hide();
            if(element.indexOf('温度')>=0 || element.indexOf('降水')>=0 || element.indexOf('相对湿度')>=0 || element.indexOf('风力风向')>=0 || element.indexOf('能见度')>=0){
                var liveDataLayer = ol3_layerHelper.getLayerById(map, 'liveDataLayer');
                if(liveDataLayer) {
                    map.removeLayer(liveDataLayer);
                }
            }else if(element.indexOf('AQI')>=0){
                var liveDataLayer = ol3_layerHelper.getLayerById(map, 'liveDataLayer');
                if(liveDataLayer) {
                    map.removeLayer(liveDataLayer);
                }
            }else if(element.indexOf('云图')>=0){
                $('#timeline_cloud_box').removeClass('active');
                var cloudLayer = ol3_layerHelper.getLayerById(map, 'cloudLayer');
                if(cloudLayer) {
                    map.removeLayer(cloudLayer);
                }
            }else if(element.indexOf('雷达图')>=0){
                $('#timeline_box').removeClass('active');
                var radarLayer = ol3_layerHelper.getLayerById(map, 'radarLayer');
                if(radarLayer) {
                    map.removeLayer(radarLayer);
                }
            }else if(element.indexOf('台风')>=0){
                $('.typhoonBox').hide();
                hideTyphoonLayer();
            }
        }
    }
});
$(document).on('click','#circleUlbar li',function() {
    $('#circleUlbar li').removeClass('circleBarActive');
    $(this).addClass('circleBarActive');
    if($(this).attr('class').indexOf('target')>=0){//靶向预警
        $('#circleContent_general').hide();
        $('#circleContent_importantNotice').hide();
        $("#yuanPersonDiv").show();
        $('#circleContent').show();
        $('#circleContent .' + $(this).index()).fadeIn();
    }else if($(this).attr('class').indexOf('general')>=0){//一般信息
        $('#circleContent').hide();
        $("#yuanPersonDiv").hide();
        $('#circleContent_importantNotice').hide();
        $('#circleContent_general').show();
        $('#circleContent_general .' + $(this).index()).fadeIn();
        initMsgType();
    }else if($(this).attr('class').indexOf('importantNotice')>=0){//重要通知
        $('#circleContent').hide();
        $("#yuanPersonDiv").hide();
        $('#circleContent_general').hide();
        $('#circleContent_importantNotice').show();
        $('#circleContent_general .' + $(this).index()).fadeIn();
        initImpNoticeType();
    }
});
function ShowDetailTypeHtml(element) {
    let html="";
    if(element.includes('温度')){
        html+='<li class="" type="minute" code="temp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>分钟温度</span>';
        html+='</li>';
        html+='<li class="" type="now">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>当前温度</span>';
        html+='</li>';
        html+='<li class="" code="maxtemp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近1小时最高温</span>';
        html+='</li>';
        html+='<li class="" code="mintemp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近1小时最低温</span>';
        html+='</li>';
        html+='<li class="" code="maxtemp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>今日以来最高温</span>';
        html+='</li>';
        html+='<li class="" code="mintemp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>今日以来最低温</span>';
        html+='</li>';
        html+='<li class="" code="maxtemp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近24小时最高温</span>';
        html+='</li>';
        html+='<li class="" code="mintemp">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近24小时最低温</span>';
        html+='</li>';
    }else if(element.includes('降水')){
        html+='<li class="" type="minute"  code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>分钟降水</span>';
        html+='</li>';
        html+='<li class="" type="now">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>当前降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近3小时降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近6小时降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近12小时降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近24小时降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近1天降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近2天降水</span>';
        html+='</li>';
        html+='<li class="" code="rianamount">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近3天降水</span>';
        html+='</li>';
    }else if(element.includes('风力风向')){
        html+='<li class="" type="now">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>当前风力风向</span>';
        html+='</li>';
        html+='<li class="" code="exmaxwindv">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近1小时极大风</span>';
        html+='</li>';
        html+='<li class="" code="exmaxwindv">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>今日以来极大风</span>';
        html+='</li>';
        html+='<li class="" code="exmaxwindv">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近24小时极大风</span>';
        html+='</li>';
    }else if(element.includes('能见度')){
        html+='<li class="" type="now">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>当前能见度</span>';
        html+='</li>';
        html+='<li class="" code="minvisib">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近1小时最低能见度</span>';
        html+='</li>';
        html+='<li class="" code="minvisib">';
        html+='<span><img src="./images/viewIcon1.png" alt=""><img src="./images/viewIcon1Active.png" alt=""></span>';
        html+='<span>近24小时最低能见度</span>';
        html+='</li>';
    }
    $(".showDetailType").empty().append(html);
    $(".showDetailType").show();
}

function computeWidth(){
    var boxWidth = 0
    for(var i = 0 ; i < $('.footBtnDetail>ul').find('li').length; i++){
        console.log($('.footBtnDetail>ul').find('li').eq(i).outerWidth(true))
        boxWidth += $('.footBtnDetail>ul').find('li').eq(i).outerWidth(true)
    }
    $('.footBtnDetail>ul').css('width',boxWidth)
}
// computeWidth()
// footer点击事件
$(document).on("click",".footBtnDetail ul>li",function () {
    if($(this).find('.BtnDetailTxt').css('display') == 'none'){
        $(this).find('.BtnDetailTxt').css('display','inline-block')
    }else{
        $(this).find('.BtnDetailTxt').css('display','none')
    }
    computeWidth()
});

$($('.BtnDetailTxt').find('span')).on('click',function(){
    $(this).addClass('spanActive').siblings().removeClass('spanActive')
    $('.basicInformation').show();
    $('.changeZ').css('z-index',1);
    $('.basicInformation').css('z-index',99);
    return false
})

var move = 0
$('.leftBtn').find('span').eq(1).on('click',function(){
    if($('.footBtnDetail>ul').outerWidth(true) > $('.footBtnDetail').outerWidth(true)){
        if($('.footBtnDetail>ul').outerWidth(true) >= $('.footBtnDetail').outerWidth(true) + Math.abs(move)){
            move -= 100
            $('.footBtnDetail').find('ul').animate({'left':move})
        }
    }else{
        $('.footBtnDetail').find('ul').animate({'left':-50}).animate({'left':move})
    }
})
$('.leftBtn').find('span').eq(0).on('click',function(){
    if($('.footBtnDetail>ul').outerWidth(true) > $('.footBtnDetail').outerWidth(true)){
        move = -($('.footBtnDetail>ul').outerWidth(true) - $('.footBtnDetail').outerWidth(true))
        $('.footBtnDetail').find('ul').animate({'left':-($('.footBtnDetail>ul').outerWidth(true) - $('.footBtnDetail').outerWidth(true))})
    }else{
        $('.footBtnDetail').find('ul').animate({'left':-50}).animate({'left':move})
    }
})
$('.rightBtn').find('span').eq(0).on('click',function(){
    if($('.footBtnDetail>ul').outerWidth(true) > $('.footBtnDetail').outerWidth(true)){
        if(move < 0){
            move += 100
            $('.footBtnDetail').find('ul').animate({'left':move})
        }
    }else{
        $('.footBtnDetail').find('ul').animate({'left':50}).animate({'left':move})
    }
})
$('.rightBtn').find('span').eq(1).on('click',function(){
    if($('.footBtnDetail>ul').outerWidth(true) > $('.footBtnDetail').outerWidth(true)){
        move = 0
        $('.footBtnDetail').find('ul').animate({'left':'0px'})
    }else{
        $('.footBtnDetail').find('ul').animate({'left':50}).animate({'left':move})
    }
})

var currentIsShow = true
$('.boxClose3').on('click',function(){
    if(currentIsShow){
        $(this).parents('.warningEventTitle').siblings('.warningEventLayer').hide()
        $(this).parents('.currentWarning').css({'max-height': '40px','top':'65px','width': '200px'})
        currentIsShow = false
    }else{
        $(this).parents('.warningEventTitle').siblings('.warningEventLayer').show()
        $(this).parents('.currentWarning').css({'max-height': '4000px','top':'15px','width': '27%'})
        currentIsShow = true
    }
})
$('.checkBoxBtn2').on('click',function() {
    if($(this).siblings().attr('class') == 'chat-button-location-radio-input'){
        $(this).siblings().addClass('chat-button-location-radio-inputActive')
        $('.checkBoxBtn3').siblings().addClass('chat-button-location-radio-inputActive');
        let nowLayer = ol3_layerHelper.getLayerById(map,'clickEffectiveWarningLayer');
        if(nowLayer){
            map.removeLayer(nowLayer);
        }
        let nowLayer1 = ol3_layerHelper.getLayerById(map,'clickWarningColorLayer');
        if(nowLayer1){
            map.removeLayer(nowLayer1);
        }
        showWarnInMapNew();
    }else{
        $(this).siblings().removeClass('chat-button-location-radio-inputActive')
        $('.checkBoxBtn3').siblings().removeClass('chat-button-location-radio-inputActive');
        hideLayer('effectiveWarningLayer');
        hideLayer('warningColorLayer');
        let nowLayer = ol3_layerHelper.getLayerById(map,'effectiveWarningLayer');
        if(nowLayer){
            map.removeLayer(nowLayer);
        }
        let nowLayer1 = ol3_layerHelper.getLayerById(map,'warningColorLayer');
        if(nowLayer1){
            map.removeLayer(nowLayer1);
        }
        warnSignalOverlay.setPosition(undefined);
    }
})
$('.checkBoxBtn3').on('click',function(){
    if($(this).siblings().attr('class') == 'chat-button-location-radio-input'){
        $(this).siblings().addClass('chat-button-location-radio-inputActive')
        $('.checkBoxBtn2').siblings().addClass('chat-button-location-radio-inputActive')
        showWarnInMapNew();
    }else{
        $(this).siblings().removeClass('chat-button-location-radio-inputActive')
        $('.checkBoxBtn2').siblings().removeClass('chat-button-location-radio-inputActive');
        hideLayer('effectiveWarningLayer');
        hideLayer('warningColorLayer');
        let nowLayer = ol3_layerHelper.getLayerById(map,'effectiveWarningLayer');
        if(nowLayer){
            map.removeLayer(nowLayer);
        }
        let nowLayer1 = ol3_layerHelper.getLayerById(map,'warningColorLayer');
        if(nowLayer1){
            map.removeLayer(nowLayer1);
        }
        warnSignalOverlay.setPosition(undefined);
    }
});

function warnClickFZJZ(){
    var status = $('#color-input-red3').is(':checked');
    var status1 = $('#color-input-red4').is(':checked');
    var selectObj = $(".selectActiveDiv");
    for(let i=0;i<selectObj.length;i++){
        let disType = $(selectObj[i]).attr('code');
        var lastSelectAreaCode = $('.currentWarningDetailBtn .divAc').attr('code');
        if($("#disCity").val() !=''){
            lastSelectAreaCode = $("#disCity").val();
        }
        if($("#disCounty").val() !=''){
            lastSelectAreaCode =$("#disCounty").val()
        }
        var layerid = lastSelectAreaCode+"_MMINFO_" + disType + "_layer";
        var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
        if(oldLayer) {
            //oldLayer.setStyle(HPIINFOStyle);
            if($(selectObj[i]).hasClass("selectActive") && status) {
                oldLayer.setVisible(true);
            } else {
                oldLayer.setVisible(false);
            }

        }
        var layerid1 = lastSelectAreaCode+"_HPIINFO_" + disType + "_layer";
        var oldLayer1 = ol3_layerHelper.getLayerById(map, layerid1);
        if(oldLayer1) {
            //oldLayer.setStyle(HPIINFOStyle);
            if($(selectObj[i]).hasClass("selectActive") && status1) {
                oldLayer1.setVisible(true);
            } else {
                oldLayer1.setVisible(false);
            }

        }
    }
}
$('.currentWarningDetailBtn').on('click','div',function(){
    $(this).addClass('divAc').siblings().removeClass('divAc')
    $('.currentWarningDetailItem').eq($(this).index()).show().siblings().hide()
})

var isShowMore = true;
$('.isShow').find('img').on('click',function() {
    if(isShowMore){
        $(this).css('transform','rotate(-90deg)')
        $('.warningIcon').css({'height':'auto'})
        isShowMore = false
    }else{
        $(this).css('transform','rotate(90deg)')
        $('.warningIcon').css({'height':'auto'})
        isShowMore = true
    }
    animatePosi();
})
/**防灾减灾判断显示的灾情类型*/
function issueIsShowDisType(existDisTypeArr) {
    $(".warningIcon").empty();
    let warningIconHtml="";
    if($.inArray('11B01',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B01">';
        warningIconHtml+='<img src="./images/taifeng.png" alt="">';
        warningIconHtml+='<span>台风</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B17',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B17">';
        warningIconHtml+='<img src="./images/dawu.png" alt="">';
        warningIconHtml+='<span>大雾</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B16',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B16">';
        warningIconHtml+='<img src="./images/shuangdong.png" alt="">';
        warningIconHtml+='<span>霜冻</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B02',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B02">';
        warningIconHtml+='<img src="./images/longjuanfeng.png" alt="">';
        warningIconHtml+='<span>龙卷风</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B19',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B19">';
        warningIconHtml+='<img src="./images/mai.png" alt="">';
        warningIconHtml+='<span>霾</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B32',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B32">';
        warningIconHtml+='<img src="./images/chouyang.png" alt="">';
        warningIconHtml+='<span>臭氧</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B03',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B03">';
        warningIconHtml+='<img src="./images/baoyu.png" alt="">';
        warningIconHtml+='<span>暴雨</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B20',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B20">';
        warningIconHtml+='<img src="./images/leiyudafeng.png" alt="">';
        warningIconHtml+='<span>雷雨大风</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B33',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B33">';
        warningIconHtml+='<img src="./images/daxue.png" alt="">';
        warningIconHtml+='<span>大雪</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B04',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B04">';
        warningIconHtml+='<img src="./images/baoxue.png" alt="">';
        warningIconHtml+='<span>暴雪</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B21',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B21">';
        warningIconHtml+='<img src="./images/daolujiebing.png" alt="">';
        warningIconHtml+='<span>道路结冰</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B34',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B34">';
        warningIconHtml+='<img src="./images/hanleng.png" alt="">';
        warningIconHtml+='<span>寒冷</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B05',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B05">';
        warningIconHtml+='<img src="./images/hanchao.png" alt="">';
        warningIconHtml+='<span>寒潮</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B22',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B22">';
        warningIconHtml+='<img src="./images/ganhan.png" alt="">';
        warningIconHtml+='<span>干旱</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B35',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B35">';
        warningIconHtml+='<img src="./images/lianyinyu.png" alt="">';
        warningIconHtml+='<span>连阴雨</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B06',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B06">';
        warningIconHtml+='<img src="./images/dafeng.png" alt="">';
        warningIconHtml+='<span>大风</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B23',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B23">';
        warningIconHtml+='<img src="./images/haishangdafeng.png" alt="">';
        warningIconHtml+='<span>海上大风</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B08',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B08">';
        warningIconHtml+='<img src="./images/hanleng.png" alt="">';
        warningIconHtml+='<span>低温</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B07',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B07">';
        warningIconHtml+='<img src="./images/shachenbao.png" alt="">';
        warningIconHtml+='<span>沙尘暴</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B24',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B24">';
        warningIconHtml+='<img src="./images/gaowenzhongshu.png" alt="">';
        warningIconHtml+='<span>高温中暑</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B27',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B27">';
        warningIconHtml+='<img src="./images/bingdong.png" alt="">';
        warningIconHtml+='<span>冰冻</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B24',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B24">';
        warningIconHtml+='<img src="./images/gaowen.png" alt="">';
        warningIconHtml+='<span>高温</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B25',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B25">';
        warningIconHtml+='<img src="./images/senlinhuoxian.png" alt="">';
        warningIconHtml+='<span>森林火险</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B08',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B08">';
        warningIconHtml+='<img src="./images/donghai.png" alt="">';
        warningIconHtml+='<span>冻害</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B10',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B10">';
        warningIconHtml+='<img src="./images/relang.png" alt="">';
        warningIconHtml+='<span>热浪</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B26',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B26">';
        warningIconHtml+='<img src="./images/caoyuanhuoxian.png" alt="">';
        warningIconHtml+='<span>草原火险</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B12',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B12">';
        warningIconHtml+='<img src="./images/xiajibaoliu.png" alt="">';
        warningIconHtml+='<span>下击暴流</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B11',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B11">';
        warningIconHtml+='<img src="./images/ganrefeng.png" alt="">';
        warningIconHtml+='<span>干热风</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B28',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B28">';
        warningIconHtml+='<img src="./images/kongjiantianqi.png" alt="">';
        warningIconHtml+='<span>空间天气</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B18',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B18">';
        warningIconHtml+='<img src="./images/dikongfengqiebian.png" alt="">';
        warningIconHtml+='<span>低空风切变</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B13',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B13">';
        warningIconHtml+='<img src="./images/xuebeng.png" alt="">';
        warningIconHtml+='<span>雪崩</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B29',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B29">';
        warningIconHtml+='<img src="./images/zhongwuran.png" alt="">';
        warningIconHtml+='<span>重污染</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B30',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B30">';
        warningIconHtml+='<img src="./images/diwenyuxue.png" alt="">';
        warningIconHtml+='<span>低温雨雪</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B14',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B14">';
        warningIconHtml+='<img src="./images/leidian.png" alt="">';
        warningIconHtml+='<span>雷电</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B31',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B31">';
        warningIconHtml+='<img src="./images/qiangduiliu.png" alt="">';
        warningIconHtml+='<span>强对流</span>';
        warningIconHtml+='</li>';
    }

    if($.inArray('11B15',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B15">';
        warningIconHtml+='<img src="./images/bingbao.png" alt="">';
        warningIconHtml+='<span>冰雹</span>';
        warningIconHtml+='</li>';
    }
    if($.inArray('11B99',existDisTypeArr)!=-1){
        warningIconHtml+='<li data-code="11B99">';
        warningIconHtml+='<span>其他气象灾害</span>';
        warningIconHtml+='</li>';
    }
    $(".warningIcon").append(warningIconHtml);
    animatePosi();//重新加载样式
}
function animatePosi(){
    var moveH = $('.warningEvent').outerHeight(true);
    $('.warningInfo').css('top',moveH+25 + 'px');
    $('.disInfo').css('top',moveH+75 + 'px');
    $('.warningHis').css('top',$('.warningInfo').offset().top + $('.disInfo').outerHeight(true))
}

/**
 * 路线规划点击事件
 */
$("#daohang").click(function () {
    let status=$(".Navigation_simple").css("display");
    $('.changeZ').css('z-index',1);
    $(".Navigation_simple").css("z-index",99);
    if(status=='none'){
        $(".Navigation_simple").css("display","block");
        $(".tool-avoid").css("display","block");
        let startInput=$("#startInput").val();
        let endInput=$("#endInput").val();
        if('在地图选择起点'!=startInput&&'在地图选择起点'!=endInput){
            $(".route-start").click();
        }
    }else{
        $(".Navigation_simple").css("display","none");
        cleanRoadNivaData();
        clearTablestatics();
        map.un('click', addStartEvent);
        map.un('click', addEndEvent);
        map.un('pointermove', pointerMoveHandler);
        map.getOverlayById("helpTooltip").setPosition(undefined);
    }
});

$(".typeBtn li").click(function () {
    let width=$(".layerLegendBox").outerWidth();
    let index=$(this).index();
    let value=$(this).find('span').text();
    let color=$(this).find('span').css("color");
    //全部隐藏
    let thisClass=$(".headerR").find("span").eq(1).attr("class");
    if(thisClass=='spanActive'){
        $(".headerR").find("span").eq(1).click();//靶向预警 隐藏
    }
    closeNavigation();//避灾导航隐藏
    $(".Library_information").hide();//应急预案|案例库 隐藏
    $(".basicInformation").hide();//基础数据隐藏

    //图标重置成未选中状态
    $(".typeBtn li").eq(0).find('img').attr("src","./images/pageTitleIcon2.png");
    $(".typeBtn li").eq(1).find('img').attr("src","./images/Routeplanning.png");
    $(".typeBtn li").eq(2).find('img').attr("src","./images/library.png");
    $(".typeBtn li").eq(3).find('img').attr("src","./images/library.png");
    $(".typeBtn li").eq(4).find('img').attr("src","./images/library.png");
    if(color=='rgb(255, 255, 255)'){//显示
        $(this).siblings().find('span').css("color","rgb(255 255 255)");
        $(this).find('span').css("color","rgb(243 190 94)");
        if(index==0&&value=='靶向预警'){
            layer.load(0, {
                shade: [0.2, '#000']
            });
            $(this).find('img').attr("src","./images/pageTitleIcon2Active.png");
            $(".headerR").find("span").eq(1).click();
            //预警
            moudleType='yj';
            countyArr=[];
            issuePolygon(curfeatures,null,'intersects');
        }else if(index==1&&value=='避灾导航'){
                $(".Navigation_route").show();
                $(".Navigation_route").css("width",width+"px");
                $(this).find('img').attr("src","./images/Routeplanning_active.png");
        }else if(index==2&&value=='应急预案'){
                $(".expertPool").find('span').text('应急预案');
                $(".Library_information").css("width",width+"px");
                $(".search_btn").attr("type",'yakprocess');
                showDetailInfo('yakprocess');
                $(".Library_information").show();
                $(this).find('img').attr("src","./images/library_active.png");
        }else if(index==3&&value=='案例库'){
                $(".expertPool").find('span').text('案例库');
                $(".Library_information").css("width",width+"px");
                $(".search_btn").attr("type",'caseBase');
                showDetailInfo('caseBase');
                $(".Library_information").show();
            $(this).find('img').attr("src","./images/library_active.png");
        }else if(index==4&&value=='基础数据'){
                $('#basedata').click();
                $(".basicInformation").css("width",width+"px");
                $(this).find('img').attr("src","./images/library_active.png");
        }
    }else{//隐藏
        $(this).find('span').css("color","rgb(255 255 255)");
    }
});

$("#personFX").find("span").on("click",function () {
    let thisId=$(this).prop("id");
    let title;
    if(thisId=='zhPerson'){
        title="气象灾害责任人列表";
    }else if(thisId=='wgPerson'){
        title="网格责任人列表";
    }else if(thisId=='qxPerson'){
        title="气象信息员列表";
    }else if(thisId=='yuanPerson'){
        title="预案责任人列表";
    }
    layer.open({
        type: 2,
        skin: 'layer-ext-my1skin', //
        title:title,
        offset: ['8%', '65%'],
        // scrollbar: false, //  滚动条 禁止
        // closeBtn: 0,
        area: ['30%', '85%'], //宽高
        content: './page/personList.html?type='+thisId
    });
});

function initWarnHis() {
    resetWarnHis();
    initHisWarnAreaTree();
}
function initHisWarnAreaTree(){
    var treeSetting = {
        check: {
            enable: true,
            chkStyle : "checkbox",
            chkboxType : {
                "Y" : "s",
                "N" : "s"
            }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: function (e, treeId, treeNode) {
                var areaName = "";
                var areaCode = "";
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                var nodesCheck = treeObj.getCheckedNodes(true);
                for(let i = 0; i < nodesCheck.length; i ++){
                    areaName += nodesCheck[i].name + ",";
                    areaCode += nodesCheck[i].id + ",";
                }
                if(areaName.length > 0){
                    areaName = areaName.substring(0, areaName.length - 1)
                }
                if(areaCode.length > 0){
                    areaCode = areaCode.substring(0, areaCode.length - 1)
                }
                $("#hisWarnAreaName").val(areaName);
                $("#hisWarnAreaCode").val(areaCode);
            },
        }
    };
    var userInfo = JSON.parse(sessionStorage.getItem("curArea"));
    var areaCode = userInfo.areaCode;
    $.ajax({
        type: "get",
        url: config.base.baseUrl + "/bas/common/queryAreaTree",
        data: {"areaCode":areaCode},
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (result.code == 0) {
                var data = result.data;
                var list = [];
                for(let i = 0; i < data.length; i ++){
                    var obj = {};
                    obj.id = data[i].areacode;
                    obj.name = data[i].areaname;
                    obj.pId = data[i].parentcode;
                    list.push(obj);
                    for(let j = 0; j < data[i].children.length; j ++){
                        var obj = {};
                        obj.id = data[i].children[j].areacode;
                        obj.name = data[i].children[j].areaname;
                        obj.pId = data[i].children[j].parentcode;
                        list.push(obj);
                    }
                }
                $.fn.zTree.init($("#hisWarnAreaTree"), treeSetting, list);
            }
        },
    })
}
function resetWarnHis(){
    var today = new Date();
    today.setMonth(today.getMonth() - 1);
    var yearStart = today.getFullYear();
    var monthStart = today.getMonth() + 1;
    var dayStart = today.getDate();
    var hourStart = today.getHours();
    var minuteStart = today.getMinutes();
    var secondStart = today.getSeconds();
    today = new Date();
    var yearEnd = today.getFullYear();
    var monthEnd = today.getMonth() + 1;
    var dayEnd = today.getDate();
    var hourEnd = today.getHours();
    var minuteEnd = today.getMinutes();
    var secondEnd = today.getSeconds();
    var strStart="";
    strStart+= yearStart + "-";
    strStart+= (monthStart < 10 ? "0" + monthStart : monthStart) + "-";
    strStart+= (dayStart < 10 ? "0" + dayStart : dayStart)+' ';
    strStart+= (hourStart < 10 ? "0" + hourStart : hourStart)+":";
    strStart+= (minuteStart < 10 ? "0" + minuteStart : minuteStart)+":";
    strStart+= (secondStart < 10 ? "0" + secondStart : secondStart);

    var strEnd ="";
    strEnd+=yearEnd + "-" + (monthEnd < 10 ? "0" + monthEnd : monthEnd) + "-";
    strEnd+= (dayEnd < 10 ? "0" + dayEnd : dayEnd)+' ';
    strEnd+= (hourEnd < 10 ? "0" + hourEnd : hourEnd)+":";
    strEnd+= (minuteEnd < 10 ? "0" + minuteEnd : minuteEnd)+":";
    strEnd+= (secondEnd < 10 ? "0" + secondEnd : secondEnd);
    $("#hisWarnStartDate").val(strStart);
    $("#hisWarnEndDate").val(strEnd);

    $("#disasterCode3").val("");
    $("#disasterName3").val("");
    $("#hisWarnDisLevel").val("");
    $('#circleGrade2 span').removeClass('nthTdactive');

    $("#hisWarnAreaCode").val("");
    $("#hisWarnAreaName").val("");

    hisWarnQueryPage = 1;
    hisWarnQueryTotal = 0;
    hisWarnQueryTotalPage = 1;
}
var hisWarnQueryPage = 1;
var hisWarnQueryTotal = 0;
var hisWarnQueryTotalPage = 1;
function loadHisWarn(){
    var startDate = $("#hisWarnStartDate").val();
    var endDate = $("#hisWarnEndDate").val();
    var disasterCode = $("#disasterCode3").val();
    var colorLevel = $("#hisWarnDisLevel").val();
    let isCancel = $('input:radio[name="isCancel"]:checked').val();
    if(isCancel=='1'){
        isCancel = true;
    }else{
        isCancel = false;
    }
    if(colorLevel.length > 0){
        colorLevel = colorLevel.substring(0, colorLevel.length - 1);
    }
    if(disasterCode == ""){
        disasterCode = null;
    }
    if(colorLevel == ""){
        colorLevel = null;
    }
    var userInfo = JSON.parse(sessionStorage.getItem("curArea"));
    var areaCode = $("#hisWarnAreaCode").val();
    var isChildrens = false;
    if(areaCode == ""){
        areaCode = userInfo.areaCode;
        isChildrens = true;
    }
    var alarmType =$("[name='hisWarnType'] option:checked").val();
    if(alarmType==''){
        alarmType=undefined;
    }
    var params = {
        'areaCode': areaCode,
        'alarmType': alarmType,
        'isChildrens': isChildrens,
        'startDate':new Date(startDate).Format('yyyyMMddhhmmss'),
        'endDate':new Date(endDate).Format('yyyyMMddhhmmss'),
        'disasterCode':disasterCode,
        'includeCancel':isCancel,
        'colorLevel':colorLevel,
        'offset':(hisWarnQueryPage - 1) * 10,
        'limit':10
    };
    config.api.baseDataParam.params = JSON.stringify(params);
    config.api.baseDataParam.interfaceCode = 'A0002';
    $.ajax({
        type: "post",
        cache: false,
        data: config.api.baseDataParam,
        url: config.api.baseUrl,
        dataType: config.dataType,
        hrFields: {
            withCredentials: true
        },
        success: function (result) {
            let code = result.returnCode;
            if (code == '0') {
                if(hisWarnQueryPage == 1){
                    hisWarnQueryTotal = result.total;
                    hisWarnQueryTotalPage = hisWarnQueryTotal % 10 > 0 || hisWarnQueryTotal < 10  ? parseInt(hisWarnQueryTotal / 10) + 1 : parseInt(hisWarnQueryTotal / 10);
                    $("#hisWarnCount").text(result.total+"条");
                }
                var data = result.data;
                const warnings = data.map(item=>{
                    const alert = item.alert;
                    let eventType = item.alert.info.eventType;//灾害类型
                    let severity = item.alert.info.severity;//等级
                    let img = "./images/featureImage/warnImg/"+eventType+'_'+severity.toUpperCase()+".jpg";
                    let errorImg = './images/featureImage/warnImg/common_'+severity.toUpperCase()+".jpg";
                    if(severity=='Unknown'){
                        img = './images/featureImage/warnImg/common_UNKNOWN.jpg';
                        errorImg = './images/featureImage/warnImg/common_UNKNOWN.jpg';
                    }
                    let description = item.alert.info.description;//描述
                    return {
                        identifier:alert.identifier,
                        message:alert.code.method[0].message,
                        senderCode:alert.senderCode,
                        sendTime:alert.sendTime.split('+')[0],
                        sender:alert.sender,
                        severity:alert.info.severity,
                        affectareas:alert.info.area.geocode,
                        headline:alert.info.headline,
                        eventType:alert.info.eventType,
                        sendAreaCode:alert.senderCode.substr(0, 6) + "000000",
                        img:img,
                        errorImg:errorImg,
                        description:description
                    };
                });
                warnings.forEach(warn => {
                    var item =$(`
                                    <li class="hisWarnDetailItem">
                                        <div class='currentWarningDetailItemCon'>
                                            <p>${warn.headline}<a style="color:#a29e9f;cursor:pointer;" onclick="yjya('${warn.severity}','${warn.identifier}','${warn.eventType}',true)">应急预案</a></p>
                                            <p>发布时间:${warn.sendTime}</p>
                                            <img src="${warn.img}" errorImg="${warn.errorImg}" onerror="imgError(event);">
                                            <p>${warn.description}</p>
                                        </div>
                                    </li>
                                `)
                    item.data("warn",warn)
                    item.appendTo($("#hisWarnList"));
                })
                $('.hisWarnDetailItem').on('click',function() {
                    let className = $(this).attr('class');
                    if (className && className.indexOf('selectActiveDiv') >= 0) {
                        $('.selectActiveDiv').removeClass('selectActiveDiv');
                        var oldLayer = ol3_layerHelper.getLayerById(map, 'hisClickEffectiveWarningLayer');
                        if (oldLayer) {
                            map.removeLayer(oldLayer);
                        }
                        var lid = "clickWarningColorLayer";
                        oldLayer = ol3_layerHelper.getLayerById(map, 'hisClickWarningColorLayer');
                        if (oldLayer) {
                            map.removeLayer(oldLayer);
                        }
                        //隐藏预警图标图层
                        hiddenOrShowLayer('hisClickEffectiveWarningLayer', true);
                        //隐藏涂色图层
                        hiddenOrShowLayer("hisWarningColorLayer", true);
                        warnSignalOverlay.setPosition(undefined);
                    } else {
                        $('.selectActiveDiv').removeClass('selectActiveDiv');
                        $(this).addClass('selectActiveDiv');
                        let warn = $(this).data('warn');
                        hisWarningClickCallBack(warn);
                    }
                });
                if(hisWarnQueryPage >= hisWarnQueryTotalPage){
                    $("#loadMoreHisWarn").hide();
                    $("#noDataHisWarn").show();
                } else {
                    $("#loadMoreHisWarn").show();
                }
                hisWarnQueryPage++;
            }
        }
    });
}
function getMonthBetween(start,end){
    var result = [];
    var s = start.split("-");
    var e = end.split("-");
    var min = new Date();
    var max = new Date();
    min.setFullYear(s[0],s[1]);
    max.setFullYear(e[0],e[1]);
    console.log(e[0]+"---- "+e[1]);
    var curr = min;
    while(curr <= max){
        var month = curr.getMonth();
        //month=month==0?12:month;
        console.log(month);
        var str=curr.getFullYear()+"-"+(month);
        var s=curr.getFullYear()+"-0";
        if(str==s){
            str=curr.getFullYear()+"-12";
        }
        result.push(str);
        curr.setMonth(month+1);
    }
    return result;
}
/**
 *获取两个日期之间所有的日期
**/
function getBetweenDateStr(start,end){
    var result = [];
    var beginDay = start.split("-");
    var endDay = end.split("-");
    var diffDay = new Date();
    var endDate = new Date();
    var dateList = new Array;
    diffDay.setDate(beginDay[2]);
    diffDay.setMonth(beginDay[1]-1);
    diffDay.setFullYear(beginDay[0]);

    endDate.setDate(endDay[2]);
    endDate.setMonth(endDay[1]-1);
    endDate.setFullYear(endDay[0]);
    result.push(start);
    if(diffDay.getTime()>endDate.getTime()){
        return;
    }
    if(start=='null' && end!='null'){
        result.push(end);
        return result;
    }
    if(start!='null' && end=='null'){
        return result;
    }
    if(start=='null' && end=='null'){
        return;
    }
    if(start==end){
        return result;
    }
    var i=0;
    while(i == 0){
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
        if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
        result.push(dateList[0]+"-"+dateList[1]+"-"+dateList[2]);
        if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){
            i = 1;
        }
    };
    return result;
};
$("#getWarnInfo").click(function(){
    document.getElementById("caseLibrary").contentWindow.queryCaseLibrary();
})
function getWarnInfo(){
    document.getElementById("caseLibrary").contentWindow.queryCaseLibrary();
}
