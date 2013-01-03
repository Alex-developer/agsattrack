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
var AGUTIL = (function() {
    'use strict'
	
	function convertDecDeg(v,tipo, html) {
        
        if ( v < -180) {
            return v;
        } 
        var symbol;
        var dir;
                
        if (typeof html === 'undefined') {
            html = true;
        }
        
        if (html) {
           symbol = '&deg'; 
        } else {
           symbol = 'º';             
        }
        
    	if (!tipo) tipo='N';
    	var deg;
    	deg = v;
    	if (!deg){
    		return "";
    	} else if (deg > 180 || deg < 0){
    		// convert coordinate from north to south or east to west if wrong tipo
    		return convertDecDeg(-v,(tipo=='N'?'S': (tipo=='E'?'W':tipo) ), html);
    	} else {
    		var gpsdeg = parseInt(deg);
    		var remainder = deg - (gpsdeg * 1.0);
    		var gpsmin = remainder * 60.0;
    		var D = gpsdeg;
    		var M = parseInt(gpsmin);
    		var remainder2 = gpsmin - (parseInt(gpsmin)*1.0);
    		var S = parseInt(remainder2*60.0);
    		return D+symbol+' '+M+"' "+S+"'' "+tipo;
    	}
        
        
    }                   

    
    function pad(num, size) {
        var s = "00" + num;
        return s.substr(s.length-size);
    }
    
	return {
        
        loadImages : function(sources, callback){
            var images = {};
            var loadedImages = 0;
            var numImages = 0;
            for (var src in sources) {
                numImages++;
            }
            for (var src in sources) {
                images[src] = new Image();
                images[src].onload = function(){
                    if (++loadedImages >= numImages) {
                        callback(images);
                    }
                };
                images[src].src = sources[src];
            }
        },
        
		convertDecDegLat: function(lat,html) {
            var dir = (lat>0?'N':'S');
	        var lat = convertDecDeg(lat,dir,html);
	        return lat;
		},
		convertDecDegLon: function(lon,html) {
	        var dir = (lon>0?'E':'W');
	        var lon = convertDecDeg(lon,dir,html);
	        return lon;
		},
		shortdate : function(date) {
			if (date === '') {
				return '';
			}
			var shortDate = '';
			
			shortDate += date.getFullYear() + '/';
			shortDate += pad(date.getMonth(),2) + '/';
			shortDate += pad(date.getDate(),2) + ' ';
			shortDate += pad(date.getHours(),2) + ':';
			shortDate += pad(date.getMinutes(),2) + ':';
			shortDate += pad(date.getSeconds(),2);
			
			return shortDate;
		},
        
        /**
        * Check if webGL is really supported. Some devices, like the iPad report, via Modernizer that webGL
        * is available when in fact it is not.
        */
        webGlTest : function() {
            var result = false;
            var disableWebGLOn = {
                product : ['ipad', 'iphone', 'ipod'],
                name : ['ie']
            };
            
            function isWebBGLSupported() {
                var result = true;
                
                for(var property in disableWebGLOn){
                    for (var i=0;i<disableWebGLOn[property].length;i++) {
                        if (platform[property]) {
                            if (disableWebGLOn[property][i] === platform[property].toLowerCase()) {
                                result = false;
                                break;
                            }
                        }    
                    }
                }
                return result;  
            }
                
            if (Modernizr.webgl) {
                result = isWebBGLSupported();
            } else {
                result = false;
            }
            
            return result;
        },
        
        loadEphemerisEngine : function(engineName) {
            
        }
		
	}
	
})();