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
/*global AGSatTrack, AGUTIL */ 
 
var AGDEBUG = function() {
    'use strict';
    
    var _render = false;
    var _selectedSat = null;
    
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#debug');
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            jQuery('#debuggrid').treegrid('resize',{
                width: width,
                height: height
            });
        }          
    }
        
    jQuery(document).bind('agsattrack.resetview',
            function(e, observer) {
                if (_render) {
                    buildDebugGrid();
                }
            }); 

    jQuery(document).bind('agsattrack.deletesatcache', function(e) {
        var sat = AGSatTrack.getSatelliteByName(_selectedSat);
        sat.clearCache();
        buildDebugGrid();
        jQuery('#debug-clear-cache').disable();
    }); 
                         
             
                                                
    function buildDebugGrid() {       
        var row = {};
        var data = {};
        var id = 1000;
        var openLeaves = 'closed';
        var rows = [{satellite: 'Satellites', id:1}];
        var sats = AGSatTrack.getSatellites();
        var lastCalcTime;
        for (var i=0; i < sats.length; i++) {
            lastCalcTime = sats[i].getLastcalcTime();
            if (sats[i].getSelected()) {
                openLeaves = 'open';
            } else {
                openLeaves = 'closed';    
            }
            var passcache = sats[i].getPassCache();
            row = {
                satellite: sats[i].getName(),
                orbits: '',
                _parentId:1,
                id:i+2,
                'state': openLeaves,
                calctime: lastCalcTime,
                isSat: true,
                catalogNumber: sats[i].getCatalogNumber() 
            };
            rows.push(row);
           
            rows.push({
                satellite: 'Last Calc Time',
                _parentId:i+2,
                id:i+900,
                calctime: lastCalcTime,
                iconCls: 'icon-sum'               
            });
            rows.push({
                satellite: 'Pass Cache',
                _parentId:i+2,
                id:i+200,
                orbits: passcache.length            
            });            
            
            var fullOrbit = sats[i].getOrbitData();
            
            if (fullOrbit.points.length === 0) {
                row = {
                    satellite: 'Full Orbit',
                    orbits: '',
                    orbitno: '',
                    calctime: 'N/A',
                    points: 0,
                    aos: '',
                    los: '',
                    _parentId:i+200,
                    id:id++,
                    iconCls: 'icon-info'
                };                
            } else {
                row = {
                    satellite: 'Full Orbit',
                    orbits: '',
                    orbitno: '',
                    calctime: fullOrbit.calcTime,
                    points: fullOrbit.points.length,
                    aos: '',
                    los: '',
                    _parentId:i+200,
                    id:id++,
                    iconCls: 'icon-info',
                    type: 'fullorbit',
                    catalogNumber: sats[i].getCatalogNumber()                    
                };
            }
            rows.push(row);
             
            var passes = [];  
            for (var j=0; j < passcache.length; j++) {
                row = {
                    satellite: 'Orbit ' + passcache[j].orbitNumber,
                    orbits: '',
                    orbitno: passcache[j].orbitNumber,
                    calctime: passcache[j].calcTime,
                    points: passcache[j].pass.length,
                    aos: AGUTIL.shortdate(passcache[j].aosTime),
                    los: AGUTIL.shortdate(passcache[j].losTime),
                    _parentId:i+200,
                    id:id++,
                    iconCls: 'icon-info',
                    type: 'orbit',
                    catalogNumber: sats[i].getCatalogNumber()                                            
                };  
                rows.push(row);                              
            }
            var todaysPasses = sats[i].getTodaysPasses();
            var total = 'N/A';
            if (todaysPasses !== null) {
                total = todaysPasses.length;
            }
            rows.push({
                satellite: 'Todays Passes',
                _parentId:i+2,
                id:i+400,
                orbits: total                
            });
            todaysPasses = sats[i].getTodaysPasses();
          //  debugger;
            if (todaysPasses !== null) {
                for (var k=0; k < todaysPasses.length; k++) {
                    row = {
                        satellite: 'Orbit ' + todaysPasses[k].orbitNumber,
                        orbits: '',
                        orbitno: todaysPasses[k].orbitNumber,
                        calctime: todaysPasses[k].calcTime,
                        points: 0,
                        aos: AGUTIL.shortdate(todaysPasses[k].dateTimeStart),
                        los: AGUTIL.shortdate(todaysPasses[k].dateTimeEnd),
                        _parentId:i+400,
                        id: id++,
                        iconCls: 'icon-info',
                        type: 'orbit',
                        catalogNumber: sats[i].getCatalogNumber()                                                 
                    };  
                    rows.push(row);                       
                }      
            } else {
                rows.push({
                    satellite: 'None Available Yet',
                    _parentId:i+400,
                    id: id++,
                    iconCls: 'icon-info'
                });                
            }
        }
        data.rows = rows;
        jQuery('#debuggrid').treegrid('loadData',data);
        jQuery('#debuggrid').treegrid({
            onDblClickRow: function(node){
                if (typeof node.type !== 'undefined') {
                    switch(node.type) {
                        case 'fullorbit':
                            var sat = AGSatTrack.getSatelliteByName(node.catalogNumber);        
                            var orbitData = sat.getOrbitData();                        
                            showOrbitWindow(sat, '', orbitData.points);
                            break;
                            
                        case 'orbit':
                            var sat = AGSatTrack.getSatelliteByName(node.catalogNumber);
                            var passcache = sat.getPassCache();
                            for (var i=0; i < passcache.length; i++) {
                                if (node.orbitno === passcache[i].orbitNumber) {
                                    var orbitData = passcache[i].pass;                        
                                    showOrbitWindow(sat, node.orbitno, orbitData);
                                    break;
                                }
                            }
                            break;                            
                    }
                }
            }
        });        
    }
    
    function showOrbitWindow(sat, orbitNumner, orbitData) {
        var windowElement;
        var gridElement;
        var data = [];
                
        jQuery('#orbitwindow').remove();
        windowElement = jQuery('<div/>', {
            'id' : 'orbitwindow'
        }).appendTo(document.body);
        
        gridElement = jQuery('<div/>', {
            'id' : 'orbitGrid'
        }).appendTo(windowElement);
                
        jQuery('#orbitwindow').window({  
            width:600,  
            height:400,
            title: 'Raw Orbit Data For ' + sat.getName() + '. Orbit ' + orbitNumner,  
            modal:true  
        }); 
        
        jQuery('#orbitGrid').datagrid({  
            columns:[[  
                {field:'orbitnumber',title:'Orbit Number',width:100},  
                {field:'azimuth',title:'Azimuth',width:70},  
                {field:'elevation',title:'Elevation',width:70},  
                {field:'x',title:'X',width:90},  
                {field:'y',title:'Y',width:90},  
                {field:'z',title:'Z',width:90}  
            ]]  
        });
       
        for (var i=0; i < orbitData.length; i++) {
            data.push({
                orbitnumber: orbitData[i].orbitNumber,
                azimuth: orbitData[i].az.toFixed(2),
                elevation: orbitData[i].el.toFixed(2),
                x: orbitData[i].x.toFixed(2),
                y: orbitData[i].y.toFixed(2),
                z: orbitData[i].z.toFixed(2)
            });            
        }
        jQuery('#orbitGrid').datagrid('loadData',data);
        
    }
                  
    return {
        startRender : function() {
            resize();
            buildDebugGrid();
            _render = true;
        },
        
        stopRender : function() {
            _render = false;            
        },
        
        init : function() {
            jQuery('#debuggrid').treegrid({
                onClickRow : function(row) {
                    if (typeof row.isSat !== 'undefined' && row.isSat) {
                        _selectedSat = row.catalogNumber;
                        jQuery('#debug-clear-cache').enable();    
                    } else {
                        _selectedSat = null;
                        jQuery('#debug-clear-cache').disable();    
                    }
                }
            });
                
        },
        
        resizeView : function(width, height) {
            resize(width, height);     
        }        
    };
};