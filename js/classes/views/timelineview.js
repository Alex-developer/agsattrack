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
	
	jQuery(window).resize(function() {

	});


	function getDimensions() {
		_width = _stage.getWidth();
		_height = _stage.getHeight();

		var d = new Date();
		var m = d.getMinutes();
		var n = d.getHours();
		
		var total = n*60+m;
		var totalLeft = 1440 - total;
		
		_pixelsPerMin = _width / totalLeft;
		debugger;
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
		},

		stopRender : function() {
			_render = false;
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