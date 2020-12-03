import ol from "openlayers"
import $ from "jquery"
import tiandituTakenKey from './getTiandituTk'
/*!create by yx 2019-07-12*/
ol.control.BaselayerSwitcher = function(a) {
        var b = this,
            c = a || {};
        this.base_ = c.base || "googlemap",
            this.display_ = c.display || "road",
            this.postion_ = c.position || "LT",
            this.none_ = c.none || !1,
            this.layerUrls_ = c.layerUrls || void 0,
            this.baselayers_ = this.baseLayers(this.base_, this.layerUrls_);
        var d = ($('<div id="layerswitcher"></div>').appendTo($("#map")[0]),
            $('<div class="layerswitcher"></div>').appendTo($("#map")[0]));
        switch (this.none_ && $('<div class="none" title="不显示底图"><span class="lsBody"><span class="lsBackground"></span><span class="lsLabel">无</span></span></div>').appendTo(d[0]),
            this.base_) {
            case "baidu":
                $('<div class="road" title="显示矢量图"><span class="lsBody"><span class="lsBackground"></span><span class="lsLabel">地图</span></span></div>').appendTo(d[0]),
                    $('<div class="sate" title="显示影像图"><span class="lsBody"><span class="lsBackground" ></span><span class="lsLabel">影像</span></span></div>').appendTo(d[0]);
                break;
            default:
                $('<div class="road" title="显示矢量图"><span class="lsBody"><span class="lsBackground"></span><span class="lsLabel">地图</span></span></div>').appendTo(d[0]),
                    $('<div class="terr" title="显示地形图"><span class="lsBody"><span class="lsBackground"></span><span class="lsLabel">地形</span></span></div>').appendTo(d[0]),
                    $('<div class="sate" title="显示影像图"><span class="lsBody"><span class="lsBackground" ></span><span class="lsLabel">影像</span></span></div>').appendTo(d[0])
        }
        this.setPostion(this.postion_),
            this.setVisible(this.display_),
            $(".road,.sate,.terr,.none").click(function(a) {
                var c = $(this).index(),
                    d = $(this).parent().children().length;
                c < d - 1 ? c += 1 : c = 0;
                var e = $(this).parent().children()[c].className;
                b.setVisible(e),
                    mapUtil.setBaseLayer(b.getMap(), b.baselayers_[e]),
                    b.getMap().renderSync()
            }),
            ol.control.Control.call(this, {
                element: d[0],
                target: "layerswitcher"
            })
    },
    ol.inherits(ol.control.BaselayerSwitcher, ol.control.Control),
    ol.control.BaselayerSwitcher.prototype.setMap = function(a) {
        ol.control.Control.prototype.setMap.call(this, a),
            mapUtil.setBaseLayer(a, this.baselayers_[this.display_]),
            a.renderSync()
    },
    ol.control.BaselayerSwitcher.prototype.setPostion = function(a) {
        switch (a) {
            case "LT":
                $("#layerswitcher").css({
                    left: "40px",
                    top: "12px"
                });
                break;
            case "RT":
                $("#layerswitcher").css({
                    right: "20px",
                    top: "20px"
                });
                break;
            case "LB":
                $("#layerswitcher").css({
                    left: "20px",
                    bottom: "40px"
                });
                break;
            case "RB":
                $("#layerswitcher").css({
                    right: "20px",
                    bottom: "40px"
                });
                break;
            default:
                $("#layerswitcher").css({
                    left: "20px",
                    top: "20px"
                })
        }
    },
    ol.control.BaselayerSwitcher.prototype.setVisible = function(a) {
        switch ($(".road,.sate,.terr,.none").css("display", "none"),
            a) {
            case "terr":
                $(".terr").css("display", "block");
                break;
            case "road":
                $(".road").css("display", "block");
                break;
            case "sate":
                $(".sate").css("display", "block");
                break;
            default:
                $(".none").css("display", "block")
        }
    },
    ol.control.BaselayerSwitcher.prototype.baseLayers = function(a, b) {
        switch (a) {
            case "googlemap":
                var c = layerUtil.createGoogleLayer("road", {
                        layerId: "baseLayer",
                        layerCaption: "谷歌地图",
                        zIndex: -1
                    }),
                    d = layerUtil.createGoogleLayer("sate", {
                        layerId: "baseLayer",
                        layerCaption: "谷歌地图",
                        zIndex: -1
                    }),
                    e = layerUtil.createGoogleLayer("terr", {
                        layerId: "baseLayer",
                        layerCaption: "谷歌地图",
                        zIndex: -1
                    });
                return {
                    road: c,
                    sate: d,
                    terr: e
                };
            case "tianditu":
                var c = layerUtil.createTiandituLayer("road", {
                        layerId: "baseLayer",
                        layerCaption: "天地图",
                        zIndex: -1
                    }),
                    d = layerUtil.createTiandituLayer("sate", {
                        layerId: "baseLayer",
                        layerCaption: "天地图",
                        zIndex: -1
                    }),
                    e = layerUtil.createTiandituLayer("terr", {
                        layerId: "baseLayer",
                        layerCaption: "天地图",
                        zIndex: -1
                    });
                return {
                    road: c,
                    sate: d,
                    terr: e
                };
            case "baidu":
                var c = layerUtil.createBaiduLayer("road", {
                        layerId: "baseLayer",
                        layerCaption: "百度地图",
                        zIndex: -1
                    }),
                    d = layerUtil.createBaiduLayer("sate", {
                        layerId: "baseLayer",
                        layerCaption: "百度地图",
                        zIndex: -1
                    });
                return {
                    road: c,
                    sate: d
                };
            case "offline":
                var c = layerUtil.createTiledLayer("offline", this.layerUrls_.road, {
                        layerId: "baseLayer",
                        layerCaption: "底图",
                        zIndex: -1
                    }),
                    d = layerUtil.createTiledLayer("offline", this.layerUrls_.sate, {
                        layerId: "baseLayer",
                        layerCaption: "底图",
                        zIndex: -1
                    }),
                    e = layerUtil.createTiledLayer("offline", this.layerUrls_.terr, {
                        layerId: "baseLayer",
                        layerCaption: "底图",
                        zIndex: -1
                    });
                return {
                    road: c,
                    sate: d,
                    terr: e
                }
        }
    },
    ol.control.CanvasBorder = function(a) {
        a || (a = {}),
            this.params_ = {
                width: a.width ? a.width : 1,
                color: a.color ? a.color : "#000"
            },
            this.setStyle();
        var b = $("<div>");
        ol.control.Control.call(this, {
            element: b.get(0),
            target: a.target
        })
    },
    ol.inherits(ol.control.CanvasBorder, ol.control.Control),
    ol.control.CanvasBorder.prototype.setMap = function(a) {
        var b = this.getMap();
        b && b.un("postcompose", this.drawBorder_, this),
            ol.control.Control.prototype.setMap.call(this, a),
            b && b.renderSync(),
            a && a.on("postcompose", this.drawBorder_, this)
    },
    ol.control.CanvasBorder.prototype.setStyle = function(a) {
        if ("object" == typeof a)
            for (var b in a)
                this.params_[b] = a[b];
        this.getMap() && this.getMap().render()
    },
    ol.control.CanvasBorder.prototype.setVisible = function(a) {
        a ? $(this.element).show() : $(this.element).hide(),
            this.getMap() && this.getMap().renderSync()
    },
    ol.control.CanvasBorder.prototype.getVisible = function(a) {
        return "none" != $(this.element).css("display")
    },
    ol.control.CanvasBorder.prototype.drawBorder_ = function(a) {
        if (this.getVisible()) {
            var b = a.context,
                c = a.frameState.pixelRatio;
            b.save(),
                b.scale(c, c);
            var d = b.canvas.width / c,
                e = b.canvas.height / c;
            b.beginPath(),
                b.rect(0, 0, d, e),
                b.lineWidth = this.params_.width,
                b.strokeStyle = this.params_.color,
                b.stroke(),
                b.closePath(),
                b.restore()
        }
    },
    ol.control.CanvasLegend = function(a) {
        a || (a = {}),
            this.params_ = {
                renderColor: a.renderColor ? a.renderColor : [
                    ["min", 1, "#ffffff"],
                    [1, 10, "#ccffcc"],
                    [10, 25, "#00ff00"],
                    [25, 50, "#33cc33"],
                    [50, 100, "#007f00"],
                    [100, 200, "#0099bb"],
                    [200, "max", "#0033ff"]
                ],
                titleText: a.titleText ? a.titleText : "图例",
                direction: a.direction ? a.direction : "left",
                infoFont: a.infoFont ? a.infoFont : "13px 宋体",
                titleFont: a.titleFont ? a.titleFont : "bold 18px 宋体",
                mode: a.mode ? a.mode : "vertical",
                titleColor: a.titleColor ? a.titleColor : "#000"
            },
            this.setStyle();
        var b = $("<div>");
        ol.control.Control.call(this, {
            element: b.get(0),
            target: a.target
        })
    },
    ol.inherits(ol.control.CanvasLegend, ol.control.Control),
    ol.control.CanvasLegend.prototype.setMap = function(a) {
        var b = this.getMap();
        b && b.un("postcompose", this.drawLegend, this),
            ol.control.Control.prototype.setMap.call(this, a),
            b && b.renderSync(),
            a && a.on("postcompose", this.drawLegend, this)
    },
    ol.control.CanvasLegend.prototype.setStyle = function(a) {
        if ("object" == typeof a)
            for (var b in a)
                this.params_[b] = a[b];
        this.getMap() && this.getMap().render()
    },
    ol.control.CanvasLegend.prototype.setVisible = function(a) {
        a ? $(this.element).show() : $(this.element).hide(),
            this.getMap() && this.getMap().renderSync()
    },
    ol.control.CanvasLegend.prototype.getVisible = function(a) {
        return "none" != $(this.element).css("display")
    },
    ol.control.CanvasLegend.prototype.drawLegend = function(a) {
        if (this.getVisible()) {
            var b = a.context,
                c = a.frameState.pixelRatio;
            b.save(),
                b.scale(c, c);
            var d = this.params_,
                e = d.renderColor,
                f = d.direction,
                g = d.infoFont,
                h = d.mode,
                i = b.canvas.width / c,
                j = b.canvas.height / c;
            if ("vertical" == h || "v" == h) {
                var k = 30 * (e.length + 1),
                    l = 100,
                    m = {};
                "left" == f ? (m = {
                            top: j - k - 30,
                            left: 80
                        },
                        e[0].color && (m.left = m.left,
                            m.top = m.top + 30)) : (m = {
                            top: j - k,
                            left: i - l
                        },
                        e[0].color && (m.left = m.left + 30)),
                    b.beginPath(),
                    b.fillStyle = "#fff",
                    b.fillRect(m.left - 70, m.top - 20, l + 60, k + 10),
                    b.closePath(),
                    b.beginPath(),
                    b.fillStyle = this.params_.titleColor,
                    b.textAlign = "center",
                    b.textBaseline = "middle",
                    b.font = d.titleFont,
                    b.fillText(d.titleText, m.left, m.top),
                    b.closePath(),
                    e[0].color ? $.each(e, function(a, c) {
                        var d = m.left,
                            e = m.top + 30 * a,
                            // f = c.caption;
                            f = '';
                        if (c.type == 'rain') {
                            f = c.name + ' ' + c.minVal + '-' + c.maxVal
                        } else {
                            f = c.name
                        }

                        b.beginPath(),
                            b.fillStyle = 'rgb(' + c.color + ')',
                            b.fillRect(d - 55, e + 20, 130, 20),
                            b.rect(d - 55, e + 20, 130, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            b.textAlign = "center";
                        b.textBaseline = "middle";
                        b.fillText(f, d, e + 30 + 2),
                            b.closePath()
                    }) : e[0][2] ? $.each(e, function(a, c) {
                        var d, e = m.left,
                            f = m.top + 30 * a;
                        d = "min" == c[0] ? "<" + c[1] : "无降水" == c[0] ? "无降水" : "max" == c[1] ? ">=" + c[0] : c[0] + "~" + c[1],
                            b.beginPath(),
                            b.fillStyle = c[2],
                            b.fillRect(e - 50, f + 20, 30, 20),
                            b.rect(e - 50, f + 20, 30, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            b.fillText(d, e + 20, f + 30),
                            b.closePath()
                    }) : $.each(e, function(a, c) {
                        var d, e = m.left,
                            f = m.top + 30 * a;
                        d = c[0],
                            b.beginPath(),
                            b.fillStyle = c[1],
                            b.fillRect(e - 50, f + 20, 30, 20),
                            b.rect(e - 50, f + 20, 30, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            b.fillText(d, e + 20, f + 30),
                            b.closePath()
                    }),
                    b.restore()
            } else if ("horizontal" == h || "h" == h) {
                var k = 30,
                    l = 30 * (e.length + 1),
                    m = {};
                m = "left" == f ? {
                        top: j - k - 55,
                        left: 20
                    } : {
                        top: j - k - 55,
                        left: i - l - 20
                    },
                    b.beginPath(),
                    b.fillStyle = "rgba(240,240,240,0.5)",
                    b.fillRect(m.left, m.top - 20, l, k + 40),
                    b.closePath(),
                    b.beginPath(),
                    b.fillStyle = "black",
                    b.textAlign = "center",
                    b.textBaseline = "middle",
                    b.font = d.titleFont,
                    b.fillText(d.titleText, m.left + l / 2, m.top - 5),
                    b.closePath(),
                    e[0].color ? $.each(e, function(a, c) {
                        var d = m.left + 30 * a,
                            e = m.top,
                            f = c.color[1];
                        "max" == f && (f = ""),
                            b.beginPath(),
                            b.fillStyle = c.color[2],
                            b.fillRect(d + 10, e + 20, 30, 20),
                            b.rect(d + 10, e + 20, 30, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            b.fillText(f, d + 40, e + 14),
                            b.closePath()
                    }) : $.each(e, function(a, c) {
                        var d = m.left + 30 * a,
                            e = m.top,
                            f = c[1];
                        "max" == f && (f = ""),
                            b.beginPath(),
                            b.fillStyle = c[2],
                            b.fillRect(d + 10, e + 20, 30, 20),
                            b.rect(d + 10, e + 20, 30, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            b.fillText(f, d + 40, e + 14),
                            b.closePath()
                    })
            } else if ("dv" == h) {
                var k = 20 * (e.length + 1),
                    l = 40,
                    m = {};
                m = "left" == f ? {
                        top: j - k - 20,
                        left: 20
                    } : {
                        top: j - k - 20,
                        left: i - l - 20
                    },
                    b.beginPath(),
                    b.fillStyle = "rgba(240,240,240,0.5)",
                    b.fillRect(m.left, m.top - 20, l, k + 40),
                    b.closePath(),
                    b.beginPath(),
                    b.fillStyle = "black",
                    b.textAlign = "center",
                    b.textBaseline = "middle",
                    b.font = d.titleFont,
                    b.fillText(d.titleText, m.left + l / 2 + 10, m.top - 5),
                    b.closePath(),
                    e[0].color ? $.each(e, function(a, c) {
                        var d = m.left,
                            e = m.top + 20 * a,
                            h = c.color[1];
                        "max" == h && (h = ""),
                            b.beginPath(),
                            b.fillStyle = c.color[2],
                            b.fillRect(d + 10, e + 20, 30, 20),
                            b.rect(d + 10, e + 20, 30, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            "left" == f ? b.fillText(h, d + 50, e + 41) : b.fillText(h, d + 0, e + 41),
                            b.closePath()
                    }) : $.each(e, function(a, c) {
                        var d = m.left,
                            e = m.top + 20 * a,
                            h = c[1];
                        "max" == h && (h = ""),
                            b.beginPath(),
                            b.fillStyle = c[2],
                            b.fillRect(d + 10, e + 20, 30, 20),
                            b.rect(d + 10, e + 20, 30, 20),
                            b.lineWidth = .25,
                            b.strokeStyle = "#000",
                            b.stroke(),
                            b.fillStyle = "#000",
                            b.font = g,
                            "left" == f ? b.fillText(h, d + 50, e + 41) : b.fillText(h, d + 0, e + 41),
                            b.closePath()
                    })
            }
        }
    },
    ol.control.CanvasTitle = function(a) {
        a || (a = {}),
            this.params_ = {
                font: a.font ? a.font : "bold 16px 宋体",
                color: a.color ? a.color : "#484848",
                position: a.position ? a.position : "TC",
                text: a.text ? a.text : [""]
            },
            this.setStyle();
        var b = $("<div>");
        ol.control.Control.call(this, {
            element: b.get(0),
            target: a.target
        })
    },
    ol.inherits(ol.control.CanvasTitle, ol.control.Control),
    ol.control.CanvasTitle.prototype.setMap = function(a) {
        var b = this.getMap();
        b && b.un("postcompose", this.drawTitle_, this),
            ol.control.Control.prototype.setMap.call(this, a),
            b && b.renderSync(),
            a && a.on("postcompose", this.drawTitle_, this)
    },
    ol.control.CanvasTitle.prototype.setStyle = function(a) {
        if ("object" == typeof a)
            for (var b in a)
                this.params_[b] = a[b];
        this.getMap() && this.getMap().render()
    },
    ol.control.CanvasTitle.prototype.setVisible = function(a) {
        a ? $(this.element).show() : $(this.element).hide(),
            this.getMap() && this.getMap().renderSync()
    },
    ol.control.CanvasTitle.prototype.getVisible = function(a) {
        return "none" != $(this.element).css("display")
    },
    ol.control.CanvasTitle.prototype.drawTitle_ = function(a) {
        if (this.getVisible()) {
            var b = a.context,
                c = a.frameState.pixelRatio;
            b.save(),
                b.scale(c, c);
            var d = b.canvas.width / c,
                e = $(this.element).height(),
                f = {
                    top: 67,
                    left: d / 2
                };
            if ("TC" == this.params_.position) {
                var g = this.params_.text,
                    h = this.params_.font,
                    i = this.params_.color;
                if ("string" == typeof g)
                    b.beginPath(),
                    b.fillStyle = "rgba(255,255,255,0.8)",
                    b.fillRect(f.left - 300, f.top - 15, 600, 30),
                    b.fillStyle = this.params_.color,
                    b.textAlign = "center",
                    b.textBaseline = "middle",
                    b.font = this.params_.font,
                    b.fillText(g, f.left, f.top + e / 2),
                    b.closePath(),
                    b.restore();
                else if (0 != g.length)
                    b.fillStyle = "rgba(255,255,255,0.7)";
                b.fillRect(f.left - 210, f.top, 420, 50);
                for (var j = 0; j < g.length; j++) {
                    b.beginPath();
                    if (j == 0) {
                        b.fillStyle = "#484848";
                    } else {
                        b.fillStyle = i;
                    }
                    b.textAlign = "center";
                    b.textBaseline = "middle";
                    b.font = h;
                    b.fillText(g[j], f.left, f.top + 20 + 20 * j);
                    b.closePath();
                }
                b.restore();

            } else {
                f.left = this.params_.position.left,
                    f.top = this.params_.position.top;
                var g = this.params_.text,
                    h = this.params_.font,
                    i = this.params_.color;
                b.beginPath(),
                    b.fillStyle = "rgba(255,255,255,0.8)",
                    b.fillRect(f.left - 5, f.top - 5, 250, 20 * g.length + 5),
                    b.closePath();
                for (var j = 0; j < g.length; j++)
                    b.beginPath(),
                    b.fillStyle = i,
                    b.textAlign = "left",
                    b.textBaseline = "middle",
                    b.font = h,
                    b.fillText(g[j], f.left, f.top + 20 * j + e / 2 + 5),
                    b.closePath(),
                    b.restore()
            }
        }
    },
    ol.control.ssdlogo = function(a) {
        var b = $('<div id="ssdlogo">').css({
                position: "absolute",
                right: "0px",
                bottom: "0px"
            })[0],
            c = $("<a>").appendTo(b)[0];
        c.href = "http://www.ssd.net.cn",
            c.target = "_blank";
        var d = $("<img>").css({
            width: "50%",
            height: "50%"
        })[0];
        d.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDM0MiwgMjAxMC8wMS8xMC0xODowNjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUwMjc4MTVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUwMjc4MjVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyRTAyNzdGNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYyRTAyNzgwNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++jSynwAACUhJREFUeNrMWXt0VEcd/u7dm+wmWfIk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",
            c.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDM0MiwgMjAxMC8wMS8xMC0xODowNjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUwMjc4MTVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUwMjc4MjVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyRTAyNzdGNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYyRTAyNzgwNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++jSynwAACUhJREFUeNrMWXt0VEcd/u7dm+wmWfIk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",
            c.appendChild(d),
            ol.control.Control.call(this, {
                element: b,
                target: "map"
            })
    },
    ol.inherits(ol.control.ssdlogo, ol.control.Control);
/*!create by yx 2019-07-12*/
ol.Contour = function(a) {
        a = a || {},
            this.params_ = {
                url: a.url,
                contourType: a.type ? a.type : "polygon",
                points: a.points,
                citycode: a.citycode ? a.citycode : "0",
                inter_values: a.inter ? a.inter : [],
                width: a.width ? a.width : 50,
                height: a.height ? a.height : 50,
                service: a.service ? a.service : "c_server",
                request: a.request ? a.request : "GetCountour",
                version: a.version ? a.version : "1.0.0",
                renderColor: a.renderColor
            }
    },
    ol.Contour.prototype.loadContourData = function(a, b) {
        void 0 != this.params_.url && (this.params_.inter_values = this.params_.inter_values.join(","),
            this.params_.points = this.params_.points.join(","),
            $.ajax({
                type: "post",
                data: this.params_,
                crossDomain: !0,
                url: this.params_.url,
                dataType: "json",
                success: function(b) {
                    a(b)
                },
                error: function(a, c, d) {
                    b()
                }
            }))
    },
    ol.Contour.prototype.createContourLayer = function(a) {
        void 0 != this.params_.url && (this.params_.inter_values = this.params_.inter_values.join(","),
            this.params_.points = this.params_.points.join(","),
            this.params_.renderColor = this.params_.renderColor || a.params_.renderColor,
            $.ajax({
                type: "post",
                data: this.params_,
                requestParams: this.params_,
                crossDomain: !0,
                url: this.params_.url,
                dataType: "json",
                success: function(a) {
                    var b = window.map,
                        c = this.requestParams.renderColor,
                        d = (new ol.format.GeoJSON).readFeatures(a, {
                            dataProjection: "EPSG:4326",
                            featureProjection: "EPSG:3857"
                        }),
                        e = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: d
                            }),
                            style: function(a) {
                                return new ol.style.Style({
                                    fill: new ol.style.Fill({
                                        color: commonUtil.getFeatureColor(c, a.get("lvalue") || a.get("value"))
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: commonUtil.getFeatureColor(c, a.get("lvalue") || a.get("value")),
                                        width: 2
                                    })
                                })
                            }
                        });
                    b.addLayer(e)
                },
                error: function(a, b, c) {}
            }))
    },
    ol.filter = {},
    ol.filter.Base = function(a) {
        ol.Object.call(this),
            a && a.active === !1 ? this.set("active", !1) : this.set("active", !0)
    },
    ol.inherits(ol.filter.Base, ol.Object),
    ol.filter.Base.prototype.setActive = function(a) {
        this.set("active", a === !0)
    },
    ol.filter.Base.prototype.getActive = function(a) {
        return this.set("active")
    },
    function() {
        function a(a) {
            this.get("active") && this.precompose(a)
        }

        function b(a) {
            this.get("active") && this.postcompose(a)
        }

        function c(a) {
            this.renderSync ? this.renderSync() : this.changed()
        }

        function d(d) {
            this.filters_ || (this.filters_ = []),
                this.filters_.push(d),
                d.precompose && this.on("precompose", a, d),
                d.postcompose && this.on("postcompose", b, d),
                d.on("propertychange", c, this),
                c.call(this)
        }

        function e(d) {
            this.filters_ || (this.filters_ = []);
            for (var e = this.filters_.length - 1; e >= 0; e--)
                this.filters_[e] === d && this.filters_.splice(e, 1);
            d.precompose && this.un("precompose", a, d),
                d.postcompose && this.un("postcompose", b, d),
                d.un("propertychange", c, this),
                c.call(this)
        }
        ol.Map.prototype.addFilter = function(a) {
                d.call(this, a)
            },
            ol.Map.prototype.removeFilter = function(a) {
                e.call(this, a)
            },
            ol.Map.prototype.getFilters = function() {
                return this.filters_
            },
            ol.layer.Base.prototype.addFilter = function(a) {
                d.call(this, a)
            },
            ol.layer.Base.prototype.removeFilter = function(a) {
                e.call(this, a)
            },
            ol.layer.Base.prototype.getFilters = function() {
                return this.filters_
            }
    }(),
    ol.filter.Mask = function(a) {
        if (a = a || {},
            ol.filter.Base.call(this, a),
            a.feature)
            switch (a.feature.getGeometry().getType()) {
                case "Polygon":
                case "MultiPolygon":
                    this.feature_ = a.feature
            }
        this.set("inner", a.inner),
            this.fillColor_ = a.fill ? ol.color.asString(a.fill.getColor()) || "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.2)"
    },
    ol.inherits(ol.filter.Mask, ol.filter.Base),
    ol.filter.Mask.prototype.drawFeaturePath_ = function(a, b) {
        function c(a) {
            return [(a[0] * g[0] + a[1] * g[1] + g[4]) * f, (a[0] * g[2] + a[1] * g[3] + g[5]) * f]
        }
        var d = a.context,
            e = d.canvas,
            f = a.frameState.pixelRatio,
            g = a.frameState.coordinateToPixelTransform;
        g || (g = a.frameState.coordinateToPixelMatrix,
            c = function(a) {
                return [(a[0] * g[0] + a[1] * g[1] + g[12]) * f, (a[0] * g[4] + a[1] * g[5] + g[13]) * f]
            }
        );
        var h = this.feature_.getGeometry().getCoordinates();
        "Polygon" == this.feature_.getGeometry().getType() && (h = [h]),
            d.beginPath(),
            b && (d.moveTo(0, 0),
                d.lineTo(e.width, 0),
                d.lineTo(e.width, e.height),
                d.lineTo(0, e.height),
                d.lineTo(0, 0));
        for (var i = 0; i < h.length; i++)
            for (var j = h[i], k = 0; k < j.length; k++) {
                var l = c(j[k][0]);
                d.moveTo(l[0], l[1]);
                for (var m = 1; m < j[k].length; m++)
                    l = c(j[k][m]),
                    d.lineTo(l[0], l[1])
            }
    },
    ol.filter.Mask.prototype.postcompose = function(a) {
        if (this.feature_) {
            var b = a.context;
            b.save(),
                this.drawFeaturePath_(a, !this.get("inner")),
                b.fillStyle = this.fillColor_,
                b.fill("evenodd"),
                b.restore()
        }
    };
/*!create by yx 2019-07-12*/
ol.Overlay.Popup = function(a) {
        var b = this,
            c = $("<div>");
        this.element = a.element = c.get(0),
            this.offsetBox = a.offsetBox,
            $("<div>").addClass("anchor").appendTo(c);
        var d = $("<div>").addClass("ol-overlaycontainer-stopevent").appendTo(c);
        this.content = $("<div>").addClass("content").appendTo(d).get(0),
            this.closeBox = a.closeBox,
            $("<button>").addClass("closeBox").addClass(a.closeBox ? "hasclosebox" : "").prependTo(d).click(function() {
                b.hide(),
                    "function" == typeof a.onclose && a.onclose()
            }),
            a.stopEvent = 1,
            d.on("mousedown touchstart", function(a) {
                a.stopPropagation()
            }),
            ol.Overlay.call(this, a),
            this.setPopupClass(a.popupClass),
            this.setPositioning(a.positioning)
    },
    ol.inherits(ol.Overlay.Popup, ol.Overlay),
    ol.Overlay.Popup.prototype.getClassPositioning = function() {
        var a = "",
            b = this.getPositioning();
        return /bottom/.test(b) && (a += "ol-popup-bottom "),
            /top/.test(b) && (a += "ol-popup-top "),
            /left/.test(b) && (a += "ol-popup-left "),
            /right/.test(b) && (a += "ol-popup-right "),
            /^center/.test(b) && (a += "ol-popup-middle "),
            /center$/.test(b) && (a += "ol-popup-center "),
            a
    },
    ol.Overlay.Popup.prototype.setClosebox = function(a) {
        this.closeBox = a,
            a ? $(this.element.children[0]).addClass("hasclosebox") : $(this.element.children[0]).removeClass("hasclosebox")
    },
    ol.Overlay.Popup.prototype.setPopupClass = function(a) {
        $(this.element.children[0]).removeClass().addClass("ol-popup " + (a || "default") + " " + this.getClassPositioning() + (this.closeBox ? " hasclosebox" : ""))
    },
    ol.Overlay.Popup.prototype.addPopupClass = function(a) {
        $(this.element.children[0]).addClass(a)
    },
    ol.Overlay.Popup.prototype.removePopupClass = function(a) {
        $(this.element.children[0]).removeClass(a)
    },
    ol.Overlay.Popup.prototype.setPositioning = function(a) {
        /auto/.test(a) ? (this.autoPositioning = a.split("-"),
                1 == this.autoPositioning.length && (this.autoPositioning[1] = "auto")) : this.autoPositioning = !1,
            a = a.replace(/auto/g, "center"),
            "center" == a && (a = "bottom-center"),
            this.setPositioning_(a)
    },
    ol.Overlay.Popup.prototype.setPositioning_ = function(a) {
        ol.Overlay.prototype.setPositioning.call(this, a),
            $(this.element.children[0]).removeClass("ol-popup-top ol-popup-bottom ol-popup-left ol-popup-right ol-popup-center ol-popup-middle"),
            $(this.element.children[0]).addClass(this.getClassPositioning())
    },
    ol.Overlay.Popup.prototype.show = function(a, b, c) {
        var d = '<div class="titleEcharts"><label>' + c + "</label></div>";
        d += '<div class="echartsDiv">' + b + "</div>";
        var e = d;
        e || "string" != typeof a || (e = a,
            a = null);
        var f = this,
            g = this.getMap();
        if (g && (e && e !== this.prevHTML && (this.prevHTML = e,
                    $(this.content).html("").append(e),
                    $("*", this.content).load(function() {
                        g.renderSync()
                    })),
                a)) {
            if (this.autoPositioning) {
                var h = g.getPixelFromCoordinate(a),
                    i = g.getSize(),
                    j = [];
                "auto" == this.autoPositioning[0] ? j[0] = h[1] < i[1] / 3 ? "top" : "bottom" : j[0] = this.autoPositioning[0],
                    j[1] = h[0] < 2 * i[0] / 3 ? "left" : "right",
                    this.setPositioning_(j[0] + "-" + j[1]),
                    this.offsetBox && this.setOffset([this.offsetBox["left" == j[1] ? 2 : 0], this.offsetBox["top" == j[0] ? 3 : 1]])
            }
            this.setPosition(a),
                $(this.element.children[0]).parent().show(),
                this._tout = setTimeout(function() {
                    $(f.element.children[0]).addClass("visible")
                }, 0)
        }
    },
    ol.Overlay.Popup.prototype.hide = function() {
        this.setPosition(void 0),
            this._tout && clearTimeout(this._tout),
            $(this.element.children[0]).removeClass("visible")
    };
export const commonUtil = {};
commonUtil.pointToGeoJson = function(a, b, c) {
        for (var d = {
                type: "FeatureCollection",
                features: []
            }, e = 0; e < a.length; e++) {
            var f = parseFloat(a[e][b]),
                g = parseFloat(a[e][c]);
            if (null != f & void 0 != f & null != g & void 0 != g) {
                var h = {
                        type: "Point",
                        coordinates: [f, g]
                    },
                    i = {
                        type: "Feature",
                        properties: a[e],
                        geometry: h
                    };
                d.features.push(i)
            }
        }
        return d
    },
    commonUtil.accMul = function(a, b) {
        var c, d = 0,
            e = a.toString(),
            f = b.toString();
        return c = e.split("."),
            c[1] && (d += c[1].length),
            c = f.split("."),
            c[1] && (d += c[1].length),
            Number(e.replace(".", "")) * Number(f.replace(".", "")) / Math.pow(10, d)
    },
    commonUtil.getInterFormRenderColor = function(a) {
        for (var b = [], c = 0; c < a.length; c++)
            "min" == a[c].color[0] ? b.push(-99) : "max" == a[c].color[1] ? b.push(999) : b.push(a[c].color[0]);
        return b
    },
    commonUtil.boundaryRegionDisplay = function(a, b, c) {
        var d = [];
        if (c.length > 0) {
            if (0 == b && $.each(c, function(b, c) {
                    if (a == c.properties.CITYCODE) {
                        new ol.geom.MultiPolygon(c.geometry.coordinates);
                        d.push(c)
                    }
                }),
                1 == b) {
                var e = a.substring(4);
                if ("00" == e)
                    return;
                $.each(c, function(b, c) {
                    if (a == c.properties.CITYCODE) {
                        new ol.geom.MultiPolygon(c.geometry.coordinates);
                        d.push(c)
                    }
                    a.substring(0, 4) + "00" == c.properties.CITYCODE && d.push(c)
                })
            }
            2 == b && $.each(c, function(b, e) {
                if (a == e.properties.CITYCODE) {
                    var f = new ol.geom.MultiPolygon(e.geometry.coordinates);
                    $.each(c, function(b, c) {
                            var e = new ol.geom.MultiPolygon(c.geometry.coordinates),
                                g = f.intersectsExtent(e.getExtent()),
                                h = c.properties.CITYCODE.substring(4),
                                i = c.properties.CITYCODE,
                                j = a.substring(4);
                            "00" == j ? g && "00" == h && i != a && "000" != i.substring(3) && d.push(c) : g && "00" != h && i != a && d.push(c)
                        }),
                        d.push(e)
                }
            })
        }
        return d
    },
    commonUtil.getFeatureColor = function(a, b) {
        var c = "#ffffff";
        return $.each(a, function(a, d) {
                d = d.color,
                    ("min" == d[0] && b < d[1] || "max" == d[1] && b >= d[0] || b < d[1] && b >= d[0]) && (c = d[2])
            }),
            c
    },
    Date.prototype.Format = function(a) {
        var b = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            S: this.getMilliseconds()
        };
        /(y+)/.test(a) && (a = a.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var c in b)
            new RegExp("(" + c + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? b[c] : ("00" + b[c]).substr(("" + b[c]).length)));
        return a
    };
