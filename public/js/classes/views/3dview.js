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
          
    var _element                // The HTML element we are rendering in
    var _mode;                  // Current view
    var _singleSat;             // True if displaying a single satellite, false otherwise
    var _render = false;
    var _settings = AGSETTINGS.getViewSettings('threed');
    var _show3dmodels = true;
        
    var _viewer;                // The main Cesium viewer   
    var _scene;                 // The Viewers scene
    var _skybox;                // Skybox (Star map)
    var _skyAtmosphere;         // The atmosphere
    
    
    var _satImages;             // Array of satellite images
        
    var _homeModelPath = '/models/CesiumAir/Cesium_Air.bgltf';    
    //var _homeModelPath = '/models/tiefighter/tie_fighter.gltf';    
                    
    if (typeof element === 'undefined') {
        _element = '3d';    
    } else {
        _element = element;
    }
    
    jQuery(window).resize(function(){
        resize();
    });

    jQuery(document).bind('agsattrack.showfps',
        function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (state) {
                    _scene.debugShowFramesPerSecond = true;
                } else {
                    _scene.debugShowFramesPerSecond = false;
                }
            }
        });
    
    jQuery(document).bind('agsattrack.showatmosphere',
        function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (state) {
                    _scene.skyAtmosphere = _skyAtmosphere;    
                } else {
                    _scene.skyAtmosphere = undefined;    
                }
            }
        });
    
    jQuery(document).bind('agsattrack.showskybox',
        function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (state) {
                    _scene.skyBox = _skybox;
                } else {
                    _scene.skyBox = undefined;                           
                }
            }
        });
        
    jQuery(document).bind('agsattrack.showlighting',
        function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                _scene.globe.enableLighting = state;
            }
        });        
                                        
    jQuery(document).bind('agsattrack.locationAvailable',
        function(e, observer) {
            if (AGSETTINGS.getHaveWebGL()) {
                plotObservers();
            }
        }); 
    
    jQuery(document).bind('agsattrack.show3dmodels',
        function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                _show3dmodels = state;
                _viewer.entities.removeAll();
                plotSatellites();
            }
        }); 
            
    jQuery(document).bind('agsattrack.updatesatdata',
        function(event, selected) {
            if (_render) {
                if (AGSETTINGS.getHaveWebGL()) { 
                    plotSatellites();
                }
            }
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
    
    function plotObservers() {
        var observers = null;
        var observer = null;     
        


        var pinBuilder = new Cesium.PinBuilder();                



        Cesium.when(pinBuilder.fromMakiIconId('building', Cesium.Color.RED, 48), function(canvas) {
            var observers = AGSatTrack.getObservers();

            _viewer.entities.add({
                position : Cesium.Cartesian3.fromDegrees(observers[0].getLon(), observers[0].getLat()),
                label : {
                    text : '   ' + observers[0].getName(),
                    font : '12px Helvetica',
                    fillColor : Cesium.Color.WHITE,
                    outlineColor : Cesium.Color.BLACK,
                    outlineWidth : 2,
                    style : Cesium.LabelStyle.FILL_AND_OUTLINE
                }
            });
            
                
            _viewer.entities.add({
                name : observers[0].getName(),
                position : Cesium.Cartesian3.fromDegrees(observers[0].getLon(), observers[0].getLat()),
                billboard : {
                    image : canvas.toDataURL(),
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM
                }
            });                    
            return true;
        });
     
    }   
    
    function setupSatelliteImages() {
        var satUnselected = 'satellite' + _settings.unselectedIcon + _settings.unselectedIconSize;
        var satSelected = 'satellite' + _settings.selectedIcon + _settings.selectedIconSize;

        var satUnselectedGrey = 'satellitegrey' + _settings.unselectedIcon + _settings.unselectedIconSize;
        var satSelectedGrey = 'satellitegrey' + _settings.selectedIcon + _settings.selectedIconSize;
                    
        _satImages = [
            AGIMAGES.getImage(satUnselected),
            AGIMAGES.getImage(satSelected),
            AGIMAGES.getImage('iss16'),
            AGIMAGES.getImage('iss32'),
            AGIMAGES.getImage(satUnselectedGrey),
            AGIMAGES.getImage(satSelectedGrey)
        ];        
    } 
        
    function plotSatellites() {
        if (_render) {
            var model;
            var satellites = AGSatTrack.getSatellites();
            for (i = 0; i < satellites.length; i++) {
                if (satellites[i].isDisplaying()) {

                    var cpos = new Cesium.Cartesian3(satellites[i].get('x'), satellites[i].get('y'), satellites[i].get('z'));              
                    cpos = Cesium.Cartesian3.multiplyByScalar(cpos, 1000, cpos);                 

                    var noradId = satellites[i].getCatalogNumber();
                    var entity = _viewer.entities.getById(noradId);
                     //_show3dmodels
                    if (typeof entity === 'undefined') {
                            
                        var newEntity = {
                            id: noradId,
                            name : noradId,
                            position : cpos,
                            billboard : {
                                image : _satImages[0]
                            }
                        };
                        if (_scene.mode === Cesium.SceneMode.SCENE3D && _show3dmodels) {
                            
                            if (noradId == '25544') {
                                model = '/models/iss.glb'    
                            } else {
                                model = '/models/sat.glb'    
                            }
                            var newEntity = {
                                id: noradId,
                                name : noradId,
                                position : cpos,
                                model : {
                                    uri : model,
                                    minimumPixelSize : 64,
                                    scale: 1
                                }
                            };
                        }
                         _viewer.entities.add(newEntity);
                    } else {
                        entity.position = cpos;    
                    }
                }
            }
        }
    }
    
    function plotOrbits() {
        var satellites = AGSatTrack.getSatellites();
        for (i = 0; i < satellites.length; i++) {
            if (satellites[i].isDisplaying()) {
            }
        }        
    }
    
    function init3DView() {
        setupSatelliteImages();
        
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
            //sceneModePicker: false,
            geocoder: false,
            animation: false,
           // baseLayerPicker : false,
            creditContainer : 'credits',
            
            skyBox : _skybox,                
            skyAtmosphere : _skyAtmosphere,
                         
            mapProjection : new Cesium.WebMercatorProjection()
        });
        _scene = _viewer.scene;

        _viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            url : '//assets.agi.com/stk-terrain/world',
            requestVertexNormals: true,
            requestWaterMask: true
        });;
        _scene.globe.enableLighting = true; 
        _scene.moon = new Cesium.Moon();

        
        _scene.morphStart.addEventListener(function (){
            _render = false;
        });
        _scene.morphComplete.addEventListener(function (){
            _viewer.entities.removeAll()
            _render = true;
            plotSatellites();
        }); 
        
        plotObservers();
        //_viewer.extend(Cesium.viewerCesiumInspectorMixin);                         
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
        },
        
        postInit : function() {
            if (!AGSETTINGS.getHaveWebGL()) {
                initNo3DView();
            }            
        },
        
        setSingleSat : function(satellite) {
            _singleSat = satellite           
        },
        
        setPassToShow : function(passToShow) {
        }
                
    };
};