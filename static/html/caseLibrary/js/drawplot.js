const ol = POL.OL;
let drawLayer;
let drawFeature;
function Draw(map){
		drawLayer = new POL.PlottingLayer(map);
		drawLayer.on(POL.FeatureOperatorEvent.ACTIVATE, function (e) {
			//激活状态
			drawFeature = e.feature_operator;
			let objs = $('.spanActive');
			var size;
			for(let i=0;i<objs.length;i++){
				if($(objs[i]).attr('class').indexOf('size-c')>=0){
					var type = $(objs[i]).attr('type');
					size = type;
					break;
				}
			}
			var  a = {
				"o-size": 1,
				"t-size": 3,
				"td-size": 5
			};
			var bc = $($('.mapToolColor li')[0]).css('background-color');
			var styleObj = {
				'fill':{
					"color": "rgba(0,255,0,0.2)"
				},
				'stroke':{
					'color':bc,
					'width':a[size]
				}
			}
			drawFeature.setStyle(styleObj);
			var thisFeature = drawFeature;
			var nowObj = {
				'drawType':'graph',
				'operate':'add',
				'feature':thisFeature
			}
			addStack.push(nowObj);
		});
		drawLayer.on(POL.FeatureOperatorEvent.DEACTIVATE,function(e){
			drawFeature =null;
		});
}
Draw.prototype.getDrawLayer =function(){
	return  drawLayer;
}
//开始绘制
Draw.prototype.startDraw= function(type){
	drawLayer.addFeature(type);
	operateOrder.push('add');
}
Draw.prototype.removeFeature = function(){
	if(!drawFeature){
		alert("请选中要删除的要素");
		return ;
	}
	var thisFeature = drawFeature;
	console.log(thisFeature);
	operateOrder.push('delete');
	var nowObj = {
		'drawType':'graph',
		'operate':'delete',
		'num':1,
		'feature':thisFeature
	}
	deleteStack.push(nowObj);
	drawLayer.removeFeature(drawFeature);
}
Draw.prototype.getSelectFeature = function(){
	if(!drawFeature){
		alert("请选中要素");
		return ;
	}
	return drawLayer.feature;
}
function undo(){
	var operator;
	if(operateOrder.length>0){
		operator = operateOrder[operateOrder.length-1]
		if(operator=='add'){//与存储的步骤执行相反的操作
			var addobj = addStack[addStack.length-1];
			var drawType = addobj.drawType;
			if(drawType=='graph'){
				drawLayer.removeFeature(addobj.feature);
			}else{
				drawTextLayer.getSource().removeFeature(addobj.feature);
			}
			addStack.pop();
		}else if(operator=='delete'){
			var delobj = deleteStack[deleteStack.length-1];
			var num = delobj.num;
			if(num<2){
				var drawType = delobj.drawType;
				if(drawType=='graph'){
					drawLayer.addFeature(delobj.feature);
				}else{
					drawTextLayer.getSource().addFeature(delobj.feature);
				}
			}else{//撤销全部移除的操作

			}
			deleteStack.pop();
		}
		operateOrder.pop();//删除这步操作
	}
}
var measure_source = new ol.source.Vector(); //测距绘制的和现实的绘制图层用同一个source，不然不显示
var measure = {
	vector: new ol.layer.Vector({
		source: measure_source,
		layerid: "measureLayer",
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
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