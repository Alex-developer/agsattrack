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
* Last Checked: 09/03/2014
* 
*/
/*jslint white: true, nomen: true */
/*global document, jQuery, AGTLES, AGPLANETS, AGVIEWS, AGSETTINGS, Cesium, AGUI, AGOBSERVER */

var Agsattrack = function() {
	'use strict';

    var _observers = [];
	var _tles = new AGTLES();
	var _ui = null;
	var refreshCounter = 0;
	var refreshInterval = 1;
	var _planets = new AGPLANETS();
	var _initComplete = false; // Don't like this
	var _speed = 1;
	var _following = null;
    var _clock = null;

    function createClock() {
        _clock = new Cesium.Clock({
            startTime : Cesium.JulianDate.now(),
            currentTime : Cesium.JulianDate.now(),
            stopTime : Cesium.JulianDate.fromIso8601('2030-01-01'),
            clockRange : Cesium.ClockRange.UNBOUNDED,
            clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
        });
    }

	function bindEvents() {	

        jQuery(document).bind('agsattrack.tlesloaded', function() {
            _ui.updateInfoPane();
        });
        jQuery(document).bind('agsattrack.satsselected', function() {
            _ui.updateInfoPane();
        });        
        
		/**
		 * Listen for an event to load a new set of elements
		 */
		jQuery(document).bind('agsattrack.loadelements', function(event, params) {
			_tles.load(params.filename);
		});

		/**
		 * Listen for an event indicating the observer position is now set. After it is
		 * start the calculation loop.
		 * TODO: Don't like the use of _initComplete in here. This is needed to stop the
		 * agsattrack.changeview event from firing a calculation before an observer is 
		 * available. This is event is fired when the UI tabs are created.
		 *  
		 */
		jQuery(document).bind('agsattrack.locationAvailable', function() {
			_initComplete = true;
			calculationLoop();		
		});

		jQuery(document).bind('agsattrack.locationUpdated', function() {
			_initComplete = true;
			calculationLoop();		
		});
		
		jQuery(document).bind('agsattrack.satclicked', function(event, params) {
            var index = _tles.getSatelliteIndex(params.catalogNumber);
            if (index !== -1) {
                if (typeof params.state !== 'undefined') {
                    _tles.getSatellite(index).setSelected(params.state);                    
                } else {
                    var toggleSat = _tles.getSatellite(index);
                    if (typeof toggleSat !== 'undefined') {
                        toggleSat.toggleSelected();    
                    } else {
                    }
                }
                
                var sat = _tles.getSatellite(index);
                if (sat.getSelected()) {
                    sat.requestOrbit();
                    var name = sat.getName();
                    _ui.updateInfo('Orbit Requested For ' + name);
                }
                
                var _selected = _tles.getSelected();
			    calculate(true);
			    jQuery(document).trigger('agsattrack.newsatselected', {satellites: _selected});
                _ui.updateInfoPane();
            }
		});

		jQuery(document).bind('agsattrack.forceupdate', function(event) {
			calculate(true);
		});
	}
	
	/**
	 * calculate the position of all selected satellites. At a regular interval fire an
	 * event to let others know that new data is available.
	 * 
	 */
	function calculationLoop() {

        function updateTime() {
            updateTimeInToolbar();
            setTimeout(updateTime, 1000);
        }
        setTimeout(updateTime, 1000);
        		
		function calc() {
			calculate(false);
			setTimeout(calc, AGSETTINGS.getRefreshTimerInterval());
		}
		setTimeout(calc, AGSETTINGS.getRefreshTimerInterval());
	}

    function updateTimeInToolbar() {
        if (AGSETTINGS.getHaveWebGL()) {
            jQuery('#currenttime').html(Cesium.JulianDate.toDate(_clock.currentTime).toString());
        }
 
    }
    
	function calculate(forceRefresh) {
		var julianDate;

        _ui.updateStatus('Calculating');
        
		julianDate = _clock.currentTime;

        _planets.update(julianDate, _observers[0]);
		
		if (_tles.getTotalDisplaying() > 0) {
            var activeView = AGVIEWS.getCurrentView();
            if (typeof activeView.instance !== 'undefined' && typeof activeView.instance.calculate === 'function') {  // TODO: Move this
                activeView.instance.calculate(_observers[0], _observers[1]);    
            } else {
                var date = new Date();
                _tles.calcAll(date, _observers[0], _observers[1]);
            }
            
			refreshCounter++;
			if (refreshCounter >= refreshInterval || forceRefresh) {
				refreshCounter = 0;
				jQuery(document).trigger('agsattrack.updatesatdata', {});
			}
		} else {
			jQuery(document).trigger('agsattrack.updatesatdata', {});
		}

        _ui.updateStatus('Idle');
    
    }

    function setSelected(index) {
        _tles.getSatellite(index).setSelected(true);        
    }
    
	return {

	    getClock : function() {
	        return _clock;
        },
		getPlanets: function() {
			return _planets.getPlanets();
		},

        setFollowing : function(satellite) {
            _following = satellite;
            jQuery(document).trigger('agsattrack.newfollowing', {satellites: _following});
            if (_following !== null) {
                _ui.updateStatusFollowing('<strong>Following:</strong> ' + _following.getName());   
            } else {
                _ui.updateStatusFollowing('<strong>Following:</strong> NONE');   
            }
        },
        
        getFollowing : function() {
            return _following;    
        },
        
		getDisplaying : function() {
            return _tles.getDisplaying();
        },
		
		getTles : function() {
			return _tles;
		},

		getSatellites : function() {
			return _tles.getSatellites();
		},

		getSatellite : function(index) {
			return _tles.getSatellite(index);
		},

        getSatelliteIndex : function(name) {
            return _tles.getSatelliteIndex(name);
        },
        
        getSatelliteByName : function(name) {
            var index = _tles.getSatelliteIndex(name);
            return _tles.getSatellite(index);
        },

		getObservers : function() {
			return _observers;
		},

        getObserver : function(type) {
            return _observers[type];
        },
        		
        getUI : function() {
            return _ui;    
        },

        calculate: function(forceRefresh) {
            calculate(forceRefresh);
        },

		init : function() {
			var _active = 0;
			
            bindEvents();

            createClock();

            /**
             * Fire up the user Inerface
             */
            _ui = new AGUI();

            AGVIEWS.switchView(AGVIEWS.getCurrentViewName());  
            
            AGVIEWS.resizeLayout();
            
            _observers[0] = new AGOBSERVER(AGOBSERVER.types.HOME).init(AGSETTINGS.getObserver());
            _observers[1] = new AGOBSERVER(AGOBSERVER.types.MUTUAL).init(AGSETTINGS.getMutualObserver());

		}
	};
};