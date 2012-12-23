var AGOBSERVER = function() {
    'use strict';
    
    var _lat = null;
    var _lon = null;
    var _alt = null;
    
	var _name = 'Home';
	var _ready = false;

    
	return {
	
		init : function() {
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
		
		setName: function(name) {
			_name = name;
		},
		getName: function() {
			return _name;
		},

		setLat: function(lat) {
			_lat = lat;
		},		
		getLat: function() {
			return _lat;
		},
		
		setLon: function(lon) {
			_lon = lon;
		},		
		getLon: function() {
			return _lon;
		},
		
		setAlt: function(alt) {
			_alt = alt;
		},		
		getAlt: function() {
			return _alt;
		},
		toString : function() {
			return 'name=' + _name + ', lat=' + _lat + ', lon=' + _lon;
		}
	}
};