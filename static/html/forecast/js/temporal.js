let temporal;//选中的站点信息
let temporalTime = "08";//选中的时段
let temporalDate =  JSON.stringify(new Date()).substring(1,11) //时间选择,默认系统时间
let temporalTempData;//获取站点温度数据

// let temporalDate =  JSON.stringify(new Date()).substring(1,11).split('-').join('') //时间选择,默认系统时间

layui.use(['element', 'form', 'layer', 'laydate'], function () {
    laydate = layui.laydate
    form = layui.form
    laydate.render({
        elem: '#temporalDate',
        value: temporalDate,
        //头部点击切换 
        change: function (value, date, endDate) {
            // temporalDate = value;
        },
        //日期选中 
        done: function (value, date, endDate) {
            temporalDate = value
            console.log(temporalDate)
            requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})
        }
    });
    //时段选中
    form.on('radio(temporal-time)', function (data) {
        temporalTime = data.value
        console.log(temporalTime)
        requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})
    });

    //点击最新
    $("#temporalUpdateDate").click(function () {
        temporalDate = JSON.stringify(new Date()).substring(1,11),
            laydate.render({
                elem: '#temporalDate',
                value: temporalDate
            })
            console.log(temporalDate)
        requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})
            
    });
    //日期左切换
    $(".temporallLeftDate").on("click", function () {
            var day1 = new Date(temporalDate);
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
            var getDate = JSON.stringify(day1.getDate()).length == 1? '0' + day1.getDate():day1.getDate()
            var getMonth = JSON.stringify(day1.getMonth()+ 1).length == 1? '0'+(day1.getMonth()+1):day1.getMonth()+ 1
            var s1 = day1.getFullYear() + "-" + getMonth + "-" + getDate;
            temporalDate = s1;
            laydate.render({
                elem: '#temporalDate',
                value: temporalDate
            });
            console.log(temporalDate)
        requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})

    });
    //日期右切换
    $(".temporallRightDate").click(function () {
            var day3 = new Date(temporalDate);
            day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
            var getDate = JSON.stringify(day3.getDate()).length == 1? '0' + day3.getDate():day3.getDate()
            var getMonth = JSON.stringify(day3.getMonth()+ 1).length == 1? '0'+(day3.getMonth()+1):day3.getMonth()+ 1
            var s3 = day3.getFullYear() + "-" + getMonth + "-" + getDate;
            temporalDate = s3;
            laydate.render({
                elem: '#temporalDate',
                value: temporalDate
            });
            console.log(temporalDate)
        requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})

    });

})

//时序图-左侧-站点选择
let temporalList = [
    {name: '椒江口',lon: '121.31',lat:'28.40',code:'58661'},
    {name: '天台',lon: '120.58',lat:'29.09',code:'58559'},
    {name: '仙居',lon: '120.43',lat:'28.52',code:'58652'},
    {name: '临海',lon: '121.12',lat:'28.52',code:'58660'},
    {name: '黄岩',lon: '121.06',lat:'28.37',code:'58655'},
    {name: '路桥',lon: '121.21',lat:'28.34',code:'K8301'},
    {name: '温岭',lon: '121.22',lat:'28.22',code:'58664'},
    {name: '玉环',lon: '121.16',lat:'28.05',code:'58667'},
    {name: '神仙居',lon: '120.36',lat:'28.41',code:'K8944'},
]
const temporalSite = [];
$.each(temporalList, function(index, obj) {
    index == 0? temporalSite.push(`<li obj=${JSON.stringify(obj)} class='temporalSite button-item temporal-time-active' style="cursor:pointer">${obj.name}</li>`):
    temporalSite.push(`<li obj=${JSON.stringify(obj)} class='temporalSite button-item' style="cursor:pointer;">${obj.name}</li>`)
});
$("#temporalSite").html(temporalSite);
$('#temporalSite').on('click','.temporalSite',function(){
    $(this).parents('#temporalSite').find('.temporalSite').removeClass('temporal-time-active');
    $(this).addClass('temporal-time-active');
    temporal = JSON.parse($(this).attr('obj'))
    requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})
});

//初始化标题 默认第一个站点
temporal = temporalList[0]

