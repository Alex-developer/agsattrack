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
var AGLISTVIEW = function() {
	'use strict';
	
	var _render = false;
	var _calcAoS = true;
	
	/**
	 * Listen for an event telling us a new set of elements were loaded
	 */
	jQuery(document).bind('agsattrack.tlesloaded', function(event, group) {
		if (_render) {
			buildTable();
		}
	});
	
	/**
	 * Listen for an event telling us that new satellite propogation values are
	 * available.
	 */
	jQuery(document).bind('agsattrack.updatesatdata', function(event) {
		if (_render) {
			buildTable();
		}
	});
	
	/**
	 * Listen for event telling us to stop or start calculating AoS times. This event
	 * will normally be triggered by the ribbon or settings being changed.
	 */
	jQuery(document).bind('agsattrack.showaos', function(event, state) {
		_calcAoS = state;
		if (_render) {
			buildTable();
		}
	})	
	
    /**
    * Reset the view
    */
    jQuery(document).bind('agsattrack.resetview',
            function(e, observer) {
                if (_render) {
                    AGSatTrack.getTles().resetAll();
                }
            });        
	
	/**
	 * Rebuild the table of satellites
	 */
	function buildTable() {
		jQuery('#listviewdata').html('');
		
		var satellites = AGSatTrack.getDisplaying();
		
		var html = '';
		jQuery.each(satellites, function(index, satellite) {
				
			var rowCSSArray = ['listviewsat'];
			if (_calcAoS) {
				var observer = AGSatTrack.getObservers()[0];
				satellite.calculateOrbitDelayed(observer);
				var data = satellite.getData();
				var rowCSS = '';
				if (data.elevation.toFixed(0) > AGSETTINGS.getAosEl()) {
					rowCSSArray.push('green');
				}
			} else {
				var data = satellite.getData();					
			}
			if (satellite.getSelected()) {
				rowCSSArray.push('bold');
			}				
			rowCSS = 'class="' + rowCSSArray.join(' ') + '"';

			
			html += '<tr ' + rowCSS + ' ' + 'id="satlist' + index + '">';
			html += '<td>' + satellite.getName() + '</td>';
			html += '<td>' + satellite.getNoradId() + '</td>';
			html += '<td>' + data.azimuth.toFixed(2) + '&deg;</td>';
			html += '<td>' + data.elevation.toFixed(2) + '&deg;</td>';
			html += '<td>' + AGUTIL.convertDecDegLat(data.latitude) + '&deg;</td>';				
			html += '<td>' + AGUTIL.convertDecDegLon(data.longitude) + '</td>';	
			html += '<td>' + data.altitude.toFixed(0) + '</td>';
			html += '<td>' + data.velocity.toFixed(0) + '</td>';
			if (_calcAoS) {
				html += '<td>' + AGUTIL.shortdate(data.next_aos) + '</td>';
			} else {
				html += '<td></td>';
			}
			html += '</tr>';
		});
		jQuery('#listviewdata').html(html);
		jQuery('.listviewsat').on('click',{}, function(e){
			var selected = parseInt(jQuery(this).attr('id').replace('satlist',''));
			jQuery(document).trigger('agsattrack.satclicked', {index: selected});			
		});		
	}
	
	
	
	return {
		startRender : function() {
			_render = true;
			buildTable();
		},
		
		stopRender : function() {
			_render = false;			
		},
		
		init : function() {
            
		}
	}
}