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
 
/*global AGSatTrack, AGIMAGES, AGVIEWS, AGSETTINGS, AGUTIL, Kinetic, requestAnimFrame */
  
var AGDXVIEW = function(element) {
    'use strict';

    var _render = false;                // Flag to indcate if this view is being rendered
    var _element = null;                // id of the element this view is attached to
    var _mode = null;                   // The view mode
    var _databaseAvailable = false;     // Flag to indicate if the database is available
    var _databaseLoading = false;       // Flag indicating the database is being loaded
    var _locationDatabase = null;       // The location database
    
    var _infoGrid = null;               // The data grid
    

    var _infoGridId = AGUTIL.getId();
    var _infoGridToolbarId = AGUTIL.getId();
    var _infoGridHeadFollowingId = AGUTIL.getId();
    var _infoGridHeadFollowingLat = AGUTIL.getId();
    var _infoGridHeadFollowingLon = AGUTIL.getId();
    
    var _pageSize = 20;
    
    /**
    * Set the parent element for this view.    
    */
    if (typeof element === 'undefined') {
        _element = 'dx';   
    } else {
        _element = element;
        _pageSize = 10;
    }
    
    /**
    * Append to html for the datagrid
    */
    jQuery('<div id="'+_infoGridId+'"></div> \
                <div id="'+_infoGridToolbarId+'" class="dx-datagrid-tb"> \
                    <div> \
                        <div id="dx-datagrid-tb-label-following" class="dx-datagrid-tb-header dx-datagrid-tb-header-label">Following:</div> \
                        <div id="'+_infoGridHeadFollowingId+'" class="dx-datagrid-tb-field">None</div> \
                        <div id="dx-datagrid-tb-label-lat" class="dx-datagrid-tb-header dx-datagrid-tb-header-label">Latitude:</div> \
                        <div id="'+_infoGridHeadFollowingLat+'" class="dx-datagrid-tb-field">-</div> \
                        <div id="dx-datagrid-tb-label-lon" class="dx-datagrid-tb-header dx-datagrid-tb-header-label">Longitude:</div> \
                        <div id="'+_infoGridHeadFollowingLon+'" class="dx-datagrid-tb-field">-</div> \
                    </div> \
                    <div class="cb"></div> \
    </div>').appendTo('#'+_element);


    /**
    * Listen for new satellites being selected and update the grid
    */
    jQuery(document).bind('agsattrack.newsatselected', function(event, group) {
        if (_render) {
            updateInfogrid();
        }
    });
      
    jQuery(document).bind('agsattrack.updatesatdata',
            function(event, selected) {
                if (_render) {
                    updateInfogrid();
                }
            });
                    
    /**
    * Load the DX database from the server if it has not already been loaded.
    */
    function checkAndLoadDXdatabase() {
        if (!_databaseLoading && !_databaseAvailable) {
            _databaseLoading = true;
            var url = '/index.php?controller=satellite&method=getLocationDatabase';
            jQuery.getJSON(url, function(data) {
                _locationDatabase = data;
                _databaseAvailable = true;
                _databaseLoading = false;
                updateInfogrid();
            });
        }
    }
    
    /**
    * Build the grid to display data
    */
    function checkAndBuildDataGrid() {
        if (_infoGrid === null) {
            _infoGrid = jQuery('#' + _infoGridId).datagrid({  
                fit: true,
                rownumbers:true,
                autoRowHeight:false, 
                pagination:true, 
                pageSize:_pageSize, 
                fitColumns: true,
                loadFilter: pagerFilter,
                sortName: 'distance',
                remoteSort: false,
                toolbar: '#' + _infoGridToolbarId,                
                columns:[[  
                    {field:'name',title:'Name',width:100},  
                    {field:'prefix',title:'Prefix',width:100},  
                    {field:'distance',title:'Distance',width:100,align:'right', sortable:true, order: 'asc'}  
                ]]  
            });  
        }    
    }

    /**
    * Update the grid
    */
    function updateInfogrid() {
        if (!_databaseAvailable) {
            return;
        }
        
        var data = [];
        var following = AGSatTrack.getFollowing();
        var satName = 'None';
        var lat = '-';
        var lon = '-';
        if (following !== null) {
            satName = following.getName();      
            lat = following.get('latitude');
            lon = following.get('longitude');
            var footprint = following.get('footprint');
            for ( var i = 0; i < _locationDatabase.length; i++) {
                var distance = AGUTIL.getDistance(lat, lon, _locationDatabase[i].lat, -_locationDatabase[i].lon);
                if (distance < (footprint/2)) {
                    data.push({
                        name: _locationDatabase[i].name,
                        prefix: _locationDatabase[i].prefix,
                        distance : distance.toFixed(0)
                    });
                }
            }

            lat = AGUTIL.convertDecDegLat(lat);
            lon = AGUTIL.convertDecDegLon(lon);
        }
        jQuery('#' + _infoGridHeadFollowingLat).html(lat);
        jQuery('#' + _infoGridHeadFollowingLon).html(lon);
        jQuery('#' + _infoGridHeadFollowingId).html(satName);
        jQuery('#' + _infoGridId).datagrid('loadData',data);
    }
    
    /**
    * Helper function for grid clent side pagination
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
        startRender : function() {
            _render = true;
            checkAndLoadDXdatabase();
            updateInfogrid();
        },

        stopRender : function() {
            _render = false;
        },

        destroy : function() {
            _render = false;
            jQuery('#'+_element).html('');    
        },
        resizeView : function(width, height) {
        },  
        init : function(mode) {     
            if (typeof mode === 'undefined') {
                mode = AGVIEWS.modes.DEFAULT;    
            }
            _mode = mode;
            checkAndBuildDataGrid();
        }
        
    };
};