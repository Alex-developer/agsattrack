/*
Copyright 2013 Alex Greenland

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
 
/* Options for JSHint http://www.jshint.com/
* 
* Last Checked: 19/01/2013
* 
*/
/*global AGSatTrack, AGSETTINGS, AGIMAGES, AGUTIL, Cesium */ 
 
var AG3DVIEW = function(element) {
    'use strict';

    var ellipsoid =null;
    var canvas = null;
    var scene = null;
    var transitioner = null;
    var cb = null;
    var observerBillboards = null;
    var _render = false;
    var satBillboards = null;
    var planetsBillboards = null;
    var _satNameLabels = null;
    var gridRefresh = 1;
    var gridRefreshCounter = 0;
    var orbitLines = null;
    var passLines = null;
    var footprintCircle = null;
    var updateCounter = 0;
    var clock = null;
    var _selected = null;
    var _follow = false;
    var _followFromObserver = false;
    var TILE_PROVIDERS = null;
    var _skyAtmosphere;
    var _skybox;
    var _fps = null;
    var _labels = null;
    var _mousePosLabel = null;
    var _showMousePos = false;
    var _element;
    var _showSatLabels = true;
    var _singleSat;
    var _mode;
        
    if (typeof element === 'undefined') {
        _element = '3d';    
    } else {
        _element = element;
    }
        
    /*
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
      */
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#'+_element);
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            canvas.width = width;
            canvas.height = height;

            scene.getCamera().frustum.aspectRatio = width / height;
        }          
    }
    
    /**
     * Listen for an observers location becoming available and when it does
     * update all of the observers.
     * 
     * Currently we only have the home observer but this is to allow for mutual
     * pass predicitions i.e. supports more than one observer.
     */
    jQuery(document).bind('agsattrack.locationAvailable',
            function(e, observer) {
                if (AGSETTINGS.getHaveWebGL()) {
                    plotObservers();
                }
            });

    jQuery(document).bind('agsattrack.locationUpdated',
            function(e, observer) {
                if (AGSETTINGS.getHaveWebGL()) {
                    plotObservers();
                }
            });    

    jQuery(document).bind('agsattrack.resetview',
            function(e, observer) {
                if (_render) {
                    if (AGSETTINGS.getHaveWebGL()) {
                        plotObservers();
                    }
                }
            }); 
                
    jQuery(document).bind('agsattrack.showsatlabels',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _showSatLabels = state;
                    createSatelliteLabels();
                }
            });    
    
    jQuery(document).bind('agsattrack.followsatellite',
            function(e, follow) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _follow = follow;
                    if (_render) {
                        plotObservers();
                        updateSatellites();
                    }                    
                }
            });
    
    jQuery(document).bind('agsattrack.followsatelliteobs',
            function(e, follow) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _followFromObserver = follow;
                    if (_render) {
                        plotObservers();
                        updateSatellites();
                    }                    
                }
            });    

    jQuery(document).bind('agsattrack.showatmosphere',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    if (state) {
                        scene.skyAtmosphere = _skyAtmosphere;    
                    } else {
                        scene.skyAtmosphere = undefined;    
                    }
                }
            });

    jQuery(document).bind('agsattrack.showskybox',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    if (state) {
                        scene.skyBox = _skybox;
                    } else {
                        scene.skyBox = undefined;                           
                    }
                }
            });
            
    jQuery(document).bind('agsattrack.showfps',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    if (state) {
                        _fps = new Cesium.PerformanceDisplay();                         
                        scene.getPrimitives().add(_fps);    
                    } else {
                        scene.getPrimitives().remove(_fps);                               
                    }
                }
            });            
                
    jQuery(document).bind('agsattrack.showmousepos',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _showMousePos = state;
                }
            }); 
                
    /**
     * Listen for any changes in the tile provider.
     */
    jQuery(document).bind(
            'agsattrack.changetile',
            function(event, provider) {
                if (AGSETTINGS.getHaveWebGL()) {
                    if (scene.mode !== Cesium.SceneMode.MORPHING) {
                        if (typeof TILE_PROVIDERS[provider] !== 'undefined') {
                            cb.getImageryLayers().removeAll();
                            cb.getImageryLayers().addImageryProvider(
                                    TILE_PROVIDERS[provider]);
                        }
                    }
                }
            });

    jQuery(document).bind('agsattrack.satsselectedcomplete', function() {
        if (_render && _mode !== AGVIEWS.modes.SINGLE) {
            if (AGSETTINGS.getHaveWebGL()) {        
                createSatellites();
            }
        }
    });

    jQuery(document).bind('agsattrack.updatesatdata',
            function(event, selected) {
                if (_render) {
                    if (AGSETTINGS.getHaveWebGL()) { 
                        updateSatellites();
                    }
                }
            });

    /**
     * Listen for requests to change the view.
     */
    jQuery(document).bind('agsattrack.change3dview', function(event, view) {
        if (AGSETTINGS.getHaveWebGL()) {
            if (scene.mode !== Cesium.SceneMode.MORPHING) {
                switch (view) {
                case 'twod':
                    transitioner.morphTo2D();
                    break;
                case 'twopointfived':
                    transitioner.toColumbusView();
                    break;
                case 'threed':
                    transitioner.morphTo3D();
                    break;
                }
            }
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
                
                
                var textureAtlas = scene.getContext().createTextureAtlas({
                    image : AGIMAGES.getImage('home')
                });
                observerBillboards.setTextureAtlas(textureAtlas);
                observerBillboards.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(target);
                observerBillboards.add({
                    imageIndex : 0,
                    position : new Cesium.Cartesian3(0.0, 0.0, 0.0)
                });        
        
                // Point the camera at us and position it directly above us if
                // we are the first observer
                if (i === 0) {
                    scene.getCamera().controller.lookAt(eye, target, up);
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
    var _debugCounter = 0;     
    function renderScene() {
        (function tick() {
            if (_render) {
                if (AGSETTINGS.getDebugLevel() > 0) {                
                    _debugCounter++;
                    if (_debugCounter > 100) {
                        _debugCounter = 0;
                        console.log('3d Animate');
                    }
                }                 
                scene.initializeFrame();
             //   try {
                    scene.render();
        //        } catch (err) {
                    // See told you it was a nasty hack !
          //      }
                Cesium.requestAnimationFrame(tick);
            }
        }());
    }
    
    function createSatelliteLabels() {
        var satellites = AGSatTrack.getSatellites();
        var now = new Cesium.JulianDate();        
        var cpos;

       var okToCreate = false;
        
        if (_mode !== AGVIEWS.modes.SINGLE) {
            satellites = AGSatTrack.getSatellites();
            okToCreate = true;
        } else {
            if (_singleSat !== null) {
                okToCreate = true;
                satellites = [_singleSat];
            }    
        }
                
        _satNameLabels.removeAll();
        if (okToCreate) {
            if (_showSatLabels) {     
                _satNameLabels.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                        Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                        Cesium.Cartesian3.ZERO); 
                for ( var i = 0; i < satellites.length; i++) {
                    if (satellites[i].isDisplaying()) {
                        cpos = new Cesium.Cartesian3(satellites[i].get('x'), satellites[i].get('y'), satellites[i].get('z'));
                        cpos = cpos.multiplyByScalar(1000);               
                        cpos = cpos.multiplyByScalar(30/1000+1); 
                        var satLabel = _satNameLabels.add({
                          show : true,
                          position : cpos,
                          text : satellites[i].getName(),
                          font : '10px sans-serif',
                          fillColor : 'white',
                          outlineColor : 'white',
                          style : Cesium.LabelStyle.FILL,
                          scale : 1.0
                        });
                        satLabel.satelliteindex = i;
                    }
                }
            }
        } 
    }
    
    function createSatellites() {
        var billboard;
        var image = new Image();
        var pos;
        var now = new Cesium.JulianDate();
        var cpos;
        var satellites;
        var okToCreate = false;
        
        if (_mode !== AGVIEWS.modes.SINGLE) {
            satellites = AGSatTrack.getSatellites();
            okToCreate = true;
        } else {
            if (_singleSat !== null) {
                okToCreate = true;
                satellites = [_singleSat];
            }    
        }
                        
        satBillboards.removeAll();

        if (okToCreate) {
            satBillboards.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                    Cesium.Cartesian3.ZERO);        

            for ( var i = 0; i < satellites.length; i++) {
                if (satellites[i].isDisplaying()) {
                    cpos = new Cesium.Cartesian3(satellites[i].get('x'), satellites[i].get('y'), satellites[i].get('z'));
                    cpos = cpos.multiplyByScalar(1000);               
                    billboard = satBillboards.add({
                        imageIndex : (satellites[i].getCatalogNumber() === '25544'?2:0),
                        position : cpos                   
                    });
                    billboard.satelliteName = satellites[i].getName();
                    billboard.satelliteCatalogId = satellites[i].getCatalogNumber();
                    billboard.satelliteindex = i;
                }
            }
            scene.getPrimitives().add(satBillboards);

            var textureAtlas = scene.getContext().createTextureAtlas({
                images : [
                    AGIMAGES.getImage('satellite16'), 
                    AGIMAGES.getImage('satellite32'),
                    AGIMAGES.getImage('iss16'),
                    AGIMAGES.getImage('iss32')
                    ] 
            });
            satBillboards.setTextureAtlas(textureAtlas);
        }
        createSatelliteLabels();
    }

    function updateSatellites() {
        var now = new Cesium.JulianDate();
        var pos, newpos, bb;
        var following = AGSatTrack.getFollowing();
        var target;
        var up;
        var satellites;
        var okToUpdate = false;
                
        if (_mode !== AGVIEWS.modes.SINGLE) {
            satellites = AGSatTrack.getSatellites();
            okToUpdate = true;
        } else {
            if (_singleSat !== null) {
                satellites = [_singleSat];    
                okToUpdate = true;
            }
        }
                
        if (following !== null && (_follow || _followFromObserver)) {
            var observer = AGSatTrack.getObservers()[0];

                            
            if (_followFromObserver) {
                target = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat(), 100));
                up = new Cesium.Cartesian3(0, 0, 1);                                     
            } else {
                target = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat()));
                up = new Cesium.Cartesian3(0, 0, 1);                                     
            } 
                                                  
            var eye = ellipsoid
                    .cartographicToCartesian(Cesium.Cartographic.fromDegrees(following.get('longitude'),following.get('latitude'), (following.get('altitude') + 10) *1000));
            
            if (_followFromObserver) {
                scene.getCamera().controller.lookAt(target, eye, up);                
            } else {
                scene.getCamera().controller.lookAt(eye, target, up);                
            }
        }
        
        satBillboards.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
        _satNameLabels.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
        for ( var i = 0; i < satBillboards.getLength(); i++) {
            bb = satBillboards.get(i);
            
            if (satellites[bb.satelliteindex].getSelected()) {
                if (satellites[i].getCatalogNumber() === '25544') {
                    bb.setImageIndex(3);    
                } else {
                    bb.setImageIndex(1);    
                }
            } else {
                if (satellites[i].getCatalogNumber() === '25544') {
                    bb.setImageIndex(2);    
                } else {
                    bb.setImageIndex(0);    
                }   
            }
            newpos = new Cesium.Cartesian3(satellites[bb.satelliteindex].get('x'), satellites[bb.satelliteindex].get('y'), satellites[bb.satelliteindex].get('z'));
            newpos = newpos.multiplyByScalar(1000);
            bb.setPosition(newpos);

            if (_showSatLabels) {             
                newpos = newpos.multiplyByScalar(30/1000+1);            
                var satLabel = _satNameLabels.get(i);
                satLabel.setPosition(newpos);
            }
        }
        
        setupOrbit();
    }

    function drawFootprint() {
        var footPrint;
        
        footprintCircle.removeAll();
        var selected = AGSatTrack.getTles().getSelected();
        for (var i=0; i< selected.length; i++) {
            footPrint = footprintCircle.add();
            var now = new Cesium.JulianDate();
            footPrint.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                    Cesium.Cartesian3.ZERO);

            footPrint.setPositions(Cesium.Shapes.computeCircleBoundary(ellipsoid, ellipsoid
                    .cartographicToCartesian(new Cesium.Cartographic.fromDegrees(
                            selected[i].get('longitude'), selected[i].get('latitude'))),
                    selected[i].get('footprint') * 500));  
   /*                 
 var ellipse = new Cesium.Polygon();
         ellipse.setPositions(Cesium.Shapes.computeEllipseBoundary(
            ellipsoid, ellipsoid.cartographicToCartesian(
                new Cesium.Cartographic.fromDegrees(
                            satInfo.longitude, satInfo.latitude)), satInfo.footprint * 500,
                    satInfo.footprint * 500, Cesium.Math.toRadians(60)));
        scene.getPrimitives().add(ellipse);
        debugger;
 */                                     
        }

    }

    function satelliteClickDetails(scene) {
        var handler = new Cesium.ScreenSpaceEventHandler(scene.getCanvas());

        handler.setInputAction(function(click) {
            var pickedObject = scene.pick(click.position);
            if (pickedObject) {
                var selected = pickedObject.satelliteCatalogId;
                jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: selected});
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    function mouseMoveDetails(scene, ellipsoid) {
        var handler = new Cesium.ScreenSpaceEventHandler(scene.getCanvas());
        handler.setInputAction(function(movement) {
            if (_showMousePos) {
                var cartesian = scene.getCamera().controller.pickEllipsoid(movement.endPosition, ellipsoid);
                if (cartesian && !isNaN(cartesian.x)) {
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                    _mousePosLabel.setShow(true);
                    var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                    var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                    
                    _mousePosLabel.setText('(' + AGUTIL.convertDecDegLon(lon, false) + ', ' + AGUTIL.convertDecDegLat(lat, false) + ')');
                    _mousePosLabel.setPosition(cartesian);
                } else {
                    _mousePosLabel.setText('');
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
        
    function resetOrbit() {
        orbitLines.removeAll();
        passLines.removeAll();
        footprintCircle.removeAll();
    }

    function setupOrbit() {
        resetOrbit();
        var selected = AGSatTrack.getTles().getSelected();
        for (var i=0; i< selected.length; i++) {
            addOrbitLine(selected[i]);    
        }
        drawFootprint();
    }
    
    function plotLine(cartPoints, colour, polylineCollection, width) {
        var pos;
        var points = [];
        var lastPos;
        var now = new Cesium.JulianDate();
        
        polylineCollection.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
      
        lastPos = cartPoints[0];
        for ( var i = 0; i < cartPoints.length; i++) {    
            if (checkOkToPlot(lastPos, cartPoints[i])) {
                pos = new Cesium.Cartesian3(cartPoints[i].x, cartPoints[i].y, cartPoints[i].z);
                pos = pos.multiplyByScalar(1000);
                points.push(pos);
            }
            lastPos = cartPoints[i];
        } 
        
        polylineCollection.add({
            positions : points,
            width : width,
            color : colour
        });
                                          
    }
    
    /**
    * Check a point is ok to plot, i.e. its more than 'range' units away from the last point
    */
    function checkOkToPlot(lastPos, pos) {
        var result = false;
        var range = 5;
        
        if (Math.abs(lastPos.x - pos.x) > range || Math.abs(lastPos.y - pos.y) > range || Math.abs(lastPos.z - pos.z) > range ) {
            result = true;
        }
        return result;  
    }
    
    
    function addOrbitLine(sat) {    
        var orbit = sat.getOrbitData();
        
        if (typeof orbit !== 'undefined' && typeof orbit.points[0] !== 'undefined') {
            if (sat.isGeostationary() && sat.get('elevation') > 0) {
                plotLine(orbit.points, Cesium.Color.GREEN, passLines, 1);
            } else {
                var pass = sat.getNextPass();
                plotLine(orbit.points, Cesium.Color.RED, passLines, 1);
                if (parseInt(sat.get('orbitnumber'),10) === parseInt(pass.orbitNumber,10)) {
                    plotLine(pass.pass, Cesium.Color.GREEN, passLines, 5);
                }
            }
        }
        
        /*
        if (typeof (orbit[0]) !== 'undefined') {

            var now = new Cesium.JulianDate();
            orbitLines.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                    Cesium.Cartesian3.ZERO);
            passLines.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                    Cesium.Cartesian3.ZERO);
                    
            var points = [];
            var pointsAOS = [];
            for ( var i = 0; i < orbit.length; i++) {
                pos = new Cesium.Cartesian3(orbit[i].x, orbit[i].y, orbit[i].z)
                pos = pos.multiplyByScalar(1000);
                points.push(pos);
                
                if (orbit[i].el >= AGSETTINGS.getAosEl()) {
                    pos = new Cesium.Cartesian3(orbit[i].x, orbit[i].y, orbit[i].z)
                    pos = pos.multiplyByScalar(1000);
                    pointsAOS.push(pos);
                    plottingAos = true;
                }
                
                if (plottingAos && orbit[i].el <= AGSETTINGS.getAosEl()) {
                    plottingAos = false;
                    passLines.add({
                        positions : pointsAOS,
                        width : 3,
                        color : Cesium.Color.GREEN
                    });
                    pointsAOS = [];
                }
                
                
            }
            
        //    var segments = Cesium.PolylinePipeline.wrapLongitude(ellipsoid, points);
        //    for (var i=0; i < segments.length; i++) {

            if (plottingAos) {
                passLines.add({
                    positions : pointsAOS,
                    width : 3,
                    color : Cesium.Color.GREEN
                });
            }        
      
                orbitLines.add({
                    positions : points,
                    width : 1,
                    color : Cesium.Color.RED
                });
      
        //    }


        }
*/
    }

    function init3DView() {
        
        ellipsoid = Cesium.Ellipsoid.WGS84;
        cb = new Cesium.CentralBody(ellipsoid);
        observerBillboards = new Cesium.BillboardCollection();
        satBillboards = new Cesium.BillboardCollection();
        planetsBillboards = new Cesium.BillboardCollection();
        orbitLines = new Cesium.PolylineCollection();
        passLines = new Cesium.PolylineCollection();
        footprintCircle = new Cesium.PolylineCollection();
        clock = new Cesium.Clock();
        _satNameLabels = new Cesium.LabelCollection();
        
        TILE_PROVIDERS = {
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
            'staticimage' : new Cesium.SingleTileImageryProvider({
                url : 'images/NE2_50M_SR_W_4096.jpg'
            })
        };
            
        jQuery('<canvas/>', {
            'id' : 'glCanvas'+_element,
            'class' : 'fullsize'
        }).appendTo('#'+_element);

        canvas = jQuery('#glCanvas'+_element)[0];
        scene = new Cesium.Scene(canvas);
        transitioner = new Cesium.SceneTransitioner(scene, ellipsoid);

        cb.getImageryLayers().addImageryProvider(TILE_PROVIDERS.staticimage);
        cb.showSkyAtmosphere = true;

        scene.getPrimitives().setCentralBody(cb);

        _skyAtmosphere = new Cesium.SkyAtmosphere();
        scene.skyAtmosphere = _skyAtmosphere;
        
        var imageryUrl = 'images/';
        _skybox = new Cesium.SkyBox({
            positiveX : imageryUrl + 'skybox/tycho8_px_80.jpg',
            negativeX : imageryUrl + 'skybox/tycho8_mx_80.jpg',
            positiveY : imageryUrl + 'skybox/tycho8_py_80.jpg',
            negativeY : imageryUrl + 'skybox/tycho8_my_80.jpg',
            positiveZ : imageryUrl + 'skybox/tycho8_pz_80.jpg',
            negativeZ : imageryUrl + 'skybox/tycho8_mz_80.jpg'
        });
        scene.skyBox = _skybox;
        
        _labels = new Cesium.LabelCollection(undefined);        
        _mousePosLabel = _labels.add({
            font : '18px sans-serif',
            fillColor : 'black',
            outlineColor : 'black',
            style : Cesium.LabelStyle.FILL
        });
        scene.getPrimitives().add(_satNameLabels);
                
     /*   scene.getCamera().controller.lookAt(new Cesium.Cartesian3(4000000.0, -15000000.0,  10000000.0), // eye
            Cesium.Cartesian3.ZERO, // target
            new Cesium.Cartesian3(-0.1642824655609347, 0.5596076102188919, 0.8123118822806428)); // up
       */
        satelliteClickDetails(scene);
        mouseMoveDetails(scene, ellipsoid);
        scene.getPrimitives().add(orbitLines);
        scene.getPrimitives().add(passLines);
        scene.getPrimitives().add(footprintCircle);
        scene.getPrimitives().add(_labels);
        scene.getPrimitives().add(planetsBillboards);
        
        jQuery(window).trigger('resize');
    }
    
    /**
    * Disable 3d view if there is no WebGL support
    */
    function initNo3DView() {
        /**
        * Add a sorry message to the view
        */
        jQuery('<div style="padding:20px"><img src="/images/ie.jpg" width=128 style="float:left" /><h1>3D View Not Supported</h1><p>Sorry the 3D view is not supported in your browser.</p><p>Recent versions of Chrome, Firefox, and Safari are supported. Internet Explorer is supported by using the <a target="_blank" href="http://www.google.com/chromeframe">Chrome Frame plugin</a>, which is a one-time install that does not require admin rights</p></div>', {
            'id' : 'glCanvas',
            'class' : 'fullsize'
        }).appendTo('#3d');

        /**
        * Disable all of the toolbar buttons                
        */
        jQuery('#satview3d').hide();
        jQuery('#3d-view-reset').disable();
        jQuery('#3d-projection').disable();
        jQuery('#3d-provider').disable();
        jQuery('#3d-follow').disable();
    }
    
    return {
        startRender : function() {
            if (AGSETTINGS.getHaveWebGL()) {
                _render = true;
                resize();
                renderScene();
                createSatellites();
            }
        },

        stopRender : function() {
            _render = false;
        },

        destroy : function() {
            _render = false;
            jQuery('#'+_element).html('');    
        },
                
        resizeView : function(width, height) {
            if (AGSETTINGS.getHaveWebGL()) {
                resize(width, height);     
            }
        },
        
        reDraw : function() {
            
        },
             
        init : function(mode) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (typeof mode === 'undefined') {
                    mode = AGVIEWS.modes.DEFAULT;    
                }
                _mode = mode;                
                init3DView();
            }
        },
        
        reset : function() {
            _singleSat = null;
            createSatellites();
            updateSatellites();              
        },
        
        postInit : function() {
            if (!AGSETTINGS.getHaveWebGL()) {
                initNo3DView();
            }            
        },
        
        setSingleSat : function(satellite) {
            _singleSat = satellite;
            createSatellites();
            updateSatellites();            
        },
        
        setPassToShow : function(passToShow) {
        }
                
    };
};