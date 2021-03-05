//平面图 js
window.onload = function(){
    requestData()
}
let model;//模式
let scope;//范围
let selectedModel;//模式选中
let selectedScope = 'CHN';//范围选中
let modelImgPath;//模式选中路径
// let upperImgPath;//高空选中路径
// let grounImgPadth;//地面选中路径
let upperAirData;
let groundData;
let mixtureData; //综合
let forecastDate;//选中预报时间
let forecastInterval;//间隔时间
let forecastFrequency;//时次时间
let eleHeight;//高度
let hPaHeight;//高度hPa
let hPaIndex;//高度hPa下标
let dataHour = '';//间隔选中
let factorPath;//选中要素ImgPadth
let mixturePath;//选中综合ImgPadth
let obtainImgList = [];//获取到的图片
let obtainImgListObj;//获取到的图片对象
let rightTabIndex; //右侧TAB下标 0 实时查询， 1 历史查询
let theDomImg;//当前显示的图片Dom
let theImg;//当前显示的图片src
let tabButIndex = 0;//选中观看模式按钮

//初始化获取数据
async function requestData(){
     //获取范围
     var param = {eleType:'范围',}
     await getData(main_url,'/ssd-forecast-element/getElemnetInfo?',param).then(res=>{
         scope = res.data
         selectedScope = scope[3].img_path//初始化
         formatScope(scope,3)//初始化为全国 //范围DOM 单选
     })

    //获取模式
    var param = {eleType:'模式',}
    await getData(main_url,'/ssd-forecast-element/getElemnetInfo?',param).then(res=>{
        model = res.data
        formatModel(model,0)//初始化为EC //模式 DOM 单选
        modelImgPath = model[0].img_path//初始化
        selectedModel = model[0].ele_name//初始化
    })
    
    //获取高空要素
    var param = {forecastEle:model[0].ele_name}
    await getData(main_url,'/ssd-forecast-element/getHighEle?',param).then(res=>{
        upperAirData = []
        Object.keys(res.data).forEach(key=>{
            upperAirData.push({type:key,content:res.data[key]})
        })
        formatUpperAir(upperAirData) //高空要素DOM
    });

    //获取地面要素
    var param = {eleType:'地面',model:model[0].ele_name}
    await getData(main_url,'/ssd-forecast-element/getElemnetInfo?',param).then(res=>{
        groundData = res.data
        formatGround(groundData,false)
    })

    //获取综合分析
    var param = {eleType:'综合',model:model[0].ele_name}
    await getData(main_url,'/ssd-forecast-element/getElemnetInfo?',param).then(res=>{
        mixtureData = res.data
        factorPath = mixtureData[0].img_path
        eleHeight = mixtureData[0].ele_height
        formatMixture(mixtureData,0)
    })

    //初始化第一张图片
    function fnAir(){
        return new Promise((resolve) => {
                resolve()
                // reject()
        })
    }
    await fnAir().then(res=>{fnDate()})

}
//更新预报时间列表，并获取图片渲染
async function fnDate(){
    //获取选择时间 根据 模式+要素
    if(modelImgPath&&factorPath){
        let param = {
            pattern:modelImgPath,
            ele:factorPath
        }
       let resForecas = await getData(main_url,'/ssd-forecast-element/getDataTime?',param).then(res=>{
            if(res.data.length == 0){
                layer.msg('暂无预报时间选择',{time:3000});
                $('.main-view').hide()
                forecastDate = null
                formatDate(res.data).then(res=>{})//渲染预报时间选择
            }else{
                $('.main-view').show()
                forecastDate = res.data[0]? res.data[0].elePath:null //初始化选择时间第一个
                formatDate(res.data).then(res=>{})//渲染预报时间选择
            }
        })
        await requestIntervalTime()
    }else{
        stampsNum = 0 //清空邮票记步
        obtainImgList = []
        obtainImgListObj = []
        applyPreviewImg([]) //渲染图片
        drawingStamps() //渲染邮票模式
        forecastFrequencyList([]).then(res=>{}) //渲染图片列表
    }
}

