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
            debugger;
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
        url: 'ajax.php'
    };
    
    var dataAdapter = new jQuery.jqx.dataAdapter(source,
        {
            loadComplete: function (records) {
                loadAvailablesatellites('amateur');    
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
		var observers = AGSatTrack.getObservers()
		var window = new AGLOCATION('window-home-location', observers[0]);
	});

	jQuery('#options').click(function() {
        jQuery(document).trigger('agsattrack.setupoptions');
		jQuery('#viewtabs').tabs('select', 6);
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
     

	
	jQuery('#viewtabs').tabs({
		onSelect : function(title, index) {
			if (index === 6) {
				jQuery(document).trigger('agsattrack.optionsselected');
			}			
			var view = jQuery('#viewtabs').tabs('getTab', index).attr('id');
			jQuery(document).trigger('agsattrack.changeview', view);
		}
	});

    jQuery('#satinfot').tabs({
        onSelect : function(title, index) {
            if (index === 1) {
                var following = AGSatTrack.getFollowing();
                if (following !== null) {
                    var passes = following.getTodaysPasses();
                    if (passes === null) {
                        var obs = AGSatTrack.getObservers()[0];
                        passes = following.calculateTodaysPasses(obs);
                        updateNextpass(following, passes);
                    }
                }
            }            
        }
    });
    
    
    /**
    * Listen for a new set of TLE's being loaded. When they are reset stuff
    */
	jQuery(document).bind('agsattrack.tlesloaded',
		function(e, group) {
            var tles = AGSatTrack.getTles();
            jQuery('#statustotalloaded').html(tles.getCount() + ' Satellites Loaded');
            jQuery('#sat-info-selector').jqxDropDownList('clear');
            clearDataPane();
            jQuery('#ag-satselector').agsatbox('setData', tles);
            AGVIEWS.sendViewReset();
            jQuery('#quick-sat-selector').agcheckList('clear');   
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
        UpdateSatelliteData(selectedSatellite);
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
        jQuery('#sat-info-selector').jqxListBox('beginUpdate');
        clearDataPane();        
        var selectedItem = jQuery('#sat-info-selector').jqxDropDownList('getSelectedItem');
        jQuery('#sat-info-selector').jqxDropDownList('clear');
        if (selectedInfo.satellites.length > 1 ) {
            for (var i=0; i < selectedInfo.satellites.length; i++) {
                var satelliteName = selectedInfo.satellites[i].getName();
                var catalogNumber = selectedInfo.satellites[i].getCatalogNumber();
                jQuery('#sat-info-selector').jqxDropDownList('addItem', {label: satelliteName, value: catalogNumber});
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
                var catalogNumber = selectedInfo.satellites[0].getCatalogNumber();
                jQuery('#sat-info-selector').jqxDropDownList('addItem', {label: satelliteName, value: catalogNumber});    
                jQuery('#sat-info-selector').jqxDropDownList('selectIndex', 0);
                jQuery('#sat-info-selector').hide();
                UpdateSatelliteData(selectedInfo.satellites[0]);
            } else {
                AGSatTrack.setFollowing(null);
            }           
        }
        jQuery('#sat-info-selector').jqxListBox('endUpdate');        
    });    

    function UpdateSatelliteData(satellite) {
        var catalogNumber = satellite.getCatalogNumber();
        var url = 'ajax.php?id=' + catalogNumber;
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
        jQuery('#latitude').html(AGUTIL.convertDecDegLat(satellite.get('latitude')));
        jQuery('#longitude').html(AGUTIL.convertDecDegLon(satellite.get('longitude')));
        jQuery('#altitude').html(satellite.get('altitude').toFixed(3));
        jQuery('#visible').html(satellite.get('visibility'));
        jQuery('#velocity').html(satellite.get('velocity').toFixed(3));
        jQuery('#range').html(satellite.get('range').toFixed(3));
        jQuery('#rangerate').html(satellite.get('rangerate').toFixed(3));
        jQuery('#footprint').html(satellite.get('footprint').toFixed(3));
        jQuery('#elevation').html(satellite.get('elevation').toFixed(3));
        jQuery('#azimuth').html(satellite.get('azimuth').toFixed(3));      
        jQuery('#orbitalphase').html(satellite.get('orbitalphase').toFixed(3));      
        jQuery('#aoshappens').html(satellite.aosHappens());      
    }
    
    function updateNextpass(satellite, passes) {
        var html = '';
        jQuery('#nextpass').html('');

        html += '<table id="passestable">';
        for (var i=0; i < passes.length; i++) {
            html += '<tr><th>Aos</th><th>Los</th></tr>';            
            html += '<tr><td>'+ AGUTIL.shortdatetime(passes[i].dateTimeStart,true)+'</td><td>'+ AGUTIL.shortdatetime(passes[i].dateTimeEnd,true)+'</td></tr>';
            html += '<tr><th>Orbit Number</th><td>'+passes[i].orbitNumber+'</td></tr>';          
            html += '<tr><th>Peak Az</th><td>'+passes[i].peakAzimuth.toFixed(2)+'</td></tr>';          
            html += '<tr><th>Peak El</th><td>'+passes[i].peakElevation.toFixed(2)+'</td></tr>';     
            html += '<tr><th>&nbsp;</th><td>&nbsp;</td></tr>';                 
        }                    
        html += '</table>';
        jQuery('#nextpass').html(html);
    
           
    }
    
/*    
    jQuery('#sat-display-all').pulse({
    opacity: [0,1] // pulse between 1 and 0
    }, 200, 500);
*/
    jQuery('#center-panel').panel({
        onResize : function(width, height) {
        
            var tab = jQuery('#viewtabs').tabs('getSelected');
            var index = jQuery('#viewtabs').tabs('getTabIndex',tab);
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

    ctrl.remove();
    jQuery(document.body).show();
    jQuery('#status').html('Idle');

    var _helper = new AGPOPUPHELP();
                
	return {
        updateInfo : function(text) {
            jQuery('#info').html(text);            
        },
        updateStatus : function(text) {
            jQuery('#status').html(text);            
        },
                
		updateSatelliteInfo : function(catalogNumber) {
			var url = 'ajax.php?id=' + catalogNumber;
			jQuery.getJSON(url, function(data) {
				for ( var i = 0; i < data.length; i++) {
					jQuery('#' + data[i].field).html(data[i].value);
				}
			});
		},
        
        updateInfoPane : function() {
            if (AGSETTINGS.getShowPopupHelp()) {
                var showingHelp = false;
                var totalTles = AGSatTrack.getTles().getCount();
                var totalDisplaying = AGSatTrack.getDisplaying().length;
                
                if (totalTles > 0 && totalDisplaying === 0) {
                    var helpText = jQuery('#help-1').html();
                    helpText = helpText.replace(/{tlecount}/g, totalTles);
                    _helper.showHelp(helpText, true);
                    showingHelp = true;
                }
                
                if (!showingHelp) {
                    _helper.closeBalloon(true);    
                }
            }
            
        }
	}
}