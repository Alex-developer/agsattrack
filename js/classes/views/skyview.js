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
var AGSKYVIEW = function() {
	'use strict';

	var _render = false;
	var _mousePos = {
		x : 0,
		y : 0,
		show : false
	};
	var _sats = [];
	var _satLabels = [];
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
    
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#polar');
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
		_sats = [];
		_satLabels = [];
		_satLayer.removeChildren();
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

		for ( var i = 15; i <= 90; i+=15) {
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

        _cityLayer.add(new Kinetic.Image({
          x: 0,
          y: _height - 109,
          image: AGIMAGES.getImage('city'),
          width: _width,
          height: 109,
          opacity: 0.90
        }));

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
		var satellites = AGSatTrack.getSatellites();

		jQuery.each(satellites, function(index, satellite) {
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

					if (typeof _sats[index] !== 'undefined') {
						_satLabels[index].setPosition(parseInt(pos.x - 8),
								parseInt(pos.y - 20));
						_satLabels[index].setFontStyle(_style);
					} else {
						_satLabels[index] = new Kinetic.Text({
							x : pos.x - 8,
							y : pos.y - 20,
							text : satLabel,
							fontSize : 10,
							fontFamily : 'Verdana',
							fontStyle : _style,
							textFill : 'white'
						});
						_satLayer.add(_satLabels[index]);
					}

					if (typeof _sats[index] !== 'undefined') {
						_sats[index].setPosition(parseInt(pos.x - 8),
								parseInt(pos.y - 8));
					} else {
						_sats[index] = new Kinetic.Image({
							x : pos.x - 8,
							y : pos.y - 8,
							image : AGIMAGES.getImage('satellite16'),
							width : 16,
							height : 16,
							id : satellite.getName()
						});
						_sats[index].on('mouseup', function(e) {
							var selected = e.shape.getId();
							jQuery(document).trigger('agsattrack.satclicked', {
								index : selected
							});
						});
						_satLayer.add(_sats[index]);
					}

				}

			}

		});
		_satLayer.draw();
	}

    function drawOrbits() {
        var pos;
        var orbit;
        var points;
        
        getDimensions()
        _orbitLayer.removeChildren();
        var satellites = AGSatTrack.getSatellites();

        jQuery.each(satellites, function(index, satellite) {
            if (satellite.isDisplaying() && satellite.getSelected()) {
                orbit = satellite.getOrbitData();
                points = [];
                var max = {az:0, el:0};
                var aostime = null;                
                for (var i=0; i<orbit.length;i++) {
                    if (orbit[i].el >= AGSETTINGS.getAosEl() && aostime === null) {                    
                        aostime = orbit[i].date;
                    }
                                                
                    if (orbit[i].el > -10) {
                        if (orbit[i].el > max.el) {
                            max = orbit[i];
                        }                        
                        pos = convertAzEltoScreen(orbit[i].az, orbit[i].el);
                        points.push(pos.x);
                        points.push(pos.y);
                        /*
                        _orbitLayer.add(new Kinetic.Text({
                            x : pos.x - 8,
                            y : pos.y - 20,
                            text : AGUTIL.shortdate(orbitData[i].date),
                            fontSize : 10,
                            fontFamily : 'Verdana',
                            textFill : 'green'
                        }));
                        */                            
                        if (pos.x <= 0 || pos.x >= _width || pos.y >= _height) {
                            _orbitLayer.add(new Kinetic.Line({
                                    points: points,
                                    stroke: 'green',
                                    strokeWidth: 1,
                                    lineCap: 'round',
                                    lineJoin: 'round'
                                })
                            );
                            points = [];                            
                        }
                    }    
                }
                
                if (points.length > 0) {
                    _orbitLayer.add(new Kinetic.Line({
                            points: points,
                            stroke: 'red',
                            strokeWidth: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                        })
                    );
                }
                
                var el = satellite.get('elevation');
                if (el < AGSETTINGS.getAosEl() && aostime !== null) {
                    var pos = convertAzEltoScreen(max.az, max.el);
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
        });
        _orbitLayer.draw();        
    }
    
	function drawSkyView() {
		getDimensions();

		drawPlanets();
		drawSatellites();
        drawOrbits();
	}

	return {
		startRender : function() {
            resize();            
			_render = true;
		},

		stopRender : function() {
			_render = false;
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
                   
		init : function() {

			_stage = new Kinetic.Stage({
				container : 'sky',
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
		        x: 5,
		        y: 20,
		        width: 120,
		        height: 100,
		        fill: 'white',
		        stroke: '#ddd',
		        strokeWidth: 4,
		        opacity: 0.2
		      }));
			
			_infoGroup.add(new Kinetic.Text({
				x : 15,
				y : 25,
				text : 'Mouse Position',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white'
			}));

			_infoGroup.add(new Kinetic.Text({
				x : 10,
				y : 50,
				text : 'Azimuth',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white'
			}));

			_infoGroup.add(new Kinetic.Text({
				x : 10,
				y : 70,
				text : 'Elevation',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'white'
			}));

			_mousePosAz = new Kinetic.Text({
				x : 80,
				y : 50,
				text : 'N/A',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'green',
				fontStyle: 'bold'
			});
			_infoGroup.add(_mousePosAz);

			_mousePosEl = new Kinetic.Text({
				x : 80,
				y : 70,
				text : 'N/A',
				fontSize : 10,
				fontFamily : 'Verdana',
				textFill : 'green',
				fontStyle: 'bold'
			});
			_infoGroup.add(_mousePosEl);
			_mousePosLayer.add(_infoGroup);
			
			_stage.on('mousemove', function() {
				_mousePos = _stage.getMousePosition();
				_mousePos.show = true;
			});

			drawBackground();

			function animate() {
				if (_render) {
					drawMousePos();
				}
				requestAnimFrame(animate);
			}
			

			animate();

			jQuery(window).trigger('resize');
		}
	}
}