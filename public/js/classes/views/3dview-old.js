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

/* Options for JS Lint http://www.jslint.com/
* 
* Last Checked: 09/03/2014
* 
*/
/*jslint white: true, nomen: true */
/*global document, jQuery, AGSatTrack, AGSETTINGS, AGIMAGES, AGUTIL, AGVIEWS, AGWINDOWMANAGER, AGOBSERVER, Cesium, console */

var AG3DVIEW = function(element) {
    'use strict';

            
    var _viewer;    
    var ellipsoid =null;
    var canvas = null;
    var scene = null;
    var cb = null;
    var observerBillboards = null;
    var _cityBillboards = null;
    var _cityLabels = null;
    var _observerLabels = null;
    var _observerCircles = null;
    var _render = false;
    var satBillboards = null;
    var planetsBillboards = null;
    var _satNameLabels = null;
    var orbitLines = null;
    var selectedLines = null;
    var passLines = null;
    var footprintCircle = null;
    var clock = null;
    var _follow = false;
    var _followFromObserver = false;
    var _showview = false;
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
    var _settings = AGSETTINGS.getViewSettings('threed');
    var _currentProvider = 'staticimage';
    
    var _homeLocationCircle = null;
    var _mutualLocationCircle = null;
    
    var _footprintPolygons = [];
                
    var satImages;
                    
    if (typeof element === 'undefined') {
        _element = '3d';    
    } else {
        _element = element;
    }
    
    jQuery(window).resize(function(){
        resize();
    });

    function resize(width, height) {            
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#cesiumContainer');
            width = parent.width();
            height = parent.height();
        }

        _viewer.forceResize ();
        return;
        
        if (width !== 0 && height !== 0) {
            _viewer.canvas.width = width-30;
            _viewer.canvas.height = height-30;

            _viewer.scene.camera.frustum.aspectRatio = width / height;
        }          
    }

    jQuery(document).bind('agsattrack.show3dlocationinfo',
            function(e) {
                if (_render) {
                    showLocationWindow();
                }
            }); 
            
    jQuery(document).bind('agsattrack.settingssaved',
            function(e, observer) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _settings = AGSETTINGS.getViewSettings('threed');
                    TILE_PROVIDERS.staticimage.provider =  new Cesium.SingleTileImageryProvider({
                        url : 'images/maps/' + _settings.staticimage
                    });
                    if (_currentProvider === 'staticimage') {
                        setTileProvider(_currentProvider);
                    }
                    setupSatelliteImages();
                    createSatellites();
                    plotObservers();
                    setTerrainProvider(_settings.useTerrainProvider);
                    if (AGSETTINGS.getViewSettings('threed').showCities) {
                        jQuery('#3d-show-cities').setState(true);
                        plotCities();
                    } else {
                        jQuery('#3d-show-cities').setState(false);
                        clearCities();
                    }                    
                }
            }); 
       
    jQuery(document).bind('agsattrack.locationAvailable',
            function(e, observer) {
                if (AGSETTINGS.getHaveWebGL()) {
                    plotObservers();
          //          plotMutualCircles();
                }
            }); 
                            
    jQuery(document).bind('agsattrack.locationUpdated',
            function(e, observer) {
                if (AGSETTINGS.getHaveWebGL()) {
                    plotObservers();
                    plotMutualCircles();
                }
            });    

    jQuery(document).bind('agsattrack.resetview',
            function(e, observer) {
                if (_render) {
                    if (AGSETTINGS.getHaveWebGL()) {
                        _followFromObserver = false;
                        _follow = false;
                        AGSatTrack.getTles().resetAll();
                        plotObservers();
                        plotMutualCircles();
                        updateSatellites();
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

    jQuery(document).bind('agsattrack.setfootprinttype',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _settings.fillFootprints = state;
                    drawFootprint();
                }
            });  

    jQuery(document).bind('agsattrack.setssp',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _settings.showGroundSSP = state;
                    setupOrbit();
                }
            });                 

    jQuery(document).bind('agsattrack.showmutuallocations',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    AGSETTINGS.setMutualObserverEnabled(state);
                    plotMutualCircles();
                }
            });
                
    jQuery(document).bind('agsattrack.followsatelliteview',
            function(e, follow) {
                if (AGSETTINGS.getHaveWebGL()) {
                    _showview = follow;
                    if (_render) {
                        plotObservers();
                        updateSatellites();
                    }                    
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
                        _viewer.scene.skyAtmosphere = _skyAtmosphere;    
                    } else {
                        _viewer.scene.skyAtmosphere = undefined;    
                    }
                }
            });

    jQuery(document).bind('agsattrack.showskybox',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    if (state) {
                        _viewer.scene.skyBox = _skybox;
                    } else {
                        _viewer.scene.skyBox = undefined;                           
                    }
                }
            });
            
    jQuery(document).bind('agsattrack.showfps',
            function(e, state) {
                if (AGSETTINGS.getHaveWebGL()) {
                    if (state) {
                    //    _fps = new Cesium.PerformanceDisplay();                         
                   //     scene.primitives.add(_fps);    
                        _viewer.scene.debugShowFramesPerSecond = true;
                    } else {
//                        scene.primitives.remove(_fps);                               
                        _viewer.scene.debugShowFramesPerSecond = false;
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
                    if (_viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
                        setTileProvider(provider);
                    }
                }
            });

    jQuery(document).bind('agsattrack.satsselectedcomplete', function() {
        if (_render && _mode !== AGVIEWS.modes.SINGLE) {
            if (AGSETTINGS.getHaveWebGL()) {        
                createSatellites();
                plotMutualCircles();
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
            setView(view);
        }
    });

    jQuery(document).bind('agsattrack.showterrain', function(event, state) {
        if (AGSETTINGS.getHaveWebGL()) {
            setTerrainProvider(state);
        }
    });    

    jQuery(document).bind('agsattrack.showcities', function(event, state) {
        if (AGSETTINGS.getHaveWebGL()) {
            if (state) {
                plotCities();    
            } else {
                clearCities();
            }
        }
    });  
        
    function showLocationWindow() {
        AGWINDOWMANAGER.showWindow('dx');     
    }
    
    function setView(view) {   
        if (_viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
            switch (view) {
            case 'twod':
                _viewer.scene.morphTo2D();
                jQuery('#3d-projection').setTitle('Views', '<br /> 2d view' );
                setButtonsState(false);
                break;
            case 'twopointfived':
                _viewer.scene.morphToColumbusView();
                jQuery('#3d-projection').setTitle('Views', '<br /> 2.5d view' ); 
                setButtonsState(false);
                break;
            case 'threed':
                _viewer.scene.morphTo3D(); 
                jQuery('#3d-projection').setTitle('Views', '<br /> 3d view' );                     
                setButtonsState(true);
                break;
            }
        }
    }
    
    function setButtonsState(state) {
        if (state) {
            jQuery('#3d-sat-finder').combo('enable');
            jQuery('#3d-follow-obs').enable();
            jQuery('#3d-follow-sat').enable();
            jQuery('#3d-skybox').enable();
            jQuery('#3d-atmosphere').enable();
        } else {
            jQuery('#3d-sat-finder').combo('disable');
            jQuery('#3d-follow-obs').disable();
            jQuery('#3d-follow-sat').disable();
            jQuery('#3d-skybox').disable();
            jQuery('#3d-atmosphere').disable();
        }
    }
        
    function clearCities() {
        _cityBillboards.removeAll();    
        _cityLabels.removeAll();    
    }
    
    function plotCities() {
        AGDATAMANAGER.getData('locations', function(data){
            clearCities();
            var populationLimit = AGSETTINGS.getViewSettings('threed').cityPopulation;
            var label; 
            var ellipsoid = _viewer.scene.globe.ellipsoid;           
            for ( var i = 0; i < data.length; i++) {
                if (data[i].pop >= populationLimit) {
                    _cityBillboards.add({
                        position : ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(data[i].lon, data[i].lat)),
                        image : AGIMAGES.getImage('citybullet')                                         
                    });
                    
                    label = _cityLabels.add({
                        position  : ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(data[i].lon, data[i].lat)),
                        text      : '   ' + data[i].shortname + ' (' + data[i].prefix + ')',
                        font      : AGSETTINGS.getViewSettings('threed').cityFontSize + 'px Arial',
                        fillColor : Cesium.Color.fromCssColorString('#'+AGSETTINGS.getViewSettings('threed').cityLabelColour)
                    }); 
                    label.translucencyByDistance = new Cesium.NearFarScalar(20.5e2, 1.0, 30.0e6, 0.0);
                }
            }              
        }, false);        
    }
     
    /**
     * Plot the observers.
     */
    function plotObservers() {
        var observers = null;
        var observer = null;
        observerBillboards.removeAll();
        _observerLabels.removeAll();       
        observers = AGSatTrack.getObservers();
        var ellipsoid = _viewer.scene.globe.ellipsoid;
        for ( var i = 0; i < observers.length; i++) {
            observer = observers[i];
            if (observer.isReady() && observer.getEnabled()) { 
                observerBillboards.add({
                    position : ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat())),
                    image : AGIMAGES.getImage('home')                                          
                });
                
                _observerLabels.add({
                    position  : ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat())),
                    text      : '   ' + observer.getName(),
                    font      : '12px Helvetica',
                    fillColor : { red : 0.0, blue : 0.0, green : 0.0, alpha : 1.0 }
                });                
            }
        }
        
        observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);
        if (typeof observer !== 'undefined') {
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
              //  _viewer.scene.camera.lookAt(eye, target, up);
            }
        }

    }

    function plotMutualCircles() {
        var observer;
        _settings.fillMutual = true;
        var primitives = scene.primitives;        
        _observerCircles.removeAll();
        if (_homeLocationCircle !==  null) {
            primitives.remove(_homeLocationCircle);
        }
        if (_mutualLocationCircle !== null) {
            primitives.remove(_mutualLocationCircle);
        }
        if (AGSETTINGS.getMutualObserverEnabled()) {
            var following = AGSatTrack.getFollowing();
            if (following !== null) {                
                if (_settings.fillMutual) {
                    observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);            
                    _homeLocationCircle = new Cesium.Polygon();

                    _homeLocationCircle.material.uniforms.color = {
                      red   : 0.0,
                      green : 0.0,
                      blue  : 0.0,
                      alpha : 0.3
                    };       
                    _homeLocationCircle.setPositions(
                            Cesium.Shapes.computeCircleBoundary(
                                    ellipsoid,
                                    ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat())),
                                    following.get('footprint') * 500));
                    primitives.add(_homeLocationCircle);
                    primitives.lowerToBottom(_homeLocationCircle);
                       
                       
                       
                    observer = AGSatTrack.getObserver(AGOBSERVER.types.MUTUAL);            
                    _mutualLocationCircle = new Cesium.Polygon();

                    _mutualLocationCircle.material.uniforms.color = {
                      red   : 0.0,
                      green : 0.0,
                      blue  : 0.0,
                      alpha : 0.3
                    };       
                    _mutualLocationCircle.setPositions(
                            Cesium.Shapes.computeCircleBoundary(
                                    ellipsoid,
                                    ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat())),
                                    following.get('footprint') * 500));
                    primitives.add(_mutualLocationCircle);
                    primitives.lowerToBottom(_mutualLocationCircle);                    

                } else {
                    var footPrint = _observerCircles.add();   
                    observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);            
                    footPrint.setPositions(Cesium.Shapes.computeCircleBoundary(ellipsoid, ellipsoid
                            .cartographicToCartesian(new Cesium.Cartographic.fromDegrees(
                                    observer.getLon(), observer.getLat())),
                            following.get('footprint') * 500));
                            
                    footPrint = _observerCircles.add();   
                    observer = AGSatTrack.getObserver(AGOBSERVER.types.MUTUAL);            
                    footPrint.setPositions(Cesium.Shapes.computeCircleBoundary(ellipsoid, ellipsoid
                            .cartographicToCartesian(new Cesium.Cartographic.fromDegrees(
                                    observer.getLon(), observer.getLat())),
                            following.get('footprint') * 500));                      
                }
            }  
        }     
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
                scene.render();
                Cesium.requestAnimationFrame(tick);
            }
        }());
        
    }
    
    function createSatelliteLabels() {
        var satellites = AGSatTrack.getSatellites();
        var cpos = 0;
        var labelVisible = true;
        var now = new Cesium.JulianDate();
                
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
        
        _satNameLabels.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
            Cesium.Cartesian3.ZERO);
                
        _satNameLabels.removeAll();
        if (okToCreate) {
            for ( var i = 0; i < satellites.length; i++) {
                if (satellites[i].isDisplaying()) {
                    labelVisible = true;
                    if (!_showSatLabels) {
                        labelVisible = false;
                        if (satellites[i].getSelected())  {
                            labelVisible = true;    
                        }
                    }
                    cpos = new Cesium.Cartesian3(satellites[i].get('x'), satellites[i].get('y'), satellites[i].get('z'));
                    cpos = Cesium.Cartesian3.multiplyByScalar(cpos, 1000, cpos);               
                    cpos = Cesium.Cartesian3.multiplyByScalar(cpos, 30/1000+1, cpos); 
                                
                    var satLabel = _satNameLabels.add({
                      show : labelVisible,
                      position : cpos,
                      text : satellites[i].getName(),
                      font : _settings.unselectedLabelSize + 'px sans-serif',
                      fillColor : Cesium.Color.fromCssColorString('#'+_settings.unselectedLabelColour),
                      outlineColor : _settings.unselectedLabelColour,
                      style : Cesium.LabelStyle.FILL,
                      scale : 1.0,
                      translucencyByDistance: new Cesium.NearFarScalar(15.5e2, 1.0, 40.0e6, 0.0)
                    });

                    if (satellites[i].getSelected()) {
                        satLabel.font = _settings.selectedLabelSize + 'px sans-serif';
                        satLabel.fillColor = Cesium.Color.fromCssColorString('#'+_settings.selectedLabelColour);
                    } else {
                        satLabel.font = _settings.unselectedLabelSize + 'px sans-serif';
                        satLabel.fillColor = Cesium.Color.fromCssColorString('#'+_settings.unselectedLabelColour);
                    }
                    satLabel.satelliteindex = i;
                }
            }
        } 
    }
    
    function setupSatelliteImages() {
        var satUnselected = 'satellite' + _settings.unselectedIcon + _settings.unselectedIconSize;
        var satSelected = 'satellite' + _settings.selectedIcon + _settings.selectedIconSize;

        var satUnselectedGrey = 'satellitegrey' + _settings.unselectedIcon + _settings.unselectedIconSize;
        var satSelectedGrey = 'satellitegrey' + _settings.selectedIcon + _settings.selectedIconSize;
                    
        satImages = [
            AGIMAGES.getImage(satUnselected),
            AGIMAGES.getImage(satSelected),
            AGIMAGES.getImage('iss16'),
            AGIMAGES.getImage('iss32'),
            AGIMAGES.getImage(satUnselectedGrey),
            AGIMAGES.getImage(satSelectedGrey)
        ];        
    }    
    
    function createSatellites() {
        var billboard;
        var now = new Cesium.JulianDate();
        var cpos = 0;
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

        var satdata = [];
        for ( var i = 0; i < satellites.length; i++) {
            var satObject = {
                value : satellites[i].getCatalogNumber(),
                text : satellites[i].getName()
            };
            satdata.push(satObject);
        }            
        jQuery('#3d-sat-finder').combobox('loadData',satdata );
                
        satBillboards.removeAll();

        if (okToCreate) {
            satBillboards.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                    Cesium.Cartesian3.ZERO);        

            for (i = 0; i < satellites.length; i++) {
                if (satellites[i].isDisplaying()) {
                    cpos = new Cesium.Cartesian3(satellites[i].get('x'), satellites[i].get('y'), satellites[i].get('z'));              
                    cpos = Cesium.Cartesian3.multiplyByScalar(cpos, 1000, cpos);               
                    if (satellites[i].getCatalogNumber() === '25544') {
                        billboard = satBillboards.add({
                            image: satImages[2],
                            position : cpos,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER                                               
                        });
                    } else {
                        billboard = satBillboards.add({
                            image: satImages[0],
                            position : cpos                   
                        });                        
                    }
                    billboard.satelliteName = satellites[i].getName();
                    billboard.satelliteCatalogId = satellites[i].getCatalogNumber();
                    billboard.satelliteindex = i;
                }
            }
            scene.primitives.add(satBillboards);
        }
        createSatelliteLabels();
    }

    function updateSatellites() {
        var now = new Cesium.JulianDate();
        var newpos, bb;
        var following = AGSatTrack.getFollowing();
        var target;
        var up = new Cesium.Cartesian3();
        var satellites;
        var okToUpdate = false;
        var eye;
            
        if (_mode !== AGVIEWS.modes.SINGLE) {
            satellites = AGSatTrack.getSatellites();
            okToUpdate = true;
        } else {
            if (_singleSat !== null) {
                satellites = [_singleSat];    
                okToUpdate = true;
            }
        }

        for ( var i = 0; i < satBillboards.length; i++) {
            satBillboards.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
            _satNameLabels.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
   
            bb = satBillboards.get(i);
     
            var offset = 4;
            var visibility = satellites[bb.satelliteindex].get('visibility');
            if ( visibility === 'Daylight' || visibility === 'Visible') {
                offset = 0;
            }

            if (satellites[bb.satelliteindex].getSelected()) {
                if (satellites[i].getCatalogNumber() === '25544') {
                    bb.image = satImages[3];    
                } else {
                    bb.image = satImages[1 + offset];    
                }
            } else {
                if (satellites[i].getCatalogNumber() === '25544') {
                    bb.image = satImages[2];    
                } else {
                    bb.image = satImages[0 + offset];;    
                }   
            }
                        
            newpos = new Cesium.Cartesian3(satellites[bb.satelliteindex].get('x'), satellites[bb.satelliteindex].get('y'), satellites[bb.satelliteindex].get('z'));
            newpos = Cesium.Cartesian3.multiplyByScalar(newpos, 1000, newpos);
            
//newpos = Cesium.Cartesian3.fromDegrees(satellites[bb.satelliteindex].get('longitude'), satellites[bb.satelliteindex].get('latitude'), satellites[bb.satelliteindex].get('altitude')*1000);
            
            bb.position = newpos;
           
            newpos = Cesium.Cartesian3.multiplyByScalar(newpos, 30/1000+1, newpos);            
            var satLabel = _satNameLabels.get(i);
            if (satellites[bb.satelliteindex].getSelected()) {
                satLabel.font = _settings.selectedLabelSize + 'px sans-serif';
                satLabel.fillColor = Cesium.Color.fromCssColorString('#'+_settings.selectedLabelColour);
            } else {
                satLabel.font = _settings.unselectedLabelSize + 'px sans-serif';
                satLabel.fillColor = Cesium.Color.fromCssColorString('#'+_settings.unselectedLabelColour);
            }
            satLabel.position = newpos;

        }
        
        if (following !== null && (_follow || _followFromObserver || _showview)) {
            var observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);

            if (_showview) {
                target = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(following.get('longitude'), following.get('latitude'), 0));   
                eye = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(following.get('longitude'), following.get('latitude'), (following.get('altitude')*1000)));
                up = Cesium.Cartesian3.normalize(eye, up);              
            } else {
                if (_followFromObserver) {
                    eye = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat(), 100));
                    target = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(following.get('longitude'), following.get('latitude'), following.get('altitude')*1000));   
                    up = Cesium.Cartesian3.normalize(eye, up);                                
                } else {
                    target = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat(), 100));   
                    eye = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(following.get('longitude'), following.get('latitude'), (following.get('altitude')*1000)+50));
                    up = Cesium.Cartesian3.normalize(eye, up);
                }
            }
            scene.camera.lookAt(eye, target, up);                                      
        }
                
        setupOrbit();
    }

    function drawFootprint() {
        var circle;
        var color = Cesium.Color.WHITE;;
        var footPrint;
        var i;

        var primitives = scene.primitives;
        for (i=0;i<_footprintPolygons.length;i++) {
            primitives.remove(_footprintPolygons[i]);  
        }
        footprintCircle.removeAll();
        var selected = AGSatTrack.getTles().getSelected();
        for (i = 0; i < selected.length; i++) {
            if (_settings.fillFootprints) {


                if (selected[i].get('elevation') >= AGSETTINGS.getAosEl()) {
                    color = new Cesium.Color({
                      red   : 0.0,
                      green : 0.5,
                      blue  : 0.0,
                      alpha : 0.4
                    });
                } else {
                    color = new Cesium.Color({
                      red   : 0.5,
                      green : 0.0,
                      blue  : 0.0,
                      alpha : 0.4
                    });
                }        
                
                var circleGeometry = new Cesium.CircleGeometry({
                    center : Cesium.Cartesian3.fromDegrees(selected[i].get('longitude'), selected[i].get('latitude')),
                    radius : selected[i].get('footprint') * 500,
                    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                });
                var redCircleInstance = new Cesium.GeometryInstance({
                    geometry : circleGeometry,
                    attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(color)
                    }
                });
                var circle = new Cesium.Primitive({
                    geometryInstances: [redCircleInstance],
                    appearance: new Cesium.PerInstanceColorAppearance({
                        closed: true
                    })
                })
                scene.primitives.add(circle);
                _footprintPolygons.push(circle);                
                primitives.add(circle);
                primitives.lowerToBottom(circle);
            } else {
                footPrint = footprintCircle.add();
                if (selected[i].get('elevation') >= AGSETTINGS.getAosEl()) {
                    color = Cesium.Color.GREEN;
                } else {
                    color = Cesium.Color.RED;
                }
                

                
                var circleOutlineGeometry = new Cesium.CircleOutlineGeometry({
//                    center : Cesium.Cartesian3.fromDegrees(selected[i].get('longitude'), selected[i].get('latitude')),
                    center:  new Cesium.Cartesian3(selected[i].get('x'), selected[i].get('y'), selected[i].get('z')),
                    radius : selected[i].get('footprint') * 1000
                });
                var circleOutlineInstance = new Cesium.GeometryInstance({
                    geometry : circleOutlineGeometry,
                    attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(color)
                    }
                });
                
    //    var mm = Cesium.Matrix4.fromRotationTranslation(
      //          Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
        //        Cesium.Cartesian3.ZERO);
                                
                circle = new Cesium.Primitive({
                    geometryInstances : [circleOutlineInstance],
                    appearance : new Cesium.PerInstanceColorAppearance({
                        flat : true,
                        renderState : {
                            lineWidth : Math.min(3.0, scene.maximumAliasedLineWidth)
                        }
                    })//,
                 //   modelMatrix: mm
                })
                scene.primitives.add(circle);
                _footprintPolygons.push(circle);              
            }

        }

    }

    function satelliteClickDetails(scene) {
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        handler.setInputAction(function(click) {
            var pickedObject = scene.pick(click.position);
            if (pickedObject) {
                var selected = pickedObject.primitive.satelliteCatalogId;
                jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: selected});
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    function mouseMoveDetails(scene, ellipsoid) {
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function(movement) {

            ShowCameraPosition();
            
            if (_showMousePos) {
                var cartesian = scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
                if (cartesian && !isNaN(cartesian.x)) {
                    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                    _mousePosLabel.show = true;
                    var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                    var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

                    _mousePosLabel.text = '(' + AGUTIL.convertDecDegLon(lon, false) + ', ' + AGUTIL.convertDecDegLat(lat, false) + ')';
                    _mousePosLabel.position = cartesian;
                } else {
                    _mousePosLabel.text = '';
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        
        handler.setInputAction(function(movement) {
            ShowCameraPosition();
        }, Cesium.ScreenSpaceEventType.WHEEL);        
    }
    
    function ShowCameraPosition() {
        
        var cameraCartographic = _viewer.scene.globe.ellipsoid.cartesianToCartographic(_viewer.scene.camera.position);            
        var cameraAlt = cameraCartographic.height;                
        cameraAlt = (cameraAlt / 1000).toFixed(0);
        var cameraLon = Cesium.Math.toDegrees(cameraCartographic.longitude).toFixed(2);
        var cameraLat = Cesium.Math.toDegrees(cameraCartographic.latitude).toFixed(2);
        jQuery('#camera-pos').html('<strong>Lat:</strong>&nbsp;' + AGUTIL.convertDecDegLat(cameraLat, false) + '&nbsp;&nbsp;<strong>Lon:</strong>&nbsp;' + AGUTIL.convertDecDegLon(cameraLon, false) + '&nbsp;&nbsp;<strong>Alt:</strong>&nbsp;' + cameraAlt + 'Km');
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
    
    function plotLine(cartPoints, colour, polylineCollection, width, showSsp) {
        var pos;
        var points = [];
        var selectedPoints = [];
        var lastPos;
        var now = new Cesium.JulianDate();
        var cartographic;
        var target;
        var _material = null;
        
        polylineCollection.modelMatrix = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
      

        lastPos = cartPoints[0];
        for ( var i = 0; i < cartPoints.length; i++) {    
            if (checkOkToPlot(lastPos, cartPoints[i])) {
                pos = new Cesium.Cartesian3(cartPoints[i].x, cartPoints[i].y, cartPoints[i].z);
                pos = Cesium.Cartesian3.multiplyByScalar(pos, 1000, pos);
                points.push(pos);
                
                switch (colour) {
                    case 'red':
                        _material = Cesium.Material.fromType('Color');
                        _material.uniforms.color = {red : 1.0, green : 0.0, blue : 0.0, alpha : 1.0};                
                        break;
                    
                    case 'green':
                        _material = Cesium.Material.fromType('Color');
                        _material.uniforms.color = {red : 0.0, green : 1.0, blue : 0.0, alpha : 1.0};                          
                        break;
                }
                        
                /**
                * Add the lines from satelite point to ssp
                */
                if (showSsp && _settings.showGroundSSP) {
                    selectedPoints = [];
                    selectedPoints.push(pos);
                    cartographic = ellipsoid.cartesianToCartographic(pos);
                    target = ellipsoid.cartographicToCartesian(new Cesium.Cartographic(cartographic.longitude, cartographic.latitude, 0));                       selectedPoints.push(target);
                    polylineCollection.add({
                        positions : selectedPoints,
                        width : 1,
                        material : _material
                    });
                }
                
            }
            lastPos = cartPoints[i];
        } 
        
        switch (colour) {
            case 'red':
                _material = Cesium.Material.fromType('Color');
                _material.uniforms.color = {red : 1.0, green : 0.0, blue : 0.0, alpha : 1.0};                
                break;
            
            case 'green':
                _material = Cesium.Material.fromType('Color');
                _material.uniforms.color = {red : 0.0, green : 1.0, blue : 0.0, alpha : 1.0};                
                break;
        }
                        
        polylineCollection.add({
            positions : points,
            width : width,
            material : _material
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
                plotLine(orbit.points, 'green', passLines, 1, false);
            } else {
                var pass = sat.getNextPass();
                plotLine(orbit.points, 'red', passLines, 1, false);
                if (parseInt(sat.get('orbitnumber'),10) === parseInt(pass.orbitNumber,10)) {
                    plotLine(pass.pass, 'green', passLines, 2, true);
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
                pos = Cesium.Cartesian3.multiplyByScalar(pos, 1000);
                points.push(pos);
                
                if (orbit[i].el >= AGSETTINGS.getAosEl()) {
                    pos = new Cesium.Cartesian3(orbit[i].x, orbit[i].y, orbit[i].z)
                    pos = Cesium.Cartesian3.multiplyByScalar(pos, 1000);
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

    function disableInput(scene) {
        var controller = scene.screenSpaceCameraController;
        controller.enableTranslate = false;
        controller.enableZoom = false;
        controller.enableRotate = false;
        controller.enableTilt = false;
        controller.enableLook = false;
    }

    function enableInput(scene) {
        var controller = scene.screenSpaceCameraController;
        controller.enableTranslate = true;
        controller.enableZoom = true;
        controller.enableRotate = true;
        controller.enableTilt = true;
        controller.enableLook = true;
    }
    
    function setTerrainProvider(useTerrainProvider) {
        var terrainProvider;
        
        if (useTerrainProvider) {
            terrainProvider = new Cesium.CesiumTerrainProvider({
                url : '//assets.agi.com/stk-terrain/world',
                requestVertexNormals: true
            });
        } else {
            terrainProvider = new Cesium.EllipsoidTerrainProvider({
                ellipsoid : Cesium.Ellipsoid.WGS84
            });    
        }

        _viewer.scene.terrainProvider = terrainProvider;
        jQuery('#3d-show-terrain').setButtonState(useTerrainProvider);
    }
    
    function setTileProvider(provider) {
        if (typeof TILE_PROVIDERS[provider] !== 'undefined') {
            _viewer.terrainProvider = TILE_PROVIDERS[provider].provider; 
            jQuery('#3d-provider').setTitle('Provider', '<br />' + TILE_PROVIDERS[provider].toolbarTitle );
            _currentProvider = provider;        
        }
    } 
    
    function initTileProviders() {
        
        var url = jQuery(location).attr('href');
        var bingAPIKey = '';
        if (url.indexOf('ag.local') === -1 && url.indexOf('agsattrack.com') === -1) {
        } else {
            if (url.indexOf('agsattrack.com') === -1) {
                bingAPIKey = 'Ak1cHw0o6SGIUYUR2khejaEc1ttaB9tsrSaq7rPxOUOkE4oVTuQchtZFEciJHRH_';    
            } else {
                bingAPIKey = 'AkU8YjZ3dvP_fyNkibv_UYfvvlfjuXYzVsWe9ccbYiSy8xXMrroZsq0YQJnGbrFG';    
            }            
        } 
                
        TILE_PROVIDERS = {
            'bing' : {
                provider : new Cesium.BingMapsImageryProvider({
                    url : 'http://dev.virtualearth.net',
                    key : bingAPIKey,
                    mapStyle : Cesium.BingMapsStyle.AERIAL
                }),
                toolbarTitle : 'Bing Maps'                       
            },
            'osm' : {
                provider : new Cesium.OpenStreetMapImageryProvider({
                    url : 'http://otile1.mqcdn.com/tiles/1.0.0/osm'
                }),
                toolbarTitle : 'Open Street maps'                
            },
            'staticimage' : { 
                provider : new Cesium.SingleTileImageryProvider({
                    url : 'images/maps/' + _settings.staticimage
                }),
                toolbarTitle : 'Static Image'
            },
            'arcgis' : {
                provider : new Cesium.ArcGisMapServerImageryProvider(
                    {url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'//,
                  //  proxy: new Cesium.DefaultProxy('http://cesium.agi.com/proxy/')
                }),
                toolbarTitle : 'Arc Gis'                
            }            
        };        
    }   
            
    function init3DView() {
        
               

        initTileProviders();
                
        _skybox = new Cesium.SkyBox({
            sources : {
              positiveX : 'images/spacebook/Version2_dark_px.jpg',
              negativeX : 'images/spacebook/Version2_dark_mx.jpg',
              positiveY : 'images/spacebook/Version2_dark_py.jpg',
              negativeY : 'images/spacebook/Version2_dark_my.jpg',
              positiveZ : 'images/spacebook/Version2_dark_pz.jpg',
              negativeZ : 'images/spacebook/Version2_dark_mz.jpg'
            }
        });
            
        _skyAtmosphere = new Cesium.SkyAtmosphere();
        
        _viewer = new Cesium.Viewer('3d', {
            timeline: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            homeButton: false,
            sceneModePicker: false,
            geocoder: false,
          //  clock: undefined,
            animation: false,
            baseLayerPicker : false,
            creditContainer : 'credits',
            
            skyBox : _skybox,                
            skyAtmosphere : _skyAtmosphere,
                         
            mapProjection : new Cesium.WebMercatorProjection()
        });
        
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world',
            requestVertexNormals: true,
            requestWaterMask: true
        });
        _viewer.terrainProvider = terrainProvider;
        _viewer.scene.globe.enableLighting = true; 
        _viewer.scene.moon = new Cesium.Moon();
               
        _observerLabels = new Cesium.LabelCollection();
        observerBillboards = new Cesium.BillboardCollection();
        _cityBillboards = new Cesium.BillboardCollection();
        _cityLabels = new Cesium.LabelCollection();
        
        _viewer.scene.primitives.add(observerBillboards);
        _viewer.scene.primitives.add(_observerLabels);
               
        _viewer.scene.primitives.add(_cityBillboards);
        _viewer.scene.primitives.add(_cityLabels);  
        
        _labels = new Cesium.LabelCollection(undefined);        
        _mousePosLabel = _labels.add({
            font : '14px sans-serif',
            fillColor : 'black',
            outlineColor : 'black',
            style : Cesium.LabelStyle.FILL
        });
        _viewer.scene.primitives.add(_labels);
                                      
        plotObservers(); 
        
        mouseMoveDetails(_viewer.scene, _viewer.scene.globe.ellipsoid);
/*        
        setupSatelliteImages();
        
        ellipsoid = Cesium.Ellipsoid.WGS84;
        cb = new Cesium.Globe(ellipsoid);
        observerBillboards = new Cesium.BillboardCollection();
        satBillboards = new Cesium.BillboardCollection();
        planetsBillboards = new Cesium.BillboardCollection();
        orbitLines = new Cesium.PolylineCollection();
        selectedLines = new Cesium.PolylineCollection();
        passLines = new Cesium.PolylineCollection();
        footprintCircle = new Cesium.PolylineCollection();
        _observerCircles = new Cesium.PolylineCollection();
        clock = new Cesium.Clock();
        _satNameLabels = new Cesium.LabelCollection();
        _observerLabels = new Cesium.LabelCollection();
        _cityBillboards = new Cesium.BillboardCollection();
        _cityLabels = new Cesium.LabelCollection();
        
        var url = jQuery(location).attr('href');
        var bingAPIKey = '';
        if (url.indexOf('ag.local') === -1 && url.indexOf('agsattrack.com') === -1) {
        } else {
            if (url.indexOf('agsattrack.com') === -1) {
                bingAPIKey = 'Ak1cHw0o6SGIUYUR2khejaEc1ttaB9tsrSaq7rPxOUOkE4oVTuQchtZFEciJHRH_';    
            } else {
                bingAPIKey = 'AkU8YjZ3dvP_fyNkibv_UYfvvlfjuXYzVsWe9ccbYiSy8xXMrroZsq0YQJnGbrFG';    
            }            
        }                
        TILE_PROVIDERS = {
            'bing' : {
                provider : new Cesium.BingMapsImageryProvider({
                    url : 'http://dev.virtualearth.net',
                    key : bingAPIKey,
                    mapStyle : Cesium.BingMapsStyle.AERIAL
                }),
                toolbarTitle : 'Bing Maps'                       
            },
            'osm' : {
                provider : new Cesium.OpenStreetMapImageryProvider({
                    url : 'http://otile1.mqcdn.com/tiles/1.0.0/osm'
                }),
                toolbarTitle : 'Open Street maps'                
            },
            'staticimage' : { 
                provider : new Cesium.SingleTileImageryProvider({
                    url : 'images/maps/' + _settings.staticimage
                }),
                toolbarTitle : 'Static Image'
            },
            'arcgis' : {
                provider : new Cesium.ArcGisMapServerImageryProvider(
                    {url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'//,
                  //  proxy: new Cesium.DefaultProxy('http://cesium.agi.com/proxy/')
                }),
                toolbarTitle : 'Arc Gis'                
            }            
        };
           
        canvas = jQuery('<canvas/>', {
            'id' : 'glCanvas'+_element,
            'class' : 'fullsize'
        }).appendTo('#'+_element)[0];

        scene = new Cesium.Scene({
            canvas: canvas
        });

        cb.imageryLayers.addImageryProvider(TILE_PROVIDERS[_settings.provider].provider);
        cb.showSkyAtmosphere = true;
        
        cb.enableLighting  = true;
        
        scene.globe = cb;

        setTerrainProvider(_settings.useTerrainProvider);
                
        _skyAtmosphere = new Cesium.SkyAtmosphere();
        scene.skyAtmosphere = _skyAtmosphere;
        
        var imageryUrl = 'images/';
        _skybox = new Cesium.SkyBox({
            sources : {
              positiveX : 'images/spacebook/Version2_dark_px.jpg',
              negativeX : 'images/spacebook/Version2_dark_mx.jpg',
              positiveY : 'images/spacebook/Version2_dark_py.jpg',
              negativeY : 'images/spacebook/Version2_dark_my.jpg',
              positiveZ : 'images/spacebook/Version2_dark_pz.jpg',
              negativeZ : 'images/spacebook/Version2_dark_mz.jpg'
            }
        });                        
        scene.skyBox = _skybox;
        
        _labels = new Cesium.LabelCollection(undefined);        
        _mousePosLabel = _labels.add({
            font : '14px sans-serif',
            fillColor : 'black',
            outlineColor : 'black',
            style : Cesium.LabelStyle.FILL
        });
        scene.primitives.add(_satNameLabels);

        scene.sun = new Cesium.Sun();
        scene.moon = new Cesium.Moon();
                
        satelliteClickDetails(scene);
        mouseMoveDetails(scene, ellipsoid);
        scene.primitives.add(orbitLines);
        scene.primitives.add(selectedLines);
        scene.primitives.add(passLines);
        scene.primitives.add(footprintCircle);
        scene.primitives.add(_labels);
        scene.primitives.add(planetsBillboards);
        scene.primitives.add(observerBillboards);
        scene.primitives.add(_observerLabels);
        scene.primitives.add(_observerCircles);
        scene.primitives.add(_cityBillboards);
        scene.primitives.add(_cityLabels);
        
        jQuery(window).trigger('resize');
        
        plotObservers();
        
        if (AGSETTINGS.getViewSettings('threed').showCities) {
            jQuery('#3d-show-cities').setState(true);
            plotCities();
        } else {
            jQuery('#3d-show-cities').setState(false);
        }
        
        jQuery('#3d-provider').setTitle('Provider', '<br />' + TILE_PROVIDERS[_currentProvider].toolbarTitle ); 
        jQuery('#3d-projection').setTitle('Views', '<br /> 3d view' ); 
                
        jQuery('#3d-sat-finder').combobox({
            onSelect : function(record){
                var sat = AGSatTrack.getSatelliteByName(record.value);
                jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: record.value});

                var pos = Cesium.Cartesian3.fromDegrees(sat.get('longitude'), sat.get('latitude'), (sat.get('altitude')*1000)+1000000);
                 
                disableInput(scene);
                var flight = scene.camera.flyTo({
                    destination : pos,
                    complete : function() {
                        enableInput(scene);
                    }
                });
            }
        });
        
       // var inspector = new Cesium.CesiumInspector('inspector', scene);
  */      
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
          /*  if (AGSETTINGS.getHaveWebGL()) {
                _render = true;
                resize();
                renderScene();
                createSatellites();
            }    */
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