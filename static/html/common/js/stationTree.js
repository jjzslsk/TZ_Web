var stationNums = "";
layui.use(['layer', 'form','tree'], function ()
{
	var laydate = layui.laydate //日期
	, layer = layui.layer //弹层
	, form = layui.form //表单
    ,tree = layui.tree
    ;
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
              $("#find").click();
          }
	  },
	  error: function (result) {
	    layer.msg("获取台州站点信息异常");
	  }
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
