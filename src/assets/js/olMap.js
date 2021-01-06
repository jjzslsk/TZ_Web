/*
 *这是openlayers的相关的配置js
 *author:crx
 *date:2019/08/29
*/
import ol from 'openlayers'
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
const { style, layer, View, Map, source, control, Overlay, format, Feature, geom, proj, coordinate, interaction } = ol;
const { Fill, Stroke, Style, Text, Circle,Icon,RegularShape} = style;
const { Tile, Vector, Image } = layer;
const { XYZ, ImageStatic} = source;
const { defaults, MousePosition } = control;
const { GeoJSON } = format;
const { transform,Projection } = proj;
const { Draw } = interaction;

/*
* ol.style.Style 图层样式
* 如果text(文本)不为空，则也加载styleText(要素文本)
* 如果src(图标路径)不为空，则加载 styleCircle(要素圆圈)，否则加载styleIcon(要素图标)
*/
const styleStyle = Options => {
    let {
         //styleIcon
         src, scale, offset,
         //styleCircle
         Circleradius, CircleFillColor, CircleStrokeColor, CircleStrokeWidth,
         //styleText
         font, text, offsetX = 0, offsetY = 15, TextFillColor = 'rgba(0,0,0,1)',TextStrokeColor ,TextStrokeWidth
        } = Options;

        let styles;
        if(text){
            styles = {
                image : src ? styleIcon(Options) : styleCircle(Options),
                text: styleText(Options)
            }
        }
        else{
            styles = {
                image : src ? styleIcon(Options) :  styleCircle(Options)
            }
        }
    return new Style(styles)
}

//ol.style.Circle  新版直接返回样式
const styleCircleNew = cccc => {
    let {radius, FillColor, StrokeColor, StrokeWidth,offsetX,offsetY,text} = cccc;
    return new Style({
        image : new Circle({
            radius,
            fill : styleFill({
                fillColor : FillColor,
            }),
            stroke: styleStroke({
                strokeColor: StrokeColor || 'rgba(0,0,0, 1)',
                strokeWidth:StrokeWidth || 1,
                lineDash: [1, 1],
                lineCap: 'round'
            }),
        }),
        text: styleText(cccc)
    })
}

//ol.style.Icon  新版直接返回样式
const styleIconNew = sso => {
    let {src, scale , anchor,offset,font, text, offsetX, offsetY, TextFillColor} = sso;
    return new Style({
        image : new Icon({
            src,
            scale,
            anchor: anchor || [0.5, 0.55],
            offset,
        }),
        text: styleText(sso)
    })
}

//ol.style.RegularShape 默认正方形样式 或 根据points判断其他样式
const styleRegularShape = cccc => {
    let {radius, FillColor, StrokeColor, StrokeWidth,offsetX,offsetY,text, point, angle} = cccc;
    return new Style({
        image : new RegularShape({
            radius,
            points: point || 4,
            angle: angle || 0,
            fill : styleFill({
                fillColor : FillColor,
            }),
            stroke: styleStroke({
                strokeColor: StrokeColor || 'rgba(0,0,0, 1)',
                strokeWidth:StrokeWidth || 1,
                lineDash: [1, 1],
                lineCap: 'round'
            }),
        }),
        text: styleText(cccc)
    })
}

//填充与边线
const styleFillStroke = fs => {
    let {fillColor, strokeColor, strokeWidth}= fs
    return new Style({
        fill:styleFill(fs),
        stroke:styleStroke(fs)
    })
}


//ol.style.Icon
const styleIcon = sso => {
    let {src, scale , offset} = sso;
    return new Icon({
        src,
        scale,
        offset,
     })
}

//ol.style.Circle
const styleCircle = cccc => {
    let {Circleradius, CircleFillColor, CircleStrokeColor, CircleStrokeWidth} = cccc;

    return new Circle({
        radius : Circleradius,
        fill : styleFill({
            fillColor : CircleFillColor,
        }),
        stroke: styleStroke({
            strokeColor: CircleStrokeColor || 'rgba(0,0,0, 1)',
            strokeWidth: CircleStrokeWidth || 1,
            lineDash: [1, 1],
            lineCap: 'round'
        })
    })
}

//ol.style.Text
const styleText = ftoottt => {
    let {font, text, offsetX, offsetY, TextFillColor, TextStrokeColor ,TextStrokeWidth} = ftoottt;
    return  new Text({
        font: font || "bold 15px sans-serif,微软雅黑",
        text:text ? text : '',
        offsetX,
        offsetY,
        fill : styleFill({
            fillColor: TextFillColor || 'rgba(0,0,0,1)',
        }),
        stroke:styleStroke({
            strokeColor:TextStrokeColor || 'rgba(255,255,255, 1)',
            strokeWidth:TextStrokeWidth || 1
        })
    })
}

//ol.style.Fill
const styleFill = f => {
    let {fillColor} = f;
    return new Fill({
        color : fillColor || 'rgba(255 ,255 , 255, 0)'
    })
}
//ol.style.Stroke
const styleStroke = ssll => {
    let {strokeColor, strokeWidth, lineDash,lineCap} = ssll;
    return new Stroke({
        color : strokeColor || 'rgba(0 ,0 , 0, 0)',
        width : strokeWidth || 1,
        lineDash: lineDash || [1, 1],
        lineCap: lineCap || 'round',
    })
}