//时序图-左侧-地面要素 （单选）
const temporalGroundData = [
    {type:'gas',content:[{name:'2m气体',code:'1'},{name:'2m最低气温',code:'1'},{name:'2m最高气体',code:'1'}]},
    {type:'wind',content:[{name:'风',code:'1'},{name:'10m风',code:'1'},{name:'',code:'1'}]},
    {type:'pressure',content:[{name:'气压',code:'1'},{name:'水汽含量',code:'1'},{name:'',code:'1'}]},
    {type:'clouds',content:[{name:'总云量',code:'1'},{name:'低云量',code:'1'},{name:'',code:'1'}]},
]
const temporalGround = [];
$.each(temporalGroundData, function(index, obj) {
    index == 0? temporalGround.push(
        `<div class='layui-row but-row'>
            <div class="button-item temporalGround temporal-factor-active" style="cursor:pointer">${obj.content[0].name}</div>
            <div class="button-item temporalGround" style="cursor:pointer">${obj.content[1].name}</div>
            <div class="button-item temporalGround" style='${obj.content[2].name? "cursor:pointer":"display:none;cursor:pointer"};'>${obj.content[2].name}</div>
         </div>`):
    temporalGround.push(
        `<div class='layui-row but-row'>
            <div class="button-item temporalGround" style="cursor:pointer">${obj.content[0].name}</div>
            <div class="button-item temporalGround" style="cursor:pointer">${obj.content[1].name}</div>
            <div class="button-item temporalGround style='${obj.content[2].name? "cursor:pointer":"display:none"};'>${obj.content[2].name}</div>
         </div>`)
});
$("#temporalGround").html(temporalGround);
$("#temporalGround").on("click", ".temporalGround", function addfood() {
    $(this).toggleClass("temporal-factor-active");
    var max = $(this).parent().children(".temporal-factor-active").length;
    var checkstr = "";
    checkstr = $(this).parent().children(".temporal-factor-active").text();
    console.log(this)
    if ($(this).hasClass("temporal-factor-active")) {
        $(".myselt").val(checkstr);
    } else {
        $(".myselt").val(checkstr);
    }
});

//初始化获取数据
async function requestTemporalData(param = {}){
    //设置标题
    $('#temporalTitle').html(`<span>${JSON.stringify(temporalDate).substring(1,11)} 起报:${temporalTime} 站名:${temporal.name} 经度:${temporal.lon}° 纬度:${temporal.lat}°</span>`)

    //获取范围
    await getData(main_url,'/ssd-forecast-model/compositeDiagram?',param).then(res=>{
        temporalTempData = res.data;
        console.log(temporalTempData)
    })
    await selectChart()

}
requestTemporalData({stationNum:temporal.code,forecasttime: temporalDate.split('-').join('')+ temporalTime})

//时效
const agingArr = ["24H", "48H", "72H", "96H", "120H", "144H", "168H", "192H", "214H", "240H"];
const agingArrList = [];
$.each(agingArr, function(index, obj) {
    index == 0? agingArrList.push(`<li class='agingArr aging-time-active' style="cursor:pointer">${obj}</li>`):
    agingArrList.push(`<li class='agingArr' style="cursor:pointer;">${obj}</li>`)
});
$("#agingArr").html(agingArrList);
$('#agingArr').on('click','.agingArr',function(){
    $(this).parents('#agingArr').find('.agingArr').removeClass('aging-time-active');
    $(this).addClass('aging-time-active');
    console.log(this)
});

$(".model-li-temporal").on("click", "li", function addfood() {
    $(this).toggleClass("is-active");
    var max = $(this).parent().children(".is-active").length;
    var checkstr = "";
    checkstr = $(this).parent().children(".is-active").text();
    // console.log(checkstr)
    console.log(this)
    if ($(this).hasClass("is-active")) {
        $(".myselt").val(checkstr);
    } else {
        $(".myselt").val(checkstr);
    }
});






async function selectChart (){
    let arrTime = []
    temporalTempData.time.forEach(element => {
        arrTime.push(
                `${element}`,``,``,``,
        )
    });
    let arrTemp24 = []
    temporalTempData.tamp.temp24.forEach(element => {
        arrTemp24.push(
                `${element}`,``,``,``,
        )
    });

    let temporalChart = echarts.init(document.getElementById('temporalChart'));
    option = {
        color: [ 'red','#003366', '#0b28fb'],
        xAxis: [
            {
            type: 'category',
            boundaryGap:  false,//最左边开始
            data: arrTime,
            axisPointer: {
                type: 'shadow'
            },},
        ],
        yAxis: [
            {
                type: 'value',
                name: '温度',
                axisLabel: {
                    formatter: '{value} °C'
                },
            },
            {
                type: 'value',
                name: '水量',
                axisLabel: {
                    formatter: '{value} mm'
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //     type: 'cross',
            //     crossStyle: {
            //         color: '#red'
            //     }
            // }
        },
        legend: {
            data: ["6小时气温","24小时气温","6小时降水"]
        },
        series: [
            {data:temporalTempData.tamp.temp6,type: 'line',name: '6小时气温',smooth: false,yAxisIndex: 0,},
            {data:arrTemp24,type: 'line',name: '24小时气温',smooth: false,connectNulls:true},
            {data:temporalTempData.totalrain.rain6,type: 'bar',name: '6小时降水',smooth: false,yAxisIndex: 1},
        ]
    };
    temporalChart.setOption(option);
}


