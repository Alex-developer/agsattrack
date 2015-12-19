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
/*global AGSatTrack, AGSETTINGS, AGVIEWS, AGUTIL, AGLOCATION, ctrl */ 

var AGUI = function() {
	'use strict';
    
    /**
    * If we are not running on any of my domains then delete the social media
    * element from the ribbon bar.
    */
    var url = jQuery(location).attr('href');
    if (url.indexOf('ag.local') === -1 && url.indexOf('agsattrack.com') === -1) {
        jQuery('#social-twitter').remove();    
        jQuery('#social-fb').remove();    
    }
    
	/**
	 * Ugly hack to hide view tabs
	 */
	jQuery('#viewtabs.easyui-tabs div.tabs-header div.tabs-wrap:first').hide();
	
	jQuery('#ribbon').ribbon();

    jQuery("#sat-info-selector").jqxDropDownList({width: '200', height: '25', animationType: 'none', autoOpen: true});
    jQuery("#sat-info-selector").hide();
    
    /**
    * Satellite ribbon section
    */
    jQuery('#ag-satselector').agsatbox({
        width : 600,
        height : 400
    });  

    function loadAvailablesatellites(item) {
        if (typeof item === 'undefined') {
            item = jQuery("#sat-group-selector-listbox").jqxListBox('getSelectedItem');
        }
        jQuery(document).trigger('agsattrack.loadelements', {
            filename : item
        });
    }
       
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'id' },
            { name: 'name' }
        ],
        id: 'id',
        url: '/groups'
    };
    
    var dataAdapter = new jQuery.jqx.dataAdapter(source,
        {
            loadComplete: function (records) {
                loadAvailablesatellites(AGSETTINGS.getDefaultTLEgroup());    
            }
        }
    );
        
    jQuery('#sat-group-selector-listbox').jqxListBox({
        source: dataAdapter,
        displayMember: 'name', 
        valueMember: 'id',
        width: 300, 
        height: 250
    });       
    jQuery('#sat-group-selector-listbox').on('change', function (event) {
        var args = event.args;
        if (args) {
            var item = args.item;
            loadAvailablesatellites(item.value);
        }
    });
    
    jQuery('#sat-display-all').on('click', function(e){
        jQuery(this).disable();
        jQuery('#ag-satselector').agsatbox('moveAllSats','right');
        jQuery(this).enable();
    });
    jQuery('#sat-display-none').on('click', function(e){
        jQuery(this).disable();
        jQuery('#ag-satselector').agsatbox('moveAllSats','left');
        jQuery(this).enable();                
    });    
    /**
    * End satellite ribbon section
    */    
      
    jQuery('#quick-sat-selector').agcheckList();       
           
	jQuery('.view-reset').click(function() {
		jQuery(document).trigger('agsattrack.resetview');
	});

	jQuery('#home-observer').click(function() {
		var observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);
		var window = new AGLOCATION('window-home-location', observer);
	});

	jQuery('#options').click(function() {
        AGVIEWS.switchView('options');
        jQuery(document).trigger('agsattrack.setupoptions');
	});

    jQuery('#help-tour').click(function() {
        jQuery('#joyRideTipContent').joyride();
    });    
    jQuery('#help-contact').click(function() {
        jQuery('#contact-window').window('open');
    });    
    jQuery('#help-help').click(function() {
        jQuery('#help-window').window('open');
    }); 
    jQuery('.tree-help-item').on('click', function(e){
        e.preventDefault();
        var href = jQuery(e.target).attr('href');
        jQuery('#help-content').load(href, function(response, status, xhr){
            if (status === 'error') {
                jQuery('#help-content').html('<h2>Page Not Found</h2>');    
            }
        }); 
    });

        
	/**
	 * Bind to the view menu options and select the appropriate tab
	 */
	jQuery('.satview').click(function() {
		var newTab = jQuery(this).attr('data-options');
		AGVIEWS.switchView(newTab);
	});

    jQuery('.ribbon-tab-header').on('click', function(e){
        var newTab = jQuery(this).find('span').attr('data-tab');
        if (typeof newTab !== 'undefined') {
            AGVIEWS.switchView(newTab);              
        }
    });    
    
	/**
	 * Bind to the tile provider options and fire an event when selected
	 */
	jQuery('.tile').click(function() {
		var provider = jQuery(this).attr('data-options');
		jQuery(document).trigger('agsattrack.changetile', provider);
	});

    jQuery('.3dview').click(function() {
        var view = jQuery(this).attr('data-options');
        jQuery(document).trigger('agsattrack.change3dview', view);
    });
            
    /**
    * Listen for a new set of TLE's being loaded. When they are reset stuff
    */
	jQuery(document).bind('agsattrack.tlesloaded',
		function(e, group) {
            var tles = AGSatTrack.getTles();
            var doAutoLoad = true;
            var sat;
            
            if (AGSETTINGS.getDefaultTLEgroup() === group) {
                var sats = AGSETTINGS.getDefaultSats();
                if (sats !== '') {
                    AGSETTINGS.setDefaultSats('');
                    doAutoLoad = false;
                    var satsList = sats.split(',');
                    var foundSats = [];
                    for (var i=0; i < satsList.length; i++) {
                        sat = AGSatTrack.getSatelliteByName(satsList[i]);
                        if (typeof sat !== 'undefined') {
                           // sat.setDisplaying(true);
                           foundSats.push(satsList[i]);
                        }
                    }
                    jQuery(document).trigger('agsattrack.satsselected', {
                        selections : foundSats
                    }); 
                    jQuery(document).trigger('agsattrack.forceupdate', {});                        
                }
            }
                        
            jQuery('#statustotalloaded').html(tles.getCount() + ' Satellites Loaded');
            jQuery('#sat-info-selector').jqxDropDownList('clear');
            clearDataPane();
            jQuery('#ag-satselector').agsatbox('setData', tles);
            AGVIEWS.sendViewReset();
            jQuery('#quick-sat-selector').agcheckList('clear');
                                
            if (AGSETTINGS.getAutoAddSats() && doAutoLoad) {
                jQuery('#ag-satselector').agsatbox('moveAllSats','right');        
            }
            var groupName = AGSatTrack.getTles().getGroupName();
            jQuery('#statusgroup').html('<strong>Group:</strong> ' + groupName); 
	});

	/**
	 * Listen for events to update the data grid
	 */
	jQuery(document).bind('agsattrack.updatesatdata', function(e) {
        var selectedItem = jQuery('#sat-info-selector').jqxDropDownList('getSelectedItem');
        if (selectedItem !== null) {
            var selectedSatellite = AGSatTrack.getSatelliteByName(selectedItem.value);    
			updateSatelliteInfo(selectedSatellite);
        }

	});

    /**
    * When a satellite is selected in the drop down go get its details from the server.
    */
	jQuery('#sat-info-selector').bind('select', function(e) {
        var args = e.args;
        var selectedSatellite = AGSatTrack.getSatelliteByName(args.item.value); 
        AGSatTrack.setFollowing(selectedSatellite);
        updateSatelliteData(selectedSatellite);
	});

    
    jQuery(document).bind('agsattrack.satsselectedcomplete', function(e, selectedInfo) {
        if (selectedInfo.selected.length === 0) {
            jQuery('#sat-info-selector').jqxDropDownList('clear');
            AGSatTrack.setFollowing(null);
            jQuery('#sat-info-selector').hide();    
        }
    });
        
    /**
    * When a new satellite is selected update the satellite information pane.
    * TODO: There must be a better way to manage the selection in the drop down. Re selecting the
    * item is causing the ajax request for the satellite data to be reloaded whenever the drop down
    * is updated.
    */
    jQuery(document).bind('agsattrack.newsatselected', function(e, selectedInfo) {
        var i;
        var satelliteName;
        var catalogNumber;
        
        jQuery('#sat-info-selector').jqxListBox('beginUpdate');
        clearDataPane();        
        var selectedItem = jQuery('#sat-info-selector').jqxDropDownList('getSelectedItem');
        jQuery('#sat-info-selector').jqxDropDownList('clear');
        if (selectedInfo.satellites.length > 1 ) {
            for (i=0; i < selectedInfo.satellites.length; i++) {
                satelliteName = selectedInfo.satellites[i].getName();
                catalogNumber = selectedInfo.satellites[i].getCatalogNumber();
                jQuery('#sat-info-selector').jqxDropDownList('addItem', {label: satelliteName, value: catalogNumber});
            }
            if (selectedItem !== null) {
                var items = jQuery('#sat-info-selector').jqxDropDownList('getItems');
                if (items !== null) {
                    for (i=0; i<items.length; i++) {
                        if (items[i].value === selectedItem.value) {
                            jQuery('#sat-info-selector').jqxDropDownList('selectIndex', items[i].index);
                            break;
                        }
                    }
                }
            }
            jQuery('#sat-info-selector').show(); 
            jQuery('.satinfo').show();
            jQuery('#satinfo-message').hide();             
        } else {
            if (selectedInfo.satellites.length > 0) {
                satelliteName = selectedInfo.satellites[0].getName();
                catalogNumber = selectedInfo.satellites[0].getCatalogNumber();
                jQuery('#sat-info-selector').jqxDropDownList('addItem', {label: satelliteName, value: catalogNumber});    
                jQuery('#sat-info-selector').jqxDropDownList('selectIndex', 0);
                jQuery('#sat-info-selector').hide();
                updateSatelliteData(selectedInfo.satellites[0]);
                jQuery('.satinfo').show();
                jQuery('#satinfo-message').hide();                
            } else {
                AGSatTrack.setFollowing(null);
                jQuery('.satinfo').hide();
                jQuery('#satinfo-message').show();
            }           
        }
        jQuery('#sat-info-selector').jqxListBox('endUpdate');        
    });    

    function updateSatelliteData(satellite) {
        var catalogNumber = satellite.getCatalogNumber();
        var url = '/satellite/' + catalogNumber;
        jQuery.getJSON(url, function(data) {
            for ( var i = 0; i < data.length; i++) {
                jQuery('#' + data[i].field).html(data[i].value);
            }
        });
        updateSatelliteInfo(satellite);
    }
    
    function clearDataPane() {
        jQuery('.sat-info').html('');      
    }
    
    function updateSatelliteInfo(satellite) {
        try { // TODO: Fix dopploer error
            jQuery('#latitude').html(AGUTIL.convertDecDegLat(satellite.get('latitude')));
            jQuery('#longitude').html(AGUTIL.convertDecDegLon(satellite.get('longitude')));
            jQuery('#latitudedec').html(satellite.get('latitude').toFixed(3));
            jQuery('#longitudedec').html(satellite.get('longitude').toFixed(3));
            jQuery('#locator').html(satellite.get('locator'));
            jQuery('#altitude').html(satellite.get('altitude').toFixed(3));
            jQuery('#visible').html(satellite.get('visibility'));
            jQuery('#orbitnumber').html(satellite.get('orbitnumber'));
            jQuery('#velocity').html(satellite.get('velocity').toFixed(3));
            jQuery('#range').html(satellite.get('range').toFixed(3));
            jQuery('#doppler').html(satellite.get('dopplershift').toFixed(0));
            jQuery('#loss').html(satellite.get('signalloss').toFixed(0));
            jQuery('#delay').html(satellite.get('signaldelay').toFixed(0));
            jQuery('#rangerate').html(satellite.get('rangerate').toFixed(3));
            jQuery('#footprint').html(satellite.get('footprint').toFixed(3));
            jQuery('#elevation').html(satellite.get('elevation').toFixed(3));
            jQuery('#azimuth').html(satellite.get('azimuth').toFixed(3));      
            jQuery('#orbitalphase').html(satellite.get('orbitalphase').toFixed(3));
            if (satellite.isGeostationary()) {
                if (satellite.get('elevation') > 0) {
                    jQuery('#geostationary').html('Yes - Visible');
                } else {
                    jQuery('#geostationary').html('Yes - Not Visible');
                }
            } else {
                jQuery('#geostationary').html('No');
            }   
        } catch(err) {
            
        }     
    }
    