//地图相关图例色带
const getMapLegend = Options => {
    let legendColor = { //图例色带
        rain:{
           unit: 'mm',
           list: [
            {
                min: 500,
                max: 999,
                scope:'500~999',
                color: 'rgba(132, 0, 66, 1)',
                type: ''
            },
            {
                min: 250,
                max: 500,
                scope:'250~500',
                color: 'rgba(253, 0, 251, 1)',
                type: '特大暴雨'
            },
            {
                min: 100,
                max: 250,
                scope:'100~250',
                color: 'rgba(244, 4, 3, 1)',
                type: '大暴雨'
            },
            {
                min: 50,
                max: 100,
                scope:'50~100',
                color: 'rgba(2, 3, 241, 1)',
                type: '暴雨'
            },
            {
                min: 25,
                max: 50,
                scope:'25~50',
                color: 'rgba(100, 184, 244, 1)',
                type: '大雨'
            },
            {
                min: 10,
                max: 25,
                scope:'10~25',
                color: 'rgb(61, 182, 66)',
                type: '中雨'
            },
            {
                min: 0,
                max: 10,
                scope:'0~10',
                color: 'rgba(165, 241, 146, 1)',
                type: '小雨'
            }
           ],
           list2:[
               {
                   min: 0,
                   max: 0,
                   scope:'无降雨',
                   color: 'rgba(254,254,254,1)',
                   type: '微雨'
               },
               {
                   min: 0.1,
                   max: 1,
                   scope:'0.1~1',
                   color: 'rgba(166,242,142,1)',
                   type: '小雨'
               },
               {
                   min: 1,
                   max: 2,
                   scope:'1~2',
                   color: 'rgba(60,186,60,1)',
                   type: '中雨'
               },
               {
                   min: 2,
                   max: 4,
                   scope:'2~4',
                   color: 'rgba(96,184,254,1)',
                   type: '大雨'
               },
               {
                   min: 4,
                   max: 6,
                   scope:'4~6',
                   color: 'rgba(0,0,224,1)',
                   type: '暴雨'
               },
               {
                   min: 6,
                   max: 8,
                   scope:'6~8',
                   color: 'rgba(0,2,248,1)',
                   type: '大暴雨'
               },
               {
                   min: 8,
                   max: 10,
                   scope:'8~10',
                   color: 'rgba(2,120,80,1)',
                   type: '大暴雨'
               },
                {
                   min: 10,
                   max: 20,
                   scope:'10~20',
                   color: 'rgba(250,0,250,1)',
                   type: '大暴雨'
               },
               {
                   min: 20,
                   max: 50,
                   scope:'20~50',
                   color: 'rgba(220,79,5,1)',
                   type: '大暴雨'
               },
               {
                   min: 50,
                   max: 999,
                   scope:'>50',
                   color: 'rgba(115,0,0,1)',
                   type: '大暴雨'
               },
            ]


        },
        temperature:{
           unit: '℃',
            list: [
               {
                   min: -16,
                   max: 0,
                   scope:'-16~0',
                   color: '#0033FF'
               },
                {
                   min: 0,
                   max: 4,
                   scope:'0~4',
                   color: '#0066FF'
               },
               {
                   min: 4,
                   max: 8,
                   scope:'4~8',
                   color: '#0099FF'
               },
               {
                   min: 8,
                   max: 12,
                   scope:'8~12',
                   color: '#99FFFF'
               },
               {
                   min: 12,
                   max: 22,
                   scope:'12~22',
                   color: '#CCFFFF'
               },
               {
                   min: 22,
                   max: 26,
                   scope:'22~26',
                   color: '#FFFF99'
               },
                {
                   min: 26,
                   max: 30,
                   scope:'26~30',
                   color: '#FFCC99'
               },
               {
                   min: 30,
                   max: 35,
                   scope:'30~35',
                   color: '#FF9966'
               },
               {
                   min: 35,
                   max: 37,
                   scope:'35~37',
                   color: '#FF6633'
               },
               {
                   min: 37,
                   max: 40,
                   scope:'37~40',
                   color: '#FF3733'
               },
               {
                   min: 40,
                   max: 45,
                   scope:'40~45',
                   color: '#CC0000'
               },
           ]
        },
        wind:{
            unit: 'm/s',
            list: [
                {
                    min: 0.3,
                    max: 1.6,
                    scope:'0.3~1.6',
                    color: '#CFFFFF'
                },
                {
                    min: 1.6,
                    max: 3.4,
                    scope:'1.6~3.4',
                    color: '#9DFFFF'
                },
                {
                    min: 3.4,
                    max: 5.5,
                    scope:'3.4~5.5',
                    color: '#FFFF9D'
                },
                {
                    min: 5.5,
                    max: 8,
                    scope:'5.5~8',
                    color: '#FFCF9D'
                },
                {
                    min: 8,
                    max: 10.8,
                    scope:'8~10.8',
                    color: '#FF9F62'
                },
                {
                    min: 10.8,
                    max: 13.9,
                    scope:'10.8~13.9',
                    color: '#FF6030'
                },
                {
                    min: 13.9,
                    max: 17.2,
                    scope:'13.9~17.2',
                    color: '#FF3030'
                },
                {
                    min: 17.2,
                    max: 2000,
                    scope:'>17.2',
                    color: '#CF0000'
                },
            ]
        },
        RadarReal:{
            unit: 'dBZ',
            list:[
                {
                    min: 10,
                    max: 15,
                    scope:'10~15',
                    color: '#01A0F6'
                },
                {
                    min: 15,
                    max: 20,
                    scope:'15~20',
                    color: '#00ECEC'
                },
                {
                    min: 20,
                    max: 25,
                    scope:'20~25',
                    color: '#00D800'
                },
                {
                    min: 25,
                    max: 30,
                    scope:'25~30',
                    color: '#019000'
                },
                {
                    min: 30,
                    max: 35,
                    scope:'30~35',
                    color: '#FFFF00'
                },
                {
                    min: 35,
                    max: 40,
                    scope:'35~40',
                    color: '#E7C000'
                },
                {
                    min: 40,
                    max: 45,
                    scope:'40~45',
                    color: '#FF9000'
                },
                {
                    min: 45,
                    max: 50,
                    scope:'45~50',
                    color: '#FF0000'
                },
                {
                    min: 50,
                    max: 55,
                    scope:'50~55',
                    color: '#D60000'
                },
                {
                    min: 55,
                    max: 60,
                    scope:'55~60',
                    color: '#C00000'
                },
                {
                    min: 60,
                    max: 65,
                    scope:'60~65',
                    color: '#FF00F0'
                },
                {
                    min: 65,
                    max: 70,
                    scope:'65~70',
                    color: '#9600B4'
                },
                {
                    min: 70,
                    max: 9999,
                    scope:'>70',
                    color: '#AD90F0'
                },
            ]
        },
        FogReal:{
            unit: '(海雾)dBZ',
            list:[
                {
                    min: 10,
                    max: 15,
                    scope:'10~15',
                    color: '#01A0F6'
                },
                {
                    min: 15,
                    max: 20,
                    scope:'15~20',
                    color: '#00ECEC'
                },
                {
                    min: 20,
                    max: 25,
                    scope:'20~25',
                    color: '#00D800'
                },
                {
                    min: 25,
                    max: 30,
                    scope:'25~30',
                    color: '#019000'
                },
                {
                    min: 30,
                    max: 35,
                    scope:'30~35',
                    color: '#FFFF00'
                },
                {
                    min: 35,
                    max: 40,
                    scope:'35~40',
                    color: '#E7C000'
                },
                {
                    min: 40,
                    max: 45,
                    scope:'40~45',
                    color: '#FF9000'
                },
                {
                    min: 45,
                    max: 50,
                    scope:'45~50',
                    color: '#FF0000'
                },
                {
                    min: 50,
                    max: 55,
                    scope:'50~55',
                    color: '#D60000'
                },
                {
                    min: 55,
                    max: 60,
                    scope:'55~60',
                    color: '#C00000'
                },
                {
                    min: 60,
                    max: 65,
                    scope:'60~65',
                    color: '#FF00F0'
                },
                {
                    min: 65,
                    max: 70,
                    scope:'65~70',
                    color: '#9600B4'
                },
                {
                    min: 70,
                    max: 9999,
                    scope:'>70',
                    color: '#AD90F0'
                },
            ]
        },
        LightningReal:{
            unit: '',
            list:[
            ]
        },
        humidity :{
            unit: '%',
            list :[
                {
                    min: 0,
                    max: 10,
                    scope:'0~10',
                    color: '#CD0101'
                },
                {
                    min: 10,
                    max: 20,
                    scope:'10~20',
                    color: '#FD3636'
                },
                {
                    min: 20,
                    max: 30,
                    scope:'20~30',
                    color: '#FF6632'
                },
                {
                    min: 30,
                    max: 40,
                    scope:'30~40',
                    color: '#FF9966'
                },
                {
                    min: 40,
                    max: 50,
                    scope:'40~50',
                    color: '#FFCD99'
                },
                {
                    min: 50,
                    max: 60,
                    scope:'50~60',
                    color: '#FFFF99'
                },
                {
                    min: 60,
                    max: 70,
                    scope:'60~70',
                    color: '#CDFFFF'
                },
                {
                    min: 70,
                    max: 80,
                    scope:'70~80',
                    color: '#99FFFF'
                },
                {
                    min: 80,
                    max: 90,
                    scope:'80~90',
                    color: '#0099FF'
                },
                {
                    min: 90,
                    max: 95,
                    scope:'90~95',
                    color: '#0066FF'
                },
                {
                    min: 95,
                    max: 100,
                    scope:'95~100',
                    color: '#0032FF'
                },
            ]
        },
        visible:{
            unit: 'km',
            list:[
                {
                    min: 0,
                    max: 0.05,
                    scope:'0~0.05',
                    color: '#810040'
                },
                {
                    min: 0.05,
                    max: 0.2,
                    scope:'0.05~0.2',
                    color: '#FB00FB'
                },
                {
                    min: 0.2,
                    max: 0.5,
                    scope:'0.2~0.5',
                    color: '#DDA1DD'
                },
                {
                    min: 0.5,
                    max: 1,
                    scope:'0.5~1',
                    color: '#60B9FF'
                },
                {
                    min: 1,
                    max: 10,
                    scope:'1~10',
                    color: '#3CBB3C'
                },
                {
                    min: 10,
                    max: 1000000,
                    scope:'10~',
                    color: '#FFFFFF'
                },

            ]
        },
        waveHight:{
            unit: 'm',
            list:[
                {
                    min: 0,
                    max: 5,
                    scope:'0~5',
                    color: '#810040'
                },
                {
                    min: 5,
                    max: 10,
                    scope:'5~10',
                    color: '#FB00FB'
                },
                {
                    min: 10,
                    max: 15,
                    scope:'10~15',
                    color: '#DDA1DD'
                },
                {
                    min: 15,
                    max: 30,
                    scope:'15~30',
                    color: '#60B9FF'
                },
            ]
        },
        waveSpeed:{
            unit: 'km/h',
            list :[
                {
                    min: 0,
                    max: 20,
                    scope:'0~20',
                    color: '#dD0101'
                },
                {
                    min: 20,
                    max: 40,
                    scope:'20~40',
                    color: '#eD3636'
                },
                {
                    min: 40,
                    max: 60,
                    scope:'40~60',
                    color: '#eF6632'
                },
                {
                    min: 60,
                    max: 80,
                    scope:'60~80',
                    color: '#eF9966'
                },
                {
                    min: 80,
                    max: 100,
                    scope:'80~100',
                    color: '#eFCD99'
                },
                {
                    min: 100,
                    max: 120,
                    scope:'100~120',
                    color: '#eFFF99'
                },
                {
                    min: 120,
                    max: 140,
                    scope:'120~140',
                    color: '#bDFFFF'
                },
                {
                    min: 140,
                    max: 160,
                    scope:'140~160',
                    color: '#89FFFF'
                },
                {
                    min: 160,
                    max: 180,
                    scope:'160~180',
                    color: '#2099FF'
                },

            ]
        },
        waveDire:{
            unit: 'm',
            list:[
                {
                    min: 0,
                    max: 5,
                    scope:'0~5',
                    color: '#810040'
                },
            ]
        },
        press:{
            unit: 'hpa',
            list:[
                {
                    min: 0,
                    max: 5,
                    scope:'0~5',
                    color: '#810040'
                },
            ]
        },
        typhoon: { // 台风图例色带
            unit: 'm/s',
            list:[
                {
                    caption: '热带低压',
                    min: 10.8,
                    max: 17.1,
                    color: 'rgba(3, 253, 225, 0.7)',
                    scope: '热带低压(级) 10.8-17.1米/秒'
                }, {
                    caption: '热带风暴',
                    min: 17.2,
                    max: 24.4,
                    color: 'rgba(253, 242, 2, 0.7)',
                    scope: '热带风暴(级) 17.2-24.4米/秒'
                }, {
                    caption: '强热带风暴',
                    min: 24.5,
                    max: 32.6,
                    color: 'rgba(252, 146, 44, 0.7)',
                    scope: '强热带风暴(级) 24.5-32.6米/秒'
                }, {
                    caption: '台风',
                    min: 32.7,
                    max: 41.4,
                    color: 'rgba(255, 4, 3, 0.7)',
                    scope: '台风(级) 32.7-41.4米/秒'
                }, {
                    caption: '强台风',
                    min: 41.5,
                    max: 50.9,
                    color: 'rgba(255, 58, 163, 0.7)',
                    scope: '强台风(级) 41.5-50.9米/秒'
                }, {
                    caption: '超强台风',
                    min: 51.0,
                    max: 56.1,
                    color: 'rgba(175, 0, 217, 0.7)',
                    scope: '超强台风(级) ≥51.0米/秒'
                }
            ]
        },
        seafog: {
            unit: 'J/m s',
            list:[
                {
                    min: 0,
                    max: 20,
                    scope:'0~20',
                    color: '#810040'
                },
                {
                    min: 20,
                    max: 50,
                    scope:'20~50',
                    color: '#FB00FB'
                },
                {
                    min: 50,
                    max: 100,
                    scope:'50~100',
                    color: '#DDA1DD'
                },
                {
                    min: 100,
                    max: 150,
                    scope:'100~150',
                    color: '#60B9FF'
                },
                {
                    min: 150,
                    max: 200,
                    scope:'150~200',
                    color: '#3CBB3C'
                },
                {
                    min: 200,
                    max: 99999999,
                    scope:'>200',
                    color: '#FFFFFF'
                },
            ]
        },
        thunder:{
            unit: 'kv',
            list: [
                {
                    min: 0,
                    max: 5,
                    scope:'0~5',
                    color: '#CFFFFF'
                },
                {
                    min: 5,
                    max: 10,
                    scope:'5~10',
                    color: '#9DFFFF'
                },
                {
                    min: 10,
                    max: 15,
                    scope:'10~15',
                    color: '#FFFF9D'
                },
                {
                    min: 15,
                    max: 20,
                    scope:'15~20',
                    color: '#FFCF9D'
                },
                {
                    min: 20,
                    max: 25,
                    scope:'8~10.8',
                    color: '#FF9F62'
                },
                {
                    min: 25,
                    max: 30,
                    scope:'25~30',
                    color: '#FF6030'
                },
                {
                    min: 30,
                    max: 35,
                    scope:'30~35',
                    color: '#FF3030'
                },
                {
                    min: 35,
                    max: 400000,
                    scope:'>40',
                    color: '#CF0000'
                },
            ]
        },
        all:{
            unit: 'm',
            list:[
                {
                    min: 0,
                    max: 5,
                    scope:'0~5',
                    color: '#810040'
                },
            ]
        }
    };

    return legendColor[Options];
}

