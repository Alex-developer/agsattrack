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
* 
* Last Checked: 19/01/2013
* 
*/
/*jshint bitwise: true*/
/*global AGSatTrack, AGPREDICTLIB, AGSETTINGS, AGUTIL */ 
var AGSATELLITE = function(tle0, tle1, tle2) {
    'use strict';
    
    var _sat = new AGPREDICTLIB(tle0, tle1, tle2);
    var _satOrbit = new AGPREDICTLIB(tle0, tle1, tle2);
    var _satPasses = new AGPREDICTLIB(tle0, tle1, tle2);
     
    var orbit;
    var _nextPass;
    var _orbitAge;
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
        'z' : 'sat_z',
        'epoc' : 'sat_epoch' ,
        'orbitnumber' : 'rv',
        'signaldelay' : 'signaldelay',
        'signalloss' : 'signalloss',
        'dopplershift' : 'dopplershift'   
    };
    var _passes = null;
    var _passesCache;
    var _duration = 0;
   
    /**
    * Calculate and cache the next pass for this satellite
    */
    function getNextPass(observer) {
        var date = new Date();
        
        if (typeof _passesCache[0] === 'undefined') {
            _passesCache[0] = getPass(observer);    
        }
        if (date > _passesCache[0].losTime) {
            _passesCache[0] = getPass(observer);    
        }
        return _passesCache[0];
    }
    
    /**
    * Calculate and cache the pass for a specific time
    */    
    function getPassforTime(observer, time) {
        var pass = null;
        for (var i=0; i < _passesCache.length; i++) {
            if (_passesCache[i].aosTime.toString() === time.toString()) {
                pass = _passesCache[i];
                break;    
            }
        }
        if (pass === null) {
            pass = getPass(observer, time);
            _passesCache.push(pass);    
        }
        return pass;
    }   
    
    /**
    * Calculate a pass   
    */
    function getPass(observer, time) {
        var date = new Date(); 
        var startDate = new Date(); 
        var passData = {
            pass: [],
            aosTime: null,
            losTime: null,
            maxEle: 0,
            orbitNumber: 0
        };
        var backTrack = false;
        
        passData.pass = [];
        
        if (typeof time === 'undefined') {
            time = (date.getTime() - 315446400000) / 86400000;  
            backTrack = true;  
        } else {
            time = (time.getTime() - 315446400000) / 86400000;    
        }
        if (_satOrbit.AosHappens(0) && _satOrbit.Geostationary(0) === 0 && _satOrbit.Decayed(0, time) === 0) {
            _satOrbit.configureGroundStation(observer.getLat(), observer.getLon());
            _satOrbit.PreCalc(0);
            
            _satOrbit.doCalc(time);
            if (_satOrbit.elevation >= 0 && backTrack) {
                while (_satOrbit.elevation >= 0) {
                    time -= 0.007;
                    _satOrbit.doCalc(time);   
                }
            }
            _satOrbit.daynum = time;
            var aos = _satOrbit.FindAOS();
            if (aos !== 0.0) {
                passData.orbitNumber = _satOrbit.rv;                
                passData.orbit = [];
                passData.aosTime = _satOrbit.Daynum2Date(aos);
                passData.aosDayNum = aos;
                _satOrbit.doCalc(aos);

                time = aos;
                while (_satOrbit.elevation >= 0) {
                    _satOrbit.doCalc(time);
                    var orbitdata = {
                        x: _satOrbit.sat_x,
                        y: _satOrbit.sat_y,
                        z: _satOrbit.sat_z,
                        el: _satOrbit.elevation,
                        az: _satOrbit.azimuth,
                        footprint: _satOrbit.fk,
                        viz: _satOrbit.visibility,
                        range: _satOrbit.sat_range,
                        date: _satOrbit.Daynum2Date(time),
                        signaldelay: _satOrbit.signaldelay,
                        signalloss: _satOrbit.signalloss,
                        dopplershift: _satOrbit.dopplershift
                    };
                    passData.pass.push(orbitdata);
                    time += (0.00035); // 30 Seconds
                    if (_satOrbit.elevation > passData.maxEle) {
                        passData.maxEle = _satOrbit.elevation;  
                    }
                }
                passData.losTime = _satOrbit.Daynum2Date(_satOrbit.daynum);
                passData.losDayNum = _satOrbit.daynum;
                passData.duration = (passData.losTime - passData.aosTime) / 1000;                
            }
            var endDate = new Date();
            passData.calcTime = endDate - startDate;
        }
        return passData;
    }

    /**
    * Calculate the satellites orbit.
    */
    function calculateOrbit(observer) {
        var date = new Date();
        var time;
        _orbitrequested = false;
        var startDate = new Date();
        var orbitPoints = [];
        var increment = 0.00035;
        var i;
        
        increment = increment * 3;
        
        AGSatTrack.getUI().updateInfo('Calculating Orbit For ' + _sat.sat[0].name + ' Started');
        
        /**
        * Only rebuild the orbit data every 60 seconds
        */
        if (_orbitAge !== null && Date.DateDiff('s', new Date(), _orbitAge) < 60) {
            AGSatTrack.getUI().updateInfo('Orbit request For ' + _sat.sat[0].name + ' ignored');
            return;
        }
        
        /**
        * Initialise the orbit model
        */
        _satOrbit.configureGroundStation(observer.getLat(), observer.getLon());
        time = (date.getTime() - 315446400000) / 86400000;


        _satOrbit.doCalc(time);
        var thisOrbit = _satOrbit.orbitNumber;

        /**
        * Jump back to the end of the previous orbit
        */
        while (thisOrbit === _satOrbit.orbitNumber) {
            time -= increment;
            _satOrbit.doCalc(time);
        }
        
        /**
        * Add a little time to get us back onto the right orbit
        */
        time += increment;
        _satOrbit.doCalc(time);
        
        /**
        * Add points at 20 second intervals whilst we are on the same orbit
        */
        while (thisOrbit === _satOrbit.orbitNumber) {
            addPoint(time, orbitPoints);   
            time += increment;
        }
        
        /**
        * FUDGE: No idea why but the orbits are not closed. A few additional points are
        * required to complete the orbit.
        */
        for (i=i;i<20;i++) {
            addPoint(time, orbitPoints);   
            time += increment;            
        }                    
        _orbitAge = new Date();
        var endDate = new Date();
        
        orbit = {
            points: orbitPoints,
            calcTime: endDate - startDate,
            orbitNumner: thisOrbit
        };
        AGSatTrack.getUI().updateInfo('Calculating Orbit Complete For ' + _sat.sat[0].name);

    }
    
    /**
    * Add a point to the orbit data
    */
    function addPoint(time, orbitPoints) {
        _satOrbit.doCalc(time);
        var orbitdata = {
            x: _satOrbit.sat_x,
            y: _satOrbit.sat_y,
            z: _satOrbit.sat_z,
            el: _satOrbit.elevation,
            az: _satOrbit.azimuth,
            date: _satOrbit.Daynum2Date(time),
            signaldelay: _satOrbit.signaldelay,
            signalloss: _satOrbit.signalloss,
            dopplershift: _satOrbit.dopplershift            
        };
        orbitPoints.push(orbitdata);         
    }
    
    function reset() {
        orbit = {
            calcTime: 0,
            points: [],
            orbitNumner: 0
        };
        _nextPass = {
            pass: [],
            aosTime: null,
            losTime: null,
            maxEle: 0,
            orbitNumber: 0
        };
        _orbitAge = null;
        _passes = null;
        _passesCache = [];                
    } 
    reset();
    
    function calc(date, observer) {
        var startTime = new Date();
        
        if (typeof date === 'undefined') {
            date = new Date();                
        }
        _sat.configureGroundStation(observer.getLat(), observer.getLon());
        _satOrbit.configureGroundStation(observer.getLat(), observer.getLon());

        _sat.doCalc();
        
        if (_orbitrequested) {
            calculateOrbit(observer);    
        }
        
        if (AGSETTINGS.getCalculateEvents()) {
            _orbitCalcCounter++;
            if (_orbitCalcCounter >= _calcOrbitEvery) {
                _sat.FindAOS();              
                _sat.FindLOS();              
                _orbitCalcCounter = 0;
                _sat.doCalc(); // TODO: Fix this. Its here to reset the values after the AOS calcs
            }
        }

        if (_selected) { // TODO: bad code don't need to recalc this every time
            getNextPass(observer);                
        }
        var endTime = new Date();
        _duration = endTime - startTime;
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
		getCatalogNumber : function() {
            return _sat.sat[0].catnum;
        },

		calc: function(date, observer) {
            calc(date, observer)
        },
        
        getNextEvent : function(returnRaw) {
            var event = '';
            var raw = {
                event:  'N/A',
                eventlong: 'Not Available',
                time: new Date()
            };
            
            if (typeof returnRaw === 'undefined') {
                returnRaw = false;
            }
            if (_sat.AosHappens()) {
                if (_sat.sat_ele >= AGSETTINGS.getAosEl()) {
                    if (typeof _sat.next_los !== 'undefined') {
                        event = 'LOS: ' + AGUTIL.shortdate(_sat.next_los); 
                        raw.event = 'LOS';
                        raw.eventlong = 'Loss Of Satellite';
                        raw.time = AGUTIL.shortdatetime(_sat.next_los, true);
                    }
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
            return _passes;
        },
        
        getTodaysPasses : function() {
            return _passes;
        },
        
        clearCache : function() {
            reset();
            var observers = AGSatTrack.getObservers();
            var observer = observers[0];
            var date = new Date();
            calc(date, observer);               
        },
        
        getNextPass : function() {
            return _passesCache[0];    
        },

        getPassCache : function() {
            return _passesCache;    
        },
                 
        getPassforTime: function(observer, time) {
            return getPassforTime(observer, time);
        },
        
        isGeostationary: function() {
            var result = false;
            var date = new Date();
            
            var time = (date.getTime() - 315446400000) / 86400000;  
            if (_sat.AosHappens(0) && _sat.Geostationary(0) === 0 && _sat.Decayed(0, time) === 0) {
                result = false;
            } else {
                result = true;
            }
            return result;
        },
        
        getLastcalcTime : function() {
            return _duration;
        },
        
        convertDate : function(date) {
            return _sat.Daynum2Date(date);
        }
	};
};

AGSATELLITE.getFiles = function() {
    'use strict';
        
    return ['/js/classes/spmengines/predictlib/predictlib.js'];
};