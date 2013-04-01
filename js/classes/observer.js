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
* Last Checked: 01/04/2013
* 
*/
/*global AGSETTINGS */

var AGOBSERVER = function(index) {
    'use strict';
    
    var _lat = 0; // The observers latitude
    var _lon = 0; // The observers longitude
    var _alt = 0; // The observers altitude
    
	var _name = 'Home'; // The observers name
	var _ready = false; // Flag indicating if we have geo location data
    var _autoGeo = true;
    var _index = index;
    var that = this;
    
    function geoLocate() {
        _ready = false;
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
    } 
        
	return {
	
		init : function(settings) {
            
            if (settings !== null) {
                _autoGeo = settings.auto;
                _lat = settings.lat;
                _lon = settings.lon;
                _alt = settings.alt;
                _name = settings.name;    
            }
       
            /**
            * If the browser has geolocation capabilitis then get the users current position.
            * NOTE: This will not be accurate but will give a rough idea for the users location. Also if the
            * user cancels the request then we just use 0,0,0 - the defaults.
            * 
            * Once the geolocation data is available, or fails an event is fired to notify other area of the app
            * that an observer is now available.
            */
            if (_autoGeo) {
                geoLocate();
            } else {
                _ready = true;
                /**
                * Delay the trigegr to allow time for the rest of the UI to be built
                */
                jQuery(document).delayedTrigger(1000, 'agsattrack.locationAvailable', that);                
            }
            return this;
		},
		
		isReady : function() {
			return _ready;
		},
		
        doGeoLocate: function() {
            geoLocate();
        },
                
        /**
        * Getter and setter for using the browsers inbuilt Geo Location
        * service to find the users location.
        */        
        setAutoGeo: function(name) {
            _autoGeo = name;
        },
        getAutoGeo: function() {
            return _autoGeo;
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
	};
};


AGOBSERVER.types = {
    HOME : 0,
    MUTUAL : 1
};