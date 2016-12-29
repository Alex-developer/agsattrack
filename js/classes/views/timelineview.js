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
* Last Checked: 06/04/2013
*
*/
/*jshint bitwise: true, loopfunc: true*/
/*global AGSatTrack, AGUTIL, AGSETTINGS, AGOBSERVER, Konva, requestAnimFrame, console */

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
    var _toolTipLayer = null;
    var _toolTip = null;
	var _width;
	var _height;
	var _pixelsPerMin;
    var _fixedStageWidth = 2880;
    var _legendHeight = 100;
    var _satLegendWidth = 200;
    var _satHeight = 50;
    var _leftMargin = 5;
    var _topMargin = 5;
    var _viewLeftMargin = 5;
    var _startDate;
    var _startHour = 0;
    var _mousePosTime;
    var _tooltipText = [];
    var _zoomFactor = 1;
    
	var _mousePos = {
			x : 0,
			y : 0,
			show : false
		};

    jQuery(document).bind('agsattrack.timeline-reset', function() {
        _zoomFactor = 1;
        setupToolbar();
        drawTimeline();
    });
            
    jQuery(document).bind('agsattrack.timeline-zoom-in', function() {
        _zoomFactor++;
        setupToolbar();
        drawTimeline();
    });

    jQuery(document).bind('agsattrack.timeline-zoom-out', function() {
        if (_zoomFactor > 1) {
            _zoomFactor--;
            setupToolbar();
            drawTimeline();
        }
    });
        
    jQuery(document).bind('agsattrack.timelineviewshowmutuallocations', function(e,state) {
        AGSETTINGS.setMutualObserverEnabled(state);
        drawTimeline();
    });
      
    jQuery(document).bind('agsattrack.newsatselected', function() {
        if (_render) {
            setupToolbar();
        }
    });
    
                     
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

            _viewStage.setWidth(stageWidth);
            _viewStage.setHeight(height-25);

            _legendStage.setWidth(200);
            _legendStage.setHeight(height);
            
            _mousePosTimeLayer.setX(0);
            _mousePosTimeLayer.setY(height-50);
            drawTimeline();
        }          
    }
    
	function getDimensions() {
		_width = _viewStage.getWidth();
		_height = _viewStage.getHeight();
		
		_pixelsPerMin = _fixedStageWidth / 1440;
        
        _pixelsPerMin = _pixelsPerMin * _zoomFactor;
	}	

	function drawBackground() {
		getDimensions();
		
        _legendBackgroundLayer.removeChildren();
		_backgroundLayer.removeChildren();
		
		_backgroundLayer.add(new Konva.Rect({
            fillLinearGradientStartPoint: { x: 0, y: 0},
            fillLinearGradientEndPoint: {x: 0, y: _height / 2},
            fillLinearGradientColorStops: [0, '#374553', 1, '#001224'], 
			x : 0,
			y : 0,
			width : _width,
			height : _height - _legendHeight
		}));
		
        _legendBackgroundLayer.add(new Konva.Rect({
            fill: '#001224', 
            x : 0,
            y : 0,
            width : _satLegendWidth,
            height : _height + 25
        }));
                
		_backgroundLayer.add(new Konva.Rect({
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
            
            _backgroundLayer.add(new Konva.Line({
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
                _backgroundLayer.add(new Konva.Text({
                    x : xTextPos,
                    y : _height - 70,
                    text : hour,
                    fontSize : 10,
                    fontFamily : 'Verdana',
                    fill : 'white'
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
        getDimensions();        
        _timelineLayer.removeChildren();
        _legendLayer.removeChildren();
        
        var selectedSats = AGSatTrack.getTles().getSelected();
        var yPos = _topMargin;
        if (selectedSats.length === 0) {
            _legendLayer.add(new Konva.Text({
                x : 10 ,
                y : (_height - _legendHeight) / 2,
                width: _satLegendWidth - 10,
                height: 80,
                text : 'Please Select one or more satellites to enable the timeline view',
                fontSize : 12,
                lineHeight : 1.50,
                fontFamily : 'Verdana',
                fill : 'white'                
            }));            
        }
        
        var tooltipPos = 0;
        jQuery.each(selectedSats, function(index, sat) {

            _legendLayer.add(new Konva.Text({
                x : _leftMargin,
                y : yPos,
                width: _satLegendWidth,
                height: 15,
                text : sat.getName(),
                fontSize : 12,
                fontFamily : 'Verdana',
                fill : 'white'
            }));            

            if (sat.isGeostationary()) {
                if (sat.get('elevation') > 0) {
                    _timelineLayer.add(new Konva.Rect({
                        fill: 'white',
                        x : _viewLeftMargin,
                        y : yPos,
                        width : _fixedStageWidth-_viewLeftMargin,
                        height : 20
                    }));
                    _timelineLayer.add(new Konva.Text({
                        x : _viewLeftMargin + 10,
                        y : yPos + 5,
                        width: 400,
                        height: 15,
                        text : 'Satellite is geostationary always visible',
                        fontSize : 12,
                        fontFamily : 'Verdana',
                        fill : 'black'
                    }));                                         
                } else {
                    _timelineLayer.add(new Konva.Text({
                        x : _viewLeftMargin + 10,
                        y : yPos + 5,
                        width: 400,
                        height: 15,
                        text : 'Satellite is geostationary and never visible',
                        fontSize : 12,
                        fontFamily : 'Verdana',
                        fill : 'red'
                    }));                      
                }
            } else {
            
                _timelineLayer.add(new Konva.Line({
                    points : [ _viewLeftMargin, yPos+10, _fixedStageWidth-_viewLeftMargin, yPos+10 ],
                    stroke : '#777',
                    strokeWidth : 1
                }));
                     
                var observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);
                var mutualObserver = AGSatTrack.getObserver(AGOBSERVER.types.MUTUAL);                                               
                var passes = sat.getTodaysPasses();           
                if (passes !== null) {
                    for (var i=0; i<passes.length;i++) {
                        var startPos = (Date.DateDiff('n', _startDate, passes[i].dateTimeStart) * _pixelsPerMin) + _viewLeftMargin;
                        var endPos = (Date.DateDiff('n', _startDate, passes[i].dateTimeEnd) * _pixelsPerMin) + _viewLeftMargin;
                        var rect = new Konva.Rect({
                            fill: '#3D9EFF',
                            x : startPos,
                            y : yPos,
                            width : endPos - startPos,
                            height : 20,
                            tooltip: tooltipPos
                        });
                        tooltipPos = rect._id;
                        rect.on('mouseout', function(){
                            _toolTip.hide();
                            _toolTipLayer.draw();
                        });
                        var aosTime = AGUTIL.shortdatetime(passes[i].dateTimeStart,false,false);
                        var losTime = AGUTIL.shortdatetime(passes[i].dateTimeEnd,false,false);
                        var maxEl = passes[i].peakElevation.toFixed(2);
                        var maxAz = passes[i].peakAzimuth.toFixed(2);
                        var orbitNumber = passes[i].orbitNumber;
                        var text = sat.getName() + '\n\n';
                        text += 'Aos: ' + aosTime + '\n';
                        text += 'Los: ' + losTime + '\n';
                        text += 'Max El: ' + maxEl + ' Max Az: ' + maxAz + '\n';
                        text += 'orbit Number: ' + orbitNumber;  
                        _tooltipText[tooltipPos] = text;
                                              
                        rect.on('mousemove', function(){
                            _toolTip.x(_mousePos.x + 5);
                            _toolTip.y(_mousePos.y + 5);
                            _toolTip.setText(_tooltipText[this._id]);
                            _toolTip.show();
                            _toolTipLayer.draw();
                        });
                        _timelineLayer.add(rect);
                        
                        if (AGSETTINGS.getMutualObserverEnabled()) {
                            var passData = [];
                            var mutualStart = null;
                            var mutualEnd = null;
                            var pos = 0;
                            passData = sat.getPassforTime(observer, mutualObserver, passes[i].dateTimeStart);
                            var len = passData.pass.length;
                            
                            while (pos < len) {
                                mutualStart = null;
                                mutualEnd = null;
                                while ((pos < len) && (passData.pass[pos].mutual === false)) {
                                    pos++;
                                }
                                if (pos < len) {
                                    mutualStart = passData.pass[pos].date;
                                    while ((pos < len) && (passData.pass[pos].mutual === true)) {
                                        pos++;
                                    }
                                    if (pos < len) {
                                        mutualEnd = passData.pass[pos].date;
                                        pos++;
                                        addMutual(_startDate, mutualStart, mutualEnd, yPos, tooltipPos);               
                                    }
                                }
                            }

                            if (mutualStart !== null && mutualEnd === null) {
                                mutualEnd = passData.pass[len-1].date;
                                addMutual(_startDate, mutualStart, mutualEnd, yPos, tooltipPos);                              
                            }                            
                            
                        }
                                                                
                    }
                }
            }
            yPos +=_satHeight; 
        });           
    
        _timelineLayer.draw();
        _legendLayer.draw();
    }
    
    function addMutual(_startDate, mutualStart, mutualEnd, yPos, tooltipPos) {
        var startPos = (Date.DateDiff('n', _startDate, mutualStart) * _pixelsPerMin) + _viewLeftMargin;
        var endPos = (Date.DateDiff('n', _startDate, mutualEnd) * _pixelsPerMin) + _viewLeftMargin;
        var mutualRect = new Konva.Rect({
            fillLinearGradientStartPoint: {x: 0, y: 0},
            fillLinearGradientEndPoint: {x: 20, y: 20},
            fillLinearGradientColorStops: [0, '#001E3D', 1, '#005EBC'],
            x : startPos,
            y : yPos,
            width : endPos - startPos,
            height : 20
        });
        var tipPos = mutualRect._id; 
        var text = _tooltipText[tooltipPos];
        text += '\nMutual Start: ' + AGUTIL.shortdatetime(mutualStart,false,false);
        text += '\nMutual End: ' + AGUTIL.shortdatetime(mutualEnd,false,false);
        _tooltipText[tipPos] = text;
                              
        mutualRect.on('mousemove', function(){
            _toolTip.x(_mousePos.x + 5);
            _toolTip.y(_mousePos.y + 5);
            _toolTip.setText(_tooltipText[this._id]);
            _toolTip.show();
            _toolTipLayer.draw();
        });     
        mutualRect.on('mouseout', function(){
            _toolTip.hide();
            _toolTipLayer.draw();
        });           
        _timelineLayer.add(mutualRect);          
    }
    
	function drawMousePos() {
        getDimensions();
        
        _mousePosLayer.removeChildren();
        _mousePosTimeLayer.clear();
        
        if (_mousePos.x >= _viewLeftMargin) {
            _mousePosLayer.add(new Konva.Line({
                points : [ _mousePos.x, 0, _mousePos.x, _height ],
                stroke : '#777',
                strokeWidth : 1,
                opacity: 0.5
            }));
        
            var mins = (_mousePos.x - _viewLeftMargin) / _pixelsPerMin;
            
            var date = Date.DateAdd('n', mins, _startDate);
            
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
    
    function setupToolbar() {
        var selectedSats = AGSatTrack.getTles().getSelected();
        if (selectedSats.length === 0) {
            jQuery('#timeline-view-show-mutual').setButtonState(false); // Looks better when disabled
            jQuery('#timeline-view-show-mutual').disable();
            jQuery('#timline-zoom-out').disable();
            jQuery('#timline-zoom-in').disable();
            jQuery('#timline-reset').disable();
        } else {
            jQuery('#timeline-view-show-mutual').enable();
            jQuery('#timline-zoom-in').enable();
            jQuery('#timline-reset').enable();

            if (AGSETTINGS.getMutualObserverEnabled()) {
                jQuery('#timeline-view-show-mutual').setButtonState(true);   
            } else {
                jQuery('#timeline-view-show-mutual').setButtonState(false);   
            }
            
            if (_zoomFactor === 1) {
                jQuery('#timline-zoom-out').disable();    
            } else {
                jQuery('#timline-zoom-out').enable();    
            }
        }
    }   
         
	return {
		startRender : function() {
			_render = true;
            resize();
            setupToolbar();
            animate();
		},

		stopRender : function() {
			_render = false;
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
        
		init : function() {
			_viewStage = new Konva.Stage({
				container : 'timelineview',
				width : jQuery('#viewtabs').tabs('getTab', 0).width(),
				height : jQuery('#viewtabs').tabs('getTab', 0).height()
			});

			_viewStage.on('mousemove', function() {
				_mousePos = _viewStage.getPointerPosition ();
				_mousePos.show = true;
			});
			
			_backgroundLayer = new Konva.Layer();
			_viewStage.add(_backgroundLayer);
			
			_timelineLayer = new Konva.Layer();
			_viewStage.add(_timelineLayer);			
            
            _toolTipLayer = new Konva.Layer();
            _toolTip = new Konva.Text({
                text: '',
                fontFamily: 'Calibri',
                fontSize: 10,
                padding: 5,
                fill: 'white',
                alpha: 0.50,
                visible: false
            });
            _toolTipLayer.add(_toolTip);            
            _viewStage.add(_toolTipLayer);            
            
            _legendStage = new Konva.Stage({
                container : 'timelinelegend',
                width : 200,
                height : jQuery('#viewtabs').tabs('getTab', 0).height() + 25
            });            
            _legendBackgroundLayer = new Konva.Layer();
            _legendStage.add(_legendBackgroundLayer);
            _legendLayer = new Konva.Layer();
            _legendStage.add(_legendLayer);                        
                  
            _mousePosLayer = new Konva.Layer();
            _viewStage.add(_mousePosLayer);                
            _mousePosTimeLayer = new Konva.Layer();
            _legendStage.add(_mousePosTimeLayer);                         
            _mousePosTime = new Konva.Text({
                x : 5,
                y : 0,
                text : 'N/A',
                fontSize : 10,
                fontFamily : 'Verdana',
                fill : 'white'
            });
            _mousePosTimeLayer.add(_mousePosTime);

			drawBackground();
		},
        
        calculate : function(observer, mutualObserver) {
            var selectedSats = AGSatTrack.getTles().getSelected();
            jQuery.each(selectedSats, function(index, sat) {
                sat.calculateTodaysPasses(observer, mutualObserver);
            });
            drawTimeline();           
        }
	};
};