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
* NOTE: JSHint does not like
* var x = (0.5 + (az * _xstep)) | 0;
* It produces an Unexpected use of '|'. Error
* The | 0 is a much faster way to get an int from a float rather than use Math.floor
* 
* Last Checked: 19/01/2013
*
*/
/*jshint bitwise: true*/
/*global AGVIEWS,AGIMAGES,AGSatTrack,AGUTIL,AGSETTINGS,Kinetic,requestAnimFrame */

var AGSKYVIEW = function(element) {
	'use strict';

	var _render = false;
	var _mousePos = {
		x : 0,
		y : 0,
		show : false
	};
	var _width;
	var _height;
	var _xstep;
	var _ystep;
	var _stage = null;
	var _backgroundLayer = null;
	var _mousePosLayer = null;
    var _orbitLayer = null;
    var _planetLayer = null;
	var _cityLayer = null;
	var _satLayer = null;
	var _infoGroup = null;
	var _mousePosAz = null;
	var _mousePosEl = null;
	var _moonPhase = null;
	var _moon = null;
	var _moonText = null;
    var _showPlanets = false;
    var _element;
    var _showCity = true;
    var _mode;
    var _singleSat = null;
    var _passToShow = null;
        
    if (typeof element === 'undefined') {
        _element = 'sky';    
    } else {
        _element = element;
    }
        
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#' + _element);
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            _stage.setSize(width, height);
            drawBackground();
        }          
    }

	/**
	 * Listen for an event telling us a new set of elements were loaded
	 */
	jQuery(document).bind('agsattrack.updatesatdata', function(event) {
		if (_render) {
			drawSkyView();
		}
	});
	
    jQuery(document).bind('agsattrack.showplanets',
            function(e, state) {
                if (AGSETTINGS.getHaveCanvas() && _render) {
                    _showPlanets = state;
                    drawPlanets();
                }
            });
            
    jQuery(document).bind('agsattrack.showcity',
            function(e, state) {
                if (AGSETTINGS.getHaveCanvas() && _render) {
                    _showCity = state;
                    drawBackground();
                    drawSkyView();
                }
            });            
            
                
	function getDimensions() {
		_width = _stage.getWidth();
		_height = _stage.getHeight();

		_xstep = _width / 360;
		_ystep = _height / 90;

	}

	function convertAzEltoScreen(az, el) {
		var x = (0.5 + (az * _xstep)) | 0;
		var y = _height - ((0.5 + (el * _ystep)) | 0);

		return {
			x : x,
			y : y
		};
	}

	function drawBackground() {
		var _stroke;
		var _start;
		
		getDimensions();

        _backgroundLayer.removeChildren();
		_cityLayer.removeChildren();
        _backgroundLayer.add(new Kinetic.Rect({
            x: 0,
            y: 0,
            width: _width,
            height: _height,
            fill: '#001224'
        }));

		_backgroundLayer.add(new Kinetic.Text({
			x : 0,
			y : 2,
			text : 'N',
			fontSize : 10,
			fontFamily : 'Verdana',
			textFill : 'white'
		}));
		
		_backgroundLayer.add(new Kinetic.Text({
			x : ((0.5 + (90 * _xstep)) | 0) - 5,
			y : 2,
			text : 'E',
			fontSize : 10,
			fontFamily : 'Verdana',
			textFill : 'white'
		}));
		
		_backgroundLayer.add(new Kinetic.Text({
			x : ((0.5 + (180 * _xstep)) | 0) - 5,
			y : 2,
			text : 'S',
			fontSize : 10,
			fontFamily : 'Verdana',
			textFill : 'white'
		}));
		
		_backgroundLayer.add(new Kinetic.Text({
			x : ((0.5 + (270 * _xstep)) | 0) - 5,
			y : 2,
			text : 'W',
			fontSize : 10,
			fontFamily : 'Verdana',
			textFill : 'white'
		}));
		
		for ( var i = 0; i <= 36; i++) {
			var xPos = (0.5 + (i * 10 * _xstep)) | 0;

			if (i === 0 || i === 9 || i === 18 || i === 27) {
				_stroke = '#ccc';
				_start = 20;
			} else {
				_stroke = '#333';
				_start = 0;
			}
			
			_backgroundLayer.add(new Kinetic.Line({
				points : [ xPos, _start, xPos, _height ],
				stroke : _stroke,
				strokeWidth : 1,
				opacity: 0.5
			}));

		}

		for (i = 15; i <= 90; i+=15) {
			var yPos = (0.5 + (i * _ystep)) | 0;
			_backgroundLayer.add(new Kinetic.Line({
				points : [ 0, yPos, _width, yPos ],
				stroke : '#333',
				strokeWidth : 1,
				opacity: 0.5				
			}));
            
            _backgroundLayer.add(new Kinetic.Text({
                x : 5,
                y : yPos,
                text : (90-i) + 'º',
                fontSize : 10,
                fontFamily : 'Verdana',
                textFill : '#999'
            }));  
                        
		}

        if (_showCity) {
            var cityImage = new Kinetic.Image({
              x: 0,
              y: _height - 109,
              image: AGIMAGES.getImage('city'),
              width: _width,
              height: 109,
              opacity: 0.90,
              draggable: true
            });
            cityImage.on('dragmove', function(e) {
                this.setX(0); 
                if (_stage.getHeight() - this.getY() < 20) {
                    this.setY(_stage.getHeight() - 20);
                }
                if (this.getY() < _stage.getHeight() - 109) {
                    this.setY(_stage.getHeight() - 109);
                }                
            });            
            _cityLayer.add(cityImage);
        }

		_backgroundLayer.draw();
        _cityLayer.draw();
	}

	function drawMousePos() {

		_mousePosLayer.clear();

		var mouseAz = (_mousePos.x / _xstep).toFixed(0);
		var mouseEl = (90 - (_mousePos.y / _ystep)).toFixed(0);

		_mousePosAz.setText(mouseAz);
		_mousePosEl.setText(mouseEl);

		_mousePosLayer.draw();
	}

	function drawPlanets() {
        var image;
        
        _planetLayer.removeChildren();
        if (_showPlanets) { 
            var _planets = AGSatTrack.getPlanets();
            
            jQuery.each(_planets, function(index, planet) {
                if (planet.alt > 0) {
                    var pos = convertAzEltoScreen(planet.az, planet.alt);            
                    
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

	function drawSatellites() {
        _satLayer.removeChildren();
		var satellites = AGSatTrack.getSatellites();
		jQuery.each(satellites, function(index, satellite) {
            drawSatellite(satellite);
		});
		_satLayer.draw();
	}

    function drawSatellite(satellite) {
        if (satellite.isDisplaying()) {

            var az = satellite.get('azimuth');
            var el = satellite.get('elevation');

            if (el > AGSETTINGS.getAosEl()) {

                var pos = convertAzEltoScreen(az, el);
                var _style = 'normal';

                if (satellite.getSelected()) {
                    _style = 'bold';
                }

                var satLabel = satellite.getName();


                _satLayer.add(new Kinetic.Text({
                    x : pos.x - 8,
                    y : pos.y - 20,
                    text : satLabel,
                    fontSize : 10,
                    fontFamily : 'Verdana',
                    fontStyle : _style,
                    textFill : 'white'
                }));
   
                var newSat = new Kinetic.Image({
                    x : pos.x - 8,
                    y : pos.y - 8,
                    image : AGIMAGES.getImage('satellite16'),
                    width : 16,
                    height : 16,
                    id : satellite.getCatalogNumber()
                });
                
                newSat.on('mouseup', function(e) {
                    var selected = e.shape.getId();
                    jQuery(document).trigger('agsattrack.satclicked', {
                        catalogNumber : selected
                    });
                });
                _satLayer.add(newSat);
            }
        }        
    }
    
    function drawOrbits() {
        getDimensions();
        _orbitLayer.removeChildren();
        var satellites = AGSatTrack.getSatellites();

        jQuery.each(satellites, function(index, satellite) {
            drawPass(satellite);
        });
        _orbitLayer.draw();        
    }
    
    function drawPass(satellite) {
        var pos;
        var orbit;
        var points = [];
        if (satellite.isDisplaying() && satellite.getSelected()) {
            var passData;
            var pass;
            var haveAos = false;
            var prePoints = [];                                           
            var postPoints = [];  
            var max = {az:0, el:0};
            var aostime = null;                

            if (_passToShow !== null) {
                var observers = AGSatTrack.getObservers();
                var observer = observers[0];
                passData = satellite.getPassforTime(observer, _passToShow);
                pass = passData.pass;                       
            } else {
                passData = satellite.getNextPass();
                pass = passData.pass;                    
            }
                            
            for ( var i = 0; i < pass.length; i++) {
                pos = convertAzEltoScreen(pass[i].az, pass[i].el);
                if (pass[i].el >= AGSETTINGS.getAosEl()) {
                    
                    if (points.length ===0) {
                        prePoints.push(pos.x | 0);
                        prePoints.push(pos.y | 0);                                    
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

            /**
            * Plot any points below the AoS setting
            */
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
            
            /**
            * Plot the orbits above the AoS Setting. This will also detect and wrapping
            * around 180 degrees.                                             
            */
            if (points.length > 0) {
                var lastX = points[0];
                var points1 = [];
                var halfWidth = _stage.getWidth() / 2;
                for (i=2; i < points.length; i+=2) {
                    if (Math.abs(lastX - points[i]) > halfWidth) {
                        points1 = points.slice(i,points.length);
                        points = points.slice(0,i);
                        break;      
                    }
                    lastX = points[i];
                }
                if (points1.length !== 0) {
                    _orbitLayer.add(new Kinetic.Line({
                            points: points1,
                            stroke: 'green',
                            strokeWidth: 2,
                            lineCap: 'round',
                            lineJoin: 'round'
                        })
                    );                        
                }
                _orbitLayer.add(new Kinetic.Line({
                        points: points,
                        stroke: 'green',
                        strokeWidth: 2,
                        lineCap: 'round',
                        lineJoin: 'round'
                    })
                );
            }
            
            /**
            * Plot any points after Los.
            */
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
            
            var el = satellite.get('elevation');
            if (el < AGSETTINGS.getAosEl() && aostime !== null) {
                pos = convertAzEltoScreen(max.az, max.el);
                var label = '(AOS: '+AGUTIL.shortdatetime(aostime, true)+')';
                _orbitLayer.add(new Kinetic.Text({
                    x : pos.x,
                    y : pos.y,
                    text : satellite.getName(),
                    fontSize : 6,
                    fontFamily : 'Verdana',
                    textFill : '#eee'
                }));
                _orbitLayer.add(new Kinetic.Text({
                    x : pos.x,
                    y : pos.y + 10,
                    text : label,
                    fontSize : 6,
                    fontFamily : 'Verdana',
                    textFill : '#eee'
                }));                        
            }                
        }        
    }
    
	function drawSkyView() {
		getDimensions();

		drawPlanets();
        switch (_mode) {
            case AGVIEWS.modes.DEFAULT:
                _drawDefaultView();  
                break;
                
            case AGVIEWS.modes.SINGLE:
                _drawSingleView();
                break;
        }
	}

    function _drawDefaultView() {
        drawSatellites();
        drawOrbits();        
    }

    function _drawSingleView() {
        _satLayer.removeChildren();
        _orbitLayer.removeChildren();
        if (_singleSat !== null) {
            drawSatellite(_singleSat);
            drawPass(_singleSat);
        }
        _satLayer.draw();
        _orbitLayer.draw();
    }
        
    var _debugCounter=0;    
    function animate() {
        if (_render) {
            if (AGSETTINGS.getDebugLevel() > 0) {            
                _debugCounter++;
                if (_debugCounter > 100) {
                    _debugCounter = 0;
                    console.log('Sky Animate');
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
            drawSkyView();    
        },
                           
		init : function(mode) {
            if (typeof mode === 'undefined') {
                mode = AGVIEWS.modes.DEFAULT;    
            }
            _mode = mode;
                    
			_stage = new Kinetic.Stage({
				container : _element,
				width : jQuery('#viewtabs').tabs('getTab', 0).width(),
				height : jQuery('#viewtabs').tabs('getTab', 0).height()
			});
                        
			_backgroundLayer = new Kinetic.Layer();
			_stage.add(_backgroundLayer);

			_mousePosLayer = new Kinetic.Layer();
			_stage.add(_mousePosLayer);

			_planetLayer = new Kinetic.Layer();
			_stage.add(_planetLayer);

			_satLayer = new Kinetic.Layer();
			_stage.add(_satLayer);

            _orbitLayer = new Kinetic.Layer();
            _stage.add(_orbitLayer);
             
            _cityLayer = new Kinetic.Layer();
            _stage.add(_cityLayer);
                                                
			_infoGroup = new Kinetic.Group({
                draggable: true
            });
			
			_infoGroup.add(new Kinetic.Rect({
                x: 20,
                y: 5,
                width: 120,
                height: 60,
                fill: 'white',
                stroke: '#ddd',
                strokeWidth: 4,
                opacity: 0.2
            }));
			
			_infoGroup.add(new Kinetic.Text({
				x : 30,
				y : 10,
				text : 'Mouse Position',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white'
			}));

			_infoGroup.add(new Kinetic.Text({
				x : 25,
				y : 30,
				text : 'Azimuth',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white'
			}));

			_infoGroup.add(new Kinetic.Text({
				x : 25,
				y : 45,
				text : 'Elevation',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white'
			}));

			_mousePosAz = new Kinetic.Text({
				x : 105,
				y : 30,
				text : 'N/A',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white',
				fontStyle: 'bold'
			});
			_infoGroup.add(_mousePosAz);

			_mousePosEl = new Kinetic.Text({
				x : 105,
				y : 45,
				text : 'N/A',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white',
				fontStyle: 'bold'
			});
			_infoGroup.add(_mousePosEl);
			_mousePosLayer.add(_infoGroup);
			
			_stage.on('mousemove', function() {
				_mousePos = _stage.getMousePosition();
				_mousePos.show = true;
			});

			drawBackground();

			jQuery(window).trigger('resize');
		},
        
        reset: function() {
            _singleSat = null;
            _passToShow = null;
            drawSkyView();    
        },
        
        setSingleSat : function(satellite) {
            _singleSat = satellite;
        },
        
        setPassToShow : function(passToShow) {
            _passToShow = passToShow;
        }        
	};
};