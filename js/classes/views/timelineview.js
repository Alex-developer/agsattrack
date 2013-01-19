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
/*global AGSatTrack, AGUTIL, AGSETTINGS, Kinetic, requestAnimFrame */ 

var AGTIMELINE = function() {
	'use strict';

	var _render = false;
    var _viewStage = null;
	var _legendStage = null;
    var _backgroundLayer = null;
    var _legendBackgroundLayer = null;
    var _legendLayer = null;
	var _timelineLayer = null;
    var _mousePosLayer = null;
    var _mousePosTimeLayer = null;
	var _width;
	var _height;
	var _pixelsPerMin;
    var _fixedStageWidth = 2880;
    var _legendHeight = 100;
    var _satLegendWidth = 200;
    var _satHeight = 50;
    var _leftMargin = 5;
    var _topMargin = 5;
    var _passInfo = null;
    var _viewLeftMargin = 5;
    var _startDate;
    var _startHour = 0;
    var _mousePosTime;
    
	var _mousePos = {
			x : 0,
			y : 0,
			show : false
		};
	
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#timeline');
            width = parent.width();
            height = parent.height();
        }
        
        var stageWidth = _fixedStageWidth + _viewLeftMargin-20;
        
        if (width !== 0 && height !== 0) {
            
            jQuery('#timelinelegend').width(200);
            jQuery('#timelinelegend').height(height+25);

            jQuery('#timelineview').width(width - 220);
            jQuery('#timelineview').height(height);
                        
            _viewStage.setSize(stageWidth, height-25);
            _legendStage.setSize(200, height-25);
            
            _mousePosTimeLayer.setX(0);
            _mousePosTimeLayer.setY(height-50);
            drawTimeline();
        }          
    }
    
	function getDimensions() {
		_width = _viewStage.getWidth();
		_height = _viewStage.getHeight();
		
		_pixelsPerMin = _fixedStageWidth / 1440;
	}	

	function drawBackground() {
		getDimensions();
		
        _legendBackgroundLayer.removeChildren();
		_backgroundLayer.removeChildren();
		
		_backgroundLayer.add(new Kinetic.Rect({
            fill: {
                start: {
                    x: 0,
                    y: 0
                },
                end: {
                  x: 0,
                  y: _height / 2
                },
                colorStops: [0, '#374553', 1, '#001224']
            }, 
			x : 0,
			y : 0,
			width : _width,
			height : _height - _legendHeight
		}));
		
        _legendBackgroundLayer.add(new Kinetic.Rect({
            fill: '#001224', 
            x : 0,
            y : 0,
            width : _satLegendWidth,
            height : _height + 25
        }));
                
		_backgroundLayer.add(new Kinetic.Rect({
            fill: '#374553',
			x : 0,
			y : _height - _legendHeight,
			width : _width,
			height : _legendHeight
		}));		
		
        var baseDate = new Date();
        _startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours(), 0,0);
        _startHour = _startDate.getHours();
        if (_startHour < 0) {
            _startHour = 0;
        }
        var hour = _startHour;
        var counter = 0;
        var length;
        var xTextPos;
        
        for (var i=0; i <= _fixedStageWidth; i += (_pixelsPerMin * 5)) {
            
            switch (counter) {
                case 0:
                    length = 20;
                    break;

                case 3:
                case 9:                
                    length = 10;
                    break;

                case 6:              
                    length = 15;
                    break;
                                        
                default:
                    length = 5;
                    break;
            }
            
            _backgroundLayer.add(new Kinetic.Line({
                points : [ i + _viewLeftMargin, _height - _legendHeight, i + _viewLeftMargin, _height - _legendHeight + length ],
                stroke : '#777',
                strokeWidth : 1
            })); 
            
            if (hour > 24) {
                hour = 1;
            }
            if (length === 20) {
                if (i === 0) {
                    xTextPos = _viewLeftMargin;    
                } else {
                    xTextPos = i + _viewLeftMargin - (hour < 10?3:7);
                }
                _backgroundLayer.add(new Kinetic.Text({
                    x : xTextPos,
                    y : _height - 70,
                    text : hour,
                    fontSize : 10,
                    fontFamily : 'Verdana',
                    textFill : 'white'
                }));
                hour++; 
            }
            counter++;
            if (counter === 12) {
                counter = 0;
            }
                                      
        }
        _backgroundLayer.draw();
		_legendBackgroundLayer.draw();
	}

    function drawSatellites() {
        _timelineLayer.removeChildren();
        _legendLayer.removeChildren();
        
        var selectedSats = AGSatTrack.getTles().getSelected();
        var yPos = _topMargin;
        jQuery.each(selectedSats, function(index, sat) {

            _legendLayer.add(new Kinetic.Text({
                x : _leftMargin,
                y : yPos,
                width: _satLegendWidth,
                height: 15,
                text : sat.getName(),
                fontSize : 12,
                fontFamily : 'Verdana',
                textFill : 'white'
            }));            

            if (sat.isGeostationary()) {
                if (sat.get('elevation') > 0) {
                    _timelineLayer.add(new Kinetic.Rect({
                        fill: 'white',
                        x : _viewLeftMargin,
                        y : yPos,
                        width : _fixedStageWidth-_viewLeftMargin,
                        height : 20
                    }));
                    _timelineLayer.add(new Kinetic.Text({
                        x : _viewLeftMargin + 10,
                        y : yPos + 5,
                        width: 400,
                        height: 15,
                        text : 'Satellite is geostationary always visible',
                        fontSize : 12,
                        fontFamily : 'Verdana',
                        textFill : 'black'
                    }));                                         
                } else {
                    _timelineLayer.add(new Kinetic.Text({
                        x : _viewLeftMargin + 10,
                        y : yPos + 5,
                        width: 400,
                        height: 15,
                        text : 'Satellite is geostationary and never visible',
                        fontSize : 12,
                        fontFamily : 'Verdana',
                        textFill : 'red'
                    }));                      
                }
            } else {
            
                _timelineLayer.add(new Kinetic.Line({
                    points : [ _viewLeftMargin, yPos+10, _fixedStageWidth-_viewLeftMargin, yPos+10 ],
                    stroke : '#777',
                    strokeWidth : 1
                }));
                                               
                var xpos = _viewLeftMargin;
                var passes = sat.getTodaysPasses();           
                if (passes !== null) {
                    for (var i=0; i<passes.length;i++) {
                        var sdiff = Date.DateDiff('n', _startDate, passes[i].dateTimeStart);
                        var startPos = (Date.DateDiff('n', _startDate, passes[i].dateTimeStart) * _pixelsPerMin) + _viewLeftMargin;
                        var endPos = (Date.DateDiff('n', _startDate, passes[i].dateTimeEnd) * _pixelsPerMin) + _viewLeftMargin;
                       /*
                        _timelineLayer.add(new Kinetic.Line({
                            points : [ startPos, 10, endPos, 10 ],
                            stroke : '#ccc',
                            strokeWidth : 1
                        }));
                        */
                        _timelineLayer.add(new Kinetic.Rect({
                            fill: 'white',
                            x : startPos,
                            y : yPos,
                            width : endPos - startPos,
                            height : 20
                        }));
                                                                
                    }
                }
            }
            
            
            yPos +=_satHeight; 
        });           
    
        _timelineLayer.draw();
        _legendLayer.draw();
    }
    
	function drawMousePos() {
        getDimensions();
        
        _mousePosLayer.removeChildren();
        _mousePosTimeLayer.clear();
        
        if (_mousePos.x >= _viewLeftMargin) {
            _mousePosLayer.add(new Kinetic.Line({
                points : [ _mousePos.x, 0, _mousePos.x, _height ],
                stroke : '#777',
                strokeWidth : 1,
                opacity: 0.5
            }));
        
            var mins = (_mousePos.x - _viewLeftMargin) / _pixelsPerMin;
            
            var date = Date.DateAdd('n', mins, _startDate);
            var hour = ((mins/60) | 0);
            var minsLeft = (mins - (hour*60)) |0;
            var displayHour = hour + _startHour;
            
            _mousePosTime.setText(AGUTIL.shortdate(date));
        } else {
            _mousePosTime.setText('');
        }
        
        _mousePosTimeLayer.draw();             
        _mousePosLayer.draw();
    }



	function drawTimeline() {
		getDimensions();
		drawBackground();
		drawSatellites();
	}

    var _debugCounter = 0;
    function animate() {
        if (_render) {
            if (AGSETTINGS.getDebugLevel() > 0) {            
                _debugCounter++;
                if (_debugCounter > 100) {
                    _debugCounter = 0;
                    console.log('Timeline Animate');
                }
            }      
            drawMousePos();
            requestAnimFrame(animate);
        }
        
    }
    
    animate();
            
	return {
		startRender : function() {
			_render = true;
            resize();
            animate();            
		},

		stopRender : function() {
			_render = false;
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
        
		init : function() {
			_viewStage = new Kinetic.Stage({
				container : 'timelineview',
				width : jQuery('#viewtabs').tabs('getTab', 0).width(),
				height : jQuery('#viewtabs').tabs('getTab', 0).height()
			});
                        
			_viewStage.on('mousemove', function() {
				_mousePos = _viewStage.getMousePosition();
				_mousePos.show = true;
			});
			
			_backgroundLayer = new Kinetic.Layer();
			_viewStage.add(_backgroundLayer);
			
			_timelineLayer = new Kinetic.Layer({
                width: _satLegendWidth
            });
			_viewStage.add(_timelineLayer);			
            
            _legendStage = new Kinetic.Stage({
                container : 'timelinelegend',
                width : 200,
                height : jQuery('#viewtabs').tabs('getTab', 0).height() + 25
            });            
            _legendBackgroundLayer = new Kinetic.Layer();
            _legendStage.add(_legendBackgroundLayer);
            _legendLayer = new Kinetic.Layer();
            _legendStage.add(_legendLayer);                        
                  
            _mousePosLayer = new Kinetic.Layer();
            _viewStage.add(_mousePosLayer);                
            _mousePosTimeLayer = new Kinetic.Layer();
            _legendStage.add(_mousePosTimeLayer);                         
            _mousePosTime = new Kinetic.Text({
                x : 5,
                y : 0,
                text : 'N/A',
                fontSize : 10,
                fontFamily : 'Verdana',
                textFill : 'white'
            });
            _mousePosTimeLayer.add(_mousePosTime);
                                    
			drawBackground();
		},
        
        calculate : function(observer) {
            var selectedSats = AGSatTrack.getTles().getSelected();
            jQuery.each(selectedSats, function(index, sat) {
                sat.calculateTodaysPasses(observer);
            });
            drawTimeline();           
        }
	};
};