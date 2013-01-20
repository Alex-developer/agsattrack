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
 
/* Options for JSHint http://www.jshint.com/ 
* NOTE: JSHint does not like
* var x = (0.5 + (az * _xstep)) | 0;
* It produces an Unexpected use of '|'. Error
* The | 0 is a much faster way to get an int from a float rather than use Math.floor
* 
* Last Checked: 19/01/2013
*
*/
/*jshint bitwise: true*/
/*global AGSatTrack, AGIMAGES, AGVIEWS, AGSETTINGS, AGUTIL, Kinetic, requestAnimFrame */
  
var AGPOLARVIEW = function(element) {
	'use strict';
    
	var _render = false;
    var _stage;
	var _mousePos = {
		x : 0,
		y : 0,
		el : 0,
		az : 0,
		show : false
	};
	var _width;
	var _height;
	var _degperpixel;
	var _margin = 40;
	var _stepx;
	var _stepy;
	var _cx;
	var _cy;
	var _radius;
	var _twoPi = 2 * Math.PI;
	var _halfMargin;
	var _de2ra = 0.0174532925;
    var _showPlanets = false;
    var _images = [];
    var _element;
    var _backgroundLayer;
    var _objectLayer;
    var _satLayer;
    var _planetLayer;
    var _orbitLayer;
    var _infoLayer;
    var _mousePosTextAz;
    var _mousePosTextEl;
    var _naflag = false;
    var _mode;
    var _singleSat = null;
    var _passToShow = null;
    var _colours = AGSETTINGS.getViewSettings('polar').colours;
        
    /**
    * Set the parent element for this view.    
    */
    if (typeof element === 'undefined') {
        _element = 'polar';    
    } else {
        _element = element;
    }
    
    /**
    * Resize the view. if no width or heig is specified then it is derived
    * from the parent (_element) element.
    * 
    * @param width Width of view in Pixels
    * @param height Height of view in Pixels
    */
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#'+_element);
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            _stage.setSize(width, height);
            drawBackground();
            drawPolarView();
        }          
    }

    jQuery(document).bind('agsattrack.polaroptionsupdated', function(event, options) {
        _colours = options.colours;
        drawPolarView();
    });
    	
    /**
     * Listen for an event telling us a new set of data is available
     */
    jQuery(document).bind('agsattrack.updatesatdata', function(event) {
        if (_render && _mode !== AGVIEWS.modes.SINGLE) {
            drawPolarView();
        }
    });
	
		
	/**
	 * Listen for an event telling us a new set of elements were loaded
	 */
	jQuery(document).bind('agsattrack.tlesloaded', function(event, group) {
        if (_render) {
            _satLayer.clear();
        }
	});

    jQuery(document).bind('agsattrack.newfollowing', function(event, group) {
        if (_render && _mode !== AGVIEWS.modes.SINGLE) {
            drawBackground();
            drawPolarView();
        }
    });
    
    jQuery(document).bind('agsattrack.showplanets',
            function(e, state) {
                if (AGSETTINGS.getHaveCanvas() && _render) {
                    _showPlanets = state;
                    drawPlanets();
                }
            });

    /**
    * Convert the current postiion of the mouse to Azimuth and
    * Elevation.
    */
	function convertMousePos() {
		var rel = _radius - Math.sqrt((_mousePos.x - _cx) * (_mousePos.x - _cx) + (_mousePos.y - _cy) * (_mousePos.y - _cy));
		_mousePos.el = 90.0 * rel / _radius;
		if (_mousePos.x >= _cx) {
			/* 1. and 2. quadrant */
			_mousePos.az = Math.atan2(_mousePos.x - _cx, _cy - _mousePos.y) / _de2ra;
		} else {
			/* 3 and 4. quadrant */
			_mousePos.az = 360 + Math.atan2(_mousePos.x - _cx, _cy - _mousePos.y) / _de2ra;
		}

		if (_mousePos.az < 0 || _mousePos.el < 0) {
			_mousePos.show = false;
		} else {
			_mousePos.show = true;
		}
	}
    
    /**
    * Convert an Azimuth and Elevation to screen coordinates
    * 
    * @param az The Azimuth
    * @param el The Elevation
    * 
    * @returns {Object}
    */
	function convertAzEltoXY(az, el) {

		if (el < 0) {
			return {
				x : 0,
				y : 0
			};
		}

		/* convert angles to radians */
		az = _de2ra * az;
		el = _de2ra * el;

		/* radius @ el */
		var rel = _radius - (2 * _radius * el) / Math.PI;

		var x = (_cx + rel * Math.sin(az));
		var y = (_cy - rel * Math.cos(az));

		return {
			x : x,
			y : y
		};
	}

    /**
    * Setup the basic dimensions we need to be able
    * to draw the Polar view.
    */
	function setDimensions() {

		_height = _stage.getHeight();
		_width = _stage.getWidth();

		var size;

		if (_height > _width) {
			size = _width;
		} else {
			size = _height;
		}
		size = size - (_margin * 2);
		_cx = (0.5 + (_width / 2)) | 0;
		_cy = (0.5 + (_height / 2)) | 0;
		_radius = (0.5 + (size / 2)) | 0;
		_halfMargin = (0.5 + (_margin / 2)) | 0;
	}

	function drawBackground() {
		var _circle;
		var _line;
		var _text;
        var radius;
        
		setDimensions();
		_backgroundLayer.removeChildren();

        _backgroundLayer.add(new Kinetic.Rect({
            x: 0,
            y: 0,
            width: _width,
            height: _height,
            fill: '#' + _colours.background
        }));
      
        _backgroundLayer.add(new Kinetic.Circle({
            x : _cx,
            y : _cy,
            radius : _radius + _halfMargin,
            stroke : '#' + _colours.border,
            strokeWidth : 10,
            fill: '#' + _colours.background 
        })); 
        
		_circle = new Kinetic.Circle({
			x : _cx,
			y : _cy,
			radius : _radius,
            fill: {
                start: {
                    x: 0,
                    y: -10
                },
                end: {
                  x: 0,
                  y: 100
                },
                colorStops: [0, '#' + _colours.gradientstart, 1, '#' + _colours.gradientend]
            }            
		});
                    
		_circle.on('mouseout', function() {
			_mousePos.show = false;
		});
		_backgroundLayer.add(_circle);

        for (var i=0; i<90; i+=15) {
            radius = (0.5 + (_radius * (i/90))) | 0;
            _backgroundLayer.add(new Kinetic.Circle({
                x : _cx,
                y : _cy,
                radius : radius,
                stroke : '#' + _colours.grid,
                strokeWidth : 1
            }));    
        }
        
        /**
        * we only use single mode on the passes view so for now just reduce
        * the font size for this case.
        */
        var elFontSize = 10;
        if (_mode === AGVIEWS.modes.SINGLE) {
            elFontSize = 8;    
        }
        for (i=15; i<90; i+=15) {
            radius = (0.5 + (_radius * (i/90))) | 0;
            _backgroundLayer.add(new Kinetic.Text({
                x : _cx - radius - 7,
                y : _cy + 5,
                text : (90-i) + 'º',
                fontSize : elFontSize,
                fontFamily : 'Verdana',
                textFill : '#' + _colours.degcolour
            }));
            _backgroundLayer.add(new Kinetic.Text({
                x : _cx + radius - 7,
                y : _cy + 5,
                text : (90-i) + 'º',
                fontSize : elFontSize,
                fontFamily : 'Verdana',
                textFill : '#' + _colours.degcolour
            }));                 
        }
        
        var long=0;
        var len;
        for (i=0; i< 360; i+= 5) {
            
            var rad = i * (Math.PI/180);
            
            if (long) {
                len = 10;    
            } else {
                len = 15;
            }
            long = !long;
            
            var startX = (_cx + (_radius + 15 - len) * Math.cos( rad )) | 0;
            var startY =  (_cy + (_radius + 15 - len)  * Math.sin( rad )) | 0;
            
            var endX =  (_cx + (_radius + 15) * Math.cos( rad )) | 0;  
            var endY =  (_cy + (_radius + 15) * Math.sin( rad )) | 0;
            
            _backgroundLayer.add(new Kinetic.Line({
                points : [ startX, startY, endX, endY ],
                stroke : '#' + _colours.grid,
                strokeWidth : 1
            }));           
        }      

		_backgroundLayer.add(new Kinetic.Line({
            points : [ _cx - _radius - _halfMargin + 5, _cy,
                    _cx + _radius + _halfMargin - 5, _cy ],
            stroke : '#' + _colours.grid,
            strokeWidth : 1
        }));

		_backgroundLayer.add(new Kinetic.Line({
            points : [ _cx, _cy - _radius - _halfMargin + 5, _cx,
                    _cy + _radius + _halfMargin - 5 ],
            stroke : '#' + _colours.grid,
            strokeWidth : 1
        }));

		_backgroundLayer.add(new Kinetic.Text({
            x : _cx + 5,
            y : 30,
            text : 'N',
            fontSize : 15,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));

		_backgroundLayer.add(new Kinetic.Text({
            x : _cx + _radius ,
            y : _radius + _halfMargin,
            text : 'E',
            fontSize : 15,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));

		_backgroundLayer.add(new Kinetic.Text({
            x : _cx - _radius - 10,
            y : _radius + _halfMargin,
            text : 'W',
            fontSize : 15,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));

		_backgroundLayer.add(new Kinetic.Text({
            x : _cx + 8,
            y : _height - _halfMargin - 30,
            text : 'S',
            fontSize : 15,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));

        elFontSize = 10;
        if (_mode === AGVIEWS.modes.SINGLE) {
            elFontSize = 8;    
        }        
		_backgroundLayer.add(new Kinetic.Text({
            x : 10,
            y : 5,
            text : 'Mouse Position',
            fontSize : elFontSize,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));
        
		_backgroundLayer.add(new Kinetic.Text({
            x : 10,
            y : 30,
            text : 'Azimuth:',
            fontSize : elFontSize,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));
        
		_backgroundLayer.add(new Kinetic.Text({
            x : 10,
            y : 50,
            text : 'Elevation:',
            fontSize : elFontSize,
            fontFamily : 'Verdana',
            textFill : '#' + _colours.text
        }));

		_backgroundLayer.draw();
	}
    
    function drawMousePos() {
        if (_mousePos.show) {
            _mousePosTextAz.setText(_mousePos.az.toFixed(0));
            _mousePosTextEl.setText(_mousePos.el.toFixed(0));
            _naflag = false;
            _objectLayer.draw();
        } else {
            if (_naflag === false) {
                _mousePosTextAz.setText('N/A');
                _mousePosTextEl.setText('N/A');
                _naflag = true;
                _objectLayer.draw();
            }
        }        
    }
    

    /**
    * Draw the main polar view. This function plots the satellites, orbits
    * and satellite information.
    */
	function drawPolarView() {
        switch (_mode) {
            case AGVIEWS.modes.DEFAULT:
                _drawDefaultView();  
                break;
                
            case AGVIEWS.modes.SINGLE:
                _drawSingleView();
                break;
                
            case AGVIEWS.modes.PREVIEW:
                _drawPreviewView();
                break;                
        }
    }
    
    function _drawPreviewView() {
        setDimensions();
        drawBackground();
        drawInfoLayer();              
    }    
    
    /**
    * Draw a single satellite. We allow the layers to be cleared each time
    * so that if no satelite is selected the view is cleared.
    */
    function _drawSingleView() {

        setDimensions();
        
        drawPlanets();
        drawInfoLayer();
        
        _orbitLayer.removeChildren();
        _satLayer.removeChildren();
        if (_singleSat !== null) {            
            plotSatellite(_singleSat);
        }
        _orbitLayer.draw();
        _satLayer.draw();               
    }
    
    
    function _drawDefaultView() {
		setDimensions();
        
        drawPlanets();
        drawInfoLayer();
        
        _orbitLayer.removeChildren();
        _satLayer.removeChildren();
		var satellites = AGSatTrack.getSatellites();
		jQuery.each(satellites, function(index, satellite) {        
            plotSatellite(satellite);
		});
        _orbitLayer.draw();
		_satLayer.draw();
	}
    
    function plotSatellite(satellite) {
        var pos;
        
        if (satellite.isDisplaying()) {

            var az = satellite.get('azimuth');
            var el = satellite.get('elevation');


            /**
            * If satellite is selected draw its orbit
            */
            if (satellite.getSelected()) {
                var move = false;
                var prePoints = [];                        
                var points = [];                        
                var postPoints = [];                        
                var max = {az:0, el:0};
                var aostime = null;
                var okToDraw = true;
                var aosPos = {x:0, y:0};
                var passData = null;
                var pass = null;
                var haveAos = false;
                
                if (_passToShow !== null) {
                    var observers = AGSatTrack.getObservers();
                    var observer = observers[0];
                    passData = satellite.getPassforTime(observer, _passToShow);
                    pass = passData.pass;                       
                } else {
                    passData = satellite.getNextPass();
                    if (typeof passData === 'undefined') {
                        okToDraw = false;    
                    } else {
                        pass = passData.pass;
                    }
                }
                
                if (okToDraw) {             
                    points = []; 
                    for ( var i = 0; i < pass.length; i++) {
                        pos = convertAzEltoXY(pass[i].az, pass[i].el);
                        if (pass[i].el >= AGSETTINGS.getAosEl()) {
                            
                            if (points.length ===0) {
                                prePoints.push(pos.x | 0);
                                prePoints.push(pos.y | 0);
                                aosPos.x  = pos.x;
                                aosPos.y = pos.y;                                   
                            }
                            points.push(pos.x | 0);
                            points.push(pos.y | 0);

                            if (aostime === null) {
                                aostime = pass[i].date;
                            }
                            
                            /**
                            * For Debugging  ONLY
                            */
                            /*
                            _orbitLayer.add(new Kinetic.Circle({
                                x : pos.x,
                                y : pos.y,
                                radius : 2,
                                stroke : '#ccc',
                                strokeWidth : 1
                            }));
                            */                             
                            
                            haveAos = true;
                        } else {
                            if (!haveAos) {
                                if (pass[i].el >= 0) {
                                    prePoints.push(pos.x | 0);
                                    prePoints.push(pos.y | 0);                                    
                                }
                            } else {
                                if (pass[i].el >= 0) {
                                    if (postPoints.length === 0 && points.length > 0) {
                                        postPoints.push(points[points.length-2]);
                                        postPoints.push(points[points.length-1]);
                                    }
                                    postPoints.push(pos.x | 0);
                                    postPoints.push(pos.y | 0);                                    
                                }
                            }
                        }
                        if (pass[i].el > max.el) {
                            max = pass[i];
                        }
                        
                        if (haveAos && pass[i].el < 0) {
                            break;
                        }
                    }

                    if (prePoints.length > 0) {
                        _orbitLayer.add(new Kinetic.Line({
                                points: prePoints,
                                stroke: 'red',
                                strokeWidth: 1,
                                lineCap: 'round',
                                lineJoin: 'round'
                            })
                        );
                    }
                                                                    
                    if (points.length > 0) {
                        _orbitLayer.add(new Kinetic.Line({
                                points: points,
                                stroke: 'green',
                                strokeWidth: 2,
                                lineCap: 'round',
                                lineJoin: 'round'
                            })
                        );
                    }
                    
                    if (postPoints.length > 0) {
                        _orbitLayer.add(new Kinetic.Line({
                                points: postPoints,
                                stroke: 'red',
                                strokeWidth: 1,
                                lineCap: 'round',
                                lineJoin: 'round'
                            })
                        );
                    }                        
                                            
                }
                
                /**
                * If satellite is selected but NOT visible then add a text label
                * at the max elevation.
                */
                if (el < AGSETTINGS.getAosEl()) {
                    if (aostime !== null) {
                        pos = convertAzEltoXY(max.az, max.el);
                        _orbitLayer.add(new Kinetic.Text({
                            x : pos.x + 5,
                            y : pos.y + 5,
                            text : satellite.getName(),
                            fontSize : 6,
                            fontFamily : 'Verdana',
                            textFill : '#eee'
                        }));  
                    }                   
                } 
                if (max.az !== 0 && max.el !== 0 && okToDraw) {
                    pos = convertAzEltoXY(max.az, max.el);
                    _orbitLayer.add(new Kinetic.Circle({
                        x : pos.x,
                        y : pos.y,
                        radius : 2,
                        stroke : 'red',
                        strokeWidth : 1,
                        fill: 'red' 
                    })); 
                }                         

                
                if (aosPos.x !== 0 && aosPos.y !== 0) {
                    _orbitLayer.add(new Kinetic.Text({
                        x : aosPos.x,
                        y : aosPos.y,
                        text : 'AoS: ' + AGUTIL.shortdatetime(passData.aosTime),
                        fontSize : 6,
                        fontFamily : 'Verdana',
                        textFill : '#eee'
                    }));                         
                }
                
                if (postPoints.length !== 0) {
                    _orbitLayer.add(new Kinetic.Text({
                        x : postPoints[0],
                        y : postPoints[1],
                        text : 'LoS: ' + AGUTIL.shortdatetime(passData.losTime),
                        fontSize : 6,
                        fontFamily : 'Verdana',
                        textFill : '#eee'
                    }));                          
                }                   
            }

            if (el > AGSETTINGS.getAosEl()) {
                                
                pos = convertAzEltoXY(az, el);
                var _style = 'normal';

                if (satellite.getSelected()) {
                    _style = 'bold';
                }

                _satLayer.add(new Kinetic.Text({
                    x : pos.x - 8,
                    y : pos.y - 20,
                    text : satellite.getName(),
                    fontSize : 10,
                    fontFamily : 'Verdana',
                    fontStyle : _style,
                    textFill : 'white'
                }));

                var sat;
                sat = new Kinetic.Image({
                    x : pos.x - 8,
                    y : pos.y - 8,
                    image : AGIMAGES.getImage('satellite16'),
                    width : 16,
                    height : 16,
                    id : satellite.getCatalogNumber()
                });
                sat.on('mouseup', function(e) {
                    var selected = e.shape.getId();
                    jQuery(document).trigger('agsattrack.satclicked', {
                        catalogNumber : selected
                    });
                });
                _satLayer.add(sat);
            }

        }
    }
    
    function drawInfoLayer() {
        var nextEvent;
        
        _infoLayer.removeChildren();
        var following = AGSatTrack.getFollowing();
        if (following !== null) {
            
            if (following.isGeostationary()) {
                if (following.get('elevation') > 0) {
                    nextEvent = {
                        eventlong : 'Satellite is geostationary',
                        time: 'N/A'    
                    }; 
                } else {
                    nextEvent = {
                        eventlong : 'Geostationary Not Visible',
                        time: 'N/A'    
                    }; 
                }
            } else {
                nextEvent = following.getNextEvent(true);
            }

            var elFontSize = 10;
            if (_mode === AGVIEWS.modes.SINGLE) {
                elFontSize = 6;    
            }
            if (_mode !== AGVIEWS.modes.SINGLE) {             
                 _infoLayer.add(new Kinetic.Text({
                    x : 10,
                    y : _height-50,
                    text : 'Information for ' + following.getName(),
                    fontSize : elFontSize,
                    fontFamily : 'Verdana',
                    textFill : '#ccc'
                 }));
            }
             _infoLayer.add(new Kinetic.Text({
                x : 10,
                y : _height-35,
                text : 'Next Event: ' + nextEvent.eventlong,
                fontSize : elFontSize,
                fontFamily : 'Verdana',
                textFill : '#ccc'
             }));
             
             _infoLayer.add(new Kinetic.Text({
                x : 10,
                y : _height-21,
                text : 'Event Time: ' + nextEvent.time,
                fontSize : elFontSize,
                fontFamily : 'Verdana',
                textFill : '#ccc'
             }));             
                               
        }
        _infoLayer.draw();        
    }
    
    function drawPlanets() {
        var image;
        
        setDimensions();
        _planetLayer.removeChildren();    
        if (_showPlanets) {        
            var _planets = AGSatTrack.getPlanets();
            jQuery.each(_planets, function(index, planet) {
                if (planet.alt > 0) {
                    var pos = convertAzEltoXY(planet.az, planet.alt);            
                    if (planet.name.toLowerCase() === 'moon') {
                        image = AGIMAGES.getImage(planet.name.toLowerCase()+planet.phase,'generic');                        
                    } else {
                        image = AGIMAGES.getImage(planet.name.toLowerCase(),'generic');
                    }

                    _planetLayer.add(new Kinetic.Image({
                        x : pos.x - 8,
                        y : pos.y - 8,
                        image : image,
                        width : 32,
                        height : 32,
                        id : -1
                    }));
                    
                    _planetLayer.add(new Kinetic.Text({
                        x : pos.x,
                        y : pos.y - 20,
                        text : planet.name,
                        fontSize : 10,
                        fontFamily : 'Verdana',
                        textFill : 'white'
                    }));                  
                }
            });
        }
        _planetLayer.draw();        
    }
    
    var _debugCounter=0;
	function animate() {
		if (_render && _mode !== AGVIEWS.modes.PREVIEW) {
            if (AGSETTINGS.getDebugLevel() > 0) {
                _debugCounter++;
                if (_debugCounter > 100) {
                    _debugCounter = 0;
                    console.log('Polar Animate');
                }
            }
			drawMousePos();
            requestAnimFrame(animate);
        }
		
	}

	return {
		startRender : function() {
			_render = true;
            resize();
            animate();
			_satLayer.clear();
		},

		stopRender : function() {
			_render = false;
		},

        destroy : function() {
            _render = false;
            jQuery('#'+_element).html('');    
        },
        resizeView : function(width, height) {
            resize(width, height);     
        },
        
        reDraw : function() {
            drawPolarView();    
        },
             
		init : function(mode) {     
            if (typeof mode === 'undefined') {
                mode = AGVIEWS.modes.DEFAULT;    
            }
            _mode = mode;
            
            _stage = new Kinetic.Stage({
                container : _element,
                width : 1000,
                height : 600
            });

            _backgroundLayer = new Kinetic.Layer();
            _stage.add(_backgroundLayer);

            _objectLayer = new Kinetic.Layer();
            _stage.add(_objectLayer);

            _satLayer = new Kinetic.Layer();
            _stage.add(_satLayer);

            _planetLayer = new Kinetic.Layer();
            _stage.add(_planetLayer);
            
            _orbitLayer = new Kinetic.Layer();
            _stage.add(_orbitLayer);

            _infoLayer = new Kinetic.Layer();
            _stage.add(_infoLayer);
                
            _stage.on('mousemove', function() {
                _mousePos = _stage.getMousePosition();
                convertMousePos();
            });
            
            var elFontSize = 10;
            if (_mode === AGVIEWS.modes.SINGLE) {
                elFontSize = 8;    
            }               
            _mousePosTextAz = new Kinetic.Text({
                x : 80,
                y : 30,
                text : 'N/A',
                fontSize : elFontSize,
                fontFamily : 'Verdana',
                textFill : '#' + _colours.text
            });
            _objectLayer.add(_mousePosTextAz);

            _mousePosTextEl = new Kinetic.Text({
                x : 80,
                y : 50,
                text : 'N/A',
                fontSize : elFontSize,
                fontFamily : 'Verdana',
                textFill : '#' + _colours.text
            });
            _objectLayer.add(_mousePosTextEl);
                
		},
        
        reset : function() {
            _singleSat = null;
            _passToShow = null;
            drawPolarView();
        },
        
        setSingleSat : function(satellite) {
            _singleSat = satellite;
        },
        
        setPassToShow : function(passToShow) {
            _passToShow = passToShow;
        },
        
        setPreviewColours : function(colours) {
            _colours = colours;
            drawPolarView();    
        }
	};
};