//刷新 时间间隔 + 展示图片
function requestIntervalTime(){
    return new Promise((resolve, reject) => {
        if(!forecastDate){ //无预报时间选择
            getGfterData([]).then(res=>{
                    stampsNum = 0 //清空邮票记步
                    obtainImgList = []
                    obtainImgListObj = []
                    applyPreviewImg([]) //渲染图片
                    drawingStamps() //渲染邮票模式
            }) //渲染时间间隔
            forecastFrequencyList([]).then(res=>{}) //渲染图片列表
        }else{
            //获取时间间隔 根据 模式+要素+时间选择
            let intervalDate = {
                pattern:modelImgPath,
                ele:forecastDate,
                range:selectedScope,
            }
            getData(main_url,'/ssd-forecast-element/getTimeFrequency?',intervalDate).then(res=>{
                //渲染时间间隔
                if(res.data){
                    getGfterData(res.data).then(res=>{ //渲染时间间隔
                        obtainImg(function(){ //获取图片
                            stampsNum = 0 //清空邮票记步
                            applyPreviewImg() //渲染图片
                            drawingStamps() //渲染邮票模式
                            resolve()
                        })
                    })
                }else{
                    layer.msg('暂无时间间隔',{time:2000});
                    getGfterData([]).then(res=>{reject()}) //渲染时间间隔
                }
            })
        }
    })
}

//获取图片
let ImgParam 
function obtainImg (callbacks,past = false){//past 是否为 历史查询
    ImgParam = {
        pattern:modelImgPath,//模式选中路径
        ele:forecastDate,//选中预报时间
        range:selectedScope,//范围选中
        dataHour: past? null:dataHour,//间隔选中,   历史查询不需要传dataHour
        high:eleHeight,//高度
    }
    obtainImgList = []
    obtainImgListObj = []
    getData(main_url,'/ssd-forecast-element/getTimeData?',ImgParam).then(res=>{
        obtainImgListObj = res.data
        res.data.forEach(element => {
            obtainImgList.push(element.filePath)
        });
        callbacks()

        if(past) return
        forecastFrequencyList(obtainImgListObj).then(res=>{}) //渲染图片列表
    })
}

//渲染图片
let obtainList = [];
function applyPreviewImg (arrList = obtainImgList){
    present = 0 //当前下标，显示第一张
    obtainList = [];
    if(arrList.length == 0){
        layer.msg('暂无数据',{time:700});
        $('.main-view').hide()
    }
    else{
        $.each(arrList, function(index, obj) {obtainList.push(`<img src=${obj} alt="" srcset="" style="cursor:pointer;" index=${index} onclick="previewMax(this)">`)});
    }
    if(arrList.length > 1){
        $('.main-view').show()
    }
    theDomImg = obtainList[0]
    $("#previewImg").html(theDomImg);
}

let present = 0 //当前下标  //theDomImg 当前显示图片
//平面图 浏览切换
    $('.switch-but').click(function(){
       if($(this).attr('code') == "right" && present < obtainList.length - 1){
        present += 1;
        theDomImg = obtainList[present];
        $("#previewImg").html(theDomImg);
       }else if($(this).attr('code') == "left" && present !== 0){
        present -= 1;
        theDomImg = obtainList[present];
        $("#previewImg").html(theDomImg);
      } else {
        layer.msg('最后一张了',{time:700});
      }
    })

//图片播放
let playState //播放状态 true播放 false暂停
let playSpeed = 2000 //播放速度
function playImg(){
    if(!playState) {
        return
    }
    if(obtainList.length == present){
        present = 0
        theDomImg = obtainList[present];
        $("#previewImg").html(theDomImg);
        present += 1;
        setTimeout(() => {
            playImg()
        }, playSpeed);
    }else{
        theDomImg = obtainList[present];
        $("#previewImg").html(theDomImg);
        present += 1;
        setTimeout(() => {
            playImg()
        }, playSpeed);
    }
}