//地图标题
const setMapTitle = Options => {
    let {vm, mapId, title, date, fontSize = 18, bgTop = 50 , bgWidth = 380, bgHeight = 60,posi = 200, diff = 35} = Options;
    if(mapId ==='lvgMap'){vm.mapTitle.title =  title; vm.mapTitle.date =  date}else{vm.mapTitle.title2 =  title; vm.mapTitle.date2 =  date};
    return;
    let map = vm.maps[mapId];
    if (map) {
        map.on('postcompose', event => {
            const ctx = event.context
            const c = event.frameState.pixelRatio
            const isDeputy = /\u7ec6\u7f51\u683c/.test(title)
            ctx.save()

            const width = ctx.canvas.width
            const height = ctx.canvas.height
            ctx.beginPath()
            ctx.fillStyle = 'rgba(255, 255, 255, 1)'
            ctx.fillRect(width / 2 - posi, bgTop, bgWidth, bgHeight)
            ctx.closePath()

            // 绘制标题
            ctx.beginPath()
            ctx.fillStyle = 'red'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.font = `700 ${fontSize}px Arial`
            ctx.fillText(title, width / 2 - 10, bgTop + 10)
            ctx.closePath()

            //绘制日期
            ctx.beginPath()
            ctx.fillStyle = 'red'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.font = `700 ${fontSize}px Arial`
            ctx.fillText(date, width / 2 - 10 , bgTop + diff)
            ctx.closePath();
            ctx.restore()
        })
        map.renderSync();//刷新地图
    }

}

//预警信号图标配置路径 Options = {level:级别, type:类型}
const warningSignIcon = Options => {
    let {level, type} = Options, iconColor, iconType, severity, eventType,color;
    switch(level){
        case 'Blue':
            iconColor = '4';
            severity = '蓝色';
            color = 'blue';
        break;
        case 'Yellow':
            iconColor = '3';
            severity = '黄色';
            color = 'yellow';
        break;
        case 'Orange':
            iconColor = '2';
            severity = '橙色';
            color = 'orange';
        break;
        case 'Red':
            iconColor = '1';
            severity = '红色';
            color = 'red';
        break;
    }
    switch(type){
        case '11B01':
            iconType = '0001';
            eventType = '台风';
        break;
        case '11B03':
            iconType = '0002';
            eventType = '暴雨';
        break;
        case '11B04':
            iconType = '0003';
            eventType = '暴雪';
        break;
        case '11B05':
            iconType = '0004';
            eventType = '寒潮';
        break;
        case '11B06':
            iconType = '0005';
            eventType = '大风';
        break;
        case '11B07':
            iconType = '0006';
            eventType = '沙尘暴';
        break;
        case '11B09':
            iconType = '0007';
            eventType = '高温';
        break;
        case '11B22':
            iconType = '0008';
            eventType = '干旱';
        break;
        case '11B14':
            iconType = '0009';
            eventType = '雷电';
        break;
        case '11B15':
            iconType = '0010';
            eventType = '冰雹';
        break;
        case '11B16':
            iconType = '0011';
            eventType = '霜冻';
        break;
        case '11B17':
            iconType = '0012';
            eventType = '大雾';
        break;
        case '11B19':
            iconType = '0013';
            eventType = '霾';
        break;
        case '11B21':
            iconType = '0014';
            eventType = '道路结冰';
        break;
        case '11B20':
            iconType = '0017';
            eventType = '雷雨大风';
        break;
        case '11B56':
            iconType = '0018';
            eventType = '低温';
        break;
        default:
            iconType = 'other';
            eventType = '其它';
        break;
     }
    return {
       picSrc : `../../static/images/alarm_icons/${iconType}-${iconColor}ico.gif`,
       severity,
       eventType,
       color
    };
}

