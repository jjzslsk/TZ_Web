function drawTools() {
    var features = [];
    var source = new ol.source.Vector({
        features: features
    });

    var vector = new ol.layer.Vector({
        source: source
    });

    vector.set("layerid", "drawLayer") //设置矢量图层的layerid，用于查找该图层
    map.addLayer(vector);

    var draw; // global so we can remove it later
    function addInteraction(type) {
        var value = type;
        if (value !== 'undefined' && value != undefined) {
            var arr = value.split(",");//判断是不是手绘
            //根据绘制的样式不同，就选择了不同的提示语
            if (value == "0,LineString") {
                $("#pop_draw").text("双击结束绘制");
                map.on('pointermove', pointerMoveHandler_draw);
            } else if (value == "0,Point") {
                map.un('pointermove', pointerMoveHandler_draw);
                map.getOverlayById("pop_draw").setPosition(undefined);
            } else if (value == "1,Circle") {
                $("#pop_draw").text("鼠标按住拖拽，松开结束绘制！");
                map.on('pointermove', pointerMoveHandler_draw);
            } else if (value == "1,Box") {
                $("#pop_draw").text("鼠标按住拖拽，松开结束绘制！");
                map.on('pointermove', pointerMoveHandler_draw);
            } else if (value == "1,Polygon") {
                $("#pop_draw").text("鼠标按住拖拽，松开结束绘制！");
                map.on('pointermove', pointerMoveHandler_draw);
            } else if (value == "1,LineString") {
                $("#pop_draw").text("鼠标按住拖拽，松开结束绘制！");
                map.on('pointermove', pointerMoveHandler_draw);
            } else {
                map.un('pointermove', pointerMoveHandler_draw);
                map.getOverlayById("pop_draw").setPosition(undefined);
            }


            var geometryFunction;
            if (arr[1] === 'Square') {
                arr[1] = 'Circle';
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            } else if (arr[1] === 'Box') {
                arr[1] = 'Circle';
                geometryFunction = ol.interaction.Draw.createBox();
            }
            draw = new ol.interaction.Draw({
                source: source,
                type: arr[1],
                freehand: parseInt(arr[0]),
                geometryFunction: geometryFunction,
                style: drawStyle
            });
            map.addInteraction(draw);
            draw.on('drawstart',
                function (evt) {
                    var flag = $(".mapDrawTool_ .selectedDiv").hasClass("text");
                    if (flag) {
                        var coor = evt.target.s;
                        map.getOverlayById("pop_text").setPosition(coor);
                    }
                }, this);


            draw.on('drawend',
                function (evt) {
                    var feature = evt.feature;
                    var bc = $(".toolPop .color-choose .background-color").css("background-color");
					if(!bc){
						bc = '#FF0000';
					}
                    var colorArr = getColorStr(bc);
                    var fillcolor = "rgba(" + colorArr.join(",") + ",0.2)";
                    var sHexColor = bc.colorHex().replace("#", "");
                    var size = $(".size-c div").attr("class");
                    var dfeaturtyle = pointStyle(bc, 'rgba(255,0,0,0.2)', 'o-size', sHexColor);;
                    if ($(".toolPop .selectedDiv").attr("flag") == "0") {
                        dfeaturtyle = pointStyle(bc, fillcolor, size, sHexColor);
                    } else if ($(".toolPop .selectedDiv").attr("flag") == "1") {
                        dfeaturtyle = polygenStyle(bc, fillcolor, size, sHexColor);
                    } else if ($(".toolPop .selectedDiv").attr("flag") == "2") {
                        dfeaturtyle = arrowPolylineStyle(feature);
                    }
                    feature.setStyle(dfeaturtyle);
                    //存放要素集合
                    features.push(feature);
                }, this);
        } else {
            map.un('pointermove', pointerMoveHandler_draw);
            map.getOverlayById("pop_draw").setPosition(undefined);
        }
    }

    //点的样式
    function pointStyle(bc, fillcolor, size, sHexColor) {
        var a = {
            "o-size": 1,
            "t-size": 3,
            "td-size": 5
        };
        var i = 1, s = size;
        "o-size" == s ? i = .5 : "t-size" == s && (i = .8),
            scale = i;

        var stroke = new ol.style.Stroke({
            color: bc,
            width: a[size]
        });
        var fill = new ol.style.Fill({
            color: fillcolor
        });
        var fimage = new ol.style.Icon({
            anchor: [23, 0],
            src: 'map/images/drawMark/' + sHexColor.toUpperCase() + '.png',
            scale: scale,
            size: [46, 70],
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            anchorOrigin: "bottom-left"
        })
        var ftext = new ol.style.Text({
            font: 'normal 600 16px sans-serif ',
            text: "",
            fill: new ol.style.Fill({
                color: 'rgba(255,0,255,1)'
            }),
            textAlign: 'center',
            textBaseline: 'bottom',
            rotateWithView: true
        });
        var dfeaturtyle = new ol.style.Style({
            text: ftext,
            image: fimage,
            fill: fill,
            stroke: stroke
        });
        return dfeaturtyle;
    }

    //方向箭头样式
    function arrowPolylineStyle(feature) {
        var geometry = feature.getGeometry();
        var styles = [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                })
            })
        ];

        geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'map/images/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));
        });
        return styles;
    }

    //面的样式
    function polygenStyle(bc, fillcolor, size, sHexColor) {
        var a = {
            "o-size": 1,
            "t-size": 3,
            "td-size": 5
        };
        var i = 1, s = size;
        "o-size" == s ? i = .5 : "t-size" == s && (i = .8),
            scale = i;

        var stroke = new ol.style.Stroke({
            color: "#27303F",
            width: a[size]
        });
        var fill = new ol.style.Fill({
            color: fillcolor
        });
        var fimage = new ol.style.Icon({
            src: 'map/images/drawMark/' + sHexColor + '.png',
            scale: scale,
            // imgSize:[46, 70],
            //anchor = [23, 0]
        })
        var ftext = new ol.style.Text({
            font: 'normal 600 16px sans-serif ',
            text: "",
            fill: new ol.style.Fill({
                color: 'rgba(255,0,255,1)'
            }),
            textAlign: 'center',
            textBaseline: 'bottom',
            rotateWithView: true
        });
        var dfeaturtyle = new ol.style.Style({
            text: ftext,
            image: fimage,
            fill: fill,
            stroke: stroke
        });
        return dfeaturtyle;
    }

    //圈选查询经济人口数据
    function tongji(geom) {
        var layerid = "populationAndSocialEconomyLayer";
        var oldLayer = ol3_layerHelper.getLayerById(map, layerid);
        if (oldLayer) {

        } else {
            getPopulationAndSocialEconomyData()
        }
        ol3_layerHelper.getLayerById(map, layerid).setVisible(false);
        var features = ol3_layerHelper.getLayerById(map, layerid).getSource().getFeatures();

        if (ol3_layerHelper.getLayerById(map, "tongjiLayer")) {
            map.removeLayer(ol3_layerHelper.getLayerById(map, "tongjiLayer"));
        }

        var fts = [];
        $.each(features, function (i, f) {
            var fgeom = f.getGeometry().A;
            if (geom.intersectsCoordinate(fgeom)) {
                fts.push(f);
            }
        });
        var source = new ol.source.Vector({features: fts});
        var vector = new ol.layer.Vector({
            source: source,
            layerid: "tongjiLayer",
            style: drawStyleF
        });
        map.addLayer(vector);
    }

