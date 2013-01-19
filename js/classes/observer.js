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
* Last Checked: 19/01/2013
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
    
    function showGeoWindow() {
        var that = this; // JSHint - This is ok
        
        jQuery('#geowindow').remove();
        var form = '<form><input id="geocomplete" type="text" placeholder="Type in an address" value="'+_lat+','+_lon+'" /><input id="find" type="button" value="find" /><div class="map_canvas"></div><fieldset style="display:none"><label>Latitude</label><input name="lat" type="text" value=""><label>Longitude</label><input name="lng" type="text" value=""><label>Formatted Address</label><input name="formatted_address" type="text" value=""></fieldset></form>';  
                
        var window = jQuery('<div id="geowindow"><div><img width="14" height="14" src="/images/geo.png" alt="" /> Select Location</div><div><div><div>'+form+'</div></div><div><div style="float: right; margin-top: 15px;"><input type="button" id="ok" value="OK" style="margin-right: 10px" /><input type="button" id="cancel" value="Cancel" /></div></div></div></div>');
        jQuery(document.body).append(window);
              
        window.jqxWindow({ maxHeight: 640, maxWidth: 840, minHeight: 640, minWidth: 840, height: 640, width: 840,
            resizable: false, isModal: true, modalOpacity: 0.3,
            okButton: jQuery('#ok'), cancelButton: jQuery('#cancel'),
            initContent: function () {
                jQuery('#ok').jqxButton({width: '65px' });
                jQuery('#cancel').jqxButton({width: '65px' });
                
                jQuery('#geocomplete').geocomplete({
                    map: '.map_canvas',
                    details: 'form',
                    markerOptions: {
                        draggable: true
                    }
                });
            }
        });
        
        jQuery('#find').click(function(){
            jQuery('#geocomplete').trigger('geocode');
        }).click();
        
        jQuery('#geocomplete').bind('geocode:dragged', function(event, latLng){
            jQuery('input[name=lat]').val(latLng.lat());
            jQuery('input[name=lng]').val(latLng.lng());
        }); 

        window.on('close', function (event) {
            if (event.args.dialogResult.OK) {
                jQuery('#observerlatitude').val(jQuery('input[name=lat]').val());
                jQuery('#observerlongitude').val(jQuery('input[name=lng]').val());
                jQuery('#options-save').enable();              
            }
        
        });   
    }

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
	
		init : function() {
            
            var settings = AGSETTINGS.getObserver(_index);
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
                var that = this;
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
        doGeoLocate: function() {
            geoLocate();
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
        
        showGeoWindow : function() {
            showGeoWindow();    
        },
        
        /**
        * Return a string representation of the observer
        */
		toString : function() {
			return 'name=' + _name + ', lat=' + _lat + ', lon=' + _lon;
		}
	};
};