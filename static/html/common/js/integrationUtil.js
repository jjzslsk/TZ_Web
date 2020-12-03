function isCurrDate(thisDate){
}

function getFormatDate(thisDate, format)
{
    // 年
    if(format.indexOf("yyyy") != -1)
    {
        format = format.replace("yyyy", thisDate.getFullYear());
    }
    // 月
    if(format.indexOf("MM") != -1)
    {
        var month = thisDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        format = format.replace("MM", month);
    }
    // 日
    if(format.indexOf("dd") != -1)
    {
        var day = thisDate.getDate();
        day = day < 10 ? "0" + day : day;
        format = format.replace("dd", day);
    }
    // 时
    if(format.indexOf("hh") != -1)
    {
        var hour = thisDate.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        format = format.replace("hh", hour);
    }
    // 时
    if(format.indexOf("HH") != -1)
    {
        var hour = thisDate.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        format = format.replace("HH", hour);
    }
    // 分
    if(format.indexOf("mm") != -1)
    {
        var minute = thisDate.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        format = format.replace("mm", minute);
    }
    return format;
}


function DateAdd(date, interval, number)
{
    var that = new Date(date.getTime());
    switch(interval)
    {
        case  "y"  :
        {
            that.setFullYear(that.getFullYear() + number);
            return  that;
            break;
        }
        case  "q"  :
        {
            that.setMonth(that.getMonth() + number * 3);
            return  that;
            break;
        }
        case  "m"  :
        {
            that.setMonth(that.getMonth() + number);
            return  that;
            break;
        }
        case  "w"  :
        {
            that.setDate(that.getDate() + number * 7);
            return  that;
            break;
        }
        case  "d"  :
        {
            that.setDate(that.getDate() + number);
            return  that;
            break;
        }
        case  "h"  :
        {
            that.setHours(that.getHours() + number);
            return  that;
            break;
        }
        case  "mi"  :
        {
            that.setMinutes(that.getMinutes() + number);
            return  that;
            break;
        }
        case  "s"  :
        {
            that.setSeconds(that.getSeconds() + number);
            return  that;
            break;
        }
        default  :
        {
            return  that;
            break;
        }
    }
}

/*
 * 获取当前时间是第几周
 */
function getWeek(currentDate)
{
    var startDate = new Date(currentDate.getTime());
    startDate.setMonth(0);
    startDate.setDate(1);
    var rq = currentDate - startDate;
    var days = Math.ceil( rq / (24 * 60 * 60 * 1000));
    var weeks = Math.ceil(days / 7);
    return weeks;
}


/*
 * 获取当前时间增加N周后的起始时间
 */
function getWeekEndDate(currentDate, addWeekCount)
{
    // 一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;

    // 相对于当前日期AddWeekCount个周的日期
    var thisDate = new Date(currentDate.getTime() + (millisecond * 7 * addWeekCount));

    // 返回date是一周中的某一天
    var day = thisDate.getDay();

    // 距离周末的天数
    var minusDay = day == 0 ? 0 : 7 - day;

    // 获得当前周的最后一天
    var currentWeekEndDate = new Date(thisDate.getTime() + (minusDay * millisecond));

    return currentWeekEndDate;
}


/*
 * 旬转换
 */
function getXun(currentDate)
{
    var xunNum = parseInt((currentDate.getDate() - 1) / 10);
    if(xunNum == 0)
    {
        return "上旬";
    }
    else if(xunNum == 1)
    {
        return "中旬";
    }
    else
    {
        return "下旬";
    }
}

/*
 * 计算旬开始日期
 */
function getXunStartDate(currentDate, addXunCount)
{
    // 起止日期数组
    var startEnd = new Array();
    // 一天的毫秒数
    var millisecond = 1000 * 60 * 60 * 24;

    // 当前日期所在的旬
    var currXunNum = parseInt((currentDate.getDate() - 1) / 10);
    currXunNum = currXunNum > 2 ? 2 : currXunNum;

    var addMonth = 0;
    if(addXunCount % 3 == 0)
    {
        addMonth = parseInt(addXunCount / 3);
    }
    else
    {
        // 三旬为一个月
        var addMonth = parseInt(addXunCount / 3);

        // 剩余不满一个月的旬数
        var addOtherXun = addXunCount % 3;
        if(addOtherXun > 0)
        {
            addMonth = addMonth + parseInt((currXunNum + addOtherXun) / 3);
            currXunNum = (currXunNum + addOtherXun) % 3;
        }
        else if(addOtherXun < 0)
        {
            if(currXunNum == 0)
            {
                addMonth = addMonth - 1;
                currXunNum = 3 + currXunNum + addOtherXun;
            }
            else if(currXunNum == 1)
            {
                if(addOtherXun == -1)
                {
                    currXunNum = 0;
                }
                else if(addOtherXun == -2)
                {
                    addMonth = addMonth - 1;
                    currXunNum = 2;
                }
            }
            else if(currXunNum == 2)
            {
                currXunNum = currXunNum + addOtherXun;
            }
        }
    }
    var thisDate = DateAdd(currentDate, "m", addMonth);

    // 获得当前旬的第一天
    var currentXunStartDate = new Date(thisDate.getTime());
    currentXunStartDate.setDate(currXunNum * 10 + 1);

    return currentXunStartDate;
}



