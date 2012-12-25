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
var AGUI = function() {
	'use strict';

	/**
	 * Ugly hack to hide view tabs
	 */
	jQuery('#viewtabs.easyui-tabs div.tabs-header div.tabs-wrap:first').hide();
	
	jQuery('#ribbon').ribbon();

	jQuery('#ag-satselector').agsatbox({
		width : 600,
		height : 400
	});
	
	jQuery('.view-reset').click(function() {
		jQuery(document).trigger('agsattrack.resetview');
	});

	jQuery('#home-observer').click(function() {
		var observers = AGSatTrack.getObservers()
		var window = new AGLOCATION('window-home-location', observers[0]);
	});

	jQuery('#options').click(function() {
		jQuery('#viewtabs').tabs('select', 6);
	});

	/**
	 * Bind to the view menu options and select the appropriate tab
	 */
	jQuery('.satview').click(function() {
		var newTab = jQuery(this).attr('data-options')
		jQuery('#viewtabs').tabs('select', parseInt(newTab));
	});

	/**
	 * Bind to the 3D view menu options and fire and event to select the view.
	 */
	jQuery('.3dview').click(function(e) {
		var view = jQuery(this).attr('data-options')
		jQuery(document).trigger('agsattrack.change3dview', view);
	});

	/**
	 * Bind to the tile provider options and fire an event when selected
	 */
	jQuery('.tile').click(function() {
		var provider = jQuery(this).attr('data-options')
		jQuery(document).trigger('agsattrack.changetile', provider);
	});

	jQuery('#groupselector').combobox({
		url : 'ajax.php',
		valueField : 'id',
		textField : 'name',
		editable : false,
		onLoadSuccess : function(a, b) {
			loadAvailablesatellites({
				id : 'amateur'
			}); // BUG
		},
		onSelect : function(item) {
			loadAvailablesatellites(item);
		}
	});

	function loadAvailablesatellites(item) {
		var file = '';
		if (typeof item === 'undefined') {
			file = jQuery('#groupselector').combobox('getValue');
		} else {
			file = item.id;
		}

		jQuery(document).trigger('agsattrack.loadelements', {
			filename : file
		});
	}

	jQuery('#sats').checkList({
		effect : null,
		onChange : function() {
			var selection = $('#sats').checkList('getSelection');
			jQuery(document).trigger('agsattrack.satsselected', {
				selections : selection
			});
			jQuery(document).trigger('agsattrack.forceupdate', {});
		}
	});
	jQuery(document)
			.bind(
					'agsattrack.tlesloaded',
					function(e, group) {
						var names = AGSatTrack.getTles().getNames();
						var items = [];
						var html = '';

						for ( var i = 0; i < names.length; i++) {
							var item = {
								text : names[i],
								value : i
							};
							items.push(item);

							html += '<div class="satwrapper"><div class="satimage"></div><div class="satname">'
									+ names[i]
									+ '</div><div class="satinfo">Some Info</div></div>';
						}
						jQuery('#sats').checkList('setData', items);
						jQuery('#satselector').html(html);
						jQuery('#ag-satselector').agsatbox('updateSatelliteData', AGSatTrack.getTles());						
					});


	
	jQuery('#viewtabs').tabs({
		onSelect : function(title, index) {
			if (index === 6) {
				jQuery(document).trigger('agsattrack.optionsselected');
			}			
			var view = jQuery('#viewtabs').tabs('getTab', index).attr('id');
			jQuery(document).trigger('agsattrack.changeview', view);
		}
	});

	jQuery(document).bind(
			'agsattrack.satclicked',
			function(e, selected) {
				jQuery('#nextpass').html('');

				var table = '<table>';
				table += '<tr>';
				table += '<th>Time</th>';
				table += '<th>Az</th>';
				table += '<th>El</th>';
				table += '</tr>';

				var orbitData = selected.sat.getOrbitData();
				for ( var i = 0; i < orbitData.length; i++) {
					if (orbitData[i].el > AGSETTINGS.getAosEl()) {
						table += '<tr>';
						table += '<td>' + AGUTIL.shortdate(orbitData[i].date)
								+ '</td>';
						table += '<td>' + orbitData[i].az.toFixed(0) + '</td>';
						table += '<td>' + orbitData[i].el.toFixed(0) + '</td>';
						table += '</tr>'
					}
				}
				table += '</table>';

				jQuery('#nextpass').html(table);
			});

	/**
	 * Listen for events to update the data grid
	 */
	jQuery(document).bind('agsattrack.updatesatdata', function(e, params) {
		if (params.selected !== null) {
			var data = params.selected.sat.getData();

			jQuery('#latitude').html(AGUTIL.convertDecDegLat(data.latitude));
			jQuery('#longitude').html(AGUTIL.convertDecDegLon(data.longitude));
			jQuery('#altitude').html(data.altitude.toFixed(3));
			jQuery('#velocity').html(data.velocity.toFixed(3));
			jQuery('#range').html(data.range.toFixed(3));
			jQuery('#footprint').html(data.footprint.toFixed(3));
			jQuery('#elevation').html(data.elevation.toFixed(3));
			jQuery('#azimuth').html(data.azimuth.toFixed(3));
		}

	});

	jQuery(document).bind('agsattrack.satclicked', function(e, selectedInfo) {
		var noradId = selectedInfo.sat.getNoradId();
		var url = 'ajax.php?id=' + noradId;
		jQuery.getJSON(url, function(data) {
			for ( var i = 0; i < data.length; i++) {
				jQuery('#' + data[i].field).html(data[i].value);
			}
		});
	});

	return {
		updateSatelliteInfo : function(noradId) {
			var url = 'ajax.php?id=' + noradId;
			jQuery.getJSON(url, function(data) {
				for ( var i = 0; i < data.length; i++) {
					jQuery('#' + data[i].field).html(data[i].value);
				}
			});
		}
	}
}