// 台风图例色带
const typhoonColors = () => [
    {
        caption: '热带低压',
        min: 10.8,
        max: 17.1,
        color: [3, 253, 225, 0.7],
        label: '热带低压(级) 10.8-17.1米/秒'
    }, {
        caption: '热带风暴',
        min: 17.2,
        max: 24.4,
        color: [253, 242, 2, 0.7],
        label: '热带风暴(级) 17.2-24.4米/秒'
    }, {
        caption: '强热带风暴',
        min: 24.5,
        max: 32.6,
        color: [252, 146, 44, 0.7],
        label: '强热带风暴(级) 24.5-32.6米/秒'
    }, {
        caption: '台风',
        min: 32.7,
        max: 41.4,
        color: [255, 4, 3, 0.7],
        label: '台风(级) 32.7-41.4米/秒'
    }, {
        caption: '强台风',
        min: 41.5,
        max: 50.9,
        color: [255, 58, 163, 0.7],
        label: '强台风(级) 41.5-50.9米/秒'
    }, {
        caption: '超强台风',
        min: 51.0,
        max: 56.1,
        color: [175, 0, 217, 0.7],
        label: '超强台风(级) ≥51.0米/秒'
    }
]

//风力等级、风向
const windDLevel = (val,d) =>{
    let l = 0, wd = '' , windName = '';
    if(val >= 0 && val <= 0.2){
        l = 0
    }
    else if (val >= 0.3 && val <= 1.5){
        l = 1
    }
    else if (val >= 1.6 && val <= 3.3){
        l = 2
    }
    else if (val >= 3.4 && val <= 5.4){
        l = 3
    }
    else if (val >= 5.5 && val <= 7.9){
        l = 4
    }
    else if (val >= 8.0 && val <= 10.7){
        l = 5
    }
    else if (val >= 10.8 && val <= 13.8){
        l = 6
    }
    else if (val >= 13.9 && val <= 17.1){
        l = 7
    }
    else if (val >= 17.2 && val <= 20.7){
        l = 8
    }
    else if (val >= 20.8 && val <= 24.4){
        l = 9
    }
    else if (val >= 24.5 && val <= 28.4){
        l = 10
    }
    else if (val >= 28.5 && val <= 32.6){
        l = 11
    }
    else if (val >= 32.7 && val <= 36.9){
        l = 12
    }
    else if (val >= 37.0 && val <= 41.4){
        l = 13
    }
    else if (val >= 41.5 && val <= 46.1){
        l = 14
    }
    else if (val >= 46.2 && val <= 50.9){
        l = 15
    }
    else if (val >= 51.0 && val <= 56.0){
        l = 16
    }
    else if (val >= 56.1 && val <= 61.2){
        l = 17
    }
    else{
        l = 0
    }
    let symbolRotateArr = [
        {name:'北',min:0,max:0,val:'n'},{name:'东北',min:1,max:89,val:'en'},
        {name:'东',min:90,max:90,val:'e'},{name:'东南',min:91,max:179, val:"es"},
        {name:'南',min:180,max:180,val:'s'},{name:'西南',min:181,max:269,val:'ws'},
        {name:'西',min:270,max:270,val:'w'},{name:'西北',min:271,max:359,val:'wn'},
    ]
    symbolRotateArr.map(s => { //风向判断
        if(d >= s.min && d <= s.max){
            wd = s.val;
        }
    })
    if(wd!== ''){
        windName = `${l}_${wd}`;
    }
    else{
        windName = l;
    }
    return windName;
}

/*----------------------------------------------------------------地图图层相关项-----------------------------------------------------------------------*/

//创建地图
const createMap = Options => {
    let {vm,id, layer, zoom, projection, center, minZoom, maxZoom} = Options;
    vm.maps[id] = new Map({
         // 设置地图控件，默认的三个控件都不显示
        controls : defaults({
            attribution: false,
            rotate: false,
            zoom: false
        }).extend(id === 'lvgMap' ? [ mousePositionControl(vm.$refs['mouse-position']) ] : ''),
        layers : layer!=null && layer!=undefined ? TDJTYXMap({vm,mapId:id})[layer] : [],
        view : setView({
            //projection, center, zoom, minZoom, maxZoom
            center:transform(center, 'EPSG:4326', 'EPSG:3857'), zoom, minZoom, maxZoom
        }),
        target: id
    })
}
//交通图、地形图、影像地图
const  TDJTYXMap = Options => {
    let {vm, mapId} = Options;
    vm.layers['TianDiTraffic'] =  new Tile({ //交通图
        layerId: 'TianDiTraffic',
        source: new XYZ({
            url: 'http://t2.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
        }),
        zIndex: 1
    }),
    vm.layers['TianDiTerrainInfo'] = new Tile({//天地图地形图地理信息
        layerId: 'TianDiTerrainInfo',
        source:  new XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
        }),
        zIndex: 4
    });
    vm.layers['TianDiTrafficInfo'] = new Tile({ //谷歌交通图
        layerId: 'TianDiTrafficInfo',
        source:  new XYZ({
              //url: 'http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}'
              //url: 'http://t6.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
              url: 'http://t2.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
        }),
        zIndex: 5
    }),
    vm.layers['TianDiTerrain'] = new Tile({//天地图地形图地图
        layerId: 'TianDiTerrain',
        source:  new XYZ({
            url: 'http://t6.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef'
        }),
        zIndex: 3
    });
    vm.layers['TianDiYingXiangInfo'] = new Tile({//影像图
        layerId: 'TianDiYingXiangInfo',
        source:  new XYZ({
            url:"http://t3.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=76620c5b63143f80f875dffb556b57ef"
        }),
        zIndex: 5
    });
   return [
       [vm.layers['TianDiTraffic'],vm.layers['TianDiTrafficInfo']],
       [vm.layers['TianDiTraffic']]
    ]
}

// 实例化鼠标位置经纬度控件
const mousePositionControl = target => {
    return new MousePosition({
            coordinateFormat: coordinate.createStringXY(2), //坐标格式
            projection: 'EPSG:4326', //地图投影坐标系
            className: 'custom-mouse-position', //坐标信息显示样式
            // 显示鼠标位置信息的目标容器
            target,//: document.getElementById(id),
            undefinedHTML: '不在范围内' //未定义坐标的标记
        });
}

//设置地图是否可见
const setVisibleLayer = Options => {
    let {vm, hideLayerIdArr, showLayerIdArr, mapId = 'lvgMap'} = Options;
    if(hideLayerIdArr.length){ //不可见
        let hlayer = 0;
        hideLayerIdArr.map(id => {
            vm.maps[mapId].getLayers().getArray().forEach(h => {
                if (h.getProperties()["layerId"] === id) {
                     hlayer = h;
                }
            })
            if(hlayer){
                hlayer.setVisible(false);
            }
        })
    }
    if(showLayerIdArr.length){ //可见
        let slayer = 0 ;
        showLayerIdArr.map(id => {
            vm.maps[mapId].getLayers().getArray().forEach(s => {
                if (s.getProperties()["layerId"] === id) {  //如果相等则显示 否则添加图层
                     slayer = s;
                }
            })
            if(slayer){
                slayer.setVisible(true);
            }
            else{
                vm.maps[mapId].addLayer(vm.layers[id]);
            }
        })
    }
}

const setView = Options => {
    return  new View(Options);
}

//设置图层数据源
const setLayerSource = Options => {
    let {vm, layerId, source} = Options;
    vm.layers[layerId].setSource(source);
}
//设置矢量数据源 Options{vm, layerid:图层id, geojson}
const setVectorSource = Options => {
    let {geojson, ...o } =  Options
    let source = new ol.source.Vector({
        features: formatGeoJSON.readFeatures(geojson, {
            dataProjection:'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    })
    setLayerSource(Object.assign(o,{source}));
}

//文字标注(北海附近海域) Options:{text:文字，coordinate:坐标}
const textAnnotationFeature = Options => {
    let {text, coordinate} = Options
    let anchor = new Feature({
        geometry: new geom.Point(transform(coordinate, 'EPSG:4326', 'EPSG:3857'))
    });
    anchor.setStyle(new Style({
        text : styleText({
            text,
            offsetX:0,
            offsetY:10,
            TextFillColor:'#1b69d3'
        })
    }))
    return anchor;
}

//广西边界(面)
const gxbj = Options => {
    let{vm, coordinate} = Options;
    vm.layers['gxbj'] = new Vector({
        source: new ol.source.Vector({
            url: '../../static/data/guangxi.geojson',
            format: new format.GeoJSON()
        }),
        layerId: 'gxbj',
        zIndex:20,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#1b69d3',
                size: 3
            })
        })
    })
    vm.maps['lvgMap'].addLayer(vm.layers['gxbj']);

    // let polygon = new Feature({
    //     geometry: new geom.Polygon(transform([[[110, 39], [116, 39], [116, 33], [110, 33], [110, 39]]], 'EPSG:4326', 'EPSG:3857')),
    // });

    // polygon.setStyle(new Style({
    //     stroke : new Stroke({
    //         color:'red',
    //         width:2,
    //         lineDash:[1, 2, 3, 4, 5, 6]
    //     })
    // }))
    // console.log('hhghg',polygon);alert(6556532)
    // return polygon;
}

