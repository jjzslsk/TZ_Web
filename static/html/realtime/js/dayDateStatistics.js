var stationNums = "";
layui.use(['laydate', 'layer', 'form', 'table', 'element','tree'], function ()
{
    var laydate = layui.laydate //日期
        , layer = layui.layer //弹层
        , table = layui.table //表格
        , form = layui.form //表单
        , element = layui.element //元素操作
        ,tree = layui.tree;
    var $ = layui.$;

    laydate.render({
        elem: '#startDate'
    });
    laydate.render({
        elem: '#endDate'
    });

    //站点树
    //页面标签为 <div id="stationTree" class="demo-tree"></div>
    $.ajax({
        url: main_url +'/ssd-reminder-data-statistics/getTzStationTree',
        type:'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        // timeout: ajaxTimeout,
        // data: {},
        success: function (res) {
            if(res.code == 0){
                var data = res.data;
                var checkList = res.checkList;
                tree.render({
                    elem: '#stationTree'
                    ,id:'stationTreeId'
                    ,data: data
                    ,showCheckbox: true
                    ,oncheck: function(obj){
                        getStationCheck(tree,'stationTreeId');
                    }
                });
                tree.setChecked('stationTreeId', checkList);
                getStationCheck(tree,'stationTreeId');

                //默认时间
                var date = new Date();
                //取昨天
                date=date.setDate(date.getDate()-1);
                date=new Date(date);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                if(month<10){
                    month = "0" + month;
                }
                var day = date.getDate();
                if(day<10){
                    day = "0"+day;
                }
                var initDate = year + "-" + month + "-" + day;
                $("#startDate").val(initDate);
                $("#endDate").val(initDate);
                $("#find").click();
            }
        },
        error: function (result) {
            layer.msg("获取台州站点信息异常");
        }
    });



    //查询
    $("#find").on('click', function ()
    {
        // showTable();
        //站点
        if(stationNums==null||stationNums==""){
            layer.alert("请选择站点");
            return;
        }
        var eleMap = new Map();
        var eleValues = "";
        $("input:checkbox[name='dayEle']:checked").each(function() { // 遍历name=standard的多选框
            var value = $(this).val();
            var title = $(this).attr('title');
            eleMap.set(value,title);
            eleValues += value+",";
        });
        if(eleValues.endsWith(",")){
            eleValues = eleValues.substring(0,eleValues.length-1);
        }
        if(eleMap==null||eleMap.length==0){
            layer.alert("请选择要素");
            return;
        }
        //开始结束时间
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        //数据类型
        var dataType = $("#dataType").val();


        //加载table 初始化头部数据
        var colsData = [];
        colsData.push({'field':'stationNum',  'title': '站点编号'});
        colsData.push({'field':'stationName', 'title': '站点名称'});
        colsData.push({'field':'dataTime', 'title': '数据时次'});
        colsData.push({'field':'dataType', 'title': '数据类型','templet': function(d){   // 自定义属性
                if(d.dataType=="year"){
                    return "今年以来";
                }else if(d.dataType=="season"){
                    return "本季以来";
                }else if(d.dataType=="month"){
                    return "本月以来";
                }else if(d.dataType=="tenDays"){
                    return "本旬以来";
                }else if(d.dataType=="day"){
                    return "今日";
                }else if(d.dataType=="day60"){
                    return "近六十天";
                }else if(d.dataType=="day30"){
                    return "近三十天";
                }else if(d.dataType=="day20"){
                    return "近二十天";
                }else if(d.dataType=="day10"){
                    return "近十天";
                }else if(d.dataType=="day5"){
                    return "近五天";
                }else{
                    return d.dataType;
                }
            }});
        eleMap.forEach(function (value,key) {
            var json ={'field':key, 'title':value};
            colsData.push(json);
        });
        table.render({
            elem: '#tableList'
            ,id:'tableReload'
            ,cellMinWidth: 100
            ,height: "full-540"
            ,method:'post'
            ,url: main_url + '/ssd-reminder-data-statistics/getDayDataListPage'
            ,where:{"stationNums":stationNums,"elements":eleValues,"startTime":startDate,"endTime":endDate,"dataType":dataType}
            ,cols:[colsData]
            ,done: function (res, curr, count) {
            }
            ,page: true
            ,limit: 20
        });
    })

    //导出
    $("#export").on("click",function () {
        //站点
        if(stationNums==null||stationNums==""){
            layer.alert("请选择站点");
            return;
        }
        var eleValues = "";
        var eleNames = "";
        $("input:checkbox[name='dayEle']:checked").each(function() { // 遍历name=standard的多选框
            var value = $(this).val();
            var title = $(this).attr('title');
            eleValues += value+",";
            eleNames += title + ",";
        });
        if(eleValues.endsWith(",")){
            eleValues = eleValues.substring(0,eleValues.length-1);
        }
        if(eleNames.endsWith(",")){
            eleNames = eleNames.substring(0,eleNames.length-1);
        }
        if(eleValues==null||eleValues==""){
            layer.alert("请选择要素");
            return;
        }
        //开始结束时间
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        //数据类型
        var dataType = $("#dataType").val();
        $.ajax({
            url: main_url +'/ssd-reminder-data-statistics/exportDayDataList',
            type:'POST',
            dataType: 'json',
            // contentType: "application/json; charset=utf-8",
            // timeout: ajaxTimeout,
            data: {"stationNums":stationNums,"elements":eleValues,"eleNames":eleNames,
                "startTime":startDate,"endTime":endDate,"dataType":dataType},
            success: function (res) {
                if(res.code == 0){
                    var filePath = res.message;
                    //下载文件
                    var downUrl = main_url + "/ssd-reminder-data-statistics/downFile?filePath="+filePath;
                    var a = document.createElement('a');
                    a.setAttribute('href', downUrl);
                    a.setAttribute('target', '_blank');
                    a.setAttribute('id', 'startTelMedicine');
                    // 防止反复添加
                    if(document.getElementById('startTelMedicine')) {
                        document.body.removeChild(document.getElementById('startTelMedicine'));
                    }
                    document.body.appendChild(a);
                    a.click();
                    // window.open(downUrl);
                }else{
                    layer.msg(res.message);
                }
            },
            error: function (result) {
                layer.msg("获取台州站点信息异常");
            }
        });

        // var importUrl = reminder+'/ssd/reminder/ssd-reminder-data-statistics/exportDayDataList?stationNums='+stationNums+
        //     '&elements='+eleValues+'&eleNames='+eleNames+'&startTime='+startDate+'&endTime='+endDate+
        //     '&dataType='+dataType;
        // window.open(importUrl);
    });

    var $ = layui.$, active = {
        reload: function(){
            //站点
            if(stationNums==null||stationNums==""){
                layer.alert("请选择站点");
                return;
            }
            var eleValues = "";
            $("input:checkbox[name='dayEle']:checked").each(function() { // 遍历name=standard的多选框
                var value = $(this).val();
                eleValues += value+",";
            });
            if(eleValues.endsWith(",")){
                eleValues = eleValues.substring(0,eleValues.length-1);
            }
            if(eleValues==null||eleValues==""){
                layer.alert("请选择要素");
                return;
            }
            //开始结束时间
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            //数据类型
            var dataType = $("#dataType").val();

            //执行重载
            table.reload('tableReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                ,where: {
                    "stationNums":stationNums,
                    "elements":eleValues,
                    "startTime":startDate,
                    "endTime":endDate,
                    "dataType":dataType
                }
            });

        }
    };
    $('.demoTable .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});

function getStationCheck(tree,treeId){
    var checkedData = tree.getChecked('stationTreeId'); //获取选中节点的数据
    stationNums = "";
    for(var i = 0;i<checkedData.length;i++){
        var childrenData=checkedData[i].children;
        for(var j = 0;j<childrenData.length;j++){
            var childrenData2 = childrenData[j].children;
            for(var k = 0;k<childrenData2.length;k++){
                stationNums += childrenData2[k].id+",";
            }
        }
    }
    if(stationNums.endsWith(",")){
        stationNums = stationNums.substring(0,stationNums.length-1);
    }
}
