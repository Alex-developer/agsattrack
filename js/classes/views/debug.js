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
var AGDEBUG = function() {
    'use strict';
    
    var _render = false;

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
                    
    var a = '{"total":7,"rows":[{"id":1,"name":"All Tasks","begin":"3/4/2010","end":"3/20/2010","progress":60,"iconCls":"icon-ok"},{"id":2,"name":"Designing","begin":"3/4/2010","end":"3/10/2010","progress":100,"_parentId":1,"state":"closed"},{"id":21,"name":"Database","persons":2,"begin":"3/4/2010","end":"3/6/2010","progress":100,"_parentId":2},{"id":22,"name":"UML","persons":1,"begin":"3/7/2010","end":"3/8/2010","progress":100,"_parentId":2},{"id":23,"name":"Export Document","persons":1,"begin":"3/9/2010","end":"3/10/2010","progress":100,"_parentId":2},{"id":3,"name":"Coding","persons":2,"begin":"3/11/2010","end":"3/18/2010","progress":80},{"id":4,"name":"Testing","persons":1,"begin":"3/19/2010","end":"3/20/2010","progress":20}],"footer":[{"name":"Total Persons:","persons":7,"iconCls":"icon-sum"}]}';
      
    var b = JSON.parse(a);
   // debugger;                           
   
    function buildDebugGrid() {       
        var row = {};
        var data = {};
        var id = 1000;
        var rows = [{satellite: 'Satellites', id:1}];
        var sats = AGSatTrack.getSatellites();
        for (var i=0; i < sats.length; i++) {
            var passcache = sats[i].getPassCache();
            row = {
                satellite: sats[i].getName(),
                orbits: '',
                _parentId:1,
                id:i+2
            };
            rows.push(row);
            rows.push({
                satellite: 'Pass Cache',
                _parentId:i+2,
                id:i+200,
                orbits: passcache.length               
            });
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
                    id:id++
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
            var todaysPasses = sats[i].getTodaysPasses();
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
                        id: id++
                    };  
                    rows.push(row);                       
                }      
            } else {
                rows.push({
                    satellite: 'None Available Yet',
                    _parentId:i+400,
                    id: id++               
                });                
            }
        }
        data.rows = rows
        jQuery('#debuggrid').treegrid('loadData',data);
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
            
        },
        
        resizeView : function(width, height) {
            resize(width, height);     
        }        
    }
}