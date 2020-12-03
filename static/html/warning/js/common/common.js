/**
 * 非gis公共类
 * @author 2016.6.27 songcy
 * @constructor
 */
function common() {};
common.prototype = {
		/**
		 * 获取坐标数组的中间点坐标
		 * @param {Array} array
		 * @return {Array} coordinate
		 */
		getCenterCoordinate: function(array) {
			var len = array.length;
			if((len / 2) % 2 == 1) {
				return [array[len / 2 - 1], array[len / 2]]
			} else {
				return [array[len / 2], array[len / 2 + 1]]
			}
		},

	}
	/**
	 * @param {Object} radioname//單元按鈕組名稱
	 * @return {radio} radio//單選按鈕
	 */
common.getSelectRadio = function(radioname) {
		var radio;
		var chkObjs = document.getElementsByName(radioname);
		for(var i = 0; i < chkObjs.length; i++) {
			if(chkObjs[i].checked) {
				radio = chkObjs[i];
				break;
			}
		}
		return radio;
	}
	/*
	/**获取从当前时刻之前的12个小时列表
	 * @param {Object} starttime,起始小时
	 */
common.get12hourslist = function(starttime) {
	var hours = new Array();
	if(parseInt(starttime) - 11 >= 0) {
		for(var i = 11; i >= 0; i--) {
			hours.push(parseInt(starttime) - i);
		}

	} else {
		var count = 11 - parseInt(starttime);
		for(var i = count; i > 0; i--) {
			hours.push(24 - i);
		};
		for(var i = 0; i <= parseInt(starttime); i++) {
			hours.push(i);
		}
	};
	return hours;
}
/*数组求和*/
 common.sum=function(arguments) {
	var r = 0;
	for (var i = 0; i < arguments.length; i++) {

		r = arguments[i] + r;

	}
	return r;
}
/*
/**获取从当前时刻之前的24个小时列表
 * @param {Object} starttime,起始小时
 */
common.get24hourslist = function(starttime) {
	var hours = new Array();

	for(var i = parseInt(starttime) + 1; i < 24; i++) {
		hours.push(i);
	};
	for(var i = 0; i <= parseInt(starttime); i++) {
		hours.push(i);
	}

	return hours;
}
/**ajax请求
 * @param {Object} url，请求地址
 * @param {Object} callback，返回成功的回调函数
 */
 common.ajaxRequst=function (url, callback) {
	$.ajax({
		type: "get", //使用get方法访问后台
		dataType: "jsonp", //返回json格式的数据
		url: url,
		jsonpCallback:'callback',
		success: function(result) {
			callback(result);
		},
		error: function() {
			layer.closeAll();
			console.log("请求失败");
		}
	});
}
/**
 * 格式化日期类型
 */
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * 导出excel表格
 */
common.ExportExcel = function(tableid) {
	if(getExplorer() == 'ie') {
		var curTbl = document.getElementById('statictable');
		var oXL = new ActiveXObject("Excel.Application");
		var oWB = oXL.Workbooks.Add();
		var xlsheet = oWB.Worksheets(1);
		var sel = document.body.createTextRange();
		sel.moveToElementText(curTbl);
		sel.select();
		sel.execCommand("Copy");
		xlsheet.Paste();
		oXL.Visible = true;

		try {
			var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
		} catch(e) {
			print("Nested catch caught " + e);
		} finally {
			oWB.SaveAs(fname);
			oWB.Close(savechanges = false);
			oXL.Quit();
			oXL = null;
			//			idTmr = window.setInterval("Cleanup();", 1);
		}

	} else {
		tableToExcel(tableid)
	}
	
	function getExplorer() {
		var explorer = window.navigator.userAgent;
		//ie  
		if(explorer.indexOf("MSIE") >= 0) {
			return 'ie';
		}
		//firefox  
		else if(explorer.indexOf("Firefox") >= 0) {
			return 'Firefox';
		}
		//Chrome  
		else if(explorer.indexOf("Chrome") >= 0) {
			return 'Chrome';
		}
		//Opera  
		else if(explorer.indexOf("Opera") >= 0) {
			return 'Opera';
		}
		//Safari  
		else if(explorer.indexOf("Safari") >= 0) {
			return 'Safari';
		}
	}

}
var tableToExcel = (function() {
		var uri = 'data:application/vnd.ms-excel;base64,',
			template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
			base64 = function(s) {
				return window.btoa(unescape(encodeURIComponent(s)))
			},
			format = function(s, c) {
				return s.replace(/{(\w+)}/g,
					function(m, p) {
						return c[p];
					})
			}
		return function(table, name) {
			if(!table.nodeType) table = document.getElementById(table)
			var ctx = {
				worksheet: name || 'Worksheet',
				table: table.innerHTML
			}
			window.location.href = uri + base64(format(template, ctx))
		}
	})()
/**获取从当前时刻之前的24个小时列表
 * @param {Object} starttime,起始小时
 */
