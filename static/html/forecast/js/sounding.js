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
    siteInfo.push(`<li class='siteInfo'>${obj.name}：${obj.code}</li>`)
});
$("#siteInfo").html(siteInfo);