//创建矢量图层
const createLayer = Options => {
    let  {vm,source, geojson, ers, crs,layerId,layerCaption,opacity,zIndex,style,fillColor,strokeColor,lineDash,lineCap,strokeWidth} = Options
    if(vm.layers[layerId] && vm.maps['lvgMap']){
        vm.maps['lvgMap'].removeLayer(vm.layers[layerId]);
    }
    const formatGeoJSON = new format.GeoJSON();
    const layer = new Vector({
        source: source ||
            new ol.source.Vector({
                features: formatGeoJSON.readFeatures(geojson, {
                    //dataProjection: ers || 'EPSG:3857',
                    //featureProjection: crs || 'EPSG:3857'
                    dataProjection: ers || 'EPSG:4326',
                    featureProjection: crs || 'EPSG:3857'
                })
            }),
        layerId: layerId || '',
        layerCaption: layerCaption || '',
        opacity: opacity || 1,
        zIndex: zIndex,
        style: style ||
            new Style({
                fill: styleFill({
                    fillColor,
                    notFillColor:'rgba(0 ,0 , 0, 0)'
                }),
                stroke: styleStroke({
                    strokeColor,
                    strokeWidth,
                    lineDash : lineDash ? lineDash : [1, 1],
                    lineCap : lineCap ? lineCap : [1, 1],
                })
            })
    })
   vm.layers[layerId]=layer;//添加图层到layers
   return layer
}

//创建影像图层
const createImageLayer = Options => {
    let {vm, url, projection = 'EPSG:4326', imageExtent, zIndex, layerId, mapId = 'lvgMap'} = Options;
    console.log('yx:s');
    console.log(projection);
    console.log(imageExtent);
    console.log('yx:e');
     let l = new Image({
        source: new ImageStatic({
            url,
            projection,
            imageExtent,
        }),
        zIndex,
        layerId
    })
    vm.maps[mapId].addLayer(l);
    return l;
}

//创建网格图层
const createGridLayer = Options => {
    let { vm, mapId, layerId, gridType, geoJson, textShow,element,gridShow } = Options;
    let map =  vm.maps[mapId];
    let view = map.getView();
    let zoom = view.getZoom()
    let extent = view.calculateExtent();
    let lt = transform([extent[0], extent[1]], 'EPSG:3857', 'EPSG:4326');//左上角经纬度
    let rb = transform([extent[2], extent[3]], 'EPSG:3857', 'EPSG:4326');//右下角经纬度
    let fxgSrc = [];//风向杆图片路径
    console.log(lt,rb,zoom);//console.log('createGridLayer-geoJson',geoJson);
    if (gridType === 'grib') { // 智能网格
        Options['gridGeojson'] = gridPointGeoJson({ data: geoJson, zoom, lt, rb});
    }
    else {
        Options['gridGeojson'] = gridPointGeoJson_NEW({ data: geoJson, zoom, lt, rb})
    }
    console.log(Options['gridGeojson'])
    vm.layers[layerId] = createLayer({
        vm,
        geojson : Options['gridGeojson'],
        layerId,
        layerCaption: `${gridType}网格`,
        zIndex: 10,
        style: f => {
            let val = f.get('value'); //console.log(f.get('lon'),f.get('lat'))
            return new Style({
                fill : styleFill({
                    fillColor : 'rgba(0 ,0 , 0, 0)'
                }),
                stroke : styleStroke({
                    strokeColor: gridShow ? 'rgba(0 ,0 , 0, 0.4)' : 'rgba(0 ,0 , 0, 0)',
                    strokeWidth : 1,
                    lineDash:[0]
                }),
                text: new Text({
                    text: val + '',
                    font: '14px 微软雅黑',
                    scale: 0.9,
                    rotateWithView: true,
                    textBaseline: 'center',
                    textAlign: 'center'
                })

            })
        }
    })
    if(textShow){
        removeLayer({vm, mapId:'lvgMap', layerId:'fxg'});//移除风向杆图层
        if(textShow){   //风向风速 && element === 'EDA10'
            if (vm.layers[layerId].getSource().getState() === 'ready') {    // 判定是否加载完成
                let f = vm.layers[layerId].getSource().getFeatures();
                fxgLayer({vm, mapId:'lvgMap', f, flag:element === 'EDA10' ? 'fxfs' : 'other'});
            }
        }else{
            removeLayer({vm, mapId:'lvgMap', layerId:'fxg'});//移除风向杆图层
        }
    }
    map.addLayer(vm.layers[layerId]);
}

//设置网格图层格点以及风向杆值
const setGridLayerStyle = Options => {
    let { vm, mapId, layerId, textShow,element } = Options;
    let layer = vm.layers[layerId], map =  vm.maps[mapId] || vm.maps['lvgMap'];
    if(textShow){ //风向风速 && element === 'EDA10'
        if (layer.getSource().getState() === 'ready') {    // 判定是否加载完成
            let f = layer.getSource().getFeatures();
            fxgLayer({vm, mapId:'lvgMap', f, flag:element === 'EDA10' ? 'fxfs' : 'other'});
        }
    }else{
        removeLayer({vm, mapId:'lvgMap', layerId:'fxg'});//移除风向杆图层
        console.log('移除风向杆图层',vm.layers['fxg'])
    }
}

//设置网格或其他图层样式 透明度为0
const setGridZTransStyle = Options => {
    let { vm, layerId} = Options;
    let layer = vm.layers[layerId];
    layer.setStyle(f => {
        return new Style({
            fill: new Fill({
                color: 'rgba(0 ,0 , 0, 0)'
            }),
            stroke: new Stroke({
                color: 'rgba(0 ,0 , 0, 0)',
                lineDash: [0],
                width: 1
            }),
        })
    })
}




/*
*格点以及风向杆样式图层
*mapId：哪个地图   f:点.线.面特征   flag: 区分风向风速(fxfs)与其他要素(other)
*/
const fxgLayer = p => {
    let {vm,mapId,f,flag} = p
    console.log('进来，绘制格点以及风向杆',vm.layers['fxg']);
   // if(!vm.layers['fxg']){
        let source = new ol.source.Vector();
        vm.layers['fxg'] = new Vector({
            source,
            layerId:'fxg',
            zIndex:20,
        });
        vm.maps[mapId].addLayer(vm.layers['fxg']);
        console.log('新建图层,格点以及风向杆',vm.layers['fxg']);
    //}
    if(vm.layers['fxg'].getSource().getFeatures().length){  //先移除之前的Features
        vm.layers['fxg'].getSource().getFeatures().map(item => {
            vm.layers['fxg'].getSource().removeFeature(item);
        })
    }

    //添加符合条件的Features
    f.map((item,i) => {
        let extent = ol.extent.boundingExtent(item.getGeometry().getCoordinates()[0]); //获取一个坐标数组的边界
        let center = ol.extent.getCenter(extent);   //获取多边形边界区域的中心位置

        let feature = new ol.Feature({
            geometry: new ol.geom.Point(center)
        });

        if(flag === 'fxfs'){  //风向杆
            let src =`../../static/images/wind2/${windDLevel(item.get('value').split(',')[1],item.get('value').split(',')[0])}.png`; //风速 风向
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    src,
                    scale: 0.5,
                    offset: [0, 1]
                })
            }));
        }
        else{             //格点
            feature.setStyle(new ol.style.Style({
                text :new Text({
                    text: item.get('value').toString(),
                    font: '13px bold 微软雅黑',
                    scale: 1,
                    rotateWithView: true,
                    textBaseline: 'center',
                    textAlign: 'center'
                })
            }));
        }
        vm.layers['fxg'].getSource().addFeature(feature);
    })
}

//渲染色斑图图层
const renderImageLayer = Options => {
    let {vm, mapId, imageExtent, data} = Options;
    mapId.map((item, i) => {
        let layerId = `${item}_IMAGE_LAYER`;
        removeLayer({vm,layerId,mapId:item});
        if (data) {
            vm.layers[layerId] = createImageLayer({
                vm,
                url:data,
                imageExtent,
                zIndex:8,
                layerId,
                mapId: item
            })
        }
    })
}

//静态图片数据源
const ImageStaticSource = Options => new ImageStatic(Options);


