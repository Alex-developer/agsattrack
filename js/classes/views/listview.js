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
	var _contextMenu = null;
    
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
				var rowCSS = '';
				if (satellite.get('elevation').toFixed(0) > AGSETTINGS.getAosEl()) {
					rowCSSArray.push('green');
				}				
			}
			if (satellite.getSelected()) {
				rowCSSArray.push('highlighted');
			}				
			rowCSS = 'class="' + rowCSSArray.join(' ') + '"';

			
			html += '<tr ' + rowCSS + ' ' + 'id="' + satellite.getCatalogNumber() + '">';
			html += '<td>' + satellite.getName() + '</td>';
            html += '<td>' + satellite.get('type') + '</td>';
			html += '<td>' + satellite.get('visibility').substring(0,3) + '</td>';
			html += '<td align="right">' + satellite.get('azimuth').toFixed(2) + '&deg;</td>';
			html += '<td align="right">' + satellite.get('elevation').toFixed(2) + '&deg;</td>';
			html += '<td align="right">' + AGUTIL.convertDecDegLat(satellite.get('latitude')) + '&deg;</td>';				
			html += '<td align="right">' + AGUTIL.convertDecDegLon(satellite.get('longitude')) + '</td>';	
			html += '<td align="right">' + satellite.get('altitude').toFixed(0) + '</td>';
            html += '<td align="right">' + satellite.get('velocity').toFixed(0) + '</td>';
			
            html += '<td>' + satellite.getNextEvent() + '</td>';
            
            /*
            if (_calcAoS && satellite.get('next_aos')) {
                
                if (satellite.aosHappens()) {
				    html += '<td>' + AGUTIL.shortdate(satellite.get('next_aos')) + '</td>';
                } else {
                     html += '<td>Never</td>';   
                }
			} else {
				html += '<td>N/A</td>';
			}
            */
            
			html += '</tr>';
		});
		jQuery('#listviewdata').html(html);
		jQuery('.listviewsat').on('click',{}, function(e){
            var selected = jQuery(this).attr('id');
			jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: selected});			
		});		
	}
	
	/*
    _contextMenu = $("#jqxListViewMenu").jqxMenu({ width: '120px', height: '140px', autoOpenPopup: false, mode: 'popup' });
    jQuery(document).bind('contextmenu', function (e) {
        return false;
    });
    jQuery('#list').on('mousedown', function (event) {
        var rightClick = isRightClick(event);
        if (rightClick) {
            var scrollTop = jQuery(window).scrollTop();
            var scrollLeft = jQuery(window).scrollLeft();
            _contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
            return false;
        }
     });
              
    function isRightClick(event) {
        var rightclick;
        if (!event) var event = window.event;
        if (event.which) rightclick = (event.which == 3);
        else if (event.button) rightclick = (event.button == 2);
        return rightclick;
    }
    */
                                
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