//设置箭头的样式
    var styleFunction = function (feature) {
        var geometry = feature.getGeometry();
        var styles = [
            // linestring
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                })
            })
        ];
        geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'map/images/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));
        });
        return styles;
    };


    //绘制时的样式
    function drawStyle() {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        });
    }

//给在地图上添加的标注添加文本样式
    $("#text_queding").click(function () {
        var value = $("#biaozhu").val();
        var drawLayer = ol3_layerHelper.getLayerById(map, "drawLayer");
        var features = drawLayer.getSource().getFeatures();
        features[features.length - 1].setStyle(new ol.style.Style({
            /*	text: new ol.style.Text({
                    text: value,
                    font: "bold 24px 宋体",

                    fill: new ol.style.Fill({
                        color: "#2889d7"
                    })
                })*/

            text: new ol.style.Text({
                text: value,
                offsetY: 0,
                font: "28px Times New Roman",
                fill: new ol.style.Fill({
                    color: "#f00"
                }),
                stroke: new ol.style.Stroke({
                    color: "#fff",
                    width: 5
                })
            })


        }));
        map.getOverlayById("pop_text").setPosition(undefined);
    })

    /**
     * Handle change event.
     */
    $(".toolPop ul li div").click(function () {
        $("#pop_draw").addClass("tooltip");
        var flag = $(this).hasClass("selectedDiv");
        if (flag) {
            $(this).removeClass("selectedDiv");
        } else {
            $(this).addClass("selectedDiv").parent().siblings("li").find('div').removeClass("selectedDiv");
        }
        if ($(this).hasClass("undo")) {
            clearFeatures();
        } else if ($(this).hasClass("delete")) {
            clearAllFeatures();
        } else if($(this).hasClass("save")){
            html2canvas(document.getElementById("map"),{
                useCORS:true
            }).then(
                function (canvas) {
                    canvas.toBlob(function (blob) {

                        saveAs(blob,'map.png');

                    });
                });
        }
        if ($(this).hasClass("close")) {
            clearAllFeatures();//清理所有绘制的要素
            $(".toolPop").hide();//隐藏工具面板
            $('.myHeader .centerNav li[title="应急指挥工具"]').removeClass('checkTrue').children('div').hide();//把菜单的选中状态取消
            $(this).removeClass("selectedDiv");//清空选中状态
            $(".routesInfo").hide();//隐藏自动导航表格信息
        }

        if ($(this).hasClass("auto")) {  //导航至避难场所
            if ($(this).hasClass("selectedDiv")) {
                $("#disasterNavigation").show();
                $("#disasterNavigation").change();
                //移除测距的相关鼠标等事件
                map.un('pointermove', measure.pointerMoveHandler);
                //measure.measureTooltip.setPosition(undefined);
                measure.helpTooltip.setPosition(undefined);
            } else {
                $("#disasterNavigation").hide();
                $(".routesInfo").hide();
                map.getOverlayById("helpTooltip").setPosition(undefined);
                crearNaviAuto();
                map.un('pointermove', pointerMoveHandlerDisasterNavigation);
                map.un('click', addDisasterEvent);
            }

            var type = $(".toolPop .selectedDiv").attr("type");
            drawPolygenAnalysis.remove();
            //map.removeInteraction(draw);
            addInteraction(type);
        } else if ($(this).hasClass("measurement")) {//测量
            if ($(this).hasClass("selectedDiv")) {

                $(".measurePan_").show();
                drawPolygenAnalysis.remove();
                $("#measureType_").change();


            } else {
                $(".measurePan_").hide();
                if (measure.draw) {
                    map.removeInteraction(measure.draw);
                }
                if (ol3_layerHelper.getLayerById(map, "measureLayer").getSource()) {
                    ol3_layerHelper.getLayerById(map, "measureLayer").getSource().clear();
                }
                map.un('pointermove', measure.pointerMoveHandler);
                measure.measureTooltip.setPosition(undefined);
                measure.helpTooltip.setPosition(undefined);
                map.getViewport().removeEventListener('mouseout', measure.test1);
                map.un('pointermove', measure.pointerMoveHandler);
                map.un('pointermove', measure.pointerMoveHandler);
                map.un('pointermove', measure.pointerMoveHandler);
            }
        } else if ($(this).hasClass("save")) {
            map.once('postcompose', function (event) {

                var imgData = event.context.canvas.toDataURL({format: 'png', multiplier: 4});

                var blob = dataURLtoBlob(imgData);
                var objurl = URL.createObjectURL(blob);


                $(".toolPop ul li a").prop('href', objurl);
                $(".toolPop ul li a")[0].click();

                setTimeout(function () {
                    map.renderSync();
                }, 500);
            });
            map.renderSync();
        } else {
            // $("#disasterNavigation").hide();
            // $(".routesInfo").hide();
            // map.getOverlayById("helpTooltip").setPosition(undefined);
            // crearNaviAuto();
            // map.un('pointermove', pointerMoveHandlerDisasterNavigation);
            // map.un('click', addDisasterEvent);

            var type = $(".toolPop .selectedDiv").attr("type");
            // drawPolygenAnalysis.remove();
            //map.removeInteraction(draw);
            addInteraction(type);
        }


    })

    //....前面省略
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    //边界线粗细选择
    $(".toolPop .color-panel .color-size ul li").click(function () {
        $(this).addClass("size-c").siblings("li").removeClass("size-c");
    })

    //选择填充色颜色
    $("toolPop .color-choose .choose-list ul li").click(function () {
        var bc = $(this).css("background-color");

        $(".toolPop .color-choose .background-color").css("background-color", bc)
        var sHexColor = bc.colorHex();
    })

    //这个overlay用于显示标注字体
    var popup_text = new ol.Overlay({
        id: "pop_text",
        element: document.getElementById('pop_text'),
        offset: [12, -14]
    });
    map.addOverlay(popup_text);
    //这个overlay用于显示工具提示
    var pop_draw = new ol.Overlay({
        id: "pop_draw",
        element: document.getElementById('pop_draw'),
        offset: [12, -14]
    });
    map.addOverlay(pop_draw);
}

