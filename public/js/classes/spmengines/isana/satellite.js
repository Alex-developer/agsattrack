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
    
    var tle = new AGTLE(tle0, tle1, tle2);
    var sgp4 = null;
    var orbitSgp4 = null;
    var orbit = [];
    var _calcOrbitEvery = 50;
    var _orbitCalcCounter = 0;
    var _selected = false;
    
    sgp4 = new SGP4(tle.getElements());
    orbitSgp4 = new SGP4(tle.getElements());
    
    function calculateOrbit(observer) {
		var date = new Date();
    	var numberOfPoints = 200;
    	
		sgp4.next_aos = '';
		
    	var period = ((1440 / tle.getElements().mean_motion) + 0.5) * 60;
    	var step = period / numberOfPoints;
    	orbit = [];
    	for (var i=0; i <= numberOfPoints; i++) {
            orbitSgp4.calc(date);
            orbitSgp4.latlng();
            orbitSgp4.look(observer.getLat(), observer.getLon(), observer.getAlt());
			var orbitdata = {
				x: orbitSgp4.x,
				y: orbitSgp4.y,
				z: orbitSgp4.z,
				el: orbitSgp4.elevation,
				az: orbitSgp4.azimuth,
				date: date
			};
			if (orbitSgp4.elevation > 0 && sgp4.next_aos === '') {
				sgp4.next_aos = date;
			}
			orbit.push(orbitdata);
    		date = Date.DateAdd('s', step, date);			
    	}    	
    }
    
	return {
		isDisplaying: function() {
			return tle.isDisplaying();
		},
		setDisplaying: function(displaying) {
			tle.setDisplaying(displaying);
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
                    		
		getName: function() {
			return tle.getName();
		},
		getCatalogNumber : function() {
			return tle.getCatalogNumber();
		},
  
        /**
        * Get a value from the SPM
        * 
        * @param param
        */
        get : function(param) {
            return sgp4[param];    
        },
        
		calc: function(date, observer) {
			if (typeof date === 'undefined') {
				var date = new Date();				
			}
			sgp4.calc(date);
			sgp4.latlng();
			sgp4.look(observer.getLat(), observer.getLon(), observer.getAlt());
            
            _orbitCalcCounter++;
            if (_orbitCalcCounter >= _calcOrbitEvery || orbit.length === 0) {
                calculateOrbit(observer);
                _orbitCalcCounter = 0;
            }
                        
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
    return ['/js/classes/spmengines/isana/sgp4.js','/js/classes/spmengines/isana/tle.js'];
}