function get24hourslist(starttime) {
	var hours = new Array();

	for(var i = parseInt(starttime) + 1; i < 24; i++) {
		hours.push(i);
	};
	for(var i = 0; i <= parseInt(starttime); i++) {
		hours.push(i);
	}

	return hours;
}
 //用正则表达式提取数字 
 function getDateStr(dataTime){
    var reg = /\d+/g;
    var str = dataTime;
    var ms = str.match(reg);
    var dtStr=ms[0]+ms[1]+ms[2]+ms[3];
    if(ms[4]){
    dtStr+=	ms[4];
    }
    
    return dtStr;
 }
 
  //用正则表达式提取颜色数组 
 function getColorStr(dataTime){
    var reg = /\d+/g;
    var str = dataTime;
    var ms = str.match(reg)
    return ms;
 }
 //转换代码如下，首先是RGB颜色转换为十六进制表示：
 String.prototype.colorHex = function(){
    var that = this;
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i=0; i<aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;    
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;    
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/,"").split("");
        if (aNum.length === 6) {
            return that;    
        } else if(aNum.length === 3) {
            var numHex = "#";
            for (var i=0; i<aNum.length; i+=1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return that;
};
   ///合并表格相同行的内容  
    ///tableId：表格ID（最好是tbody，避免把表尾给合并了)  
    ///startRow：起始行，没有标题就从0开始  
    ///endRow：终止行，此参数是递归时检查的范围，一开始时会自动赋值为最后一行  
    ///col：当前处理的列  
    function MergeCell(tableId, startRow, endRow, col) {  
        var tb = document.getElementById(tableId);  
        if (col >= tb.rows[0].cells.length) {  
            return;  
        }  
        //当检查第0列时检查所有行  
        if (col == 0 || endRow == 0) {  
            endRow = tb.rows.length - 1;  
        }  
        for (var i = startRow; i < endRow; i++) {  
            //程序是自左向右合并  
            if (tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML) {  
                //如果相同则删除下一行的第0列单元格  
                tb.rows[i + 1].cells[col].style.display='none';
                
                $(tb.rows[i + 1].cells[col]).attr({"data-del":"delete"});
                //更新rowSpan属性  
                tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan | 0) + 1;  
                //当循环到终止行前一行并且起始行和终止行不相同时递归(因为上面的代码已经检查了i+1行，所以此处只到endRow-1)  
                if (i == endRow - 1 && startRow != endRow) {  
                    MergeCell(tableId, startRow, endRow, col + 1);  
                }  
            } else {  
                //起始行，终止行不变，检查下一列  
                MergeCell(tableId, startRow, i, col + 1);  
                //增加起始行  
                startRow = i + 1;  
            }  
        }  
    } 
    
 /**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
 **/
function goPage(pno,psize){
	var searchType=$("#lookUpContentNav .lookUpNavs").attr("data-type");
    var ili = $(".lookUpContentLi ul").eq(searchType).find("li");
    var num = ili.length;//表格所有行数(所有记录数)
    console.log(num);
    var totalPage = 0;//总页数
    var pageSize = psize;//每页显示行数
    //总共分几页 
    if(num/pageSize > parseInt(num/pageSize)){   
            totalPage=parseInt(num/pageSize)+1;   
       }else{   
           totalPage=parseInt(num/pageSize);   
       }   
    var currentPage = pno;//当前页数
    var startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31 
       var endRow = currentPage * pageSize;//结束显示的行   40
       endRow = (endRow > num)? num : endRow;    40
       console.log(endRow);
       //遍历显示数据实现分页
    for(var i=1;i<(num+1);i++){    
        var li_ = ili.eq(i-1)[0];
        if(i>=startRow && i<=endRow){
            li_.style.display = "block";    
        }else{
            li_.style.display = "none";
        }
    }
    var pageEnd = document.getElementById("pageEnd");
    var tempStr = "<div style='text-align:left'>共"+num+"条 分"+totalPage+"页 <span style='float:right' >当前第"+currentPage+"页</span></div> ";
    if(currentPage>1){
        tempStr += "<a href=\"#\" onClick=\"goPage("+(1)+","+psize+")\">首页</a>";
        tempStr += "<a href=\"#\" onClick=\"goPage("+(currentPage-1)+","+psize+")\"><上一页</a>"
    }else{
        tempStr += "首页";
        tempStr += "<上一页";    
    }

    if(currentPage<totalPage){
        tempStr += "<a href=\"#\" onClick=\"goPage("+(currentPage+1)+","+psize+")\">下一页></a>";
        tempStr += "<a href=\"#\" onClick=\"goPage("+(totalPage)+","+psize+")\">尾页</a>";
    }else{
        tempStr += "下一页>";
        tempStr += "尾页";    
    }

    $(".bottomPage").html(tempStr);
    }

 String.prototype.trim = function() {
   return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
 }
  function  trm(str){
        var reg = new RegExp(' ' , "g" )
		var newstr = str.replace( reg , '' );
		return newstr;
		
   }
  
  function  getUserAreaCode(){
  	 var user =JSON.parse(sessionStorage.getItem("user"));
  	 var areaLevel =user.area_level;
  	 if(1 == areaLevel *1){//省级用户
  	 	var provinceCode =user.provinceAreaCodes;
  	 	var cityCode = user.cityAreaCodes;
  	 	return provinceCode+","+cityCode;
  	 }else if(5===areaLevel*1){
        return  user.areaCode.substr(0,6)+"000000";
     }else {
  	 	return user.areaCode;
  	 	
  	 }
  	
  }
  
  function  getCountyAreaCode(){
  	var user =JSON.parse(sessionStorage.getItem("user"));
  	
  	var  areaLevel = user.area_level;
  	 if(1 == areaLevel *1 || 2===areaLevel*1){//省级市级用户
  	 	return user.countyAreaCodes;
  	 }else if(3===areaLevel *1){
  	 	//return user.countyAreaCodes;
  	 	return null;
  	 }
  }
    