export const contentUtil = {};
contentUtil.googleUrl = {
        road: "http://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
        sate2: "http://mt2.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
        sate: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
        terr2: "http://mt2.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
        terr: "http://mt2.google.cn/vt/lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}",
        label: "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}"
    },
    contentUtil.tianditu = {
        road: "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + tiandituTakenKey,
        sate: "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + tiandituTakenKey,
        terr: "http://t{0-7}.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=" + tiandituTakenKey,
        roadlabel: "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + tiandituTakenKey,
        satelabel: "http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" + tiandituTakenKey,
        terrlabel: "http://t{0-7}.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=" + tiandituTakenKey
    },
    contentUtil.crs = {
        4326: "EPSG:4326",
        3857: "EPSG:3857"
    },
    contentUtil.logoURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDM0MiwgMjAxMC8wMS8xMC0xODowNjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUwMjc4MTVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUwMjc4MjVFQkIxMUU2QjIwQjk3NEM5QTFFRTZFQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyRTAyNzdGNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYyRTAyNzgwNUVCQjExRTZCMjBCOTc0QzlBMUVFNkVDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++jSynwAACUhJREFUeNrMWXt0VEcd/u7dm+wmWfIk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";
export const featureUtil = {};
featureUtil.getDefaultFeatureStyle = function(a) {
        var b;
        switch (a.getGeometry().getType()) {
            case "Point":
                b = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: "rgba(10, 100, 255, 0.6)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "red",
                            width: 1
                        })
                    })
                });
                break;
            case "LineString":
                b = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "green",
                        width: 1
                    })
                });
                break;
            case "MultiLineString":
                b = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "green",
                        width: 1
                    })
                });
                break;
            case "MultiPoint":
                b = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: "rgba(10, 100, 255, 0.6)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "red",
                            width: 1
                        })
                    })
                });
                break;
            case "MultiPolygon":
                b = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "yellow",
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(255, 255, 0, 0.1)"
                    })
                });
                break;
            case "Polygon":
                b = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "blue",
                        lineDash: [4],
                        width: 3
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(0, 0, 255, 0.1)"
                    })
                });
                break;
            case "GeometryCollection":
                b = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "magenta",
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: "magenta"
                    }),
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: null,
                        stroke: new ol.style.Stroke({
                            color: "magenta"
                        })
                    })
                });
                break;
            case "Circle":
                b = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "red",
                        width: 2
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(255,0,0,0.2)"
                    })
                })
        }
        return b
    },
    featureUtil.getClusterDefaultStyle = function(a) {
        var b = a.get("features").length;
        if (b > 1) {
            var c = {},
                d = c[b];
            return d || (d = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 10,
                            stroke: new ol.style.Stroke({
                                color: "#fff"
                            }),
                            fill: new ol.style.Fill({
                                color: "#3399CC"
                            })
                        }),
                        text: new ol.style.Text({
                            text: b.toString(),
                            fill: new ol.style.Fill({
                                color: "#fff"
                            })
                        })
                    }),
                    c[b] = d),
                d
        }
        var a = a.get("features")[0],
            d = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: "rgba(10, 100, 255, 0.6)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "red",
                        width: 1
                    })
                })
            });
        return d
    },
    featureUtil.getFilterFeatures = function(a, b) {
        for (var c = a, d = b, e = [], f = 0; f < c.length; f++)
            for (var g = 0; g < d.length; g++)
                c[f].getGeometry().intersectsExtent(d[g].getGeometry().getExtent()) && e.push(d[g]);
        return e
    },
    featureUtil.readGeojson = function(a, b) {
        return (new ol.format.GeoJSON).readFeatures(a, {
            featureProjection: b
        })
    },
    featureUtil.queryFeature = function(a, b) {
        for (var c = 0; c < a.length; c++) {
            var d = a[c],
                e = !0;
            for (var f in b)
                d.getProperties()[f] != b[f] && (e = !1);
            if (e)
                return d
        }
    };
