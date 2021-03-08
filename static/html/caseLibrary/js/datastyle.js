//渔场线style
function fishingGroundStyle(feature){
	let name=feature.values_.UDATE;
	let flag=feature.values_.FLAG;
	let offsetX;
	let offsetY;
	if(flag==1){
		offsetX=30;
		offsetY=30;
	}else if(flag==2||flag==3){
		offsetX=-30;
		offsetY=-30;
	}
	let style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'purple',
			weight: 2
		}),
		text: new ol.style.Text({
			text: name,
			fill: new ol.style.Fill({
				color: '#8ec1ff'
			}),
			offsetX:offsetX,
			offsetY:offsetY
		})
	});
	return [style];
}
function dataStyle(f){
	let code;
	if(f.get("code")==undefined){
		 let features=f.get("features");
		 code=features[0].get('code');
	}else{
		 code = f.get("code");
	}
	let img = config.dataLayerInfos[code].icon
	let style = new ol.style.Style({
		image: new ol.style.Icon({
			src: img,
		})
	});
	return [style];

}
function generalUserStyle(feature, r){
	var style = new ol.style.Style({
		image: new ol.style.Icon({
			src: './images/general_user.png'
		})
	});
	return [style];
}
//选中的）要素样式
function styleSelect(feature, res) {
	if(feature.getGeometry().getType() === "MultiPolygon") {
		return heatMapBoundaryStyleSelected(feature);
	}
	var layerid = feature.get("layerid");
	if(!layerid){
		layerid = feature.getGeometry().get('layerid');
	}
	var style = ol3_layerHelper.getLayerById(map, layerid).getStyle();
	var style1 = style.apply(feature, [feature]);
	if(layerid === "pollutantFactorySiteLayer") {
		var pollutantFactorySiteLayerSelect = new ol.style.Style({

			text: new ol.style.Text({
				text: feature.get("unitName") + " ",
				font: "12px Times New Roman",
				fill: new ol.style.Fill({
					color: "#f00"
				}),
				offsetY: 22,
				stroke: new ol.style.Stroke({
					color: "#fff",
					width: 3
				})
			})
		});
		style1.push(pollutantFactorySiteLayerSelect);
	}
	if(layerid.indexOf('mapBaseLayer')>=0 || layerid.indexOf('industryLayer')!=-1){
	}else{

		//台风样式
		var windforce = feature.get("windforce");
		if(windforce) {
			//return style1;
			var windforce = parseInt(feature.get('windforce'));
			var color = typhoonGrade(windforce);
			if(feature.getGeometry().getType() == 'LineString') {
				var style = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: "black",
						width: 2
					})
				});
				feature.setStyle(style);
			};
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({
						color: color[0]
					}),
				}),
			})
		}
		//其他十二类图标样式
		var canvas = document.createElement('canvas');

		var ctx = canvas.getContext('2d');
		var img = new Image();
		if(!feature.get("imageSrc")){
			img.src = feature.getGeometry().get("imageSrc");
		}else{
			img.src = feature.get("imageSrc");
		}
		var jiaodu = feature.get("imageSrcAngle");
		//img.onload = function() {   //图片已经加载过了，所以注释掉
		// 打印
		var bordar = img.width > img.height ? img.width : img.height;
		if(img.width == 0 || img.height==0){
			bordar = 45;
		}
		bordar = bordar + 10;
		canvas.width = bordar;
		canvas.height = bordar;
		var x = bordar / 2 - img.width / 2;
		var y = bordar / 2 - img.height / 2;
		//ctx.drawImage(img,x,y);//画图片
		/**绘制四个角开始**/
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(bordar / 3, 0);

		ctx.moveTo(2 * bordar / 3, 0);
		ctx.lineTo(bordar, 0);

		ctx.moveTo(bordar, 0);
		ctx.lineTo(bordar, bordar / 3);

		ctx.moveTo(bordar, 2 * bordar / 3);
		ctx.lineTo(bordar, bordar);

		ctx.moveTo(bordar, bordar);
		ctx.lineTo(2 * bordar / 3, bordar);

		ctx.moveTo(bordar / 3, bordar);
		ctx.lineTo(0, bordar);

		ctx.moveTo(0, bordar);
		ctx.lineTo(0, 2 * bordar / 3);

		ctx.moveTo(0, bordar / 3);
		ctx.lineTo(0, 0);
		ctx.closePath(); //闭合路径
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255,0,0,0.8)';
		ctx.stroke();

		//如果是风的话显示，否则隐藏
		ctx.translate(bordar / 2, bordar / 2); //更改canvas的坐标原点
		ctx.save();
		if(jiaodu) {
			ctx.rotate(Math.PI / 180 * parseFloat(jiaodu)) //指定风向的旋转角度
		}

		//以Canvas画布上的平移后的坐标(-10,-10)为起始点，绘制图像，转换前的（50,20），相当于转换后的（-10,-10）
		ctx.drawImage(img, -img.width / 2, -img.height / 2);
		// ctx.restore();
		/**绘制四个角并设置样式结束**/
			//}

		var canvasStyle = new ol.style.Style({
				image: new ol.style.Icon({
					img: canvas,
					imgSize: [canvas.width, canvas.height],
					rotation: 0
				})

			});
		style1.push(canvasStyle);
	}
	return style1;
}
function industryStyle(ft){
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius:5,
			fill: new ol.style.Fill({
				color: "blue"
			}),
			stroke: new ol.style.Stroke({
				color: "black",
				width: 1
			}),
		}),

	});
}
function stationDisasterFxStyle(ft){
	let vl=$('.move_img_active').attr("t");
	let thisValue;
	if(vl=='0'){
		thisValue=ft.values_.riskLevel_0h;
	}else if(vl=='1'){
		thisValue=ft.values_.riskLevel_1h;
	}else if(vl=='3'){
		thisValue=ft.values_.riskLevel_3h;
	}else if(vl=='6'){
		thisValue=ft.values_.riskLevel_6h;
	}else if(vl=='12'){
		thisValue=ft.values_.riskLevel_12h;
	}else if(vl=='24'){
		thisValue=ft.values_.riskLevel_24h;
	}else if(vl=='48'){
		thisValue=ft.values_.riskLevel_48h;
	}
	let color="rgba(255,255,255,0)";
	if(thisValue==1){
		color="red";
	}else if(thisValue==2){
		color="oranage";
	}else if(thisValue==3){
		color="yellow";
	}else if(thisValue==4){
        color="blue";
	}
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius:5,
			fill: new ol.style.Fill({
				color: color
			}),
			stroke: new ol.style.Stroke({
				color: "black",
				width: 0.5
			}),
		}),
		/*text: new ol.style.Text({
			text: thisValue,
			fill: new ol.style.Fill({
				color: '#ffffff'
			}),
			offsetX:30,
			offsetY:30
		})*/

	});
}
//防灾减灾灾害分级防御
function HPIINFOStyle(feature) {
	var dis_arr = $("#fjfy .active");
	var dis = [];
	$.each(dis_arr, function(i, f) {
		dis.push($(f).attr("data-code"));
	});

	var name = feature.get('properties').name;
	var DisasterType = feature.get('properties').DisasterType;
	var AreaCode = feature.get('properties').AreaCode;
	var color;
	if(name == '早期监视区') {
		color = 'orange';
	} else if(name == '临界警戒区') {
		color = 'yellow';
	} else {
		color = 'red';
	}
	var style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: color,
			width: 2
		}),
		fill: new ol.style.Fill({
			color: color,
		})
	});
	//if(dis.includes(DisasterType)) {
	return [style];
	//}

}
//天地图图层数据（面）
function tdtPolygonStyle(feature) {
	var style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'red',
			width: 1
		}),
		fill: new ol.style.Fill({
			color: "blue",
		}),
		text: new ol.style.Text({
			text: feature.get('properties').name,
			fill: new ol.style.Fill({
				color: '#ffffff'
			})
		})
	});
	return [style];
}
//天地图图层数据（线）
function tdtLineStyle(feature) {
	var style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: '#5197FF',
			width: 3
		}),
		text: new ol.style.Text({
			text: feature.get('properties').name,
			fill: new ol.style.Fill({
				color: '#fff148'
			})
		})
	});
	return [style];
}
//防灾减灾地图主图
function MMINFOStyle(feature) {
	var dis_arr = $(".warningIcon .selectActive");
	var dis = [];
	$.each(dis_arr, function(i, f) {
		dis.push($(f).attr("data-code"));
	});

	var name = feature.get('properties').name;
	var DisasterType = feature.get('properties').DisasterType;
	var areaCode = feature.get("properties").AreaCode;
	var color;


	var lastSelectAreaCode = $("#disProvince").val();
	if($("#disCity").val() !=''){
		lastSelectAreaCode = $("#disCity").val();
	}
	if($("#disCounty").val() !=''){
		lastSelectAreaCode =$("#disCounty").val()
	}
	if(name == '气象防灾减灾重点区域') {
		color = 'orange';
	} else {
		color = 'red';
	}
	var style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: color,
			width: 2
		}),
		fill: new ol.style.Fill({
			color: color,
		})
	});

	if(dis.includes(DisasterType) && areaCode ==lastSelectAreaCode ) {
		return [style];
	}

}
function disasterStyle(ft){
	var img = '';
	let fileType = '';
	let fileData = ft.get('disasterAnnex');
	if(fileData){
		fileData = fileData[0];
		fileType = fileData.fileType;//文件类型
	}
	if (fileType!='' && (fileType.indexOf(".jpg")!=-1 || fileType.indexOf(".png")!=-1 ||
		fileType.indexOf(".gif")!=-1 || fileType.indexOf(".tif")!=-1 ||
		fileType.indexOf(".bmp")!=-1 || fileType.indexOf("image/jpeg")!=-1 ||
		fileType.indexOf(".img")!=-1)){
		img = fileData.fileUrl;
	}
	// else if (fileType.equals(".mp4") || fileType.equals(".mp3") ||
	// 	fileType.equals(".mpg") || fileType.equals(".wmv") ||
	// 	fileType.equals(".wav") || fileType.equals(".avi") ||
	// 	fileType.equals(".mid") || fileType.equals("video/mp4")){
	// 	annexFileUrl.get(a).setFileTypeNum("2");
	// }else {
	// 	annexFileUrl.get(a).setFileTypeNum("3");
	// }
	if(img!=''){//当前为图片时
		return new ol.style.Style({
			image: new ol.style.Icon({
				opacity:1,
				scale:0.1,
				src: img
			})

		})
	}else{//当前为视频时
		return new ol.style.Style({
			image: new ol.style.Icon({
				opacity:1,
				// scale:0.2,
				src: './images/demage.png'
			})

		})
	}
}
function highwayStyle(ft){
	let name = ft.get('Name');
	let zoom = map.getView().getZoom();
	if(zoom>=10){

		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: 3,
				color: "orange"
			}),
			text: new ol.style.Text({
				text: name,
				font: "600 13px 宋体",
				fill: new ol.style.Fill({
					color: 'rgb(10,56,57)'
				}),
				// textAlign: "center",
				textBaseline: "middle"
			})
		});
	}else{
		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				width: 3,
				color: "orange"
			})
		});
	}
}
function alarmWarnLayerStyle(f){
	f.set("layerid","alarmWarnLayer")
	let color = f.get('color');
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius:3,
			fill: new ol.style.Fill({
				color: color
			}),
		}),
		fill: new ol.style.Fill({
			color: color
		}),

	});

}
function warningStyle(f) {
	var eventType = f.get("eventType")
	var level = f.get("severity");
	level = level.toUpperCase();
	var imgUrl = "./images/featureImage/warnImg/" + eventType + "_" + level.toUpperCase() + ".jpg";
	let scale = 0.3;
	if(eventType=='Unknown'){
		imgUrl = './images/featureImage/warnImg/common_UNKNOWN.jpg';
	}else{
		imgUrl = "./images/featureImage/warnImg/" + eventType + "_" + level.toUpperCase() + ".jpg";
		let status = fileExists(imgUrl);
		if(!status){
			imgUrl = "./images/featureImage/warnImg/common_" + level.toUpperCase() + ".jpg";
			scale = 1;
		}
	}
	f.set('imageSrc',imgUrl);
	let returnStyle = [];
	var s = new ol.style.Style({
		image: new ol.style.Icon({
			src: imgUrl,
			scale: scale
		})
	});
	returnStyle.push(s);
	let isSelect = f.get('isSelect');
	if(isSelect && isSelect=='1'){
		var canvas = document.createElement('canvas');

		var ctx = canvas.getContext('2d');
		var img = new Image();
		img.src = imgUrl;
		//img.onload = function() {   //图片已经加载过了，所以注释掉
		// 打印
		var bordar = img.width > img.height ? img.width : img.height;
		if(img.width == 0 || img.height==0){
			bordar = 45;
		}
		bordar = bordar + 10;
		canvas.width = bordar;
		canvas.height = bordar;
		var x = bordar / 2 - img.width / 2;
		var y = bordar / 2 - img.height / 2;
		//ctx.drawImage(img,x,y);//画图片
		/**绘制四个角开始**/
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(bordar / 3, 0);

		ctx.moveTo(2 * bordar / 3, 0);
		ctx.lineTo(bordar, 0);

		ctx.moveTo(bordar, 0);
		ctx.lineTo(bordar, bordar / 3);

		ctx.moveTo(bordar, 2 * bordar / 3);
		ctx.lineTo(bordar, bordar);

		ctx.moveTo(bordar, bordar);
		ctx.lineTo(2 * bordar / 3, bordar);

		ctx.moveTo(bordar / 3, bordar);
		ctx.lineTo(0, bordar);

		ctx.moveTo(0, bordar);
		ctx.lineTo(0, 2 * bordar / 3);

		ctx.moveTo(0, bordar / 3);
		ctx.lineTo(0, 0);
		ctx.closePath(); //闭合路径
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255,0,0,0.8)';
		ctx.stroke();

		//如果是风的话显示，否则隐藏
		ctx.translate(bordar / 2, bordar / 2); //更改canvas的坐标原点
		ctx.save();

		//以Canvas画布上的平移后的坐标(-10,-10)为起始点，绘制图像，转换前的（50,20），相当于转换后的（-10,-10）
		ctx.drawImage(img, -img.width / 2, -img.height / 2);
		// ctx.restore();
		/**绘制四个角并设置样式结束**/
			//}

		var canvasStyle = new ol.style.Style({
				image: new ol.style.Icon({
					img: canvas,
					imgSize: [canvas.width, canvas.height],
					rotation: 0
				})

			});
		returnStyle.push(canvasStyle);
	}
	return returnStyle;

}
/**获取风向的图片
 * @param {Object} windv
 */
