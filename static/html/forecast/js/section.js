let site;//选中的站点信息

//剖面图-左侧-站点选择
const siteList = [
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
const sectionSite = [];
$.each(siteList, function(index, obj) {
    index == 0? sectionSite.push(`<li obj=${JSON.stringify(obj)} class='sectionSite button-item site-time-active' style="cursor:pointer">${obj.name}</li>`):
    sectionSite.push(`<li obj=${JSON.stringify(obj)} class='sectionSite button-item' style="cursor:pointer;">${obj.name}</li>`)
});
$("#sectionSite").html(sectionSite);
$('#sectionSite').on('click','.sectionSite',function(){
    $(this).parents('#sectionSite').find('.sectionSite').removeClass('site-time-active');
    $(this).addClass('site-time-active');
    site = JSON.parse($(this).attr('obj'))
    $('#siteTitle').html(`<span>${JSON.stringify(new Date()).substring(1,11)} 起报:08 站名:${site.name} 经度:${site.lon}° 纬度:${site.lat}°</span>`)
});

//初始化标题
$('#siteTitle').html(`<span>${JSON.stringify(new Date()).substring(1,11)} 起报:08 站名:${siteList[0].name} 经度:${siteList[0].lon}° 纬度:${siteList[0].lat}°</span>`)

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