/*
*移除图层
*options{layerId:'图层id',mapId:'地图id'}
*/
const removeLayer = Options => {
    let {vm,
        layerId = ['rain', 'temperature', 'wind','budy-temperature', 'humidity','visible','LightningReal', 'waveHight','waveDire',
        'waveSpeed','radar','RadarLayer','FogLayer','cloud','cloudFog', 'gxbj','typhoon_layer','InteractionDrawLayer','InitShortImminent',
        'ShortImminent','ShortForecastInfo', 'GridLayer', 'ECGridLayer',
        'ECGridLayer_ec','lvgMap_IMAGE_LAYER','EcMap_IMAGE_LAYER','fxg','national','regional',
        'national_rain','national_humidity','national_visible','national_temp','national_wind','national_temperature',
        'regional_rain','regional_humidity','regional_visible','regional_temp','regional_wind','regional_temperature' ],
        mapId } = Options;
    let map = vm.maps[mapId] || vm.maps['lvgMap'];
    if(vm.draws['radarDraw']){
        map.removeInteraction(vm.draws['radarDraw']);//移除Interaction
    }
    if(Object.prototype.toString.call(layerId)== '[object Array]' && layerId.length > 0){ //如果是数组 则循环清除
        layerId.map(item =>{
            if(vm.layers[item]){
                map.removeLayer(vm.layers[item]);
            }
        })
    }
    else{
        if(vm.layers[layerId]){
            map.removeLayer(vm.layers[layerId]);
        }
    }

}

//将经纬度转换成geojson1
const  pointToGeoJson = (data, x, y) => {  console.log('pointToGeoJson',data)
    return {
        type: 'FeatureCollection',
        features: data.map((v, i) => {
            const f = {
                type: 'Point',
                coordinates: [v[x] - 0, v[y] - 0]
            }
            const g = {
                type: 'Feature',
                properties: v,
                geometry: f
            }
            return g
        })
    }
}

// 经纬度坐标转换成Geojson2
const  dataToPointGeoJson = (data, x, y, t) => {
    let lon = x || 'longitude';
    let lat = y || 'latitude';
    return {
        type: 'FeatureCollection',
        features: data.map((v, i) => {
            const f = {
                type: 'Point',
                coordinates: [v[lon] - 0, v[lat] - 0]
            }
            const g = {
                type: 'Feature',
                properties: {
                    'featureFlag': t,
                    ...v
                },
                geometry: f
            }
            return g
        })
    }
}

 //经纬度坐标转换为线路径
 const dataToLineGeoJson_New = (data, x, y, t) =>{
    let lon = x || 'longitude';
    let lat = y || 'latitude';
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };
    let g = {
        "type": "LineString",
        "coordinates": []
    };
    for (let i = 0; i < data.length; i++) {
        let f = {
            "type": "Feature",
            "properties": {
                "featureFlag": t || ''
            },
            "geometry": {}
        };
        g.coordinates.push([parseFloat(data[i][lon]), parseFloat(data[i][lat])])
        f.geometry = g;
        for (let key in data[i]) {
            f.properties[key] = data[i][key];
        }
        geojson.features.push(f);
    }
    return geojson;
}

//网格格点数据转换
const gridPointGeoJson = P => {
    let {data, type, zoom, lt, rb} = P;
    let geojson = {
        type: 'FeatureCollection',
        features: []
    }
    let offset = 0.05 // 五公里网格 单位公里
    let precision = 1 // 精度，隔多少个格点取一个

    // 400 240 求公因数
    // 2 2 2 2 4 因数分解
    // 5 3 分解余项
    if (zoom <= 6) {
        offset = 2
        precision = 40
    } else if (zoom <= 7) {
        offset = 0.8
        precision = 16
    } else if (zoom <= 8) {
        offset = 0.4
        precision = 8
    } else if (zoom <= 9) {
        offset = 0.1
        precision = 2
    } else {
        offset = 0.05
        precision = 1
    }

    // 以网格左上角数据渲染网格
    let len = offset //多少公里网格
    let features = []
    let x = 0 // 同经度异纬度
    let y = 0 // 同纬度异经度
    let prevLat = data[0].lat // 前一个纬度
    let startDate = new Date()
    data.map((v, idx) => {
        let lon = v.lon
        let lat = v.lat
        let curLat = (v.lat * 1).toFixed(2) //当前纬度
        if (curLat !== (prevLat * 1).toFixed(2)) { //如果前一个纬度不等于当前纬度 则赋值   // 同经度异纬度
            prevLat = curLat
            x = 0
            y++
        }
        if (x % precision === 0 && y % precision === 0 && lon >= lt[0] && lat >= lt[1] && lon <= rb[0] && lat <= rb[1]) { // 只渲染视窗里的要素 x % precision === 0 && y % precision === 0 &&
            // 以网格左上角数据渲染网格
            const plonRight = v.lon - 0 + len;
            const platBottom = v.lat - len;
            const beFiex = 0.05; // 服务端图片多出
            if (plonRight <= 117 + beFiex && platBottom >= 18) {
                // 网格仅在图片内
                const f = {
                    type: 'Feature',
                    properties: {...v },
                    geometry: {
                        type: type && type === 'Point' ? 'Point' : 'Polygon',
                        coordinates: type && type === 'Point' ? [v.lon - 0, v.lat - 0] : [
                            [
                                [v.lon - 0, v.lat - 0],
                                [v.lon - 0, (v.lat - len).toFixed(3) - 0],
                                [v.lon - 0 + len, (v.lat - len).toFixed(3) - 0],
                                [v.lon - 0 + len, v.lat - 0],
                                [v.lon - 0, v.lat - 0]
                            ]
                        ]
                    }
                }
                features.push(f)
            }
        }
        x++
    })
    let endDate = new Date()
    console.log('endData-startDate=', endDate - startDate)
    geojson.features = features
    return geojson;
}

const gridPointGeoJson_NEW = P => {
    let {data, type, zoom, lt, rb} = P;
    const geojson = {
        type: 'FeatureCollection',
        features: []
    }
    let features = []
    let len = (data[1].lon - data[0].lon) / 2

    data.map((v, idx) => {
        let lon = v.lon
        let lat = v.lat
        if (lon >= lt[0] && lat >= lt[1] && lon <= rb[0] && lat <= rb[1]) { // 只渲染视窗里的要素
            const f = {
                type: 'Feature',
                properties: {...v },
                geometry: {
                    type: type && type === 'Point' ? 'Point' : 'Polygon',
                    coordinates: type && type === 'Point' ? [v.lon - 0, v.lat - 0] : [
                        [
                            [v.lon - len, v.lat - 0 + len],
                            [v.lon - len, (v.lat - len).toFixed(3) - 0],
                            [v.lon - 0 + len, (v.lat - len).toFixed(3) - 0],
                            [v.lon - 0 + len, v.lat - 0 + len],
                            [v.lon - len, v.lat - 0 + len]
                        ]
                    ]
                }
            }
            features.push(f)
        }
    })
    geojson.features = features
    return geojson
}
/*
*添加Overlay
* {vm, mapId, overlayPosition, target , type}
*/
const addOverlay = Options =>{
    let {vm, mapId, overlayPosition, target, type} = Options,point_overlay, point_overlayArr = [];
    //vm.maps[mapId].getOverlays().clear();//清除所有Overlay
    if(type === 'plural'){ //如果是站点需要显示名称+点
        overlayPosition.map((item,index) => {
            target.map((t,i) => {
               point_overlay = new Overlay({
                   element: document.getElementById(`${t}${index}`),
                   positioning: 'center-center'
               });
               vm.maps[mapId].addOverlay(point_overlay);
               point_overlay.setPosition(transform(item[i], 'EPSG:4326', 'EPSG:3857'));
               point_overlayArr.push(point_overlay);
               console.log('item[index][i]',item[i])

            })
       })
    }
    else{//站点只需要显示点
        if(overlayPosition.length > 0){
            overlayPosition.map((item,i) => {
                point_overlay = new Overlay({
                    //element: vm.$refs[`${target}${i}`],
                    element: document.getElementById(`${target}${i}`),
                    autoPan:true,
                    positioning: 'bottom-center'
                });
                vm.maps[mapId].addOverlay(point_overlay);
                point_overlay.setPosition(transform(item, 'EPSG:4326', 'EPSG:3857'));
                point_overlayArr.push(point_overlay);
            })
        }

    }
   return  point_overlayArr;
}

