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
/*global AGSatTrack, AGUTIL, AGSETTINGS */ 
 
 /**
 * The list view display. Contains a grid listing all of the satellites
 */
var AGLISTVIEW = function() {
	'use strict';
	
	var _render = false;            // Flag to indicate this view is active and needs rendering
    var _gridPolulated = false;     // Flag to indicate that the grid is populated. Used to call populate or update
    var _ignoreEvents = false;
       
	/**
	 * Listen for an event telling us a new set of elements were loaded
	 */
	jQuery(document).bind('agsattrack.satsselectedcomplete', function(event, group) {
		if (_render) {
            clearSatelliteGrid();
		}
	});

    jQuery(document).bind('agsattrack.newsatselected', function(event, group) {
        if (_render) {
            if (!_gridPolulated) {
                populateSatelliteGrid();
            } else {
                updateSatelliteGrid();
            }
        }
    });	
    
    
	/**
	 * Listen for an event telling us that new satellite propogation values are
	 * available.
	 */
	jQuery(document).bind('agsattrack.updatesatdata', function(event) {
		if (_render) {
            if (!_gridPolulated) {
                populateSatelliteGrid();
            } else {
                updateSatelliteGrid();
            }
		}
	});
	
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
    * Clear the grid of all data
    */
    function clearSatelliteGrid() {
        var data = [];
        jQuery('#sat-list-grid').datagrid('loadData',data);
        _gridPolulated = false;      
    }

    /**
    * Do the initial population of the grid
    */
    function populateSatelliteGrid() {
        var satellites = AGSatTrack.getDisplaying();
        if (satellites.length > 0) {
            var data = [];
            var theNextEvent = '';
            jQuery.each(satellites, function(index, satellite) {
                if (AGSETTINGS.getCalculateEvents()) {
                    if (satellite.isGeostationary()) {
                        theNextEvent = 'Geostationary';
                    } else {
                        theNextEvent = satellite.getNextEvent();
                    }
                } else {
                    theNextEvent = 'Disabled';
                }            
                data.push({
                    name: satellite.getName(),
                    type: satellite.get('type'),
                    viz: satellite.get('visibility').substring(0,3),
                    az: satellite.get('azimuth').toFixed(2) + '&deg;',
                    el: satellite.get('elevation').toFixed(2) + '&deg;',
                    lat: AGUTIL.convertDecDegLat(satellite.get('latitude')),
                    lon: AGUTIL.convertDecDegLon(satellite.get('longitude')),
                    alt: satellite.get('altitude').toFixed(0),
                    vel: satellite.get('velocity').toFixed(0),
                    nextevent: theNextEvent,
                    catalognumber: satellite.getCatalogNumber(),
                    ck: satellite.getSelected()
                }); 
        
            });

            jQuery('#sat-list-grid').datagrid('loadData',data);
            _gridPolulated = true; 
        } 
             
    }
    
    /**
    * Update the grid. This is faster than re populating the grid
    */
    function updateSatelliteGrid() {
        var catalogNumber;
        var satellite;
        var dataGrid = jQuery('#sat-list-grid');
        var theNextEvent = '';
        var rows = dataGrid.datagrid('getRows');
        
        for (var i=0; i<rows.length; i++) {
            catalogNumber = rows[i].catalognumber;
            satellite = AGSatTrack.getSatelliteByName(catalogNumber);
            if (AGSETTINGS.getCalculateEvents()) {
                if (satellite.isGeostationary()) {
                    theNextEvent = 'Geostationary';
                } else {
                    theNextEvent = satellite.getNextEvent();
                }
            } else {
                theNextEvent = 'Disabled';
            }                   
            dataGrid.datagrid('updateRow',{
                index: i,
                row: {
                    viz: satellite.get('visibility').substring(0,3),
                    az: satellite.get('azimuth').toFixed(2) + '&deg;',
                    el: satellite.get('elevation').toFixed(2) + '&deg;',
                    lat: AGUTIL.convertDecDegLat(satellite.get('latitude')),
                    lon: AGUTIL.convertDecDegLon(satellite.get('longitude')),
                    alt: satellite.get('altitude').toFixed(0),
                    vel: satellite.get('velocity').toFixed(0),
                    nextevent: theNextEvent                  
                }
            });
            if (satellite.getSelected()) {
                _ignoreEvents = true;
                dataGrid.datagrid('checkRow',i);    
                _ignoreEvents = false;
            } else {
                _ignoreEvents = true;
                dataGrid.datagrid('uncheckRow',i);    
                _ignoreEvents = false;                
            }                 
        }
    }
    
    /**
    * Handle paging in the grid
    *  
    * @param {Object} data
    * 
    * @returns {Object}
    */
    function pagerFilter(data){
        if (typeof data.length === 'number' && typeof data.splice === 'function'){    // is array
            data = {
                total: data.length,
                rows: data
            };
        }
        var dg = jQuery(this); // JSHint - This is fine.
        var opts = dg.datagrid('options');
        var pager = dg.datagrid('getPager');
        pager.pagination({
            onSelectPage:function(pageNum, pageSize){
                opts.pageNumber = pageNum;
                opts.pageSize = pageSize;
                pager.pagination('refresh',{
                    pageNumber:pageNum,
                    pageSize:pageSize
                });
                dg.datagrid('loadData',data);
            }
        });
        if (!data.originalRows){
            data.originalRows = (data.rows);
        }
        var start = (opts.pageNumber-1)*parseInt(opts.pageSize,10);
        var end = start + parseInt(opts.pageSize,10);
        data.rows = (data.originalRows.slice(start, end));
        return data;
    } 
                                            
	return {
        /**
        * Start to render the views
        */
		startRender : function() {
            populateSatelliteGrid();
            _render = true;
		},

        /**
        * Stop rendering rhe view
        */
		stopRender : function() {
			_render = false;			
		},

        /**
        * Initialise the view. Sets up the data grid
        */
		init : function() {
            jQuery('#sat-list-grid').datagrid({  
                rownumbers:true,
                autoRowHeight:false, 
                pagination:true, 
                pageSize:20, 
                fitColumns: true, 
                fit:true,  
                loadFilter: pagerFilter,
                columns:[[  
                    {field:'ck',checkbox:true},
                    {field:'name',title:'Name',width:200},  
                    {field:'type',title:'Type',width:55},  
                    {field:'viz',title:'Viz',width:55},  
                    {field:'az',title:'Azimuth',width:70},  
                    {field:'lat',title:'Latitude',width:95,align:'right'},  
                    {field:'lon',title:'Longitude',width:95,align:'right'},  
                    {field:'alt',title:'Altitude',width:60,align:'right'},  
                    {field:'vel',title:'Velocity',width:55,align:'right'},  
                    {field:'nextevent',title:'Next Event',width:150,align:'right'}
         
                ]]  
            });                                    
            jQuery('#sat-list-grid').datagrid({
                onUncheck: function(index,data){
                    if (!_ignoreEvents) {
                        jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: data.catalognumber, state: false});
                    }
                }
            });  
            jQuery('#sat-list-grid').datagrid({
                onCheck: function(index,data){
                    if (!_ignoreEvents) {
                        jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: data.catalognumber, state: true});
                    }
                }
            });   
        },
        
     tlesLoaded : function() {
         var totalTles = AGSatTrack.getTles().getCount();
         if (totalTles > 100) {
                AGSETTINGS.setCalculateEvents(false);
                jQuery('#list-view-show-events').setState(false);                  
            }            
        }
	};
};