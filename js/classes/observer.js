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
;var AGOBSERVER = function() {
    'use strict';
    
    var _lat = 0; // The observers latitude
    var _lon = 0; // The observers longitude
    var _alt = 0; // The observers altitude
    
	var _name = 'Home'; // The observers name
	var _ready = false; // Flag indicating if we have geo location data

    
	return {
	
		init : function() {
            /**
            * If the browser has geolocation capabilitis then get the users current position.
            * NOTE: This will not be accurate but will give a rough idea for the users location. Also if the
            * user cancels the request then we just use 0,0,0 - the defaults.
            * 
            * Once the geolocation data is available, or fails an event is fired to notify other area of the app
            * that an observer is now available.
            */
			var that = this;
		    if ('geolocation' in navigator) {
		        navigator.geolocation.getCurrentPosition(
		        	function (position) {
		        		_lat = position.coords.latitude;
		        		_lon = position.coords.longitude;
		        		_alt = position.coords.altitude;
		        		_ready = true;
		        		jQuery(document).trigger('agsattrack.locationAvailable',that);
		        	},
		        	function () {
		        		_lat = 0;
		        		_lon = 0;
		        		_alt = 0;
		        		_ready = true;		        		
		        		jQuery(document).trigger('agsattrack.locationAvailable',that);
		        	}        	
		        );
		    } else {
				_lat = 0;
				_lon = 0;
				_alt = 0;
        		_ready = true;				
				jQuery(document).trigger('agsattrack.locationAvailable',that);    	
		    }
		    return this;
		},
		
		isReady : function() {
			return _ready;
		},
		
        /**
        * Getter and setter for the observers name
        */
		setName: function(name) {
			_name = name;
		},
		getName: function() {
			return _name;
		},

        /**
        * Getter and setter for observers latitude.
        */
		setLat: function(lat) {
			_lat = lat;
		},		
		getLat: function() {
			return _lat;
		},

        /**
        * Getter and setter for observers longitude.
        */		
		setLon: function(lon) {
			_lon = lon;
		},		
		getLon: function() {
			return _lon;
		},

        /**
        * Getter and setter for observers altitude.
        */
		setAlt: function(alt) {
			_alt = alt;
		},		
		getAlt: function() {
			return _alt;
		},
        
        /**
        * Return a string representation of the observer
        */
		toString : function() {
			return 'name=' + _name + ', lat=' + _lat + ', lon=' + _lon;
		}
	}
};