/*
 *  18风向转换
 */
function getWindDOf18(WindD)
{
    if((WindD >= 0 && WindD <= 11.25) || (WindD >= 348.76 && WindD <= 360))
    {
        return 'N';
    }
    else if(WindD >= 11.26 && WindD <= 33.75)
    {
        return 'NNE';
    }
    else if(WindD >= 33.76 && WindD <= 56.25)
    {
        return 'NE';
    }
    else if(WindD >= 56.26 && WindD <= 78.75)
    {
        return 'ENE';
    }
    else if(WindD >= 78.76 && WindD <= 101.25)
    {
        return 'E';
    }
    else if(WindD >= 101.26 && WindD <= 123.75)
    {
        return 'ESE';
    }
    else if(WindD >= 123.76 && WindD <= 146.25)
    {
        return 'SE';
    }
    else if(WindD >= 146.26 && WindD <= 168.75)
    {
        return 'SSE';
    }
    else if(WindD >= 168.76 && WindD <= 191.25)
    {
        return 'S';
    }
    else if(WindD >= 191.26 && WindD <= 213.75)
    {
        return 'SSW';
    }
    else if(WindD >= 213.76 && WindD <= 236.25)
    {
        return 'SW';
    }
    else if(WindD >= 236.26 && WindD <= 258.75)
    {
        return 'WSW';
    }
    else if(WindD >= 258.76 && WindD <= 281.25)
    {
        return 'W';
    }
    else if(WindD >= 281.26 && WindD <= 303.75)
    {
        return 'WNW';
    }
    else if(WindD >= 303.76 && WindD <= 326.25)
    {
        return 'NW';
    }
    else if(WindD >= 326.26 && WindD <= 348.75)
    {
        return 'NNW';
    }
    return '';
}



/*
 *  风向转换
 */
function getWindDStr(windD)
{
    if(windD >=348.75 || windD < 11.25)
    {
        windD = "北风";
    }
    else if(windD >= 11.25 && windD < 78.75)
    {
        windD = "东北风";
    }
    else if(windD >= 78.75 && windD < 101.25)
    {
        windD = "东风";
    }
    else if(windD >= 101.25 && windD < 168.75)
    {
        windD = "东南风";
    }
    else if(windD >= 168.75 && windD < 191.25)
    {
        windD = "南风";
    }
    else if(windD >= 191.25 && windD < 258.75)
    {
        windD = "西南风";
    }
    else if(windD >= 258.75 && windD < 281.25)
    {
        windD = "西风";
    }
    else if(windD >= 281.25 && windD < 348.75)
    {
        windD = "西北风";
    }
    return windD;
}


function getWindVStr(windV)
{
    if(windV == '')
    {
        windV = "";
    }
    else if(windV <= 1.5)
    {
        windV = "2级";
    }
    else if(windV >= 1.6 && windV <= 5.4)
    {
        windV = "2~3级";
    }
    else if(windV >= 5.5 && windV <= 7.9)
    {
        windV = "3~4级";
    }
    else if(windV >= 8.0 && windV <= 10.7)
    {
        windV = "4~5级";
    }
    else if(windV >= 10.8 && windV <= 13.8)
    {
        windV = "5~6级";
    }
    else if(windV >= 13.9 && windV <= 17.1)
    {
        windV = "6~7级";
    }
    else if(windV >= 17.2 && windV <= 20.7)
    {
        windV = "7~8级";
    }
    else if(windV >= 20.8 && windV <= 24.4)
    {
        windV = "8~9级";
    }
    else if(windV >= 24.5 && windV <= 28.4)
    {
        windV = "9~10级";
    }
    else if(windV >= 28.5 && windV <= 32.6)
    {
        windV = "10~11级";
    }
    else if(windV > 32.6)
    {
        windV = "12级";
    }
    return windV;
}


