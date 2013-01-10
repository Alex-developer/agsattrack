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
var agsattrack = function() {
	'use strict';

	var _observers = [];
	var _tles = new AGTLES();
	var ui = null;
	var refreshCounter = 0;
	var refreshInterval = 1;
	var _planets = new AGPLANETS();
	var _initComplete = false; // Don't like this
	var _speed = 1;
	var _following = null;
    
	/**
	 * Shim to support animation frames
	 */
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| window.msRequestAnimationFrame || function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();
	
    
	function bindEvents() {	

        jQuery(document).bind('agsattrack.tlesloaded', function(event, params) {
            ui.updateInfoPane();
        });
        jQuery(document).bind('agsattrack.satsselected', function(event, params) {
            ui.updateInfoPane();
        });        
        
		/**
		 * Listen for an event to load a new set of elements
		 */
		jQuery(document).bind('agsattrack.loadelements', function(event, params) {
			_tles.load(params.filename);
		});
		
		/**
		 * Listen for the view being changed. When the view changes stop the current
		 * view from rendering and start the new view rendering.
		 */
		jQuery(document).bind('agsattrack.changeview', function(event, view) {
	
            var _views = AGVIEWS.getViews();
            
			jQuery.each(_views, function(view, options) {
				if (options.active) {
					options.active = false;
					options.instance.stopRender();
				}
			});
	
			_views[view].active = true;
			_views[view].instance.startRender();
	
			if (_initComplete) {
				calculate(true);
			}
		});


		/**
		 * Listen for an event indicating the observer position is now set. After it is
		 * start the calculation loop.
		 * TODO: Don't like the use of _initComplete in here. This is needed to stop the
		 * agsattrack.changeview event from firing a calculation before an observer is 
		 * available. This is event is fired when the UI tabs are created.
		 *  
		 */
		jQuery(document).bind('agsattrack.locationAvailable', function(event, params) {
			_initComplete = true;
			calculationLoop();		
		});

		jQuery(document).bind('agsattrack.locationUpdated', function(event, params) {
			_initComplete = true;
			calculationLoop();		
		});
		
		jQuery(document).bind('agsattrack.satclicked', function(event, params) {
            var index = _tles.getSatelliteIndex(params.catalogNumber);
            if (typeof params.state !== 'undefined') {
                _tles.getSatellite(index).setSelected(params.state);                    
            } else {
                _tles.getSatellite(index).toggleSelected();
            }
            
            var sat = _tles.getSatellite(index);
            if (sat.getSelected()) {
                sat.requestOrbit();
                var name = sat.getName();
                jQuery(document).trigger('agsattrack.updateinfo', {text: 'Orbit Requested For ' + name});
            }
            
            var _selected = _tles.getSelected();
			calculate(true);
			jQuery(document).trigger('agsattrack.newsatselected', {satellites: _selected});
            ui.updateInfoPane();
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
		
		function calc() {
			calculate(false);
			setTimeout(calc, AGSETTINGS.getRefreshTimerInterval());
		}
		setTimeout(calc, AGSETTINGS.getRefreshTimerInterval());
	}

	function calculate(forceRefresh) {
		var julianDate;

        jQuery(document).trigger('agsattrack.updatestatus', {text: 'Calculating'});
        
        if (AGSETTINGS.getHaveWebGL()) {
            var cDate = new Cesium.JulianDate();
            julianDate = cDate.getJulianDayNumber() + cDate.getJulianTimeFraction();            
        } else {
            julianDate = Date.Date2Julian(new Date());
        }
            		
		_planets.update(julianDate, _observers[0]);
		
		if (_tles.getTotalDisplaying() > 0) {
            var activeView = AGVIEWS.getCurrentView();
            if (typeof activeView.instance.calculate === 'function') {
                activeView.instance.calculate(_observers[0]);    
            } else {
			    var date = new Date();
			    _tles.calcAll(date, _observers[0]);
            }
            
			refreshCounter++;
			if (refreshCounter >= refreshInterval || forceRefresh) {
				refreshCounter = 0;
				jQuery(document).trigger('agsattrack.updatesatdata', {});
			}
		} else {
			jQuery(document).trigger('agsattrack.updatesatdata', {});
		}

        jQuery(document).trigger('agsattrack.updatestatus', {text: 'Idle'});
    
    }
	
	
    function setSelected(index) {
        _tles.getSatellite(index).setSelected(true);        
    }
    
	return {

		getPlanets: function() {
			return _planets.getPlanets();
		},

        setFollowing : function(satellite) {
            _following = satellite;
            jQuery(document).trigger('agsattrack.newfollowing', {satellites: _following});
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
		
		init : function() {
			var _active = 0;
			
            var _views = AGVIEWS.getViews();

			/**
			 * Create instances of the views
			 */
			jQuery.each(_views, function(view, options) {
				options.instance = new window[options.classname];
				options.instance.init();
				if (options.active) {
					_active = view;
				}
			});

            /**
             * Fire up the user Inerface
             */
            ui = new AGUI();

            
			/**
			 * Setup the first observer, this will be the 'Home' observer
			 */
			_observers[0] = new AGOBSERVER().init();

			bindEvents();
			
			jQuery('#viewtabs').tabs('select',_views[_active].index);

            jQuery.each(_views, function(view, options) {
                if (typeof options.instance.postInit === 'function') {
                    options.instance.postInit();
                }
            });            
			
		}

	}

};