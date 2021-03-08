var drawPolygenAnalysis = {
	remove: function() { //移除已经存在的ol.interaction.Draw
		var draw = gisCommon.getDrawInteraction(map);
		map.removeInteraction(draw);
	},
	add: function(type) { //添加一个新的ol.interaction.Draw,用于绘制任意面
		if(type !== 'undefined' && type != undefined) {
			$("#pop_draw").text("鼠标按住拖拽，松开结束绘制！");
			map.on('pointermove', pointerMoveHandler_draw);
			var geometryFunction;
			if(type === 'Box') {
				type = 'Circle';
				geometryFunction = ol.interaction.Draw.createBox();
			}
			var draw = new ol.interaction.Draw({
				source: this.source,
				type: type,
				freehand: true,
				geometryFunction: geometryFunction,
				style: this.style
			});
			map.addInteraction(draw);
			draw.on('drawend',
				function(evt) {
					console.log(evt);
					let feature1 = evt.feature;
					let geo = feature1.getGeometry()
					let layer = ol3_layerHelper.getLayerById(map,'qpfGridLayer');
					var fts = [];
					if(layer){
						let features = layer.getSource().getFeatures();
						$.each(features, function (i, f) {
							var fgeom = f.getGeometry().A;
							if (geo.intersectsCoordinate(fgeom)) {
								fts.push(f);
							}
						});
					}
					changeFeatures = fts;
					$('#changeValue').show();
				}, this);
		} else {
			map.un('pointermove', pointerMoveHandler_draw);
			map.getOverlayById("pop_draw").setPosition(undefined);
		}
	},
	click: function() { //给功能标签添加点击事件
		this.createDrawLayer();

		//$("#map").css({"cursor":"Crosshair"});
		$(".toolPop .e-items ul li div").click(function() {
			$("#pop_draw").addClass("tooltip");
			var flag = $(this).hasClass("selectedDiv");
			if(flag) {
				$(this).removeClass("selectedDiv");
			} else {
				if($('.circleBarActive >li').text()=='一般信息'){

				}else if($('.circleBarActive >li').text()=='靶向预警'){
                    var disasterCode =$("#disasterCode1").val();
                    var level=$("#circleGrade .nthTdactive").attr("data-key");
                    if(disasterCode ==null || disasterCode ==""){
                        alert("请先选择灾种");
                        return ;
                    }else if(level ==null  || level ==undefined || level ==''){
                        alert("请选择灾种级别");
                        return ;
                    }
                }
                $(this).addClass("selectedDiv").parent().siblings("li").find('div').removeClass("selectedDiv");
            }

			if($(this).hasClass("undo")) {
				// drawPolygenAnalysis.clearFeatures(); //这个this指的是div元素
				if(changeFeatures.length>0){
					for(let i=0;i<changeFeatures.length;i++){
						let lastValue = changeFeatures[i].get('lastValue');
						changeFeatures[i].set('value',lastValue);
						changeFeatures[i].set('lastValue','');
					}
				}
				changeFeatures = [];
			} else if($(this).hasClass("delete")) {
				drawPolygenAnalysis.clearAllFeatures();
			}

			var type = $(".toolPop .selectedDiv").attr("type");
			if(type == "Circle") {
				$(".circle-box").show();
				drawPolygenAnalysis.addMapOn();
			} else {
				$(".circle-box").hide();
				map.un('pointermove', this.pointerMoveHandler);
				map.un('click', this.addStartEvent);
				map.getOverlayById("pop_draw").setPosition(undefined);
			}
			drawPolygenAnalysis.remove();
			drawPolygenAnalysis.add(type);

		})
	},
	clearFeatures: function() { //清除绘制的面
		var drawLayer = ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer");
		if(drawLayer) {
			var features = drawLayer.getSource().getFeatures();
			if(features.length == 0) {
				return;
			}
			drawLayer.getSource().removeFeature(features[features.length - 1])
		}
	},
	clearAllFeatures: function() { //清除所有绘制的面
		var drawLayer = ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer");
		if(drawLayer) {
			drawLayer.getSource().clear();
		}
	},
	createDrawLayer: function() { //创建绘制的图层
		var vector = new ol.layer.Vector({
			source: this.source,
			style: this.style,
			zIndex: 2
		});
		vector.set("layerid", "drawPolygenAnalysisLayer") //设置矢量图层的layerid，用于查找该图层
		map.addLayer(vector);
		// vector.on("change", changeDrawPolygenAnalysisLayer);
	},
	style: function() {
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 0, 0, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: '#ffcc33',
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
	},
	source: new ol.source.Vector(),
	createCircle: function(origin, radius) {
		return new ol.geom.Circle(origin, radius);
	},
	addMapOn: function() {
		$(".form-radio+label").click(function() {
			var val = $(this).siblings("input").val();
			if(val == "自定义") {
				drawPolygenAnalysis.remove();
				drawPolygenAnalysis.add("Circle");
				map.un('pointermove', drawPolygenAnalysis.pointerMoveHandler);
				map.un('click', drawPolygenAnalysis.addStartEvent);
				map.getOverlayById("pop_draw").setPosition(undefined);
			} else {
				drawPolygenAnalysis.remove();
				$("#pop_draw").text("鼠标点击，以绘制半径为" + val + "km的圆。");
				map.on('pointermove', drawPolygenAnalysis.pointerMoveHandler);
				map.on('click', drawPolygenAnalysis.addStartEvent);
			}
		})
	},
	addStartEvent: function(evt) {
		var val = $(".form-radio:checked+label").siblings("input").val();
		var coordinate = evt.coordinate;
		var geom = drawPolygenAnalysis.createCircle(coordinate, val * 1000); //this竟然不指向drawPolygenAnalysis
		var startC = new ol.Feature(geom);
		var drawLayer = ol3_layerHelper.getLayerById(map, "drawPolygenAnalysisLayer");
		if(drawLayer) {
			drawLayer.getSource().addFeature(startC);
			$("#circle").show();
		}

	},
	pointerMoveHandler: function(evt) {
		if(evt.dragging) {
			return;
		}
		map.getOverlayById("pop_draw").setPosition(evt.coordinate);
	},
}



//数据表格展示

var pointerMoveHandler_draw = function (evt) {
    if (evt.dragging) {
        return;
    }
    map.getOverlayById("pop_draw").setPosition(evt.coordinate);
};
function changeGridValue(){
	let value = $('#gridValue').val();
	if(value!=''){
		if(changeFeatures.length>0){
			for(let i=0;i<changeFeatures.length;i++){
				let lastValue = changeFeatures[i].get('value');
				changeFeatures[i].set('value',value);
				changeFeatures[i].set('lastValue',lastValue);
			}
			let oldLayer = ol3_layerHelper.getLayerById(map,'drawPolygenAnalysisLayer');
			if(oldLayer){
				oldLayer.getSource().clear();
				// oldLayer.change();
			}
		}
		$('#gridValue').val('');
		$('#changeValue').hide();
	}else{
		alert('请输入数值');
	}
}
function closeChangeGridValue(){
	$('#gridValue').val('');
	$('#changeValue').hide();
}