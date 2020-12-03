var tabNum = 1;
//主要素tab的id
var firstTabId = 'tabGroup_0';
layui.use([ 'layer', 'table','element','laydate','form'], function(){
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;
    //执行一个 table 实例
    table.render({
        id: 'biinfoReload'
        ,elem: '#biinfolist'
        ,height: "full-135"
        ,method:'GET'
        ,url: main_url+'/ssd-reminder-alarm/getAlarmElementListPage' //数据接口
        ,title: '告警规则列表'
        ,page: true //开启分页
        ,limilt:20
        ,toolbar: '#info_toolbar' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,defaultToolbar: ['filter', 'print']
        ,totalRow: false //开启合计行
        ,cols: [[ //表头
//            {type: 'checkbox', fixed: 'left'}
            {field: 'name', title: '名称',align:'center'}
            ,{field: 'elements', title: '要素',align:'center'}
            ,{field: 'dataTypes', title: '数据类型',align:'center'}
            ,{field: 'durations', title: '统计时间(小时)',align:'center'}
            ,{field: 'functions', title: '统计方式',align:'center'}
            ,{field: 'group_function', title: '组合方式',align:'center',templet:function(d){
                    if(d.group_function == 'max'){
                        return '最大值';
                    }else if(d.group_function == 'min'){
                        return '最小值';
                    }else if(d.group_function == 'sum'){
                        return '总和';
                    }else if(d.group_function == 'avg'){
                        return '平均值';
                    }else{
                        return d.group_function;
                    }
                }}
            ,{field: 'create_time', title: '创建时间',align:'center'}
            ,{fixed: 'right',  title: '操作', align:'center', toolbar: '#barList',width:250}
        ]]
        ,done: function (res, curr, count) {
            // $("[data-field='state']").children().each(function () {
            //     var value = $(this).text();
            //     if(value == '正常'){
            //         $(this).attr("style","color:green");
            //     }else if (value == '过期') {
            //         $(this).attr("style","color:#EA6034");
            //     }
            // });
        }
    });

    var $ = layui.$, active = {
        reload: function(){
            //执行重载
            reloadTable();
        }
        ,addGroupElement:function(){
            //添加组合
            var tabHtml = getTabHtml(tabNum,"");
            //新增一个Tab项
            element.tabAdd('groupTab', {
                title: '组合要素'
                ,content: tabHtml
                ,id: 'tabGroup_'+tabNum
            })
            form.render();
            //主要素不能删除
            $(".layui-tab ul").children('li').first().children('.layui-tab-close').css("display",'none');
            monitorTabNum();
            tabNum++;
        }
    };

    //监听tab关闭
    element.on('tabDelete(groupTab)', function(data){
        monitorTabNum();
        $(".layui-tab ul").children('li').first().children('.layui-tab-close').css("display",'none');
    });
    //监听tab数量,控制组合方式显示或隐藏
    var monitorTabNum = function(){
        var tabNum = $(".layui-tab ul").children('li').length;
        if(tabNum>1){
            $("#groupFunctionRow").show();
            $("#groupFunction").attr("name","groupFunction");
        }else{
            $("#groupFunctionRow").hide();
            $("#groupFunction").attr("name","");
        }
    }

    $('.site-demo-active').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听头工具栏事件
    table.on('toolbar(test)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id)
            ,data = checkStatus.data; //获取选中的数据
        switch(obj.event){
            case 'add':
                openEdit();
                break;
        };
    });


    //监听行工具事件
    table.on('tool(test)', function(obj){
        var data = obj.data //获得当前行数据
            ,layEvent = obj.event; //获得 lay-event 对应的值
        if(layEvent === 'del'){
            layer.confirm('确定删除吗?', function(index){
                $.ajax({
                    type : 'GET',
                    url : main_url+'/ssd-reminder-alarm/deleteAlarmElement',
                    data :{"groupCode":data.group_code},
                    dataType : 'json',
                    success: function (data) {
                        if(data.success){
                            layer.msg("删除成功", {
                                icon : 6,
                            });
                        }else{
                            layer.msg(data.msg, {
                                icon : 5,
                            });
                        }
                        reloadTable();
                    },
                    error: function () {
                        layer.msg("删除异常");
                    }
                });
            });
        } else if(layEvent === 'edit'){
            $.ajax({
                url: main_url+'/ssd-reminder-alarm/getAlarmElementByCode',
                type:'GET',
                dataType: 'json',
                data: {"groupCode":data.group_code},
                success: function (res) {
                    //var data = res.data;
                    $(".layui-tab-title").empty();
                    $(".layui-tab-content").empty();
                    var oldIds = "";
                    for (let i = 0; i < res.length; i++) {
                        var dataMap = res[i];
                        var id = dataMap.id;
                        oldIds+=id+",";
                        if(i==0){
                            var tabHtml = getTabHtml(id,"main");
                            element.tabAdd('groupTab', {
                                title: '主要素'
                                ,content: tabHtml
                                ,id: 'tabGroup_'+id
                            })
                            element.tabChange('groupTab', 'tabGroup_'+id);
                            //主要素不能删除
                            $(".layui-tab ul").children('li').first().children('.layui-tab-close').css("display",'none');
                        }else{
                            //添加多tab
                            var tabHtml = getTabHtml(id,"");
                            element.tabAdd('groupTab', {
                                title: '组合要素'
                                ,content: tabHtml
                                ,id: 'tabGroup_'+id
                            })
                        }
                        monitorTabNum();
                        //回显
                        $("#groupCode").val(dataMap.group_code);
                        $("#name").val(dataMap.name);
                        $("#dataType_"+id).val(dataMap.data_type);
                        $("#element_"+id).val(dataMap.element);
                        //$("#function_0").val(dataMap.function);
                        $("[name=function_"+id+"]").each(function () {
                            if ($(this).val() == dataMap.function) {
                                $(this).attr("checked", "checked");
                                return false;
                            }
                        })
                        $("#duration_"+id).val(dataMap.duration);
                        $("#groupFunction").val(dataMap.group_function);
                        form.render();
                        tabNum = id;
                        tabNum++;
                    }
                    if(oldIds.endsWith(",")){
                        oldIds = oldIds.substring(0,oldIds.length-1);
                    }
                    $("#oldIds").val(oldIds);
                    openEdit();
                },
                error: function (result) {
                    layer.msg("获取告警配置异常");
                }
            });
        }
    });
    //打开基础要素编辑编辑窗口
    var openEdit = function(){
        layer.open({
            title:"基础要素编辑",
            type: 1,
            area: ['65%','78%'],
            btn: ['保存', '取消'],
            content: $("#alarmEditDiv"),
            yes: function(index,layero){
                //表单验证
                var checkForm = ckForm();
                if(!checkForm){
                    return;
                }
                //表单数据
                var data = form.val('formTest');
                var dataJson = JSON.stringify(data);
                var groupCode = $("#groupCode").val();
                //如果groupCode不为空为修改,groupCode为空则为添加
                var url = main_url+'/ssd-reminder-alarm/saveAlarmElement';
                var tip = "添加";
                if(groupCode!=null&&groupCode!=''){
                    tip = "修改";
                    url = main_url+'/ssd-reminder-alarm/updateAlarmElement';
                }
                //保存
                $.ajax({
                    url: url,
                    type:'POST',
                    dataType: 'json',
                    // contentType: "application/json; charset=utf-8",
                    data: data,
                    success: function (res) {
                        if (res.success){
                            layer.confirm(tip+'成功', {
                                btn: ['确定'] //按钮
                            }, function(){
                                layer.closeAll();
                                //确认函数
                                reloadTable();
                            });
                        }else{
                            layer.alert(res.msg);
                        }
                    },
                    error: function (result) {
                        layer.msg(tip+"异常");
                    }
                });
            }
            ,end:function(){
                //关闭回调,清空表单信息
                $("#form1")[0].reset();
                $(".layui-tab-title").empty();
                $(".layui-tab-content").empty();
                $(".layui-tab-title").append('<li class="layui-this" lay-id="tabGroup_0">主要素</li>');
                var tabHtml = getTabHtml("0","main");
                tabHtml='<div class="layui-tab-item layui-show">'+tabHtml+'</div>'
                $(".layui-tab-content").append(tabHtml);
            }
        });
    }

    var reloadTable = function () {
        table.reload('biinfoReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            }
            ,where: {
                name: $("#nameSelect").val()
            }
        });
    }
    //表单验证
    var ckForm = function() {
        var data = form.val('formTest');
        for (var key in data) {
            if(key!='groupFunction'&&key!='groupCode'){//不需要验证
                var value = data[key];
                //名称
                if(key=='name'){
                    if(value==null||value==''){
                        //切换到错误tab
                        element.tabChange('groupTab', firstTabId);
                        layer.msg("请输入名称");
                        return false;
                    }
                }else{
                    var keyArr = key.split("_");
                    var key1 = keyArr[0];
                    var key2 = keyArr[1];
                    if(key1=='duration'){
                        //统计时长
                        if(value==null||value==''){
                            //切换到错误tab
                            element.tabChange('groupTab', "tabGroup_"+key2);
                            layer.msg("请输入统计时间");
                            return false;
                        }
                        //匹配正整数的正则
                        var positiveIntegerReg = new RegExp(/^[0-9]\d*$/);

                        if(!positiveIntegerReg.test(value)){
                            //切换到错误tab
                            element.tabChange('groupTab', "tabGroup_"+key2);
                            layer.msg("统计时间只能是正整数");
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     *
     * @param tabNum tab id编号
     * @param type type为main时获取主要素html
     * @returns {string}
     */
    var getTabHtml = function(tabNum,type){
        var tabHtml = '';
        if(type=="main"){
            tabHtml+='<div class="layui-row">';
            tabHtml+='<div class="layui-col-xs2">　</div>';
            tabHtml+='<div class="layui-col-xs8">';
            tabHtml+='<div class="layui-form-item">';
            tabHtml+='<label class="layui-form-label"><span class="span-red">*</span>名称</label>';
            tabHtml+='<div class="layui-input-block">';
            tabHtml+='<input type="text" id="name" name="name" value="" autocomplete="off" class="layui-input">';
            tabHtml+='</div>';
            tabHtml+='</div>';
            tabHtml+='</div>';
            tabHtml+='<div class="layui-col-xs2">　</div>';
            tabHtml+='</div>';
        }
        tabHtml+='<div class="layui-row">'
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='<div class="layui-col-xs8">';
        tabHtml+='<div class="layui-form-item">';
        tabHtml+='<label class="layui-form-label"><span class="span-red">*</span>数据类型</label>';
        tabHtml+='<div class="layui-input-block">';
        tabHtml+='<select id ="dataType_'+tabNum+'" name="dataType_'+tabNum+'" class="layui-select">';
        tabHtml+='<option value="0">实况数据</option>';
        tabHtml+='<option value="1">预报数据</option>';
        tabHtml+='</select>';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-row">';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='<div class="layui-col-xs8">';
        tabHtml+='<div class="layui-form-item">';
        tabHtml+='<label class="layui-form-label"><span class="span-red">*</span>要素</label>';
        tabHtml+='<div class="layui-input-block">';
        tabHtml+='<select id ="element_'+tabNum+'" name="element_'+tabNum+'" class="layui-select">';
        tabHtml+='<option value="T">气温</option>';
        tabHtml+='<option value="Tx">最高气温</option>';
        tabHtml+='<option value="Tn">最低气温</option>';
        tabHtml+='<option value="RR">雨量</option>';
        tabHtml+='<option value="fFy">风力</option>';
        tabHtml+='<option value="U">湿度</option>';
        tabHtml+='<option value="P">气压</option>';
        tabHtml+='<option value="VV">能见度</option>';
        tabHtml+='<option value="area">面积</option>';
        tabHtml+='</select>';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-row">';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='<div class="layui-col-xs8">';
        tabHtml+='<div class="layui-form-item">';
        tabHtml+='<label class="layui-form-label"><span class="span-red">*</span>统计方式</label>';
        tabHtml+='<div class="layui-input-block" id="functionDiv_'+tabNum+'">';
        tabHtml+='<input type="radio" name="function_'+tabNum+'" value="max" title="最大值" checked lay-filter="function_'+tabNum+'" >';
        tabHtml+='<input type="radio" name="function_'+tabNum+'" value="min" title="最小值" lay-filter="function_'+tabNum+'" >';
        tabHtml+='<input type="radio" name="function_'+tabNum+'" value="sum" title="总和" lay-filter="function_'+tabNum+'" >';
        tabHtml+='<input type="radio" name="function_'+tabNum+'" value="avg" title="平均值" lay-filter="function_'+tabNum+'" >';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-row">';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='<div class="layui-col-xs8">';
        tabHtml+='<div class="layui-form-item">';
        tabHtml+='<label class="layui-form-label"><span class="span-red">*</span>统计时间(小时)</label>';
        tabHtml+='<div class="layui-input-block">';
        tabHtml+='<input type="text" id="duration_'+tabNum+'" name="duration_'+tabNum+'" value="" autocomplete="off" class="layui-input">';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='</div>';
        tabHtml+='<div class="layui-col-xs2">　</div>';
        tabHtml+='</div>';
        if(type=="main"){
            tabHtml+='<div class="layui-row" id="groupFunctionRow" style="display: none">';
            tabHtml+='<div class="layui-col-xs2">　</div>';
            tabHtml+='<div class="layui-col-xs8">';
            tabHtml+='<div class="layui-form-item">';
            tabHtml+='<label class="layui-form-label"><span class="span-red">*</span>组合方式</label>';
            tabHtml+='<div class="layui-input-block">';
            tabHtml+='<select id ="groupFunction" name="" class="layui-select">';
            tabHtml+='<option value="max">最大值</option>';
            tabHtml+='<option value="min">最小值</option>';
            tabHtml+='<option value="sum">总和</option>';
            tabHtml+='<option value="avg">平均值</option>';
            tabHtml+='</select>';
            tabHtml+='</div>';
            tabHtml+='</div>';
            tabHtml+='</div>';
            tabHtml+='<div class="layui-col-xs2">　</div>';
            tabHtml+='</div>';
        }
        return tabHtml;
    }

});
$(function(){
    $(".layui-tab ul").children('li').first().children('.layui-tab-close').css("display",'none');
})