/**
 * 绘制图形的样式
 * @param {Object} f
 */
function drawStyleF(f) {
    var arrow = f.get("arrow");
    if (arrow) {
        var geometry = f.getGeometry();
        var styles = [
            // linestring
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                })
            })
        ];

        geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'map/images/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));
        });

        return styles;
    } else {
        var bc = $(".toolPop .color-choose .background-color").css("background-color");
        var colorArr = getColorStr(bc);
        var fillcolor = "rgba(" + colorArr.join(",") + ",0.2)";
        var sHexColor = bc.colorHex().replace("#", "");
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'red'
            }),
            stroke: new ol.style.Stroke({
                color: bc,
                width: 2
            }),
            image: new ol.style.Icon({
                src: 'map/images/drawMark/' + sHexColor + '.png'
            })
        })
    }

}

//分步清除所绘制的图形
function clearFeatures() {
    var drawLayer = ol3_layerHelper.getLayerById(map, "drawLayer");
    if (drawLayer) {
        var features = drawLayer.getSource().getFeatures();
        if (features.length == 0) {
            return;
        }
        drawLayer.getSource().removeFeature(features[features.length - 1])
    }

}

//一次清除所有绘制的图形
function clearAllFeatures() {
    var drawLayer = ol3_layerHelper.getLayerById(map, "drawLayer");
    if (drawLayer) {
        drawLayer.getSource().clear();
    }

}