//  播放/暂停，按钮单选
$('.yuan').on('click',function(){
    $('.is-active-play').removeClass('is-active-play');
    $(this).addClass("is-active-play").siblings().removeClass("is-active-play");
    if($(this).attr('code') == "play"){
        layer.msg('播放',{time:1000});
        playState = true
        playImg()
    }else{
        layer.msg('暂停',{time:2000});
        playState = false
    }
})

//图片预览
function previewMax(obj){
    let imgObjArr = []
    obtainImgList.forEach((element,index) => {
        imgObjArr.push({
            "pid": index, //图片id
            "src": element, //原图地址
        })
    });

//调用示例
  layer.photos({
	//类选择器  选择图片的父容器	  
    photos: {"start": $(obj).attr('index'),data:imgObjArr}
    ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
  });

}

$(document).on("mousewheel DOMMouseScroll", ".layui-layer-phimg", function (e) {
    var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
    var imagep = $(".layui-layer-phimg").parent().parent();
    var image = $(".layui-layer-phimg").parent();
    var h = image.height();
    var w = image.width();
    if (delta > 0) {
        if (h < (window.innerHeight)) {
            h = h * 1.05;
            w = w * 1.05;
        }
    } else if (delta < 0) {
        if (h > 100) {
            h = h * 0.95;
            w = w * 0.95;
        }
    }
    imagep.css("top", (window.innerHeight - h) / 2);
    imagep.css("left", (window.innerWidth - w) / 2);
    image.height(h);
    image.width(w);
    imagep.height(h);
    imagep.width(w);
});

//模式 DOM 单选
function formatModel(dataList,_index = 0){
    let str = "";
    let addstr = "";
    for (let i = 0; i < dataList.length; i++) {
        if(i== _index){
            str = str + `<li style='cursor:pointer' img_path='${dataList[i].img_path}' class='is-active liClick'>${dataList[i].ele_name}</li>`;
        }else {
            str = str + `<li style='cursor:pointer' img_path='${dataList[i].img_path}' class='liClick'>${dataList[i].ele_name}</li>`;
        }
    }
    $(".model-li-plane ul").html(str);
}
$(".model-li-plane").on("click", "li",async function addfood() {
    $(this).parents('#modelLiPlane').find('.liClick').removeClass('is-active');
    $(this).addClass('is-active');
    $(".model-li-plane ul .is-active").each(function(i,o){
        modelImgPath = $(this).attr('img_path')
        selectedModel = $(this).text()
        resetModel()
    });
    //重置 预报时间间隔
    // $("#forecastAfter").html(forecastAfter);
    // dataHour = '003'
});

