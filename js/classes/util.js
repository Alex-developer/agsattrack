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

/*jshint bitwise: true*/
/*global platform, Modernizr */ 
 
var AGUTIL = (function() {
    'use strict';
	
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
        
        if (!tipo) {
            tipo='N';
        }
        var deg;
        deg = v;
        if (!deg){
            return "";
        } else if (deg > 180 || deg < 0){
            // convert coordinate from north to south or east to west if wrong tipo
            return convertDecDeg(-v,(tipo==='N'?'S': (tipo==='E'?'W':tipo) ), html);
        } else {
            var gpsdeg = parseInt(deg,10);
            var remainder = deg - (gpsdeg * 1.0);
            var gpsmin = remainder * 60.0;
            var D = gpsdeg;
            var M = parseInt(gpsmin, 10);
            var remainder2 = gpsmin - (parseInt(gpsmin, 10)*1.0);
            var S = parseInt(remainder2*60.0,10);
            return pad(D,3)+symbol+' '+pad(M,2)+"' "+pad(S,2)+"'' "+tipo;
        }
    }                   
    
    function pad(num, size) {
        var s = "00" + num;
        return s.substr(s.length-size);
    }
    
	return {
        pad : function(num, size) {
            return pad(num, size);    
        },
        
        loadImages : function(sources, callback){
            var images = {};
            var loadedImages = 0;
            var numImages = 0;
            for (var src in sources) {
                if(sources.hasOwnProperty(src)) {
                    numImages++;
                }
            }
            
            var loadedFunc = function(){
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
                    
            for (src in sources) {
                if(sources.hasOwnProperty(src)) {                
                    images[src] = new Image();
                    images[src].onload = loadedFunc;
                    images[src].src = sources[src];
                }
            }
        },
        
		convertDecDegLat: function(lat,html) {
            var dir = (lat>0?'N':'S');
            lat = convertDecDeg(lat,dir,html);
            return lat;
		},
		convertDecDegLon: function(lon,html) {
            var dir = (lon>0?'E':'W');
            lon = convertDecDeg(lon,dir,html);
            return lon;
		},

        date : function(date) {
            if (date === '') {
                return '';
            }
            if (date === null) {
                return 'N/A';
            }
            var shortDate = '';
            
            shortDate += pad(date.getDate(),2) + '/';
            shortDate += pad(date.getMonth()+1,2) + '/';
            shortDate += date.getFullYear();
            return shortDate;
        },
                
		shortdate : function(date) {
			if (date === '') {
				return '';
			}
            if (date === null) {
                return 'N/A';
            }
			var shortDate = '';
			
            shortDate += pad(date.getDate(),2) + '/';
            shortDate += pad(date.getMonth()+1,2) + '/';
			shortDate += date.getFullYear() + ' ';
			shortDate += pad(date.getHours(),2) + ':';
			shortDate += pad(date.getMinutes(),2) + ':';
			shortDate += pad(date.getSeconds(),2);
			
			return shortDate;
		},
        
        shortdatetime : function(date, hideDate, forceHidedate) {
            if (date === '') {
                return '';
            }
            
            if (typeof forceHidedate === 'undefined') {
                forceHidedate = false;
            }
            var shortDate = '';
            var cDate = new Date();
            
            if ((cDate.getFullYear() === date.getFullYear() &&
                cDate.getMonth() === date.getMonth() &&
                cDate.getDate() === date.getDate() && hideDate) || forceHidedate) {
                
                shortDate = '';
            } else {
                shortDate += pad(date.getDate(),2) + '/';
                shortDate += pad(date.getMonth()+1,2) + '/';
                shortDate += date.getFullYear() + ' ';                
            }

            shortDate += pad(date.getHours(),2) + ':';
            shortDate += pad(date.getMinutes(),2) + ':';
            shortDate += pad(date.getSeconds(),2);
            
            return shortDate;
        },        
        
        shortTime : function(date) {
            var shortTime = '';
            if (date === '') {
                return '';
            }
        

            shortTime += pad(date.getHours(),2) + ':';
            shortTime += pad(date.getMinutes(),2);
            
            return shortTime;
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
                    if(disableWebGLOn.hasOwnProperty(property)) {                     
                        for (var i=0;i<disableWebGLOn[property].length;i++) {
                            if (platform[property]) {
                                if (disableWebGLOn[property][i] === platform[property].toLowerCase()) {
                                    result = false;
                                    break;
                                }
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
	};
	
})();