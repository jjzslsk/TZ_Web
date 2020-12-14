"use strict";
var planeTabActive //平面图 右侧 TAB 事件
layui.use(['element', 'form', 'layer', 'laydate'], function () {
    var element = layui.element,
    form = layui.form,
    layer = layui.layer,
    laydate = layui.laydate
    //监听指定开关  播放速度
    form.on('switch(switchTest)', function (data) {
        if (this.checked) {
            playSpeed = 1000;
        }
        else {
            playSpeed = 2000;
        }
    });
    var soundingDate = new Date();
    laydate.render({
        elem: '#soundingDate',
        value: soundingDate,
        //头部点击切换
        change: function (value, date, endDate) {
            soundingDate = value;
        },
        //点击选中
        done: function (value, date, endDate) {
            soundingDate = value;
        }
    });
    $(".updateDate").click(function () {
        $(this).attr("code") == 'temporalDate' ?
            (temporalDate = new Date(),
                laydate.render({
                    elem: '#temporalDate',
                    value: temporalDate
                })) :
            (soundingDate = new Date(),
                laydate.render({
                    elem: '#soundingDate',
                    value: soundingDate
                }));
    });
    $(".topDate").on("click", function () {
        if ($(this).attr("code") == 'temporalDate') {
            var day1 = new Date(temporalDate);
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
            var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
            temporalDate = s1;
            laydate.render({
                elem: '#temporalDate',
                value: temporalDate
            });
        }
        else if ($(this).attr("code") == 'soundingDate') {
            var day1 = new Date(soundingDate);
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
            var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
            soundingDate = s1;
            laydate.render({
                elem: '#soundingDate',
                value: soundingDate
            });
        }
    });
    $(".bottomDate").click(function () {
        if ($(this).attr("code") == 'temporalDate') {
            var day3 = new Date(temporalDate);
            day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
            var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
            temporalDate = s3;
            laydate.render({
                elem: '#temporalDate',
                value: temporalDate
            });
        }
        else if ($(this).attr("code") == 'soundingDate') {
            var day3 = new Date(soundingDate);
            day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
            var s3 = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
            soundingDate = s3;
            laydate.render({
                elem: '#soundingDate',
                value: soundingDate
            });
        }
    });
    $("#rightCard").hide();
    $("#rightSection").hide();
    element.on('tab(demo)', function (data) {
        // console.log(data.index); //得到当前Tab的所在下标
        if (data.index == 0) {
            $(".main-plane").show();
            $(".main-section").hide();
            $(".main-temporal").hide();
            $(".main-sounding").hide();
            $(".right-box").show();
            $("#rightCard").hide();
            $("#rightTab").show();
            $("#rightSection").hide();
        }
        else if (data.index == 1) {
            $(".main-plane").hide();
            $(".main-section").show();
            $(".main-temporal").hide();
            $(".main-sounding").hide();
            $(".right-box").show();
            $("#rightCard").hide();
            $("#rightTab").hide();
            $("#rightSection").show();
        }
        else if (data.index == 2) {
            $(".main-plane").hide();
            $(".main-section").hide();
            $(".main-temporal").show();
            $(".main-sounding").hide();
            $(".right-box").hide();
            $("#rightTab").show();
            $("#rightCard").hide();
            $("#rightSection").hide();
        }
        else if (data.index == 3) {
            $(".main-plane").hide();
            $(".main-section").hide();
            $(".main-temporal").hide();
            $(".main-sounding").show();
            $(".right-box").show();
            $("#rightTab").hide();
            $("#rightCard").show();
            $("#rightSection").hide();
        }
    });

    ///平面图 TAB 切换
    element.on('tab(rightTab)', function(data){
        planeRightTab(data)
    });

    //平面图 切换到指定Tab项
    planeTabActive = {
        tabChange: function (index) {
            element.tabChange('rightTab', index);
        }
    }
});
