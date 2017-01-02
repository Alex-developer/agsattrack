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

    var _render = false;
    var _viewer = null;
    var _scene = null;
    var _providers = null;
    var _skybox = null;
    var _settings = AGSETTINGS.getViewSettings('threed');
    var _currentProvider = 'bing';
    var _displayMode = AG3DVIEWMODES.ICONS;
    var _satellitesBillboardCollection = null;
    var _satImages = null;
    var _satNameLabelsCollection = null;
    var _showSatLabels = true;
    var _settings = AGSETTINGS.getViewSettings('threed');;
    var _skyAtmosphere = null;
    var _showBlackMarble = false;
    var _blackMarble = null;
    var _blackMarbleOpacity = 2;
    var _blackMarbleBrightness = 2;
    var _observerBillboardsCollection = null;
    var _observerLabelCollection = null;
    var _mode = null;

    var _footprintPolygons = [];
    var _orbitPolylines = [];

    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#'+_element);
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            _viewer.resize();

            //scene.camera.frustum.aspectRatio = width / height;
        }
    }

    /**
     * Show the visible locations window
     */
    function showLocationWindow() {
        AGWINDOWMANAGER.showWindow('dx');
    }

    /**
     * Create the observers
     */
    function initObservers() {
        var pinBuilder = new Cesium.PinBuilder();

        if (_observerBillboardsCollection !== null) {
            _scene.primitives.remove(_observerBillboardsCollection);
        }
        _observerBillboardsCollection = new Cesium.BillboardCollection();
        _scene.primitives.add(_observerBillboardsCollection);

        if (_observerLabelCollection !== null) {
            _scene.primitives.remove(_observerLabelCollection);
        }
        _observerLabelCollection = new Cesium.LabelCollection();
        _scene.primitives.add(_observerLabelCollection);


        var observers = AGSatTrack.getObservers();
        for (var i = 0; i < observers.length; i++) {
            var observer = observers[i];
            if (observer.isReady() && observer.getEnabled()) {

                var pos = Cesium.Cartesian3.fromDegrees(observer.getLon(), observer.getLat());

                _observerBillboardsCollection.add({
                    position: pos,
                    image: AGIMAGES.getImage('home')
                });

                _observerLabelCollection.add({
                    position  : pos,
                    text      : '   ' + observer.getName(),
                    font      : '12px Helvetica',
                    fillColor : { red : 1.0, blue : 1.0, green : 1.0, alpha : 1.0 }
                });

            }
        }

        observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);
        if (typeof observer !== 'undefined') {
            if (observer.isReady()) {
                _viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(observer.getLon(), observer.getLat(), 1e7)
                });
            }
        }
    }

    /**
     * Setup the images used for displaying satellite icons
     */
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

    /**
     * Create the initial satellites
     */
    function initSatellites() {
        var satellites;
        var billboard;
        var image;

        switch (_displayMode) {
            case AG3DVIEWMODES.ICONS:
                if (_satellitesBillboardCollection !== null) {
                    _scene.primitives.remove(_satellitesBillboardCollection);
                }
                _satellitesBillboardCollection = new Cesium.BillboardCollection({
                    debugShowBoundingVolume: false
                });

                if (_satNameLabelsCollection !== null) {
                    _scene.primitives.remove(_satNameLabelsCollection);
                }
                _satNameLabelsCollection = new Cesium.LabelCollection();
                
                satellites = AGSatTrack.getSatellites();

                for (i = 0; i < satellites.length; i++) {
                    if (satellites[i].isDisplaying()) {
                        var pos = getCartesian3Pos(satellites[i]);

                        if (satellites[i].getCatalogNumber() === '25544') {
                            image = _satImages[2];
                        } else {
                            image = _satImages[0];
                        }
                        billboard = _satellitesBillboardCollection.add({
                            position: pos,
                            image: image
                        });
                        billboard.satelliteindex = i;

                        var labelVisible = true;
                        if (!_showSatLabels) {
                            labelVisible = false;
                            if (satellites[i].getSelected())  {
                                labelVisible = true;
                            }
                        }

                        var satLabel = _satNameLabelsCollection.add({
                            show : labelVisible,
                            position : Cesium.Cartesian3.multiplyByScalar(pos, 30/1000+1, pos),
                            text : satellites[i].getName(),
                            font : _settings.unselectedLabelSize + 'px sans-serif',
                            fillColor : Cesium.Color.fromCssColorString('#'+_settings.unselectedLabelColour),
                            outlineColor : _settings.unselectedLabelColour,
                            style : Cesium.LabelStyle.FILL,
                            scale : 1.0,
                            verticalOrigin: Cesium.VerticalOrigin.TOP,
                            translucencyByDistance: new Cesium.NearFarScalar(15.5e2, 1.0, 40.0e6, 0.0),
                            id: i
                        });
                        billboard.label = satLabel;
                    }
                }

                _scene.primitives.add(_satellitesBillboardCollection);
                _scene.primitives.add(_satNameLabelsCollection);
                break;

            case AG3DVIEWMODES.MODELS:
                break;
        }
    }

    /**
     * Update the position of all satellites
     */
    function updateSatellites() {
        var billboard = null;
        var label = null;
        var labelVisible = true;

        var satellites = AGSatTrack.getSatellites();

        for ( var i = 0; i < _satellitesBillboardCollection.length; i++)  {
            billboard = _satellitesBillboardCollection.get(i);
        
            var satPos = billboard.satelliteindex;
            var pos = getCartesian3Pos(satellites[satPos]);

            billboard.position = pos;

            var offset = 4;
            var visibility = satellites[satPos].get('visibility');
            if ( visibility === 'Daylight' || visibility === 'Visible') {
                offset = 0;
            }

            if (satellites[satPos].getSelected()) {
                if (satellites[i].getCatalogNumber() === '25544') {
                    billboard.image = _satImages[3];
                } else {
                    billboard.image = _satImages[1 + offset];
                }
            } else {
                if (satellites[i].getCatalogNumber() === '25544') {
                    billboard.image = _satImages[2];
                } else {
                    billboard.image = _satImages[0 + offset];;
                }
            }



            label = billboard.label;
            label.position = Cesium.Cartesian3.multiplyByScalar(pos, 30/1000+1, pos);

            labelVisible = true;
            if (!_showSatLabels) {
                labelVisible = false;
                if (satellites[satPos].getSelected())  {
                    labelVisible = true;
                }
            }
            label.show = labelVisible;
        }

    }

    /**
     * Create satellite footprints
     */
    function initFootprints() {
        for (var i = 0; i < _footprintPolygons.length; i++) {
            _viewer.entities.remove(_footprintPolygons[i]);
        }

        _footprintPolygons = [];

        var selected = AGSatTrack.getTles().getSelected();
        for (var i = 0; i < selected.length; i++) {

            var pos = getCartesian3Pos(selected[i], true);

            _footprintPolygons[i] = _viewer.entities.add({
                position: pos,
                ellipse: {
                    semiMinorAxis: selected[i].get('footprint') * 1000 / 2,
                    semiMajorAxis: selected[i].get('footprint') * 1000 / 2,
                    fill: false,
                    outline: true,
                    outlineColor : new Cesium.CallbackProperty(fooprintColorCallbackFunction(selected[i]), false)
                }
            });
            _footprintPolygons[i].satellite = selected[i];
        }
    }

    /**
     * Calback funtion to get the footprint colour
     *
     * @param satellite
     * @returns {callbackFunction}
     */
    function fooprintColorCallbackFunction(satellite) {
        return function callbackFunction(time, color) {
            color = Cesium.Color.RED;

            if (satellite.get('elevation') >= AGSETTINGS.getAosEl()) {
                color = Cesium.Color.GREEN;
            }
            return color;
        };
    }

    /**
     * Update the satellite foorprints
     */
    function updateFootprints() {
        for (var i = 0; i < _footprintPolygons.length; i++) {
            var pos = getCartesian3Pos(_footprintPolygons[i].satellite, false, true);
            _footprintPolygons[i].position = pos;
        }
    }

    /**
     * Setup the selected satellites orbit
     */
    function initOrbit() {
        var points = [];

        for (var i = 0; i < _orbitPolylines.length; i++) {
            console.log(_viewer.entities.remove(_orbitPolylines[i]));
        }

        var selected = AGSatTrack.getTles().getSelected();

        for (var i=0; i < selected.length; i++) {
            var orbit = selected[i].getOrbitData();

            points = [];

            for (var j=0;j<orbit.points.length; j++) {
                var pos = new Cesium.Cartesian3.fromDegrees(orbit.points[j].lon, orbit.points[j].lat, orbit.points[j].alt*1000);
                points.push(pos);
            }

            _orbitPolylines[i] = _viewer.entities.add({
                polyline : {
                    positions : points,
                    width : 5,
                    material : new Cesium.PolylineOutlineMaterialProperty({
                        color : Cesium.Color.ORANGE,
                        outlineWidth : 2,
                        outlineColor : Cesium.Color.BLACK
                    })
                }
            });
        }
    }

    function updateOrbit() {

    }

    /**
     * Helper funtion to update all satellite related data
     */
    function update() {
        updateSatellites();
        updateFootprints();
    }

    /**
     * Get a Cesium Cartesian 3 point for the satellite
     *
     * @param satellite an AGStTrack satobject
     * @param forceToGround true to force the altitude to 0
     * @param center true to return half the altitude height
     */
    function getCartesian3Pos(satellite, forceToGround, center) {

        if (typeof forceToGround === undefined) {
            forceToGround = false;
        }

        var lon = satellite.get('longitude');
        var lat = satellite.get('latitude');
        var alt = satellite.get('altitude');

        if (lon === undefined) {
            lon = 0;
            lat = 0;
            alt = 0;
        }

        alt = alt * 1000;

        if (forceToGround) {
            alt = 0;
        }

        if (center) {
            alt = alt * 0.5;
        }
        var catrtesian3Pos = new Cesium.Cartesian3.fromDegrees(lon, lat, alt);

        return catrtesian3Pos;
    }

    /**
     * Set the view mode
     *
     * @param view
     */
    function setView(view) {
        if (_scene.mode !== Cesium.SceneMode.MORPHING) {
            switch (view) {
                case 'twod':
                    _scene.morphTo2D();
                    jQuery('#3d-projection').setTitle('Views', '<br /> 2d view' );
                    setButtonsState(false);
                    break;
                case 'twopointfived':
                    _scene.morphToColumbusView();
                    jQuery('#3d-projection').setTitle('Views', '<br /> 2.5d view' );
                    setButtonsState(false);
                    break;
                case 'threed':
                    _scene.morphTo3D();
                    jQuery('#3d-projection').setTitle('Views', '<br /> 3d view' );
                    setButtonsState(true);
                    break;
            }
        }
    }

    /**
     * Set the terrain provider
     *
     * @param useTerrainProvider
     */
    function setTerrainProvider(useTerrainProvider) {
        var terrainProvider;

        if (useTerrainProvider) {
            terrainProvider = new Cesium.CesiumTerrainProvider({
                url : '//assets.agi.com/stk-terrain/world',
                requestVertexNormals: true,
                requestWaterMask : true
            });
        } else {
            terrainProvider = new Cesium.EllipsoidTerrainProvider({
                ellipsoid : Cesium.Ellipsoid.WGS84
            });
        }
        _scene.terrainProvider = terrainProvider;
        jQuery('#3d-show-terrain').setButtonState(useTerrainProvider);
    }

    /**
     * Set the ribbon button states
     * @param state
     */
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

    /**
     * Setup the available imagery providers
     */
    function setupProviders() {
        var bingAPIKey = AGUTIL.getBingAPIKey();

        _providers = {
            'bing' : {
                provider : new Cesium.BingMapsImageryProvider({
                    url : 'http://dev.virtualearth.net',
                    key : bingAPIKey,
                    mapStyle : Cesium.BingMapsStyle.AERIAL
                }),
                toolbarTitle : 'Bing Maps'
            },
            'staticimage' : {
                provider : new Cesium.SingleTileImageryProvider({
                    url : 'images/maps/' + _settings.staticimage
                }),
                toolbarTitle : 'Static Image'
            },
            'arcgis' : {
                provider : new Cesium.ArcGisMapServerImageryProvider(
                    {url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'}),
                toolbarTitle : 'Arc Gis'
            },
            'naturalearth' : {
                provider : new Cesium.createTileMapServiceImageryProvider (
                    {url: '//cesiumjs.org/tilesets/imagery/naturalearthii'
                    }),
                toolbarTitle : 'Natural Earth'
            },
            'blackmarble' : {
                provider : new Cesium.createTileMapServiceImageryProvider (
                    {url: '//cesiumjs.org/tilesets/imagery/blackmarble'
                    }),
                toolbarTitle : 'Black Marble'
            }
        };
    }

    /**
     * Set the required imagery provider
     *
     * @param provider
     */
    function setProvider(provider) {
        if (typeof _providers[provider] !== 'undefined') {
            _viewer.imageryLayers.removeAll();
            _viewer.imageryLayers.addImageryProvider(_providers[provider].provider);
            jQuery('#3d-provider').setTitle('Provider', '<br />' + _providers[provider].toolbarTitle );
            _currentProvider = provider;
        }

        if (_showBlackMarble) {
            _blackMarble = _viewer.imageryLayers.addImageryProvider(new Cesium.createTileMapServiceImageryProvider({
                url : '//cesiumjs.org/tilesets/imagery/blackmarble',
                maximumLevel : 8,
                flipXY : true,
                credit : 'Black Marble imagery courtesy NASA Earth Observatory'
            }));
            _blackMarble.alpha = _blackMarbleOpacity / 10; // 0.0 is transparent.  1.0 is opaque.
            _blackMarble.brightness = _blackMarbleBrightness;
        }
    }

    /**
     * Set the Opacity of the black marble imagery layer
     */
    function setBlackMarbleOpacity() {
        if (_blackMarble !== null) {
            _blackMarble.alpha = _blackMarbleOpacity / 10;
        }
    }

    /**
     * Set the Brightness of the black marble imagery layer
     */
    function setBlackMarbleBrightness() {
        if (_blackMarble !== null) {
            _blackMarble.brightness = _blackMarbleBrightness;
        }
    }

    /**
     * Initialise the 3d view
     */
    function init() {

        setupProviders();

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

        _viewer = new Cesium.Viewer('3d', {
            timeline: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            homeButton: false,
            sceneModePicker: false,
            geocoder: false,
            clock: AGSatTrack.getClock(),
            animation: false,
            baseLayerPicker : false,
            shadows: true,
            skyBox : _skybox,
            imageryProvider: _providers[_currentProvider].provider,
            mapProjection : new Cesium.WebMercatorProjection(),
            selectionIndicator: true
        });

        _scene= _viewer.scene;
        _scene.globe.enableLighting = true;
        _skyAtmosphere = _scene.skyAtmosphere;

        setTerrainProvider(_settings.useTerrainProvider);

        jQuery('.cesium-credit-image').remove();

        setupSatelliteImages();
        initSatellites();
        initFootprints();

        initObservers();

        bindEventHandlers();
    }

    /**
     * Bind all event handlers
     */
    function bindEventHandlers() {
        jQuery(document).bind('agsattrack.updatesatdata', function (event, selected) {
            if (_render) {
                if (AGSETTINGS.getHaveWebGL()) {
                    update();
                }
            }
        });

        jQuery(document).bind('agsattrack.satclicked', function() {
            if (_render && _mode !== AGVIEWS.modes.SINGLE) {
                if (AGSETTINGS.getHaveWebGL()) {
                    initFootprints();
                    initOrbit();
                }
            }
        });

        jQuery(document).bind('agsattrack.showsatlabels', function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                _showSatLabels = state;
                update();
            }
        });

        jQuery(document).bind('agsattrack.showskybox', function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (state) {
                    _scene.skyBox = _skybox;
                } else {
                    _scene.skyBox = undefined;
                }
            }
        });

        jQuery(document).bind('agsattrack.showfps', function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (state) {
                    _scene.debugShowFramesPerSecond = true;
                } else {
                    _scene.debugShowFramesPerSecond = false;
                }
            }
        });

        jQuery(document).bind('agsattrack.showatmosphere', function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (state) {
                    _scene.skyAtmosphere = _skyAtmosphere;
                } else {
                    _scene.skyAtmosphere = undefined;
                }
            }
        });

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

        jQuery(document).bind('agsattrack.changetile', function(event, provider) {
            if (AGSETTINGS.getHaveWebGL()) {
                if (_scene.mode !== Cesium.SceneMode.MORPHING) {
                    setProvider(provider);
                }
            }
        });

        jQuery(document).bind('agsattrack.blackmarbleopacity',  function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                _blackMarbleOpacity = parseInt(state.value,10);
                setBlackMarbleOpacity();
            }
        });

        jQuery(document).bind('agsattrack.blackmarblebrightness', function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                _blackMarbleBrightness = parseInt(state.value,10);
                setBlackMarbleBrightness();
            }
        });

        jQuery(document).bind('agsattrack.showblackmarble', function(e, state) {
            if (AGSETTINGS.getHaveWebGL()) {
                _showBlackMarble = state;
                setProvider(_currentProvider);
            }
        });

        jQuery(document).bind('agsattrack.show3dlocationinfo', function(e) {
            if (_render) {
                showLocationWindow();
            }
        });

        jQuery(document).bind('agsattrack.resetview', function(e, observer) {
            if (_render) {
                if (AGSETTINGS.getHaveWebGL()) {
                    initSatellites();
                    initObservers();
                    setTerrainProvider(_settings.useTerrainProvider);
                }
            }
        });

        jQuery(document).bind('agsattrack.settingssaved', function(e, observer) {
            if (AGSETTINGS.getHaveWebGL()) {
                _settings = AGSETTINGS.getViewSettings('threed');
                _providers.staticimage.provider =  new Cesium.SingleTileImageryProvider({
                    url : 'images/maps/' + _settings.staticimage
                });
                if (_currentProvider === 'staticimage') {
                    setProvider(_currentProvider);
                }
                setupSatelliteImages();
                initSatellites();
                initObservers();
            }
        });
    }

    function initNo3DView() {

    }

    return {
        startRender : function() {
            _render = true;
        },

        stopRender : function() {
            _render = false;
        },

        destroy : function() {
        },

        resizeView : function(width, height) {
            if (AGSETTINGS.getHaveWebGL()) {
                resize(width, height);
            }
        },

        reDraw : function() {
        },

        init : function(mode) {
            _mode = mode;
            init();
        },

        reset : function() {
        },

        postInit : function() {
        },

        setSingleSat : function(satellite) {
        },

        setPassToShow : function(passToShow) {
        }

    };
};

var AG3DVIEWMODES = {
    ICONS: 1,
    MODELS: 2
};