var AGSATELLITE = function(tle0, tle1, tle2) {
    'use strict';
    
    var tle = new AGTLE(tle0, tle1, tle2);
    var sgp4 = null;
    var orbitSgp4 = null;
    var orbit = [];
    var _calcOrbitEvery = 50;
    var _orbitCalcCounter = 0;
    
    sgp4 = new SGP4(tle.getElements());
    orbitSgp4 = new SGP4(tle.getElements());
    
	var ORBITTYPES = {
			'unknown' : 0,
			'geostationary' : 1
		};
	
	tle.getElements().orbit_type = ORBITTYPES.unknown;
    if (isGeoStationary()) {
    	tle.getElements().orbit_type = ORBITTYPES.geostationary;    	
    } else {
    	
    }
    
    function isGeoStationary() {
    	if ( (tle.getElements().orbit_type.mean_motion - 1.0027) < 0.0002) {
    		return true;
    	} else {
    		return false;
    	}
    }
    
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
		getName: function() {
			return tle.getName();
		},
		getNoradId : function() {
			return tle.getNoradId();
		},
		getData: function() {
			return sgp4;
		},
		calc: function(date, observer) {
			if (typeof date === 'undefined') {
				var date = new Date();				
			}
			sgp4.calc(date);
			sgp4.latlng();
			sgp4.look(observer.getLat(), observer.getLon(), observer.getAlt());
		},
		getOrbitData : function() {
			return orbit;
		},
		calculateOrbit: function(observer) {
			calculateOrbit(observer);
		},
		calculateOrbitDelayed : function(observer) {
		    _orbitCalcCounter++;
		    if (_orbitCalcCounter >= _calcOrbitEvery || orbit.length === 0) {
		    	calculateOrbit(observer);
		    	_orbitCalcCounter = 0;
		    }
		}
	
	}
}