/*
*添加圆要素图层FeatureLayer
*/
const addCircleFeatureLayer = Options => {
    let features=[],circle,circlefeature,{vm, scopes, strokeColor, fillColor, center} = Options;
    center.map((c,i)=>{        //多少个中心点 center与scopes一一对应
        scopes[i].map((item,index) => {
        circlefeature = new Feature({                  //设置圆Feature
            geometry:new geom.Circle(transform(c, 'EPSG:4326', 'EPSG:3857'), item),//new geom.Circle(center, item),//添加圆
            name:''
        });
        circlefeature.setStyle(new Style({     //设置圆Feature样式
            stroke : new Stroke({
                    color:strokeColor[index],
                    width:2,
                    lineDash:[1, 2, 3, 4, 5, 6]
                }),
            fill : index === scopes[i].length - 1 ? styleFill({
                    fillColor,
                }) :''

            })
        );
        features.push(circlefeature); //多少个圆数组
        })
   })
    return {
        source: new ol.source.Vector({ //预警范围图层源
            features
        }),
        features
    }
}

/*
*绘制线段
*type:类型 maxPoints:最大点数 imageExtent:静态图片的中心范围
*/
let drawFeature = [];
const InteractionDraw = Options => {
    let {vm, type = 'LineString', maxPoints = 2, imageExtent} = Options;
    //新建矢量图层用于存放绘制Feature
    let source = new ol.source.Vector({wrapX: false});
    vm.layers['InteractionDrawLayer'] = new Vector({
        source,
        style: new Style({
            stroke: new Stroke({
                color: 'red',
                size: 5
            })
        }),
        layerId:'InteractionDrawLayer',
        zIndex:999,
    });
    vm.maps['lvgMap'].addLayer(vm.layers['InteractionDrawLayer']);
    vm.draws['radarDraw'] = new Draw({
        type,
        source: vm.layers['InteractionDrawLayer'].getSource(),
        style: new Style({            // 设置绘制时的样式
            stroke: new Stroke({
                color: '#009933',
                size: 5
            })
        }),
        maxPoints,   // 限制点数
    })
    // 监听线绘制开始事件，删除上一次画的
    vm.draws['radarDraw'].on('drawstart', e => {
        if(drawFeature.length){
            vm.layers['InteractionDrawLayer'].getSource().removeFeature(drawFeature[0]);
            drawFeature = [];
        }
    })
    // 监听线绘制结束事件，获取坐标
    vm.draws['radarDraw'].on('drawend', e => {
        drawFeature.push(e.feature);//把画好的放入数组
        let c = e.feature.getGeometry().getCoordinates(),Coordinates = [];
        c.map(item => { //坐标转经纬度
            item = ol.proj.transform(item, 'EPSG:3857', 'EPSG:4326');
            Coordinates.push(item);
        });
        let center = ol.extent.getCenter(imageExtent);//静态地图(雷达图)中心点
        //雷达刨面图
        vm.getRainForecastProfile({
            startlon : parseFloat(Coordinates[0][0]).toFixed(2),
            startlat : parseFloat(Coordinates[0][1]).toFixed(2),
            endlon : parseFloat(Coordinates[1][0]).toFixed(2),
            endlat : parseFloat(Coordinates[1][1]).toFixed(2),
            center,
        })
        console.log('绘制完成的经纬度', Coordinates);
    });
    vm.maps['lvgMap'].addInteraction(vm.draws['radarDraw']);
    return Coordinates;
}
/*
*多边形选
*/
let Coords = [];
const PolygonDraw = Options => {
    let {vm,mapId } = Options;
    let drawSource = new ol.source.Vector({wrapX: false});
    vm.layers['PolygonDrawLayer'] = new Vector({
        source: drawSource,
        style: new Style({
            stroke: new Stroke({
                color: 'green',
                width: 3
            })
        }),
        layerId:'PolygonDrawLayer',
        zIndex:999,
    });
    vm.maps[mapId].addLayer(vm.layers['PolygonDrawLayer']); //设置一个放置绘制图形的图层
    let draw = new Draw({
        source: drawSource,
        type:"Polygon",
    });
    vm.maps[mapId].addInteraction(draw); //添加绘制
     // 监听线绘制开始事件，删除上一次画的
    vm.draws['radarDraw'].on('drawstart', e => {
        Coords = [];
    })
    draw.on('drawend',e=>{  //绘制结束后 筛选出符合条件的点
        let polygon = e.feature.getGeometry(), extent = polygon.getExtent();
        polygon.getCoordinates().map(c => {     //多边形坐标组 转化经纬度
            c = ol.proj.transform(c, 'EPSG:3857', 'EPSG:4326');
            Coords.push(c);
        }); console.log('====>',Coords)
        let features = vm.layers['PortLayer'].getSource().getFeaturesInExtent(extent); //先缩小feature的范围
        features.map((f,i) => {
            let newCoords = f.getGeometry().getCoordinates();console.log(f.get("name"))
            if(insidePolygon(Coords,newCoords)){
            }

        })
    })

}

function insidePolygon(points, testPoint){
    var x = testPoint[0], y = testPoint[1];
    var inside = false;
    for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
        var xi = points[i][0], yi = points[i][1];
        var xj = points[j][0], yj = points[j][1];

        var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}


