/*
Copyright 2012 Alex Greenland

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */ 
var AG3DVIEW = function() {
	'use strict';

	var ellipsoid = Cesium.Ellipsoid.WGS84;
	var canvas = null;
	var scene = null;
	var transitioner = null;
	var cb = new Cesium.CentralBody(ellipsoid);
	var observerBillboards = new Cesium.BillboardCollection();
	var _render = false;
	var satBillboards = new Cesium.BillboardCollection();
	var gridRefresh = 1;
	var gridRefreshCounter = 0
	var orbitLines = new Cesium.PolylineCollection();
	var footprintCircle = new Cesium.PolylineCollection();
	var updateCounter = 0;
	var clock = new Cesium.Clock();
	var _selected = null;
	var _follow = false;
	
	var TILE_PROVIDERS = {
		'bing' : new Cesium.BingMapsImageryProvider(
				{
					server : 'dev.virtualearth.net',
					mapStyle : Cesium.BingMapsStyle.AERIAL,
					proxy : Cesium.FeatureDetection
							.supportsCrossOriginImagery() ? undefined
							: new Cesium.DefaultProxy('/proxy/')

				}),
		'osm' : new Cesium.OpenStreetMapImageryProvider({
			url : 'http://otile1.mqcdn.com/tiles/1.0.0/osm'
		}),
		'static' : new Cesium.SingleTileImageryProvider({
			url : 'images/NE2_50M_SR_W_4096.jpg'
		})
	};

	jQuery(window).resize(function() {
		if (canvas === null) {
			return;
		}
		var height = jQuery('.layout-panel-center').innerHeight();
		var width = jQuery('.layout-panel-center').innerWidth();

		if (canvas.width === width && canvas.height === height) {
			return;
		}

		canvas.width = width;
		canvas.height = height;

		scene.getCamera().frustum.aspectRatio = width / height;
	});


	/**
	 * Listen for an observers location becoming available and when it does
	 * update all of the observers.
	 * 
	 * Currently we only have the home observer but this is to allow for mutual
	 * pass predicitions i.e. supports more than one observer.
	 */
	jQuery(document).bind('agsattrack.locationAvailable',
			function(e, observer) {
				plotObservers();
			});

	jQuery(document).bind('agsattrack.locationUpdated',
			function(e, observer) {
				plotObservers();
				setupOrbit();			
			});	
	
	jQuery(document).bind('agsattrack.resetview',
			function(e, observer) {
				if (_render) {
					plotObservers();
				}
			});	
	
	jQuery(document).bind('agsattrack.followsatellite',
			function(e, follow) {
				_follow = follow;
				if (!follow) {
					if (_render) {
						plotObservers();
					}					
				}
			});
	
	/**
	 * Listen for a satellite being clicked and store it locally, this is
	 * for performance reasons.
	 */
	jQuery(document).bind('agsattrack.satclicked', function(event, selected) {
	//	_selected = selected;
	//	setupOrbit();
	});
	
	/**
	 * Listen for any changes in the tile provider.
	 */
	jQuery(document).bind(
			'agsattrack.changetile',
			function(event, provider) {
				if (scene.mode !== Cesium.SceneMode.MORPHING) {
					if (typeof TILE_PROVIDERS[provider] !== 'undefined') {
						cb.getImageryLayers().removeAll();
						cb.getImageryLayers().addImageryProvider(
								TILE_PROVIDERS[provider]);
					}
				}
			});

	jQuery(document).bind('agsattrack.satsselected', function(event, group) {
		// resetOrbit();
		 populateSatelliteBillboard();
	});
	//jQuery(document).bind('agsattrack.satsselected', function(event, group) {
//		resetOrbit();
//		populateSatelliteBillboard();
//	});

	jQuery(document).bind('agsattrack.updatesatdata',
			function(event, selected) {
				if (_render) {
					updateSatelliteBillboards();
				}
			});
	
	/**
	 * Plot the observers.
	 */
	function plotObservers() {
		observerBillboards.removeAll();
		var observers = AGSatTrack.getObservers();
		for ( var i = 0; i < observers.length; i++) {
			var observer = observers[i];
			if (observer.isReady()) {
				var target = ellipsoid
						.cartographicToCartesian(Cesium.Cartographic
								.fromDegrees(observer.getLon(), observer
										.getLat()));
				var eye = ellipsoid
						.cartographicToCartesian(Cesium.Cartographic
								.fromDegrees(observer.getLon(), observer
										.getLat(), 1e7));
				var up = new Cesium.Cartesian3(0, 0, 1);
				var image = new Image();
				image.src = 'images/cross_yellow_16.png';
				image.onload = function() {
					var textureAtlas = scene.getContext().createTextureAtlas({
						image : image
					});
					observerBillboards.setTextureAtlas(textureAtlas);
					observerBillboards.modelMatrix = Cesium.Transforms
							.eastNorthUpToFixedFrame(target);
					observerBillboards.add({
						imageIndex : 0,
						position : new Cesium.Cartesian3(0.0, 0.0, 0.0)
					});
				};
				// Point the camera at us and position it directly above us if
				// we are the first observer
				if (i == 0) {
					scene.getCamera().lookAt(eye, target, up);
				}
			}
		}
		scene.getPrimitives().add(observerBillboards);
	}

	/**
	 * Render the scene.
	 * 
	 * There is a NASTY hack in here to stop Cesium messing up when tabs are
	 * switched
	 */
	function renderScene() {
		(function tick() {
			if (_render) {
				try {
					scene.render();
				} catch (err) {
				}
				Cesium.requestAnimationFrame(tick);
			}
		}());
	}

	/**
	 * Listen for requests to change the view.
	 */
	jQuery(document).bind('agsattrack.change3dview', function(event, view) {
		if (scene.mode !== Cesium.SceneMode.MORPHING) {
			switch (view) {
			case 'twod':
				transitioner.morphTo2D();
				break;
			case 'twopointfived':
				transitioner.toColumbusView()
				break;
			case 'threed':
				transitioner.morphTo3D();
				break;
			}
		}
	});



	function populateSatelliteBillboard() {
		var billboard;
		var image = new Image();
		var satellites = AGSatTrack.getSatellites();

		satBillboards.removeAll();
		for ( var i = 0; i < satellites.length; i++) {
			if (satellites[i].isDisplaying()) {
				billboard = satBillboards.add({
					imageIndex : 0,
					position : new Cesium.Cartesian3(0, 0, 0)
				}); // BOGUS position
				billboard.satelliteName = satellites[i].getName();
				billboard.satelliteNoradId = satellites[i].getNoradId();
				billboard.satelliteindex = i;
			}
		}
		scene.getPrimitives().add(satBillboards);
		image.src = 'images/Satellite.png';
		image.onload = function() {
			var textureAtlas = scene.getContext().createTextureAtlas({
				image : image
			}); // seems needed in onload()
			satBillboards.setTextureAtlas(textureAtlas);
		};
	}

	function updateSatelliteBillboards() {
		var now = new Cesium.JulianDate();
		var pos, newpos, bb;
		var satellites = AGSatTrack.getSatellites();

		
		if (_selected !== null && _follow) {
			var satInfo = _selected.sat.getData();
			var observer = AGSatTrack.getObservers()[0];
			var target = ellipsoid
			.cartographicToCartesian(Cesium.Cartographic
					.fromDegrees(observer.getLon(), observer
							.getLat()));
			var eye = ellipsoid
					.cartographicToCartesian(Cesium.Cartographic
							.fromDegrees(satInfo.longitude,satInfo.latitude, (satInfo.altitude + 10) *1000));
			var up = new Cesium.Cartesian3(0, 0, 1);
			scene.getCamera().lookAt(eye, target, up);
		}
		
		satBillboards.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
				Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
				Cesium.Cartesian3.ZERO);

		for ( var i = 0; i < satBillboards.getLength(); i++) {
			bb = satBillboards.get(i);
			pos = satellites[bb.satelliteindex].getData();

			newpos = new Cesium.Cartesian3(pos.x * 1000, pos.y * 1000,
					pos.z * 1000); // TODO multiplyByScalar(1000)
			bb.setPosition(newpos);
		}
	}

	function drawFootprint() {

		footprintCircle.removeAll();
		var t = footprintCircle.add();
		var satInfo = _selected.sat.getData();

		var now = new Cesium.JulianDate();
		t.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
				Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
				Cesium.Cartesian3.ZERO);

		t.setPositions(Cesium.Shapes.computeCircleBoundary(ellipsoid, ellipsoid
				.cartographicToCartesian(new Cesium.Cartographic.fromDegrees(
						satInfo.longitude, satInfo.latitude)),
				satInfo.footprint * 500));
	}

	function satelliteClickDetails(scene) {
		var handler = new Cesium.EventHandler(scene.getCanvas());

		handler.setMouseAction(function(click) {
			var pickedObject = scene.pick(click.position);
			if (pickedObject) {
				var selected = pickedObject.satelliteindex;
				//setupOrbit();
				var satDetails = AGSatTrack.getSatellite(selected);
				jQuery(document).trigger('agsattrack.satclicked', {index: selected, sat: satDetails});
			}
		}, Cesium.MouseEventType.LEFT_CLICK);
	}

	function resetOrbit() {
		orbitLines.removeAll();
		footprintCircle.removeAll();
	}

	function setupOrbit() {
        if (_selected.sat !== null) {
		    var orbit = _selected.sat.getOrbitData();
		    var plottingAos = false;
		    
		    if (typeof (orbit[0]) !== 'undefined') {

			    var now = new Cesium.JulianDate();
			    orbitLines.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
					    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
					    Cesium.Cartesian3.ZERO);

			    orbitLines.removeAll();
			    var points = [];
			    var pointsAOS = [];
			    for ( var i = 0; i < orbit.length; i++) {
				    points.push(new Cesium.Cartesian3(orbit[i].x * 1000,
						    orbit[i].y * 1000, orbit[i].z * 1000));
				    
				    if (orbit[i].el >= AGSETTINGS.getAosEl()) {
					    pointsAOS.push(new Cesium.Cartesian3(orbit[i].x * 1000,
							    orbit[i].y * 1000, orbit[i].z * 1000));
					    plottingAos = true;
				    }
				    
				    if (plottingAos && orbit[i].el <= AGSETTINGS.getAosEl()) {
					    plottingAos = false;
					    orbitLines.add({
						    positions : pointsAOS,
						    width : 3,
						    color : Cesium.Color.GREEN
					    });
					    pointsAOS = [];
				    }
				    
				    
			    }
			    
		    //	var segments = Cesium.PolylinePipeline.wrapLongitude(ellipsoid, points);
		    //	for (var i=0; i < segments.length; i++) {
				    orbitLines.add({
					    positions : points,
					    width : 1,
					    color : Cesium.Color.RED
				    });
		    //	}
			    if (plottingAos) {
				    orbitLines.add({
					    positions : pointsAOS,
					    width : 3,
					    color : Cesium.Color.GREEN
				    });
			    }

		    }
        }
	}

	jQuery('<canvas/>', {
		'id' : 'glCanvas',
		'class' : 'fullsize'
	}).appendTo('#cesiumContainer');

	canvas = jQuery('#glCanvas')[0];
	scene = new Cesium.Scene(canvas);
	transitioner = new Cesium.SceneTransitioner(scene, ellipsoid);

	cb.getImageryLayers().addImageryProvider(TILE_PROVIDERS.static);
	cb.showSkyAtmosphere = true;

	scene.getPrimitives().setCentralBody(cb);

	scene.skyAtmosphere = new Cesium.SkyAtmosphere();
	var imageryUrl = 'images/';
	scene.skyBox = new Cesium.SkyBox({
		positiveX : imageryUrl + 'skybox/tycho8_px_80.jpg',
		negativeX : imageryUrl + 'skybox/tycho8_mx_80.jpg',
		positiveY : imageryUrl + 'skybox/tycho8_py_80.jpg',
		negativeY : imageryUrl + 'skybox/tycho8_my_80.jpg',
		positiveZ : imageryUrl + 'skybox/tycho8_pz_80.jpg',
		negativeZ : imageryUrl + 'skybox/tycho8_mz_80.jpg'
	});

	scene.getCamera().getControllers().addCentralBody();
	scene.getCamera().getControllers().get(0).spindleController.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
	scene.getCamera().lookAt(
			new Cesium.Cartesian3(4000000.0, -15000000.0, 10000000.0), // eye
			Cesium.Cartesian3.ZERO, // target
			new Cesium.Cartesian3(-0.1642824655609347, 0.5596076102188919,
					0.8123118822806428)); // up

	satelliteClickDetails(scene);
	scene.getPrimitives().add(orbitLines);
	scene.getPrimitives().add(footprintCircle);

	scene.setAnimation(function() {

		updateCounter++;

		if (updateCounter > 10) {
			updateCounter = 0;
			if (scene.mode !== Cesium.SceneMode.MORPHING) {
				updateSatelliteBillboards();

				if (_selected !== null) {
					drawFootprint();
				}
			}
		}

	})
	jQuery(window).trigger('resize');
	
	return {
		startRender : function() {
			_render = true;
			renderScene();
		},

		stopRender : function() {
			_render = false;
		},

		init : function() {

		}
	}
}