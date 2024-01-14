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
/*global AGUTIL */ 

var AGGECODEWINDOW = function(element, params) {
    'use strict';

    var _element = element;
    var _params = params;

    var _lat = 0;
    var _lon = 0;

    var _inputElement = AGUTIL.getId();
    var _inputLat = AGUTIL.getId();
    var _inputLon = AGUTIL.getId();
    var _okButton = AGUTIL.getId();
    var _cancelButton = AGUTIL.getId();
    var _marker;
    var _map;

    var form = '<form><fieldset style="display:none"><label>Latitude</label><input id="'+_inputLat+'" name="lat" type="text" value=""><label>Longitude</label><input id="'+_inputLon+'" name="lng" type="text" value=""><label>Formatted Address</label><input name="formatted_address" type="text" value=""></fieldset></form>';  
          
    var windowHTML = '<div class="easyui-layout" data-options="fit:true"><div data-options="region:\'north\',border:false" style="text-align:right;padding:5px 0 0;">'+form+'</div><div data-options="region:\'center\'"><div id="map_canvas"></div></div><div data-options="region:\'south\',border:false" style="text-align:right;padding:10px 10px 10px 0px;"><a id="'+_okButton+'" class="easyui-linkbutton" data-options="iconCls:\'icon-ok\'" href="">Ok</a><a id="'+_cancelButton+'" class="easyui-linkbutton" data-options="iconCls:\'icon-cancel\'" href="">Cancel</a></div></div>';

    jQuery(_element).window({  
        width:800,  
        height:600,
        title: 'Select Location',  
        modal:false,
        minimizable: false,
        maximizable : false,
        content: windowHTML  
    });

    setupLocation();

    _map = L.map('map_canvas').setView([_lat, _lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(_map);
    L.Control.geocoder().addTo(_map);

    _marker = L.marker({lat: _lat, lng: _lon}).addTo(_map);

    function onMapClick(e) {
        jQuery('#' + _inputLat).val(e.latlng.lat);
        jQuery('#' + _inputLon).val(e.latlng.lng);

        if(_marker) {
            _map.removeLayer(_marker);
        }
        _marker = L.marker(e.latlng).addTo(_map);

    }
    
    _map.on('click', onMapClick);

    jQuery('#' + _okButton).on('click', function(e){
        
        if (typeof _params !== 'undefined' && typeof _params.success !== 'undefined') {
            var lat = jQuery('#' + _inputLat).val();    
            var lon = jQuery('#' + _inputLon).val();
            _params.success(lat, lon);
        }
        e.stopPropagation();
        e.preventDefault();
        jQuery(_element).window('close');              
    });

    jQuery('#' + _cancelButton).on('click', function(e){
        e.stopPropagation();
        e.preventDefault();
        jQuery(_element).window('close');    
    });
        
    function setupLocation() {
        _lat = 0;
        _lon = 0;        
        if (typeof _params !== 'undefined' && typeof _params.lat !== 'undefined') {
            _lat = _params.lat;
        }
        if (typeof _params !== 'undefined' && typeof _params.lon !== 'undefined') {
            _lon = _params.lon;
        }
        jQuery('#' + _inputElement).val(_lat + ',' + _lon);
        jQuery('#' + _inputElement).trigger('geocode');     
    }
                                                  
    return {
        init : function(params) {
            _params = params;
            setupLocation();
            jQuery(_element).window('open');
        }    
    };
};