function getimageurl(windv) {
	var windvfloat = parseFloat(windv);
	var result = "images/wind/";
	if(isNaN(windvfloat) || windvfloat >= 0 & windvfloat <= 0.3)
		result = result + "wind0.png";
	if(windvfloat > 0 & windvfloat <= 1)
		result = result + "wind1.png";
	if(windvfloat > 1 & windvfloat <= 2)
		result = result + "wind2.png";
	if(windvfloat > 2 & windvfloat <= 4)
		result = result + "wind3.png";
	if(windvfloat > 4 & windvfloat <= 6)
		result = result + "wind4.png";
	if(windvfloat > 6 & windvfloat <= 8)
		result = result + "wind5.png";
	if(windvfloat > 8 & windvfloat <= 10)
		result = result + "wind6.png";
	if(windvfloat > 10 & windvfloat <= 12)
		result = result + "wind7.png";
	if(windvfloat > 12 & windvfloat <= 14)
		result = result + "wind8.png";
	if(windvfloat > 14 & windvfloat <= 16)
		result = result + "wind9.png";
	if(windvfloat > 16 & windvfloat <= 20)
		result = result + "wind10.png";
	if(windvfloat > 20 & windvfloat <= 24)
		result = result + "wind11.png";
	if(windvfloat > 24 & windvfloat <= 28)
		result = result + "wind12.png";
	if(windvfloat > 28 & windvfloat <= 32)
		result = result + "wind13.png";
	if(windvfloat > 32 & windvfloat <= 40)
		result = result + "wind14.png";
	if(windvfloat > 40 & windvfloat <= 50)
		result = result + "wind15.png";
	if(windvfloat > 50)
		result = result + "wind16.png";

	return result;
}
function liveDataStyle(ft){
	let f=ft.get('features')[0];
	if(selectEleType=='windv'){//展示风向标
		let windd = f.get('windd');
		let windv = f.get('windv');
		var text = f.get(selectEleType);
		if(parseFloat(windv)>0 && parseFloat(windv)<99){
			let imgUrl = getimageurl(windv);
			let rotate = Math.PI / 180 * parseFloat(windd);
			return new ol.style.Style({
				image:new ol.style.Icon({
					rotation:rotate,
					scale:1.5,
					src:imgUrl
				}),
				text: new ol.style.Text({
					text:text.indexOf(".")>=0?text:" "+text+" ",
					font: 'normal 300 13px sans-serif ',
					fill: new ol.style.Fill({
						color: "black"
					}),
					stroke: new ol.style.Stroke({
						color: "black",
						width: 1
					}),
					textAlign: 'center',
					textBaseline: 'bottom',
					rotateWithView: true
				})
			})
		}
	}else{
		var text = f.get(selectEleType);
		if(!isNaN(parseFloat(text)) && parseFloat(text)<99999){
			let color = 'rgba(255,255,255,0)';
			let typeUse = selectEleType+'Use';
			let colorLegend = config.render[typeUse];
			for(var i=0;i<colorLegend.length;i++){
				var cp= colorLegend[i];
				var colors = cp.color;
				//-30,-28,"#071E78"
				var cs = colors;
				if("min"==cs[0] &&   parseFloat(text)<=parseFloat(cp.value)) {
					color=cs[2];
					break;
				}else if("max"==cs[1] &&parseFloat(text) >=parseFloat(cp.value) ){
					color=cs[2];
					break
				} else if(parseFloat(text)>=parseFloat(cs[0]) && parseFloat(text)<parseFloat(cs[1])){
					color= cs[2];
					break;
				}
			}
			return new ol.style.Style({
				image: new ol.style.RegularShape({
					radius:6,
					points:4,
					fill: new ol.style.Fill({
						color: color
					}),
					stroke: new ol.style.Stroke({
						color: "black",
						width: 1
					}),
				}),
				text: new ol.style.Text({
					text:text.indexOf(".")>=0?text:" "+text+" ",
					font: 'normal 300 13px sans-serif ',
					fill: new ol.style.Fill({
						color: "black"
					}),
					stroke: new ol.style.Stroke({
						color: "black",
						width: 1
					}),
					textAlign: 'center',
					textBaseline: 'bottom',
					rotateWithView: true
				})

			});
		}
	}
}
function apiStyle(ft) {
	let f=ft.get('features')[0];
	let color;
	let aqiValue=f.values_.Aqi;
	if(aqiValue==null||aqiValue==''){
		color = 'rgba(255,255,255,0)';
	}else{
		color = 'rgba(33,248,16,0.29)';
		return new ol.style.Style({
			"fill": new ol.style.Fill({
				"color": color
			}),
			"stroke": new ol.style.Stroke({
				"color": 'rgba(0, 0, 0, 0.5)',
				"lineDash": [10, 10],
				"width": 2
			}),
			"image": new ol.style.Circle({
				"radius": 5,
				"stroke": new ol.style.Stroke({
					"color": 'rgba(0, 0, 0, 0.7)'
				}),
				"fill": new ol.style.Fill({
					"color": color
				})
			}),
			"text": new ol.style.Text({
				text:aqiValue,
				font: 'normal 300 13px sans-serif ',
				fill: new ol.style.Fill({
					color: "black"
				}),
				stroke: new ol.style.Stroke({
					color: "black",
					width: 1
				}),
				textAlign: 'center',
				textBaseline: 'bottom',
				rotateWithView: true
			})
		});
	}
}
function lineStyle(ft){
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			width: 3,
			color: 'yellow'
		}),
	});
}
function forecastLineStyle(ft){
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			width: 2,
			color: 'red',
			lineDash:[1,2,3,4,5,6],
		}),
	});
}
function typhoonPointDataStyle(ft){
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius:4,
			fill: new ol.style.Fill({
				color: 'yellow'
			}),
		})
	})
}
//热力图区域选中边界样式
function heatMapBoundaryStyleSelected(f){
	var id = f.get("id");
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			width: 5,
			color: 'red'
		}),
		/*	text:new ol.style.Text({
            text:" "+id,
            })*/
	});
}