/*    
    jQuery('#sat-display-all').pulse({
    opacity: [0,1] // pulse between 1 and 0
    }, 200, 500);
*/
    jQuery('#center-panel').panel({
        onResize : function(width, height) {
        
            var tab = jQuery('#viewtabs').tabs('getSelected');
            var index = tab.panel('options').title;
            var view = AGVIEWS.getViewFromIndex(index);
            
            if (view !== null) {
                if (view.instance.resizeView instanceof Function) {       
                    view.instance.resizeView(width, height);
                }
            }  
        }
    });
    
    
    jQuery(document).bind('agsattrack.updatestatus', function(e, params) {
        jQuery('#status').html(params.text); 
    });
    jQuery(document).bind('agsattrack.updateinfo', function(e, params) {
        jQuery('#info').html(params.text); 
    });        

    if (AGSETTINGS.getDebugView() === false) {
        jQuery('#ribbon-tab-header-9').hide();         
    }
    
    
    ctrl.remove();
    jQuery(document.body).show();
    jQuery('#status').html('Idle');

                
	return {
        updateInfo : function(text) {
            jQuery('#info').html(text);            
        },
        updateStatus : function(text) {
            jQuery('#status').html(text);            
        },
        updateStatusGroup : function(text) {
            jQuery('#statusgroup').html(text);            
        },                
        updateStatusFollowing : function(text) {
            jQuery('#statusfollowing').html(text);            
        },
		updateSatelliteInfo : function(catalogNumber) {
			var url = '/satellite/' + catalogNumber;
			jQuery.getJSON(url, function(data) {
				for ( var i = 0; i < data.length; i++) {
					jQuery('#' + data[i].field).html(data[i].value);
				}
			});
		},
        
        updateInfoPane : function() {
        }
	};
};