/*
 * 文件下载
 */
function download(fileName, filePath)
{
    // 检查文件是否存在
    $.ajax({
        url: 'fileOperate/checkExist.action',
        type: 'post',
        data:
            {
                'filePath' : filePath
            },
        dataType: 'json',
        success: function(data)
        {
            if(data.msg == "success")
            {
                if(fileName.indexOf('.') == -1)
                {
                    fileName = fileName + "." + filePath.substring(filePath.lastIndexOf('.') + 1);
                }
                // 下载文件
                var downloadUrl = 'fileOperate/download.action?fileName=' + fileName + '&filePath=' + filePath;
                window.location = downloadUrl;
            }
            else
            {
                layer.msg("当前文件不存在!", { offset: 'auto', anim: 2 });
            }
        }
    });

}


/**
 * 获取期号中的字符编号
 *
 * @param process	发布过程：0 首发，其它为继续发布
 * @param letter	字母编号
 * @returns
 */
function getIssueLetter(process, letter)
{
    var issueLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
    if(process == 0)
    {
        // 首发
        return issueLetter[0];
    }
    else
    {
        var index = issueLetter.indexOf(letter);
        if(index == -1 || (index + 1) == issueLetter.length)
        {
            return issueLetter[0];
        }
        else
        {
            return issueLetter[index + 1];
        }
    }
}


// 新浪微博计数
function calSinaLenght(str)
{

    return b(str)

    function b(b)
    {
        var c = 41, d = 140, e = 20, f = b, g = b
                .match(/(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z_\$\.\+\!\*\(\)\/\,\:;@&=\?~#%]*)*/gi)
            || [], h = 0;
        for ( var i = 0, j = g.length; i < j; i++) {
            var k = bLength(g[i]);
            if (/^(http:\/\/t.cn)/.test(g[i]))
                continue;
            /^(http:\/\/)+(t.sina.com.cn|t.sina.cn)/.test(g[i])
            || /^(http:\/\/)+(weibo.com|weibo.cn)/.test(g[i]) ? h += k <= c ? k
                : k <= d ? e : k - d + e
                : h += k <= d ? e : k - d + e;
            f = f.replace(g[i], "")
        }
        var l = Math.ceil((h + bLength(f)) / 2);
        return l;
    }

    function bLength(a)
    {
        if (!a)
            return 0;
        var b = a.match(/[^\x00-\xff]/g);
        return a.length + (b ? b.length : 0)
    }
}

function szdlWarningToWarning(warn_fac)
{
    if("hail" == warn_fac)
    {
        // 冰雹
        return "11B15";
    }
    else if("thunder" == warn_fac || "lightning" == warn_fac)
    {
        // 雷暴/闪电：雷暴
        return "11B20";
    }
    else if("wind" == warn_fac)
    {
        // 大风
        return "11B06";
    }
    else if("vis" == warn_fac)
    {
        // 能见度：大雾
        return "11B17";
    }
    else if("rain1h" == warn_fac)
    {
        // 降水
        return "11B03";
    }
    else if("tornado" == warn_fac)
    {
        // 龙卷
        return "11B01";
    }
    return "";
}

// 去掉字符的 ，  。 结尾
function removeEndStr(str)
{
    if(str && str != "")
    {
        str = str.trim();
        if(new RegExp("\。$").test(str))
        {
            str = str.substring(0, str.length - 1);
        }
        else if(new RegExp("\\.$").test(str))
        {
            str = str.substring(0, str.length - 1);
        }
        if(new RegExp("\，$").test(str))
        {
            str = str.substring(0, str.length - 1);
        }
        else if(new RegExp("\,$").test(str))
        {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }
    return "";
}


/**
 *
 * 保存产品的发布记录
 *
 * @param productName
 * @param publishContent
 */
function doSaveInCommon(productCode, publishContent)
{
    var commonDatas = [
        {
            "DataType"  : "PublishContent",
            "DataName"  : productCode,
            "DataValue" : "",
            "DataLevel" : "",
            "DataDesc"  : publishContent
        }];
    $.post("/wms/commonMake/saveCommonData.action", { "datas": JSON.stringify(commonDatas) }, function(data)
    {

    });
}

/**
 * 获取URL上的参数
 * @param name
 * @returns
 */
function getUrlParam(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  r[2]; return null;
}

