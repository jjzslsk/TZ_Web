layui.use(['element','form','layer','laydate'], function(){
    var element = layui.element;
        layer = layui.layer;
        laydate = layui.laydate;


        let temporalDate = new Date()
        let soundingDate = new Date()
        //执行一个laydate实例
        laydate.render({
            elem: '#temporalDate',
            value: temporalDate,
            //头部点击切换
            change: function(value, date, endDate){
                temporalDate = value
              },
            //点击选中
            done: function(value, date, endDate){
                temporalDate = value
            }
        });
        laydate.render({
            elem: '#soundingDate',
            value: soundingDate,
            //头部点击切换
            change: function(value, date, endDate){
                soundingDate = value
              },
            //点击选中
            done: function(value, date, endDate){
                soundingDate = value
            }
        });

        $(".updateDate").click(function(){
            $(this).attr("code") == 'temporalDate'?
            (temporalDate = new Date(),
            laydate.render({
                elem: '#temporalDate',
                value: temporalDate
            })):
            (soundingDate = new Date(),
            laydate.render({
                elem: '#soundingDate',
                value: soundingDate
            }));
        });

        $(".topDate").click(function(){
            if($(this).attr("code") == 'temporalDate'){
                var day1 = new Date(temporalDate);
                day1.setTime(day1.getTime()-24*60*60*1000);
                var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
                temporalDate = s1
                laydate.render({
                    elem: '#temporalDate',
                    value: temporalDate
                });
            }else if($(this).attr("code") == 'soundingDate'){
                var day1 = new Date(soundingDate);
                day1.setTime(day1.getTime()-24*60*60*1000);
                var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
                soundingDate = s1
                laydate.render({
                    elem: '#soundingDate',
                    value: soundingDate
                });
            }
        });
        $(".bottomDate").click(function(){
            if($(this).attr("code") == 'temporalDate'){
                var day3 = new Date(temporalDate);
                day3.setTime(day3.getTime()+24*60*60*1000);
                var s3 = day3.getFullYear()+"-" + (day3.getMonth()+1) + "-" + day3.getDate();
                temporalDate = s3
                laydate.render({
                    elem: '#temporalDate',
                    value: temporalDate
                });
            }else if($(this).attr("code") == 'soundingDate'){
                var day3 = new Date(soundingDate);
                day3.setTime(day3.getTime()+24*60*60*1000);
                var s3 = day3.getFullYear()+"-" + (day3.getMonth()+1) + "-" + day3.getDate();
                soundingDate = s3
                laydate.render({
                    elem: '#soundingDate',
                    value: soundingDate
                });
            }
        });

        $("#rightCard").hide()
        element.on('tab(demo)', function(data){
            // console.log(data.index); //得到当前Tab的所在下标
            if (data.index == 0) {
                $(".main-plane").show()
                $(".main-section").hide()
                $(".main-temporal").hide()
                $(".main-sounding").hide()
                $(".right-box").show()
                $("#rightCard").hide()
                $("#rightTab").show()
            }else if(data.index == 1){
                $(".main-plane").hide()
                $(".main-section").show()
                $(".main-temporal").hide()
                $(".main-sounding").hide()
                $(".right-box").show()
                $("#rightCard").hide()
                $("#rightTab").show()
            }else if(data.index == 2){
                $(".main-plane").hide()
                $(".main-section").hide()
                $(".main-temporal").show()
                $(".main-sounding").hide()
                $(".right-box").hide()
                $("#rightTab").show()
                $("#rightCard").hide()
            }else if(data.index == 3){
                $(".main-plane").hide()
                $(".main-section").hide()
                $(".main-temporal").hide()
                $(".main-sounding").show()
                $(".right-box").show()
                $("#rightTab").hide()
                $("#rightCard").show()
            }
        });
  });

  let temporalChart = echarts.init(document.getElementById('temporalChart'));
    // 指定图表的配置项和数据
    option = {
        xAxis: {
            type: 'category',
            boundaryGap: true,//最左边开始
            data: ['03-01 08', '03-02 08', '03-03 08', '03-04 08', '03-05 08', '03-06 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08']
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["EC", "JMA", "GFS", "GRAPES", "ZJWARMS", "上海WRAMS", "浙江WRF"]
        },
        series: [
            {data: [420, 932, 901, 934, 1290, 1330, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'line',name: 'EC',smooth: true,},
            {data: [620, 532, 901, 934, 1290, 1330, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'line',name: 'JMA',smooth: true,},
            {data: [320, 932, 601, 934, 1290, 1440, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'line',name: 'GFS',smooth: true,},
            {data: [720, 932, 601, 934, 1290, 1440, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'line',name: 'GRAPES',smooth: true,},
            {data: [820, 932, 601, 934, 1290, 2440, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'line',name: 'ZJWARMS',smooth: true,},
            {data: [120, 932, 601, 934, 1290, 1480, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'line',name: '上海WRAMS',smooth: true,},
            {data: [420, 932, 601, 334, 1290, 1440, 1220, 1220, 1220, 1220, 1220, 1220, 1220, 1220, 1220],type: 'line',name: '浙江WRF',smooth: true,},
    ]
    };
    temporalChart.setOption(option);

    let temporalRainChart = echarts.init(document.getElementById('temporalRainChart'));
    // 指定图表的配置项和数据
    option = {
        xAxis: {
            type: 'category',
            boundaryGap: true,//最左边开始
            data: ['03-01 08', '03-02 08', '03-03 08', '03-04 08', '03-05 08', '03-06 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08', '03-07 08']
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["EC1", "JMA", "GFS", "GRAPES", "ZJWARMS", "上海WRAMS", "浙江WRF"]
        },
        series: [
            {data: [820, 932, 901, 934, 1290, 1330, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: 'EC1',smooth: true,},
            {data: [820, 532, 901, 934, 1290, 1330, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: 'JMA',smooth: true,},
            {data: [820, 932, 601, 934, 1290, 1440, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: 'GFS',smooth: true,},
            {data: [820, 932, 601, 934, 1290, 1440, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: 'GRAPES',smooth: true,},
            {data: [820, 932, 601, 934, 1290, 440, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: 'ZJWARMS',smooth: true,},
            {data: [820, 932, 601, 934, 1290, 1480, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: '上海WRAMS',smooth: true,},
            {data: [820, 932, 601, 334, 1290, 1440, 1220, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320],type: 'bar',name: '浙江WRF',smooth: true,},
    ]
    };
    temporalRainChart.setOption(option);

//引用 http请求 类
const http = new EasyHttp;

function getData(url,port,param){
    return new Promise((resolve, reject) => {http.get(url + port, param,function (res) {resolve(res)},function (err) {layer.msg('错误', {icon: 5});reject(err)},)});
}

 function postJson(param){
    http.postJson('https://jsonplaceholder.typicode.com/posts' + '', '',
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

 function postForm(param){
    http.postForm(system_url + '/ssd/system/ssd-sys-role/addRole', param,
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

 function delData(param){
    http.delete(system_url + '/ssd/system/ssd-sys-role/deleteRoleById', param,
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

 function putData(param){
    http.put(system_url + '/ssd/product/ssd-product-publish/doPublish', param,
        function (res) {
            console.log(res)
        },
        function (err) {
            console.log(err)
        }
    )
 }

//使用http 请求方法
$("#getExport").click(function(){
   var param = `&pageIndex=1&pageSize=10`
    //    getData('http://172.21.158.161:4001','/ssd/system/ssd-sys-role/selectRoleTreeList?',param)
       getData('http://jsonplaceholder.typicode.com/posts','','')
       .then(res=>console.log('res:',res))
       .catch(err => console.log('err:',err))
});

$("#formExport").click(function(){
    postForm({name:'111',code:'222'})
});
$("#jsonExport").click(function(){
    postJson({user:'222',code:'333'})
});
$("#delExport").click(function(){
    delData({id:"1f6c4caa9b8648f28be4fce9e888eccb"})
});
$("#putExport").click(function(){
    putData({user:'小明',id:'123'})
});

$("#click_browse").click(function(){
    $(".browse-box").show()
    $(".stamps-box").hide()
});

$("#click_stamps").click(function(){
    $(".browse-box").hide()
    $(".stamps-box").show()
});

//平面图-左侧-地面要素 （单选）
const groundData = [
    {type:'gas',content:[{name:'2m气体',code:'1'},{name:'2m最低气温',code:'1'},{name:'2m最高气体',code:'1'}]},
    {type:'wind',content:[{name:'风',code:'1'},{name:'10m风',code:'1'},{name:'',code:'1'}]},
    {type:'pressure',content:[{name:'气压',code:'1'},{name:'水汽含量',code:'1'},{name:'',code:'1'}]},
    {type:'clouds',content:[{name:'总云量',code:'1'},{name:'低云量',code:'1'},{name:'',code:'1'}]},
]
const groundFactor = [];
let groundFactorId = null;
$.each(groundData, function(index, obj) {
    index == 0? groundFactor.push(
        `<div class='layui-row but-row'>
            <div code='${obj.content[0].code}' class="button-item groundFactor ground-factor-active" style="cursor:pointer">${obj.content[0].name}</div>
            <div code='${obj.content[1].code}' class="button-item groundFactor" style="cursor:pointer">${obj.content[1].name}</div>
            <div code='${obj.content[2].code}' class="button-item groundFactor" style='${obj.content[2].name? "cursor:pointer":"display:none;cursor:pointer"};'>${obj.content[2].name}</div>
         </div>`):
    groundFactor.push(
        `<div class='layui-row but-row'>
            <div code='${obj.content[0].code}' class="button-item groundFactor" style="">${obj.content[0].name}</div>
            <div code='${obj.content[1].code}' class="button-item groundFactor" style="cursor:pointer">${obj.content[1].name}</div>
            <div code='${obj.content[2].code}' class="button-item groundFactor style='${obj.content[2].name? "cursor:pointer":"display:none"};'>${obj.content[2].name}</div>
         </div>`)
});
$("#groundFactor").html(groundFactor);
$('#groundFactor').on('click','.groundFactor',function(){
    $(this).parents('#groundFactor').find('.groundFactor').removeClass('ground-factor-active');
    $(this).addClass('ground-factor-active');
    groundFactorId = $(this).attr('code')
    var param = `&pageIndex=1&pageSize=10&code=${groundFactorId}`
    getData('http://172.21.158.161:4001/','/ssd/system/ssd-sys-role/selectRoleTreeList?',param).then(res=>
        console.log('res:',res)
        
    )
});

//平面图-左侧-高空要素 （多选）
const upperAirData = [
        {type:'925hPa',content:[{name:'地势高度1',code:'01'},{name:'风场1',code:'01'},{name:'温度',code:'01'},{name:'比湿',code:'01'},{name:'相对湿度',code:'01'},{name:'垂直速度',code:'01'},{name:'假相当位温',code:'01'},]},
        {type:'850hPa',content:[{name:'地势高度2',code:'01'},{name:'风场2',code:'01'},{name:'温度',code:'01'},{name:'比湿',code:'01'},{name:'相对湿度',code:'01'},{name:'垂直速度',code:'01'},{name:'假相当位温',code:'01'},]},
        {type:'701hPa',content:[{name:'地势高度3',code:'01'},{name:'风场3',code:'01'},{name:'温度',code:'01'},{name:'比湿',code:'01'},{name:'相对湿度',code:'01'},{name:'垂直速度',code:'01'},{name:'假相当位温',code:'01'},]},
        {type:'700hPa',content:[{name:'地势高度4',code:'01'},{name:'风场4',code:'01'},{name:'温度',code:'01'},{name:'比湿',code:'01'},{name:'相对湿度',code:'01'},{name:'垂直速度',code:'01'},{name:'假相当位温',code:'01'},]},
    ]
    const upperAir = [];
    const upperAirTitle = [];
    $.each(upperAirData, function(index, obj) {
        if(index == 3)return
        upperAirTitle.push(`<li style="cursor:pointer;">${obj.type}</li>`)
    });
    $("#upperAirTitle").html(upperAirTitle);
    $.each(upperAirData, function(index, obj) {
        if(index == 3) return
        index == 0? upperAir.push(
            `<ul>
                <li class='upper-factor-active'>${obj.content[0].name}</li>
                <li style="cursor:pointer;">${obj.content[1].name}</li>
                <li style="cursor:pointer;">${obj.content[2].name}</li>
                <li style="cursor:pointer;">${obj.content[3].name}</li>
                <li style="cursor:pointer;">${obj.content[4].name}</li>
                <li style="cursor:pointer;">${obj.content[5].name}</li>
                <li style="cursor:pointer;">${obj.content[6].name}</li>
            </ul>`):
        upperAir.push(
            `<ul>
                <li style="cursor:pointer;">${obj.content[0].name}</li>
                <li style="cursor:pointer;">${obj.content[1].name}</li>
                <li style="cursor:pointer;">${obj.content[2].name}</li>
                <li style="cursor:pointer;">${obj.content[3].name}</li>
                <li style="cursor:pointer;">${obj.content[4].name}</li>
                <li style="cursor:pointer;">${obj.content[5].name}</li>
                <li style="cursor:pointer;">${obj.content[6].name}</li>
            </ul>`)
    });
    $("#upperAir").html(upperAir);

$("#upperAir").on("click", "li", function addfood() {
    $(this).toggleClass("upper-factor-active");
    var max = $(this).parent().children(".upper-factor-active").length;
    var checkstr = "";
    checkstr = $(this).parent().children(".upper-factor-active").text();
    // console.log(checkstr)
    console.log(this)
    if ($(this).hasClass("upper-factor-active")) {
        $(".myselt").val(checkstr);
    } else {
        $(".myselt").val(checkstr);
    }
});

//平面图-左侧-综合分析 （单选）
const synthesizeData = [
    {content: '500hPa高度场+200hPa散度+500hPa风场111111111',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场2',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场3',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场4',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场5',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场6',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
]
const synthesize = [];
$.each(synthesizeData, function(index, obj) {
    index == 0? synthesize.push(`<li class='synthesize synthesize-time-active' style="cursor:pointer">${obj.content}</li>`):
    synthesize.push(`<li class='synthesize' style="cursor:pointer;">${obj.content}</li>`)
});
$("#synthesize").html(synthesize);
$('#synthesize').on('click','li',function(){
    $(this).parents('#synthesize').find('.synthesize').removeClass('synthesize-time-active');
    $(this).addClass('synthesize-time-active');
    console.log(this)
});

//平面图-实时查询-预报时间 （单选）
    const forecastData = [
        {name: '2020-01-02 02：02',type: 'long'},
        {name: '2020-01-02 02：03',type: 'cute'},
        {name: '2020-01-02 02：04',type: 'cold'},
        {name: '2020-01-02 02：05',type: 'smile'},
    ]
    const forecastTime = [];
    $.each(forecastData, function(index, obj) {
        index == 0? forecastTime.push(`<li class='forecastTime forecast-time-active' style="cursor:pointer">${obj.name}</li>`):
        forecastTime.push(`<li class='forecastTime' style="cursor:pointer;">${obj.name}</li>`)
    });
    $("#forecastTime").html(forecastTime);
    $('#forecastTime').on('click','.forecastTime',function(){
        $(this).parents('#forecastTime').find('.forecastTime').removeClass('forecast-time-active');
        $(this).addClass('forecast-time-active');
        console.log(this)
    });

    //平面图-实时查询-预报时隔 （单选）
    const afterData = [
        {name: '3h',type: 'long'},
        {name: '6h',type: 'cute'},
        {name: '12h',type: 'cold'},
        {name: '24h',type: 'smile'},
    ]
    const forecastAfter = [];
    $.each(afterData, function(index, obj) {
        index == 0? forecastAfter.push(`<div class='forecastAfter button-item after-time-active' style="cursor:pointer">${obj.name}</div>`):
        forecastAfter.push(`<div class='forecastAfter button-item' style="cursor:pointer;">${obj.name}</div>`)
    });
    $("#forecastAfter").html(forecastAfter);
    $('#forecastAfter').on('click','.forecastAfter',function(){
        $(this).parents('#forecastAfter').find('.forecastAfter').removeClass('after-time-active');
        $(this).addClass('after-time-active');
    });

    //平面图-实时查询-预报时次 （单选）
    const frequencyData = [
        {name: '2020-01-08',type: 'long'},
        {name: '2020-01-07',type: 'cute'},
        {name: '2020-01-06',type: 'cold'},
        {name: '2020-01-05',type: 'smile'},
    ]
    const forecastFrequency = [];
    $.each(frequencyData, function(index, obj) {
        index == 0? forecastFrequency.push(`<li class='forecastFrequency frequency-time-active' style="cursor:pointer">${obj.name}</li>`):
        forecastFrequency.push(`<li class='forecastFrequency' style="cursor:pointer;">${obj.name}</li>`)
    });
    $("#forecastFrequency").html(forecastFrequency);
    $('#forecastFrequency').on('click','.forecastFrequency',function(){
        $(this).parents('#forecastFrequency').find('.forecastFrequency').removeClass('frequency-time-active');
        $(this).addClass('frequency-time-active');
        console.log(this)
    });

//剖面图-左侧-站点选择
    const siteList = [
        {name: '椒江',type: 'long'},
        {name: '天台',type: 'cute'},
        {name: '三门',type: 'cold'},
        {name: '仙居',type: 'cold'},
        {name: '临海',type: 'cold'},
        {name: '黄岩',type: 'cold'},
        {name: '路桥',type: 'cold'},
        {name: '温岭',type: 'cold'},
        {name: '玉环',type: 'cold'},
        {name: '神仙居',type: 'cold'},
        {name: '江南长城',type: 'cold'},
        {name: '劳务农庄',type: 'cold'},
    ]
    const sectionSite = [];
    $.each(siteList, function(index, obj) {
        index == 0? sectionSite.push(`<li class='sectionSite button-item site-time-active' style="cursor:pointer">${obj.name}</li>`):
        sectionSite.push(`<li class='sectionSite button-item' style="cursor:pointer;">${obj.name}</li>`)
    });
    $("#sectionSite").html(sectionSite);
    $('#sectionSite').on('click','.sectionSite',function(){
        $(this).parents('#sectionSite').find('.sectionSite').removeClass('site-time-active');
        $(this).addClass('site-time-active');
        console.log(this)
    });


//剖面图-左侧-综合分析 （单选）
const sectionSynthesizeeData = [
    {content: '500hPa高度场+200hPa散度+500hPa风场0',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场2',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场3',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场4',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场5',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场6',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场7',code: 'long'},
]
const sectionSynthesizeArr = [];
$.each(sectionSynthesizeeData, function(index, obj) {
    index == 0? sectionSynthesizeArr.push(`<li class='sectionSynthesize sectionSynthesize-time-active' style="cursor:pointer">${obj.content}</li>`):
    sectionSynthesizeArr.push(`<li class='sectionSynthesize' style="cursor:pointer;">${obj.content}</li>`)
});
$("#sectionSynthesize").html(sectionSynthesizeArr);
$('#sectionSynthesize').on('click','li',function(){
    $(this).parents('#sectionSynthesize').find('.sectionSynthesize').removeClass('sectionSynthesize-time-active');
    $(this).addClass('sectionSynthesize-time-active');
    console.log(this)
});

//时序图-左侧-站点选择
const temporalList = [
    {name: '椒江',type: 'long'},
    {name: '天台',type: 'cute'},
    {name: '三门',type: 'cold'},
    {name: '仙居',type: 'cold'},
    {name: '临海',type: 'cold'},
    {name: '黄岩',type: 'cold'},
    {name: '路桥',type: 'cold'},
    {name: '温岭',type: 'cold'},
    {name: '玉环',type: 'cold'},
    {name: '神仙居',type: 'cold'},
    {name: '江南长城',type: 'cold'},
    {name: '劳务农庄',type: 'cold'},
]
const temporalSite = [];
$.each(temporalList, function(index, obj) {
    index == 0? temporalSite.push(`<li class='temporalSite button-item temporal-time-active' style="cursor:pointer">${obj.name}</li>`):
    temporalSite.push(`<li class='temporalSite button-item' style="cursor:pointer;">${obj.name}</li>`)
});
$("#temporalSite").html(temporalSite);
$('#temporalSite').on('click','.temporalSite',function(){
    $(this).parents('#temporalSite').find('.temporalSite').removeClass('temporal-time-active');
    $(this).addClass('temporal-time-active');
    console.log(this)
});

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
            <div class="button-item temporalGround" style="">${obj.content[0].name}</div>
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
    // console.log(checkstr)
    console.log(this)
    if ($(this).hasClass("temporal-factor-active")) {
        $(".myselt").val(checkstr);
    } else {
        $(".myselt").val(checkstr);
    }
});


//探空图-左侧-站点选择
const soundingSiteList = [
    {name: '椒江',type: 'long'},
    {name: '天台',type: 'cute'},
    {name: '三门',type: 'cold'},
    {name: '仙居',type: 'cold'},
    {name: '临海',type: 'cold'},
    {name: '黄岩',type: 'cold'},
    {name: '路桥',type: 'cold'},
    {name: '温岭',type: 'cold'},
    {name: '玉环',type: 'cold'},
    {name: '神仙居',type: 'cold'},
    {name: '江南长城',type: 'cold'},
    {name: '劳务农庄',type: 'cold'},
]
const soundingSite = [];
$.each(soundingSiteList, function(index, obj) {
    index == 0? soundingSite.push(`<li class='soundingSite button-item sounding-time-active' style="cursor:pointer">${obj.name}</li>`):
    soundingSite.push(`<li class='soundingSite button-item' style="cursor:pointer;">${obj.name}</li>`)
});
$("#soundingSite").html(soundingSite);
$('#soundingSite').on('click','.soundingSite',function(){
    $(this).parents('#soundingSite').find('.soundingSite').removeClass('sounding-time-active');
    $(this).addClass('sounding-time-active');
    console.log(this)
});


//模式
var myarr = ["EC", "JMA", "GFS", "GRAPES", "ZJWARMS", "上海WRAMS", "浙江WRF"];
var str = "";
var addstr = "";
for (var i = 0; i < myarr.length; i++) {
    if(i== 1){
        str = str + "<li class='is-active liClick'>" + myarr[i] + "</li>";
    }else {
        str = str + "<li class='liClick'>" + myarr[i] + "</li>";
    }
}
$(".model-li-plane ul").html(str);
$(".model-li-plane").on("click", "li", function addfood() {
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
$(".model-li-section ul").html(str);
$(".model-li-section").on("click", "li", function addfood() {
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
$(".model-li-temporal ul").html(str);
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

//范围
const cityArr = ["全国", "华东", "浙江", "台州"];
const cityArrList = [];
$.each(cityArr, function(index, obj) {
    index == 0? cityArrList.push(`<li class='cityArr city-time-active' style="cursor:pointer">${obj}</li>`):
    cityArrList.push(`<li class='cityArr' style="cursor:pointer;">${obj}</li>`)
});
$("#cityArr").html(cityArrList);
$('#cityArr').on('click','.cityArr',function(){
    $(this).parents('#cityArr').find('.cityArr').removeClass('city-time-active');
    $(this).addClass('city-time-active');
    console.log(this)
});

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

//探空图-右侧-站点信息 
const siteInfoData = [
    {name: '产品名称',code: 'T-LogP'},
    {name: '台站编号',code: '58665'},
    {name: '台站经度',code: '121.42'},
    {name: '台站纬度',code: '28.62'},
    {name: '观测日期',code: '2020-01-01'},
    {name: '观测时间',code: '08:00'},
]
const siteInfo = [];
$.each(siteInfoData, function(index, obj) {
    siteInfo.push(`
        <li class='siteInfo'>${obj.name}：${obj.code}</li>
    `)
});
$("#siteInfo").html(siteInfo);

$(function() {      // 页面加载之后调用
    $.ajax({
        type: "get",    //请求方式为get，也可以是设置为post
        url: "roleList.json",     //所要获取的json文件相对地址，注意不要写错了，我这里放在同一个目录下的
        async: true,　　　　　　　　//是否为异步请求，ture为异步请求，false为同步请求
        success: function(d) {    //当请求之后调用。传入返回后的数据，以及包含成功代码的字符串
            
        }
    });
});