//选择模式 刷新数据
async function resetModel(){
    //切换到指定Tab项
    planeTabActive.tabChange('01')

    //获取地面要素
    var param = {eleType:'地面',model:selectedModel}
    await getData(main_url,'/ssd-forecast-element/getElemnetInfo?',param).then(res=>{
        groundData = res.data
        formatGround(groundData,true)
        if(groundData.length > 0){
            factorPath = groundData[0].img_path
            eleHeight = groundData[0].ele_height
        }else{
            factorPath = null
            eleHeight = null
        }
        fnDate()
    })

    if(selectedModel == 'OCF' || selectedModel == '智能网格'){ //OCF 智能网格 默认选中台州
        selectedScope = scope[0].img_path
        formatScope(scope,0)

        // OCF 智能网格   没有综合 和高空
        formatUpperAir([])//高空
        formatMixture([])//综合
        $(".factor-box").hide();//高空
        $(".analyze-wrap").hide();//综合
        return
    }else{
        $(".factor-box").show();
        $(".analyze-wrap").show();
    }

    //获取综合分析
    var param = {eleType:'综合',model:selectedModel}
    await getData(main_url,'/ssd-forecast-element/getElemnetInfo?',param).then(res=>{
        mixtureData = res.data

        // 模式为ECMWF-IFS时，选中第一个综合
        if(selectedModel == 'ECMWF-IFS'){
            selectedScope = scope[3].img_path
            formatScope(scope,3)
            formatMixture(mixtureData,0)
                if($("#upperAir .upper-item").hasClass("upper-factor-active")){//移除高空要素 选中
                    $("#upperAir .upper-item").removeClass("upper-factor-active");
                    }else{}
                    if($("#groundFactor .groundFactor").hasClass("ground-factor-active")){//移除地面要素 选中 eleHeight
                    $("#groundFactor .groundFactor").removeClass("ground-factor-active");
                    }else{}
        
            factorPath = mixtureData[0].img_path
            eleHeight = mixtureData[0].ele_height
            fnDate()
        }else{
            formatMixture(mixtureData)
        }

    })
    
    //获取高空要素
    var param = {forecastEle:selectedModel,}
    await getData(main_url,'/ssd-forecast-element/getHighEle?',param).then(res=>{
        upperAirData = []
        Object.keys(res.data).forEach(key=>{
            upperAirData.push({type:key,content:res.data[key]})
        })
        formatUpperAir(upperAirData)
    })

    
}

//范围DOM 单选
function formatScope(dataList,_index = 0){
    const cityArrList = [];
    $.each(dataList, function(index, obj) {
        index == _index? cityArrList.push(`<li code=${obj.img_path} class='cityArr city-time-active' style="cursor:pointer">${obj.ele_name}</li>`):
        cityArrList.push(`<li code=${obj.img_path} class='cityArr' style="cursor:pointer;">${obj.ele_name}</li>`)
    });
    $("#cityArr").html(cityArrList);
}
$('#cityArr').on('click','.cityArr',function(){
    $(this).parents('#cityArr').find('.cityArr').removeClass('city-time-active');
    $(this).addClass('city-time-active');
    selectedScope = $(this).attr('code')
    if(!forecastDate){layer.msg('未选择预报时间',{time:700});return}

    //切换到指定Tab项
    planeTabActive.tabChange('01')

    obtainImg(function(){
        stampsNum = 0 //清空邮票记步
        applyPreviewImg()
        drawingStamps()
    })
});

//平面图-左侧-地面DOM 单选
function formatGround(dataList = [],opt = false){ //opt true现在第一个， false 不选中
    let groundFactor = [];
    if(dataList.length == 0){
        groundFactor.push(`<div class="button-item " style='text-align: center;display: flex;justify-content: center;align-items: center;'>暂无数据</div>`)
        $("#groundFactor").html(groundFactor);
        $('.main-view').hide()
        formatDate([]).then(res=>{})//渲染预报时间选择
        getGfterData([]).then(res=>{}) //渲染时间间隔
        return
    }else{
        $('.main-view').show()
    }
    $.each(dataList, function(index, obj) {
        (index == 0 && opt)? groundFactor.push(
            `<div code='${obj.img_path}' class="button-item groundFactor ground-factor-active" ele_height='${obj.ele_height}' img_path='${obj.img_path}' style="cursor:pointer">${obj.ele_name}</div>`):
        groundFactor.push(
            `<div code='${obj.img_path}' class="button-item groundFactor" ele_height='${obj.ele_height}' img_path='${obj.img_path}' style="cursor:pointer">${obj.ele_name}</div>`)
    });
    $("#groundFactor").html(groundFactor);
}
$('#groundFactor').on('click','.groundFactor',function(){
    $(this).parents('#groundFactor').find('.groundFactor').removeClass('ground-factor-active');
    $(this).addClass('ground-factor-active');

    if($("#upperAir .upper-item").hasClass("upper-factor-active")){//移除高空要素 选中
        $("#upperAir .upper-item").removeClass("upper-factor-active");
     }else{}

     if($("#synthesize .synthesize").hasClass("synthesize-time-active")){//移除综合分析 选中
        $("#synthesize .synthesize").removeClass("synthesize-time-active");
     }else{}

     //切换到指定Tab项
     planeTabActive.tabChange('01')

     eleHeight = $(this).attr('ele_height')
     factorPath = $(this).attr('img_path')
     fnDate()
});


