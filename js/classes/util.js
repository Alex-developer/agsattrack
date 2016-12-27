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
	
    var _elementCounter = 0;
    
    function extractDomain(url) {
        var domain;
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        domain = domain.split(':')[0];

        return domain;
    }
    
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
    
    function degToRad(deg) {
        return  deg * (Math.PI / 180);
    }

    function radToDeg(rad) {
        return  rad * 180 / Math.PI;;
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
        
        usShortdatetime : function(date, hideDate, forceHidedate) {
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
                shortDate += pad(date.getMonth()+1,2) + '/';
                shortDate += pad(date.getDate(),2) + '/';
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
        
        degToRad : function(deg) {
            return degToRad(deg);
        },
        
        loadEphemerisEngine : function(engineName) {
        },
        
        getDistance : function(lat1, lon1, lat2, lon2) {
            var distance, c, a, dLat, dLon;        
            var R = 6372.795;
    
            dLat = degToRad(lat2)-degToRad(lat1);
            dLon = degToRad(lon2)-degToRad(lon1); 
            a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2); 
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            distance = R * c;            
            
            AGUTIL.getBearing(lat1, lon1, lat2, lon2);
            return distance;
        },
        
        getBearing : function(lat1, lon1, lat2, lon2) {
            lat1 = degToRad(lat1);
            lon1 = degToRad(lon1);
            lat2 = degToRad(lat2);
            lon2 = degToRad(lon2);            
            var dLat = lat2 - lat1;
            var dLon = lon2 - lon1; 
            
            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1)*Math.sin(lat2) -
                    Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
            var brng = Math.atan2(y, x);
            brng = radToDeg(brng);
            brng = (brng+360) % 360;        
            
            return brng;
        },
        
        getId : function() {
            return 'agel' + ++_elementCounter;
        },
        
        getBingAPIKey: function() {
            var url = jQuery(location).attr('href');
            var domain = extractDomain(url);
            var bingAPIKey = '';
            
            switch (domain) {
                case 'agsattrack.local':
                        bingAPIKey = 'AoHuWQz4dkEfjs9GIOYCRDM7_qyrOdxXmauJ6VAKEIbKKAAq-qJ5abmczHUzNFpb';
                    break;

                case 'agsattrack.com':
                        bingAPIKey = 'AkU8YjZ3dvP_fyNkibv_UYfvvlfjuXYzVsWe9ccbYiSy8xXMrroZsq0YQJnGbrFG';
                    break;                    
            }
            
            return bingAPIKey;           
        },
        
        getGoogleAPIKey: function() {
            var url = jQuery(location).attr('href');
            var domain = extractDomain(url);
            var googleAPIKey = '';
            
            switch (domain) {
                case 'agsattrack.local':
                        googleAPIKey = 'AIzaSyD7f7EL14920SOzJuYlDF4uNwEH96ZgkI8';
                    break;

                case 'agsattrack.com':
                        googleAPIKey = 'AIzaSyCi-oli_O0tYnN0bAGlNpPIjtPOr4pvLx8';
                    break;                    
            }
            
            return googleAPIKey;           
        }        
        
        
        
        
	};
	
})();