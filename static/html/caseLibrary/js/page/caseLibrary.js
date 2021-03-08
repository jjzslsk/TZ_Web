var time_line_SetIn_Aws;//定时任务名称
/**案例库列表分页参数 start**/
var fenyeCount=0;//总条数
var fenyeAllPage=0;//总页数
var fenyeCurPage=1;//当前页
/**案例库列表分页参数 end**/
$(function () {
    $('.closeBtn').on('click',function(){
        $('.dataItemAc', parent.document).click();
    });
    $(document).on("click",".awsImg",function () {
        showAwsTimeLine(false);//隐藏时间轴
        let thisClass=$(this).attr("class");
        if(thisClass.includes("borderCss")){
            $(this).removeClass("borderCss");
            window.parent.deleteAllAwsImgLayer();
        }else{
            $(this).addClass('borderCss').siblings().removeClass('borderCss');
            let id=$(this).attr("id");
            let startTime=$(this).attr("startTime");
            let endTime=$(this).attr("endTime");
            window.parent.queryAwsDrawList(id,startTime,endTime);
        }
    });
    $(document).on("click",".disasterDetailLevel",function () {
        let areaCode=$(this).attr("areaCode");
        let caselibno=$(this).attr("caselibno");
        let startTime=$(this).attr("startTime");
        queryAwsDataByStationNum(areaCode,caselibno,startTime);
    });
    /**
     * 案例库列表 -->'加载更多' 点击事件
     *
     * **/
    $(parent.document).on("click","#loadCasePage",function () {
        $('#loadCasePage',parent.document).remove();
        if(fenyeCurPage<=fenyeAllPage){
            fenyeCurPage++;
        }else{
            return;
        }
        var warningTime = parent.document.getElementById("warningTime").value;
        var caselibno = parent.document.getElementById("caselibno").value;
        var title = parent.document.getElementById("title").value;
        let param=new Object();
        param.page=fenyeCurPage;
        param.warningTime=warningTime;
        param.caselibno=caselibno;
        param.title=title;
        param.limit=4;
        $.ajax({
            type: "post",
            cache: false,
            async: true,
            data: param,
            url: main_url+"/ssd-caselibInfo/queryByList",
            dataType: 'JSON',
            success: function (result) {
                if(result.code==0){
                    let data=result.data;
                    //请求数据成功
                    let itemContentHtml='';
                    for (let i = 0; i < data.length; i++) {
                        let title=data[i].title;
                        let disasterName=data[i].disasterName;
                        if(disasterName==null){
                            disasterName="-";
                        }
                        let caselibno=data[i].caselibno;
                        let createTime=data[i].createTime;
                        let startTime=data[i].startTime;
                        let endTime=data[i].endTime;
                        let id=data[i].id;
                        itemContentHtml+='<div class="dataItem caseDataItem"  caselibnoId="'+id+'" id="'+caselibno+'" startTime="'+startTime+'" endTime="'+endTime+'">';
                        itemContentHtml+='<div class="titleTime">';
                        itemContentHtml+='<p title="'+title+'">'+title+'</p>';
                        itemContentHtml+='<p style="font-size: 16px;">'+disasterName+'</p>';
                        itemContentHtml+='<p>'+createTime+'</p>';
                        itemContentHtml+='</div>';
                        itemContentHtml+='<span style="margin-left: 78%"><span id="queryOneCase" style="color: white;font-size: 15px;" value="'+id+'">详细信息</span>';
                        itemContentHtml+='</div>';
                    }
                    $("#loadCasePage").remove();
                    itemContentHtml+='<span style="margin-left: 40%;color: white;" id="loadCasePage">加载更多>></span>';
                    $('.levelOneContent>.itemContent',parent.document).eq(0).append(itemContentHtml);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });
});
/**
 *案例库 列表查询
 **/
function queryCaseLibrary(){
    $('.levelOneContent>.itemContent',parent.document).eq(0).empty();
    var warningTime = parent.document.getElementById("warningTime").value;
    var caselibno = parent.document.getElementById("caselibno").value;
    var title = parent.document.getElementById("title").value;
    fenyeCount=0;//总条数
    fenyeAllPage=0;//总页数
    fenyeCurPage=1;//当前页
    let param=new Object();
    param.page=fenyeCurPage;
    param.warningTime=warningTime;
    param.caselibno=caselibno;
    param.title=title;
    param.limit=4;
    $.ajax({
        type: "post",
        cache: false,
        async: true,
        data: param,
        url: main_url+"/ssd-caselibInfo/queryByList",
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                let data=result.data;
                if(fenyeCurPage==1){
                    fenyeCount=result.count;
                    fenyeAllPage=Math.ceil(fenyeCount/4);
                }
                //请求数据成功
                let itemContentHtml='';
                for (let i = 0; i < data.length; i++) {
                    let title=data[i].title;
                    let disasterName=data[i].disasterName;
                    if(disasterName==null){
                        disasterName="-";
                    }
                    let caselibno=data[i].caselibno;
                    let createTime=data[i].createTime;
                    let startTime=data[i].startTime;
                    let endTime=data[i].endTime;
                    let id=data[i].id;
                    itemContentHtml+='<div class="dataItem caseDataItem"  caselibno="'+caselibno+'" id="'+id+'" startTime="'+startTime+'" endTime="'+endTime+'">';
                    itemContentHtml+='<div class="titleTime">';
                    itemContentHtml+='<p title="'+title+'">'+title+'</p>';
                    itemContentHtml+='<p style="font-size: 16px;">'+disasterName+'</p>';
                    itemContentHtml+='<p>'+createTime+'</p>';
                    itemContentHtml+='</div>';
                    itemContentHtml+='<span style="margin-left: 78%"><span id="queryOneCase" style="color: white;font-size: 15px;" value="'+id+'">详细信息</span>';
                    itemContentHtml+='</div>';
                }
                itemContentHtml+='<span style="margin-left: 40%;color: white;" id="loadCasePage">加载更多>></span>';
                $('.levelOneContent>.itemContent',parent.document).eq(0).append(itemContentHtml);
             }
        },
        error: function (data) {
            console.log(data);
        }
    });
}
/**
 *案例库（单个案例）查询
 * type 1:展示详细信息 2：展示实况图片类型集合
 **/
function queryOneCaseInfo(id,type){
    $.ajax({
        type: "get",
        cache: false,
        async: true,
        url: main_url+"/ssd-caselibInfo/queryCaselibBaseInfo?id="+id,
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                let html="";
                if(type==1){
                    let msg=result.data.record;
                    let fileHtml = queryCaselibAttachment(msg.caselibno,'');
                    html+="<div style='color: white;font-size: 16px;background-color: rgba(11,50,93,0.9);height: 100%;padding-top: 20px;box-sizing: border-box;'>";
                    html+=`<table lay-filter="parse-table-demo" class="infoTab" style="width: 95%;margin: 0 auto;">
                              <thead>
                              </thead>
                              <tbody>
                                <tr style="padding: ">
                                  <td style="width: 33.33%;padding: 5px 0;">案 例 标 题： ${msg.title==null?'-':msg.title}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">案 例 编 号： ${msg.caselibno==null?'-':msg.caselibno}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">开 始 时 间： ${msg.startTime==null?'-':msg.startTime}</td>
                                </tr>
                                 <tr>
                                  <td style="width: 33.33%;padding: 5px 0;">结 束 时 间： ${msg.startTime==null?'-':msg.startTime}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">灾 种 编 码： ${ msg.disasterCode==null?'-':msg.disasterCode}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">灾 种 名 称： ${msg.disasterName==null?"-":msg.disasterName}</td>
                                </tr>
                                 <tr>
                                  <td style="width: 33.33%;padding: 5px 0;">死 亡 人 数： ${msg.deathNum==null?'-':msg.deathNum}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">受 伤 人 数： ${msg.injuredNum==null?'-':msg.injuredNum}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">转 移 人 数： ${msg.transferNum==null?'-':msg.transferNum}</td>
                                </tr>
                                 <tr>
                                  <td style="width: 33.33%;padding: 5px 0;">失 踪 人 数： ${msg.missingNum==null?'-':msg.missingNum}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">机 构 编 码： ${msg.orgunitCode==null?'-':msg.orgunitCode}</td>
                                  <td style="width: 33.33%;padding: 5px 0;">创 建 人 id： ${msg.createUser==null?'-':msg.createUser}</td>
                                </tr>
                                <tr>
                                    <td style="width: 33.33%;padding: 5px 0;">创 建 时 间： ${msg.createTime}</td>
                                    <td style="width: 33.33%;padding: 5px 0;">创 建 人 id： ${msg.createUser==null?"-":msg.createUser}</td>
                                    <td style="width: 33.33%;padding: 5px 0;">案 例 内 容： ${msg.description==null?"-":msg.description}</td>
                                </tr>
                                <tr>
                                    <td style="width: 33.33%;padding: 5px 0;">案 例 附 件： ${fileHtml==null?'-':fileHtml}</td>
                                </tr>
                              </tbody>
                            </table>`;
                    html+="</div>";
                    //请求数据成功
                    parent.layer.open({
                        type: 1,
                        title:'详细信息',
                        skin: 'layui-layer-demo', //加上边框
                        area: ['45%', '50%'], //宽高
                        content: html
                    });
                    return;
                }

            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}
layui.use('table', function(){
    var table = layui.table;

});
/**
 *案例库 附件查询
 **/
function queryCaselibAttachment(caselibno,attachmentType){
    let html="";
    $.ajax({
        type: "get",
        cache: false,
        async: false,
        url: main_url+"/ssd-caselibInfo/queryCaselibAttachment?caselibno="+caselibno+"&attachmentType="+attachmentType,
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                let data=result.data;
                for(var j in data){
                        html+="<a href='"+data[j].attachmentUrl+"'><img src='"+data[j].attachmentCoverUrl+"' style='height: 80px;width: 160px;'></a>";
                }
                return html;
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
    return html;
}

function datefomate(value) {
    if(value==null || value == undefined){
        return "";
    }
    var date = new Date(value);

    Y = date.getFullYear(),
        m = date.getMonth()+1,
        d = date.getDate(),
        H = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
    if(m<10){
        m = "0"+m;
    }
    if(d<10){
        d = "0"+d;
    }
    return Y+'-'+m+'-'+d;
};

function datefomate1(value) {
    if(value==null || value == undefined){
        return "";
    }
    var date = new Date(value);

    Y = date.getFullYear(),
        m = date.getMonth()+1,
        d = date.getDate(),
        H = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
    if(m<10){
        m = "0"+m;
    }
    if(d<10){
        d = "0"+d;
    }
    if(H<10){
        H = "0"+H;
    }if(i<10){
        i = "0"+i;
    }
    return Y+'-'+m+'-'+d +" "+H+':'+i;

};

var timeSwiper = new Swiper('.swiper-container1', {
    simulateTouch: false,//禁止鼠标模拟  手机可以滑动
    allowTouchMove: false,//手机也不能滑动
    slidesPerView: 2,     //一页显示多少swiper_slide
    slidesPerGroup: 1,      //一次滚动几个swiper_slide
    navigation: {
        nextEl: '.swiper-button-next1',  //左右按钮
        prevEl: '.swiper-button-prev1',
    },
    observer: true,//修改swiper自己或子元素时，自动初始化swiper
    observeParents: true,//修改swiper的父元素时，自动初始化swiper
});
/**
 *案例库 查询案例其他信息
 **/
function queryCaselibOtherItem(caselibno,content,dateArr){
    let slidesPerView=0;
    if(dateArr.length>6){
        slidesPerView=6;
    }else{
        slidesPerView=dateArr.length;
    }

    $.ajax({
        type: "get",
        cache: false,
        //async: true,
        url: main_url+"/ssd-caselibInfo/queryCaselibOtherItem?caselicId="+caselibno,
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                //请求数据成功
                let data=result.data;
                let dateHtml="";
                for(var p in dateArr){
                    dateHtml+='<div class="swiper-slide" style="height:100%;">';
                    dateHtml+='<div class="disasterItem" time="'+dateArr[p]+'" caselibno="'+caselibno+'">';
                    dateHtml+='<p>'+dateArr[p].substring(8,10)+'日</p>';
                    dateHtml+='<p>'+dateArr[p].substring(0,7)+'月</p>';
                    dateHtml+='<div class="disasterDetail caselibOther" id="caselibOther'+dateArr[p]+'"></div>';
                    dateHtml+='</div>';
                    dateHtml+='</div>';
                }
                $("#timeBase").empty().append(dateHtml);
                for(var i in data){
                    if(data[i].type=='1'){
                        let id=data[i].conditions;
                        $.ajax({
                            type: "get",
                            cache: false,
                            async: false,
                            url: main_url + "/ssd-caselibInfo/getWarningInfo?id=" + id,
                            dataType: 'JSON',
                            success: function (obj) {
                                if(obj.code==0){
                                    var da = obj.data;
                                    for (var j in da){
                                        var sendTime = datefomate(da[j].publish_time);
                                        var publish_time = datefomate1(da[j].publish_time);
                                        var color = da[j].level;
                                        var areaCode = da[j].effect_area;
                                        var title = da[j].title;
                                        var publish_org = da[j].publish_org;
                                        var code = da[j].code;
                                        let earlyHtml="";
                                        var level = '';
                                        if(color=='Blue'){
                                            level = '04';
                                        }else if(color=='Yellow'){
                                            level = '03';
                                        }else if(color=='Orange'){
                                            level = '02';
                                        }else if(color=='Red'){
                                            level = '01';
                                        }
                                        if(dateArr.includes(sendTime)){
                                            earlyHtml+='<div class="disasterDetailLevel disasterDetail_'+color
                                            +'" areaCode="'+areaCode+'" caselibno="'+caselibno+'" startTime="'+sendTime+'">';
                                            earlyHtml+='<div>';
                                            earlyHtml+='<img class="warningPic" title="'+publish_time+'&#10'+title+'" src="../../early/image/'+code+'_'+level+'.png"/>';
                                            //earlyHtml+='<p>'+title+'</p>';
                                            earlyHtml+='</div>';
                                            earlyHtml+='</div>';
                                            $("#caselibOther"+sendTime).append(earlyHtml);
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
                echarts.init(document.getElementById("awsItemEchart")).clear();
                $("#stationName").html("");
                // for(var i = 0; i < $('.disasterCon').find('.disasterDetail').length; i++){
                //     for(var j = 0; j < $('.disasterCon').find('.disasterDetail').eq(i).find('.disasterDetailLevel').length; j++){
                //         $('.disasterCon').find('.disasterDetail').eq(i).find('.disasterDetailLevel').eq(j).css('margin-left',10*j)
                //     }
                // }
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}
/**
 *案例库 查询案例实况站点信息
 **/
function queryCaseAwsList(caselibno){
    let param=new Object();
    param.Page=1;
    param.Limit=10;
    param.caselibno=caselibno;
    $.ajax({
        type: "get",
        cache: false,
        //async: true,
        data: param,
        url: main_url+"/mdls/caselib/queryAwsList",
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                //请求数据成功
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

/**
 *案例库 查询案例实况数据根据站点或者地区编码
 **/
function queryAwsDataByStationNum(areaCode,caselibNo,startTime){
    areaCode='331000000000';
    var stationNum = '58665';
    var stationName = '洪家';
    $.ajax({
        type:"get",
        cache:false,
        //async:true,
        url:main_url+"/ssd-reminder-data-statistics/queryAwsDataByStationNum?stationNum="+stationNum+"&areaCode="+areaCode+"&caselibNo="+caselibNo+"&startTime="+startTime,
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                let data=result.data.resultdata;
                let obj=new Object();
                let dateTimeArr=[];
                let maxtempArr=[];
                let mintempArr=[];
                let relhumArr=[];
                let rianamountArr=[];
                let tempArr=[];
                let visibArr=[];
                let winddArr=[];
                let windvArr=[];
                /*倒叙循环*/
                for(let i=data.length-1;i>=0;i--){
                    var dateTime = datefomate1(data[i].datetime)
                    dateTimeArr.push(dateTime.substr(8,2)+"日"+dateTime.substr(11,2)+"时");
                    maxtempArr.push(data[i].maxtemp);
                    mintempArr.push(data[i].mintemp);
                    relhumArr.push(data[i].relhum);
                    rianamountArr.push(data[i].rain);
                    tempArr.push(data[i].temp);
                    visibArr.push(data[i].visib);
                    winddArr.push(tranlatewindd(data[i].windd));
                    windvArr.push(data[i].windv);
                }
                obj.dateTimeArr=dateTimeArr;
                obj.maxtempArr=maxtempArr;
                obj.mintempArr=mintempArr;
                obj.relhumArr=relhumArr;
                obj.rianamountArr=rianamountArr;
                obj.tempArr=tempArr;
                obj.visibArr=visibArr;
                obj.winddArr=winddArr;
                obj.windvArr=windvArr;
                awsItemEchart(obj,stationName);
                $("#stationName").text(stationName+"站")
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

/**
 *案例库 查询实况数据根据日期
 **/
function queryAwsDataByDatetime(caselibNo,datatime){
   //let  time=new Date(datatime).Format('yyyyMMddhhmm');
    let  time='';

    $.ajax({
        type:"get",
        cache:false,
        //async:true,
        url:main_url+"/mdls/caselib/queryAwsDataByDatetime?caselibNo="+caselibNo,//+"&datatime="+time,
        dataType: 'JSON',
        success: function (result) {
            if(result.code==0){
                //请求数据成功
                let data=result.data.resultdata;
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}


function windDen(wind) {
    switch (wind) {
        case '北风': return 'n';
        case '东北风': return 'ne';
        case '东风': return 'e';
        case '东南风': return 'se';
        case '南风': return 's';
        case '西南风': return 'sw';
        case '西风': return 'w';
        case '西北风': return 'nw';
        default: return ''
    }
}

function awsItemEchart(obj, title){
    echarts.init(document.getElementById('awsItemEchart')).dispose();
    var awsItemEchart = echarts.init(document.getElementById("awsItemEchart"));
    var colors = ['#5793f3', '#e58818', '#c074fc', '#2queryOneCase5e894', '#75ABE8'];
    var option = {
        color: colors,
        title : {
            text: '多要素变化图-'+title+'站',
            x:'center',
            textStyle: {
                color: 'white',  //文字颜色
                fontSize : 14   //文字大小
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '10%',
            left: '13%',
            bottom: '17%'
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            y: 20,
            data:['降雨量','温度','相对湿度','能见度','风力'],
            selected:{
                '相对湿度':false,
                '能见度':false
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data:obj.dateTimeArr,
                axisLabel: {
                    interval:0,
                    rotate:10,
                    textStyle: {
                        color: 'white',  //更改坐标轴文字颜色
                        fontSize : 10     //更改坐标轴文字大小
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#a0a9af',//更改坐标轴颜色
                    }
                }
            }, {
                name: '风向',
                type: 'category',
                position: 'bottom',
                offset: 5,
                axisTick: {show: true},
                axisLine: {show: true},
                axisLabel: {
                    show: true,
                    textStyle: {color: '#ffffff', fontSize: 14, lineHeight: 20},
                    interval: 0,
                    formatter: (value) => {
                        return '{' + windDen(value) + '| }';
                    },
                    rich: {
                        value: {
                            lineHeight: 16,
                            align: 'left'
                        },
                        n: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/n.png'
                            }
                        },
                        ne: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/en.png'
                            }
                        },
                        e: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/e.png'
                            }
                        },
                        se: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/es.png'
                            }
                        },
                        s: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/s.png'
                            }
                        },
                        sw: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/ws.png'
                            }
                        },
                        w: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/w.png'
                            }
                        },
                        nw: {
                            height: 16,
                            align: 'left',
                            backgroundColor: {
                                image: '../images/windD/wn.png'
                            }
                        }
                    }
                },
                nameTextStyle: {color: '#fefefe', padding: [0, 0, -58]},
                nameLocation: 'start',
                data: obj.winddArr
            }
        ],
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        }, {
            start: 0,
            end: 100
        }],
        yAxis: [
            {
                type: 'value',
                name: '降雨量',
                position: 'left',
                offset: 100,
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisTick: {
                    show:true,
                    alignWithLabel: true
                },
                axisLabel: {
                    formatter: '{value} mm'
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                name: '温度',
                position: 'left',
                offset: 50,
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisTick: {
                    show:true,
                    alignWithLabel: true
                },
                axisLabel: {
                    formatter: '{value} °C'
                },
                splitLine: {
                    show: true
                }
            },
            {
                type: 'value',
                name: '相对湿度',
                position: 'left',
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: colors[2]
                    }
                },
                axisTick: {
                    show:true,
                    alignWithLabel: true
                },
                axisLabel: {
                    formatter: '{value} %'
                },
                splitLine: {
                    show: false
                }
            },{
                type: 'value',
                name: '能见度',
                position: 'right',
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: colors[3]
                    }
                },
                axisTick: {
                    show:true,
                    alignWithLabel: true
                },
                axisLabel: {
                    formatter: '{value} m'
                },
                splitLine: {
                    show: false
                }
            },{
                type: 'value',
                name: '风力',
                position: 'right',
                offset: 50,
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: colors[4]
                    }
                },
                axisTick: {
                    show:true,
                    alignWithLabel: true
                },
                axisLabel: {
                    formatter: '{value} m/s'
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'降雨量',
                type:'bar',
                data:obj.rianamountArr
            },
            {
                name:'温度',
                type:'line',
                yAxisIndex: 1,
                data:obj.tempArr
            },
            {
                name:'相对湿度',
                type:'line',
                yAxisIndex: 2,
                data:obj.relhumArr
            },
            {
                name:'能见度',
                type:'line',
                yAxisIndex: 3,
                data:obj.visibArr
            },
            {
                name:'风力',
                type:'line',
                yAxisIndex: 4,
                data:obj.windvArr
            }
        ]
    };
    awsItemEchart.setOption(option, true);
    window.onresize = function () {
        awsItemEchart.resize();
    }
};

function showAwsTimeLine(isShow) {
        if(isShow) {
            if($("#timeline_aws_box").hasClass("active")) {
                $("#timeline_aws_box").addClass("activetop");
                $("#timeline_aws_box").removeClass("active");
            }
            $("#timeline_aws_box").addClass("active");
        }else {
            $("#timeline_aws_box").removeClass("active");
            if($("#timeline_aws_box").hasClass("activetop")) {
                $("#timeline_aws_box").removeClass("activetop");
                $("#timeline_aws_box").addClass("active");
            }
        }

}

function changeAwsImg(obj){
    var values = $("#slider-range-max_aws").slider( "value");
    var len = $("#time_aws_line li").length-1;
    var id = $(obj).attr('id');
    var nextValue;
    if(id=="subtract_aws"){
        nextValue = values-1
    }else{
        nextValue = values+1
    }
    if(values ==len){
        if(id!="subtract_aws"){
            nextValue=0
        }
    }else if(values==0 && id=="subtract_aws"){
        if(id=="subtract_aws"){
            nextValue = len
        }
    }
    $("#slider-range-max_aws").slider( "value", nextValue);      // 给滑块赋值
    let imgSrc = $("#time_aws_line li[data-index='"+nextValue+"']").attr("src");
    let captionAws = $("#time_aws_line li[data-index='"+nextValue+"']").attr("captionAws");
    let awsType=$("#timeAwsType").attr("type");
    let extent="";
    if(awsType=='weather_10min'){
        extent=config.weatherextent;
    }else{
        extent=config.otherweatherextent
    }
    window.parent.changeAwsSource(imgSrc,extent,captionAws)
}

function appendTimeDiv(awsType,data) {
    var extent ="";
    if(awsType=='weather_10min'){
        extent=config.weatherextent;
    }else{
        extent=config.otherweatherextent
    }

    $("#timeAwsType").attr("type",awsType);
    var len = data.length;
    var radarTimeLine =$("#time_aws_line").empty();

    var width = 100.0 / (len - 1);
    var n = 0;
    for(var i in data) {
        var time = data[i].ctime;
        var h = time.substr(0, 2);
        var m = time.substr(2, 2);
        var hm = h + ":" + m;
        let cdata=data[i].cdate.substr(0, 4)+"/"+data[i].cdate.substr(4, 2)+"/"+data[i].cdate.substr(6, 2);
        if(h == '24'){
            if(i != 0) {
                $("<li class='liAc' data-index='" + n + "' src ='" + data[i].imgurl + "' style='width:" + width + "%' captionAws='"+data[i].caption+"'><p>"+cdata+"</p><p>" + hm + "</p></li>").appendTo(radarTimeLine)
            } else {
                $("<li class='liAc' data-index='" + n + "' src ='" + data[i].imgurl + "' style='width:" + width + "%' captionAws='"+data[i].caption+"'><p>"+cdata+"</p><p>" + hm + "</p></li>").appendTo(radarTimeLine)
            }
        }else{
            if(i != 0) {
                $("<li data-index='" + n + "' src ='" + data[i].imgurl + "' style='width:" + width + "%' captionAws='"+data[i].caption+"'><p></p><p>" + hm + "</p></li>").appendTo(radarTimeLine)
            } else {
                $("<li data-index='" + n + "' src ='" + data[i].imgurl + "' style='width:" + width + "%' captionAws='"+data[i].caption+"'><p></p><p>" + hm + "</p></li>").appendTo(radarTimeLine)
            }
        }
        n++;
    }
    //初始化swiper
    $("#slider-range-max_aws").slider({
        min: 0,
        max: len - 1,
        value: len - 1,
        slide: function(event, ui) {
            let dataIndex = ui.value;
            let imgSrc = $("#time_aws_line li[data-index='" + dataIndex + "']").attr("src");
            let captionAws = $("#time_aws_line li[data-index='"+nextValue+"']").attr("captionAws");
            window.parent.changeAwsSource(imgSrc,extent,captionAws);

        }
    });
    showAwsTimeLine(true);
}



