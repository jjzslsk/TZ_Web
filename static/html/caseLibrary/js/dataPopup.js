function showIndustryInfo(ft){
    // let name = ft.name || '';
    let lon = ft.Lon || '';
    let lat = ft.Lat || '';
    let OrgunitName = ft.OrgunitName || '';
    ft.geometry.set('layerid','industryLayer');
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 100%;"><span>名称:</span> <span>${OrgunitName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
    return {
        title: '',
        content: ""
    };
}
function showMapBaseInfo(ft){
    let name = ft.name ||''; //中小河流名称

    let lon = ft.Lon ||''; //经度
    let lat = ft.Lat ||''; //纬度
    let type = ft.TypeName ||''; //
    let phone = ft.Phone ||''; //
    let address = ft.Address ||''; //
    let typeCode = ft.TypeCode || '';
    ft.geometry.set('layerid',typeCode+'mapBaseLayer');
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 100%;"><span>名称:</span> <span>${name}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>类型:</span> <span>${type}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>电话:</span> <span>${phone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 100%;">  <span>地址:</span> <span>${address}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
    return {
        title: '',
        content: ""
    };
}
function showAlarmData(ft){
    let lon = ft.longitude ||''; //经度
    let lat = ft.latitude ||''; //纬度
    let stationName = ft.stationName || '';
    let stationNum = ft.warnPoint || '';
    let warnList = ft.warnList;
    let popupContent = $('#dataPopupContent').empty();
    $(`<div class="popupPlaceName">站点:<span>${stationName}(${stationNum})</span>`).appendTo(popupContent);
    $(`<ul class="tableHead table"><li><span>报警要素</span><span>阈值</span><span>报警值</span></li></ul>`).appendTo(popupContent);
    for(let i=0;i<warnList.length;i++){
        let criticalValue = warnList[i].criticalValue;//阈值
        let warnValue = warnList[i].warnValue;//具体值
        let eleName = warnList[i].eleName;//报警要素
        let measurEment = warnList[i].measurEment;//单位
        $(`<ul class="tableBody table"><li><span>${eleName}(${measurEment})</span><span>${criticalValue}</span><span>${warnValue}</span></li></ul>`).appendTo(popupContent);
    }
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    alarmWarnOverlay.setPosition(point);
    restDataPopupMargin()
    return {
        title: '',
        content: ""
    };
}
function getDataInfo(ft){
    let code;
    let id;
    if(ft.code==undefined) {
        let features=ft.features;
         code = features[0].get('code');
         id = features[0].get('Id');
        if(id==undefined){
            id = features[0].get('id');
        }
    }else{
        code=ft.code;
         id = ft.id;
        if(id==undefined){
            id = ft.Id;
        }
    }
   /* */
    //let industryCode = ft.industryCode;
    let layerid = config.dataLayerInfos[code].layerId;
    let icon = config.dataLayerInfos[code].icon;
    var param = {
        tableDesc:code,
        id:id
    }
    // ft.layerid = layerid;
    ft.geometry.set('layerid',layerid);
    ft.geometry.set('imageSrc',icon);
    const baseParam = config.api.baseDataParam;
    baseParam.interfaceCode = 'M0035';
    // dataCode = code;
    if (param) {
        baseParam.params = JSON.stringify(param);
    }
    $.ajax({
        type: "get",
        cache: false,
        // async: false,
        data: baseParam,
        url: config.api.baseUrl,
        dataType: 'JSON',
        success: function (result) {
            var data = result.data[0].data;
            var nowCode = result.data[0].tableDesc;//当前展示的
            openPopup(data,nowCode);
        }
    })
    return {
        title: '',
        content: ""
    };
}
function openPopup(data,code) {
    if (code == 'M0001') {
        biInfoPopup(data);
    } else if (code == 'M0002') {
        mfrInfoPopup(data);
    } else if (code == 'M0003') {
        geologicahazardPopup(data);
    } else if (code == 'M0004') {
        waterBlackSpotPopup(data);
    } else if (code == 'M0005') {
        forestFirePopup(data);
    } else if (code == 'M0006') {
        constructionPopup(data);
    } else if (code == 'M0007') {
        populationPopup(data);
    } else if (code == 'M0008') {
        touristSpotPopup(data);
    } else if (code == 'M0009') {
        hospitalPopup(data);
    } else if (code == 'M0010') {
        schoolPopup(data);
    } else if (code == 'M0011') {
        reservoirPopup(data);
    } else if (code == 'M0012') {

    } else if (code == 'M0013') {

    } else if (code == 'M0014') {
        feInfoPopup(data);
    } else if (code == 'M0015') {
        meteorologicalPopup(data);
    } else if (code == 'M0016') {
        dangerPointPopup(data);
    } else if (code == 'M0017') {
        rescueForcePopup(data);
    } else if (code == 'M0018') {
        expertPopup(data);
    } else if (code == 'M0019') {
        meteorologicalPopup(data);
    } else if (code == 'M0020') {
        dsInfoPopup(data);
    } else if (code == 'M0025') {
        gridPerInfoPopup(data);
    } else if (code == 'M0024') {
        rpInfoPopup(data);
    } else if (code == 'M0026') {
        miInfoPopup(data);
    }
}
function hospitalPopup(feature){
    // let coor =feature.getGeometry().getCoordinates();
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//名称
    let hospitalLevel = feature[0].HospitalLevel || ''; //医院等级
    let lon = feature[0].Lon || ''; //经度
    let hospitalName = feature[0].HospitalName || ''; //医院名称
    let lat = feature[0].Lat || ''; //纬度
    let mobilePhone = feature[0].MobilePhone || ''; //电话
    let contact = feature[0].Contact || ''; //联系人
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="padding: 5px 0 ;"><span>名称:</span> <span>${hospitalName}</span></li>`).appendTo(dataInfoUl);


    $(`<li style="float: left;width: 50%;">  <span>医院等级:</span> <span>${hospitalLevel}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $("#dataPopup").css("width","450px")
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}