export const layerUtil = {};
layerUtil.createTiledLayer = function(a, b, c) {
        c || (c = {});
        var d = c.layerId,
            e = c.layerCaption,
            f = c.opacity ? c.opacity : 1,
            g = c.zIndex ? c.zIndex : 0,
            h = sourceUtil.tiledSource(a, b);
        return new ol.layer.Tile({
            source: h,
            layerId: d,
            layerCaption: e,
            opacity: f,
            zIndex: g
        })
    },
    layerUtil.createGoogleLayer = function(a, b) {
        return layerUtil.createTiledLayer("googlemap", a, b)
    },
    layerUtil.createTiandituLayer = function(a, b) {
        var c = layerUtil.createTiledLayer("tianditu", a, {
                layerId: a,
                layerCaption: a
            }),
            d = layerUtil.createTiledLayer("tianditu", a + "Label", {
                layerId: "Label",
                layerCaption: "Label"
            });
        return layerUtil.createGroupLayer([c, d], b)
    },
    layerUtil.createBaiduLayer = function(a, b) {
        var c;
        if ("sate" == a) {
            var d = layerUtil.createTiledLayer("baidu", a, {
                    layerId: a,
                    layerCaption: a
                }),
                e = layerUtil.createTiledLayer("baidu", a + "Label", {
                    layerId: "Label",
                    layerCaption: "Label"
                });
            c = layerUtil.createGroupLayer([d, e], b)
        } else
            c = layerUtil.createTiledLayer("baidu", a, b);
        return c
    },
    layerUtil.createWMSLayer = function(a, b, c) {
        c || (c = {});
        var d = c.layerId,
            e = c.layerCaption,
            f = c.opacity ? c.opacity : 1,
            g = c.zIndex ? c.zIndex : 0,
            h = sourceUtil.wmsSource(a, b);
        return new ol.layer.Image({
            source: h,
            layerId: d,
            layerCaption: e,
            opacity: f,
            zIndex: g
        })
    },
    layerUtil.createGroupLayer = function(a, b) {
        var c = b.layerId,
            d = b.layerCaption,
            e = b.opacity ? b.opacity : 1,
            f = b.zIndex ? b.zIndex : 0;
        return new ol.layer.Group({
            layers: a,
            layerId: c,
            layerCaption: d,
            opacity: e,
            zIndex: f
        })
    },
    layerUtil.createGeoJsonLayer = function(a, b) {
        b || (b = {});
        var c = b.layerId,
            d = b.layerCaption,
            e = b.opacity ? b.opacity : 1,
            f = b.zIndex ? b.zIndex : 0,
            g = b.style ? b.style : styleUtil.defaultStyle,
            h = b.crs ? b.crs : "EPSG:4326",
            i = sourceUtil.geoJsonSource(a, h);
        return new ol.layer.Vector({
            source: i,
            layerId: c,
            layerCaption: d,
            opacity: e,
            zIndex: f,
            style: g
        })
    },
    layerUtil.createPointJsonLayer = function(a, b) {
        var c = commonUtil.pointToGeoJson(a, b.x, b.y);
        return layerUtil.createGeoJsonLayer(c, b)
    },
    layerUtil.creatImgLayer = function(a, b, c) {
        var c = c ? c : {},
            d = c.layerId,
            e = c.layerCaption,
            f = c.opacity ? c.opacity : 1,
            g = c.zIndex ? c.zIndex : 0,
            h = sourceUtil.imgStaticSource(a, b);
        return new ol.layer.Image({
            source: h,
            layerId: d,
            layerCaption: e,
            opacity: f,
            zIndex: g
        })
    },
    layerUtil.setLayerImg = function(a, b) {
        var c = a.getSource().image_.extent;
        a.setSource(sourceUtil.imgStaticSource(b, c))
    },
    layerUtil.createContourLayer = function(a, b, c, d, e) {},
    layerUtil.addMask = function(a, b, c, d) {
        "" == d && (d = 1);
        var e = c.geometry.coordinates,
            f = new ol.geom.Polygon(e).transform("EPSG:4326", a.getView().getProjection().getCode()),
            g = new ol.Feature({
                geometry: f
            }),
            h = new ol.filter.Mask({
                feature: g,
                inner: !1,
                fill: new ol.style.Fill({
                    color: [255, 255, 255, d]
                })
            });
        h.setActive(!0),
            b.addFilter(h)
    };