//平面图-左侧-高空要素DOM 单选 
function formatUpperAir(dataList = []){
    let upperAir = [];
    let upperAirTitle = [];
    if(dataList.length == 0){
        upperAir.push(`
            <p class='upper-item'>暂无数据</p>
            `)
        $("#upperAir").html(upperAir);
        $('.factor-num').hide();
        return
    }
    $('.factor-num').show();
    $.each(dataList, function(index, obj) {//tab 默认选中第一个
        index == 0? upperAirTitle.push(`<li upperAirTitleIndex=${index} content=${obj.type} class='upperAirTitle upperAirTitle-time-active' style="cursor:pointer">${obj.type}hPa</li>`):
        upperAirTitle.push(`<li upperAirTitleIndex=${index} content=${obj.type} class='upperAirTitle' style="cursor:pointer;">${obj.type}hPa</li>`)
    });
    $("#upperAirTitle").html(upperAirTitle);


    $.each(dataList, function(index, obj) {//要素遍历渲染
        if(index == 0){
            $.each(obj.content, function(index, item) {
            upperAir.push(`<li class='upper-item' eleHeight='${item.ele_height}' img_path='${item.img_path}' style="cursor:pointer;">${item.ele_name}</li>`)
        });
        }
    });
    $("#upperAir").html(upperAir);
}
//高空tab 点击
$('#upperAirTitle').on('click','.upperAirTitle',function(){
    $(this).parents('#upperAirTitle').find('.upperAirTitle').removeClass('upperAirTitle-time-active');
    $(this).addClass('upperAirTitle-time-active');
    hPaIndex = 0
    hPaIndex = $(this).attr('upperAirTitleIndex')

    upperAir = []
    $.each(upperAirData, function(index, obj) {//要素
        if(index == hPaIndex){
            $.each(obj.content, function(index, item) {
            index == 0? upperAir.push(`<li class='upper-item upper-factor-active' ele_height='${item.ele_height}' img_path='${item.img_path}' style="cursor:pointer;">${item.ele_name}</li>`)
            :upperAir.push(`<li class='upper-item' img_path='${item.img_path}' eleHeight='${item.ele_height}' style="cursor:pointer;">${item.ele_name}</li>`)

            eleHeight = item.ele_height
        });
        }
    });
    $("#upperAir").html(upperAir);

    if($("#groundFactor .groundFactor").hasClass("ground-factor-active")){//移除地面要素 选中
        $("#groundFactor .groundFactor").removeClass("ground-factor-active");
    }else{}

    if($("#synthesize .synthesize").hasClass("synthesize-time-active")){//移除综合分析 选中
        $("#synthesize .synthesize").removeClass("synthesize-time-active");
        }else{}

        //切换到指定Tab项
        planeTabActive.tabChange('01')

    factorPath = upperAirData[hPaIndex].content[0].img_path
    fnDate()
});