var measure_source = new ol.source.Vector(); //测距绘制的和现实的绘制图层用同一个source，不然不显示
var measure = {
    vector: new ol.layer.Vector({
        source: measure_source,
        layerid: "measureLayer",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    }),
    sketch: undefined,
    helpTooltipElement: undefined,
    helpTooltip: undefined,
    measureTooltipElement: undefined,
    measureTooltip: undefined,
    continuePolygonMsg: '点击继续绘制一个面，双击结束',
    continueLineMsg: '点击继续绘制一条线，双击结束',
    pointerMoveHandler: function (evt) {
        if (evt.dragging) {
            return;
        }
        var helpMsg = '点击开始绘制';
        if (measure.sketch) {
            var geom = (measure.sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = measure.continuePolygonMsg;
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = measure.continueLineMsg;
            }
        }
        measure.createHelpTooltip();
        measure.helpTooltipElement.innerHTML = helpMsg;
        measure.helpTooltip.setPosition(evt.coordinate);
        measure.helpTooltipElement.classList.remove('hidden');
    },
    test1: function () {
        measure.helpTooltipElement.classList.add('hidden');
    },
    draw: new ol.interaction.Draw({
        source: measure_source,
        type: 'LineString',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    }),
    formatLength: function (line) {
        var length = ol.Sphere.getLength(line);
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
        }
        return output;
    },
    formatArea: function (polygon) {
        var area = ol.Sphere.getArea(polygon);
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
        }
        return output;
    },
    addInteraction: function () {
        if (ol3_layerHelper.getLayerById(map, "measureLayer").getSource()) {
            ol3_layerHelper.getLayerById(map, "measureLayer").getSource().clear();
        }

        if ($('#measureType_ option:selected').val() != "none") {
            var type = ($('#measureType_ option:selected').val() == 'area' ? 'Polygon' : 'LineString');
            measure.draw = new ol.interaction.Draw({
                source: measure_source,
                type: type,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    })
                })
            });
            map.addInteraction(measure.draw);
            measure.createMeasureTooltip();
            var listener;
            measure.draw.on('drawstart',
                function (evt) {
                    if (ol3_layerHelper.getLayerById(map, "measureLayer").getSource()) {
                        ol3_layerHelper.getLayerById(map, "measureLayer").getSource().clear();
                    }

                    measure.sketch = evt.feature;
                    var tooltipCoord = evt.coordinate;
                    listener = measure.sketch.getGeometry().on('change', function (evt) {
                        var geom = evt.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = measure.formatArea(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = measure.formatLength(geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        measure.measureTooltipElement.innerHTML = output;
                        measure.measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);

            measure.draw.on('drawend',
                function () {
                    measure.measureTooltipElement.className = 'tooltip tooltip-static';
                    measure.measureTooltip.setOffset([0, -7]);
                    measure.sketch = null;
                    ol.Observable.unByKey(listener);
                }, this);
        } else {
            map.un('pointermove', measure.pointerMoveHandler);
            measure.measureTooltip.setPosition(undefined);
            measure.helpTooltip.setPosition(undefined);
            map.getViewport().removeEventListener('mouseout', measure.test1);
            map.un('pointermove', measure.pointerMoveHandler);
            map.un('pointermove', measure.pointerMoveHandler);
            map.un('pointermove', measure.pointerMoveHandler);
        }
    },
    createHelpTooltip: function () {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'tooltip hidden';
        this.helpTooltip = new ol.Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map.addOverlay(this.helpTooltip);
    },
    createMeasureTooltip: function () {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new ol.Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(this.measureTooltip);
    }
}


$("#measureType_").change(function () {
    if (measure.draw) {
        map.removeInteraction(measure.draw);
    }
    map.on('pointermove', measure.pointerMoveHandler);
    map.getViewport().addEventListener('mouseout', measure.test1);
    measure.addInteraction();
})
/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt The event.
 */
var pointerMoveHandler_draw = function (evt) {
    if (evt.dragging) {
        return;
    }
    map.getOverlayById("pop_draw").setPosition(evt.coordinate);
};
  
 