export const mapUtil = {};
mapUtil.createMap = function(a, b, c, d, e, f) {
        var left = ol.proj.transform([104.48077392578125, 20.897075653076172], "EPSG:4326", "EPSG:3857");
        var right = ol.proj.transform([112.05690002441406, 26.387575149536133], "EPSG:4326", "EPSG:3857");
        var extent = left.concat(right);
        var g = new ol.View({
            // extent:extent,
            center: ol.proj.transform(b, "EPSG:4326", c),
            projection: c,
            zoom: e,
            maxZoom: f,
            minZoom: d
        });
        return new ol.Map({
            logo: !1,
            view: g,
            target: a,
            controls: []
        })
    },
    mapUtil.createTiledMap = function(a, b, c, d, e, f, g) {
        var h = layerUtil.createTiledLayer(c, d, {
                layerId: "baseLayer",
                layerCaption: "底图"
            }),
            i = mapUtil.createMap(a, b, "EPSG:3857", e, f, g);
        return i.addLayer(h),
            i
    },
    mapUtil.createGoogleMap = function(a, b, c, d, e, f) {
        var g = layerUtil.createGoogleLayer(c, {
                layerId: "baseLayer",
                layerCaption: "谷歌地图",
                zIndex: -1
            }),
            h = mapUtil.createMap(a, b, "EPSG:3857", d, e, f);
        return h.addLayer(g),
            h
    },
    mapUtil.createTiandituMap = function(a, b, c, d, e, f) {
        var g = layerUtil.createTiandituLayer(c, {
                layerId: "baseLayer",
                layerCaption: "天地图",
                zIndex: -1
            }),
            h = mapUtil.createMap(a, b, "EPSG:3857", d, e, f);
        return h.addLayer(g),
            h
    },
    mapUtil.createBaiduMap = function(a, b, c, d, e, f) {
        var g = layerUtil.createBaiduLayer(c, {
                layerId: "baseLayer",
                layerCaption: "百度地图",
                zIndex: -1
            }),
            h = mapUtil.createMap(a, b, "EPSG:3857", d, e, f);
        return h.addLayer(g),
            h
    },
    mapUtil.createWMSMap = function(a, b, c, d, e, f, g) {
        var h = layerUtil.createWMSLayer(c, d, {
                layerId: "wmsBaseLayer",
                layerCaption: "底图"
            }),
            i = mapUtil.createMap(a, b, "EPSG:4326", e, f, g);
        return i.addLayer(h),
            i
    },
    mapUtil.createWMSMap2 = function(a, b, c, d, e, f, g) {
        var h = layerUtil.createWMSLayer(c, d, {
                layerId: "wmsBaseLayer",
                layerCaption: "底图"
            }),
            i = mapUtil.createMap(a, b, "EPSG:3857", e, f, g);
        return i.addLayer(h),
            i
    },
    mapUtil.addPointJsonLayer = function(a, b, c) {
        c.crs = a.getView().getProjection();
        var d = layerUtil.createPointJsonLayer(b, c);
        return a.addLayer(d),
            d
    },
    mapUtil.addPopup = function(a, b) {
        var c = new ol.Overlay.Popup({
            id: "popup",
            popupClass: "default",
            onclose: function() {
                c.setPosition(undefined);
                $.each(a.getInteractions().getArray(), function(m, item) {
                    if (item.constructor == ol.interaction.Select) {
                        item.getFeatures().clear();
                    }
                })
            },
            positioning: "bottom-center",
            autoPan: !0,
            closeBox: "hasclosebox",
            autoPanAnimation: {
                duration: 250
            }
        });
        a.addOverlay(c)
    },
    mapUtil.addLayerPopup = function(a, b, c, d) {
        for (var e, f = !1, g = [], h = 0; h < a.getInteractions().getArray().length; h++) {
            var i = a.getInteractions().getArray()[h];
            if ("select" == i.get("selectId")) {
                f = !0,
                    e = i;
                break
            }
        }
        f ? (g = e.get("assoLayers"),
                g.indexOf(b) < 0 && (g.push(b),
                    b.set("popupFun", d ? d : void 0)),
                a.removeInteraction(e)) : (g.push(b),
                b.set("popupFun", d ? d : void 0)),
            e = "move" == c ? new ol.interaction.Select({
                condition: ol.events.condition.pointerMove,
                layers: g,
                //  style:styleSelect
            }) : new ol.interaction.Select({
                condition: ol.events.condition.click,
                layers: g,
                // style:styleSelect
            }),
            e.set("selectId", "select"),
            e.set("assoLayers", g),
            a.addInteraction(e),
            e.getFeatures().on(["add"], function(b) {
                var c = b.element,
                    d = c.getProperties(),
                    f = e.getLayer(c),
                    g = f.get("popupFun"),
                    h = g ? g(d) : {};
                if ("" != h.content) {
                    var i = h.content || "",
                        j = h.title || "";
                    a.getOverlayById("popup").show(ol.extent.getCenter(c.getGeometry().getExtent()), i, j)
                }
            }),
            e.getFeatures().on(["remove"], function(b) {
                a.getOverlayById("popup").hide()
            })
    },

    mapUtil.getLogoElement = function() {
        var a = document.createElement("a");
        a.href = "http://www.ssd.net.cn",
            a.target = "_blank";
        var b = document.createElement("img");
        return b.src = contentUtil.LogoURL,
            a.src = contentUtil.LogoURL,
            a.appendChild(b),
            a
    },
    mapUtil.setBaseLayer = function(a, b) {
        mapUtil.removeLayerById(a, "baseLayer"),
            b && a.addLayer(b)
    },
    mapUtil.addDefaultControls = function() {},
    mapUtil.addControls = function() {},
    mapUtil.addControl = function() {},
    mapUtil.addLayers = function(a, b) {},
    mapUtil.addLayer = function(a, b) {},
    mapUtil.setLayerVisiblityById = function(a, b, c) {
        var d = mapUtil.findLayerById(a, b);
        d && d.setVisible(c)
    },
    mapUtil.setLayersVisiblityByIds = function(a, b) {
        for (var c in b) {
            var d = mapUtil.findLayerById(a, c);
            d && d.setVisible(blvisible)
        }
    },
    mapUtil.findLayerById = function(a, b) {
        var c;
        return a.getLayers().forEach(function(a) {
                if (a.getProperties().layerId == b)
                    return c = a, !1
            }),
            c
    },
    mapUtil.removeLayerById = function(a, b) {
        var c = mapUtil.findLayerById(a, b);
        c && a.removeLayer(c)
    },
    mapUtil.addMask = function(a, b, c) {
        c || (c = {});
        var d = c.layerId,
            e = (c.layerCaption,
                c.opacity ? c.opacity : 1),
            f = (c.zIndex ? c.zIndex : 0,
                b.geometry.coordinates),
            g = [
                [
                    [-180, 70],
                    [180, 70],
                    [180, -70],
                    [-180, -70],
                    [-180, 70]
                ]
            ];
        g.push(f[0]);
        var h = new ol.geom.Polygon(g).transform("EPSG:4326", a.getView().getProjection().getCode()),
            i = new ol.Feature({
                geometry: h
            }),
            j = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [i]
                }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(255,255,255," + e + ")"
                    })
                })
            });
        j.set("layerId", d),
            a.addLayer(j)
    },
    mapUtil.addMaskByLayerIds = function(a, b, c, d) {
        b.length < 1 || ("" == d && (d = 1),
            $.each(b, function(b, e) {
                var f = mapUtil.findLayerById(a, e),
                    g = c.geometry.coordinates,
                    h = new ol.geom.Polygon(g).transform("EPSG:4326", a.getView().getProjection().getCode()),
                    i = new ol.Feature({
                        geometry: h
                    }),
                    j = new ol.filter.Mask({
                        feature: i,
                        inner: !1,
                        fill: new ol.style.Fill({
                            color: [255, 255, 255, d]
                        })
                    });
                j.setActive(!0),
                    f.addFilter(j)
            }))
    };
