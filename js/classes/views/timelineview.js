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
var AGTIMELINE = function() {
	'use strict';

	var _render = false;
	var _stage = null;
    var _backgroundLayer = null;
	var _timelineLayer = null;
    var _mousePosLayer = null;
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
    
	var _mousePos = {
			x : 0,
			y : 0,
			show : false
		};
	
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#timeline');
            width = _fixedStageWidth;
            height = parent.height();
        }
        
        width = _fixedStageWidth + _satLegendWidth;
            
        if (width !== 0 && height !== 0) {
            _stage.setSize(width, height-20);
            drawTimeline();
        }          
    }
    
	function getDimensions() {
		_width = _stage.getWidth();
		_height = _stage.getHeight();
		
		_pixelsPerMin = _fixedStageWidth / 1440;
	}	

	function drawBackground() {
		getDimensions();
		
		_backgroundLayer.removeChildren();
		_backgroundLayer.clear();
		
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
		
        _backgroundLayer.add(new Kinetic.Rect({
            fill: '#001224', 
            x : 0,
            y : 0,
            width : _satLegendWidth,
            height : _height
        }));
                
		_backgroundLayer.add(new Kinetic.Rect({
            fill: '#374553',
			x : _satLegendWidth,
			y : _height - _legendHeight,
			width : _width,
			height : _legendHeight
		}));		
		
        var startHour = new Date().getHours();
        if (startHour < 0) {
            startHour = 0;
        }
        var hour = startHour;
        for (var i=0; i <= _fixedStageWidth; i += (_pixelsPerMin * 60)) {
            _backgroundLayer.add(new Kinetic.Line({
                points : [ i + _satLegendWidth, _height - _legendHeight, i + _satLegendWidth, _height - _legendHeight + 20 ],
                stroke : '#777',
                strokeWidth : 1
            })); 
            
            if (hour > 24) {
                hour = 1;
            }
            _backgroundLayer.add(new Kinetic.Text({
                x : i + _satLegendWidth - (hour < 10?3:7),
                y : _height - 70,
                text : hour,
                fontSize : 10,
                fontFamily : 'Verdana',
                textFill : 'white'
            }));
            hour++;                                       
        }
		_backgroundLayer.draw();
	}

    function drawSatellites() {
        _timelineLayer.removeChildren();
        
        var selectedSats = AGSatTrack.getTles().getSelected();
        var yPos = _topMargin;
        jQuery.each(selectedSats, function(index, sat) {

            _timelineLayer.add(new Kinetic.Text({
                x : _leftMargin,
                y : yPos,
                width: _satLegendWidth,
                height: 15,
                text : sat.getName(),
                fontSize : 12,
                fontFamily : 'Verdana',
                textFill : 'white'
            }));            
            
            var xpos = _satLegendWidth;
            
            var passes = sat.getTodaysPasses();
            if (passes !== null) {
                for (var i=0; i<passes.length;i++) {
                    var startPos = Date.DateDiff('n', new Date(), passes[i].dateTimeStart) * _pixelsPerMin + _satLegendWidth;
                    var endPos = Date.DateDiff('n', new Date(), passes[i].dateTimeEnd) * _pixelsPerMin + _satLegendWidth;
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
            
            
            yPos +=_satHeight  
        });           
    
        _timelineLayer.draw();
    }
    
	function drawMousePos() {
	    getDimensions();
        
        _mousePosLayer.removeChildren();
        
        _mousePosLayer.add(new Kinetic.Line({
            points : [ _mousePos.x, 0, _mousePos.x, _height ],
            stroke : '#777',
            strokeWidth : 1,
            opacity: 0.5
        }));
                    
        _mousePosLayer.draw();
    }



	function drawTimeline() {
		getDimensions();
		drawBackground();
		drawSatellites();
	}

    function animate() {
        if (_render) {
            drawMousePos();
        }
        requestAnimFrame(animate);
    }
    
    animate();
            
	return {
		startRender : function() {
			_render = true;
            resize();             
		},

		stopRender : function() {
			_render = false;
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
        
		init : function() {
			_stage = new Kinetic.Stage({
				container : 'timeline',
				width : jQuery('#viewtabs').tabs('getTab', 0).width(),
				height : jQuery('#viewtabs').tabs('getTab', 0).height()
			});

			_stage.on('mousemove', function() {
				_mousePos = _stage.getMousePosition();
				_mousePos.show = true;
			});
			
			_backgroundLayer = new Kinetic.Layer();
			_stage.add(_backgroundLayer);
			
			_timelineLayer = new Kinetic.Layer({
                width: _satLegendWidth
            });
			_stage.add(_timelineLayer);			

            _mousePosLayer = new Kinetic.Layer();
            _stage.add(_mousePosLayer);                
            
            
			drawBackground();
		},
        
        calculate : function(observer) {
            var selectedSats = AGSatTrack.getTles().getSelected();
            jQuery.each(selectedSats, function(index, sat) {
                sat.calculateTodaysPasses();
            });            
        }
	}
}