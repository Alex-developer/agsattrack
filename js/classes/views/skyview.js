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
	var _satImage = new Image();
	var _moonImage = new Image();
	var _width;
	var _height;
	var _xstep;
	var _ystep;
	var _stage = null;
	var _backgroundLayer = null;
	var _mousePosLayer = null;
    var _orbitLayer = null;
	var _sunMoonLayer = null;
	var _satLayer = null;
	var _infoGroup = null;
	var _mousePosAz = null;
	var _mousePosEl = null;
	var _moonPhase = null;
	var _moon = null;
	var _moonText = null;

	jQuery(window).resize(function() {
		var parent = jQuery('#viewtabs').tabs('getTab', 0);
		_stage.setSize(parent.width(), parent.height());
		drawBackground();
	});

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
		_backgroundLayer.clear();
		_backgroundLayer.draw();
		_backgroundLayer.add(new Kinetic.Rect({
			fill : 'black',
			x : 0,
			y : 0,
			width : _width,
			height : _height
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
				_stroke = '#777';
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

		for ( var i = 0; i <= 9; i++) {
			var yPos = (0.5 + (i * 10 * _ystep)) | 0;
			_backgroundLayer.add(new Kinetic.Line({
				points : [ 0, yPos, _width, yPos ],
				stroke : '#333',
				strokeWidth : 1,
				opacity: 0.5				
			}));
		}

		_backgroundLayer.draw();
	}

	function drawMousePos() {

		_mousePosLayer.clear();

		var mouseAz = (_mousePos.x / _xstep).toFixed(0);
		var mouseEl = (90 - (_mousePos.y / _ystep)).toFixed(0);

		_mousePosAz.setText(mouseAz);
		_mousePosEl.setText(mouseEl);

		_mousePosLayer.draw();
	}

	function drawSunAndMoon() {
		var _moonPos = AGSatTrack.getMoon();

		if (_moonPos[0] > 0) {
			var pos = convertAzEltoScreen(_moonPos[1], _moonPos[0]);
			if (_moon === null) {
				_moon = new Kinetic.Image({
					x : pos.x - 8,
					y : pos.y - 8,
					image : _moonImage,
					width : 32,
					height : 32,
					id : -1
				});
				_sunMoonLayer.add(_moon);
			} else {
				_moon.setPosition(parseInt(pos.x - 8), parseInt(pos.y - 8));
			}

			var _moonPosText = 'Moon (Az: ' + _moonPos[1].toFixed(0) + ' El: '
					+ _moonPos[0].toFixed(0) + ')';
			if (_moonText === null) {
				_moonText = new Kinetic.Text({
					x : pos.x,
					y : pos.y - 16,
					text : _moonPosText,
					fontSize : 10,
					fontFamily : 'Verdana',
					textFill : 'white'
				});
				_sunMoonLayer.add(_moonText);
			} else {
				_moonText.setText(_moonPosText);
			}

			_sunMoonLayer.draw();
		}
	}

	function drawSatellites() {
		var satellites = AGSatTrack.getSatellites();

		jQuery.each(satellites, function(index, satellite) {
			if (satellite.isDisplaying()) {
				var data = satellite.getData();

				var az = data.azimuth;
				var el = data.elevation;

				if (el > AGSETTINGS.getAosEl()) {

					var pos = convertAzEltoScreen(az, el);
					var _style = 'normal';

					if (satellite.getSelected()) {
						_style = 'bold';
					}

					var satLabel = satellite.getName() + ' (az: '
							+ data.azimuth.toFixed(0) + ' , el: '
							+ data.elevation.toFixed(0) + ')';

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
							textFill : 'green'
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
							image : _satImage,
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
        var orbitData;
        var points;
        
        getDimensions()
        _orbitLayer.removeChildren();
        var satellites = AGSatTrack.getSatellites();

        jQuery.each(satellites, function(index, satellite) {
            if (satellite.isDisplaying() && satellite.getSelected()) {
                orbitData = satellite.getOrbitData();
                points = [];
                for (var i=0; i<orbitData.length;i++) {
                    if (orbitData[i].el > -10) {
                        pos = convertAzEltoScreen(orbitData[i].az, orbitData[i].el);
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
                                    stroke: 'red',
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
            }
        });
        _orbitLayer.draw();        
    }
    
	function drawSkyView() {
		getDimensions();

		drawSunAndMoon();
		drawSatellites();
        drawOrbits();
	}

	return {
		startRender : function() {
			_render = true;
		},

		stopRender : function() {
			_render = false;
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

			_sunMoonLayer = new Kinetic.Layer();
			_stage.add(_sunMoonLayer);

			_satLayer = new Kinetic.Layer();
			_stage.add(_satLayer);

            _orbitLayer = new Kinetic.Layer();
            _stage.add(_orbitLayer);
                        
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
			
			_moonPhase = AGSatTrack.getMoonPhase();

			_satImage.src = '/images/Satellite.png';
			_moonImage.src = '/images/moon/phase' + _moonPhase + '.png';
			_satImage.onload = function() {
				_moonImage.onload = function() {
					animate();
				}
			};

			jQuery(window).trigger('resize');
		}
	}
}