export const sourceUtil = {};
sourceUtil.tiledSource = function(a, b) {
        switch (a) {
            case "googlemap":
                switch (b) {
                    case "road":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.road,
                            crossOrigin: "anonymous"
                        });
                    case "road2":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.road2,
                            crossOrigin: "anonymous"
                        });
                    case "sate":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.sate,
                            crossOrigin: "anonymous"
                        });
                    case "sate2":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.sate2,
                            crossOrigin: "anonymous"
                        });
                    case "terr":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.terr,
                            crossOrigin: "anonymous"
                        });
                    case "terr2":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.terr2,
                            crossOrigin: "anonymous"
                        });
                    case "label":
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.label,
                            crossOrigin: "anonymous"
                        });
                    default:
                        return new ol.source.XYZ({
                            url: contentUtil.googleUrl.road,
                            crossOrigin: "anonymous"
                        })
                }
                break;
            case "tianditu":
                switch (b) {
                    case "road":
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.road,
                            crossOrigin: "anonymous"
                        });
                    case "roadLabel":
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.roadlabel,
                            crossOrigin: "anonymous"
                        });
                    case "sate":
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.sate,
                            crossOrigin: "anonymous"
                        });
                    case "sateLabel":
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.satelabel,
                            crossOrigin: "anonymous"
                        });
                    case "terr":
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.terr,
                            crossOrigin: "anonymous"
                        });
                    case "terrLabel":
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.terrlabel,
                            crossOrigin: "anonymous"
                        });
                    default:
                        return new ol.source.XYZ({
                            url: contentUtil.tianditu.road,
                            crossOrigin: "anonymous"
                        })
                }
                break;
            case "baidu":
                return sourceUtil.baiduSource(b);
            case "offline":
                return new ol.source.XYZ({
                    url: b + "/{z}/{x}/{y}.png",
                    crossOrigin: "anonymous"
                });
            default:
                return new ol.source.XYZ({
                    url: contentUtil.googleUrl.road,
                    crossOrigin: "anonymous"
                })
        }
    },
    sourceUtil.baiduSource = function(a) {
        for (var b = ol.proj.get("EPSG:3857"), c = [], d = 0; d < 22; d++)
            c[d] = Math.pow(2, 18 - d);
        var e = new ol.tilegrid.TileGrid({
            origin: [0, 0],
            resolutions: c
        });
        return bdsource = new ol.source.TileImage({
            projection: b,
            tileGrid: e,
            tileUrlFunction: function(b, c, d) {
                if (!b)
                    return "";
                var e = b[0],
                    f = b[1],
                    g = b[2];
                switch (f < 0 && (f = "M" + -f),
                    g < 0 && (g = "M" + -g),
                    a) {
                    case "road":
                        return "http://online1.map.bdimg.com/onlinelabel/?qt=tile&udt=20160514&styles=pl&scaler=1&p=1&x=" + f + "&y=" + g + "&z=" + e;
                    case "sate":
                        return "http://shangetu1.map.bdimg.com/it/u=x=" + f + ";y=" + g + ";z=" + e + ";v=009;type=sate&fm=46&udt=20150601";
                    case "sateLabel":
                        return "http://online1.map.bdimg.com/onlinelabel/?qt=tile&styles=sl&v=083&udt=20161228&p=1&x=" + f + "&y=" + g + "&z=" + e;
                    default:
                        return "http://online1.map.bdimg.com/onlinelabel/?qt=tile&udt=20160514&styles=pl&scaler=1&p=1&x=" + f + "&y=" + g + "&z=" + e
                }
            }
        })
    },
    sourceUtil.wmsSource = function(a, b) {
        return new ol.source.ImageWMS({
            url: a,
            params: {
                LAYERS: b
            }
        })
    },
    sourceUtil.geoJsonSource = function(a, b) {
        return new ol.source.Vector({
            features: featureUtil.readGeojson(a, b)
        })
    },
    sourceUtil.imgStaticSource = function(a, b) {
        return new ol.source.ImageStatic({
            url: a,
            imageExtent: b,
            projection: "EPSG:4326"
        })
    };
