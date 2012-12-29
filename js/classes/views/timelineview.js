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
	var _navBackgroundLayer = null;
	var _width;
	var _height;
	var _pixelsPerMin;
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

        if (width !== 0 && height !== 0) {
            _stage.setSize(width, height);
            drawBackground();
        }          
    }
    
	function getDimensions() {
		_width = _stage.getWidth();
		_height = _stage.getHeight();

		var d = new Date();
		var m = d.getMinutes();
		var n = d.getHours();
		
		var total = n*60+m;
		var totalLeft = 1440 - total;
		
		_pixelsPerMin = _width / totalLeft;
	}	

	function drawBackground() {
		getDimensions();
		
		_backgroundLayer.removeChildren();
		_backgroundLayer.clear();
		
		_backgroundLayer.add(new Kinetic.Rect({
			fill : 'black',
			x : 0,
			y : 0,
			width : _width,
			height : _height - 100
		}));
		
		_backgroundLayer.add(new Kinetic.Rect({
			fill : 'white',
			x : 0,
			y : _height - 100,
			width : _width,
			height : 100
		}));		
		
		_backgroundLayer.draw();
		
		
	}

	function drawMousePos() {
	}



	function drawTimeline() {
		getDimensions();
		drawBackground();
		
		
	}

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
			
			_navBackgroundLayer = new Kinetic.Layer();
			_stage.add(_navBackgroundLayer);			

			drawBackground();
		}
	}
}