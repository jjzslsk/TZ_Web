layui.use(['element','table','laydate','form','layer'], function() {
    var $ = layui.jquery,
        table = layui.table,
        laydate = layui.laydate,
        form = layui.form,
        layer = layui.layer,
        element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

    var head = [];
    var head1 = getHeader();
    var head3 = getHeader3();
    var columns = [];

    laydate.render({
        elem: '#datatime'
        ,value: new Date(new Date()-1000*60*60*24)
        ,theme: 'molv'
        ,max:-1
        ,done: function(value, date){
            head = [];
            loaddata();
        }
    });

    var checkAll = $('.essentialFactor').find('.essentialFactorItem').find('input[type="checkbox"]:checked');
    for (var i = 0 ; i < checkAll.length; i++) {
        columns.push($(checkAll[i]).val());
        columns.push($(checkAll[i]).val()+"_asc");
        columns.push($(checkAll[i]).val()+"_desc");
    }
    var placeArr = [];
    var txt1 = $('.Township').find('li').eq(0).text();
    var txt2 = $('.stationName').find('li').eq(0).text();
    $.ajax({
        url: main_url + '/ssd-reminder-data-statistics/findStationList',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        async:false,
        success: function (res) {
            var data = res.data;
            var stations = data['stations'];
            if (res.code == 0) {
                for (var index in stations) {
                    var city = stations[index];
                    if (index == 0) {
                        $("#place").append("<li class=\"liAc\">"+city+"</li>");
                        changePlace(city,data[city]);
                    } else {
                        $("#place").append("<li>"+city+"</li>");
                    }
                    placeArr[city] = data[city];
                }

            } else {
                layer.msg(res.message);
            }
        },
        error: function (res) {
            layer.msg("获取站点异常");
        }
    });
    $('.Township ul').on('click','li',function(){
        head = [];
        txt1 = $(this).text();
        $(this).addClass('liAc').siblings().removeClass('liAc')
        changePlace(txt1,placeArr[txt1]);
        modifyTxtFn();
        loaddata();
    })
    $('.stationName ul').on('click','li',function(){
        head = [];
        txt2 = $(this).text()
        var code = $(this).attr("data-code");
        $("#stationNum").val(code);
        $(this).addClass('liAc').siblings().removeClass('liAc')
        modifyTxtFn();
        loaddata();
    })
    $("#determine").click(function () {
        head = [];
        columns = [];
        var checkAll = $('.essentialFactor').find('.essentialFactorItem').find('input[type="checkbox"]:checked');
        for (var i = 0 ; i < checkAll.length; i++) {
            columns.push($(checkAll[i]).val());
            columns.push($(checkAll[i]).val()+"_asc");
            columns.push($(checkAll[i]).val()+"_desc");
        }
        loaddata();
    });
    $("#cancel").click(function () {
        $("#eleInfo").hide();
    })
    function modifyTxtFn(){
        $('.select').find('span').text('台州市-'+txt1+'-'+txt2)
        $('.select').attr('title','台州市-'+txt1+'-'+txt2)
    }
    modifyTxtFn()

    // 全选
    $('.selectAll').find('input').on('click',function(){
        if($('.selectAll').find('input').prop('checked')){
            $('.essentialFactor').find('.essentialFactorItem').find('input').prop('checked',true)
        }else{
            $('.essentialFactor').find('.essentialFactorItem').find('input').prop('checked',false)
        }
    })
    $('.essentialFactor').find('.essentialFactorItem').find('input').on('click',function(){
        if($('.essentialFactor').find('.essentialFactorItem').find('input').length == $('.essentialFactor').find('.essentialFactorItem').find('input[type="checkbox"]:checked').length){
            $('.selectAll').find('input').prop('checked',true)
        }else{
            $('.selectAll').find('input').prop('checked',false)
        }
    })
    $("#eleBtn").click(function(){
        var display = $("#eleInfo").css("display");
        if (display == 'none') {
            $("#eleInfo").show();
        } else if (display == 'block') {
            $("#eleInfo").hide();
        }
    });

    function changePlace(city,stations) {
        $("#station").html('');
        for(var k = 0 ; k < stations.length;k++) {
            var name = stations[k].StationName;
            var code = stations[k].stationNum;
            if (k==0) {
                txt1 = city;
                txt2 = name;
                $('.select').find('span').text('台州市-'+city+'-'+name)
                $('.select').attr('title','台州市-'+city+'-'+name)
                $("#stationNum").val(code);
                $("#station").append("<li class=\"liAc\" data-code='"+code+"'>"+name+"</li>");
            } else {
                $("#station").append("<li data-code='"+code+"'>"+name+"</li>")
            }
        }
    }
    loaddata();
    function loaddata() {
        $.ajax({
            url: main_url + '/ssd-reminder-data-statistics/findHeader',
            dataType: 'json',
            data:{"datatime":$("#datatime").val()},
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.code == 0) {
                    var head2 = [];
                    var data = res.data;
                    var len = data.length;
                    for (var i = 0 ; i < len;i++) {
                        if (i == len - 1) {
                            head2.push({title: ""+data[i]+"", align: "center", colspan:5});
                        } else {
                            head2.push({title: ""+data[i]+"", align: "center", colspan:3});
                        }
                    }
                    head.push(head1);
                    head.push(head2);
                    head.push(head3);
                    var datatime = $("#datatime").val();
                    var station = $("#stationNum").val();
                    table.render({
                        elem: "#statistics",
                        url: main_url + '/ssd-reminder-data-statistics/findDataStatistics',
                        cols:head,
                        page:false,
                        cellMinWidth: 50,
                        where:{
                            "datatime": datatime,
                            "stationNum": station,
                            "columns":columns.join(",")
                        }
                    });
                }
            }
        });
    }

    function getHeader() {
        var head = [];
        head.push({field: "elename", title: "气象要素",rowspan:3,align: "center",width:160});
        head.push({title: "最近5天", align: "center", colspan:3});
        head.push({title: "最近10天", align: "center", colspan:3});
        head.push({title: "最近20天", align: "center", colspan:3});
        head.push({title: "最近30天", align: "center", colspan:3});
        head.push({title: "最近60天", align: "center", colspan:3});
        head.push({title: "本旬以来", align: "center", colspan:3});
        head.push({title: "本月以来", align: "center", colspan:3});
        head.push({title: "本季以来", align: "center", colspan:3});
        head.push({title: "本年以来", align: "center", colspan:3});
        head.push({title: "今日", align: "center", colspan:5});
        return head;
    }
    function getHeader3() {
        var head = [];
        head.push({field: "day5",title: "值", align: "center"});
        head.push({field: "day5Asc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day5Desc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day10",title: "值", align: "center"});
        head.push({field: "day10Asc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day10Desc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day20",title: "值", align: "center"});
        head.push({field: "day20Asc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day20Desc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day30",title: "值", align: "center"});
        head.push({field: "day30Asc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day30Desc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day60",title: "值", align: "center"});
        head.push({field: "day60Asc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day60Desc",title: "同↓", align: "center",templet:function(d){
                var sort = d[this.field];
                return changeColor(sort);
            }});
        head.push({field: "tenDays",title: "值", align: "center"});
        head.push({field: "tenDaysAsc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "tenDaysDesc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "month",title: "值", align: "center"});
        head.push({field: "monthAsc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "monthDesc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "season",title: "值", align: "center"});
        head.push({field: "seasonAsc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "seasonDesc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "year",title: "值", align: "center"});
        head.push({field: "yearAsc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "yearDesc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "day",title: "值", align: "center"});
        head.push({field: "dayAsc",title: "同↑", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "dayDesc",title: "同↓", align: "center",templet:function(d){
                return changeColor(d[this.field]);
            }});
        head.push({field: "hisdayAsc",title: "全↑", align: "center"});
        head.push({field: "hisdayDesc",title: "全↓", align: "center"});
        return head;
    }
    function changeColor(sort) {
        if (sort == null || typeof sort == 'undefined') {
            return '';
        } else if (sort == 1) {
            return "<span style='display: inline-block;width: 20px;height:20px;background: #ea493b;border-radius: 50%;line-height: 22px;box-shadow: 0px 0px 3px rgba(0,0,0,1);color: #fff'>1</span>";
        } else if (sort == 2) {
            return "<span style='display: inline-block;width: 20px;height:20px;background: #ff933e;border-radius: 50%;line-height: 22px;box-shadow: 0px 0px 3px rgba(0,0,0,1);color: #fff'>2</span>";
        } else if (sort == 3) {
            return "<span style='display: inline-block;width: 20px;height:20px;background: #f9cc35;border-radius: 50%;line-height: 22px;box-shadow: 0px 0px 3px rgba(0,0,0,1);color: #fff'>3</span>";
        } else if (sort == 4) {
            return "<span style='display: inline-block;width: 20px;height:20px;background: #34b06a;border-radius: 50%;line-height: 22px;box-shadow: 0px 0px 3px rgba(0,0,0,1);color: #fff'>4</span>";
        } else if (sort == 5) {
            return "<span style='display: inline-block;width: 20px;height:20px;background: #7aa8e0;border-radius: 50%;line-height: 22px;box-shadow: 0px 0px 3px rgba(0,0,0,1);color: #fff'>5</span>";
        } else {
            return sort;
        }
    }
});

