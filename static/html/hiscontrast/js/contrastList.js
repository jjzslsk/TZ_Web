
layui.use(['laydate', 'layer', 'form', 'table', 'element', 'tree'], function () {
    var laydate = layui.laydate //日期
        , layer = layui.layer //弹层
        , table = layui.table //表格
        , form = layui.form //表单
        , element = layui.element //元素操作
        ,tree = layui.tree;
    var $ = layui.$;
    var dateTime = new Date();
    dateTime=dateTime.setDate(dateTime.getDate()-1);
    dateTime=new Date(dateTime);
    var year = dateTime.getFullYear();
    var mouth = dateTime.getMonth()+1;
    if(mouth.toString().length=1){
        mouth = "0"+mouth;
    }
    var day = dateTime.getDate();
    if(day.toString().length=1){
        day = "0"+day;
    }
    var hisYear = (year-2)+" - "+(year-1);
    $("#yearHis").val(hisYear);
    $("#current").val(year+"-"+mouth+"-"+day);
    function init_(){
        //历史年区间
        laydate.render({
            elem: '#yearHis'
            ,type: 'year'
            ,value: hisYear
            ,format: 'yyyy'
            ,range: true
        });
        //默认当日
        laydate.render({
            elem: '#current'
            ,value: dateTime
            ,format: 'yyyy-MM-dd'
        });
        form.render("input");

    };

    init_();

    //下拉框选择监控
    form.on("select(selectDateType)", function(data){
        var value_ = data.value;
        var dateTime = new Date();
        dateTime=dateTime.setDate(dateTime.getDate()-1);
        dateTime=new Date(dateTime);
        $("#div_current").html("<input type='text' class='layui-input' name='current' id='current'>");
        var html ="";
        switch (value_) {
            case "day":
                //日
                laydate.render({
                    elem: '#current'
                    ,value: dateTime
                    ,format: 'yyyy-MM-dd'
                });
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:none;");
                break;
            case "hou":
                //候
                laydate.render({
                    elem: '#current'
                    ,type: 'month'
                    ,value: dateTime
                    ,format: 'yyyy-MM'
                });
                 html ="";
                 html+= "<option value='1'>一候</option>";
                html+= "<option value='2'>二候</option>";
                html+= "<option value='3'>三候</option>";
                html+= "<option value='4'>四候</option>";
                html+= "<option value='5'>五候</option>";
                html+= "<option value='6'>六候</option>";
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:block;");
                break;
            case "xun":
                //旬
                laydate.render({
                    elem: '#current'
                    ,type: 'month'
                    ,value: dateTime
                    ,format: 'yyyy-MM'
                });
                html ="";
                html+= "<option value='1'>上旬</option>";
                html+= "<option value='2'>中旬</option>";
                html+= "<option value='3'>下旬</option>";
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:block;");
                break;

            case "mouth":
                //月
                laydate.render({
                    elem: '#current'
                    ,type: 'month'
                    ,value: dateTime
                    ,format: 'yyyy-MM'
                });
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:none;");
                break;
            case "ji":
                //季度
                laydate.render({
                    elem: '#current'
                    ,type: 'year'
                    ,value: dateTime
                    ,format: 'yyyy'
                });
                html ="";
                html+= "<option value='1'>第一季度</option>";
                html+= "<option value='2'>第二季度</option>";
                html+= "<option value='3'>第三季度</option>";
                html+= "<option value='4'>第四季度</option>";
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:block;");
                break;
            case "year":
                //年
                laydate.render({
                    elem: '#current'
                    ,type: 'year'
                    ,value: dateTime
                    ,format: 'yyyy'
                });
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:none;");
                break;

            case "same":
                laydate.render({
                    elem: '#current'
                    ,range: true
                    ,format: 'yyyy-MM-dd'
                });
                $("#current_type").html(html);
                $("#div_current_type").attr("style","display:none;");
                break;
            default:
                break;
        }
        form.render('select');
    });

    var placeArr = [];
    var head = [];
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
    function modifyTxtFn(){
        $('.select').find('span').text('台州市-'+txt1+'-'+txt2)
        $('.select').attr('title','台州市-'+txt1+'-'+txt2)
    }
    modifyTxtFn();


    table.render({
        elem: '#tableList'
        ,id:'tableReload'
        ,cellMinWidth: 100
        ,height: "200"
        ,method:'post'
        //,url: main_url + '/ssd-reminder-data-statistics/getHisContrast'
        ,where:{'stationNum':$("#stationNum").val(),'yearHis':$("#yearHis").val(),'dateType':$("#dateType").val(),
            'current':$("#current").val(),'current_type':$("#current_type").val(),'current_typeName':$("#current_type").find("option:selected").text()
        }
        ,cols: [[ //表头
            ,{field: 'dataTime', title: '日历'}
            ,{field: 'temp_max', title: '最高温(°C)'}
            ,{field: 'maxTime', title: '最高温出现时间'}
            ,{field: 'temp_min', title: '最低温(°C)'}
            ,{field: 'minTime', title: '最低温出现时间'}
            ,{field: 'temp_average', title: '平均气温(°C)',templet:function(d){

                    var avg= d.temp_average;
                    if(avg != null && avg.toString.length>0 && avg !="null"){
                        return avg.toFixed(2);
                    }else{
                        return "";
                    }

                }}
            ,{field: 'rain_amount', title: '降水(mm)', templet:function(d){
                    var rain= d.rain_amount;
                    if(rain != null && rain.toString.length>0  && rain !="null"){
                        return rain.toFixed(1);
                    }else{
                        return "";
                    }
                }}
            ,{field: 'sunshine_amount', title: '日照(h)'}
        ]]
    });

    /**
     * 数据加载
     */
    function loaddata(){
        var initload = layer.load(1);
        //获取参数信息
        var stationNum = $("#stationNum").val();
        var yearHis = $("#yearHis").val().replace(/\s+/g,"");
        var dateType = $("#dateType").val();
        var current = $("#current").val().replace(/\s+/g,"");
        var current_type = $("#current_type").val();
        var current_typeName=$("#current_type").find("option:selected").text();
        //执行重载
        table.reload('tableReload', {
            url:main_url + '/ssd-reminder-data-statistics/getHisContrast'
            ,where: {
                stationNum: stationNum,
                yearHis: yearHis,
                dateType : dateType,
                current:current,
                current_type:current_type,
                current_typeName:current_typeName
            }
        });

        //查询统计页面
        $.ajax({
            url: main_url + '/ssd-reminder-data-statistics/getHisContrastStatistics',
            type: 'POST',
            dataType: 'json',
            data:{'stationNum':stationNum,'yearHis':yearHis,'dateType':dateType,'current':current,'current_type':current_type,'current_typeName':current_typeName},
            success: function (res) {
                if(res.code == 0){
                    //操作成功
                    var objMap = res.data;
                    set_echarts(objMap);
                    layer.close(initload);
                }
            }
        });
    };

    //点击查询按钮
    $("#find").on('click', function () {
        //对数据做校验
        var yearHis = $("#yearHis").val();
        if(yearHis == null || yearHis.length<=0){
            layer.alert("请选择历史日期区间");
            return false;
        }
        var current = $("#current").val().replace(/\s+/g,"");
        if(current == null || current.length<=0){
            layer.alert("请选择当前日期");
            return false;
        }
        var dateType = $("#dateType").val();
        if(dateType == "same"){
            if(current.length<21){
                layer.alert("当前日期格式不正确!");
                return false;
            }
            var start = current.substring(0,4);
            var end = current.substring(11,15);
            if(start != end){
                layer.alert("历史同期对比日期不可跨年");
                return false;
            }
        }
        loaddata();
    });
    loaddata();

});