/*
*指针移动事件
*/
const mapPointerMove = Options => {
    let { vm } = Options, SeaRoutesF = null;
    let map = vm.maps['lvgMap'] ||  vm.maps['MianMap'];
    map.on('pointermove',(e) => {
        let f = map.forEachFeatureAtPixel(e.pixel, (feature,layer)=>{
            if(!layer){
                return;
            }
            let layerId = layer.get('layerId');
            if( !layerId.includes('radar') && !layerId.includes('cloud')&& !layerId.includes('cloudFog') &&
                !layerId.includes('GridLayer') && !layerId.includes('GX') &&
                !layerId.includes('temp') && !layerId.includes('rain') &&
                !layerId.includes('humidity') && !layerId.includes('visible') &&
                !layerId.includes('wind') &&  !layerId.includes('fxg') &&
                !layerId.includes('buoy') &&  !layerId.includes('island') && !layerId.includes('LightLayer') &&
                !layerId.includes('ship')&&  !layerId.includes('national') &&  !layerId.includes('regional') &&
                !layerId.includes('PortLayer') &&  !layerId.includes('AreaEqValSurface') && !layerId.includes('AttractionsLayers') &&
                !layerId.includes('SeaLayer') && !layerId.includes('typhoon_layer') && !layerId.includes('GridPointRealLayer')){
                 return {
                     feature,
                     layerId
                 }
            }
            return null;
       })
       if(f){//如果feature不为null
            map.getTargetElement().style.cursor = "pointer";
            vm.Popup_Object = {PopupRegion:'站点名称', PopupRegionCode:'站点编号', PopupData:[],PopupPixel:{left:0, top:0},PopupPixel2:{},showPopup2:false,showPopup:true,showPopup3:false,WarningSignsData:[],ShortImminentData:[],InitShortImminentData:[],ShortForecastData:[],rainListFlag:[],moreListFlag:[],GtThresholdSiteData:[]};
            vm.Popup_Object.PopupPixel['left'] = e.pixel[0]-25;
            vm.Popup_Object.PopupPixel['top'] = e.pixel[1]+10;//+10
            let p = f.feature.getProperties(); //feature的全部信息
            let name = 0, code=p.code, value;


            if( f.layerId.includes('temp') ){//-------------------如果是气温
                vm.Popup_Object.PopupRegionVal = '气温(℃)';
                if(f.layerId === 'temperature'){ //站点气温
                    name = p.name;
                    code = p.code;
                    value = p.value;
                    vm.Popup_Object.isShowName = true;//是否显示站名
                }
                else{ //浮标站气温
                    code = p.stationNum;
                    value = p.temp ==='0' || p.temp ==='0℃' ?  '异常值' : p.temp
                    vm.Popup_Object.isShowName = false; //是否显示站名
                }
                vm.Popup_Object.PopupData.push({name,code,value});
            }
            else if( f.layerId.includes('waveHight') ){//-------------------如果是浪高
                code = p.stationNum;
                value = p.waveHight;
                vm.Popup_Object.isShowName = false; //是否显示站名
                vm.Popup_Object.PopupRegionVal = '浪高(m)';
                vm.Popup_Object.PopupData.push({name,code,value});
            }
            else if(f.layerId.includes('warningSignsLayer')){//----------------如果是预警信号
                vm.Popup_Object.WarningSignsData.push({headline:p.headLine,description:p.description});
            }
            else if(f.layerId.includes('TargetlPlaceLayer')){ //---------------如果是指标点
                if(vm.PlaceInScale)vm.PlaceInScale(f.feature)
            }
            else if(f.layerId.includes('ShortForecastInfo')){//----------------如果是短临预报信息
                vm.Popup_Object.ShortForecastData.push({headline:p.message.split(',')[0],description:p.info});
            }
            else if(f.layerId.includes('InitShortImminent')){ //---------------如果是短临页面初始化页面数据
                if(!p.code) {vm.Popup_Object.showPopup = false; return false;}
                vm.Popup_Object.InitShortImminentData.push({
                    name:p.stationName === null ? '缺测': p.stationName, code:p.code === null ? '缺测': p.code,
                    wind:p.wind === null ? '缺测': p.wind, seafog:p.seafog === null ? '缺测': p.seafog,
                    rain:p.rain === null ? '缺测': p.rain, temp:p.temp === null ? '缺测': p.temp,
                })
                vm.Popup_Object.windU = '风速(m/s)';
                vm.Popup_Object.seafogU = '海雾(J/m s)';
                vm.Popup_Object.rainU = '降水(mm)';
                vm.Popup_Object.tempU = '气温(℃)';
            }
            else if(f.layerId.includes('ShortImminent')){ //---------------如果是短临气象类型数据
                if(!p.code) {vm.Popup_Object.showPopup = false; return false;}
                vm.Popup_Object.ShortImminentData.push({
                    name:p.stationName === null ? '缺测': p.stationName, code:p.code === null ? '缺测': p.code,
                    value:p.value === null ? '缺测': p.value,
                })
                vm.Popup_Object.unit = p.unit;
            }
            else if (f.layerId.includes('SeaRoutes')){  //-------------如果是航线
                SeaRoutesF = f.feature
                if(vm.SeaRouteScale)vm.SeaRouteScale({f:f.feature,flag:true});
            }
            else{ //------------------------否则
                name = p.name;
                code = p.code;
                value = p.value;
                vm.Popup_Object.isShowName = true; //是否显示站名
                console.log(f.layerId)
                if(f.layerId.includes('rain')){  //降水
                    vm.Popup_Object.PopupRegionVal = '水量(mm)';
                }
                else if(f.layerId.includes('humidity')){
                    vm.Popup_Object.PopupRegionVal = '湿度(%)';
                }
                else if(f.layerId.includes('visible')){
                    vm.Popup_Object.PopupRegionVal = '能见度(m)';
                }
                else if(f.layerId.includes('wind')){
                    vm.Popup_Object.PopupRegionVal = '风速(m/s)';
                }
                vm.Popup_Object.PopupData.push({name,code,value});
            }
        }
        else{
            map.getTargetElement().style.cursor = "";
            if(vm.Popup_Object)vm.Popup_Object.showPopup = false;
            if(vm.PlaceInScale)vm.PlaceInScale(false)
            if(vm.SeaRouteScale)vm.SeaRouteScale({f:SeaRoutesF,flag:false});
        }
    })
}
/*
*指针点击事件
*/
const mapPointerClick = Options => {
    let { vm } = Options;
    let map = vm.maps['lvgMap'] ||  vm.maps['MianMap'];
    map.on('click',(e) => {
        let f = map.forEachFeatureAtPixel(e.pixel, (feature,layer)=>{
            let layerId = layer.get('layerId');
            if(
                layerId==='temperature' || layerId.includes('rain') || layerId.includes('national_temp') || layerId.includes('regional_temp')||
                layerId.includes('humidity') || layerId.includes('visible')  || layerId.includes('island') || layerId.includes('ship') ||
                layerId.includes('wind') || layerId.includes('typhoon_layer') || layerId.includes('TargetlPlaceLayer')||
                layerId.includes('national') || layerId.includes('regional') || layerId.includes('SeaRoutes') ||  layerId.includes('PortLayer')||
                layerId.includes('seaAreaPolyline')
               ){
                return {
                    feature,
                    layerId
                }
            }
            return null;
       })
       if(f){
            if(f.layerId.includes('typhoon_layer')){
                let flag = f.flag;
                let feature = f.feature;
                let properties = feature.getProperties();
                if (properties.geometry.getType() === 'Point') {
                    vm.showTyphoonPopup(properties, e.pixel);
                }
            }
            //航线 或 港口 或 海区
            else if(f.layerId.includes('SeaRoutes') || f.layerId.includes('PortLayer') || f.layerId.includes('seaAreaPolyline')){
                if(vm.getTableData)vm.getTableData(f.feature.getProperties().name)
            }
            //指标库
            else if(f.layerId.includes('TargetlPlaceLayer')){
                if(vm.handleRightEchart){vm.handleRightEchart(f.feature.getProperties());}
            }
            //自动站 单站点多要素时序图
            else if(f.layerId==='national' || f.layerId==='regional'){
                vm.Popup_Object = {PopupRegion:'站点名称', PopupRegionCode:'站点编号', PopupPixel:{left:e.pixel[0]-25, top:e.pixel[1]+10},PopupPixel2:{},showPopup2:false,showPopup:false,showPopup3:true,PopupData:[],WarningSignsData:[],ShortImminentData:[],InitShortImminentData:[],ShortForecastData:[],rainListFlag:[],moreListFlag:[1],GtThresholdSiteData:[]};
                if(vm.echartRealQuery2){vm.echartRealQuery2(f.feature.getProperties());}
            }
            //海洋站  单站点时序图
            else if(f.layerId==='island' || f.layerId==='ship'){
                if(vm.LiveCheck.nowCheckElem === 'all'){ //全部
                    vm.Popup_Object = {PopupRegion:'站点名称', PopupRegionCode:'站点编号', PopupPixel:{left:e.pixel[0]-25, top:e.pixel[1]+10},PopupPixel2:{},showPopup2:false,showPopup:false,showPopup3:true,PopupData:[],WarningSignsData:[],ShortImminentData:[],InitShortImminentData:[],ShortForecastData:[],rainListFlag:[],moreListFlag:[1],GtThresholdSiteData:[]};
                    if(vm.echartRealQuery2){vm.echartRealQuery2(f.feature.getProperties())};
                }
                else{ //单要素
                    vm.Popup_Object = {PopupRegion:'站点名称', PopupRegionCode:'站点编号', PopupPixel:{left:e.pixel[0]-25, top:e.pixel[1]+10},PopupPixel2:{},showPopup2:false,showPopup:true,showPopup3:true,PopupData:[],WarningSignsData:[],ShortImminentData:[],InitShortImminentData:[],ShortForecastData:[],rainListFlag:[1],moreListFlag:[],GtThresholdSiteData:[]};
                    vm.echartRealQuery(f.feature.getProperties()); //站点图表
                }

            }
            //自动站 单站点单要素时序图
            else{
                vm.Popup_Object = {PopupRegion:'站点名称', PopupRegionCode:'站点编号', PopupPixel:{left:e.pixel[0]-25, top:e.pixel[1]+10},PopupPixel2:{},showPopup2:false,showPopup:true,showPopup3:true,PopupData:[],WarningSignsData:[],ShortImminentData:[],InitShortImminentData:[],ShortForecastData:[],rainListFlag:[1],moreListFlag:[],GtThresholdSiteData:[]};
                vm.echartRealQuery(f.feature.getProperties()); //站点图表
            }
       }
       else{
            if(vm.handleClosePopup){vm.handleClosePopup()};
            if(vm.Popup_Object){vm.Popup_Object.showPopup = false;vm.Popup_Object.showPopup3 = false;}
        }

    })
}

export {
    styleStyle,
    styleFillStroke,
    removeLayer,
    pointToGeoJson,
    dataToPointGeoJson,
    createMap,
    TDJTYXMap,
    setVisibleLayer,
    addOverlay,
    createLayer,
    setLayerSource,
    addCircleFeatureLayer,
    createImageLayer,
    createGridLayer,
    renderImageLayer,
    setGridLayerStyle,
    getMapLegend,
    typhoonColors,
    setMapTitle,
    warningSignIcon,
    textAnnotationFeature,
    mapPointerMove,
    mapPointerClick,
    gxbj,
    setVectorSource,
    InteractionDraw,
    PolygonDraw,
    styleRegularShape,
    styleCircleNew,
    styleIconNew,
    setGridZTransStyle,
    windDLevel,
    dataToLineGeoJson_New,
}
