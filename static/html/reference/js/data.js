var type = '';
var tableRender;
layui.use(['element','table','tree','upload','form','layer'], function(){
    var $ = layui.jquery,
        table = layui.table,
        tree = layui.tree,
        form = layui.form,
        layer = layui.layer,
        element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

    tableRender = table.render({
        elem: '#tableList'
        ,url: main_url +'/ssd-data-constant/findReferData'
        ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        ,cols: [[
            {field:'id', title: '序号', sort: true,type: 'numbers',width:80}
            ,{field:'name', title: '资料名称'} //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
            ,{field:'code', title: '资料编号'}
            ,{field:'type', title: '数据类型'}
            ,{field:'content', title: '资料内容'}
            ,{field:'sort', title: '显示顺序'}
            ,{field:'createTime', title: '创建时间'}
            ,{field:'oper', title: '操作',width:150, toolbar: '#operate'}
        ]],
        page:true,//开启分页
        id:'dataReload',
        limit:10,
        where:{
            "datatype": $("#dataType").val(),
            "dataname": $("#dataName").val(),
            "typeId": type
        },
        limits:[10,20,50,100],
        parseData: function(res){
            return {
                "count":res.data.rowCount,
                "code": res.code, //解析接口状态
                "data": res.data.list //解析数据列表
            };
        }
        ,done: function(res, curr, count){
            bindOnclick(layer,form,table);
        }
    });

    //查询
    $("#find").on('click', function ()
    {
        table.reload('dataReload', {
            page: {
                curr: 1
            }
            ,where: {
                "datatype": $("#dataType").val(),
                "dataname": $("#dataName").val(),
                "typeId": type
            }
            ,url: main_url +'/ssd-data-constant/findReferData'//后台做模糊搜索接口路径
        });
    })

    $.ajax({
        url: main_url +'/ssd-data-constant/findReferTypeTree',
        type:'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if(res.code == 0){
                var data = res.data;
                tree.render({
                    elem: '#datatypeTree'
                    ,data: data
                    ,onlyIconControl: true
                    ,click: function(obj){
                        type = obj.data.id;
                        $('.layui-tree-main').css({'background-color':''});
                        $('.layui-tree-txt').css({'color':'#555'})
                        $(obj.elem[0].children[0].children[0].children[1]).css({'color':'#fff'});
                        $(obj.elem[0].children[0].children[0]).css({'background-color':'#1E9FFF','color':'#fff'});
                        $("#find").click();
                    }
                });
            }
        },
        error: function (result) {
            layer.msg("获取参考资料类型错误");
        }
    });
    $("#add").on('click', function (){
        var url = web_url+"/html/reference/data-add.html";
        layer.open({
            type: 2,
            area: ['600px', '550px'],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade:0.4,
            title: "添加参考资料",
            content: url
        });
    });

});

function bindOnclick(layer,form,table){
    $("table").delegate("a","click",function(){
        var event = this.name;
        var id = this.id;
        if (event == 'edit') {
            var url = web_url+"/html/reference/data-edit.html";
            $.post(url, {}, function(html) {
                html = html.replace("#id#", id.split('_')[0]);
                layer.open({
                    type: 1,
                    area: ['600px', '550px'],
                    fix: false, //不固定
                    shadeClose: true,
                    title: "修改参考资料",
                    content: html
                });
            });
        } else if (event == 'del') {
            $.ajax({
                url: main_url + '/ssd-data-constant/delReferData',
                type: 'GET',
                dataType: 'json',
                data:{"id":id},
                contentType: "application/json; charset=utf-8",
                async:true,
                success: function (res) {
                    layer.alert(res.message, {icon: 6},function () {
                        layer.closeAll();
                        table.reload('dataReload', {
                            page: {
                                curr: 1
                            }
                            ,where: {
                                "datatype": $("#dataType").val(),
                                "dataname": $("#dataName").val(),
                                "typeId": type
                            }
                            ,url: main_url +'/ssd-data-constant/findReferData'//后台做模糊搜索接口路径
                        });
                    });
                },
                error: function (res) {
                    layer.msg("删除参考资料异常");
                }
            });
        }
    });
}
