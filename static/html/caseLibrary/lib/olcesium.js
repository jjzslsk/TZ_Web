var olcs_unused_var = function(e) {
	var t = {};

	function i(n) {
		if(t[n]) return t[n].exports;
		var r = t[n] = {
			i: n,
			l: !1,
			exports: {}
		};
		return e[n].call(r.exports, r, r.exports, i), r.l = !0, r.exports
	}
	return i.m = e, i.c = t, i.d = function(e, t, n) {
		i.o(e, t) || Object.defineProperty(e, t, {
			enumerable: !0,
			get: n
		})
	}, i.r = function(e) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}, i.t = function(e, t) {
		if(1 & t && (e = i(e)), 8 & t) return e;
		if(4 & t && "object" == typeof e && e && e.__esModule) return e;
		var n = Object.create(null);
		if(i.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: e
			}), 2 & t && "string" != typeof e)
			for(var r in e) i.d(n, r, function(t) {
				return e[t]
			}.bind(null, r));
		return n
	}, i.n = function(e) {
		var t = e && e.__esModule ? function() {
			return e.default
		} : function() {
			return e
		};
		return i.d(t, "a", t), t
	}, i.o = function(e, t) {
		return Object.prototype.hasOwnProperty.call(e, t)
	}, i.p = "", i(i.s = 24)
}([function(e, t) {
	e.exports = ol.proj
}, function(e, t) {
	e.exports = ol.Observable
}, function(e, t) {
	e.exports = ol.layer.Group
}, function(e, t) {
	e.exports = ol.source.Vector
}, function(e, t) {
	e.exports = ol.layer.Image
}, function(e, t) {
	e.exports = ol.source.Cluster
}, function(e, t) {
	e.exports = ol.layer.Vector
}, function(e, t) {
	e.exports = ol.geom.Geometry
}, function(e, t) {
	e.exports = ol.style.Icon
}, function(e, t) {
	e.exports = ol.extent
}, function(e, t) {
	e.exports = ol.geom.Point
}, function(e, t) {
	e.exports = ol.easing
}, function(e, t) {
	e.exports = ol.layer.Tile
}, function(e, t) {
	e.exports = ol.source.ImageStatic
}, function(e, t) {
	e.exports = ol.source.ImageWMS
}, function(e, t) {
	e.exports = ol.source.TileImage
}, function(e, t) {
	e.exports = ol.source.TileWMS
}, function(e, t) {
	e.exports = ol.source.Image
}, function(e, t) {
	e.exports = ol.source
}, function(e, t) {
	e.exports = ol.layer.Layer
}, function(e, t) {
	e.exports = ol.layer.VectorTile
}, function(e, t) {
	e.exports = ol.geom.Polygon
}, function(e, t) {
	e.exports = ol.geom.SimpleGeometry
}, function(e, t) {
	e.exports = ol.Overlay
}, function(e, t, i) {
	"use strict";
	i.r(t);
	i(10);
	var n = i(0),
		r = {};

	function o(e, t, i) {
		return e.on(t, i)
	}
	r.obj = function(e) {
		return e
	}, r.supportsImageRenderingPixelatedResult_ = void 0, r.imageRenderingValueResult_ = void 0, r.supportsImageRenderingPixelated = function() {
		if(void 0 === r.supportsImageRenderingPixelatedResult_) {
			var e = document.createElement("canvas");
			e.setAttribute("style", "image-rendering: -moz-crisp-edges; image-rendering: pixelated;");
			var t = e.style.imageRendering;
			r.supportsImageRenderingPixelatedResult_ = !!t, r.supportsImageRenderingPixelatedResult_ && (r.imageRenderingValueResult_ = t)
		}
		return r.supportsImageRenderingPixelatedResult_
	}, r.imageRenderingValue = function() {
		return r.supportsImageRenderingPixelated(), r.imageRenderingValueResult_ || ""
	}, r.getSourceProjection = function(e) {
		return e.get("olcs.projection") || e.getProjection()
	};
	var a = 0;

	function s(e) {
		return e.olcs_uid || (e.olcs_uid = ++a)
	}

	function u(e) {
		var t = Cesium.GroundPolylinePrimitive;
		return t && t.isSupported(e)
	}
	var l, c = r,
		h = i(11),
		m = i(12),
		d = i.n(m),
		g = i(4),
		f = i.n(g),
		p = i(13),
		v = i.n(p),
		C = i(14),
		y = i.n(C),
		_ = i(15),
		b = i.n(_),
		w = i(16),
		S = i.n(w),
		T = i(17),
		P = i(18),
		L = (l = new P.Tile({
			projection: "EPSG:3857",
			wrapX: !0
		}).getTileCoordForTileUrlFunction([6, -31, 22])) && 33 === l[1] && 22 === l[2],
		R = function() {
			function e(e, t, i) {
				var n = this;
				this.source_ = t, this.projection_ = null, this.fallbackProj_ = i || null, this.ready_ = !1, this.tilingScheme_ = null, this.rectangle_ = null, this.map_ = e;
				var r = this.source_.get("olcs.proxy");
				r && ("function" == typeof r ? this.proxy_ = {
					getURL: r
				} : "string" == typeof r && (this.proxy_ = new Cesium.DefaultProxy(r))), this.errorEvent_ = new Cesium.Event, this.emptyCanvas_ = document.createElement("canvas"), this.emptyCanvas_.width = 1, this.emptyCanvas_.height = 1, this.source_.on("change", (function(e) {
					n.handleSourceChanged_()
				})), this.handleSourceChanged_()
			}
			var t = e.prototype;
			return t.handleSourceChanged_ = function(e) {
				if(!this.ready_ && "ready" == this.source_.getState()) {
					if(this.projection_ = c.getSourceProjection(this.source_) || this.fallbackProj_, this.projection_ == Object(n.get)("EPSG:4326")) this.tilingScheme_ = new Cesium.GeographicTilingScheme;
					else {
						if(this.projection_ != Object(n.get)("EPSG:3857")) return;
						this.tilingScheme_ = new Cesium.WebMercatorTilingScheme
					}
					this.rectangle_ = this.tilingScheme_.rectangle, this.ready_ = !0
				}
			}, t.getTileCredits = function(e, t, i) {
				var n = this.map_.getView().calculateExtent(this.map_.getSize()),
					r = this.map_.getView().getCenter(),
					o = {
						viewState: {
							zoom: this.tilingScheme_ instanceof Cesium.GeographicTilingScheme ? i + 1 : i,
							center: r
						},
						extent: n
					},
					a = this.source_.getAttributions();
				if(!a) return [];
				var s = a(o);
				return Array.isArray(s) || (s = [s]), s.map((function(e) {
					return new Cesium.Credit(e, !0)
				}))
			}, t.requestImage = function(e, t, i) {
				var n = this.source_.getTileUrlFunction();
				if(n && this.projection_) {
					var r = this.tilingScheme_ instanceof Cesium.GeographicTilingScheme ? i + 1 : i,
						o = t;
					L || (o = -t - 1);
					var a = n.call(this.source_, [r, e, o], 1, this.projection_);
					return this.proxy_ && (a = this.proxy_.getURL(a)), a ? Cesium.ImageryProvider.loadImage(this, a) : this.emptyCanvas_
				}
				return this.emptyCanvas_
			}, e
		}();
	Object.defineProperties(R.prototype, {
		ready: {
			get: function() {
				return this.ready_
			}
		},
		rectangle: {
			get: function() {
				return this.rectangle_
			}
		},
		tileWidth: {
			get: function() {
				var e = this.source_.getTileGrid();
				return e ? Array.isArray(e.getTileSize(0)) ? e.getTileSize(0)[0] : e.getTileSize(0) : 256
			}
		},
		tileHeight: {
			get: function() {
				var e = this.source_.getTileGrid();
				return e ? Array.isArray(e.getTileSize(0)) ? e.getTileSize(0)[1] : e.getTileSize(0) : 256
			}
		},
		maximumLevel: {
			get: function() {
				var e = this.source_.getTileGrid();
				return e ? e.getMaxZoom() : 18
			}
		},
		minimumLevel: {
			get: function() {
				return 0
			}
		},
		tilingScheme: {
			get: function() {
				return this.tilingScheme_
			}
		},
		tileDiscardPolicy: {
			get: function() {}
		},
		errorEvent: {
			get: function() {
				return this.errorEvent_
			}
		},
		proxy: {
			get: function() {
				return this.proxy_
			}
		},
		hasAlphaChannel: {
			get: function() {
				return !0
			}
		},
		pickFeatures: {
			get: function() {}
		}
	});
	var E = R,
		O = {
			computePixelSizeAtCoordinate: function(e, t) {
				var i = e.camera,
					n = e.canvas,
					r = i.frustum,
					o = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(i.position, t, new Cesium.Cartesian3)),
					a = new Cesium.Cartesian2;
				return r.getPixelDimensions(n.clientWidth, n.clientHeight, o, a)
			},
			computeBoundingBoxAtTarget: function(e, t, i) {
				var n = O.computePixelSizeAtCoordinate(e, t),
					r = Cesium.Transforms.eastNorthUpToFixedFrame(t),
					o = Cesium.Matrix4.multiplyByPoint(r, new Cesium.Cartesian3(-n.x * i, -n.y * i, 0), new Cesium.Cartesian3),
					a = Cesium.Matrix4.multiplyByPoint(r, new Cesium.Cartesian3(n.x * i, n.y * i, 0), new Cesium.Cartesian3);
				return Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray([o, a])
			},
			applyHeightOffsetToGeometry: function(e, t) {
				e.applyTransform((function(e, i, n) {
					if(void 0 !== n && n >= 3)
						for(var r = 0; r < i.length; r += n) i[r + 2] = i[r + 2] + t;
					return i
				}))
			},
			createMatrixAtCoordinates: function(e, t, i, n) {
				void 0 === t && (t = 0), void 0 === i && (i = Cesium.Cartesian3.ZERO), void 0 === n && (n = new Cesium.Cartesian3(1, 1, 1));
				var r = O.ol4326CoordinateToCesiumCartesian(e),
					o = Cesium.Transforms.eastNorthUpToFixedFrame(r),
					a = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -t),
					s = Cesium.Matrix4.fromTranslationQuaternionRotationScale(i, a, n);
				return Cesium.Matrix4.multiply(o, s, new Cesium.Matrix4)
			},
			rotateAroundAxis: function(e, t, i, n, r) {
				var o = Cesium.Math.clamp,
					a = Cesium.defaultValue,
					s = r || {},
					u = a(s.duration, 500),
					l = a(s.easing, h.linear),
					c = s.callback,
					m = 0,
					d = new Cesium.Matrix4,
					g = Date.now();
				window.requestAnimationFrame((function r() {
					var a = Date.now(),
						s = l(o((a - g) / u, 0, 1));
					e.transform.clone(d);
					var h = (s - m) * t;
					m = s, e.lookAtTransform(n), e.rotate(i, h), e.lookAtTransform(d), s < 1 ? window.requestAnimationFrame(r) : c && c()
				}))
			},
			setHeadingUsingBottomCenter: function(e, t, i, n) {
				var r = e.camera,
					o = O.computeAngleToZenith(e, i),
					a = r.right,
					s = Cesium.Quaternion.fromAxisAngle(a, o),
					u = Cesium.Matrix3.fromQuaternion(s),
					l = new Cesium.Cartesian3;
				Cesium.Cartesian3.subtract(r.position, i, l);
				var c = new Cesium.Cartesian3;
				Cesium.Matrix3.multiplyByVector(u, l, c), Cesium.Cartesian3.add(c, i, c);
				var h = Cesium.Matrix4.fromTranslation(c);
				(0, O.rotateAroundAxis)(r, t, c, h, n)
			},
			pickOnTerrainOrEllipsoid: function(e, t) {
				var i = e.camera.getPickRay(t);
				return e.globe.pick(i, e) || e.camera.pickEllipsoid(t)
			},
			pickBottomPoint: function(e) {
				var t = e.canvas,
					i = new Cesium.Cartesian2(t.clientWidth / 2, t.clientHeight);
				return O.pickOnTerrainOrEllipsoid(e, i)
			},
			pickCenterPoint: function(e) {
				var t = e.canvas,
					i = new Cesium.Cartesian2(t.clientWidth / 2, t.clientHeight / 2);
				return O.pickOnTerrainOrEllipsoid(e, i)
			},
			computeSignedTiltAngleOnGlobe: function(e) {
				var t = e.camera,
					i = new Cesium.Ray(t.position, t.direction),
					n = e.globe.pick(i, e);
				if(!n) {
					var r = Cesium.Ellipsoid.WGS84,
						o = Cesium.IntersectionTests.rayEllipsoid(i, r);
					o && (n = Cesium.Ray.getPoint(i, o.start))
				}
				if(n) {
					var a = new Cesium.Cartesian3;
					Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(n, a);
					var s = (0, O.signedAngleBetween)(t.direction, a, t.right) - Math.PI;
					return Cesium.Math.convertLongitudeRange(s)
				}
			},
			bottomFovRay: function(e) {
				var t = e.camera,
					i = t.frustum.fovy / 2,
					n = t.direction,
					r = Cesium.Quaternion.fromAxisAngle(t.right, i),
					o = Cesium.Matrix3.fromQuaternion(r),
					a = new Cesium.Cartesian3;
				return Cesium.Matrix3.multiplyByVector(o, n, a), new Cesium.Ray(t.position, a)
			},
			signedAngleBetween: function(e, t, i) {
				var n = new Cesium.Cartesian3,
					r = new Cesium.Cartesian3,
					o = new Cesium.Cartesian3;
				Cesium.Cartesian3.normalize(e, n), Cesium.Cartesian3.normalize(t, r), Cesium.Cartesian3.cross(n, r, o);
				var a = Cesium.Cartesian3.dot(n, r),
					s = Cesium.Cartesian3.magnitude(o),
					u = Cesium.Cartesian3.dot(i, o),
					l = Math.atan2(s, a);
				return u >= 0 ? l : -l
			},
			computeAngleToZenith: function(e, t) {
				var i = e.camera,
					n = i.frustum.fovy / 2,
					r = O.bottomFovRay(e),
					o = Cesium.Cartesian3.clone(r.direction);
				Cesium.Cartesian3.negate(o, o);
				var a = new Cesium.Cartesian3;
				Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(t, a);
				var s = new Cesium.Cartesian3;
				return Cesium.Cartesian3.negate(i.right, s), O.signedAngleBetween(a, o, s) + n
			},
			extentToRectangle: function(e, t) {
				if(e && t) {
					var i = Object(n.transformExtent)(e, t, "EPSG:4326");
					return Cesium.Rectangle.fromDegrees(i[0], i[1], i[2], i[3])
				}
				return null
			},
			tileLayerToImageryLayer: function(e, t, i) {
				if(!(t instanceof d.a || t instanceof f.a)) return null;
				var n = null,
					r = t.getSource();
				if(r instanceof y.a && r.getUrl() && r.getImageLoadFunction() === T.defaultImageLoadFunction) {
					var o = {
						"olcs.proxy": r.get("olcs.proxy"),
						"olcs.extent": r.get("olcs.extent"),
						"olcs.projection": r.get("olcs.projection"),
						"olcs.imagesource": r
					};
					(r = new S.a({
						url: r.getUrl(),
						attributions: r.getAttributions(),
						projection: r.getProjection(),
						params: r.getParams()
					})).setProperties(o)
				}
				if(r instanceof b.a) {
					var a = c.getSourceProjection(r);
					if(a || (a = i), !O.isCesiumProjection(a)) return null;
					n = new E(e, r, i)
				} else {
					if(!(r instanceof v.a)) return null;
					var s = c.getSourceProjection(r);
					if(s || (s = i), !O.isCesiumProjection(s)) return null;
					n = new Cesium.SingleTileImageryProvider({
						url: r.getUrl(),
						rectangle: new Cesium.Rectangle.fromDegrees(r.getImageExtent()[0], r.getImageExtent()[1], r.getImageExtent()[2], r.getImageExtent()[3])
					})
				}
				var u = {},
					l = t.get("olcs.extent") || t.getExtent();
				return l && (u.rectangle = O.extentToRectangle(l, i)), new Cesium.ImageryLayer(n, u)
			},
			updateCesiumLayerProperties: function(e, t) {
				var i = 1,
					n = !0;
				[e.layer].concat(e.parents).forEach((function(e) {
					var t = e.getOpacity();
					void 0 !== t && (i *= t);
					var r = e.getVisible();
					void 0 !== r && (n &= r)
				})), t.alpha = i, t.show = n
			},
			ol4326CoordinateToCesiumCartesian: function(e) {
				var t = e;
				return t.length > 2 ? Cesium.Cartesian3.fromDegrees(t[0], t[1], t[2]) : Cesium.Cartesian3.fromDegrees(t[0], t[1])
			},
			ol4326CoordinateArrayToCsCartesians: function(e) {
				for(var t = O.ol4326CoordinateToCesiumCartesian, i = [], n = 0; n < e.length; ++n) i.push(t(e[n]));
				return i
			},
			olGeometryCloneTo4326: function(e, t) {
				var i = Object(n.get)("EPSG:4326"),
					r = Object(n.get)(t);
				if(r !== i) {
					var o = e.getProperties();
					(e = e.clone()).transform(r, i), e.setProperties(o)
				}
				return e
			},
			convertColorToCesium: function(e) {
				if(e = e || "black", Array.isArray(e)) return new Cesium.Color(Cesium.Color.byteToFloat(e[0]), Cesium.Color.byteToFloat(e[1]), Cesium.Color.byteToFloat(e[2]), e[3]);
				if("string" == typeof e) return Cesium.Color.fromCssColorString(e);
				if(e instanceof CanvasPattern || e instanceof CanvasGradient) {
					var t = document.createElement("canvas"),
						i = t.getContext("2d");
					return t.width = t.height = 256, i.fillStyle = e, i.fillRect(0, 0, t.width, t.height), new Cesium.ImageMaterialProperty({
						image: t
					})
				}
			},
			convertUrlToCesium: function(e) {
				var t = "",
					i = /\{(\d|[a-z])-(\d|[a-z])\}/,
					n = i.exec(e);
				if(n) {
					e = e.replace(i, "{s}");
					var r, o = n[1].charCodeAt(0),
						a = n[2].charCodeAt(0);
					for(r = o; r <= a; ++r) t += String.fromCharCode(r)
				}
				return {
					url: e,
					subdomains: t
				}
			},
			resetToNorthZenith: function(e, t) {
				return new Promise((function(i, n) {
					var r = t.camera,
						o = O.pickBottomPoint(t);
					if(o) {
						var a = e.getView().getRotation();
						if(void 0 !== a) {
							var s = O.computeAngleToZenith(t, o);
							O.setHeadingUsingBottomCenter(t, a, o);
							var u = Cesium.Matrix4.fromTranslation(o),
								l = r.right,
								c = {
									callback: function() {
										var t = e.getView();
										O.normalizeView(t), i()
									}
								};
							O.rotateAroundAxis(r, -s, l, u, c)
						} else n("The view is not initialized")
					} else n("Could not get bottom pivot")
				}))
			},
			rotateAroundBottomCenter: function(e, t) {
				return new Promise((function(i, n) {
					var r = e.camera,
						o = O.pickBottomPoint(e);
					if(o) {
						var a = {
								callback: i
							},
							s = Cesium.Matrix4.fromTranslation(o),
							u = r.right;
						(0, O.rotateAroundAxis)(r, -t, u, s, a)
					} else n("could not get bottom pivot")
				}))
			},
			normalizeView: function(e, t) {
				void 0 === t && (t = 0);
				var i = e.getResolution();
				e.setRotation(t), e.setResolution(e.constrainResolution(i))
			},
			isCesiumProjection: function(e) {
				var t = e === Object(n.get)("EPSG:3857"),
					i = e === Object(n.get)("EPSG:4326");
				return t || i
			}
		},
		x = O,
		A = function() {
			function e(e) {
				this.ol3d = e, this.scene_ = e.getCesiumScene(), this.canvas_ = this.scene_.canvas, this._boundNotifyRepaintRequired = this.notifyRepaintRequired.bind(this), this.repaintEventNames_ = ["mousemove", "mousedown", "mouseup", "touchstart", "touchend", "touchmove", "pointerdown", "pointerup", "pointermove", "wheel"], this.enable()
			}
			var t = e.prototype;
			return t.enable = function() {
				this.scene_.requestRenderMode = !0, this.scene_.maximumRenderTimeChange = 1e3;
				var e = this.repaintEventNames_,
					t = Array.isArray(e),
					i = 0;
				for(e = t ? e : e[Symbol.iterator]();;) {
					var n;
					if(t) {
						if(i >= e.length) break;
						n = e[i++]
					} else {
						if((i = e.next()).done) break;
						n = i.value
					}
					var r = n;
					this.canvas_.addEventListener(r, this._boundNotifyRepaintRequired, !1)
				}
				window.addEventListener("resize", this._boundNotifyRepaintRequired, !1), this.ol3d.getOlMap().getLayerGroup().on("change", this._boundNotifyRepaintRequired)
			}, t.disable = function() {
				var e = this.repaintEventNames_,
					t = Array.isArray(e),
					i = 0;
				for(e = t ? e : e[Symbol.iterator]();;) {
					var n;
					if(t) {
						if(i >= e.length) break;
						n = e[i++]
					} else {
						if((i = e.next()).done) break;
						n = i.value
					}
					var r = n;
					this.canvas_.removeEventListener(r, this._boundNotifyRepaintRequired, !1)
				}
				window.removeEventListener("resize", this._boundNotifyRepaintRequired, !1), this.ol3d.getOlMap().getLayerGroup().un("change", this._boundNotifyRepaintRequired), this.scene_.requestRenderMode = !1
			}, t.restartRenderLoop = function() {
				this.notifyRepaintRequired()
			}, t.notifyRepaintRequired = function() {
				this.scene_.requestRender()
			}, e
		}(),
		G = i(1),
		I = i.n(G);

	function M(e) {
		return 180 * e / Math.PI
	}

	function F(e) {
		return e * Math.PI / 180
	}
	var k = function() {
			function e(t, i) {
				var n = this;
				this.scene_ = t, this.cam_ = t.camera, this.map_ = i, this.view_ = null, this.viewListenKey_ = null, this.toLonLat_ = e.identityProjection, this.fromLonLat_ = e.identityProjection, this.tilt_ = 0, this.distance_ = 0, this.lastCameraViewMatrix_ = null, this.viewUpdateInProgress_ = !1, this.map_.on("change:view", (function(e) {
					n.setView_(n.map_.getView())
				})), this.setView_(this.map_.getView())
			}
			e.identityProjection = function(e, t, i) {
				var n = i || e.length;
				if(t)
					for(var r = 0; r < n; ++r) t[r] = e[r];
				return e
			};
			var t = e.prototype;
			return t.setView_ = function(t) {
				var i = this;
				if(this.view_ && (Object(G.unByKey)(this.viewListenKey_), this.viewListenKey_ = null), this.view_ = t, t) {
					var r = Object(n.getTransform)(t.getProjection(), "EPSG:4326"),
						o = Object(n.getTransform)("EPSG:4326", t.getProjection());
					this.toLonLat_ = r, this.fromLonLat_ = o, this.viewListenKey_ = t.on("propertychange", (function(e) {
						return i.handleViewEvent_(e)
					})), this.readFromView()
				} else this.toLonLat_ = e.identityProjection, this.fromLonLat_ = e.identityProjection
			}, t.handleViewEvent_ = function(e) {
				this.viewUpdateInProgress_ || this.readFromView()
			}, t.setHeading = function(e) {
				this.view_ && this.view_.setRotation(e)
			}, t.getHeading = function() {
				if(this.view_) return this.view_.getRotation() || 0
			}, t.setTilt = function(e) {
				this.tilt_ = e, this.updateCamera_()
			}, t.getTilt = function() {
				return this.tilt_
			}, t.setDistance = function(e) {
				this.distance_ = e, this.updateCamera_(), this.updateView()
			}, t.getDistance = function() {
				return this.distance_
			}, t.setCenter = function(e) {
				this.view_ && this.view_.setCenter(e)
			}, t.getCenter = function() {
				if(this.view_) return this.view_.getCenter()
			}, t.setPosition = function(e) {
				if(this.toLonLat_) {
					var t = this.toLonLat_(e),
						i = new Cesium.Cartographic(F(t[0]), F(t[1]), this.getAltitude());
					this.cam_.setView({
						destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(i)
					}), this.updateView()
				}
			}, t.getPosition = function() {
				if(this.fromLonLat_) {
					var e = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);
					return this.fromLonLat_([M(e.longitude), M(e.latitude)])
				}
			}, t.setAltitude = function(e) {
				var t = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);
				t.height = e, this.cam_.position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(t), this.updateView()
			}, t.getAltitude = function() {
				return Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position).height
			}, t.updateCamera_ = function() {
				if(this.view_ && this.toLonLat_) {
					var e = this.view_.getCenter();
					if(e) {
						var t = this.toLonLat_(e),
							i = new Cesium.Cartographic(F(t[0]), F(t[1]));
						if(this.scene_.globe) {
							var n = this.scene_.globe.getHeight(i);
							i.height = n || 0
						}
						var r = Cesium.Ellipsoid.WGS84.cartographicToCartesian(i),
							o = {
								pitch: this.tilt_ - Cesium.Math.PI_OVER_TWO,
								heading: -this.view_.getRotation(),
								roll: void 0
							};
						this.cam_.setView({
							destination: r,
							orientation: o
						}), this.cam_.moveBackward(this.distance_), this.checkCameraChange(!0)
					}
				}
			}, t.readFromView = function() {
				if(this.view_ && this.toLonLat_) {
					var e = this.view_.getCenter();
					if(null != e) {
						var t = this.toLonLat_(e),
							i = this.view_.getResolution();
						this.distance_ = this.calcDistanceForResolution(i || 0, F(t[1])), this.updateCamera_()
					}
				}
			}, t.updateView = function() {
				if(this.view_ && this.fromLonLat_) {
					this.viewUpdateInProgress_ = !0;
					var e = Cesium.Ellipsoid.WGS84,
						t = this.scene_,
						i = x.pickCenterPoint(t),
						n = i;
					if(!n) {
						var r = t.globe,
							o = this.cam_.positionCartographic.clone(),
							a = r.getHeight(o);
						o.height = a || 0, n = Cesium.Ellipsoid.WGS84.cartographicToCartesian(o)
					}
					this.distance_ = Cesium.Cartesian3.distance(n, this.cam_.position);
					var s = e.cartesianToCartographic(n);
					if(this.view_.setCenter(this.fromLonLat_([M(s.longitude), M(s.latitude)])), this.view_.setResolution(this.calcResolutionForDistance(this.distance_, s ? s.latitude : 0)), i) {
						var u = this.cam_.position,
							l = new Cesium.Cartesian3;
						e.geocentricSurfaceNormal(i, l);
						var c = new Cesium.Cartesian3;
						Cesium.Cartesian3.subtract(u, i, c), Cesium.Cartesian3.normalize(c, c);
						var h = this.cam_.up,
							m = this.cam_.right,
							d = new Cesium.Cartesian3(-i.y, i.x, 0),
							g = Cesium.Cartesian3.angleBetween(m, d),
							f = Cesium.Cartesian3.cross(i, h, new Cesium.Cartesian3).z;
						this.view_.setRotation(f < 0 ? g : -g);
						var p = Math.acos(Cesium.Cartesian3.dot(l, c));
						this.tilt_ = isNaN(p) ? 0 : p
					} else this.view_.setRotation(this.cam_.heading), this.tilt_ = -this.cam_.pitch + Math.PI / 2;
					this.viewUpdateInProgress_ = !1
				}
			}, t.checkCameraChange = function(e) {
				var t = this.lastCameraViewMatrix_,
					i = this.cam_.viewMatrix;
				t && Cesium.Matrix4.equalsEpsilon(t, i, 1e-5) || (this.lastCameraViewMatrix_ = i.clone(), !0 !== e && this.updateView())
			}, t.calcDistanceForResolution = function(e, t) {
				var i = this.scene_.canvas,
					n = this.cam_.frustum.fovy,
					r = this.view_.getProjection().getMetersPerUnit();
				return e * i.clientHeight * r * Math.cos(Math.abs(t)) / 2 / Math.tan(n / 2)
			}, t.calcResolutionForDistance = function(e, t) {
				var i = this.scene_.canvas,
					n = this.cam_.frustum.fovy,
					r = this.view_.getProjection().getMetersPerUnit();
				return 2 * e * Math.tan(n / 2) / r / Math.cos(Math.abs(t)) / i.clientHeight
			}, e
		}(),
		j = i(2),
		V = i.n(j),
		D = function() {
			function e(e, t) {
				this.map = e, this.view = e.getView(), this.scene = t, this.olLayers = e.getLayerGroup().getLayers(), this.mapLayerGroup = e.getLayerGroup(), this.layerMap = {}, this.olLayerListenKeys = {}, this.olGroupListenKeys_ = {}
			}
			var t = e.prototype;
			return t.synchronize = function() {
				this.destroyAll(), this.addLayers_(this.mapLayerGroup)
			}, t.orderLayers = function() {}, t.addLayers_ = function(e) {
				for(var t = this, i = [{
						layer: e,
						parents: []
					}], n = function() {
						var e = i.splice(0, 1)[0],
							n = e.layer,
							r = s(n).toString();
						t.olLayerListenKeys[r] = [];
						var a = null;
						if(n instanceof V.a) t.listenForGroupChanges_(n), n !== t.mapLayerGroup && (a = t.createSingleLayerCounterparts(e)), a || n.getLayers().forEach((function(r) {
							if(r) {
								var o = {
									layer: r,
									parents: n === t.mapLayerGroup ? [] : [e.layer].concat(e.parents)
								};
								i.push(o)
							}
						}));
						else if(!(a = t.createSingleLayerCounterparts(e))) {
							var u = r,
								l = e;
							t.olLayerListenKeys[r].push(o(l.layer, "change", (function e(i) {
								var n = t.createSingleLayerCounterparts(l);
								n && (l.layer.un("change", e), t.addCesiumObjects_(n, u, l.layer), t.orderLayers())
							})))
						}
						a && t.addCesiumObjects_(a, r, n)
					}; i.length > 0;) n();
				this.orderLayers()
			}, t.addCesiumObjects_ = function(e, t, i) {
				var n = this;
				this.layerMap[t] = e, this.olLayerListenKeys[t].push(o(i, "change:zIndex", (function() {
					return n.orderLayers()
				}))), e.forEach((function(e) {
					n.addCesiumObject(e)
				}))
			}, t.removeAndDestroySingleLayer_ = function(e) {
				var t = this,
					i = s(e).toString(),
					n = this.layerMap[i];
				return n && (n.forEach((function(e) {
					t.removeSingleCesiumObject(e, !1), t.destroyCesiumObject(e)
				})), this.olLayerListenKeys[i].forEach(G.unByKey), delete this.olLayerListenKeys[i]), delete this.layerMap[i], !!n
			}, t.unlistenSingleGroup_ = function(e) {
				if(e !== this.mapLayerGroup) {
					var t = s(e).toString();
					this.olGroupListenKeys_[t].forEach((function(e) {
						Object(G.unByKey)(e)
					})), delete this.olGroupListenKeys_[t], delete this.layerMap[t]
				}
			}, t.removeLayer_ = function(e) {
				var t = this;
				e && function() {
					for(var i = [e]; i.length > 0;) {
						var n = i.splice(0, 1)[0],
							r = t.removeAndDestroySingleLayer_(n);
						n instanceof V.a && (t.unlistenSingleGroup_(n), r || n.getLayers().forEach((function(e) {
							i.push(e)
						})))
					}
				}()
			}, t.listenForGroupChanges_ = function(e) {
				var t = s(e).toString(),
					i = [];
				this.olGroupListenKeys_[t] = i;
				var n = [],
					r = function() {
						var t = this,
							r = e.getLayers();
						r && (n = [r.on("add", (function(e) {
							t.addLayers_(e.element)
						})), r.on("remove", (function(e) {
							t.removeLayer_(e.element)
						}))], i.push.apply(i, n))
					}.bind(this);
				r(), i.push(e.on("change:layers", (function(e) {
					n.forEach((function(e) {
						var t = i.indexOf(e);
						t >= 0 && i.splice(t, 1), Object(G.unByKey)(e)
					})), r()
				})))
			}, t.destroyAll = function() {
				var e;
				for(e in this.removeAllCesiumObjects(!0), this.olGroupListenKeys_) {
					this.olGroupListenKeys_[e].forEach(G.unByKey)
				}
				for(e in this.olLayerListenKeys) this.olLayerListenKeys[e].forEach(G.unByKey);
				this.olGroupListenKeys_ = {}, this.olLayerListenKeys = {}, this.layerMap = {}
			}, t.addCesiumObject = function(e) {}, t.destroyCesiumObject = function(e) {}, t.removeSingleCesiumObject = function(e, t) {}, t.removeAllCesiumObjects = function(e) {}, t.createSingleLayerCounterparts = function(e) {}, e
		}();
	var N = function(e) {
			var t, i;

			function n(t, i) {
				var n;
				return(n = e.call(this, t, i) || this).cesiumLayers_ = i.imageryLayers, n.ourLayers_ = new Cesium.ImageryLayerCollection, n
			}
			i = e, (t = n).prototype = Object.create(i.prototype), t.prototype.constructor = t, t.__proto__ = i;
			var r = n.prototype;
			return r.addCesiumObject = function(e) {
				this.cesiumLayers_.add(e), this.ourLayers_.add(e)
			}, r.destroyCesiumObject = function(e) {
				e.destroy()
			}, r.removeSingleCesiumObject = function(e, t) {
				this.cesiumLayers_.remove(e, t), this.ourLayers_.remove(e, !1)
			}, r.removeAllCesiumObjects = function(e) {
				for(var t = 0; t < this.ourLayers_.length; ++t) this.cesiumLayers_.remove(this.ourLayers_.get(t), e);
				this.ourLayers_.removeAll(!1)
			}, r.convertLayerToCesiumImageries = function(e, t) {
				var i = x.tileLayerToImageryLayer(this.map, e, t);
				return i ? [i] : null
			}, r.createSingleLayerCounterparts = function(e) {
				var t = this,
					i = e.layer,
					n = s(i).toString(),
					r = this.view.getProjection(),
					o = this.convertLayerToCesiumImageries(i, r);
				if(o) {
					var a, u = [];
					[e.layer].concat(e.parents).forEach((function(t) {
						u.push(t.on(["change:opacity", "change:visible"], (function() {
							for(var t = 0; t < o.length; ++t) x.updateCesiumLayerProperties(e, o[t])
						})))
					}));
					for(var l = 0; l < o.length; ++l) x.updateCesiumLayerProperties(e, o[l]);
					u.push(i.on("change:extent", (function(e) {
						for(var n = 0; n < o.length; ++n) t.cesiumLayers_.remove(o[n], !0), t.ourLayers_.remove(o[n], !1);
						delete t.layerMap[s(i)], t.synchronize()
					}))), u.push(i.on("change", (function(e) {
						for(var i = 0; i < o.length; ++i) {
							var n = t.cesiumLayers_.indexOf(o[i]);
							n >= 0 && (t.cesiumLayers_.remove(o[i], !1), t.cesiumLayers_.add(o[i], n))
						}
					}))), (a = this.olLayerListenKeys[n]).push.apply(a, u)
				}
				return Array.isArray(o) ? o : null
			}, r.orderLayers = function() {
				for(var e = this, t = [], i = {}, n = [this.mapLayerGroup]; n.length > 0;) {
					var r = n.splice(0, 1)[0];
					if(t.push(r), i[s(r)] = r.getZIndex() || 0, r instanceof V.a) {
						var o = r.getLayers();
						o && n.unshift.apply(n, o.getArray())
					}
				}! function(e, t) {
					for(var i = e.length, n = Array(e.length), r = 0; r < i; r++) n[r] = {
						index: r,
						value: e[r]
					};
					n.sort((function(e, i) {
						return t(e.value, i.value) || e.index - i.index
					}));
					for(var o = 0; o < e.length; o++) e[o] = n[o].value
				}(t, (function(e, t) {
					return i[s(e)] - i[s(t)]
				})), t.forEach((function(t) {
					var i = s(t).toString(),
						n = e.layerMap[i];
					n && n.forEach((function(t) {
						e.raiseToTop(t)
					}))
				}))
			}, r.raiseToTop = function(e) {
				this.cesiumLayers_.raiseToTop(e)
			}, n
		}(D),
		B = (i(3), i(19), i(5)),
		H = i.n(B),
		z = i(6),
		U = i.n(z),
		W = i(20),
		K = i.n(W),
		q = i(7),
		Z = i.n(q),
		Q = i(8),
		Y = i.n(Q),
		X = i(21),
		J = i(9),
		$ = i(22),
		ee = i.n($),
		te = function() {
			function e(e, t) {
				var i = new Cesium.BillboardCollection({
						scene: t
					}),
					n = new Cesium.PrimitiveCollection;
				this.olListenKeys = [], this.rootCollection_ = new Cesium.PrimitiveCollection, this.context = {
					projection: e,
					billboards: i,
					featureToCesiumMap: {},
					primitives: n
				}, this.rootCollection_.add(i), this.rootCollection_.add(n)
			}
			var t = e.prototype;
			return t.destroy = function() {
				this.olListenKeys.forEach(G.unByKey), this.olListenKeys.length = 0
			}, t.getRootPrimitive = function() {
				return this.rootCollection_
			}, e
		}(),
		ie = function() {
			function e(e) {
				this.scene = e, this.boundOnRemoveOrClearFeatureListener_ = this.onRemoveOrClearFeature_.bind(this), this.defaultBillboardEyeOffset_ = new Cesium.Cartesian3(0, 0, 10)
			}
			var t = e.prototype;
			return t.onRemoveOrClearFeature_ = function(e) {
				var t = e.target,
					i = c.obj(t).olcs_cancellers;
				if(i) {
					var n = e.feature;
					if(n) {
						var r = s(n),
							o = i[r];
						o && (o(), delete i[r])
					} else {
						for(var a in i) i.hasOwnProperty(a) && i[a]();
						c.obj(t).olcs_cancellers = {}
					}
				}
			}, t.setReferenceForPicking = function(e, t, i) {
				i.olLayer = e, i.olFeature = t
			}, t.createColoredPrimitive = function(e, t, i, n, r, o) {
				var a = {
					flat: !0,
					renderState: {
						depthTest: {
							enabled: !0
						}
					}
				};
				void 0 !== o && (a.renderState || (a.renderState = {}), a.renderState.lineWidth = o);
				var s, u = function(e, t) {
					var i = new Cesium.GeometryInstance({
						geometry: e
					});
					return !t || t instanceof Cesium.ImageMaterialProperty || (i.attributes = {
						color: Cesium.ColorGeometryInstanceAttribute.fromColor(t)
					}), i
				}(n, r);
				if(this.getHeightReference(e, t, i) === Cesium.HeightReference.CLAMP_TO_GROUND) {
					var l = u.geometry.constructor;
					if(l && !l.createShadowVolume) return null;
					s = new Cesium.GroundPrimitive({
						geometryInstances: u
					})
				} else s = new Cesium.Primitive({
					geometryInstances: u
				});
				if(r instanceof Cesium.ImageMaterialProperty) {
					var c = r.image.getValue().toDataURL();
					s.appearance = new Cesium.MaterialAppearance({
						flat: !0,
						renderState: {
							depthTest: {
								enabled: !0
							}
						},
						material: new Cesium.Material({
							fabric: {
								type: "Image",
								uniforms: {
									image: c
								}
							}
						})
					})
				} else s.appearance = new Cesium.PerInstanceColorAppearance(a);
				return this.setReferenceForPicking(e, t, s), s
			}, t.extractColorFromOlStyle = function(e, t) {
				var i = e.getFill() ? e.getFill().getColor() : null,
					n = e.getStroke() ? e.getStroke().getColor() : null,
					r = "black";
				return n && t ? r = n : i && (r = i), x.convertColorToCesium(r)
			}, t.extractLineWidthFromOlStyle = function(e) {
				var t = e.getStroke() ? e.getStroke().getWidth() : void 0;
				return void 0 !== t ? t : 1
			}, t.wrapFillAndOutlineGeometries = function(e, t, i, n, r, o) {
				var a = this.extractColorFromOlStyle(o, !1),
					s = this.extractColorFromOlStyle(o, !0),
					u = new Cesium.PrimitiveCollection;
				if(o.getFill()) {
					var l = this.createColoredPrimitive(e, t, i, n, a);
					u.add(l)
				}
				if(o.getStroke() && r) {
					var c = this.extractLineWidthFromOlStyle(o),
						h = this.createColoredPrimitive(e, t, i, r, s, c);
					h && u.add(h)
				}
				return u
			}, t.addTextStyle = function(e, t, i, n, r) {
				var o;
				if(r instanceof Cesium.PrimitiveCollection ? o = r : (o = new Cesium.PrimitiveCollection).add(r), !n.getText()) return o;
				var a = n.getText(),
					s = this.olGeometry4326TextPartToCesium(e, t, i, a);
				return s && o.add(s), o
			}, t.csAddBillboard = function(e, t, i, n, r, o) {
				t.eyeOffset || (t.eyeOffset = this.defaultBillboardEyeOffset_);
				var a = e.add(t);
				return this.setReferenceForPicking(i, n, a), a
			}, t.olCircleGeometryToCesium = function(e, t, i, n, r) {
				var o = this,
					a = (i = x.olGeometryCloneTo4326(i, n)).getCenter(),
					s = 3 == a.length ? a[2] : 0,
					l = a.slice();
				l[0] += i.getRadius(), a = x.ol4326CoordinateToCesiumCartesian(a), l = x.ol4326CoordinateToCesiumCartesian(l);
				var c, h, m = Cesium.Cartesian3.distance(a, l),
					d = new Cesium.CircleGeometry({
						center: a,
						radius: m,
						height: s
					});
				if(this.getHeightReference(e, t, i) === Cesium.HeightReference.CLAMP_TO_GROUND) {
					var g = this.extractLineWidthFromOlStyle(r);
					if(g) {
						var f = Object(X.circular)(i.getCenter(), m),
							p = x.ol4326CoordinateArrayToCsCartesians(f.getLinearRing(0).getCoordinates());
						if(u(this.scene))(c = new Cesium.GroundPolylinePrimitive({
							geometryInstances: new Cesium.GeometryInstance({
								geometry: new Cesium.GroundPolylineGeometry({
									positions: p,
									width: g
								})
							}),
							appearance: new Cesium.PolylineMaterialAppearance({
								material: this.olStyleToCesium(t, r, !0)
							}),
							classificationType: Cesium.ClassificationType.TERRAIN
						})).readyPromise.then((function() {
							o.setReferenceForPicking(e, t, c._primitive)
						}));
						else {
							var v = this.extractColorFromOlStyle(r, !0);
							c = this.createStackedGroundCorridors(e, t, g, v, p)
						}
					}
				} else h = new Cesium.CircleOutlineGeometry({
					center: a,
					radius: m,
					extrudedHeight: s,
					height: s
				});
				var C = this.wrapFillAndOutlineGeometries(e, t, i, d, h, r);
				return c && C.add(c), this.addTextStyle(e, t, i, r, C)
			}, t.createStackedGroundCorridors = function(e, t, i, n, r) {
				Array.isArray(r[0]) || (r = [r]), i = Math.max(3, i);
				for(var o = [], a = 0, s = 0, u = [1e3, 4e3, 16e3, 64e3, 254e3, 1e6, 1e7]; s < u.length; s++) {
					var l = u[s],
						c = {
							width: i *= 2.14,
							vertexFormat: Cesium.VertexFormat.POSITION_ONLY
						},
						h = r,
						m = Array.isArray(h),
						d = 0;
					for(h = m ? h : h[Symbol.iterator]();;) {
						var g;
						if(m) {
							if(d >= h.length) break;
							g = h[d++]
						} else {
							if((d = h.next()).done) break;
							g = d.value
						}
						var f = g;
						c.positions = f, o.push(new Cesium.GeometryInstance({
							geometry: new Cesium.CorridorGeometry(c),
							attributes: {
								color: Cesium.ColorGeometryInstanceAttribute.fromColor(n),
								distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(a, l - 1)
							}
						}))
					}
					a = l
				}
				return new Cesium.GroundPrimitive({
					geometryInstances: o
				})
			}, t.olLineStringGeometryToCesium = function(e, t, i, n, r) {
				var o = this;
				i = x.olGeometryCloneTo4326(i, n);
				var a, s = x.ol4326CoordinateArrayToCsCartesians(i.getCoordinates()),
					l = this.extractLineWidthFromOlStyle(r),
					c = this.getHeightReference(e, t, i);
				if(c !== Cesium.HeightReference.CLAMP_TO_GROUND || u(this.scene)) {
					var h = new Cesium.PolylineMaterialAppearance({
							material: this.olStyleToCesium(t, r, !0)
						}),
						m = {
							positions: s,
							width: l
						},
						d = {
							appearance: h
						};
					if(c === Cesium.HeightReference.CLAMP_TO_GROUND) {
						var g = new Cesium.GroundPolylineGeometry(m);
						d.geometryInstances = new Cesium.GeometryInstance({
							geometry: g
						}), (a = new Cesium.GroundPolylinePrimitive(d)).readyPromise.then((function() {
							o.setReferenceForPicking(e, t, a._primitive)
						}))
					} else {
						m.vertexFormat = h.vertexFormat;
						var f = new Cesium.PolylineGeometry(m);
						d.geometryInstances = new Cesium.GeometryInstance({
							geometry: f
						}), a = new Cesium.Primitive(d)
					}
				} else {
					var p = this.extractColorFromOlStyle(r, !0);
					a = this.createStackedGroundCorridors(e, t, l, p, s)
				}
				return this.setReferenceForPicking(e, t, a), this.addTextStyle(e, t, i, r, a)
			}, t.olPolygonGeometryToCesium = function(e, t, i, n, r) {
				var o = this;
				i = x.olGeometryCloneTo4326(i, n);
				var a, s, l, c = this.getHeightReference(e, t, i);
				if(5 == i.getCoordinates()[0].length && "rectangle" === t.getGeometry().get("olcs.polygon_kind")) {
					var h = i.getCoordinates()[0],
						m = Object(J.boundingExtent)(h),
						d = Cesium.Rectangle.fromDegrees(m[0], m[1], m[2], m[3]),
						g = 0;
					if(3 == h[0].length)
						for(var f = 0; f < h.length; f++) g = Math.max(g, h[f][2]);
					a = new Cesium.RectangleGeometry({
						ellipsoid: Cesium.Ellipsoid.WGS84,
						rectangle: d,
						height: g
					}), s = new Cesium.RectangleOutlineGeometry({
						ellipsoid: Cesium.Ellipsoid.WGS84,
						rectangle: d,
						height: g
					})
				} else {
					for(var p = i.getLinearRings(), v = {}, C = v, y = 0; y < p.length; ++y) {
						var _ = p[y].getCoordinates(),
							b = x.ol4326CoordinateArrayToCsCartesians(_);
						0 == y ? v.positions = b : (v.holes || (v.holes = []), v.holes.push({
							positions: b
						}))
					}
					if(a = new Cesium.PolygonGeometry({
							polygonHierarchy: C,
							perPositionHeight: !0
						}), c === Cesium.HeightReference.CLAMP_TO_GROUND) {
						var w = this.extractLineWidthFromOlStyle(r);
						if(w > 0) {
							var S = [v.positions];
							if(v.holes)
								for(var T = 0; T < v.holes.length; ++T) S.push(v.holes[T].positions);
							if(u(this.scene)) {
								var P = new Cesium.PolylineMaterialAppearance({
										material: this.olStyleToCesium(t, r, !0)
									}),
									L = [],
									R = S,
									E = Array.isArray(R),
									O = 0;
								for(R = E ? R : R[Symbol.iterator]();;) {
									var A;
									if(E) {
										if(O >= R.length) break;
										A = R[O++]
									} else {
										if((O = R.next()).done) break;
										A = O.value
									}
									var G = A,
										I = new Cesium.GroundPolylineGeometry({
											positions: G,
											width: w
										});
									L.push(new Cesium.GeometryInstance({
										geometry: I
									}))
								}
								var M = {
									appearance: P,
									geometryInstances: L
								};
								(l = new Cesium.GroundPolylinePrimitive(M)).readyPromise.then((function() {
									o.setReferenceForPicking(e, t, l._primitive)
								}))
							} else {
								var F = this.extractColorFromOlStyle(r, !0);
								l = this.createStackedGroundCorridors(e, t, w, F, S)
							}
						}
					} else s = new Cesium.PolygonOutlineGeometry({
						polygonHierarchy: v,
						perPositionHeight: !0
					})
				}
				var k = this.wrapFillAndOutlineGeometries(e, t, i, a, s, r);
				return l && k.add(l), this.addTextStyle(e, t, i, r, k)
			}, t.getHeightReference = function(e, t, i) {
				var n = i.get("altitudeMode");
				void 0 === n && (n = t.get("altitudeMode")), void 0 === n && (n = e.get("altitudeMode"));
				var r = Cesium.HeightReference.NONE;
				return "clampToGround" === n ? r = Cesium.HeightReference.CLAMP_TO_GROUND : "relativeToGround" === n && (r = Cesium.HeightReference.RELATIVE_TO_GROUND), r
			}, t.createBillboardFromImage = function(e, t, i, n, r, o, a, u) {
				o instanceof Y.a && o.load();
				var l = o.getImage(1),
					h = function() {
						if(l && (l instanceof HTMLCanvasElement || l instanceof Image || l instanceof HTMLImageElement)) {
							var n, s = i.getCoordinates(),
								c = x.ol4326CoordinateToCesiumCartesian(s),
								h = o.getOpacity();
							void 0 !== h && (n = new Cesium.Color(1, 1, 1, h));
							var m = o.getScale(),
								d = this.getHeightReference(e, t, i),
								g = {
									image: l,
									color: n,
									scale: m,
									heightReference: d,
									position: c
								};
							if(o instanceof Y.a) {
								var f = o.getAnchor();
								f && (g.pixelOffset = new Cesium.Cartesian2((l.width / 2 - f[0]) * m, (l.height / 2 - f[1]) * m))
							}
							var p = this.csAddBillboard(a, g, e, t, i, r);
							u && u(p)
						}
					}.bind(this);
				if(l instanceof Image && ! function(e) {
						return "" != e.src && 0 != e.naturalHeight && 0 != e.naturalWidth && e.complete
					}(l)) {
					var m = !1,
						d = e.getSource();
					d.on(["removefeature", "clear"], this.boundOnRemoveOrClearFeatureListener_);
					var g = c.obj(d).olcs_cancellers;
					g || (g = c.obj(d).olcs_cancellers = {});
					var f = s(t);
					g[f] && g[f](), g[f] = function() {
						m = !0
					};
					l.addEventListener("load", (function e() {
						l.removeEventListener("load", e), a.isDestroyed() || m || h()
					}))
				} else h()
			}, t.olPointGeometryToCesium = function(e, t, i, n, r, o, a) {
				i = x.olGeometryCloneTo4326(i, n);
				var s = null,
					u = r.getImage();
				if(u) {
					var l = i.get("olcs_model") || t.get("olcs_model");
					if(l) {
						var c = l(),
							h = Object.assign({}, {
								scene: this.scene
							}, c.cesiumOptions),
							m = Cesium.Model.fromGltf(h);
						(s = new Cesium.PrimitiveCollection).add(m), c.debugModelMatrix && s.add(new Cesium.DebugModelMatrixPrimitive({
							modelMatrix: c.debugModelMatrix
						}))
					} else this.createBillboardFromImage(e, t, i, n, r, u, o, a)
				}
				return r.getText() ? this.addTextStyle(e, t, i, r, s || new Cesium.Primitive) : s
			}, t.olMultiGeometryToCesium = function(e, t, i, n, r, o, a) {
				var s, u = this,
					l = function(i, o) {
						var a = new Cesium.PrimitiveCollection;
						return i.forEach((function(i) {
							a.add(o(e, t, i, n, r))
						})), a
					};
				switch(i.getType()) {
					case "MultiPoint":
						if(s = (i = i).getPoints(), r.getText()) {
							var c = new Cesium.PrimitiveCollection;
							return s.forEach((function(i) {
								var s = u.olPointGeometryToCesium(e, t, i, n, r, o, a);
								s && c.add(s)
							})), c
						}
						return s.forEach((function(i) {
							u.olPointGeometryToCesium(e, t, i, n, r, o, a)
						})), null;
					case "MultiLineString":
						return l(s = (i = i).getLineStrings(), this.olLineStringGeometryToCesium.bind(this));
					case "MultiPolygon":
						return l(s = (i = i).getPolygons(), this.olPolygonGeometryToCesium.bind(this))
				}
			}, t.olGeometry4326TextPartToCesium = function(e, t, i, n) {
				var r = n.getText();
				if(!r) return null;
				var o = new Cesium.LabelCollection({
						scene: this.scene
					}),
					a = Object(J.getCenter)(i.getExtent());
				if(i instanceof ee.a) {
					var s = i.getFirstCoordinate();
					a[2] = 3 == s.length ? s[2] : 0
				}
				var u = {};
				u.position = x.ol4326CoordinateToCesiumCartesian(a), u.text = r, u.heightReference = this.getHeightReference(e, t, i);
				var l = n.getOffsetX(),
					c = n.getOffsetY();
				if(0 != l && 0 != c) {
					var h = new Cesium.Cartesian2(l, c);
					u.pixelOffset = h
				}
				u.font = n.getFont() || "10px sans-serif";
				var m, d = void 0;
				switch(n.getFill() && (u.fillColor = this.extractColorFromOlStyle(n, !1), d = Cesium.LabelStyle.FILL), n.getStroke() && (u.outlineWidth = this.extractLineWidthFromOlStyle(n), u.outlineColor = this.extractColorFromOlStyle(n, !0), d = Cesium.LabelStyle.OUTLINE), n.getFill() && n.getStroke() && (d = Cesium.LabelStyle.FILL_AND_OUTLINE), u.style = d, n.getTextAlign()) {
					case "left":
						m = Cesium.HorizontalOrigin.LEFT;
						break;
					case "right":
						m = Cesium.HorizontalOrigin.RIGHT;
						break;
					case "center":
					default:
						m = Cesium.HorizontalOrigin.CENTER
				}
				if(u.horizontalOrigin = m, n.getTextBaseline()) {
					var g;
					switch(n.getTextBaseline()) {
						case "top":
							g = Cesium.VerticalOrigin.TOP;
							break;
						case "middle":
							g = Cesium.VerticalOrigin.CENTER;
							break;
						case "bottom":
							g = Cesium.VerticalOrigin.BOTTOM;
							break;
						case "alphabetic":
							g = Cesium.VerticalOrigin.TOP;
							break;
						case "hanging":
							g = Cesium.VerticalOrigin.BOTTOM
					}
					u.verticalOrigin = g
				}
				var f = o.add(u);
				return this.setReferenceForPicking(e, t, f), o
			}, t.olStyleToCesium = function(e, t, i) {
				var n = t.getFill(),
					r = t.getStroke();
				if(i && !r || !i && !n) return null;
				var o = i ? r.getColor() : n.getColor();
				return o = x.convertColorToCesium(o), i && r.getLineDash() ? Cesium.Material.fromType("Stripe", {
					horizontal: !1,
					repeat: 500,
					evenColor: o,
					oddColor: new Cesium.Color(0, 0, 0, 0)
				}) : Cesium.Material.fromType("Color", {
					color: o
				})
			}, t.computePlainStyle = function(e, t, i, n) {
				var r = t.getStyleFunction(),
					o = null;
				return r && (o = r(t, n)), !o && i && (o = i(t, n)), o ? Array.isArray(o) ? o : [o] : null
			}, t.getGeometryFromFeature = function(e, t, i) {
				if(i) return i;
				var n = e.get("olcs.3d_geometry");
				if(n && n instanceof Z.a) return n;
				if(t) {
					var r = t.getGeometryFunction()(e);
					if(r instanceof Z.a) return r
				}
				return e.getGeometry()
			}, t.olFeatureToCesium = function(e, t, i, n, r) {
				var o = this,
					a = this.getGeometryFromFeature(t, i, r);
				if(!a) return null;
				var u = n.projection,
					l = function(e) {
						var i = n.featureToCesiumMap[s(t)];
						i instanceof Array ? i.push(e) : n.featureToCesiumMap[s(t)] = [e]
					};
				switch(a.getType()) {
					case "GeometryCollection":
						var c = new Cesium.PrimitiveCollection;
						return a.getGeometries().forEach((function(r) {
							if(r) {
								var a = o.olFeatureToCesium(e, t, i, n, r);
								a && c.add(a)
							}
						})), c;
					case "Point":
						a = a;
						var h = n.billboards,
							m = this.olPointGeometryToCesium(e, t, a, u, i, h, l);
						return m || null;
					case "Circle":
						return a = a, this.olCircleGeometryToCesium(e, t, a, u, i);
					case "LineString":
						return a = a, this.olLineStringGeometryToCesium(e, t, a, u, i);
					case "Polygon":
						return a = a, this.olPolygonGeometryToCesium(e, t, a, u, i);
					case "MultiPoint":
					case "MultiLineString":
					case "MultiPolygon":
						var d = this.olMultiGeometryToCesium(e, t, a, u, i, n.billboards, l);
						return d || null;
					case "LinearRing":
						throw new Error("LinearRing should only be part of polygon.");
					default:
						throw new Error("Ol geom type not handled : " + a.getType())
				}
			}, t.olVectorLayerToCesium = function(e, t, i) {
				var n = t.getProjection(),
					r = t.getResolution();
				if(void 0 === r || !n) throw new Error("View not ready");
				var o = e.getSource();
				o instanceof H.a && (o = o.getSource());
				for(var a = o.getFeatures(), u = new te(n, this.scene), l = u.context, c = 0; c < a.length; ++c) {
					var h = a[c];
					if(h) {
						var m = e.getStyleFunction(),
							d = this.computePlainStyle(e, h, m, r);
						if(d && d.length) {
							for(var g = null, f = 0; f < d.length; f++) {
								var p = this.olFeatureToCesium(e, h, d[f], l);
								if(p)
									if(g) {
										if(p)
											for(var v = 0, C = void 0; C = p.get(v);) g.add(C), v++
									} else g = p
							}
							g && (i[s(h)] = g, u.getRootPrimitive().add(g))
						}
					}
				}
				return u
			}, t.convert = function(e, t, i, n) {
				var r = t.getProjection(),
					o = t.getResolution();
				if(null == o || !r) return null;
				var a = e.getStyleFunction(),
					s = this.computePlainStyle(e, i, a, o);
				if(!s || !s.length) return null;
				n.projection = r;
				for(var u = null, l = 0; l < s.length; l++) {
					var c = this.olFeatureToCesium(e, i, s[l], n);
					if(u) {
						if(c)
							for(var h = 0, m = void 0; m = c.get(h);) u.add(m), h++
					} else u = c
				}
				return u
			}, e
		}();
	var ne = function(e) {
			var t, i;

			function n(t, i, n) {
				var r;
				return(r = e.call(this, t, i) || this).converter = n || new ie(i), r.csAllPrimitives_ = new Cesium.PrimitiveCollection, i.primitives.add(r.csAllPrimitives_), r.csAllPrimitives_.destroyPrimitives = !1, r
			}
			i = e, (t = n).prototype = Object.create(i.prototype), t.prototype.constructor = t, t.__proto__ = i;
			var r = n.prototype;
			return r.addCesiumObject = function(e) {
				e.getRootPrimitive().counterpart = e, this.csAllPrimitives_.add(e.getRootPrimitive())
			}, r.destroyCesiumObject = function(e) {
				e.getRootPrimitive().destroy()
			}, r.removeSingleCesiumObject = function(e, t) {
				e.destroy(), this.csAllPrimitives_.destroyPrimitives = t, this.csAllPrimitives_.remove(e.getRootPrimitive()), this.csAllPrimitives_.destroyPrimitives = !1
			}, r.removeAllCesiumObjects = function(e) {
				if(this.csAllPrimitives_.destroyPrimitives = e, e)
					for(var t = 0; t < this.csAllPrimitives_.length; ++t) this.csAllPrimitives_.get(t).counterpart.destroy();
				this.csAllPrimitives_.removeAll(), this.csAllPrimitives_.destroyPrimitives = !1
			}, r.updateLayerVisibility = function(e, t) {
				var i = !0;
				[e.layer].concat(e.parents).forEach((function(e) {
					var t = e.getVisible();
					void 0 !== t ? i &= t : i = !1
				})), t.show = i
			}, r.createSingleLayerCounterparts = function(e) {
				var t = this,
					i = e.layer;
				if(!(i instanceof U.a) || i instanceof K.a) return null;
				var n = i.getSource();
				if(n instanceof H.a && (n = n.getSource()), !n) return null;
				var r = this.view,
					a = {},
					u = this.converter.olVectorLayerToCesium(i, r, a),
					l = u.getRootPrimitive(),
					c = u.olListenKeys;
				[e.layer].concat(e.parents).forEach((function(i) {
					c.push(o(i, "change:visible", (function() {
						t.updateLayerVisibility(e, l)
					})))
				})), this.updateLayerVisibility(e, l);
				var h = function(e) {
						var t = u.context,
							n = this.converter.convert(i, r, e, t);
						n && (a[s(e)] = n, l.add(n))
					}.bind(this),
					m = function(e) {
						var t = s(e),
							i = u.context,
							n = i.featureToCesiumMap[t];
						n && (delete i.featureToCesiumMap[t], n.forEach((function(e) {
							e instanceof Cesium.Billboard && i.billboards.remove(e)
						})));
						var r = a[t];
						delete a[t], r && l.remove(r)
					}.bind(this);
				return c.push(o(n, "addfeature", (function(e) {
					h(e.feature)
				}))), c.push(o(n, "removefeature", (function(e) {
					m(e.feature)
				}))), c.push(o(n, "changefeature", (function(e) {
					var t = e.feature;
					m(t), h(t)
				}))), u ? [u] : null
			}, n
		}(D),
		re = i(23);
	var oe = function(e) {
			var t, i;

			function r(t) {
				var i, n = t.parent;
				(i = e.call(this, n.getOptions()) || this).scenePostRenderListenerRemover_ = null, i.scene_ = t.scene, i.synchronizer_ = t.synchronizer, i.parent_ = n, i.positionWGS84_ = void 0, i.observer_ = new MutationObserver(i.handleElementChanged.bind(function(e) {
					if(void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return e
				}(i))), i.attributeObserver_ = [], i.listenerKeys_ = [];
				var r = function(e) {
					return i.setPropertyFromEvent_(e)
				};
				return i.listenerKeys_.push(i.parent_.on("change:position", r)), i.listenerKeys_.push(i.parent_.on("change:element", r)), i.listenerKeys_.push(i.parent_.on("change:offset", r)), i.listenerKeys_.push(i.parent_.on("change:position", r)), i.listenerKeys_.push(i.parent_.on("change:positioning", r)), i.setProperties(i.parent_.getProperties()), i.handleMapChanged(), i.handleElementChanged(), i
			}
			i = e, (t = r).prototype = Object.create(i.prototype), t.prototype.constructor = t, t.__proto__ = i;
			var o = r.prototype;
			return o.observeTarget_ = function(e) {
				if(this.observer_) {
					this.observer_.disconnect(), this.observer_.observe(e, {
						attributes: !1,
						childList: !0,
						characterData: !0,
						subtree: !0
					}), this.attributeObserver_.forEach((function(e) {
						e.disconnect()
					})), this.attributeObserver_.length = 0;
					for(var t = 0; t < e.childNodes.length; t++) {
						var i = e.childNodes[t];
						if(1 === i.nodeType) {
							var n = new MutationObserver(this.handleElementChanged.bind(this));
							n.observe(i, {
								attributes: !0,
								subtree: !0
							}), this.attributeObserver_.push(n)
						}
					}
				}
			}, o.setPropertyFromEvent_ = function(e) {
				e.target && e.key && this.set(e.key, e.target.get(e.key))
			}, o.getScene = function() {
				return this.scene_
			}, o.handleMapChanged = function() {
				var e;
				this.scenePostRenderListenerRemover_ && (this.scenePostRenderListenerRemover_(), (e = this.element) && e.parentNode && e.parentNode.removeChild(e)), this.scenePostRenderListenerRemover_ = null;
				var t = this.getScene();
				if(t) {
					this.scenePostRenderListenerRemover_ = t.postRender.addEventListener(this.updatePixelPosition.bind(this)), this.updatePixelPosition();
					var i = this.stopEvent ? this.synchronizer_.getOverlayContainerStopEvent() : this.synchronizer_.getOverlayContainer();
					this.insertFirst ? i.insertBefore(this.element, i.childNodes[0] || null) : i.appendChild(this.element)
				}
			}, o.handlePositionChanged = function() {
				var e = this.getPosition();
				if(e) {
					var t = this.parent_.getMap().getView().getProjection();
					this.positionWGS84_ = Object(n.transform)(e, t, "EPSG:4326")
				} else this.positionWGS84_ = void 0;
				this.updatePixelPosition()
			}, o.handleElementChanged = function() {
				function e(t, i) {
					var n = t.cloneNode();
					i && i.appendChild(n), t.nodeType != Node.TEXT_NODE && n.addEventListener("click", (function(e) {
						t.dispatchEvent(new MouseEvent("click", e)), e.stopPropagation()
					}));
					for(var r = t.childNodes, o = 0; o < r.length; o++) r[o] && e(r[o], n);
					return n
				}! function(e) {
					for(; e.lastChild;) e.removeChild(e.lastChild)
				}(this.element);
				var t = this.getElement();
				if(t && t.parentNode && t.parentNode.childNodes) {
					var i = t.parentNode.childNodes,
						n = Array.isArray(i),
						r = 0;
					for(i = n ? i : i[Symbol.iterator]();;) {
						var o;
						if(n) {
							if(r >= i.length) break;
							o = i[r++]
						} else {
							if((r = i.next()).done) break;
							o = r.value
						}
						var a = e(o, null);
						this.element.appendChild(a)
					}
				}
				t.parentNode && this.observeTarget_(t.parentNode)
			}, o.updatePixelPosition = function() {
				var e = this.positionWGS84_;
				if(this.scene_ && e) {
					var t = 0;
					if(2 === e.length) {
						var i = this.scene_.globe.getHeight(Cesium.Cartographic.fromDegrees(e[0], e[1]));
						i && this.scene_.globe.tilesLoaded && (e[2] = i), i && (t = i)
					} else t = e[2];
					var n = Cesium.Cartesian3.fromDegrees(e[0], e[1], t),
						r = this.scene_.camera,
						o = new Cesium.BoundingSphere(new Cesium.Cartesian3, 6356752);
					if(new Cesium.Occluder(o, r.position).isPointVisible(n))
						if(1 === r.frustum.computeCullingVolume(r.position, r.direction, r.up).computeVisibility(new Cesium.BoundingSphere(n))) {
							this.setVisible(!0);
							var a = this.scene_.cartesianToCanvasCoordinates(n),
								s = [a.x, a.y],
								u = [this.scene_.canvas.width, this.scene_.canvas.height];
							this.updateRenderedPosition(s, u)
						} else this.setVisible(!1);
					else this.setVisible(!1)
				} else this.setVisible(!1)
			}, o.destroy = function() {
				this.scenePostRenderListenerRemover_ && this.scenePostRenderListenerRemover_(), this.observer_ && this.observer_.disconnect(), Object(G.unByKey)(this.listenerKeys_), this.listenerKeys_.splice(0), this.element.removeNode ? this.element.removeNode(!0) : this.element.remove(), this.element = null
			}, r
		}(i.n(re).a),
		ae = function() {
			function e(e, t) {
				var i = this;
				this.map = e, this.overlays_ = this.map.getOverlays(), this.scene = t, this.overlayContainerStopEvent_ = document.createElement("DIV"), this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent";
				["click", "dblclick", "mousedown", "touchstart", "MSPointerDown", "pointerdown", "mousewheel", "wheel"].forEach((function(e) {
					i.overlayContainerStopEvent_.addEventListener(e, (function(e) {
						return e.stopPropagation()
					}))
				})), this.scene.canvas.parentElement.appendChild(this.overlayContainerStopEvent_), this.overlayContainer_ = document.createElement("DIV"), this.overlayContainer_.className = "ol-overlaycontainer", this.scene.canvas.parentElement.appendChild(this.overlayContainer_), this.overlayMap_ = {}
			}
			var t = e.prototype;
			return t.getOverlayContainerStopEvent = function() {
				return this.overlayContainerStopEvent_
			}, t.getOverlayContainer = function() {
				return this.overlayContainer_
			}, t.synchronize = function() {
				this.destroyAll(), this.addOverlays(), this.overlays_.on("add", this.addOverlayFromEvent_.bind(this)), this.overlays_.on("remove", this.removeOverlayFromEvent_.bind(this))
			}, t.addOverlayFromEvent_ = function(e) {
				var t = e.element;
				this.addOverlay(t)
			}, t.addOverlays = function() {
				var e = this;
				this.overlays_.forEach((function(t) {
					e.addOverlay(t)
				}))
			}, t.addOverlay = function(e) {
				if(e) {
					var t = new oe({
							scene: this.scene,
							synchronizer: this,
							parent: e
						}),
						i = s(e).toString();
					this.overlayMap_[i] = t
				}
			}, t.removeOverlayFromEvent_ = function(e) {
				var t = e.element;
				this.removeOverlay(t)
			}, t.removeOverlay = function(e) {
				var t = s(e).toString(),
					i = this.overlayMap_[t];
				i && (i.destroy(), delete this.overlayMap_[t])
			}, t.destroyAll = function() {
				var e = this;
				Object.keys(this.overlayMap_).forEach((function(t) {
					e.overlayMap_[t].destroy(), delete e.overlayMap_[t]
				}))
			}, e
		}();

	function se(e, t) {
		for(var i = 0; i < t.length; i++) {
			var n = t[i];
			n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
		}
	}
	var ue = function() {
			function e(t) {
				this.autoRenderLoop_ = null, this.map_ = t.map, this.time_ = t.time || function() {
					return Cesium.JulianDate.now()
				}, this.to4326Transform_ = Object(n.getTransform)(this.map_.getView().getProjection(), "EPSG:4326"), this.resolutionScale_ = 1, this.canvasClientWidth_ = 0, this.canvasClientHeight_ = 0, this.resolutionScaleChanged_ = !0;
				var i = "position:absolute;top:0;left:0;width:100%;height:100%;";
				this.container_ = document.createElement("DIV");
				var r = document.createAttribute("style");
				r.value = i + "visibility:hidden;", this.container_.setAttributeNode(r);
				var o = t.target || null;
				if(o) "string" == typeof o && (o = document.getElementById(o)), o.appendChild(this.container_);
				else {
					var a = this.map_.getViewport().querySelector(".ol-overlaycontainer-stopevent");
					a.insertBefore(this.container_, a.firstChild)
				}
				if(this.isOverMap_ = !o, this.isOverMap_ && t.stopOpenLayersEventsPropagation)
					for(var s = ["click", "dblclick", "mousedown", "touchstart", "MSPointerDown", "pointerdown", "mousewheel", "wheel"], u = 0, l = s.length; u < l; ++u) this.container_.addEventListener(s[u], (function(e) {
						return e.stopPropagation()
					}));
				this.canvas_ = document.createElement("CANVAS");
				var h = document.createAttribute("style");
				h.value = i, this.canvas_.setAttributeNode(h), c.supportsImageRenderingPixelated() && (this.canvas_.style.imageRendering = c.imageRenderingValue()), this.canvas_.oncontextmenu = function() {
					return !1
				}, this.canvas_.onselectstart = function() {
					return !1
				}, this.container_.appendChild(this.canvas_), this.enabled_ = !1, this.pausedInteractions_ = [], this.hiddenRootGroup_ = null;
				var m = void 0 !== t.sceneOptions ? t.sceneOptions : {};
				m.canvas = this.canvas_, m.scene3DOnly = !0, this.scene_ = new Cesium.Scene(m);
				var d = this.scene_.screenSpaceCameraController;
				d.tiltEventTypes.push({
					eventType: Cesium.CameraEventType.LEFT_DRAG,
					modifier: Cesium.KeyboardEventModifier.SHIFT
				}), d.tiltEventTypes.push({
					eventType: Cesium.CameraEventType.LEFT_DRAG,
					modifier: Cesium.KeyboardEventModifier.ALT
				}), d.enableLook = !1, this.scene_.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z, this.camera_ = new k(this.scene_, this.map_), this.globe_ = new Cesium.Globe(Cesium.Ellipsoid.WGS84), this.globe_.baseColor = Cesium.Color.WHITE, this.scene_.globe = this.globe_, this.scene_.skyAtmosphere = new Cesium.SkyAtmosphere;
				var g = new Cesium.SingleTileImageryProvider({
					url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
					rectangle: Cesium.Rectangle.fromDegrees(0, 0, 1, 1)
				});
				this.globe_.imageryLayers.addImageryProvider(g, 0), this.dataSourceCollection_ = new Cesium.DataSourceCollection, this.dataSourceDisplay_ = new Cesium.DataSourceDisplay({
					scene: this.scene_,
					dataSourceCollection: this.dataSourceCollection_
				});
				var f = t.createSynchronizers ? t.createSynchronizers(this.map_, this.scene_, this.dataSourceCollection_) : [new N(this.map_, this.scene_), new ne(this.map_, this.scene_), new ae(this.map_, this.scene_)];
				this.handleResize_();
				for(var p = f.length - 1; p >= 0; --p) f[p].synchronize();
				this.lastFrameTime_ = 0, this.renderId_ = void 0, this.targetFrameRate_ = Number.POSITIVE_INFINITY, this.blockCesiumRendering_ = !1, this.warmingUp_ = !1, this.trackedFeature_ = null, this.trackedEntity_ = null, this.entityView_ = null, this.needTrackedEntityUpdate_ = !1, this.boundingSphereScratch_ = new Cesium.BoundingSphere, (new Cesium.EventHelper).add(this.scene_.postRender, e.prototype.updateTrackedEntity_, this), Cesium.Camera.enableSuspendTerrainAdjustment = !1
			}
			var t, i, r, o = e.prototype;
			return o.render_ = function() {
				void 0 !== this.renderId_ && (cancelAnimationFrame(this.renderId_), this.renderId_ = void 0), !this.enabled_ && !this.warmingUp_ || this.blockCesiumRendering_ || (this.renderId_ = requestAnimationFrame(this.onAnimationFrame_.bind(this)))
			}, o.onAnimationFrame_ = function(e) {
				this.renderId_ = void 0;
				var t = 1e3 / this.targetFrameRate_;
				if(e - this.lastFrameTime_ < t) this.render_();
				else {
					this.lastFrameTime_ = e;
					var i = this.time_();
					if(this.scene_.initializeFrame(), this.handleResize_(), this.dataSourceDisplay_.update(i), this.entityView_) {
						var n = this.trackedEntity_;
						this.dataSourceDisplay_.getBoundingSphere(n, !1, this.boundingSphereScratch_) === Cesium.BoundingSphereState.DONE && (this.boundingSphereScratch_.radius = 1, this.entityView_.update(i, this.boundingSphereScratch_))
					}
					this.scene_.render(i), this.camera_.checkCameraChange(), this.render_()
				}
			}, o.updateTrackedEntity_ = function() {
				if(this.needTrackedEntityUpdate_) {
					var e = this.trackedEntity_,
						t = this.scene_,
						i = this.dataSourceDisplay_.getBoundingSphere(e, !1, this.boundingSphereScratch_);
					if(i !== Cesium.BoundingSphereState.PENDING) {
						t.screenSpaceCameraController.enableTilt = !1;
						var n = i !== Cesium.BoundingSphereState.FAILED ? this.boundingSphereScratch_ : void 0;
						n && (n.radius = 1), this.entityView_ = new Cesium.EntityView(e, t, t.mapProjection.ellipsoid), this.entityView_.update(this.time_(), n), this.needTrackedEntityUpdate_ = !1
					}
				}
			}, o.handleResize_ = function() {
				var e = this.canvas_.clientWidth,
					t = this.canvas_.clientHeight;
				if(!(0 === e | 0 === t) && (e !== this.canvasClientWidth_ || t !== this.canvasClientHeight_ || this.resolutionScaleChanged_)) {
					var i = this.resolutionScale_;
					c.supportsImageRenderingPixelated() || (i *= window.devicePixelRatio || 1), this.resolutionScaleChanged_ = !1, this.canvasClientWidth_ = e, this.canvasClientHeight_ = t, e *= i, t *= i, this.canvas_.width = e, this.canvas_.height = t, this.scene_.camera.frustum.aspectRatio = e / t
				}
			}, o.getCamera = function() {
				return this.camera_
			}, o.getOlMap = function() {
				return this.map_
			}, o.getOlView = function() {
				return this.map_.getView()
			}, o.getCesiumScene = function() {
				return this.scene_
			}, o.getDataSources = function() {
				return this.dataSourceCollection_
			}, o.getDataSourceDisplay = function() {
				return this.dataSourceDisplay_
			}, o.getEnabled = function() {
				return this.enabled_
			}, o.setEnabled = function(e) {
				var t, i = this;
				if(this.enabled_ !== e)
					if(this.enabled_ = e, this.container_.style.visibility = this.enabled_ ? "visible" : "hidden", this.enabled_) {
						if(this.throwOnUnitializedMap_(), this.isOverMap_) {
							(t = this.map_.getInteractions()).forEach((function(e, t, n) {
								i.pausedInteractions_.push(e)
							})), t.clear(), this.map_.addInteraction = function(e) {
								return i.pausedInteractions_.push(e)
							}, this.map_.removeInteraction = function(e) {
								return i.pausedInteractions_ = i.pausedInteractions_.filter((function(t) {
									return t !== e
								}))
							};
							var n = this.map_.getLayerGroup();
							n.getVisible() && (this.hiddenRootGroup_ = n, this.hiddenRootGroup_.setVisible(!1)), this.map_.getOverlayContainer().classList.add("olcs-hideoverlay")
						}
						this.camera_.readFromView(), this.render_()
					} else this.isOverMap_ && (t = this.map_.getInteractions(), this.pausedInteractions_.forEach((function(e) {
						t.push(e)
					})), this.pausedInteractions_.length = 0, this.map_.addInteraction = function(e) {
						return i.map_.getInteractions().push(e)
					}, this.map_.removeInteraction = function(e) {
						return i.map_.getInteractions().remove(e)
					}, this.map_.getOverlayContainer().classList.remove("olcs-hideoverlay"), this.hiddenRootGroup_ && (this.hiddenRootGroup_.setVisible(!0), this.hiddenRootGroup_ = null)), this.camera_.updateView()
			}, o.warmUp = function(e, t) {
				var i = this;
				if(!this.enabled_) {
					this.throwOnUnitializedMap_(), this.camera_.readFromView();
					var n = this.globe_.ellipsoid,
						r = this.scene_.camera,
						o = n.cartesianToCartographic(r.position);
					o.height < e && (o.height = e, r.position = n.cartographicToCartesian(o)), this.warmingUp_ = !0, this.render_(), setTimeout((function() {
						i.warmingUp_ = !1
					}), t)
				}
			}, o.setBlockCesiumRendering = function(e) {
				this.blockCesiumRendering_ !== e && (this.blockCesiumRendering_ = e, this.render_())
			}, o.enableAutoRenderLoop = function() {
				this.autoRenderLoop_ || (this.autoRenderLoop_ = new A(this))
			}, o.getAutoRenderLoop = function() {
				return this.autoRenderLoop_
			}, o.setResolutionScale = function(e) {
				(e = Math.max(0, e)) !== this.resolutionScale_ && (this.resolutionScale_ = Math.max(0, e), this.resolutionScaleChanged_ = !0, this.autoRenderLoop_ && this.autoRenderLoop_.restartRenderLoop())
			}, o.setTargetFrameRate = function(e) {
				this.targetFrameRate_ !== e && (this.targetFrameRate_ = e, this.render_())
			}, o.throwOnUnitializedMap_ = function() {
				var e = this.map_.getView(),
					t = e.getCenter();
				if(!e.isDef() || isNaN(t[0]) || isNaN(t[1])) throw new Error("The OpenLayers map is not properly initialized: " + t + " / " + e.getResolution())
			}, t = e, (i = [{
				key: "trackedFeature",
				get: function() {
					return this.trackedFeature_
				},
				set: function(e) {
					if(this.trackedFeature_ !== e) {
						var t = this.scene_;
						if(!e || !e.getGeometry()) return this.needTrackedEntityUpdate_ = !1, t.screenSpaceCameraController.enableTilt = !0, this.trackedEntity_ && this.dataSourceDisplay_.defaultDataSource.entities.remove(this.trackedEntity_), this.trackedEntity_ = null, this.trackedFeature_ = null, this.entityView_ = null, void t.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
						this.trackedFeature_ = e, this.needTrackedEntityUpdate_ = !0;
						var i = this.to4326Transform_,
							n = {
								position: new Cesium.CallbackProperty((function(t, n) {
									return r = e.getGeometry().getCoordinates(), o = i(r, void 0, r.length), x.ol4326CoordinateToCesiumCartesian(o);
									var r, o
								}), !1),
								point: {
									pixelSize: 1,
									color: Cesium.Color.TRANSPARENT
								}
							};
						this.trackedEntity_ = this.dataSourceDisplay_.defaultDataSource.entities.add(n)
					}
				}
			}]) && se(t.prototype, i), r && se(t, r), e
		}(),
		le = function() {
			function e(e) {
				this.promise, this.url_ = e
			}
			return e.prototype.load = function() {
				var e = this;
				return this.promise || (this.promise = new Promise((function(t, i) {
					var n = document.createElement("script");
					n.onload = function() {
						return t()
					}, n.onerror = function() {
						return i()
					}, document.head.appendChild(n), n.src = e.url_
				}))), this.promise
			}, e
		}();

	function ce(e, t, i) {
		return(ce = function() {
			if("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if(Reflect.construct.sham) return !1;
			if("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0
			} catch(e) {
				return !1
			}
		}() ? Reflect.construct : function(e, t, i) {
			var n = [null];
			n.push.apply(n, t);
			var r = new(Function.bind.apply(e, n));
			return i && he(r, i.prototype), r
		}).apply(null, arguments)
	}

	function he(e, t) {
		return(he = Object.setPrototypeOf || function(e, t) {
			return e.__proto__ = t, e
		})(e, t)
	}
	var me = function(e) {
			var t, i;

			function n(t, i) {
				var n, r = void 0 === i ? {} : i,
					o = r.map,
					a = r.cameraExtentInRadians;
				return(n = e.call(this) || this).cesiumUrl_ = t, n.map = o, n.cameraExtentInRadians = a || null, n.boundingSphere_, n.blockLimiter_ = !1, n.promise_, n.ol3d, n.cesiumInitialTilt_ = F(50), n.fogDensity = 1e-4, n.fogSSEFactor = 25, n.minimumZoomDistance = 2, n.maximumZoomDistance = 1e7, n.limitCameraToBoundingSphereRatio = function(e) {
					return e > 3e3 ? 9 : 3
				}, n
			}
			i = e, (t = n).prototype = Object.create(i.prototype), t.prototype.constructor = t, t.__proto__ = i;
			var r = n.prototype;
			return r.load = function() {
				var e = this;
				if(!this.promise_) {
					var t = new le(this.cesiumUrl_);
					this.promise_ = t.load().then((function() {
						return e.onCesiumLoaded()
					}))
				}
				return this.promise_
			}, r.onCesiumLoaded = function() {
				if(this.cameraExtentInRadians) {
					var e = ce(Cesium.Rectangle, this.cameraExtentInRadians);
					Cesium.Camera.DEFAULT_VIEW_RECTANGLE = e, this.boundingSphere_ = Cesium.BoundingSphere.fromRectangle3D(e, Cesium.Ellipsoid.WGS84, 300)
				}
				this.ol3d = this.instantiateOLCesium();
				var t = this.ol3d.getCesiumScene();
				return this.configureForUsability(t), this.configureForPerformance(t), this.dispatchEvent("load"), this.ol3d
			}, r.instantiateOLCesium = function() {
				var e = new ue({
						map: this.map
					}),
					t = e.getCesiumScene(),
					i = Cesium.createWorldTerrain();
				return t.terrainProvider = i, e
			}, r.configureForPerformance = function(e) {
				var t = e.fog;
				t.enabled = !0, t.density = this.fogDensity, t.screenSpaceErrorFactor = this.fogSSEFactor
			}, r.configureForUsability = function(e) {
				var t = e.screenSpaceCameraController;
				t.minimumZoomDistance = this.minimumZoomDistance, t.maximumZoomDistance = this.maximumZoomDistance, e.globe.depthTestAgainstTerrain = !0, e.globe.baseColor = Cesium.Color.WHITE, e.backgroundColor = Cesium.Color.WHITE, this.boundingSphere_ && e.postRender.addEventListener(this.limitCameraToBoundingSphere.bind(this), e), this.ol3d.enableAutoRenderLoop()
			}, r.limitCameraToBoundingSphere = function() {
				var e = this;
				if(this.boundingSphere_ && !this.blockLimiter_) {
					var t = this.ol3d.getCesiumScene().camera,
						i = t.position,
						n = Cesium.Cartographic.fromCartesian(i),
						r = this.limitCameraToBoundingSphereRatio(n.height);
					if(Cesium.Cartesian3.distance(this.boundingSphere_.center, i) > this.boundingSphere_.radius * r) {
						if(!0 === t.flying) return;
						this.blockLimiter_ = !0;
						var o = function() {
							return e.blockLimiter_ = !1
						};
						t.flyToBoundingSphere(this.boundingSphere_, {
							complete: o,
							cancel: o
						})
					}
				}
			}, r.toggle3d = function() {
				var e = this;
				return this.load().then((function(t) {
					var i = t.getEnabled(),
						n = t.getCesiumScene();
					return i ? x.resetToNorthZenith(e.map, n).then((function() {
						t.setEnabled(!1), e.dispatchEvent("toggle")
					})) : (t.setEnabled(!0), e.dispatchEvent("toggle"), x.rotateAroundBottomCenter(n, e.cesiumInitialTilt_))
				}))
			}, r.set3dWithView = function(e, t, i, n, r) {
				var o = this;
				return this.load().then((function(a) {
					var s = a.getEnabled(),
						u = a.getCesiumScene().camera,
						l = Cesium.Cartesian3.fromDegrees(e, t, i),
						c = {
							heading: Cesium.Math.toRadians(n),
							pitch: Cesium.Math.toRadians(r),
							roll: 0
						};
					s || (a.setEnabled(!0), o.dispatchEvent("toggle")), u.setView({
						destination: l,
						orientation: c
					})
				}))
			}, r.is3dEnabled = function() {
				return !!this.ol3d && this.ol3d.getEnabled()
			}, r.getHeading = function() {
				return this.map && this.map.getView().getRotation() || 0
			}, r.getTiltOnGlobe = function() {
				var e = this.ol3d.getCesiumScene();
				return -x.computeSignedTiltAngleOnGlobe(e)
			}, r.setHeading = function(e) {
				var t = this.ol3d.getCesiumScene(),
					i = x.pickBottomPoint(t);
				i && x.setHeadingUsingBottomCenter(t, e, i)
			}, r.getOl3d = function() {
				return this.ol3d
			}, r.getOlView = function() {
				return this.map.getView()
			}, r.getCesiumViewMatrix = function() {
				return this.ol3d.getCesiumScene().camera.viewMatrix
			}, r.getCesiumScene = function() {
				return this.ol3d.getCesiumScene()
			}, r.flyToRectangle = function(e, t) {
				var i = this;
				void 0 === t && (t = 0);
				var n = this.getCesiumScene().camera,
					r = n.getRectangleCameraCoordinates(e),
					o = Cesium.Cartesian3.magnitude(r) + t;
				return Cesium.Cartesian3.normalize(r, r), Cesium.Cartesian3.multiplyByScalar(r, o, r), new Promise((function(e, t) {
					i.cameraExtentInRadians ? n.flyTo({
						destination: r,
						complete: function() {
							return e()
						},
						cancel: function() {
							return t()
						},
						endTransform: Cesium.Matrix4.IDENTITY
					}) : t()
				}))
			}, r.getCameraExtentRectangle = function() {
				if(this.cameraExtentInRadians) return ce(Cesium.Rectangle, this.cameraExtentInRadians)
			}, n
		}(I.a),
		de = (t.default = ue, window.olcs = {});
	de.OLCesium = ue, de.AbstractSynchronizer = D, de.RasterSynchronizer = N, de.VectorSynchronizer = ne, de.core = x, de.core.OLImageryProvider = E, de.core.VectorLayerCounterpart = te, de.contrib = {}, de.contrib.LazyLoader = le, de.contrib.Manager = me
}]);
//# sourceMappingURL=olcesium.js.map