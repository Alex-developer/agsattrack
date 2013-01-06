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
    
    var _sat = new AGPREDICTLIB(tle0, tle1, tle2);
    var _satOrbit = new AGPREDICTLIB(tle0, tle1, tle2);
    var _satPasses = new AGPREDICTLIB(tle0, tle1, tle2);
     
    var orbit = [];
    var _orbitAge = null;
    var _calcOrbitEvery = 50;
    var _orbitCalcCounter = _calcOrbitEvery;
    var _selected = false;
    var _isDisplaying = false;
    var _orbitrequested = false;
    var _satmap = {
        'elevation' : 'sat_ele',
        'azimuth' : 'sat_azi',
        'latitude' : 'latitude',
        'longitude' : 'longitude',
        'altitude' : 'sat_alt',
        'velocity' : 'sat_vel',
        'range' : 'sat_range',
        'footprint' : 'fk',
        'type' : 'ephem',
        'visibility' : 'visibility',
        'rangerate' : 'sat_range_rate',
        'orbitalphase' : 'ma256',
        'next_aos' : 'next_aos',
        'x' : 'sat_x',     
        'y' : 'sat_y',     
        'z' : 'sat_z'     
    };
    var _passes = null;
       
    function calculateOrbit(observer) {
        _orbitrequested = false;
        
        if (_orbitAge !== null && Date.DateDiff('s', new Date(), _orbitAge) < 60) {
            jQuery(document).trigger('agsattrack.updateinfo', {text: 'Orbit request For ' + _sat.sat[0].name + ' ignored'});
            return;
        }
        
        _satOrbit.configureGroundStation(observer.getLat(), observer.getLon());
        
        if (_sat.next_aos && _sat.next_los) {
            var date = new Date(); 
                       
            var period = ((1440 / _sat.sat[0].meanmo) + 0.5) * 60;
            var step = period / 800;            
            
            if (_sat.elevation > 0) {
                date = new Date();
                do {
                    var time = (date.getTime() - 315446400000) / 86400000;
                    _satOrbit.doCalc(time);                    
                    date = Date.DateAdd('s', -step, date);    
                }  while (_satOrbit.elevation > 0);
            } else {
                orbit = [];
                date = new Date();            
            }
            
            for (var i=0; i <= 800; i++) {
                var time = (date.getTime() - 315446400000) / 86400000;
                _satOrbit.doCalc(time);
                var orbitdata = {
                    x: _satOrbit.sat_x,
                    y: _satOrbit.sat_y,
                    z: _satOrbit.sat_z,
                    el: _satOrbit.elevation,
                    az: _satOrbit.azimuth,
                    date: date
                };
                orbit.push(orbitdata);
                date = Date.DateAdd('s', step, date);         
            }        
        }
        _orbitAge = new Date();
        
        jQuery(document).trigger('agsattrack.updateinfo', {text: 'Calculating Orbit Complete For ' + _sat.sat[0].name});

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
        
        requestOrbit : function() {
            _orbitrequested = true;    
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
                            
        },
        
		getName: function() {
            return _sat.sat[0].name;
		},
		getNoradId : function() {
            return _sat.sat[0].catnum;
        },

		calc: function(date, observer) {
			if (typeof date === 'undefined') {
				var date = new Date();				
			}
            _sat.configureGroundStation(observer.getLat(), observer.getLon());

            _sat.doCalc();
            
            if (_orbitrequested) {
                calculateOrbit(observer);    
            }
            _orbitCalcCounter++;
            if (_orbitCalcCounter >= _calcOrbitEvery) {
                _sat.FindAOS();              
                _sat.FindLOS();              
                _orbitCalcCounter = 0;
                _sat.doCalc(); // TODO: Fix this. Its here to reset the values after the AOS calcs
            }


		},
        
        getNextEvent : function(returnRaw) {
            var event;
            var raw = {};
            
            if (typeof returnRaw === 'undefined') {
                returnRaw = false;
            }
            if (_sat.AosHappens()) {
                if (_sat.sat_ele >= AGSETTINGS.getAosEl()) {
                    event = 'LOS: ' + AGUTIL.shortdate(_sat.next_los); 
                    raw.event = 'LOS';
                    raw.eventlong = 'Loss Of Satellite';
                    raw.time = AGUTIL.shortdatetime(_sat.next_los, true);   
                } else {
                    if (_sat.next_aos) {
                        event = 'AOS: ' + AGUTIL.shortdate(_sat.next_aos);    
                        raw.event = 'AOS';
                        raw.eventlong = 'Aquisition Of Satellite';
                        raw.time = AGUTIL.shortdatetime(_sat.next_aos, true); 
                    } else {
                        event = 'N/A';
                        raw.event = 'N/A';
                        raw.eventlong = 'Not Available';
                        raw.time = '';                         
                    }
                }
            } else {
                event = 'Never';
                raw.event = 'Never';
                raw.eventlong = 'Never Visible';
                raw.time = '';                 
            }
            if (returnRaw) {
                return raw;    
            }
            return event;  
        },
        
        aosHappens : function() {
            return _sat.AosHappens();    
        },
        
		getOrbitData : function() {
			return orbit;
		},
		calculateOrbit: function(observer) {
			calculateOrbit(observer);
		},
        
        calculateTodaysPasses : function(observer) {
            _satPasses.configureGroundStation(observer.getLat(), observer.getLon());
            _passes = _satPasses.getTodaysPasses();            
        },
        
        getTodaysPasses : function() {
            return _passes;
        }
	
	}
};

AGSATELLITE.getFiles = function() {
    return ['/js/classes/spmengines/predictlib/predictlib.js'];
}


var clone = (function(){ 
  return function (obj) { Clone.prototype=obj; return new Clone() };
  function Clone(){}
}());