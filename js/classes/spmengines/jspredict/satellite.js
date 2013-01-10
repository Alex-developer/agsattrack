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
var AGSATELLITE = function(tle0, tle1, tle2) {
    'use strict';
    
    var _tle = new tle(tle0, tle1, tle2);
    var _predict = new jsPredict();
    var _sat = new sat();
    
    var orbit = [];
    var _calcOrbitEvery = 50;
    var _orbitCalcCounter = 0;
    var _selected = false;
    var _isDisplaying = false;
    
    var _tlemap = {
            
    };

    var _satmap = {
        'elevation' : 'ele',
        'azimuth' : 'azi',
        'latitude' : 'lat',
        'longitude' : 'lon',
        'altitude' : 'alt',
        'velocity' : 'vel',
        'range' : 'range',
        'footprint' : 'footprint'     
    };
        
    function calculateOrbit(observer) {
  	
    }
    
	return {
		isDisplaying: function() {
			return _isDisplaying;
		},
		setDisplaying: function(displaying) {
			_isDisplaying = displaying;
		},
        
        getSelected: function() {
            return _selected;
        },
        setSelected: function(value) {
            _selected = value;
        },
        toggleSelected : function() {
            _selected = !_selected;
            return _selected;    
        },
        
        /**
        * Get a value from the SPM
        * 
        * @param param
        */
        get : function(param) {
            
            if (_satmap[param]) {
                return _sat[_satmap[param]];
            }
            
            if (_tlemap[param]) {
                return _tle[_tlemap[param]];
            }  
                            
        },
        
		getName: function() {
			return _tle.sat_name;
		},
		getCatalogNumber : function() {
			return _tle.catnum;
		},

		calc: function(date, observer) {
			if (typeof date === 'undefined') {
				var date = new Date();				
			}
            var obs = new geodetic(observer.getLat(), observer.getLon(), observer.getAlt());
            _predict.track (_tle , obs, _sat, _predict.current_daynum());
		},
		getOrbitData : function() {
			return orbit;
		},
		calculateOrbit: function(observer) {
			calculateOrbit(observer);
		}
	
	}
};

AGSATELLITE.getFiles = function() {
    return ['/js/classes/spmengines/jspredict/jspredict.js'];
}