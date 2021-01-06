layui.use('table', function(){
    var table = layui.table;

    table.render({
        elem: '#test'
        ,url:main_url+'/ssd-product-publish/getTTSProductSendState'
        ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        ,page: false //开启分页
        ,limit:20
        ,cols: [[
            {field:'productName', width:180, title: '产品名称'}
            ,{field:'state', width:180, title: '发布状态',templet:function(d){
                if(d.state=='0'){
                    return "成功";
                }else{
                    return "";
                }
            }}
            ,{field:'publish_time', width:180, title: '最新更新时间', sort: true,templet:function(d){
                    if(d.publish_time==undefined){
                        return "";
                    }else{
                        return layui.util.toDateString(d.publish_time, 'yyyy年MM月dd日 HH:mm:ss')
                    }
                }}
            ,{field:'content', width:380, title: '发布内容'}
        ]]
    });
});
