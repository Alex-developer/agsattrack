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

    jQuery("#sat-info-selector").jqxDropDownList({width: '200', height: '25', animationType: 'none', autoOpen: true});
    jQuery("#sat-info-selector").hide();
    
	jQuery('#ag-satselector').agsatbox({
		width : 600,
		height : 400
	});
	
    jQuery('#north-toggle').on('click', function(e){
        debugger;    
    });
        
	jQuery('.view-reset').click(function() {
		jQuery(document).trigger('agsattrack.resetview');
	});

	jQuery('#home-observer').click(function() {
		var observers = AGSatTrack.getObservers()
		var window = new AGLOCATION('window-home-location', observers[0]);
	});

	jQuery('#options').click(function() {
        jQuery(document).trigger('agsattrack.setupoptions');
		jQuery('#viewtabs').tabs('select', 6);
	});

	/**
	 * Bind to the view menu options and select the appropriate tab
	 */
	jQuery('.satview').click(function() {
		var newTab = jQuery(this).attr('data-options')
		jQuery('#viewtabs').tabs('select', parseInt(newTab));
	});

    
    jQuery('.viewswitcher').on('click', function(e){
        var newTab = jQuery(this).attr('data-tab')
        jQuery('#viewtabs').tabs('select', parseInt(newTab));                
    });

    jQuery('.ribbon-tab-header').on('click', function(e){
        if (AGSETTINGS.getSwitchViewOnTabClick()) {
            var newTab = jQuery(this).find('span').attr('data-tab');
            if (typeof newTab !== 'undefined') {
                jQuery('#viewtabs').tabs('select', parseInt(newTab));                
            }
        }
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
	
	jQuery('#viewtabs').tabs({
		onSelect : function(title, index) {
			if (index === 6) {
				jQuery(document).trigger('agsattrack.optionsselected');
			}			
			var view = jQuery('#viewtabs').tabs('getTab', index).attr('id');
			jQuery(document).trigger('agsattrack.changeview', view);
		}
	});

    /**
    * Listen for a new set of TLE's being loaded. When they are reset stuff
    */
	jQuery(document).bind('agsattrack.tlesloaded',
		function(e, group) {
            jQuery('#sat-info-selector').jqxDropDownList('clear');
            clearDataPane();
            jQuery('#ag-satselector').agsatbox('setData', AGSatTrack.getTles());
	});

	/**
	 * Listen for events to update the data grid
	 */
	jQuery(document).bind('agsattrack.updatesatdata', function(e) {
        var selectedItem = jQuery('#sat-info-selector').jqxDropDownList('getSelectedItem');
        if (selectedItem !== null) {
            var selectedSatellite = AGSatTrack.getSatelliteByName(selectedItem.value);    
			updateSatelliteInfo(selectedSatellite);
            updateNextpass(selectedSatellite); 
        }

	});

    /**
    * When a satellite is selected in the drop down go get its details from the server.
    */
	jQuery('#sat-info-selector').bind('select', function(e) {
        var args = e.args;
        var selectedSatellite = AGSatTrack.getSatelliteByName(args.item.value); 
        UpdateSatelliteData(selectedSatellite);
	});

    /**
    * When a new satellite is selected update the satellite information pane.
    * TODO: There must be a better way to manage the selection in the drop down. Re selecting the
    * item is causing the ajax request for the satellite data to be reloaded whenever the drop down
    * is updated.
    */
    jQuery(document).bind('agsattrack.newsatselected', function(e, selectedInfo) {
        jQuery('#sat-info-selector').jqxListBox('beginUpdate');
        clearDataPane();        
        var selectedItem = jQuery('#sat-info-selector').jqxDropDownList('getSelectedItem');
        jQuery('#sat-info-selector').jqxDropDownList('clear');
        if (selectedInfo.satellites.length > 1 ) {
            for (var i=0; i < selectedInfo.satellites.length; i++) {
                var satelliteName = selectedInfo.satellites[i].getName();
                jQuery('#sat-info-selector').jqxDropDownList('addItem', satelliteName);    
            }
            if (selectedItem !== null) {
                var items = jQuery('#sat-info-selector').jqxDropDownList('getItems');
                if (items !== null) {
                    for (var i=0; i<items.length; i++) {
                        if (items[i].value === selectedItem.value) {
                            jQuery('#sat-info-selector').jqxDropDownList('selectIndex', items[i].index);
                            break;
                        }
                    }
                }
            }
            jQuery('#sat-info-selector').show(); 
        } else {
            if (selectedInfo.satellites.length > 0) {
                var satelliteName = selectedInfo.satellites[0].getName();
                jQuery('#sat-info-selector').jqxDropDownList('addItem', satelliteName);    
                jQuery('#sat-info-selector').jqxDropDownList('selectIndex', 0);
                jQuery('#sat-info-selector').hide();
                UpdateSatelliteData(selectedInfo.satellites[0]);
            }           
        }
        jQuery('#sat-info-selector').jqxListBox('endUpdate');        
    });    

    function UpdateSatelliteData(satellite) {
        var noradId = satellite.getNoradId();
        var url = 'ajax.php?id=' + noradId;
        jQuery.getJSON(url, function(data) {
            for ( var i = 0; i < data.length; i++) {
                jQuery('#' + data[i].field).html(data[i].value);
            }
        });
        updateSatelliteInfo(satellite);
        updateNextpass(satellite); 
    }
    
    function clearDataPane() {
        jQuery('.sat-info').html('');      
    }
    
    function updateSatelliteInfo(satellite) {
        var data = satellite.getData();
        jQuery('#latitude').html(AGUTIL.convertDecDegLat(data.latitude));
        jQuery('#longitude').html(AGUTIL.convertDecDegLon(data.longitude));
        jQuery('#altitude').html(data.altitude.toFixed(3));
        jQuery('#velocity').html(data.velocity.toFixed(3));
        jQuery('#range').html(data.range.toFixed(3));
        jQuery('#footprint').html(data.footprint.toFixed(3));
        jQuery('#elevation').html(data.elevation.toFixed(3));
        jQuery('#azimuth').html(data.azimuth.toFixed(3));      
    }
    
    function updateNextpass(satellite) {
        var selectedItem = jQuery('#sat-info-selector').jqxDropDownList('getSelectedItem');
        if (selectedItem !== null) {
            var selectedSatellite = AGSatTrack.getSatelliteByName(selectedItem.value); 

            jQuery('#nextpass').html('');

            var table = '<table>';
            table += '<tr>';
            table += '<th>Time</th>';
            table += '<th>Az</th>';
            table += '<th>El</th>';
            table += '</tr>';

            var orbitData = selectedSatellite.getOrbitData();
            for ( var i = 0; i < orbitData.length; i++) {
                if (orbitData[i].el > AGSETTINGS.getAosEl()) {
                    table += '<tr>';
                    table += '<td>' + AGUTIL.shortdate(orbitData[i].date) + '</td>';
                    table += '<td>' + orbitData[i].az.toFixed(0) + '</td>';
                    table += '<td>' + orbitData[i].el.toFixed(0) + '</td>';
                    table += '</tr>'
                }
            }
            table += '</table>';

            jQuery('#nextpass').html(table);
        } else {
            jQuery('#nextpass').html('Not Available');  
        }        
    }
    
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