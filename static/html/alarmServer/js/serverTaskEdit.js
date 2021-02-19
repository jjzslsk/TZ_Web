var keyItem = 0;
layui.use([ 'layer', 'table','element','laydate','form'], function() {
    var laydate = layui.laydate;
    var table = layui.table //表格
    var form = layui.form;
    var element = layui.element;


    /**
     * json规则新增
     */
    $("#jsonAdd").click(function(){
        //获取div下input数量
         var html_="";
         html_+="<div class='layui-form-item' id='jsonItem"+keyItem+"'>";
         html_+="<div class='layui-inline'>";
         html_+="<label class='layui-form-label'>jsonKey</label>";
         html_+="<div class='layui-input-block'>";
         html_+="<input type='text' id='jsonKey"+keyItem+"' name='jsonKey"+keyItem+"'  lay-verify='required'  placeholder='请输入' autocomplete='off' class='layui-input jsonTxt'>";
         html_+="</div>";
         html_+="</div>";
         html_+="<div class='layui-inline'>";
         html_+="<label class='layui-form-label'>value值</label>";
         html_+="<div class='layui-input-block'>";
         html_+="<input type='text' id='keyName"+keyItem+"' name='keyName"+keyItem+"'  lay-verify='required'  placeholder='请输入' autocomplete='off' class='layui-input jsonTxt'>";
         html_+="</div>";
         html_+="</div>";
         html_+="<div class='layui-inline'>";
         html_+="<button type='button' class='layui-btn layui-btn-danger  layui-btn-radius' onclick=\"delJsonKey('jsonItem"+keyItem+"')\" id='jsondel"+keyItem+"'>删除</button>";
         html_+="</div>";
         html_+="</div>";

         $("#divJson").append(html_);
         keyItem=keyItem+1;
    });

    $("#divJson").on("blur","input",function () {
        toJson();
    });

    //监听提交
    form.on('submit(save)', function(data){
        $.ajax({
            type : 'POST',
            url :main_url+'/ssd-reminder-alarm/saveTask',
            data :$("#form1").serialize(),
            dataType : 'json',
            success : function(data) {
                if(data.code == 0){
                    // 成功提示框
                    parent.layer.msg('操作成功', {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }else{
                    parent.layer.msg(data.msg, {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }
            },
            error : function(data) {
                // 异常提示
                parent.layer.msg('出现网络故障', {
                    icon : 5
                });
                parent.layer.closeAll('iframe'); //关闭弹框
            }
        });
        return false;
    });
    //修改
    form.on('submit(update)', function(data){
        $.ajax({
            type : 'POST',
            url :main_url+'/ssd-reminder-alarm/updateServerTask',
            data :$("#form1").serialize(),
            dataType : 'json',
            success : function(data) {
                if(data.code == 0){
                    // 成功提示框
                    parent.layer.msg('操作成功', {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }else{
                    parent.layer.msg(data.msg, {
                        icon : 6,
                    });
                    parent.layer.closeAll('iframe'); //关闭弹框
                    parent.layui.table.reload('taskReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }

                    });
                }
            },
            error : function(data) {
                // 异常提示
                parent.layer.msg('出现网络故障', {
                    icon : 5
                });
                parent.layer.closeAll('iframe'); //关闭弹框
            }
        });
        return false;
    });

    $("#channelName").on("click",function(){
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                title:"服务用户选择",
                type: 2,
                scrollbar: false,//  滚动条 禁止
                area: ['300px', '400px'],
                btn: ['保存', '取消'],
                content:'../alarmServer/serviceUserTree.html',
                success: function(layero, index){
                    var iframe = window['layui-layer-iframe'+index];
                    var taskId = $("#taskId").val();
                    if(taskId==null||taskId==''||taskId==undefined||taskId=='null'){
                        taskId='-999';
                    }
                    iframe.initTree(taskId);
                },
                yes: function(index,layero){
                    // 获取iframe层的body
                    var body = layer.getChildFrame('body', index);
                    // 找到隐藏的提交按钮模拟点击提交
                    body.find('#permissionSubmit').click();
                }
            });
        });
    });

    /*var delJsonKey = function (dom) {
        $("#"+dom).remove();
    };*/
});
function child(id) {
    $.ajax({
        type: 'get',
        async:false,
        url: main_url +'/ssd-reminder-alarm/getServerTaskById',
        data: {"id":id},// loginInfo.loginAreaId
        dataType: 'json',
        success: function (data) {
            let datas=data.data
             $("#taskId").val(datas.id);
            $("#taskName").val(datas.taskName);
            $("#taskCode").val(datas.taskCode);
            $("#taskType").val(datas.taskType);
            $("#dataType").val(datas.dataType);
            $("#state").val(datas.state);
            $("#taskRuleTxt").val(datas.taskRule);
            $("#channelName").val(datas.channelName);
            parsingJso(datas.taskRule);
            $("#remarks").val(datas.describe);
            layui.use('form', function() {
                var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
                form.render();
            });

        }, error: function () {
            layer.msg("查询异常");
        }
    })

}

function parsingJso(data){
    let json=eval("["+data+"]")
    for(var i=0;i<json.length;i++){
        for(var key in json[i]){
            var html_="";
            html_+="<div class='layui-form-item' id='jsonItem"+keyItem+"'>";
            html_+="<div class='layui-inline'>";
            html_+="<label class='layui-form-label'>jsonKey</label>";
            html_+="<div class='layui-input-block'>";
            html_+="<input type='text' id='jsonKey"+keyItem+"' value='"+key+"' name='jsonKey"+keyItem+"'  lay-verify='required'  placeholder='请输入' autocomplete='off' class='layui-input jsonTxt'>";
            html_+="</div>";
            html_+="</div>";
            html_+="<div class='layui-inline'>";
            html_+="<label class='layui-form-label'>value值</label>";
            html_+="<div class='layui-input-block'>";
            html_+="<input type='text' id='keyName"+keyItem+"' name='keyName"+keyItem+"' value='"+json[i][key]+"'  lay-verify='required'  placeholder='请输入' autocomplete='off' class='layui-input jsonTxt'>";
            html_+="</div>";
            html_+="</div>";
            html_+="<div class='layui-inline'>";
            html_+="<button type='button' class='layui-btn layui-btn-danger  layui-btn-radius' onclick=\"delJsonKey('jsonItem"+keyItem+"')\" id='jsondel"+keyItem+"'>删除</button>";
            html_+="</div>";
            html_+="</div>";
            $("#divJson").append(html_);
            keyItem=keyItem+1;
        }
    }
}
function toJson(){
    //生成json字符串数据
    var json = {};
    var index= keyItem - 1;
    for(var i = 0 ; i <= index ; i++){
        var key_ = $("#jsonKey"+i).val();
        var val_ = $("#keyName"+i).val();
        json[key_]=val_;
    }
    var jsonStr = JSON.stringify(json);
    $("#taskRuleTxt").val(jsonStr);
}

function delJsonKey(dom) {
    $("#"+dom).remove();
    keyItem+keyItem-1;
    toJson();
};