//平面图-左侧-综合分析 （单选）
function formatMixture(dataList = [],_index = null){
const synthesizeData = [
    {content: '500hPa高度场+200hPa散度+500hPa风场111111111',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场2',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场3',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场4',code: 'long'},
    {content: '500hPa高度场+200hPa散度+500hPa风场5',code: 'long'},
]
const synthesize = [];
$.each(dataList, function(index, obj) {
    if(_index !== null){
            index == _index?  synthesize.push(`<li img_path='${obj.img_path}' eleHeight='${obj.ele_height}' class='synthesize synthesize-time-active' style="cursor:pointer">${obj.ele_name}</li>`):
            synthesize.push(`<li img_path='${obj.img_path}' eleHeight='${obj.ele_height}' class='synthesize' style="cursor:pointer;">${obj.ele_name}</li>`)
    }else{
        synthesize.push(`<li img_path='${obj.img_path}' eleHeight='${obj.ele_height}' class='synthesize' style="cursor:pointer;">${obj.ele_name}</li>`)
    }
});
$("#synthesize").html(synthesize);
}
$('#synthesize').on('click','.synthesize',function(){
    $(this).parents('#synthesize').find('.synthesize').removeClass('synthesize-time-active');
    $(this).addClass('synthesize-time-active');

    if($("#upperAir .upper-item").hasClass("upper-factor-active")){//移除高空要素 选中
        $("#upperAir .upper-item").removeClass("upper-factor-active");
        }else{}

        if($("#groundFactor .groundFactor").hasClass("ground-factor-active")){//移除地面要素 选中 eleHeight
        $("#groundFactor .groundFactor").removeClass("ground-factor-active");
        }else{}

        //切换到指定Tab项
        planeTabActive.tabChange('01')

    factorPath = $(this).attr('img_path')
    eleHeight = $(this).attr('eleHeight')
    fnDate()
});

//高空要素 点击
$('#upperAir').on('click','li',function(){
    $(this).parents('#upperAir').find('.upper-item').removeClass('upper-factor-active');
    $(this).addClass('upper-factor-active');

    if($("#groundFactor .groundFactor").hasClass("ground-factor-active")){//移除地面要素 选中
        $("#groundFactor .groundFactor").removeClass("ground-factor-active");
     }else{}

     if($("#synthesize .synthesize").hasClass("synthesize-time-active")){//移除综合分析 选中
        $("#synthesize .synthesize").removeClass("synthesize-time-active");
     }else{}

     //切换到指定Tab项
     planeTabActive.tabChange('01')

    factorPath = $(this).attr('img_path')
    eleHeight = $(this).attr('eleHeight')
    fnDate()
});




//平面图-实时查询-预报时间选择 （单选）
function formatDate (date = []){
    return new Promise((resolve, reject) => {
        let forecastTime = [];
        if(date.length == 0){
            forecastTime.push(`<li>暂无数据</li>`)
            $('.main-view').hide()
        }else{
            $.each(date, function(index, obj) {
                index == 0? forecastTime.push(`<li code=${obj.elePath} class='forecastTime forecast-time-active' style="cursor:pointer">${obj.hours}</li>`):
                forecastTime.push(`<li code=${obj.elePath} class='forecastTime' style="cursor:pointer;">${obj.hours}</li>`)
            });
            $('.main-view').show()
        }
        $("#forecastTime").html(forecastTime); 
        resolve()
    });
};
$('#forecastTime').on('click','.forecastTime',function(){
    $(this).parents('#forecastTime').find('.forecastTime').removeClass('forecast-time-active');
    $(this).addClass('forecast-time-active');
    forecastDate = $(this).attr('code')
    requestIntervalTime() //刷新 时间间隔 + 展示图片
});

//平面图-实时查询-预报间隔 （单选）
function getGfterData (afterData){
    return new Promise((resolve, reject) => {
        afterData = [
            {name:'0-72h',code:'72'},
            {name:'76-240h',code:'76'}
        ]
        const forecastAfter = [];
        if(afterData.length == 0){
            forecastAfter.push(`<div style="padding-left:37%;">暂无数据</div>`)
            $('.main-view').hide()
        }else{
            $.each(afterData, function(index, obj) {
                index == 0? forecastAfter.push(`<div code=${obj.code} class='forecastAfter button-item after-time-active' style="cursor:pointer">${obj.name}</div>`):
                forecastAfter.push(`<div code=${obj.code} class='forecastAfter button-item' style="cursor:pointer;">${obj.name}</div>`)
            });
            dataHour = afterData[0].code
            $('.main-view').show()
        }
        $("#forecastAfter").html(forecastAfter);
        resolve()
    });
}
$('#forecastAfter').on('click','.forecastAfter',function(){
    $(this).parents('#forecastAfter').find('.forecastAfter').removeClass('after-time-active');
    $(this).addClass('after-time-active');
    dataHour = $(this).attr('code')
    if(!forecastDate){layer.msg('未选择预报时间',{time:700});return}
    obtainImg(function(){
        stampsNum = 0 //清空邮票记步
        applyPreviewImg()
        drawingStamps()
    })
});

//平面图-实时查询-图片列表 （单选）
function forecastFrequencyList(dataList = []){
    return new Promise((resolve, reject) => {
        let forecastFrequency = []
        if(dataList.length > 0){
            $.each(dataList, function(index, obj) {
                index == 0? forecastFrequency.push(`<li name=${obj.filename} filePath=${JSON.stringify(obj.filePath)} class='forecastFrequency frequency-time-active' style="cursor:pointer">${obj.filename}</li>`):
                forecastFrequency.push(`<li name=${obj.filename} filePath=${JSON.stringify(obj.filePath)} class='forecastFrequency' style="cursor:pointer;">${obj.filename}</li>`)
            });
            //tips层
            $(function(){
                var tips;
                $('.forecastFrequency').on({
                    mouseenter:function(){
                        var that = this;
                        tips =layer.tips(`<span style='color:#000;'>${$(this).attr("name")}</span>`,that,{tips:[2,'#fff'],time:0,area: 'auto',maxWidth:500});
                    },
                    mouseleave:function(){
                        layer.close(tips);
                    }
                });
            })
        }else{
            forecastFrequency.push(`<li>暂无数据</li>`)
        }
        
        $("#forecastFrequency").html(forecastFrequency);
        resolve()
    });
}
$('#forecastFrequency').on('click','.forecastFrequency',function(){
    $(this).parents('#forecastFrequency').find('.forecastFrequency').removeClass('frequency-time-active');
    $(this).addClass('frequency-time-active');
    obtainImgList = []
    obtainImgList.push($(this).attr("filePath"))
        stampsNum = 0 //清空邮票记步
        applyPreviewImg() //渲染图片
        drawingStamps() //渲染邮票模式
});

    //观看模式
$(".isStamps").addClass('isModel')//初始化隐藏邮票底部控件
$("#click_browse").click(function(){
    $(".browse-box").show()
    $("#click_browse").addClass('but-active')
    $(".stamps-box").hide()
    $("#click_stamps").removeClass('but-active')
    $(".isBrowse").removeClass('isModel')
    $(".isStamps").addClass('isModel')
    tabButIndex = 0
});

$("#click_stamps").click(function(){
    $(".browse-box").hide()
    $("#click_browse").removeClass('but-active')
    $(".stamps-box").show()
    $("#click_stamps").addClass('but-active')
    $(".isBrowse").addClass('isModel')
    $(".isStamps").removeClass('isModel')
    tabButIndex = 1
    drawingStamps()
});

//渲染邮票模式
let stampsImg = []
function drawingStamps(){
    stampsImg = []
    $.each(obtainImgList, function(index, obj) {
        if(index < 4){
            stampsImg.push(`
            <div class="col-item">
                <div class="item-map-img">
                <img src="${obj}" alt="" style="cursor:pointer;" index=${index} onclick="previewMax(this)">
                </div>
            </div>
            `)
        }
    });
    $("#stampsPattern").html(stampsImg);
}

//邮票图片切换
let stampsNum = 0 //清空邮票记步
$(".stamp-but").click(function(){
    console.log('总长',parseInt(obtainImgList.length))
    stampsImg = []
    if($(this).attr('code') == 'right'){
        if(stampsNum == parseInt(obtainImgList.length / 4)) {
            layer.msg('最后一页了',{time:700})
            return
        }
        stampsNum += 1
        if(obtainImgList.length > 4){
            $.each(obtainImgList, function(index, obj) {
                if(index >= stampsNum*4 && index < (stampsNum*4)+4){
                    stampsImg.push(`
                    <div class="col-item">
                        <div class="item-map-img">
                        <img src="${obj}" alt="" style="cursor:pointer;" index=${index} onclick="previewMax(this)">
                        </div>
                    </div>
                    `)
                }
            });
            $("#stampsPattern").html(stampsImg);
        }
    }
    if($(this).attr('code') == 'left'){
        if(stampsNum == 0) {
            layer.msg('最后一页了',{time:700})
            return
        }
        stampsNum -= 1
        if(obtainImgList.length > 4){
            $.each(obtainImgList, function(index, obj) {
                if(index >= stampsNum*4 && index < (stampsNum*4)+4){
                    stampsImg.push(`
                    <div class="col-item">
                        <div class="item-map-img">
                        <img src="${obj}" alt="" style="cursor:pointer;" index=${index} onclick="previewMax(this)">
                        </div>
                    </div>
                    `)
                }
            });
            $("#stampsPattern").html(stampsImg);
        }
    }
});


//综合分析 移入弹窗
var tip_index;
$(".synthesize").hover(function(){
tip_index = layer.tips($(this).attr('content'),this,{time:0});
},function(){
    layer.close(tip_index);
});

async function planeRightTab (data){
    rightTabIndex = data.index
    if(data.index == 1){
        requestPlaneRightHistory()
    }
}

async function requestPlaneRightHistory (){
    let param = {
        pattern:modelImgPath,
        ele:factorPath,//要素
        showAll:1
    }
    //获取 历史查询-列表
    await getData(main_url,'/ssd-forecast-element/getDataTime?',param).then(res=>{
        const planeHistoryArr = res.data
        planeHistory = [];
        $.each(planeHistoryArr, function(index, obj) {
            index == 0? planeHistory.push(`<li code=${obj.elePath} class='planeHistory plane-time-active' style="cursor:pointer">${obj.hours}</li>`):
            planeHistory.push(`<li code=${obj.elePath} class='planeHistory' style="cursor:pointer;">${obj.hours}</li>`)
        });
        $("#planeHistory").html(planeHistory);

        forecastDate = planeHistoryArr[0].elePath //默认第一张
        obtainImg(function(){ //获取图片
            stampsNum = 0 //清空邮票记步
            applyPreviewImg() //渲染图片
            drawingStamps() //渲染邮票模式
        },true)

    })
}
$('#planeHistory').on('click','.planeHistory',function(){
    $(this).parents('#planeHistory').find('.planeHistory').removeClass('plane-time-active');
    $(this).addClass('plane-time-active');
    forecastDate = $(this).attr('code')
    obtainImg(function(){ //获取图片
        stampsNum = 0 //清空邮票记步
        applyPreviewImg() //渲染图片
        drawingStamps() //渲染邮票模式
    },true)
});

//单张图片下载
$('#imgDow').on('click',function(src,name){
    if(tabButIndex == 0){
        var _url = `http://10.137.4.30:6001/integration/main/ssd-forecast-element/downloadImg?src=${$('div[id=previewImg] img').attr("src")}` 
        window.open(_url)
    }else if(tabButIndex == 1){
        let param = `pattern=${ImgParam.pattern}&ele=${ImgParam.ele}&range=${ImgParam.range}&high=${ImgParam.high}&dataHour=${ImgParam.dataHour}`
        var _url = `http://10.137.4.30:6001/integration/main/ssd-forecast-element/downloadImg?${param}` 
        window.open(_url)
    }
})