function schoolPopup(feature){
    // let coor =feature.getGeometry().getCoordinates();
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//名称
    let schoolType = feature[0].SchoolType || ''; //学校类型
    let schoolName = feature[0].SchoolName || ''; //学校名称
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let mobilePhone = feature[0].MobilePhone || ''; //电话
    let contact =feature[0].Contact || ''; //联系人
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="padding: 5px 0 ;"><span>学校名称:</span> <span>${schoolName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>学校类型:</span> <span>${schoolType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    $("#dataPopup").css("width","450px")
    dataPopupOverlay.setPosition(point);

    restDataPopupMargin()
}

function reservoirPopup(feature){

    // let coor =feature.getGeometry().getCoordinates();
    let reservoirName =feature[0].ReservoirName || ''; //水库名称
    let capacity = feature[0].Capacity || ''; //水库总库容   单位：亿立方米
    let contact = feature[0].Contact || ''; //联系人
    let mobilePhone = feature[0].MobilePhone || ''; //电话
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//名称
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="padding: 5px 0 ;"><span>水库名称:</span> <span>${reservoirName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水库容量:</span> <span>${capacity}亿立方米</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    $("#dataPopup").css("width","450px")
    dataPopupOverlay.setPosition(point);

    restDataPopupMargin()

}
function touristSpotPopup(feature){
    // let coor =feature.getGeometry().getCoordinates();
    let tourName = feature[0].TourName || ''; //景区名称
    let level =feature[0].KEY_VALUE ||''; //景区等级
    let contact = feature[0].Contact  || ''; //联系人
    let mobilePhone = feature[0].MobilePhone || ''; //电话
    let reportUnitCode = feature[0].ReportUnitCode  || ''; //填报单位代码
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let reportUnitName = feature[0].ReportUnitName || '';//名称
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="padding: 5px 0 ;"><span>景区名称:</span> <span>${tourName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>景区等级:</span> <span>${level}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    $("#dataPopup").css("width","450px")
    dataPopupOverlay.setPosition(point);

    restDataPopupMargin()
}
function populationPopup(feature){
    // let coor = feature.getGeometry().getCoord/inates();
    let areaName =feature[0].AreaName; //地区名称
    let areaCode = feature[0].AreaCode; //地区编码
    let gdp = feature[0].Gdp; //GDP
    let agriculturalOutputValue = feature[0].AgriculturalOutputValue; //农业产值
    let totalPopulation = feature[0].TotalPopulation; //人口总数
    let householdRegiPopulation = feature[0].HouseholdRegiPopulation; //户籍人口
    let recurrentPopulation =feature[0].RecurrentPopulation; //流动人口
    let acreage = feature[0].Acreage; //土地面积
    let cultivatedIandArea = feature[0].CultivatedIandArea; //耕地面积

    let effectiveIrrigationArea = feature[0].EffectiveIrrigationArea ; //有效灌溉面积
    let econForestFruitPlaArea = feature[0].EconForestFruitPlaArea ; //经济林果种植面积
    let aquacultureArea = feature[0].AquacultureArea ; //水产养殖面积
    let induElec = feature[0].InduElec ; //工业用电
    let highwayMileage = feature[0].HighwayMileage ; //公路里程
    let lon =feature[0].Lon ; //经度
    let lat = feature[0].Lat ; //纬度
    let reportUnitCode =feature[0].ReportUnitCode; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//名称
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>地区名称:</span> <span>${areaName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>GDP:</span> <span>${gdp}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>农业产值:</span> <span>${agriculturalOutputValue}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>人口总数:</span> <span>${totalPopulation}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>户籍人口:</span> <span>${householdRegiPopulation}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>流动人口:</span> <span>${recurrentPopulation}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>土地面积:</span> <span>${acreage}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>耕地面积:</span> <span>${cultivatedIandArea}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>有效灌溉面积:</span> <span>${effectiveIrrigationArea}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经济林果种植面积:</span> <span>${econForestFruitPlaArea}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水产养殖面积:</span> <span>${aquacultureArea}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>工业用电:</span> <span>${induElec}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>公路里程:</span> <span>${highwayMileage}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    $("#dataPopup").css("width","450px")
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}
function meteorologicalPopup(feature){
    let InfoName =feature[0].InfoName || ''; //重点单位名称
    let InfoType = feature[0].InfoType || ''; //单位类别
    let Contact = feature[0].Contact || ''; //联系人
    let MobilePhone = feature[0].MobilePhone || ''; //联系电话
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//填报单位名称
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>重点单位名称:</span> <span>${InfoName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>单位类别:</span> <span>${InfoType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>联系人:</span> <span>${Contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>联系电话:</span> <span>${MobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);

    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}
function dsInfoPopup(feature) {
   let  clientID= feature[0].ClientID || '';//设备ID
   let  factoryID= feature[0].FactoryID || '';//厂商编号
   let  factoryServerID= feature[0].FactoryServerID || '';//厂商服务器ID
   let  originalClientID= feature[0].OriginalClientID || '';//厂商原始编码
   let  clientStyle= feature[0].ClientStyle || '';//终端编号
   let  lon= feature[0].Lon || '';//经度
   let  lat= feature[0].Lat || '';//纬度
   let  address= feature[0].Address || '';//终端地址
   let  clientPerson= feature[0].ClientPerson || '';//终端负责人
   let  clientTel= feature[0].ClientTel || '';//负责人联系方式
   let  reportUnitCode=feature[0].ReportUnitCode || '';//填报单位代码
    let reportUnitName=feature[0].ReportUnitName || '';//填报单位名称
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>设备ID:</span> <span>${clientID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>厂商编号:</span> <span>${factoryID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>厂商服务器ID:</span> <span>${factoryServerID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>厂商原始编码:</span> <span>${originalClientID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>终端编号:</span> <span>${clientStyle}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>终端地址:</span> <span>${address}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>终端负责人:</span> <span>${clientPerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>负责人联系方式:</span> <span>${clientTel}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}
//EMERGENCYFACILITIES
function emergencyFacilitiesPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let placeName =feature[0].PlaceName || ''; //场所名称
    let placeAddr = feature[0].PlaceAddr || ''; //场所地址
    let acreage = feature[0].Acreage || ''; //面积
    let competentDepartment = feature[0].CompetentDepartment || ''; //主管部门
    let contactPerson = feature[0].ContactPerson || ''; //联系人
    let contactMobile = feature[0].ContactMobile || ''; //联系人手机
    let contactTelephone = feature[0].ContactTelephone || ''; //联系人电话
    let responsiblePerson = feature[0].ResponsiblePerson || ''; //负责人
    let responsiblePersonMobile = feature[0].ResponsiblePersonMobile || ''; //负责人手机
    let responsiblePersonTelephone = feature[0].ResponsiblePersonTelephone || ''; //负责人电话
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//填报单位名称
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>场所名称:</span> <span>${placeName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>场所地址:</span> <span>${placeAddr}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>面积:</span> <span>${acreage}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>主管部门:</span> <span>${competentDepartment}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contactPerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人手机:</span> <span>${contactMobile}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人电话:</span> <span>${contactTelephone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>负责人:</span> <span>${responsiblePerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>负责人手机:</span> <span>${responsiblePersonMobile}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>负责人电话:</span> <span>${responsiblePersonTelephone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}
function dangerPointPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let projectEngineeringName =feature[0].ProjectEngineeringName ||''; //项目工程名称
    let address = feature[0].Address ||''; //地址
    let dangerousChemicalType = feature[0].DangerousChemicalType ||''; // 危化品类型
    let province = feature[0].ProvinceName ||''; //省
    let areaCode = feature[0].AreaCode ||''; //地区编码
    let securityResponsiblePerson = feature[0].SecurityResponsiblePerson ||''; //安全责任人
    let workUnit = feature[0].WorkUnit ||''; //工作单位
    let post = feature[0].Post ||''; //职务
    let positionalTitles = feature[0].PositionalTitles ||''; //职称
    let responsiblePersonMobile = feature[0].ResponsiblePersonMobile ||''; //责任人手机号
    let lon = feature[0].Lon ||''; //经度
    let lat = feature[0].Lat ||''; //纬度
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || '';//填报单位名称
    let remark = feature[0].Remark ||'--'; //备注
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>项目工程名称:</span> <span>${projectEngineeringName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>危化品类型:</span> <span>${dangerousChemicalType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>地址:</span> <span>${address}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>安全责任人:</span> <span>${securityResponsiblePerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>工作单位:</span> <span>${workUnit}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>职务:</span> <span>${post}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>职称:</span> <span>${responsiblePersonMobile}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>责任人手机号:</span> <span>${positionalTitles}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>备注:</span> <span>${remark}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}
//GEOLOGICHAZARD
function geologicahazardPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let hiddDangerPointAddr = feature[0].GeoName ||''; //隐患点地址
    let administrativeArea = feature[0].TownCode ||''; //行政区域
    let casualties = feature[0].ThreatPerNum ||''; //人员伤亡
    let controlCountermeasures = feature[0].RainfallFactor ||''; //防治对策信息
    let disasterGrade = feature[0].RainfallFactor ||''; //灾害等级
    let eventNumber = feature[0].GeoCode ||''; //事件编号
    let influenceTheMasses = feature[0].ThreatPerNum ||''; //影响群众
    let investigationDate = feature[0].RecordYear ||''; //调查时间
    let pecuniaryLoss =feature[0].EconomicLoss ||''; //经济损失
    let responsiblePerson = feature[0].RespPerson ||''; //责任人
    let telephone = feature[0].RespMobilePhone ||''; //电话
    let longitude = feature[0].Lon ||''; //经度
    let latitude = feature[0].Lat ||''; //纬度
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([longitude, latitude], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>隐患点地址:</span> <span>${hiddDangerPointAddr}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>行政区域:</span> <span>${administrativeArea}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>人员伤亡:</span> <span>${casualties}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>防治对策信息:</span> <span>${controlCountermeasures}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>灾害等级:</span> <span>${disasterGrade}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>事件编号:</span> <span>${eventNumber}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>影响群众:</span> <span>${influenceTheMasses}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>调查时间:</span> <span>${investigationDate}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>经济损失:</span> <span>${pecuniaryLoss}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>责任人:</span> <span>${responsiblePerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>电话:</span> <span>${telephone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${longitude}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${latitude}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}
//CONSTRUCTION
function constructionPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let projectengineeringName = feature[0].ProjectengineeringName ||''; //项目工程名称
    let engineeringCost = feature[0].EngineeringCost  || ''; //工程造价
    let estimatedcompletionDate = feature[0].EstimatedcompletionDate  || ''; //预计完工时间
    let hiddtroublepointAddr = feature[0].HiddtroublepointAddr  || ''; //隐患点地址
    let hiddhazardType = feature[0].HiddhazardType  || ''; //隐患灾害类型
    let buildingType = feature[0].BuildingType  || ''; //建筑类型
    let buildingAcreage =feature[0].BuildingAcreage  || ''; //建筑面积
    let province = feature[0].ProvinceName || ''; //省
    let yearofRecord = feature[0].YearofRecord || ''; //记录年份
    let securityresponsiblePerson = feature[0].SecurityresponsiblePerson || ''; //安全责任人
    let responsiblepersonMobile = feature[0].ResponsiblepersonMobile || ''; //责任人手机号
    let workUnit = feature[0].WorkUnit || ''; //工作单位
    let positionalTitles = feature[0].PositionalTitles || ''; //职称
    let post = feature[0].Post || ''; //职务
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let areaCode = feature[0].AreaCode || ''; //地区编码
    let remark = feature[0].Remark || ''; //备注
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>项目工程名称:</span> <span>${projectengineeringName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>工程造价:</span> <span>${engineeringCost}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>预计完工时间:</span> <span>${estimatedcompletionDate}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>隐患点地址:</span> <span>${hiddtroublepointAddr}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>隐患灾害类型:</span> <span>${hiddhazardType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>建筑类型:</span> <span>${buildingType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>建筑面积:</span> <span>${buildingAcreage}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>记录年份:</span> <span>${yearofRecord}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>安全责任人:</span> <span>${securityresponsiblePerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>责任人手机号:</span> <span>${responsiblepersonMobile}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>工作单位:</span> <span>${workUnit}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>职称:</span> <span>${positionalTitles}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>职务:</span> <span>${post}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>备注:</span> <span>${remark}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}
//FORESTFIRE

function forestFirePopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let accAddress = feature[0].AccAddress  || ''; //地址
    let department = feature[0].Department  || ''; //所属部门
    let numOfPersonsInDistress = feature[0].NumOfPersonsInDistress  || ''; //受灾人数(人)
    let deathToll =feature[0].DeathToll  || ''; //死亡人数（人）
    let potentialDamage =feature[0].PotentialDamage  || ''; //潜在损失（万）
    let dsasterDegree = feature[0].DsasterDegree  || ''; //灾害程度
    let describeInfo = feature[0].DescribeInfo  || ''; //描述
    let remark = feature[0].Remark  || ''; //备注

    let responsiblePerson =feature[0].ResponsiblePerson  || ''; //负责人
    let contactTelephone = feature[0].ContactTelephone  || ''; //联系电话
    let investigationDate = feature[0].InvestigationDate  || ''; //调查时间
    let isBePresent = feature[0].IsBePresent  || ''; //是否到场
    let lon = feature[0].Lon  || ''; //经度
    let lat = feature[0].Lat  || ''; //纬度
    let province = feature[0].ProvinceName  || ''; //省
    let areaCode = feature[0].AreaCode  || ''; //地区编码
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="margin: 5px 0"><span>地址:</span> <span>${accAddress}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>所属部门:</span> <span>${department}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>受灾人数:</span> <span>${numOfPersonsInDistress}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>死亡人数:</span> <span>${deathToll}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>潜在损失:</span> <span>${potentialDamage}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>灾害程度:</span> <span>${dsasterDegree}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0;">  <span>描述:</span> <span>${describeInfo}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0"><span>备注:</span> <span>${remark}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>负责人:</span> <span>${responsiblePerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${contactTelephone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>调查时间:</span> <span>${investigationDate}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>是否到场:</span> <span>${isBePresent}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}
///WATERBLACKSPOT
function waterBlackSpotPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let vulnerFloodName = feature[0].VulnerFloodName ||''; //易涝点名称
    let stationID =  feature[0].StationID ||''; //关联监测站ID

    let contact =  feature[0].Contact ||''; //联系人
    let mobilePhone =  feature[0].MobilePhone ||''; //手机
    let areaCode =  feature[0].AreaCode ||''; //行政区编码

    let rainfallFactor =  feature[0].RainfallFactor ||''; //降水致灾因子
    let rainfallThreshold =  feature[0].RainfallThreshold ||''; //降水阈值
    let waterLineFactor =  feature[0].WaterLineFactor ||''; //水位致灾因子
    let waterLineThreshold =  feature[0].WaterLineThreshold ||''; //水位阈值
    let soilFactor =  feature[0].SoilFactor ||''; //土壤致灾因子
    let soilThreshold =  feature[0].SoilThreshold ||''; //土壤阈值
    let lon =  feature[0].Lon ||''; //经度
    let lat =  feature[0].Lat ||''; //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>易涝点名称:</span> <span>${vulnerFloodName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>关联监测站ID:</span> <span>${stationID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>手机:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>行政区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>降水致灾因子:</span> <span>${rainfallFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>降水阈值:</span> <span>${rainfallThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水位致灾因子:</span> <span>${waterLineFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水位阈值:</span> <span>${waterLineThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>土壤致灾因子:</span> <span>${soilFactor}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>土壤阈值:</span> <span>${soilThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}

//MFRINFO
function mfrInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let mfrName = feature[0].MFRName ||''; //山洪沟名称
    let mfrHeight = feature[0].MFRHeight ||''; //沟口位置海拔高度
    let mfrCode = feature[0].MFRCode ||''; //山洪沟代码
    let mfrAddrName = feature[0].MFRAddrName ||''; //沟口位置名称

    let stationID = feature[0].StationID ||''; //关联监测站ID
    let townName = feature[0].TownName ||''; //影响村镇

    let contact = feature[0].Contact ||''; //联系人
    let mobilePhone = feature[0].MobilePhone ||''; //联系电话
    let rainfallFactor =feature[0].RainfallFactor ||'' //致灾因子：降水
    let rainfallThreshold = feature[0].RainfallThreshold ||''; //降水阈值
    let soilFactor = feature[0].SoilFactor ||''; // 致灾因子：土壤
    let soilThreshold = feature[0].SoilThreshold ||''; //土壤阈值
    let waterLineFactor = feature[0].WaterLineFactor ||''; //致灾因子：水位
    let waterLineThreshold = feature[0].WaterLineThreshold ||''; // 水位阈值
    let lon = feature[0].Lon ||''; //经度
    let lat = feature[0].Lat ||''; //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>山洪沟名称:</span> <span>${mfrName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>沟口位置海拔高度:</span> <span>${mfrHeight}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>山洪沟代码:</span> <span>${mfrCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>沟口位置名称:</span> <span>${mfrAddrName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>关联监测站ID:</span> <span>${stationID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>影响村镇:</span> <span>${townName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>降水致灾因子:</span> <span>${rainfallFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>降水阈值:</span> <span>${rainfallThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>土壤致灾因子:</span> <span>${soilFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>土壤阈值:</span> <span>${soilThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水位致灾因子:</span> <span>${waterLineFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水位阈值:</span> <span>${waterLineThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}

function biInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let BasinName = feature[0].BasinName ||''; //中小河流名称


    let estsiteAddrName = feature[0].EstsiteAddrName ||''; //河口位置名称
    let estsiteAddrHeight = feature[0].EstsiteAddrHeight ||''; //河口位置海拔高度单位 米
    let basinCode = feature[0].BasinCode ||''; //中小河流代码
    let population =feature[0].Population ||''; //流域内人口
    let basinArea = feature[0].BasinArea ||''; //流域面积 单位平方公里
    let basinLength =feature[0].BasinLength ||''; //河流长度 单位 KM

    let stationID = feature[0].StationID ||''; //监测站ID
    let townName = feature[0].TownName ||''; //影响村镇
    let contact =feature[0].Contact ||''; // 联系人
    let mobilePhone = feature[0].MobilePhone ||''; //联系电话
    let soilFactor = feature[0].SoilFactor ||''; //致灾因子：土壤
    let soilThreshold =feature[0].SoilThreshold ||''; // 土壤阈值
    let waterLineFactor = feature[0].WaterLineFactor ||''; //致灾因子：水位
    let waterLineThreshold = feature[0].WaterLineThreshold ||''; //水位阈值
    let rainfallFactor = feature[0].RainfallFactor ||''; // 致灾因子：降水
    let rainfallThreshold = feature[0].RainfallThreshold ||''; //降水阈值

    let lon = feature[0].Lon ||''; //经度
    let lat = feature[0].Lat ||''; //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>中小河流名称:</span> <span>${BasinName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>河口位置名称:</span> <span>${estsiteAddrName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>河口位置海拔高度:</span> <span>${estsiteAddrHeight}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>中小河流代码:</span> <span>${basinCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>流域内人口:</span> <span>${population}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>流域面积:</span> <span>${basinArea}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>河流长度:</span> <span>${basinLength}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="margin: 5px 0">  <span>关联监测站ID:</span> <span>${stationID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="margin: 5px 0">  <span>影响村镇:</span> <span>${townName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>降水致灾因子:</span> <span>${rainfallFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>降水阈值:</span> <span>${rainfallThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>土壤致灾因子:</span> <span>${soilFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>土壤阈值:</span> <span>${soilThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水位致灾因子:</span> <span>${waterLineFactor}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>水位阈值:</span> <span>${waterLineThreshold}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}


//RPINFOINFO
function rpInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let perName = feature[0].PerName  || ''; //姓名
    let mobilePhone = feature[0].MobilePhone  || ''; //手机
    let unitName = feature[0].UnitName  || ''; //单位名称
    let duty = feature[0].Duty  || ''; //职务
    let nation = feature[0].Nation  || ''; //国家

    let province = feature[0].ProvinceName  || ''; //省
    let city = feature[0].CityName  || ''; //市
    let county = feature[0].CountyName  || ''; //县
    let town = feature[0].TownName  || ''; //镇／乡／街道
    let village = feature[0].VillageName  || ''; // 村／居委会
    let areaCode = feature[0].AreaCode  || ''; //行政区划编码

    let lon = feature[0].Lon  || ''; //经度
    let lat = feature[0].Lat  || ''; //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>姓名:</span> <span>${perName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>手机:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>单位名称:</span> <span>${unitName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>职务:</span> <span>${duty}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>国家:</span> <span>${nation}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>市:</span> <span>${city}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>县:</span> <span>${county}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>镇／乡／街道:</span> <span>${town}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>村／居委会:</span> <span>${village}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>行政区划编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}


function miInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let perName = feature[0].PerName || ''; //姓名
    let mobilePhone = feature[0].MobilePhone || ''; //手机

    let province = feature[0].ProvinceName || ''; //省
    let city = feature[0].CityName || ''; //市
    let county = feature[0].CountyName || ''; //县
    let town = feature[0].TownName || ''; //镇／乡／街道
    let village = feature[0].VillageName || ''; // 村／居委会
    let areaCode = feature[0].AreaCode || ''; //行政区划编码

    let lon = feature[0].Lon  || ''; //经度
    let lat = feature[0].Lat  || ''; //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>姓名:</span> <span>${perName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>手机:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>市:</span> <span>${city}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>县:</span> <span>${county}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>镇／乡／街道:</span> <span>${town}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>村／居委会:</span> <span>${village}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>行政区划编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}


function terminalPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();

    let clientID = feature[0].ClientID || ''; //终端编号
    let clientStyle = getTerminalTypeName(feature[0].ClientStyle); //终端型号
    let clientStatus = getTerminalStatusName(feature[0].clientStatus); //终端状态
    let address = feature[0].Address || ''; //终端地址
    let clientPerson = feature[0].ClientPerson || ''; //终端负责人
    let clientTel = feature[0].ClientTel || ''; //负责人联系方式


    let originalClientID = feature[0].OriginalClientID || ''; //终端原始编号
    let factoryServerID = feature[0].FactoryServerID || ''; //厂商服务器编号
    let factoryID = getTerminalFactoryName(feature[0].FactoryID); //厂商编号
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || ''; //填报单位代码
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || '';//纬度
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>终端编号:</span> <span>${clientID}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>终端型号:</span> <span>${clientStyle}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>终端状态:</span> <span>${clientStatus}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>终端地址:</span> <span>${address}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>终端负责人:</span> <span>${clientPerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>负责人联系方式:</span> <span>${clientTel}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>终端原始编号:</span> <span>${originalClientID}</span></li>`).appendTo(dataInfoUl);


    $(`<li style="float: left;width: 50%;">  <span>厂商服务器编号:</span> <span>${factoryServerID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>厂商编号:</span> <span>${factoryID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);


    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}

function gridPerInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let perName = feature[0].PerName || ''; //姓名
    let mobilePhone = feature[0].MobilePhone || ''; //手机
    let unitName = feature[0].UnitName || ''; //单位名称
    let duty = feature[0].Duty || ''; //职务
    let nation = feature[0].Nation || ''; //国家

    let province = feature[0].ProvinceName || ''; //省
    let city = feature[0].CityName || ''; //市
    let county = feature[0].CountyName || ''; //县
    let town = feature[0].TownName || ''; //镇／乡／街道
    let village = feature[0].VillageName || ''; // 村／居委会
    let areaCode = feature[0].AreaCode || ''; //行政区划编码

    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>姓名:</span> <span>${perName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>手机:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>单位名称:</span> <span>${unitName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>职务:</span> <span>${duty}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>国家:</span> <span>${nation}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>市:</span> <span>${city}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>县:</span> <span>${county}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>镇／乡／街道:</span> <span>${town}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>村／居委会:</span> <span>${village}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>行政区划编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}


function feInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let flaExpPlaceName =feature[0].FlaExpPlaceName || ''; //场所名称
    let unit = feature[0].Unit || ''; //场所管理单位

    let contact = feature[0].Contact || ''; //联系人
    let mobilePhone = feature[0].MobilePhone || ''; //电话
    let lon = feature[0].Lon || ''; //经度
    let lat = feature[0].Lat || ''; //纬度
    let reportUnitCode = feature[0].ReportUnitCode || ''; //填报单位代码
    let reportUnitName = feature[0].ReportUnitName || ''; //填报单位代码
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>场所名称:</span> <span>${flaExpPlaceName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>场所管理单位:</span> <span>${unit}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人:</span> <span>${contact}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>电话:</span> <span>${mobilePhone}</span></li>`).appendTo(dataInfoUl);


    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}



function prcInfoPopup(feature){
    // let coor = feature.getGeometry().getCoordinates();
    let eventID = feature[0].EventID ||''; //事件ID
    let eventName = feature[0].EventName ||''; //事件名称
    let disasterType = feature[0].DisasterType ||''; //气象灾害编码
    let serviceAttach = feature[0].ServiceAttach ||''; //决策服务类型
    let callLevel = feature[0].CallLevel ||''; //叫应级别
    let callResult = feature[0].CallResult ||''; //叫应结果
    let identifier = feature[0].Identifier ||''; //预警ID
    let startTime = feature[0].StartTime ||''; //事件启动时间
    let reportTime = feature[0].ReportTime ||''; //信息上报时间
    let onDutyPerson =feature[0].OnDutyPerson ||''; //值班人员
    let onDutyNumber = feature[0].OnDutyNumber ||''; //值班电话
    let infoReportUnit = feature[0].InfoReportUnit ||''; //信息上报单位
    let actionTime = feature[0].ActionTime ||''; //决策服务发生时间
    let effectArea = feature[0].EffectArea ||''; //影响地区
    let stationID = feature[0].StationID ||''; //关联监测站ID
    let weatherService = feature[0].WeatherService ||''; //气象服务产品
    let lon = feature[0].Lon  ||''; //经度
    let lat = feature[0].Lat  ||''; //纬度
    let dataInfoUl =$("#dataInfoUl").empty();
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    $(`<li style="float: left;width: 50%;"><span>事件ID:</span> <span>${eventID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>事件名称:</span> <span>${eventName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>气象灾害编码:</span> <span>${disasterType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>决策服务类型:</span> <span>${serviceAttach}</span></li>`).appendTo(dataInfoUl);


    $(`<li style="float: left;width: 50%;">  <span>叫应级别:</span> <span>${callLevel}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>叫应结果:</span> <span>${callResult}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>预警ID:</span> <span>${identifier}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>事件启动时间:</span> <span>${startTime}</span></li>`).appendTo(dataInfoUl);


    $(`<li style="float: left;width: 50%;">  <span>信息上报时间:</span> <span>${reportTime}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>值班人员:</span> <span>${onDutyPerson}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>值班电话:</span> <span>${onDutyNumber}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>信息上报单位:</span> <span>${infoReportUnit}</span></li>`).appendTo(dataInfoUl);



    $(`<li style="float: left;width: 50%;">  <span>决策服务发生时间:</span> <span>${actionTime}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>影响地区:</span> <span>${effectArea}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>关联监测站ID:</span> <span>${stationID}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>气象服务产品:</span> <span>${weatherService}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);

    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()
}

function expertPopup(feature){

    // let coor = feature.getGeometry().getCoordinates();
    let name = feature[0].Name ||''; //姓名
    let domain = feature[0].Domain ||''; //领域
    let positionalTitles = feature[0].PositionalTitles ||''; //职称
    let workUnit = feature[0].WorkUnit ||''; //工作单位
    let post =feature[0].Post ||''; //单位职务
    let mobile =feature[0].Mobile ||''; //手机
    let telephone = feature[0].Telephone ||''; //联系人电话

    let province = feature[0].ProvinceName ||'' //省

    let address = feature[0].Address ||'' //地址
    let permanentAddressd = feature[0].PermanentAddressd ||'--' //常驻地址
    let areaCode = feature[0].AreaCode ||'' //地区编码
    let reportUnitCode = feature[0].ReportUnitCode ||'' //填报单位代码
    let reportUnitName = feature[0].ReportUnitName ||'' //填报单位名称
    let lon = feature[0].Lon ||'' //经度
    let lat = feature[0].Lat ||'' //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>姓名:</span> <span>${name}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>领域:</span> <span>${domain}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>职称:</span> <span>${positionalTitles}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>工作单位:</span> <span>${workUnit}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>单位职务:</span> <span>${post}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>手机:</span> <span>${mobile}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>联系人电话:</span> <span>${telephone}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>地址:</span> <span>${address}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>常驻地址:</span> <span>${permanentAddressd}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}

//materialPopup

function materialPopup(feature){

    // let coor = feature.getGeometry().getCoordinates();

    let nameOfReserveUnit =feature[0].NameOfReserveUnit ||''; //储备单位名称
    let materialName =feature[0].MaterialName ||''; //物资名称
    let materialType = feature[0].MaterialType ||''; //物资类型
    let materialQuantity = feature[0].MaterialQuantity ||''; //物资数量
    let unitOfQuantity =feature[0].UnitOfQuantity ||''; //数量单位
    let emergencyReserveAddr = feature[0].EmergencyReserveAddr ||''; //应急储备地址
    let reserveContactPerson =feature[0].ReserveContactPerson ||''; //储备联系人
    let reseContPersonTelephone = feature[0].ReseContPersonTelephone ||''; //储备联系人电话
    let reserveContactPersonMobile = feature[0].ReserveContactPersonMobile ||''; //储备联系人手机

    let province = feature[0].ProvinceName ||'' //省
    let areaCode = feature[0].AreaCode ||'' //地区编码
    let reportUnitCode = feature[0].ReportUnitCode ||'' //填报单位代码
    let reportUnitName = feature[0].ReportUnitName ||'' //填报单位名称
    let lon = feature[0].Lon ||'' //经度
    let lat = feature[0].Lat ||'' //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>储备单位名称:</span> <span>${nameOfReserveUnit}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>物资名称:</span> <span>${materialName}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>物资类型:</span> <span>${materialType}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>物资数量:</span> <span>${materialQuantity}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>数量单位:</span> <span>${unitOfQuantity}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>应急储备地址:</span> <span>${emergencyReserveAddr}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>储备联系人:</span> <span>${reserveContactPerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>储备联系人电话:</span> <span>${reseContPersonTelephone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>储备联系人手机:</span> <span>${reserveContactPersonMobile}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}

function rescueForcePopup(feature){

    // let coor = feature.getGeometry().getCoordinates();

    let name = feature[0].Name || ''; //名称
    let address = feature[0].Address || ''; //地址
    let numberOfPeople =feature[0].NumberOfPeople || ''; //人数
    let type = feature[0].Type || ''; // 类型
    let unit = feature[0].Unit || ''; // 归属单位
    let responsiblePerson = feature[0].ResponsiblePerson || ''; //责任人
    let responsiblePersonMobile = feature[0].ResponsiblePersonMobile || ''; //责任人手机
    let responsiblePersonTelephone =feature[0].ResponsiblePersonTelephone || ''; //责任人电话

    let teamContactPerson = feature[0].TeamContactPerson || ''; //队伍联系人
    let teamContactMobile = feature[0].TeamContactMobile || ''; //队伍联系人手机

    let province = feature[0].ProvinceName ||'' //省
    let areaCode = feature[0].AreaCode ||'' //地区编码
    let reportUnitCode = feature[0].ReportUnitCode ||'' //填报单位代码
    let reportUnitName = feature[0].ReportUnitName ||'' //填报单位名称
    let lon = feature[0].Lon ||'' //经度
    let lat = feature[0].Lat ||'' //纬度
    var point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    let dataInfoUl =$("#dataInfoUl").empty();
    $(`<li style="float: left;width: 50%;"><span>名称:</span> <span>${name}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>地址:</span> <span>${address}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>人数:</span> <span>${numberOfPeople}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>类型:</span> <span>${type}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>归属单位:</span> <span>${unit}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>责任人:</span> <span>${responsiblePerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>责任人手机:</span> <span>${responsiblePersonMobile}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>责任人电话:</span> <span>${responsiblePersonTelephone}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>队伍联系人:</span> <span>${teamContactPerson}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>队伍联系人手机:</span> <span>${teamContactMobile}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;">  <span>省:</span> <span>${province}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>地区编码:</span> <span>${areaCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>填报单位代码:</span> <span>${reportUnitCode}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;"><span>填报单位名称:</span> <span>${reportUnitName}</span></li>`).appendTo(dataInfoUl);

    $(`<li style="float: left;width: 50%;"><span>经度:</span> <span>${lon}</span></li>`).appendTo(dataInfoUl);
    $(`<li style="float: left;width: 50%;">  <span>纬度:</span> <span>${lat}</span></li>`).appendTo(dataInfoUl);
    dataPopupOverlay.setPosition(point);
    restDataPopupMargin()

}


function getTerminalFactoryName(factoryCode) {
    var name = "--";
    switch(factoryCode) {
        case "0001":
            name = "双顺达";
            break;
        case "0002":
            name = "伍豪科技";
            break;
        case "0003":
            name = "沈阳恒远";
            break;
        case "0004":
            name = "强讯公司";
            break;
        case "0005":
            name = "华泰德丰";
            break;
        case "0006":
            name = "联合远航";
            break;
        case "0007":
            name = "赛乐科技";
            break;
        case "0008":
            name = "瑞彩";
            break;
        case "0015":
            name = "天齐信息";
            break;
        case "0016":
            name = "安徽中科金诚";
            break;
        case "0017":
            name = "深圳昆特";
            break;
        case "0018":
            name = "成都奥天";
            break;
        case "0019":
            name = "河南物理所";
            break;
        case "0020":
            name = "平治东方";
            break;
        case "0021":
            name = "花冠";
            break;
        case "0022":
            name = "畅运";
            break;
        case "0023":
            name = "锦州创安";
            break;
        case "0024":
            name = "电视台";
            break;
        case "0025":
            name = "广播电台";
            break;
        case "0099":
            name = "其他厂家";
            break;
        default:
            name = "--";
            break;
    }
    return name;
}
function getTerminalStatusName(terminalStatusCode) {
    let name = "--";
    switch(terminalStatusCode) {
        case 0:
            name = "正常";
            break;
        case 1:
            name = "异常";
            break;
        case 99:
            name = "其他";
            break;
        default:
            name = "--";
            break;
    }
    return name;
}

function getTerminalTypeName(terminalTypeCode) {
    let name = "--";
    switch(terminalTypeCode) {
        case "0":
            name = "大喇叭";
            break;
        case "1":
            name = "电子屏";
            break;
        case "2":
            name = "北斗";
            break;
        case "3":
            name = "呼叫中心";
            break;
        case "4":
            name = "短信";
            break;
        case "5":
            name = "传真";
            break;
        case "6":
            name = "邮件";
            break;
        case "7":
            name = "电视";
            break;
        case "8":
            name = "广播";
            break;
        case "9":
            name = "微博";
            break;
        case "10":
            name = "微信";
            break;
        case "11":
            name = "网站";
            break;
        case "12":
            name = "手机客户端";
            break;
        case "13":
            name = "海洋广播";
            break;
        case "14":
            name = "气象频道";
            break;
        case "15":
            name = "预警智能盒子";
            break;
        case "16":
            name = "高层楼宇小喇叭";
            break;
        case "17":
            name = "音频APP";
            break;
        case "18":
            name = "小区广播";
            break;
        case "19":
            name = "高层LCD灯光幕墙";
            break;
        case "99":
            name = "其他设备";
            break;
        default:
            name = "--";
            break;
    }
    return name;
}
function  restDataPopupMargin(){
    let dataPopup = document.getElementById("dataPopup");
    let height =dataPopup.offsetHeight+10;
    let width =dataPopup.offsetWidth/2;
    $(dataPopup).css({
        'margin-top': `-${height}px`,
        'margin-left': `-${width}px`
    })
    let dataPopup1 = document.getElementById("alarmWarnPopup");
    let height1 =dataPopup1.offsetHeight+10;
    let width1 =dataPopup1.offsetWidth/2;
    $(dataPopup1).css({
        'margin-top': `-${height1}px`,
        'margin-left': `-${width1}px`
    })
    let dataPopup2 = document.getElementById("warnSignalOverlay");
    let height2 =dataPopup2.offsetHeight/2-10;
    let width2 =dataPopup2.offsetWidth/4-20;
    $(dataPopup2).css({
        'margin-top': `-${height2}px`,
        'margin-left': `${width2}px`
    })
}
function resetTyphoonDataMargin(){
    let dataPopup = document.getElementById("typhoonData");
    $(dataPopup).css({
        'margin-top': `-15px`,
        'margin-left': `20px`
    })
}
let selectIn = false;
let clickSelectIn = false;
let hisSelectIn = false;
function  restWarningMargin(){
    let dataPopup = document.getElementById("effectiveWarningOverlay");
    let height =dataPopup.offsetHeight+10;
    let width =dataPopup.offsetWidth/2;
    $(dataPopup).css({
        'margin-top': `-${height}px`,
        'margin-left': `-${width}px`
    })

}

function zjDataPoup(feature){
    let id = feature.get("ID");
    let code = feature.get("code");
    zjtdt.getResourceInfo(code,id,zjDataPoupCallback,feature);
}
function zjDataPoupCallback(result,feature){

    if(result.code ==1){
        let displays = result.result.DISPLAYS;
        let data = result.result.DATA;
        let dataInfoUl =$("#dataInfoUl").empty();
        for(let i=0;i<displays.length;i++){
            let display=displays[i];
            let label = display.ALIASNAME;
            let field= display.FIELDNAME;
            let value =data[field];
            $(`<li style="float: left;width: 50%;"><span>${label}:</span> <span>${value}</span></li>`).appendTo(dataInfoUl);
        }

        dataPopupOverlay.setPosition(feature.getGeometry().getCoordinates());
        restDataPopupMargin()

    }

}