export const styleUtil = {};
styleUtil.defaultStyle = function() {
        var a = styleUtil.fillStyle("black"),
            b = styleUtil.strokeStyle({
                color: "black",
                width: 1
            });
        return new ol.style.Style({
            fill: a,
            stroke: b,
            image: new ol.style.Circle({
                radius: 5,
                fill: a
            })
        })
    },
    styleUtil.pointStyle = function(a) {
        return new ol.style.Style({
            image: styleUtil.imageStyle(a),
            text: a.text
        })
    },
    styleUtil.pointTextStyleByAttr = function(a, b, c, d) {
        var d = d ? d : {},
            e = d.text ? d.text : styleUtil.textStyle();
        return e.setText(a.get(c).toString()),
            d.text = e,
            styleUtil.pointStyle(d)
    },
    styleUtil.picStyle = function(a) {
        var b = a.src ? a.src : "",
            c = a.scale ? a.scale : 0;
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: b,
                scale: c
            })
        })
    },
    styleUtil.polygonStyle = function(a) {
        var b = a.fill ? a.fill : styleUtil.fillStyle(),
            c = a.stroke ? a.stroke : styleUtil.strokeStyle(),
            d = a.text ? a.text : styleUtil.textStyle();
        return new ol.style.Style({
            fill: b,
            stroke: c,
            text: d
        })
    },
    styleUtil.imageStyle = function(a) {
        var a = a ? a : {},
            b = a.type ? a.type : "circle",
            c = a.size ? a.size : 5,
            d = a.fill ? a.fill : styleUtil.fillStyle(),
            e = a.stroke ? a.stroke : styleUtil.strokeStyle();
        switch (b) {
            case "circle":
                return new ol.style.Circle({
                    radius: c,
                    fill: d,
                    stroke: e
                });
            case "tria":
                return new ol.style.RegularShape({
                    fill: d,
                    stroke: e,
                    points: 3,
                    radius: c,
                    rotation: Math.PI / 4,
                    angle: 0
                });
            case "square":
                return new ol.style.RegularShape({
                    fill: d,
                    stroke: e,
                    points: 4,
                    radius: c,
                    angle: Math.PI / 4
                });
            case "star":
                return new ol.style.RegularShape({
                    fill: d,
                    stroke: e,
                    points: 5,
                    radius: c[0],
                    radius2: c[1],
                    angle: 0
                });
            case "cross":
                return new ol.style.RegularShape({
                    fill: d,
                    stroke: e,
                    points: 4,
                    radius: c,
                    radius2: 0,
                    angle: 0
                });
            default:
                return new ol.style.Circle({
                    radius: c,
                    fill: d,
                    stroke: e
                })
        }
    },
    styleUtil.fillStyle = function(a) {
        var b = a ? a : "blue";
        return new ol.style.Fill({
            color: b
        })
    },
    styleUtil.strokeStyle = function(a) {
        var b = a ? new ol.style.Stroke({
            color: a.color || "black",
            width: a.width || 1
        }) : void 0;
        return b
    },
    styleUtil.textStyle = function(a) {
        var a = a ? a : {},
            b = new ol.style.Text({
                text: a.text,
                font: a.font,
                offsetX: a.offsetX,
                offsetY: a.offsetY,
                textAlign: a.align ? a.align : "start",
                fill: a.fill || styleUtil.fillStyle(),
                stroke: a.stroke || styleUtil.strokeStyle()
            });
        return b
    },
    styleUtil.textStyleByAttr = function(a, b, c, d) {
        var d = d ? d : {},
            e = new ol.style.Text({
                text: a.get(c).toString(),
                font: d.font,
                offsetX: d.offsetX,
                offsetY: d.offsetY,
                textAlign: d.align ? d.align : "start",
                fill: d.fill || styleUtil.fillStyle(),
                stroke: d.stroke || styleUtil.strokeStyle()
            });
        return e
    };
