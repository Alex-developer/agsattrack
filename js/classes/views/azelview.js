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
* 
* Last Checked: 19/01/2013
* 
*/
/*global AGVIEWS,AGSatTrack,AGUTIL,AGSETTINGS,Kinetic,requestAnimFrame */
 
var AGAZELVIEW = function(element) {
    'use strict';

    var _render = false;
    var _mousePos = {
        x : 0,
        y : 0,
        show : false,
        az: 'N/A',
        el: 'N/A',
        time: 'N/A'
    };
    var _width;
    var _height;
    var _stage = null;
    var _mousePosAz = null;
    var _mousePosEl = null;
    var _element;
    var _satellite = null;
    var _passToShow = null;
    var _passData = null;
    var _backgroundLayer;
    var _timeLayer;
    var _plotLayer;
    var _mouseLayer;
    var _mousePosText;
    var _margin = 50;
    var _ystep;
    var _xstep;
    var _tpp;
    var _dppEl;
    var _dppAz;
       
    if (typeof element === 'undefined') {
        throw 'Must provide element';   
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
            drawAzElView();
        }          
    }
    
    function setDimensions() {
        _height = _stage.getHeight();
        _width = _stage.getWidth();
        
        _ystep = ((_height - (2 * _margin)) / 6);
        _xstep = ((_width - (2 * _margin)) / 6);

        if (_satellite !== null && _passData === null) {
            _passData = _satellite.getNextPass();    
        }
        if (_satellite !== null && _passData !== null) {
            _tpp = (_width - (2 * _margin)) / _passData.duration;
            _dppEl = (_height - (2 * _margin)) / 90;
            _dppAz = (_height - (2 * _margin)) / 360;            
        } else {
            _tpp = 0;
            _dppEl = 0;
            _dppAz = 0;
        }
                
    }
        
    function drawBackground() {
        setDimensions();
        _backgroundLayer.removeChildren();
        _timeLayer.removeChildren();
        _mouseLayer.removeChildren();
        _backgroundLayer.add(new Kinetic.Rect({
            x: 0,
            y: 0,
            width: _width,
            height: _height,
            fill: '#001224'
        }));
        
        _backgroundLayer.add(new Kinetic.Line({
            points : [ _margin, _margin, _margin, _height - _margin],
            stroke : '#ccc',
            strokeWidth : 1
        }));

        _backgroundLayer.add(new Kinetic.Line({
            points : [ _width - _margin, _margin, _width - _margin, _height - _margin],
            stroke : '#ccc',
            strokeWidth : 1
        }));
        
        _backgroundLayer.add(new Kinetic.Line({
            points : [ _margin, _height - _margin, _width - _margin, _height - _margin],
            stroke : '#ccc',
            strokeWidth : 1
        }));
        
        var ypos = _margin;
        var xpos = _margin;
        var startTime = 0;
        var timeStep = 0;
        var date;
        var okToDraw = true;
        
        for (var i=1; i < 7; i++) {
            _backgroundLayer.add(new Kinetic.Line({
                points : [ _margin, ypos, _margin+10, ypos],
                stroke : '#ccc',
                strokeWidth : 1
            }));
            _backgroundLayer.add(new Kinetic.Line({
                points : [ _width - _margin, ypos, _width - _margin - 10, ypos],
                stroke : '#ccc',
                strokeWidth : 1
            }));
                                   
            _backgroundLayer.add(new Kinetic.Text({
                x : _margin - 30,
                y : ypos - 2,
                text : ((7-i)*60) + 'º',
                align: 'right',
                fontSize : 8,
                fontFamily : 'Verdana',
                textFill : 'green'
            }));
              
            _backgroundLayer.add(new Kinetic.Text({
                x : _width - _margin + 3,
                y : ypos - 2,
                text : (90 / 6) * (7-i) + 'º',
                align: 'left',
                fontSize : 8,
                fontFamily : 'Verdana',
                textFill : 'white'
            }));

            ypos += _ystep;              
        }
        
        if (_satellite !== null) {
            
            if (_passData === null || typeof _passData === 'undefined') {
                _passData = _satellite.getNextPass();
                if (typeof _passData === 'undefined') {
                    okToDraw = false;    
                }                
            }
            
            if (okToDraw) {
                startTime = _passData.aosDayNum;   
                timeStep = _passData.duration / 6;
                date = _satellite.convertDate(startTime);
                var dateLabel = AGUTIL.date(date);             
                for (i=0; i < 7; i++) {
                    if (i !== 0 && i !== 6) {  
                        _timeLayer.add(new Kinetic.Line({
                            points : [ xpos, _height - _margin, xpos, _height - _margin - 10],
                            stroke : '#ccc',
                            strokeWidth : 1
                        }));
                    }
                    if (_passToShow !== 0) {
                        var formattedDate = AGUTIL.shortTime(date);
                        _timeLayer.add(new Kinetic.Text({
                            x : xpos - 17,
                            y : _height - _margin + 7,
                            text : formattedDate,
                            align: 'left',
                            fontSize : 8,
                            fontFamily : 'Verdana',
                            textFill : 'white'
                        }));
                        date = Date.DateAdd('s', timeStep , date);
                    }
                                                                      
                    xpos += _xstep;
                }
                
                _timeLayer.add(new Kinetic.Text({
                    x : 0,
                    y : _height - _margin + 25,
                    width: _width,
                    text : dateLabel,
                    align: 'center',
                    fontSize : 8,
                    fontFamily : 'Verdana',
                    textFill : 'white'
                }));
            }           
        }
        
        _backgroundLayer.add(new Kinetic.Text({
            x : _margin - 30,
            y : _margin - 30,
            text : 'Az',
            align: 'right',
            fontSize : 8,
            fontFamily : 'Verdana',
            textFill : 'white'
        }));        

        _backgroundLayer.add(new Kinetic.Text({
            x : _width - _margin + 3,
            y : _margin - 30,
            text : 'El',
            align: 'right',
            fontSize : 8,
            fontFamily : 'Verdana',
            textFill : 'white'
        }));
        
        _mousePosText = new Kinetic.Text({
            x : 0,
            y : 10,
            width: _width,
            text : '',
            align: 'center',
            fontSize : 8,
            fontFamily : 'Verdana',
            textFill : 'white'
        }); 
        _mouseLayer.add(_mousePosText);
                                                
        _backgroundLayer.draw();      
        _timeLayer.draw();      
        _mouseLayer.draw();      
    }
    
    function drawAzEl() {
        var okToDraw = true;
        _plotLayer.removeChildren();

        if (_satellite !== null) {
            if (_passData === null || typeof _passData === 'undefined') {
                _passData = _satellite.getNextPass();
                if (typeof _passData === 'undefined') {
                    okToDraw = false;    
                }                
            }
            
            if (okToDraw) {
                var azPoints = [];
                var elPoints = [
                    _width - _margin,
                    _height - _margin,
                    _margin,
                    _height - _margin            
                ];
                for (var i=0; i < _passData.pass.length; i++) {
                    var pos = convertAztoXY(_passData.pass[i]);
                    azPoints.push(pos.x);   
                    azPoints.push(pos.y);   

                    pos = convertEltoXY(_passData.pass[i]);
                    elPoints.push(pos.x);   
                    elPoints.push(pos.y);          
                }
                
                if (elPoints.length > 0) {
                    _plotLayer.add(new Kinetic.Polygon({
                            points: elPoints,
                            fill: {
                                start: {
                                    x: 0,
                                    y: -10
                                },
                                end: {
                                  x: 0,
                                  y: _height
                                },
                                colorStops: [0, '#374553', 1, '#001224']
                            },
                            lineCap: 'round',
                            lineJoin: 'round'
                        })
                    );
                }
                
                if (azPoints.length > 0) {
                    _plotLayer.add(new Kinetic.Line({
                            points: azPoints,
                            stroke: 'green',
                            strokeWidth: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                        })
                    );
                }
            }
        }
        _plotLayer.draw();
    }
    
    function convertAztoXY(passEntry) {
        var diff = (passEntry.date - _passData.aosTime) / 1000;
        var x = (diff * _tpp) + _margin;

        var y =  _height -  (_dppAz * passEntry.az) - _margin;
        
        return {x: x, y:y};
    }

    function convertEltoXY(passEntry) {
        var diff = (passEntry.date - _passData.aosTime) / 1000;
        var x = (diff * _tpp) + _margin;
        
        var y =  _height -  (_dppEl * passEntry.el) - _margin;
        
        return {x: x, y:y};
    }
    
    function convertMousePos() {
        if (_satellite !== null && _passData !== null) {
           if ((_mousePos.x < _margin || _mousePos.x > _width - _margin) || (_mousePos.y < _margin || _mousePos.y > _height - _margin)) {
                _mousePos.time = 'N/A';
                _mousePos.az = 'N/A';
                _mousePos.el = 'N/A';   
           } else {
               var seconds = (_mousePos.x - _margin) / _tpp;
               _mousePos.time = AGUTIL.shortdate(Date.DateAdd('s', seconds , _passData.aosTime));               
               _mousePos.az = ((_height - _mousePos.y - _margin ) / _dppAz).toFixed(2);
               _mousePos.el = ((_height - _mousePos.y - _margin ) / _dppEl).toFixed(2);
               if (_mousePos.az < 0 || _mousePos.az > 360) {
                   _mousePos.az = 'N/A';
               } 
               if (_mousePos.el < 0 || _mousePos.el > 90) {
                   _mousePos.el = 'N/A';
               } 
           }        
        } else {
            _mousePos.az = 0;
            _mousePos.el = 0;
            _mousePos.time = 0;    
        }        
    }
    
    function drawMousePos() {
        if (_satellite !== null && _passData !== null) {
            _mousePosText.setText('Azimuth: ' + _mousePos.az + ' Elevation: ' + _mousePos.el + ' Time: ' + _mousePos.time);
            _mouseLayer.draw();
        }
    }
    
    var _debugCounter=0;
    function animate() {
        if (_render) {
            if (AGSETTINGS.getDebugLevel() > 0) {
                _debugCounter++;
                if (_debugCounter > 100) {
                    _debugCounter = 0;
                    console.log('Az/El Animate');
                }
            }
            drawMousePos();
            requestAnimFrame(animate);
        }
        
    }
    
    function drawAzElView() {
        drawBackground();
        drawAzEl();        
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
            drawAzElView();
        },
                           
        init : function(mode) {
            _stage = new Kinetic.Stage({
                container : _element,
                width : jQuery('#'+_element).width(),
                height : jQuery('#'+_element).height()
            }); 
                  
            _backgroundLayer = new Kinetic.Layer();
            _stage.add(_backgroundLayer);

            _plotLayer = new Kinetic.Layer();
            _stage.add(_plotLayer);                                  

            _timeLayer = new Kinetic.Layer();
            _stage.add(_timeLayer);            

            _mouseLayer = new Kinetic.Layer();
            _stage.add(_mouseLayer);            
            
            _stage.on('mousemove', function() {
                var mousePos = _stage.getMousePosition();
                _mousePos.x = mousePos.x;
                _mousePos.y = mousePos.y;
                convertMousePos();
            });            
            
        },
        
        reset: function() {
            _satellite = null;
            _passToShow = null;
            drawAzElView();    
        },
        
        setPassToShow : function(time) {
            _passToShow = time;

            var observers = AGSatTrack.getObservers();
            var observer = observers[0];
            _passData = _satellite.getPassforTime(observer, _passToShow);
        },
        
        setSingleSat : function(satellite) {
            _satellite = satellite;
            _passData = null;     
        }    
    };
};